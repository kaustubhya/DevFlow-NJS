import Answer from "@/components/forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params }) => {
  // Our first task in the UI of this page is to fetch all the details of the question based on its param ID (see notes)
  // We did that, now let us do things here

  //   CHATGPTed the code below as it was giving error for answers.length as it was undefined
  // Log params to check if the ID is correctly passed
  console.log("Params: ", params);

  // Fetch Question details
  let result;
  try {
    result = await getQuestionById({ questionId: params.id });
    console.log("Question Data: ", result);
  } catch (error) {
    console.error("Error Fetching Question Data: ", error);
    return <div>Error Loading Question Data</div>;
  }

  // Check if the result is as expected
  if (!result || !result.author || !result.createdAt || !result.title) {
    console.error("Unexpected result format: ", result);
    return <div>Invalid question data</div>;
  }

  const answersCount = result.answers ? result.answers.length : 0;
  const viewsCount = result.views !== undefined ? result.views : 0;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div>Voting</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        {/* Metrics-> Upvotes, Message, Eye */}
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="Clock Icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title=" Asked" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(answersCount)}
          title=" Answers" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(viewsCount)}
          title=" Views" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      {/* We will now show the details that was given in our TinyMCE Markdown editor while asking a question, for that we will do the following: */}
      {/* To create this component, go to components > shared > ParseHTML.tsx */}
      <ParseHTML data={result.content} />

      {/* Let us now render tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
            // show only the tag name and not the tag question count
          />
        ))}
      </div>

      {/* Now we will use a form to show all the answers to our questions */}
      <Answer />
    </>
  );
};

export default page;
