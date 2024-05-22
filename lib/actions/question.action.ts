// We have made sure to seperate server actions for each model. This is good for scalability

// Here we have the server actions for the questions model.

"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
// Creating our first action

export async function getQuestions(params: GetQuestionsParams) {
  // imported from shared.types.d.ts

  try {
    // same process, connect to db
    connectToDatabase();

    // just get questions for now (we donot have all params now)
    const questions = await Question.find({})
      // populate the questions with tags and author
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 }); // gets the newest added question to the top

    // mongo db generally for all fields does not keep actual values, it keeps only the references (say for tags). So to get the name from the reference value, we populate the value

    // return the questions in an object as we want to add some additional stuff later on
    return { questions };
  } catch (error) {
    console.log(error);

    throw error;

    // Now go to const result = await getQuestions() in app > root > home > page.tsx
  }
}

// We are using export as we want to use it somewhere else too
export async function createQuestion(params: CreateQuestionParams) {
  // we will now create interface for createQuestion in shared.types.d.ts
  // eslint-disable-next-line no-empty
  try {
    // Connect to DB
    connectToDatabase();

    // after making all the models, user, question, tag
    // let us destructure the props
    const { title, content, tags, author, path } = params;
    // the path is a URL to the page we have to reload, do not ask a question i.e. home page. We destructure it from the params

    // Create a question
    const question = await Question.create({
      title,
      content,
      author,

      // we will do something extra for tags and path
    });

    const tagDocuments = [];

    // create the tags or get them if they already exist
    // Each tag is a document in the database

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        // findOneAndUpdate -> Special Mongoose property

        {
          // finding an already existing tag. To find such complex things, we use RegEx
          name: { $regex: new RegExp(`^${tag}$`, "i") }, // i -> case insensitive for searching tags
        }, // allows us to find something (tags here)

        { $setOnInsert: { name: tag }, $push: { question: question._id } }, // allows us to do something on it (once tag is found, we name it and insert/push it in the created question (by the question id))
        { upsert: true, new: true } // providing additional querry options (here we create a new instance of the tag)
      );
      tagDocuments.push(existingTag._id);
    }
    // Chatgpt explain: https://chatgpt.com/c/9a131896-1982-461a-a9ee-e742b87a49ba

    // before we could not pass all the questions information, so now we will pass it
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
      // for each tag documents, we push the id of that tag which is added to the question
    });

    // Overall we are just pushing the tags that we add to the document into the question so we could establish a relation (see image in notes (question and tag relation))

    // Create an interaction record for the user's ask_question (track the user who created this question)

    // first we need to create a user into the database based on the user modal

    // Increment the user's reputation by 5 points who created this question

    revalidatePath(path);
    // this avoids us the need to reload the site when we post a question and it does not appear on the home page when redirected
  } catch (error) {}
}

// to trigger the async action, import this in our Question.tsx page, go there
