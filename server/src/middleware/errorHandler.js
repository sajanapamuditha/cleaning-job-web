// Global Express error handler
// Must have 4 parameters for Express to recognise it as error middleware
module.exports = function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  // Default 500
  res.status(500).json({ error: "Internal server error" });
};
