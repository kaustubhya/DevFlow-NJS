import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileLinksProps {
  imgUrl: string;
  title: string;
  href?: string;
}

const ProfileLinks = ({ imgUrl, title, href }: ProfileLinksProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt="icon" width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-blue-500"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLinks;
