import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";
// import Loading from './loading'

// All of our detail pages (the pages with dynamic routes get some information from search params) so let us get those search params
const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  });

  // const isLoading = true;

  // if (isLoading) return <Loading />;

  return (
    //   UI is similar to collections page
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      {/* Search Bar for Questions */}
      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      {/* Now Creating the Question Cards */}
      {/* Wrapping Div */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through questions (array of objects at the start ↑) */}
        {result.questions.length > 0 ? (
          result.questions.map(
            (
              question: any // IQuestion will tell us what our question contains
            ) => (
              <QuestionCard
                key={question._id}
                // Since the key is not getting passed, let us pass the IDs too!
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            )
          )
        ) : (
          <NoResult
            title="There are no tag questions to show"
            description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the
      discussion. Your Query could be the next big thing others learn from.
      Get Involved! 💡"
            // Sometimes the link does not point to ask a question, but rather add a tag or something else. So we need to change the href as well as the title of the button.
            link="/ask-question"
            linkTitle="Ask a Question"
            // This makes the No Results Component more usable for say Tags Page
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination 
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
