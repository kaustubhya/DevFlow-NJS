import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
// import Loading from "./loading";

export default async function Home({ searchParams }: SearchParamsProps) {
  // fetching saved questions from the database
  // let us go to lib > actions > user.action.ts and then come back

  //   we back
  const { userId } = auth();

  //   if no user exists, return null i.e. no need to go below
  if (!userId) {
    return null;
  }

  //   user exists
  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    // for search query
    filter: searchParams.filter,
    // for filter
    page: searchParams.page ? +searchParams.page : 1,
    // for paging
  });

    // loading testing
  // const isLoading = true;

  // if(isLoading) return <Loading />
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      {/* Search Bar for Questions and Filters */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Now we will use the local search bar and the filters in multiple pages, hence we make them re-usable */}
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=""
        />
        {/* Now we see that we use filters in multiple pages, each time, the values are different, so we can make those in an array in the constants > filters.tsx and then import them here and then use them as props */}
      </div>

      {/* Now Creating the Question Cards */}
      {/* Wrapping Div */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through questions (array of objects at the start ↑) */}
        {result.questions.length > 0 ? (
          result.questions.map((question:any) => (
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
          ))
        ) : (
          <NoResult
            title="There are no saved questions to show"
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
}
