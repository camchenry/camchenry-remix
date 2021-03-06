import tw from "tailwind-styled-components";

export const H1 = tw.h1`
  text-3xl
`;
export const H2 = tw.h2`
  text-2xl
`;
export const H3 = tw.h3`
  text-xl
`;

export const Hr = tw.hr`
  my-4
  md:my-6
  border-green-300
`;

export const Label = tw.label`
  block
  font-bold
  mb-1
`;

export const Input = tw.input`
  border-2
  border-gray-300
  dark:border-gray-600
  dark:bg-gray-900
  border-solid
  rounded
  py-2
  px-4
  h-12
`;

export const Select = tw.select`
  border-2
  border-gray-300
  dark:border-gray-600
  dark:bg-gray-900
  border-solid
  rounded
  py-2
  px-4
  m-0
  h-12
`;

export const Button = tw.button`
  bg-green-500
  text-white
  py-2
  px-4
  rounded
  font-bold
  mr-2
  transition-all
  duration-300
  hover:bg-green-600
  focus:outline-none
  focus:shadow-outline
`;

export const Details = tw.details`
  border-2
  border-gray-300
  dark:border-gray-600
  dark:bg-gray-900
  border-solid
  rounded
  py-2
  px-4
  m-0
`;

export const Summary = tw.summary`
  cursor-pointer
  py-2
`;

export const Container = tw.div`
  max-w-prose
  mx-auto
  my-4
  lg:my-16
`;
