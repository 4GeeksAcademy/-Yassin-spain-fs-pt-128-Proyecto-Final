import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Esperamos a que Stripe.js haya cargado completamente
        if (!stripe || !elements) return;

        setLoading(true);
        setError("");

        // Confirmamos el pago con Stripe
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/payment-success` },
            redirect: "if_required" // Solo redirige si el método de pago lo requiere
        });

        if (stripeError) {
            // Mostramos el error de Stripe al usuario
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        // Notificamos al backend para vaciar el carrito después del pago exitoso
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment-success`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${store.token}` }
        });

        // Vaciamos el carrito en el store global
        dispatch({ type: "clear_cart" });
        setLoading(false);
        navigate("/payment-success");
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Componente de pago preconstruido por Stripe */}
            <PaymentElement />
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <button className="btn btn-success w-100 mt-4" disabled={!stripe || loading}>
                {loading ? "Procesando..." : `Pagar $${amount?.toFixed(2)}`}
            </button>
        </form>
    );
};