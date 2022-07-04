import { addHours } from "date-fns";
import { format, zonedTimeToUtc } from "date-fns-tz";

/**
 * This is the time zone that is used for interpreting dates in the project, since
 * I (Cam McHenry) live on the East Coast.
 */
export const defaultTimeZone = "America/New_York";

export type PostDateProps = {
  publishedAt: string;
};

export default function PostDate({ publishedAt }: PostDateProps) {
  const postDate = addHours(
    new Date(zonedTimeToUtc(publishedAt, defaultTimeZone).valueOf()),
    12
  );

  return (
    <time dateTime={publishedAt}>
      {format(postDate, "MMMM d, yyyy", { timeZone: defaultTimeZone })}
    </time>
  );
}
