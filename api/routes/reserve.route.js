import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getReservations, addReservation, deleteReservation } from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/", verifyToken, getReservations);
router.post("/", verifyToken, addReservation);
router.delete("/:id", verifyToken, deleteReservation);

export default router;
