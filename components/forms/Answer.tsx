// making the form a client component
"use client";

import { useRef, useState } from "react";
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
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  // see the <Answer /> in page.tsx of app, root, quesiton, [id]

  // now to link the form path
  const pathname = usePathname();

  // for button submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // for AI answer
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);

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

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);

    try {
      await createAnswer({
        //  call the server action and get the values from the form (see above in async). The values are of type answer schema
        content: values.answer,
        author: JSON.parse(authorId),
        // now we donot have access to author, so we can go to app > (root) > question > [id] > page.tsx
        // got access now

        question: JSON.parse(questionId),
        path: pathname,
      });

      // After doing all this, let us reset our form, in case we need to give multiple answers
      form.reset();

      // Also clearing our editor
      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent(""); // cleared the editor
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      // whatever happens, any errors or something else, setIsSubmitting to false
    }
  };

  const generateAIAnswer = async () => {
    if (!authorId) return;

    setIsSubmittingAI(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          // for our deployed website url
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );

      const aiAnswer = await response.json();

      // alert(aiAnswer.reply);

      // Converting plain text to simple HTML Reply Format
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }

      // Toast Pop-Up Notification
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here..
        </h4>

        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md px-4 py-2.5 shadow-none"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
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
