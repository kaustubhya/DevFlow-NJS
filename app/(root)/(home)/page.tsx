import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQL Alchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: {
      _id: "author1_id",
      name: "John Doe",
      picture: "author1_picture_url",
    },
    upvotes: 112345,
    views: 10000000,
    answers: [],
    createdAt: new Date("2023-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to differentiate between flex and grid?",
    tags: [
      { _id: "3", name: "css" },
      { _id: "4", name: "html" },
    ],
    author: {
      _id: "author2_id",
      name: "Langley Mensch",
      picture: "author2_picture_url",
    },
    upvotes: 17810,
    views: 144245,
    answers: [],
    createdAt: new Date("2023-12-27T07:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          {/* Width will be fill in small devices */}
          <Button className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3">
            {/* Sometimes in ShadCn we need to add an '!' mark which means that the following text is important */}
            Ask a Question
          </Button>
        </Link>
      </div>

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
        {/* This local search bar may be used in different cases differently i.e. each time, it will have different properties. So let us use props in this for home page here. Also specify the props mentioned here in LocalSearchbar.tsx */}

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        {/* Now we see that we use filters in multiple pages, each time, the values are different, so we can make those in an array in the constants > filters.tsx and then import them here and then use them as props */}
        {/* Also in large devices we can show the filters in a different way in home page, for that we have styled the filter container and we have kept it as hidden in smaller devices */}
      </div>

      <HomeFilters />
      {/* These are the filters appearing in Tags form in lager screens in Home Page */}

      {/* Now Creating the Question Cards */}
      {/* Wrapping Div */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through questions (array of objects at the start ↑) */}
        {questions.length > 0 ? (
          questions.map((question) => (
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
            title="There are no questions to show"
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
    </>
  );
}

// As for theme, light and dark, we cannot use it directly on all pages as we've seen in notes, we'll get error. So, We'll see about the theme later in every component which we come across (we know theme is in client mode and next is server hence cannot use client things in server (check notes))
