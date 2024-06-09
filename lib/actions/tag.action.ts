"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    } // no user

    // if there is a user, then we need to find interactions for the user and group by tags...
    // For that we will later create an interactions data model which will help us ease with this

    // For now, use this array of objects of dummy tags having name and ids
    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
  //   go back to user card.tsx
}

// for tags
export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // logic is similar to saved questions
    // query
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, options: "i" } }
        : {},

      //  since search query has to be a RegExp, we can check it sing conditionals, if there is nothing, return an empty string
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag Not Found");
    }

    // Now let us extract the saved questions from user.saved
    const questions = tag.questions;

    console.log(tag);

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// Go to app > (root) > tags > [id] > page.tsx.

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const getPopularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      // project here is used to reshape how we see our tag and what we want to get back
      // here we want to get back the name property, and each tag will have a numberOfQuestions Property whose size is equal to questions i.e. number of questions in each tag
      { $sort: { numberOfQuestions: -1 } }, // sort wrt to descending order i.e. most questions
      { $limit: 5 }, // only 5 tags max
    ]);

    return getPopularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to right sidebar
