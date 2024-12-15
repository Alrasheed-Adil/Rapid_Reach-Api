const mongoose = require("mongoose");

const smtpSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: { type: String, required: true },
    port: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // App Password or plain password
  },
  { timestamps: true }
);

module.exports = mongoose.model("SMTP", smtpSchema);
