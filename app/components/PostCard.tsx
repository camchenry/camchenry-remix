import React from "react";
import PostDate from "./PostDate";
import { H3 } from "./styled";

type PostCardProps = {
  title: string;
  summary: string;
  id: string;
  date: string;
};

export default function PostCard({ id, title, summary, date }: PostCardProps) {
  return (
    <div className="py-5">
      <H3>
        <a href={`/blog/${id}`}>{title}</a>
      </H3>

      <p className="text-gray-600">
        <PostDate publishedAt={date} /> &mdash; {summary}
      </p>
    </div>
  );
}
