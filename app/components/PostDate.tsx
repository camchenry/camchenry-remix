import { format, zonedTimeToUtc } from "date-fns-tz";

/**
 * This is the time zone that is used for interpreting dates in the project, since
 * I (Cameron McHenry) live on the East Coast.
 */
export const defaultTimeZone = "America/New_York";

export type PostDateProps = {
  publishedAt: string;
};

export default function PostDate({ publishedAt }: PostDateProps) {
  const postDate = new Date(
    zonedTimeToUtc(publishedAt, defaultTimeZone).valueOf()
  );

  return (
    <time dateTime={publishedAt}>
      {format(postDate, "MMMM d, yyyy", { timeZone: defaultTimeZone })}
    </time>
  );
}
