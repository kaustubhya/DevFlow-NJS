"use server";

import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

// make an async function
// pass params as arguments
// include a try catch block

export async function getUserById(params: any) {
  try {
    // in try
    // then connect to a database
    connectToDatabase();

    // pass user id as params

    const { userId } = params;
    // based on user id we can get our user for the database based on the user model
    const user = await User.findOne({ clerk: userId });
    // search for the user via userid in clerk database

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Now go to the page which calls the question page ie app > root > ask-question > page.tsx

// We are now here after creating webhooks i.e, after app > api > webhook > route.ts

// flow: export async function => pass params => connect to database => try-catch block

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    // destructure them now

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
      // create a new instance of a user in a database
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    // destructure them now

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    // finding a user first just to have its reference here

    // if no user found, simply throw an error saying user not found
    if (!user) {
      throw new Error("User not found");
    }

    // but if the user is found, then we have to delete the user from the database, and also we need to delete the user's questions, answers, comments etc....

    // let us start with questions as we only have that until now

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc...

    // delete the user now
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    // Now if we see the GetAllUsersParams, we see various props in it, so let us first give some default values to these props by de-structuring the props and params
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    // some default values and params destructuring, eg. if page doesn't exist, then page = 1

    const users = await User.find({}).sort({ createdAt: -1 }); // get all users and sort in such a way that latest users appear on top

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
  // go back to app > (root) > community > page.tsx
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not Found!");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove the question from Saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true } // create a new instance
      );
    } else {
      // add the question to Saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true } // create a new instance
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to handleSave() in Votes.tsx

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    // query
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {}; // i -> case insensitive  and { } -> Empty String
    // we use a Filter Query to select the documents that match the query
    // Here we are looking for a query of type filter query which is equal to a search query (template string) where if the searchQuery exists we give it a search query template string where title is a Regular Expression (RegExp), & if there is not a searchQuery, we give it an empty string (default one)

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    // Now let us extract the saved questions from user.saved
    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to app > root > collection > page.tsx > Home()
