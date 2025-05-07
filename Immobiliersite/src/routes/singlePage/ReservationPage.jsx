import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar"; // npm install react-calendar
import axiosInstance from "../../axiosInstance/axios";
import { useNavigate, useParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css"; // Styles du calendrier
import "./reservationPage.scss"; // Vos styles personnalisés
import { AuthContext } from "../../context/AuthContext";

// Fonction utilitaire pour comparer deux dates (même jour)
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function ReservationPage() {
  const { currentUser } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const { postId } = useParams(); // La route est /reserve/:postId

  // Récupérer les réservations pour le post dès le chargement
  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await axiosInstance.get(`/reserve?postId=${postId}`);
        setReservations(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    }
    fetchReservations();
  }, [postId]);

  const handleReservation = async () => {
    // Vérifier si la date sélectionnée est déjà réservée
    const alreadyReserved = reservations.some((reservation) =>
      isSameDay(new Date(reservation.reservedDate), date)
    );
    if (alreadyReserved) {
      alert("Cette date est déjà réservée. Veuillez choisir une autre date.");
      return;
    }
    try {
      const response = await axiosInstance.post("/reserve", {
        postId,         // Doit être une chaîne hexadécimale valide de 24 caractères.
        reservedDate: date,
      });
      alert("Réservation effectuée avec succès !");
      setReservations([...reservations, response.data]);
      window.location.reload(); // Pour rafraîchir l'affichage du calendrier
    } catch (error) {
      console.error(error);
      alert("Échec de la création de la réservation");
    }
  };

  // Fonction pour lancer le paiement via Stripe pour une réservation donnée
  const handlePayment = (reservationId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // Navigation vers PaymentSuccess pour lancer le paiement
    navigate(`/checkout?reservationId=${reservationId}`);
  };

  return (
    <div className="reservation-page">
      <div className="reservation-wrapper">
        <h1>Choisissez une date de réservation</h1>
        <Calendar 
          onChange={setDate} 
          value={date} 
          className="custom-calendar"
          // Ajout de la classe "reserved" aux jours déjà réservés
          tileClassName={({ date: calendarDate, view }) => {
            if (view === "month") {
              if (
                reservations.some((reservation) =>
                  isSameDay(new Date(reservation.reservedDate), calendarDate)
                )
              ) {
                return "reserved";
              }
            }
            return null;
          }}
        />
        <button onClick={handleReservation}>Réserver</button>

        <br/>
        <h2>Réservations pour ce post</h2>
        <br/>
        {reservations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Post</th>
                <th>Acheter</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{new Date(reservation.reservedDate).toLocaleDateString()}</td>
                  <td>{reservation.post.title}</td>
                  <td>
                    {reservation.paid ? (
                      <span>Payé</span>
                    ) : (
                      <button onClick={() => handlePayment(reservation.id)}>
                        Acheter (50 DT)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Vous n avez pas encore de réservation.</p>
        )}
      </div>
    </div>
  );
}

export default ReservationPage;
