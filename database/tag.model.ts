import { Schema, model, models, Document } from "mongoose";

// interface
export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdOn: Date;
}

// Creating a tag schema -> TypeScript format to Mongoose Format
const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdOn: { type: Date, default: Date.now },
});

// Turning the schema into a model now
const Tag = models.Tag || model("Tag", TagSchema);
// Check if the model already exists || create a model based on the TagSchema

export default Tag;
