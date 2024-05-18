// this is for creating a user schema via zod (see notes)

"use client";

//  Now we use the useForm hook from react-hook-form to create a form.
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Now to build our form, import these below
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";

// Questions is a functional component,
// here we use useForm
// resolve it
// and finally submit it via an onSubmit handler, see the function after this below function

// for our description editor, we use the tiny-mce editor
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";

const type: any = "create"; // form type (create or edit)

const Question = () => {
  // For the tiny mce editor, we will establish a reference, this will make sure that we will not take values after every key stroke or key input, it takes values at once together.
  const editorRef = useRef(null);

  // for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We will pull the below 2 functions into our questions component which is already existing

  // 1. Define your form., importing the formSchema aka QuestionsSchema
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explaination: "",
      tags: [],
      //  validation values took from lib > validations.tsx
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    // This function takes in all the values from the forms and sends it to the backend
    setIsSubmitting(true); // is prevents us from pressing the button twice, which causes chaos in the database which is good

    // setting some failsafes
    try {
      // Let us first focus on "creating a question"
      // For that we will make an async call to our API
      // That call contains all of our form data
      // Then we will navigate to our home page to see the list of all visible questions
      // We will use Next.js server actions for this (see notes)

      // After writing MongoDB code and installing and connecting to Mongo DB database, we trigger the async function of question.action.ts (import it before executing code)
      await createQuestion({});

      // Now when we submit the form in Question.tsx (client side), it runs the quesiton action on question.action.ts (server side), and it calls connect to db in mongoose.ts (database) (set params in question.action.ts to type : any)
      // These working of 3 files make server actions so great in Next.js (see diagrams)
    } catch (error) {
    } finally {
      // it always runs on any condition - true or false
      setIsSubmitting(false);
    }
  }

  // for manipulating tags, we have created an event, see the front end code below
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    // Dealing with TypeScript here
    if (e.key === "Enter" && field.name === "tags") {
      // 🛑 Normally direct submitting an event, reloads the browser (Default action). Hence we do e.preventDefault()
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim(); // Trimming Leading and Trailing Empty Spaces

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters!",
            // Specifying tag chars limit
          });
        }

        if (!field.value.includes(tagValue as never)) {
          // When adding say a CSS tag, we check here if there is not already an existing CSS tag present in the field
          // If by mistake it includes it, we have used never with tagValue saying not to include the duplicate input as a tag

          // If the tag is unique
          form.setValue("tags", [...field.value, tagValue]); // adding the value in the array with spread operator
          tagInput.value = ""; // Clearing the input field
          form.clearErrors("tags");
        } else {
          form.trigger(); // activate the form action
        }
        // This if-else code block adds a new tag to a form field if it's not already present, clears the input field, and clears any errors associated with the field. If the tag is already present, it triggers an action associated with the form.
      }
      // Go to UI code
    }
  };

  // Function to delete tags when we click on the close button
  const handleTagRemove = (tag: string, field: any) => {
    // do not mutate the state directly here
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue("tags", newTags);
  };

  // const newTags = field.value.filter((t) => t !== tag);: This line creates a new array newTags by filtering out all elements from field.value where the element is not equal to tag. Essentially, it removes the specified tag from the array of tags.

  // form.setValue('tags', newTags);: This line updates the value of the 'tags' field in the form with the newly filtered array newTags. It sets the 'tags' field to the updated array without including the removed tag.

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title" // change from userName to title (we gave it in validations.ts inside QuestionsSchema)
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  placeholder="Give your question a title"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Please be specific. Give all the details as if you&apos;re
                asking a question to another person 💡
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Form Field 2 for the explaination editor */}
        <FormField
          control={form.control}
          name="explaination" // change from userName to explaination (we gave it in validations.ts inside QuestionsSchema)
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed Explaination of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
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
                  initialValue=""
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
                      "codesample bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | ",
                    content_style: "body { font-family:Inter; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you&apos;ve put in the
                title. It should be atleast a minimum of 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Form Field 3, for tags to the question */}
        <FormField
          control={form.control}
          name="tags" // change from userName to tags (we gave it in validations.ts inside QuestionsSchema)
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* We are giving this form control 2 components, but since it can only handle one component, we will wrap the 2 components below in a <></> and make it as one */}
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add Tags..."
                    // {...field}
                    // To implement the tagging functionality, we have removed the above inputs as we want to manually update the outputs
                    // Add the following event
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {/* tags continued after function */}
                  {field.value.length > 0 && ( // a && b -> If a is true then definitely render b
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        // Shadcn reusable component for tags
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => handleTagRemove(tag, field)} // for tag removal, see function above
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="Close Icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert" // invert just inverts colors in dark and invert-0 brings back the inverted color to normal
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add up to 3 tags to describe what your question is about and
                which field it&apos;s related to. You need to press ENTER to add
                a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient !text-light-900 w-fit"
          disabled={isSubmitting}
        >
          {/* disabled={isSubmitting} this disables the button when it is submitting the form */}
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
          {/* A form can have 2 types, either it can be create a question (create type), or it can be edit a question (edit type) */}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
