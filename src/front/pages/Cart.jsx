import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Sincronizamos el carrito con el backend al montar el componente
    useEffect(() => {
        if (!store.token) { navigate("/login"); return; }
        const fetchCart = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            const data = await resp.json();
            if (resp.ok) dispatch({ type: "set_cart", payload: data });
        };
        fetchCart();
    }, []);

    // Actualizamos la cantidad de un item en el backend y recargamos el carrito
    const updateItem = async (item_id, quantity) => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${item_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify({ quantity })
        });
        // Recargamos el carrito después de actualizar
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            headers: { "Authorization": `Bearer ${store.token}` }
        });
        const data = await resp.json();
        if (resp.ok) dispatch({ type: "set_cart", payload: data });
    };

    // Eliminamos un item del carrito
    const removeItem = async (item_id) => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${item_id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${store.token}` }
        });
        // Actualizamos el store localmente sin volver a pedir a la API
        dispatch({ type: "set_cart", payload: store.cart.filter(i => i.id !== item_id) });
    };

    // Vaciamos todo el carrito
    const clearCart = async () => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${store.token}` }
        });
        dispatch({ type: "clear_cart" });
    };

    // Calculamos el precio total de todos los items del carrito
    const total = store.cart.reduce((sum, item) => sum + item.subtotal, 0);

    // Mostramos estado vacío si no hay items en el carrito
    if (store.cart.length === 0) return (
        <div className="container mt-5 text-center">
            <h2>Tu carrito está vacío</h2>
            <Link to="/catalog" className="btn btn-primary mt-3">Ver productos</Link>
        </div>
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🛒 Mi carrito</h2>
            <div className="row">
                {/* Lista de items del carrito */}
                <div className="col-md-8">
                    {store.cart.map(item => (
                        <div className="card mb-3" key={item.id}>
                            <div className="card-body d-flex align-items-center gap-3">
                                <img src={item.product.image_url || "https://via.placeholder.com/80"}
                                    alt={item.product.name}
                                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                                <div className="flex-grow-1">
                                    <h6 className="mb-1">{item.product.name}</h6>
                                    <p className="mb-1 text-muted">${item.product.price} c/u</p>
                                    {/* Controles de cantidad */}
                                    <div className="d-flex align-items-center gap-2">
                                        <button className="btn btn-sm btn-outline-secondary"
                                            onClick={() => updateItem(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}>−</button>
                                        <span>{item.quantity}</span>
                                        <button className="btn btn-sm btn-outline-secondary"
                                            onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <p className="fw-bold">${item.subtotal.toFixed(2)}</p>
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen del pedido */}
                <div className="col-md-4">
                    <div className="card p-4">
                        <h5>Resumen</h5>
                        <hr />
                        {store.cart.map(item => (
                            <div className="d-flex justify-content-between" key={item.id}>
                                <small>{item.product.name} x{item.quantity}</small>
                                <small>${item.subtotal.toFixed(2)}</small>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-success w-100 mt-3"
                            onClick={() => navigate("/checkout")}>
                            Proceder al pago
                        </button>
                        <button className="btn btn-outline-danger w-100 mt-2" onClick={clearCart}>
                            Vaciar carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};