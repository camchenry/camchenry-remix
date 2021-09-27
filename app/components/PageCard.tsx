import React from "react";
import PostDate from "./PostDate";
import { H3 } from "./styled";

type PageCardProps = {
  title: string;
  url: string;
  summary: string;
  date?: string;
};

export default function PageCard({ url, title, summary, date }: PageCardProps) {
  return (
    <div className="py-5">
      <H3>
        <a href={url}>{title}</a>
      </H3>

      <p className="text-gray-600">
        {date !== undefined ? (
          <>
            <PostDate publishedAt={date} /> &mdash; {summary}
          </>
        ) : (
          summary
        )}
      </p>
    </div>
  );
}
