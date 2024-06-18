"use client";
// using routers (hooks)

import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  // what type of tag are we looking for

  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (item: string) => {
      // from home page filters here as their functionality is the same


    // for query change in url effect for filters

    if (active === item) {
      setActive(""); // sets color of inactive tab

      const newUrl = formUrlQuery({
        // why send params again when we already have q (querries). ANS -> There could already be many other params like category, filtering, pages etc..
        params: searchParams.toString(),
        key: "type",
        value: null,
        // see lib > utils.tsx
      });
      // we are back from lib.utils (we modified only the search property here, keeping all other url same)
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item); // sets color of active tab

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
        // see lib > utils.tsx
        // Initially, filters were active and on clicking them, they became unactive, so to reverse it, we put the activation code in else and de-activation code in if
      });

      router.push(newUrl, { scroll: false });
    }
  };




  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 small-medium dark:text-light-800 dark:hover:text-primary-500 rounded-2xl px-5 py-2 capitalize
                ${active === item.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"}`}
                onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
