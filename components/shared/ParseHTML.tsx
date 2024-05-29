"use client";

import React, { useEffect } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";

// here we will now import some of the most used languages from prism
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface Props {
  data: string;
}

const ParseHTML = ({ data }: Props) => {
  // now we are getting error saying prism is defined but never used, for that let us use a useEffect() hook
  useEffect(() => {
    Prism.highlightAll();
    // This highlights all the content that is perceived as code
    // Also since we are using useEffect, we need to import "use client" on top
  }, []);
  return (
    <div>
      {parse(data)}
      {/* Here we use the parse from html-react-parser to parse the data (code data from prism) that we use in the question > [id] > page.tsx */}
    </div>
  );
};

export default ParseHTML;
