"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";


const GlobalSearch = () => {

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

  const [isOpen, setIsOpen] = useState(false);
  // here we are checking if the global search bar is open or not

  const searchContainerRef = useRef(null)

  // closing the global search bar when we click on anywhere outside of the search bar box
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if(searchContainerRef.current 
        && 
        // @ts-ignore
        !searchContainerRef.current.contains(event.target) 
        // It means we clicked outside of the box
      ){
        setIsOpen(false);
        setSearch(``);
      }

    }

    setIsOpen(false);
    // manually closing the searchbar whenever the pathname changes (searchbar will close automatically when we re-navigate)

    document.addEventListener("click", handleOutsideClick);

    // we need to clear out all the event Listeners that we use inside the useEffect
    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [])


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
          key: "global",
          value: search,
          // we navigate to the new url
        });
        // we are back from lib.utils (we modified only the search property here, keeping all other url same)
        router.push(newUrl, { scroll: false });
      }

      else {
        if(query) { // query from localSearch, if localSearch exists then
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type']
          })

          router.push(newUrl, { scroll: false });

        }
        // with this we make sure at a time either global search or local search is active. Both cannot work together

      }
    }, 400);

    return () => clearTimeout(delayDebounceFunc);
  }, [search, router, pathname, searchParams, query]);


  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={searchContainerRef}>
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            if(!isOpen) {
              setIsOpen(true);
            }
            if(e.target.value === '' && isOpen) {
                setIsOpen(false);
            }
          }}
        />
      </div>
      {isOpen && <GlobalResult />} 
      {/* working on the global search pop-up component */}
    </div>
  );
};

export default GlobalSearch;
