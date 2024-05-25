"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
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
