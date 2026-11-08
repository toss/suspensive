import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SuspenseQuery } from "@suspensive/react-query";
import { useState } from "react";

export const options = queryOptions({ queryKey: ["a"] });
export function useA() {
  return useSuspenseQuery(options);
}
export class Store {}
export type Id = string;
export { useState as useS } from "react";
export { useSuspenseQuery } from "@tanstack/react-query";
export { SuspenseQuery } from "@suspensive/react-query";
