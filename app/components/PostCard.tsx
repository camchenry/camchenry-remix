import React from "react";
import { H3 } from "./styled";

type PostCardProps = {
  title: string;
  summary: string;
  id: string;
};

export default function PostCard({ id, title, summary }: PostCardProps) {
  return (
    <div>
      <H3>
        <a href={`/blog/${id}`}>{title}</a>
      </H3>
      <p className="text-gray-600">{summary}</p>
    </div>
  );
}
