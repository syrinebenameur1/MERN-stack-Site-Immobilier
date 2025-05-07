import Stripe from 'stripe';
import prisma from "../lib/prisma.js"; // Assurez-vous que prisma est bien configuré

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });


export const createCheckoutSession = async (req, res) => {
  const { reservationId } = req.body;
  try {
    // Récupérer la réservation dans la base de données
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { post: true },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    // Créer une session de paiement Stripe avec une devise supportée (ici "usd")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd', // Utilisation de "usd" à la place de "tnd"
          product_data: {
            name: `Réservation pour ${reservation.post.title}`,
          },
          unit_amount: 5000, // Correspond à 50 USD en centimes
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: {
        reservationId: reservationId
      },
      success_url: `${process.env.CLIENT_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/reserve/${reservation.post.id}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe", error);
    res.status(500).json({ message: "Erreur lors de la création de la session de paiement" });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reservation = await prisma.reservation.update({
      where: { id: session.metadata.reservationId },
      data: { paid: true }, // Remplacer isPaid par paid
      include: { post: true }
    });
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error handling payment success", error);
    res.status(500).json({ message: "Error retrieving payment details" });
  }
};

