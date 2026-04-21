const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date
    }
}, {timestamps: true});

module.exports = mongoose.model("Project", projectSchema);