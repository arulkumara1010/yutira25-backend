import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  one_line_desc: {
    type: String,
  },
  description: {
    type: String,
  },
  round_title_1: {
    type: String,
  },
  round_desc_1: {
    type: String,
  },
  round_title_2: {
    type: String,
  },
  round_desc_2: {
    type: String,
  },
  round_title_3: {
    type: String,
  },
  round_desc_3: {
    type: String,
  },
  round_title_4: {
    type: String,
  },
  round_desc_4: {
    type: String,
  },
  eventId: {
    type: String,
    required: true,
    unique: true,   
  },
  contact_name_1: {
    type: String,
  },
  contact_mobile_1: {
    type: String,
  },
  contact_name_2: {
    type: String,
  },
  contact_mobile_2: {
    type: String,
  },
  hall: {
    type: String,
  },
  eventRules: {
    type: String,
  },
  teamSize: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
  },
});

export default model("Event", eventSchema, "yutira-events-2025");
