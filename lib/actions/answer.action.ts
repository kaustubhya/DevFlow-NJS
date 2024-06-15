"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";

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

    const { questionId, sortBy, page = 1, pageSize = 1 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 }; // alphabetical order naming
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswer = await Answer.countDocuments({ question: questionId });

    const isNextAnswer = totalAnswer > skipAmount + answers.length;

    return { answers, isNextAnswer };
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

// delete answers
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);
    // we get the answer Id so that we can remove its existance from every where

    if (!answer) {
      throw new Error("Answer not found");
    }

    await answer.deleteOne({ _id: answerId });
    // mark the selected answer for deletion

    await Question.updateMany(
      { _id: answer.question },
      {
        $pull: {
          answers: answerId,
        },
      }
    );
    // Here we update the question by doing the following: we select the question id linked to the deleted answer and we pull the answer Id (deleted one) from the question model

    await Interaction.deleteMany({ answer: answerId });
    // we delete all answers references from the interaction model
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
