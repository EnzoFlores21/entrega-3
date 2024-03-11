import mongoose from "mongoose";

const collection = "ticket";

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    default: 0,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
