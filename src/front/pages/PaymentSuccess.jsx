import { Link } from "react-router-dom";

export const PaymentSuccess = () => {
    return (
        <div className="container mt-5 text-center">
            {/* Icono de exito */}
            <div style={{ fontSize: "80px" }}>✅</div>
            <h2 className="mt-3">¡Pago exitoso!</h2>
            <p className="text-muted">Tu pedido ha sido procesado correctamente.</p>
            {/* Volver al cataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalogo */}
            <Link to="/catalog" className="btn btn-primary mt-3">Seguir comprando</Link>
        </div>
    );
};