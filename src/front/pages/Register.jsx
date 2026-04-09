import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Register = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Estado local para todos los campos del formulario agrupados en un objeto
    const [formData, setFormData] = useState({
        full_name: "", email: "", password: "", confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Validamos todos los campos antes de enviar
    const validate = () => {
        const newErrors = {};
        if (!formData.full_name.trim()) newErrors.full_name = "El nombre es obligatorio";
        if (!formData.email.includes("@")) newErrors.email = "Email inválido";
        if (formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
        return newErrors;
    };

    // Manejador genérico para todos los inputs usando el nombre del campo como clave
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await resp.json();
        setLoading(false);
        if (resp.ok) {
            // Guardamos el token en localStorage y actualizamos el store global
            localStorage.setItem("token", data.token);
            dispatch({ type: "set_token", payload: data.token });
            dispatch({ type: "set_user", payload: data.user });
            navigate("/catalog");
        } else {
            setErrors({ general: data.error });
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "480px" }}>
            <h2 className="mb-4 text-center">Crear cuenta</h2>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" name="full_name"
                        className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                        value={formData.full_name} onChange={handleChange} />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" name="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        value={formData.password} onChange={handleChange} />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar contraseña</label>
                    <input type="password" name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
                <p className="text-center mt-3">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};