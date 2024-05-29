// making the form a client component
"use client";

import React, { useRef, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";

const Answer = () => {
  // for button submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // for editor theme change
  const { mode } = useTheme();

  // for the editor (TINY MCE one) we need an Editor ref
  const editorRef = useRef(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    // we need to create an Answer Schema for this
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = () => {};

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here..
        </h4>

        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md px-4 py-2.5 shadow-none"
          onClick={() => {}}
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate an AI Answer
        </Button>
      </div>
      <Form {...form}>
        {/* Now we spread all the values of our react hook form within our form component */}
        {/* Form Imported from shadcn UI */}

        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          {/* Using a form field to explain the answer (same as the one we used to explain the question, this has the editor too!) */}
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  {/* 🛑🛑 Add an Editor */}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY} // 🛑 Personal One time API key stored in .env.local
                    onInit={(_evt, editor) => {
                      // @ts-ignore -> Though code is giving an error, ignore it as tiny needs this code bit to work
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur} // This onBlur runs once we exit the editor and field.onBlur saves the values once we exit
                    onEditorChange={(content) => field.onChange(content)} // get the content from the editor and do field.onChange(content)
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        // include "codesample below in both plugins and toolbar"
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        //   "code",
                        //   "help",
                        //   "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist outdent indent | ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide", // this changes color of menu bar of editor
                      content_css: mode === "dark" ? "dark" : "light", // this changes color of content area of editor
                      // 🛑 these 2 will make our editor look good in dark mode, but to ensure it only looks like this in dark mode and its default look in light mode, we use a useTheme() above and use conditional rendering here
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* button to submit form */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
              // used the useState hook to change the state while submitting
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
