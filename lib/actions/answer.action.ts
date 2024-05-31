"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    // destructure the params i.e. get values from frontend
    const { content, author, question, path } = params;

    // get the model and connect it to params to pass in the answer i.e. create an answer
    const newAnswer = await Answer.create({ content, author, question });
    console.log({ newAnswer });

    // now normally we do a simple return but here, we need to populate some other models with answers

    // We need to Add the answer to the question's answers array (which was earlier empty)
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add Interaction here later...

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      // if we have already upvoted, we pull the upvote from upvotes
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      // if we have downvoted, we pull our downvotes from downvote and push the upvote to upvotes. 🛑🛑 Keep in mind, this is the upvote export function
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      // if we have neither upvoted nor downvoted, we added a new upvote of userId to set
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    // update the answer
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    // {new: true} => creating a new document

    if (!answer) {
      throw new Error("Answer not found!!");
    }

    // Increment the author's reputation when he gets an upvote to an answer
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      // if we have already downvoted, we pull the downvote from downvotes
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      // if we have upvoted, we pull our upvotes from upvote and push the downvote to downvotes. 🛑🛑 Keep in mind, this is the downvote export function
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      // if we have neither upvoted nor downvoted, we added a new downvote of userId to set
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    // update the answer
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    // {new: true} => creating a new document

    if (!answer) {
      throw new Error("Answer not found!!");
    }

    // Increment the author's reputation when he gets an upvote to an answer
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to handlevote() in components > shared > Votes.tsx
