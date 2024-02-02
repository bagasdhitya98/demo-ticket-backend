const express = require("express");
const {
  getAllTickets,
  getTicketById,
} = require("../middlewares/ticketMiddleware");

const router = express.Router();

router.get("/tickets", getAllTickets, (req, res) => {
  res.status(200).json(res.locals.tickets);
});

router.get("/tickets/:ticketId", getTicketById, (req, res) => {
  res.status(200).json(res.locals.ticketById);
});

module.exports = router;
