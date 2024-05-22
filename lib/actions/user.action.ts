"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

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
