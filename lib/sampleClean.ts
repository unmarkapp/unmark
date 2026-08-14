/** Bundled Gemini-style still with a real sparkle in the official 1K corner. */
export const SAMPLE_CLEAN_PATH = "/demo/sample-clean-before.jpg";
export const SAMPLE_CLEAN_FILENAME = "unmark-sample-gemini.jpg";

export function isSampleCleanFile(file: File | null | undefined): boolean {
  return file?.name === SAMPLE_CLEAN_FILENAME;
}

export async function fetchSampleCleanFile(): Promise<File> {
  const response = await fetch(SAMPLE_CLEAN_PATH);
  if (!response.ok) {
    throw new Error("Could not load the sample image.");
  }
  const blob = await response.blob();
  const type = blob.type || "image/jpeg";
  return new File([blob], SAMPLE_CLEAN_FILENAME, { type });
}
