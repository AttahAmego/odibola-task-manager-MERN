const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "in-progress" 
  },
  priority: { 
    type: Number, 
    default: 1 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
});

module.exports = mongoose.model("Task", TaskSchema);

