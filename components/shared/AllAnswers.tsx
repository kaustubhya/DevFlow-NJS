import React from "react";
import Filters from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Voting from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page: page ? +page : 1,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filters filters={AnswerFilters} containerClasses="" />
      </div>

      <div>
        {/* Displaying the fetched Answers */}
        {/* Let us map over all the answers */}
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            {/* article is similar to a div */}

            <div className="flex items-center justify-between">
              {/* Span ID Identifier */}
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile pic"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}{" "}
                    </p>

                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                      <span className="ml-1.5 max-sm:hidden"> | </span> answered{" "}
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Voting
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    // has the user himself upvoted the answer -> checking by if the current answer includes the id of the author
                    hasupVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    // has the user himself downvoted the answer -> checking by if the current answer includes the id of the author
                    hasdownVoted={answer.downvotes.includes(userId)}

                    // go to components > shared > Votes.tsx
                  />
                </div>
              </div>
            </div>

            {/* Now let us render the parsehtml for answers this time */}
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={page ? +page : 1}
          // 🛑 Here we are on a separate component, so no need to use searchParams here
          isNext={result.isNextAnswer}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
