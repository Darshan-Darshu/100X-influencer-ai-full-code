import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCreatorsArray(text: string) {
  try {
    // Match content between `const creators = [` and the closing `];`
    const match = text.match(/const creators\s*=\s*(\[\s*[\s\S]*?\s*\]);/);
    if (!match || match.length < 2) {
      throw new Error("Creators array not found in the text.");
    }

    // Use eval to parse the matched array string safely
    const creatorsArray = eval(match[1]); // CAUTION: Use eval only in trusted environments

    return creatorsArray;
  } catch (error: any) {
    console.error("Error extracting creators array:", error.message);
    return [];
  }
}
