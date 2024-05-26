import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import Filter from "@/components/shared/Filter";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  /* After making the getAllUsersParams function in users.actions.ts, we are back. Go to bottom in <section></section> */
  const result = await getAllUsers({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      {/* Search Bar for Questions and Filters */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Now we will use the local search bar and the filters in multiple pages, hence we make them re-usable */}
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Connect with amazing minds"
          otherClasses="flex-1"
        />
        {/* This local search bar may be used in different cases differently i.e. each time, it will have different properties. So let us use props in this for home page here. Also specify the props mentioned here in LocalSearchbar.tsx */}

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses={""}
        />
        {/* Now we see that we use filters in multiple pages, each time, the values are different, so we can make those in an array in the constants > filters.tsx and then import them here and then use them as props */}
        {/* We keep the container classes empty here to make the filter appear on all screen sizes unlike the home page filter where we tweaked with the filters' container classes a bit */}
      </div>

      {/* Let us display all of our users now */}
      <section className="mt-12 flex flex-wrap gap-4">
        {/* To display all users we first went to users.action.ts and created a function called getAllUsersParams */}
        {/* After making the result in top, continuing ↓ */}
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="text-accent-blue mt-2 font-bold">
              Sign Up to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
