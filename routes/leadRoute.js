const express = require("express");

//lead router
const router = express.Router();

//import routes functions for lead
const {
  addNewLead,
  findLeadsWithFilters,
  updateLeadById,
//   leadFindById,
  groupedLeadBy,
  deleteLeadById,
  addComment,
  getAllComment,
} = require("../controller/leadController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

//lead route
router.post("/", authMiddleware, addNewLead);
router.get("/", authMiddleware, findLeadsWithFilters);
router.patch("/:leadId", authMiddleware, updateLeadById);
// router.get("/:leadId", authMiddleware, leadFindById);
router.get("/grouped", authMiddleware, groupedLeadBy);

router.delete("/:leadId", authMiddleware, deleteLeadById);

//comment route
router.post("/comments", authMiddleware, addComment);
router.get("/comments", authMiddleware, getAllComment);

router.post("/:leadId/comments", authMiddleware, addComment);
router.get("/:leadId/comments", authMiddleware, getAllComment);

module.exports = router;
