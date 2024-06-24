import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    // we will use skeleton loaders for this purpose, so let us try to re-create the home page layout
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* We will use a skeletons component from Shadcn UI for this */}
      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <div className="hidden max-md:block">
            <Skeleton className="h-14 w-28" />
            {/* Modifying a ShadCn component, go inside the Skeleton Component and alter the bg color of the loaders */}
        </div>
      </div>

      <div className="my-10 hidden flex-wrap gap-6 md:flex">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="flex flex-col gap-6">
        {[1,2,3,4,5,6,7,8,9,10].map((item) => (
           <Skeleton key={item} className="h-48 w-full rounded-xl" /> 
        ))}
      </div>
    </section>
  );
};

export default Loading;
