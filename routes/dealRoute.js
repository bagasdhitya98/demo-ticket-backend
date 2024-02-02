const express = require("express");
const {
  getDeals,
  getDealById,
  createDeal,
  deleteDeal,
} = require("../middlewares/dealMiddleware");

const router = express.Router();

router.get("/deals", getDeals, (req, res) => {
  res.status(200).json(res.locals.deals);
});

router.get("/deals/:dealId", getDealById, (req, res) => {
  res.status(200).json(res.locals.dealById);
});

router.post("/deals", createDeal, (req, res) => {
  res.status(200).json(res.locals.createdDeal);
});

router.delete("/deals/:dealId", deleteDeal, (req, res) => {
  if (res.locals.success) {
    res.status(204).json({
      success: res.locals.success,
      message: res.locals.message,
    });
  }
});

module.exports = router;
