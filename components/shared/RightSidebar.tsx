import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderTag from "./RenderTag";

const hotQuestions = [
  {
    _id: 1,
    title: "How do I express as a custom server in NextJS?",
  },
  {
    _id: 2,
    title: "How do I install NextJS?",
  },
  {
    _id: 3,
    title: "How do I use server in NextJS?",
  },
  {
    _id: 4,
    title: "How do use 'use client' in nextJS?",
  },
  {
    _id: 5,
    title: "How do I get a job as a NextJS developer?",
  },
];

const popularTags = [
  {
    _id: 1,
    name: "javascript",
    totalQuestions: 500,
  },
  {
    _id: 2,
    name: "react",
    totalQuestions: 254,
  },
  {
    _id: 3,
    name: "Next JS",
    totalQuestions: 148,
  },
  {
    _id: 4,
    name: "development",
    totalQuestions: 443,
  },
  {
    _id: 5,
    name: "jobs",
    totalQuestions: 110,
  },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border shadow-light-300 custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      {/* This Section is divided into two parts => Top Questions and Popular Tags */}
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        {/* This one below will be the wrapper for the mapping of our questions */}
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>

              {/* Importing the expanding arrow image now */}
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        {/* Wrapper Div */}
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
