import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CheckoutForm } from "../components/CheckoutForm";

// Inicializamos Stripe con la clave pública de las variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Checkout = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirigimos si no está autenticado o el carrito está vacío
        if (!store.token) { navigate("/login"); return; }
        if (store.cart.length === 0) { navigate("/cart"); return; }

        // Creamos un PaymentIntent en el backend y obtenemos el clientSecret
        const createIntent = async () => {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-payment-intent`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            const data = await resp.json();
            if (resp.ok) {
                setClientSecret(data.clientSecret);
                setAmount(data.amount);
            }
            setLoading(false);
        };
        createIntent();
    }, []);

    // Mostramos spinner mientras se crea el PaymentIntent
    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" />
            <p className="mt-3">Preparando el pago...</p>
        </div>
    );

    return (
        <div className="container mt-5" style={{ maxWidth: "560px" }}>
            <h2 className="mb-4">💳 Finalizar compra</h2>

            {/* Resumen del pedido antes de pagar */}
            <div className="card mb-4 p-3">
                <h6 className="mb-3">Resumen del pedido</h6>
                {store.cart.map(item => (
                    <div className="d-flex justify-content-between" key={item.id}>
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${amount.toFixed(2)}</span>
                </div>
            </div>

            {/* Formulario de Stripe - necesita el clientSecret para renderizarse */}
            {clientSecret && (
                <div className="card p-4">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm amount={amount} />
                    </Elements>
                </div>
            )}
        </div>
    );
};