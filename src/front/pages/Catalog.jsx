import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Catalog = () => {
    const { store, dispatch } = useGlobalReducer();

    // Obtenemos todos los productos activos de la API al montar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            const data = await resp.json();
            if (resp.ok) dispatch({ type: "set_products", payload: data });
        };
        fetchProducts();
    }, []);

    // Añadimos un producto al carrito y actualizamos el carrito desde la API
    const handleAddToCart = async (product_id) => {
        // Redirigimos al login si no está autenticado
        if (!store.token) { alert("Debes iniciar sesión para agregar productos"); return; }

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify({ product_id, quantity: 1 })
        });

        if (resp.ok) {
            // Recargamos el carrito desde la API para mantenerlo sincronizado con el backend
            const cartResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            const cartData = await cartResp.json();
            dispatch({ type: "set_cart", payload: cartData });
            alert("✅ Agregado al carrito");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Catálogo de productos</h2>
            {store.products.length === 0 ? (
                <p className="text-muted">No hay productos disponibles aún.</p>
            ) : (
                <div className="row">
                    {store.products.map(product => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div className="card h-100">
                                <img src={product.image_url || "https://via.placeholder.com/300x200"}
                                    className="card-img-top" alt={product.name}
                                    style={{ height: "200px", objectFit: "cover" }} />
                                <div className="card-body d-flex flex-column">
                                    <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
                                        {product.category}
                                    </span>
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-muted">{product.description.substring(0, 80)}...</p>
                                    <p className="fw-bold text-primary mt-auto">${product.price}</p>
                                    <Link to={`/products/${product.id}`} className="btn btn-outline-primary mt-2">
                                        Ver detalle
                                    </Link>
                                    <button className="btn btn-primary mt-2"
                                        onClick={() => handleAddToCart(product.id)}>
                                        🛒 Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};