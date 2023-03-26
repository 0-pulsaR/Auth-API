const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordResetToken = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 1800 }
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetToken);