import * as z from "zod";
// We define here what goes into our form via form schema

// Our form Schema , let us export it and rename it to
export const QuestionsSchema = z.object({
  // Adding validations in zod (see docs -> link in notes)
  // Also adding custom error messages
  // title: z.string().min(5, 'Title must be at least 5 characters').max(130)
  // title: z.string().min(5, { message: "WRONG!!!" }).max(130),
  title: z.string().min(5).max(130), // Question Title
  explaination: z.string().min(100), // Explaination of the question
  tags: z.array(z.string().min(1).max(20)).min(1).max(3),
  //   Question Tags -> This here is an array of strings
  // There can be minimum 1 and maximum 3 tags
  // In each tag, the length of string can be from 1 to 20 characters
});

// let us make an Answer Schema Now
export const AnswerSchema = z.object({
  answer: z.string().min(100),
  // minimum 100 chars
});

export const ProfileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(2).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(5).max(50),
});
