import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  // Array of objects
  createdAt: Date;
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
}: QuestionProps) => {
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
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` | asked ${getTimestamp(createdAt)}`} // give spaces here and use the utility function from lib > utils.ts
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes)}
          title=" Votes" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(answers.length)}
          title=" Answers" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(views)}
          title=" Views" // give spaces here
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
