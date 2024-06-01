import { Schema, model, models, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // reference to the user
  action: string;
  question: Schema.Types.ObjectId; // reference to the question
  answer: Schema.Types.ObjectId; // reference to the answer
  tags: Schema.Types.ObjectId[]; // reference to tag
  createdAt: Date;
}

const InteractionSchema = new Schema({
  // A user is the one which makes the interaction happen
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  //   question and answer will have a 1 to 1 relation, hence they are used as objects
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  //   tags have many to many relation i.e. one question has many tags and one tag has many questions, hence they are used as arrays here
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;

// go to interaction.action.ts
