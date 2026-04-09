"""
Este módulo contiene todos los endpoints de la API del e-commerce
"""
import os
import stripe
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Product, CartItem



api = Blueprint('api', __name__)

# Configuramos Stripe con la clave secreta del entorno
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Permitimos peticiones CORS a esta API


# ── HEALTH CHECK ──────────────────────────────────────────────────────────────
@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "API funcionando ✅"}), 200


# ── AUTENTICACIÓN ─────────────────────────────────────────────────────────────
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validamos que los campos obligatorios estén presentes
    if not data.get("email") or not data.get("password") or not data.get("full_name"):
        return jsonify({"error": "Email, contraseña y nombre son obligatorios"}), 400

    # Validamos la longitud mínima de la contraseña
    if len(data["password"]) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    # Verificamos que el email no esté ya registrado
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya está registrado"}), 409

    # Creamos el nuevo usuario con la contraseña hasheada
    user = User(
        email=data["email"],
        password=generate_password_hash(data["password"]),
        full_name=data["full_name"],
        phone=data.get("phone", ""),
        address=data.get("address", "")
    )
    db.session.add(user)
    db.session.commit()

    # Generamos el token JWT para que el usuario quede logueado automáticamente
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validamos que los campos obligatorios estén presentes
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    # Buscamos el usuario por email
    user = User.query.filter_by(email=data["email"]).first()

    # Verificamos que el usuario exista y la contraseña sea correcta
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    # Generamos el token JWT
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


# ── PERFIL DE USUARIO ─────────────────────────────────────────────────────────
@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Obtenemos el id del usuario desde el token JWT
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    # Actualizamos solo los campos que vienen en el body
    user.full_name = data.get("full_name", user.full_name)
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)

    # Solo actualizamos la contraseña si viene en el body
    if data.get("password"):
        if len(data["password"]) < 6:
            return jsonify({"error": "Mínimo 6 caracteres"}), 400
        user.password = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/user/profile', methods=['DELETE'])
@jwt_required()
def delete_account():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Eliminamos el usuario y todos sus cart_items en cascada
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Cuenta eliminada correctamente"}), 200


# ── PRODUCTOS ─────────────────────────────────────────────────────────────────
@api.route('/products', methods=['GET'])
def get_products():
    # Devolvemos solo los productos activos
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([p.serialize() for p in products]), 200


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200


@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()

    # Validamos los campos obligatorios
    if not data.get("name") or not data.get("price"):
        return jsonify({"error": "Nombre y precio son obligatorios"}), 400

    product = Product(
        name=data["name"],
        description=data.get("description", ""),
        price=data["price"],
        stock=data.get("stock", 0),
        image_url=data.get("image_url", ""),
        category=data.get("category", "")
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.serialize()), 201


@api.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    data = request.get_json()

    # Actualizamos solo los campos que vienen en el body
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.image_url = data.get("image_url", product.image_url)
    product.category = data.get("category", product.category)

    db.session.commit()
    return jsonify(product.serialize()), 200


@api.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404

    # Soft delete: marcamos como inactivo en vez de borrar de la BD
    product.is_active = False
    db.session.commit()
    return jsonify({"message": "Producto eliminado correctamente"}), 200


# ── CARRITO ───────────────────────────────────────────────────────────────────
@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200


@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get("product_id"):
        return jsonify({"error": "product_id es obligatorio"}), 400

    product = Product.query.get(data["product_id"])
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    if product.stock < 1:
        return jsonify({"error": "Producto sin stock"}), 400

    # Si el producto ya está en el carrito sumamos la cantidad
    existing = CartItem.query.filter_by(
        user_id=user_id,
        product_id=data["product_id"]
    ).first()

    if existing:
        existing.quantity += data.get("quantity", 1)
        db.session.commit()
        return jsonify(existing.serialize()), 200

    # Si no existe lo creamos
    item = CartItem(
        user_id=user_id,
        product_id=data["product_id"],
        quantity=data.get("quantity", 1)
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), 201


@api.route('/cart/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "Item no encontrado"}), 404

    quantity = request.get_json().get("quantity", item.quantity)
    if quantity < 1:
        return jsonify({"error": "La cantidad mínima es 1"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify(item.serialize()), 200


@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "Item no encontrado"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item eliminado del carrito"}), 200


@api.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    # Eliminamos todos los items del carrito del usuario
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Carrito vaciado"}), 200


# ── STRIPE ────────────────────────────────────────────────────────────────────
@api.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()

    if not items:
        return jsonify({"error": "El carrito está vacío"}), 400

    # Calculamos el total del carrito
    total = sum(item.quantity * item.product.price for item in items)

    try:
        # Stripe maneja los montos en centavos
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency="usd",
            metadata={"user_id": user_id}
        )
        return jsonify({
            "clientSecret": intent.client_secret,
            "amount": total
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/payment-success', methods=['POST'])
@jwt_required()
def payment_success():
    user_id = get_jwt_identity()
    # Vaciamos el carrito después del pago exitoso
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Pago exitoso, carrito vaciado"}), 200