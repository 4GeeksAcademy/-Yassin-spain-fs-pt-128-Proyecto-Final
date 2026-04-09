import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Estado local para los campos del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estado local para errores de validación y carga
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Validamos los campos antes de enviar el formulario
    const validate = () => {
        const newErrors = {};
        if (!email.includes("@")) newErrors.email = "Email inválido";
        if (!password) newErrors.password = "La contraseña es obligatoria";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Detenemos el envío si hay errores de validación
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        setLoading(false);

        if (resp.ok) {
            // Guardamos el token en localStorage para que persista al recargar la página
            localStorage.setItem("token", data.token);
            // Actualizamos el store global con el token y los datos del usuario
            dispatch({ type: "set_token", payload: data.token });
            dispatch({ type: "set_user", payload: data.user });
            navigate("/catalog");
        } else {
            setErrors({ general: data.error });
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "440px" }}>
            <h2 className="mb-4 text-center">Iniciar sesión</h2>

            {/* Error general devuelto por la API */}
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }} />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
                <p className="text-center mt-3">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};