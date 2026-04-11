import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    // Cargamos los productos al montar el componente para mostrar los destacados
    useEffect(() => {
        const fetchProducts = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            const data = await resp.json();
            if (resp.ok) dispatch({ type: "set_products", payload: data });
        };
        fetchProducts();
    }, []);

    return (
        <div>
            {/* 1. Sección hero principal */}
            <div className="bg-dark text-white text-center py-5">
                <div className="container py-4">
                    <h1 className="display-4 fw-bold">⚡ GadgetStore</h1>
                    <p className="lead text-secondary mb-4">
                        Los mejores gadgets y tecnología al mejor precio
                    </p>
                    <Link to="/catalog" className="btn btn-primary btn-lg px-5">
                        Ver catálogo →
                    </Link>
                </div>
            </div>

            <div className="container my-5">

                {/* 2. Productos destacados - solo se muestran si hay productos cargados */}
                {store.products.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-center mb-4">Productos destacados</h3>
                        <div className="row">
                            {/* Mostramos solo los primeros 3 productos */}
                            {store.products.slice(0, 3).map(product => (
                                <div className="col-md-4 mb-4" key={product.id}>
                                    <div className="card h-100">
                                        <img
                                            src={product.image_url || "https://via.placeholder.com/300x200"}
                                            className="card-img-top" alt={product.name}
                                            style={{ height: "200px", objectFit: "cover" }} />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="fw-bold text-primary mt-auto">${product.price}</p>
                                            <Link to={`/products/${product.id}`}
                                                className="btn btn-outline-primary mt-2">
                                                Ver detalle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <Link to="/catalog" className="btn btn-primary px-5">
                                Ver todos los productos
                            </Link>
                        </div>
                    </div>
                )}

                {/* 3. Sección de características */}
                <div className="row text-center g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <div style={{ fontSize: "48px" }}>🚀</div>
                            <h5 className="mt-3">Envío rápido</h5>
                            <p className="text-muted">Recibe tu pedido en 24-48 horas</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <div style={{ fontSize: "48px" }}>🔒</div>
                            <h5 className="mt-3">Pago seguro</h5>
                            <p className="text-muted">Transacciones protegidas con Stripe</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <div style={{ fontSize: "48px" }}>🛡️</div>
                            <h5 className="mt-3">Garantía incluida</h5>
                            <p className="text-muted">12 meses de garantía en todos los productos</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};