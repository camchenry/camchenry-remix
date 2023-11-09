export async function timeit<Return>(
  func: (() => Return) | (() => Promise<Return>),
  name?: string
): Promise<Return> {
  const start = performance.now();
  const result = await func();
  const end = performance.now();

  const timeTaken = end - start;

  if (name) {
    console.log(`${name}: ${timeTaken}ms`);
  } else {
    console.log(`Time elapsed: ${timeTaken}ms`);
  }

  return result;
}
