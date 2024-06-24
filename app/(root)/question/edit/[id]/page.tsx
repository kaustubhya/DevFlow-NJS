import { getUserById } from "@/lib/actions/user.action";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";
import Question from "@/components/forms/Question";

const Page = async ({ params }: ParamsProps) => {
  // get your clerk user
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: params.id }); // id coming from the url in browser as it is already populated there

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit" // type of form ask question or edit question
          mongoUserId={mongoUser._id} // who is editing this question
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
