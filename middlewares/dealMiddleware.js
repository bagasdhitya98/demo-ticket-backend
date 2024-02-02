require("dotenv").config();
const axios = require("axios");

const apiUrl = "https://api.hubapi.com/crm/v3/objects/deals";
const accessToken = process.env.ACCESS_KEY;

async function getDeals(req, res, next) {
  try {
    const { limit, archived } = req.query;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: limit || 10,
        archived: archived || false,
      },
    });

    res.locals.deals = response.data;
    res.status(200).json({
      success: true,
      data: res.locals.deals,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        title: "Error fetching deals from HubSpot API",
        error_message: error,
      },
    });
  }
}

async function getDealById(req, res, next) {
  try {
    const { archived, dealId } = req.params;

    if (!dealId) {
      return res.status(400).json({
        error: {
          title: "Parameter dealId not found",
          error_message: "dealId parameter is required.",
        },
      });
    }

    const endpoint = `${apiUrl}/${dealId}?archived=${archived || "false"}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.locals.dealById = response.data;
    res.status(200).json({
      success: true,
      data: res.locals.dealById,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        title: "Error fetching deal from HubSpot API",
        error_message: error,
      },
    });
  }
}

async function createDeal(req, res, next) {
  try {
    const dealData = req.body;
    if (!dealData || !dealData.associations || !dealData.properties) {
      return res
        .status(400)
        .json({ error: "Invalid deal data in the request body." });
    }

    const response = await axios.post(
      apiUrl,
      { dealData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.locals.createdDeal = response.data;
    res.status(201).json({
      success: true,
      data: res.locals.createdDeal,
    });
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({
          error: {
            title: "Resource not found on the server.",
            error_message: error,
          },
        });
      }
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }
    res.status(500).json({
      error: {
        title: "Error creating deal on HubSpot API",
        error_message: error,
      },
    });
  }
}

async function deleteDeal(req, res, next) {
  try {
    const { dealId } = req.params;

    if (!dealId) {
      return res.status(400).json({ error: "Parameter dealId not found." });
    }

    const endpoint = `${apiUrl}/${dealId}`;

    const existingDeal = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!existingDeal.data) {
      return res.status(404).json({ error: "Deal not found." });
    }

    await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.locals.success = true;
    res.locals.message = "Deal successfully deleted.";

    res.status(200).json({
      success: res.locals.success,
      message: res.locals.message,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting deal from HubSpot API" });
  }
}

module.exports = { getDeals, getDealById, createDeal, deleteDeal };
