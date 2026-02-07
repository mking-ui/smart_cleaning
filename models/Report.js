import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  reporterEmail: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
 
  description: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ["Low", "Normal", "High", "Critical"],
    default: "Normal"
  },
  jobType: {
    type: String,
    enum: [
      "Spillage",
      "Trash Overflow",
      "Dirty Restroom",
      "Sweeping Required",
      "Mopping Required",
      "Sanitization",
      "Others"
    ],
    default: "Spillage"
  },
  images: [
    {
      filename: String,
      url: String
    }
  ],
  status: {
    type: String,
    enum: ["Pending","Approved", "In Progress", "Resolved",  "Completed"],
    default: "Pending"
  },
  assignedCleaner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  proofImage: {
    filename: String,
    url: String
  },

  deadline: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true })

const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
