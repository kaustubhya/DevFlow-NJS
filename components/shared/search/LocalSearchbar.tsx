"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

// All the props are of the type, CustomInputProps, hence specify it in the interfaces created below
interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}

const LocalSearchbar = ({
  route,
  imgSrc,
  iconPosition,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  return (
    // wrapper div for input
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      {/* We wanted to show the image of search icon only when icon position was set to left */}

      {/* Now for the input field inside the div */}
      <Input
        type="text"
        placeholder={placeholder}
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />
      {/* Now here we passed placeholder as props. Why? Because in home page it will be search for questions and in the tags page it will be Search by tags */}
      {/* no-focus => removes the ugly outline */}
      {/* onChange function is a client component hence we use "use client" at top */}

      {/* To get the search icon on right, do this:
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )} 
      Also change the prop value (iconPosition) in the LocalSearchbar component from left to "right" */}
    </div>
  );
};

export default LocalSearchbar;
