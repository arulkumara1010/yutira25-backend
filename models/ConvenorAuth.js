import { Schema, model } from "mongoose";

const schema = new Schema({
  eventId: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  isTeam: {
    type: Boolean,
    default: false,
  },
  lastVisited: {
    type: Date,
    default: new Date(),
  },
});

export default model("ConvenorAuth", schema);
