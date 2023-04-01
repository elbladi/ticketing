import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@bladtickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req, res) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
});

router.get("/api/nada", (req, res) => {});

export { router as indexTicketRouter };
