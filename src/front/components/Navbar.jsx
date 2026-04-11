import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Contamos el total de items en el carrito para el badge
    const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        // Eliminamos el token de localStorage y limpiamos el store global
        localStorage.removeItem("token");
        dispatch({ type: "logout" });
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand fw-bold" to="/">⚡ GadgetStore</Link>
            <button className="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navMenu">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navMenu">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/catalog">Catálogo</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto align-items-center gap-2">
                    {/* Icono del carrito con badge de cantidad */}
                    <li className="nav-item">
                        <Link className="nav-link position-relative" to="/cart">
                            🛒 Carrito 
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            )}a
                        </Link>
                    </li>
                    {/* Si esta autenticado mostramos perfil y cerrar sesion, si no login y registro */}
                    {store.token ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Mi perfil</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="btn btn-outline-light btn-sm" to="/login">Iniciar sesión</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-primary btn-sm" to="/register">Registrarse</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};