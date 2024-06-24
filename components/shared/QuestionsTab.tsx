import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  // as we also have the search params here
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    // for paging
  });
  return (
    // once we get the results, we map through them
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          // Since the key is not getting passed, let us pass the IDs too!
          _id={question._id}
          clerkId={clerkId !== null ? clerkId : undefined}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNextQuestions}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
