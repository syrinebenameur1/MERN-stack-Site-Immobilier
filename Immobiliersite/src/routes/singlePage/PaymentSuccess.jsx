import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance/axios";
import "./stripe.scss";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const reservationId = queryParams.get("reservationId");

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si aucun session_id n'est présent mais qu'on a un reservationId,
    // on initie la création de la session de paiement
    if (!sessionId && reservationId) {
      const initiatePayment = async () => {
        try {
          setLoading(true);
          // Appel à l'API pour créer une session Stripe en passant reservationId
          const res = await axiosInstance.post("/payment/create-checkout-session", { reservationId });
          // Redirection vers l'URL de checkout retournée par Stripe
          window.location.href = res.data.url;
        } catch (error) {
          console.error("Erreur lors de la création de la session de paiement", error);
        }
      };
      initiatePayment();
    }
    // Si un session_id est présent, on récupère les détails du paiement
    else if (sessionId) {
      const fetchPaymentData = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/payment/success/${sessionId}`);
          setReservation(res.data);
        } catch (error) {
          console.error("Error fetching payment details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentData();
    }
  }, [sessionId, reservationId]);

  if (loading) {
    return <div>Redirection en cours...</div>;
  }

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <div className="info">
            <div className="top">
              <h1>Paiement Réussi 🎉</h1>
              {reservation && (
                <div className="payment-details">
                  <div className="feature">
                    <div className="featureText">
                      <span>Date de réservation</span>
                      <p>{new Date(reservation.reservedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="featureText">
                      <span>Montant payé</span>
                      <p>50 DT</p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="featureText">
                      <span>Propriété</span>
                      <p>{reservation.post.title}</p>
                    </div>
                  </div>
                </div>
              )}
              <Link to="/" className="back-home">
                Retour à l accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
