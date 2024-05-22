import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";
// import { auth } from '@clerk/nextjs'

// we changed page to Page to make it server side rendered
const Page = async () => {
  // we are here after making the user actions
  // Now we get our user ID from clerk
  // const { userId } = auth();

  // for testing purposes, we give the userId of the dummy user from our mongodb database
  const userId = "clerk12345";

  // If no current userID, redirect to sign in page
  if (!userId) {
    redirect("/sign-in");
  }

  // once you have the userId:
  const mongoUser = await getUserById({ userId }); // our created server ID

  console.log(mongoUser);
  // this will show our user as this is a server side page

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        {/*  coming from backend -> when we have our userId from mongodb, we pass it to the question form. It is good to stringify things */}
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
        {/* take the  mongoUserId to questions as a prop */}
      </div>
    </div>
  );
};

export default Page;
