export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return /\.(mp4|mov|webm|m4v)$/i.test(file.name);
}

export function isMediaFile(file: File): boolean {
  return isImageFile(file) || isVideoFile(file);
}

export function mediaFilesFromList(
  list: FileList | File[] | null | undefined,
  limit = 10,
): File[] {
  if (!list) return [];
  return Array.from(list).filter(isMediaFile).slice(0, limit);
}

export function isFileDrag(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}
