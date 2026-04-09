import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ProductDetail = () => {
    const { id } = useParams(); // Obtenemos el id del producto desde la URL
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    // Obtenemos el detalle del producto por id cuando el componente se monta o el id cambia
    useEffect(() => {
        const fetchProduct = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
            const data = await resp.json();
            if (resp.ok) setProduct(data);
        };
        fetchProduct();
    }, [id]);

    // Añadimos el producto al carrito con la cantidad seleccionada
    const handleAddToCart = async () => {
        if (!store.token) { navigate("/login"); return; }
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify({ product_id: product.id, quantity })
        });
        if (resp.ok) {
            // Recargamos el carrito desde la API
            const cartResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            const cartData = await cartResp.json();
            dispatch({ type: "set_cart", payload: cartData });
            setMessage("✅ Agregado al carrito");
            // Borramos el mensaje después de 3 segundos
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Mostramos spinner mientras el producto está cargando
    if (!product) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" />
        </div>
    );

    return (
        <div className="container mt-5">
            {/* Botón para volver a la página anterior */}
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>← Volver</button>
            <div className="row">
                <div className="col-md-6">
                    <img src={product.image_url || "https://via.placeholder.com/500"}
                        alt={product.name} className="img-fluid rounded shadow"
                        style={{ width: "100%", height: "400px", objectFit: "cover" }} />
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
                        {product.category}
                    </span>
                    <h2>{product.name}</h2>
                    <p className="text-muted">{product.description}</p>
                    <h3 className="text-primary my-3">${product.price}</h3>
                    <p className={product.stock > 0 ? "text-success" : "text-danger"}>
                        {product.stock > 0 ? `✅ En stock (${product.stock} disponibles)` : "❌ Sin stock"}
                    </p>

                    {/* Selector de cantidad */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <label className="fw-bold">Cantidad:</label>
                        <div className="d-flex align-items-center gap-2">
                            {/* No permitimos bajar de 1 */}
                            <button className="btn btn-outline-secondary btn-sm"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                            <span className="px-3">{quantity}</span>
                            {/* No permitimos subir del stock disponible */}
                            <button className="btn btn-outline-secondary btn-sm"
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                        </div>
                    </div>

                    {message && <div className="alert alert-info py-2">{message}</div>}

                    <button className="btn btn-primary btn-lg w-100"
                        onClick={handleAddToCart} disabled={product.stock === 0}>
                        🛒 Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
};