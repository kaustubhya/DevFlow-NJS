// We have made sure to seperate server actions for each model. This is good for scalability

// Here we have the server actions for the questions model.

"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
// Creating our first action

export async function getQuestions(params: GetQuestionsParams) {
  // imported from shared.types.d.ts

  try {
    // same process, connect to db
    connectToDatabase();

    // LocalSearchBar
    // Earlier we returned everything from params but now via searchQuery we can filter it
    // We fetch the current query in the home page from search params

    const { searchQuery, filter, page = 1, pageSize = 4 } = params;

    // Calculate the number of posts to skip based on the page number and the page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      // if we do have a search query, we can add to a search query
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        // search across the title. Regex should match a new REGEXP with case insensitive
        { content: { $regex: new RegExp(searchQuery, "i") } },
        // search in content too
      ];
    }

    // for filtering sorting
    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;

      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }

    // just get questions for now (we donot have all params now)
    const questions = await Question.find(query)
      // populate the questions with tags and author
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions); // gets the questions according to the filters

    // mongo db generally for all fields does not keep actual values, it keeps only the references (say for tags). So to get the name from the reference value, we populate the value

    const totalQuestions = await Question.countDocuments(query); // activate the next button by fetching the question count from the model
    const isNext = totalQuestions > skipAmount + questions.length;

    // return the questions in an object as we want to add some additional stuff later on
    return { questions, isNext };
  } catch (error) {
    console.log(error);

    throw error;

    // Now go to const result = await getQuestions() in app > root > home > page.tsx
  }
}

// We are using export as we want to use it somewhere else too
export async function createQuestion(params: CreateQuestionParams) {
  // we will now create interface for createQuestion in shared.types.d.ts
  // eslint-disable-next-line no-empty
  try {
    // Connect to DB
    connectToDatabase();

    // after making all the models, user, question, tag
    // let us destructure the props
    const { title, content, tags, author, path } = params;
    // the path is a URL to the page we have to reload, do not ask a question i.e. home page. We destructure it from the params

    // Create a question
    const question = await Question.create({
      title,
      content,
      author,

      // we will do something extra for tags and path
    });

    const tagDocuments = [];

    // create the tags or get them if they already exist
    // Each tag is a document in the database

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        // findOneAndUpdate -> Special Mongoose property

        {
          // finding an already existing tag. To find such complex things, we use RegEx
          name: { $regex: new RegExp(`^${tag}$`, "i") }, // i -> case insensitive for searching tags
        }, // allows us to find something (tags here)

        { $setOnInsert: { name: tag }, $push: { questions: question._id } }, // allows us to do something on it (once tag is found, we name it and insert/push it in the created question (by the question id))
        { upsert: true, new: true } // providing additional querry options (here we create a new instance of the tag)
      );
      tagDocuments.push(existingTag._id);
    }
    // Chatgpt explain: https://chatgpt.com/c/9a131896-1982-461a-a9ee-e742b87a49ba

    // before we could not pass all the questions information, so now we will pass it
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
      // for each tag documents, we push the id of that tag which is added to the question
    });

    // Overall we are just pushing the tags that we add to the document into the question so we could establish a relation (see image in notes (question and tag relation))

    // Create an interaction record for the user's ask_question (track the user who created this question)

    // first we need to create a user into the database based on the user modal

    // Increment the user's reputation by 5 points who created this question

    revalidatePath(path);
    // this avoids us the need to reload the site when we post a question and it does not appear on the home page when redirected
  } catch (error) {}
}

// to trigger the async action, import this in our Question.tsx page, go there

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    // now the basic idea is that the title and content of the question will come on its own, but for things like tags and authors, which are linked to other models like tag and user model, we have to populate them here
    // in populate, we give the path, the model name and the things we need to bring in here, we put all those things under select
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// go back to app > (root) > question > [id] > page.tsx

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    // update the question
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    // {new: true} => creating a new document

    if (!question) {
      throw new Error("Question not found!!");
    }

    // Increment the author's reputation when he gets an upvote to a quesiton
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    // update the question
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    // {new: true} => creating a new document

    if (!question) {
      throw new Error("Question not found!!");
    }

    // Increment the author's reputation when he gets an upvote to a quesiton
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// go to handlevote() in components > shared > Votes.tsx

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    // delete the selected question
    await Answer.deleteMany({ question: questionId });
    // delete all answers related to that question

    // deleting all interactions related to that answer/question
    await Interaction.deleteMany({ question: questionId });

    // update the tags which have the reference to this question i.e. pull all those tags that had something to do with this question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    // find the question to be edited
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    // if there is a question
    question.title = title;
    question.content = content;

    // now we donot want the user to update our tags (see Question.tsx)

    // finally save our question
    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    // so we went to question model, got all questions, and sorted it in descending order of views and upvotes and kept the limit to 5
    return hotQuestions;
    // go back to rightSideBar.tsx
  } catch (error) {
    console.log(error);
    throw error;
  }
}
