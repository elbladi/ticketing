import { NotFoundError } from "@bladtickets/common";
import express from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});
router.get("/api/nada", async (req, res) => {
  console.log("Do nothing but will fix the shit out of it");
});

export { router as ShowRouter };
