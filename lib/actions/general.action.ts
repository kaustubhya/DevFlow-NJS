"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { model } from "mongoose";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    // converting the search query into a regex query
    const regexQuery = { $regex: query, $options: "i" }; // converts query to regex for checking and filtering

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    // Sometimes the type may come in uppercase, so we need to make it to lowercase
    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search across everything (no specific type selected)

      // modelsAndTypes.forEach(async (item) => {
      //     const queryResults = await model.find()
      // })
      // 🛑🛑🛑 Using for Each , map and other iterative functions with async and await does not work, instead we can just use a for of loop

      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2); // 2 of each tag type, so total of 8

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      // 🛑 search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
    //   console.log({ modelInfo, type });

      if (!modelInfo) {
        throw new Error("invalid search type");
      }

      // Using abstraction in models and types so we donot want to repeat the task of User.find, Answer.find, Tag,find etc.. again and again
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(`Error fetching global results, ${error}`);
    throw error;
  }
}

// go back to globalResults.tsx
