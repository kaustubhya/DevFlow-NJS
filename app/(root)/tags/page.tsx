import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const result = await getAllTags({});
  console.log(result.tags);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      {/* Search Bar for Questions and Filters */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Now we will use the local search bar and the filters in multiple pages, hence we make them re-usable */}
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        {/* This local search bar may be used in different cases differently i.e. each time, it will have different properties. So let us use props in this for home page here. Also specify the props mentioned here in LocalSearchbar.tsx */}

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses={""}
        />
        {/* Now we see that we use filters in multiple pages, each time, the values are different, so we can make those in an array in the constants > filters.tsx and then import them here and then use them as props */}
        {/* We keep the container classes empty here to make the filter appear on all screen sizes unlike the home page filter where we tweaked with the filters' container classes a bit */}
      </div>

      {/* Let us display all of our users now */}
      <section className="mt-12 flex flex-wrap gap-4">
        {/* To display all users we first went to users.action.ts and created a function called getAllUsersParams */}
        {/* After making the result in top, continuing ↓ */}
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            // Creating the tag card component here
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>

                <p className="small-medium text-dark400_light500 mt-3.5">
                  {/* This tells us how many questions have this tag */}
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>{" "}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
    </>
  );
};

export default Page;
