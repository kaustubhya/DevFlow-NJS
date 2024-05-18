// We have made sure to seperate server actions for each model. This is good for scalability

// Here we have the server actions for the questions model.

"use server";

import { connectToDatabase } from "../mongoose";

// Creating our first action

// We are using export as we want to use it somewhere else too
export async function createQuestion(params: any) {
  // eslint-disable-next-line no-empty
  try {
    // Connect to DB
    connectToDatabase();
  } catch (error) {}
}

// to trigger the async action, import this in our Question.tsx page, go there
