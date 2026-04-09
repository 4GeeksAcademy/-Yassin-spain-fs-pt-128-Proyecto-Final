import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "", phone: "", address: "", password: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Redirigimos al login si el usuario no está autenticado
        if (!store.token) { navigate("/login"); return; }

        // Obtenemos el perfil actual del usuario desde la API
        const fetchProfile = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            const data = await resp.json();
            if (resp.ok) {
                dispatch({ type: "set_user", payload: data });
                // Precargamos el formulario con los datos actuales del usuario
                setFormData({
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    password: ""
                });
            }
        };
        fetchProfile();
    }, []);

    // Manejador genérico para todos los inputs del formulario
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Actualizamos el perfil del usuario al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await resp.json();
        if (resp.ok) {
            dispatch({ type: "set_user", payload: data });
            setMessage("✅ Perfil actualizado");
        } else {
            setMessage("❌ Error al actualizar");
        }
    };

    // Eliminamos la cuenta y redirigimos al inicio
    const handleDelete = async () => {
        if (!window.confirm("¿Eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${store.token}` }
        });
        if (resp.ok) {
            localStorage.removeItem("token");
            dispatch({ type: "logout" });
            navigate("/");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "540px" }}>
            <h2 className="mb-4">Mi perfil</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" name="full_name" className="form-control"
                        value={formData.full_name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" name="phone" className="form-control"
                        value={formData.phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="address" className="form-control"
                        value={formData.address} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    {/* Dejar vacío para no cambiar la contraseña actual */}
                    <label className="form-label">
                        Nueva contraseña <span className="text-muted">(dejar vacío para no cambiar)</span>
                    </label>
                    <input type="password" name="password" className="form-control"
                        value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Guardar cambios</button>
            </form>
            {/* Zona de peligro: eliminar cuenta */}
            <button className="btn btn-danger w-100" onClick={handleDelete}>Eliminar cuenta</button>
        </div>
    );
};