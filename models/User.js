const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        loginAttempts: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);