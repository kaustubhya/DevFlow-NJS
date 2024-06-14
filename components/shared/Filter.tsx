"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  // filters is an array of objects, we put [] to specify it as an array of objects
  otherClasses?: string;
  containerClasses: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get("filter"); // state for our filter

  const handleUpdateParams = (value: string) => {
    // for community page filters
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, {scroll: false})
  };
  return (
    // Wrapper Div
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            {/* This gives us overflow-hidden and displays webkit box as well */}
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              // we passed HomePageFilters as filters' prop in page.tsx here
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
