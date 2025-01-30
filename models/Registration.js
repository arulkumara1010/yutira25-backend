import { Schema, model } from "mongoose";

const RegistrationSchema = new Schema({
  eventId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  attendedAt: {
    type: Date,
    default: null,
  },
});

export default model("Registration", RegistrationSchema, "yutira-2025-reg");
