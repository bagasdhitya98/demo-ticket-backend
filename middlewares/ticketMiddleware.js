require("dotenv").config();
const axios = require("axios");

const apiUrl = "https://api.hubapi.com/crm/v3/objects/tickets";
const limit = 10;
const archived = false;
const accessToken = process.env.ACCESS_KEY;

async function getAllTickets(req, res, next) {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit,
        archived,
      },
    });

    res.locals.tickets = response.data;
    res.status(200).json({
      success: true,
      data: res.locals.tickets,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets from API" });
  }
}

async function getTicketById(req, res, next) {
  try {
    const { archived, ticketId } = req.params;
    if (!ticketId) {
      return res.status(400).json({ error: "Parameter ticketId not found." });
    }

    const endpoint = `${apiUrl}/${ticketId}?archived=${archived || "false"}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    res.locals.ticketById = response.data;
    res.status(200).json({
      success: true,
      data: res.locals.ticketById,
    });
    next();
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets from API" });
  }
}

module.exports = { getAllTickets, getTicketById };
