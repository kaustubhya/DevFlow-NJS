"use client";
// because of the question component

import Question from "@/components/forms/Question";
import React from "react";

// we changed page to Page to make it server side rendered
const Page = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question />
      </div>
    </div>
  );
};

export default Page;
