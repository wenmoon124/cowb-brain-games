// @brainverse/ui — `cn` className helper.
//
// Combines `clsx` (conditional class composition) with `tailwind-merge`
// (dedupes conflicting Tailwind utilities so later classes win). Every
// component in this package routes its `className` prop through `cn`.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
