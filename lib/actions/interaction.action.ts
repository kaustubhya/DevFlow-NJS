"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase(); // Used await here

    const { questionId, userId } = params;

    // Update the view count for each question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } }); // increment the view by 1

    // if the user id exists already, we can check if the user has already interacted(view) with the question or not
    // So we check for existing Interaction if userId exists
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      // if the user has already viewed it once before
      if (existingInteraction) {
        return console.log("User has already viewed this question!");
      }

      // if not, then we create an interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
      // 🛑🛑 This will help us get recommended questions i.e. those questions which we have not viewed before
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// go to Votes.tsx > useEffect()
