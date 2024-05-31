import { Schema, models, model, Document } from "mongoose";

// Creating a typescript interface for our document
export interface IQuestion extends Document {
  // what all things should our question have
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[]; // reference to another model in our database
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

// Creating a question schema

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  // Array of IDs of tags

  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  // Array of IDs of user who upvoted this question

  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],

  author: { type: Schema.Types.ObjectId, ref: "User" }, // Not an array
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  // Array of IDs of answers to a question

  createdAt: { type: Date, default: Date.now },
});

// turning the schema into a model now
const Question = models.Question || model("Question", QuestionSchema);
// check if the model already exists || create a model based on the QuestionSchema

export default Question;
