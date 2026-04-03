import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdf = require("pdf-parse");

export const parsePDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF");
  }
};