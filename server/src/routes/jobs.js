const express = require("express");
const { body, validationResult } = require("express-validator");
const JobRequest = require("../models/JobRequest");

const router = express.Router();

const VALID_CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery"];
const VALID_STATUSES = ["Open", "In Progress", "Closed"];

// Helper: send validation errors
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
}

// ─── GET /api/jobs ─────────────────────────────────────────────────────────
// Supports optional ?category=Plumbing and ?status=Open filters
router.get("/", async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category && VALID_CATEGORIES.includes(category)) filter.category = category;
    if (status && VALID_STATUSES.includes(status)) filter.status = status;

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/jobs/:id ─────────────────────────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/jobs ────────────────────────────────────────────────────────
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty().withMessage("Title is required")
      .isLength({ max: 140 }).withMessage("Title must be 140 characters or fewer"),
    body("description")
      .trim()
      .notEmpty().withMessage("Description is required")
      .isLength({ max: 2000 }).withMessage("Description must be 2000 characters or fewer"),
    body("category")
      .optional({ checkFalsy: true })
      .isIn(VALID_CATEGORIES).withMessage("Invalid category"),
    body("location")
      .optional().trim().isLength({ max: 120 }).withMessage("Location too long"),
    body("contactName")
      .optional().trim().isLength({ max: 120 }).withMessage("Name too long"),
    body("contactEmail")
      .optional({ checkFalsy: true })
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
  ],
  async (req, res, next) => {
    const fail = handleValidation(req, res);
    if (fail) return;
    try {
      const job = await JobRequest.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || "",
        location: req.body.location || "",
        contactName: req.body.contactName || "",
        contactEmail: req.body.contactEmail || "",
      });
      res.status(201).json(job);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PATCH /api/jobs/:id ───────────────────────────────────────────────────
// Updates status only
router.patch(
  "/:id",
  [
    body("status")
      .isIn(VALID_STATUSES)
      .withMessage(`Status must be one of: ${VALID_STATUSES.join(", ")}`),
  ],
  async (req, res, next) => {
    const fail = handleValidation(req, res);
    if (fail) return;
    try {
      const job = await JobRequest.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/jobs/:id ──────────────────────────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
