const mongoose = require("mongoose");

const projectSchema =
new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  
  deadline: {
    type: Date,
    required: true
  },

   assignedTo: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true
    },

    createdBy: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User"
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

 

  // 📅 DAY 23 FIELD

  fileId: {
    type: mongoose.Schema.Types.ObjectId
  }

},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "Project",
  projectSchema
);