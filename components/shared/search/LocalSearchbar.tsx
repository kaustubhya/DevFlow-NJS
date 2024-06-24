"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

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
  // implementing the local search bar functionality
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // once we have a searchParam, we can access a query
  const query = searchParams.get("q"); // we can add any query inside the ''
  // console.log(query);
  // check in the console in inspect

  const [search, setSearch] = useState(query || "");
  // if query is shared, then search is populated automatically
  // go to text Input field below

  // for search bar to query change in url effect
  useEffect(() => {
    // 🛑🛑🛑 Each keystroke is an event. So while searching, we make call to the database. NEVER make request to Database after every keydown event.

    // 🛑🛑 Solution - Debouncing: It will send the signals to the server after a certain number of events have occured (a delayed signal). In regular case, it will send signals to database, after every event.

    // Implementing Debouncing
    const delayDebounceFunc = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          // why send params again when we already have q (querries). ANS -> There could already be many other params like category, filtering, pages etc..
          params: searchParams.toString(),
          key: "q",
          value: search,
          // go to lib > utils.tsx
        });
        // we are back from lib.utils (we modified only the search property here, keeping all other url same)
        router.push(newUrl, { scroll: false });
      }

      else {
        console.log(route, pathname)
        // if search bar has already some query and we removed it from the local search bar but we also want to remove it from the url
        if(pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q']
          })

          router.push(newUrl, { scroll: false });

        }

      }
    }, 400);

    return () => clearTimeout(delayDebounceFunc);
  }, [search, route, pathname, router, searchParams, query]);
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
        value={search} // from top
        onChange={(e) => setSearch(e.target.value)} // we can change the query value in url and see it in the local search bar. To do vice versa i.e. search bar value to query, use a useEffect() ↑
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
