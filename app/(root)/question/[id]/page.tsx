import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params }) => {
  // to get author's access in our Answer.tsx component, we can get author / userId from clerk
  const { userId: clerkId } = auth();

  // based on this clerk id we are getting access to our mongodb user
  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }
  // Pass this to the Answer component below in return

  // Our first task in the UI of this page is to fetch all the details of the question based on its param ID (see notes)
  // We did that, now let us do things here

  // Log params to check if the ID is correctly passed
  console.log("Params: ", params);

  const result = await getQuestionById({ questionId: params.id });

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
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        {/* Metrics-> Upvotes, Message (Answers), Eye (Views) */}
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
          value={formatAndDivideNumber(result.answers.length)}
          title=" Answers" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
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

      {/* Showing all previous answers to our question  */}
      <AllAnswers
        questionId={result._id}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={result.answers.length}
      />

      {/* Now we will use a form to show an editor to answer our questions */}
      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        // from the top

        authorId={JSON.stringify(mongoUser._id)}
        // pass these as props in Answer.tsx
      />
    </>
  );
};

export default Page;
