import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    clerkId: string;
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  // Array of objects
  createdAt: Date;
  clerkId?: string;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  clerkId, 
  // used in questionstab.tsx and answerstab.tsx
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  // checking if we are the authors of the question or not, if yes then only we will get to see the edit and delete question button

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        {/* This div will have the created ad as well as the title */}
        {/* Now to reverse the ad and make it on top in smaller devices, do flex-col-reverse */}
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {/* Converting the long string time stamp into something nice and readible */}
            {/* 🛑🛑 We can create a new utility function and use it across different places go to lib > utils.tsx */}
            {/* {String(createdAt)} => Old */}
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {/* line-clamp-1 => keeps the text to a single line without changing the card properties */}
              {title}
            </h3>
          </Link>
        </div>

        {/* If signed in, add edit delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {/* Rendering Tags related to the question */}

        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          // Bringing back the reusable tag component
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* Now this div has the author's name, an image, when was the question asked and like (with like image), answers (with answer image) and votes (with votes image) */}
        {/* Now this is something like, image on the left, text on the right. So we can make these as re-usable components. */}
        {/* Import from Metric.tsx */}

        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` | asked ${getTimestamp(createdAt)}`} // give spaces here and use the utility function from lib > utils.ts
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(upvotes.length)}
            title=" Votes" // give spaces here
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers.length)}
            title=" Answers" // give spaces here
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title=" Views" // give spaces here
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
