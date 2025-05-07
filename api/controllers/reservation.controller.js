import prisma from "../lib/prisma.js";

// Get all reservations for the logged-in user
export const getReservations = async (req, res) => {
  const userId = req.userId;
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: { post: true },
    });
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

// Create a new reservation
export const addReservation = async (req, res) => {
  const { postId, reservedDate } = req.body;
  const userId = req.userId; // Vient du middleware verifyToken
  try {
    const dateToReserve = new Date(reservedDate);

    // Vérifier si une réservation existe déjà pour ce post et cette date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        postId,
        reservedDate: dateToReserve,
      },
    });

    if (existingReservation) {
      return res.status(400).json({ message: "Cette date est déjà réservée." });
    }

    const newReservation = await prisma.reservation.create({
      data: {
        reservedDate: dateToReserve,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    res.status(200).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "cette date est déja reservé " });
  }
};


// Delete a reservation (only allowed if it belongs to the logged-in user)
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation || reservation.userId !== userId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
    await prisma.reservation.delete({ where: { id } });
    res.status(200).json({ message: "Reservation deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reservation" });
  }
};
