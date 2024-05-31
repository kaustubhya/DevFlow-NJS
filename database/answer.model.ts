// the steps are repetitive, import things, make interfaces, make schemas, export models

import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;

  // this is an array of references to the people upvoting/downvoting the answer, i.e. array of IDs of the users upvoting or downvoting the answer
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }], // notice the [], this denotes array (defined in interface above)
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }], // notice the [], this denotes array (defined in interface above)
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
