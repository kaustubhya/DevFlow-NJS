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
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

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

    const { searchQuery, filter, page = 1, pageSize = 4 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        // search by name
        { username: { $regex: new RegExp(searchQuery, "i") } },
        // search by username
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions) // get users based on different filters
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query); // activate the next button by fetching the question count from the model
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 1 } = params;
    const skipAmount = (page - 1) * pageSize;

    // query
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {}; // i -> case insensitive  and { } -> Empty String
    // we use a Filter Query to select the documents that match the query
    // Here we are looking for a query of type filter query which is equal to a search query (template string) where if the searchQuery exists we give it a search query template string where title is a Regular Expression (RegExp), & if there is not a searchQuery, we give it an empty string (default one)

    // filters
    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions, // sort all questions based on filters
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error("User Not Found");
    }

    // Now let us extract the saved questions from user.saved
    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext }; // pagination is a little bit different here
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to app > root > collection > page.tsx > Home()

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    // let us work on badges, ([] => destructuring the array, 1st item gives us the number of upvotes)
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },

      // now group them
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
      }}
    ]);
    // aggregate: matching multiple things, grouping them together and then getting the upvote from that

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },

      // now group them
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },

      // now group them
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews.totalViews || 0,
      },
    ];
    // Aggregate -> Take everything and reduce it to a single value (just like the JavaScript reduce function)

    const badgeCounts = assignBadges({ criteria });
    // go to utils.ts

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// go to app > (root) > profile > [id] > page.tsx > Page

// this is a server action that will display the questions created by the user with pagination support.
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 3 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    // achieve pagination
    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 }) // the one placed here will have the highest effect
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
    // Basically we returned questions with most views and upvotes, and populated it with author and tag details

    const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNextQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 2 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");
    // Basically we returned questions with most views and upvotes, and populated it with author details

    const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNextAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
