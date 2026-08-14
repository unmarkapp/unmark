"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/components/Toast";
import { isFileDrag, mediaFilesFromList } from "@/lib/mediaFiles";

interface DropToCleanContextValue {
  pendingId: number;
  consumePendingFiles: () => File[] | null;
  isDragging: boolean;
}

const DropToCleanContext = createContext<DropToCleanContextValue | null>(null);

export function DropToCleanProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [pendingId, setPendingId] = useState(0);
  const pendingFiles = useRef<File[] | null>(null);
  const dragDepth = useRef(0);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const consumePendingFiles = useCallback(() => {
    const files = pendingFiles.current;
    pendingFiles.current = null;
    return files && files.length > 0 ? files : null;
  }, []);

  const offerFiles = useCallback(
    (files: File[]) => {
      pendingFiles.current = files;
      setPendingId((id) => id + 1);
      if (pathnameRef.current !== "/") {
        router.push("/#upload");
      } else {
        document.getElementById("upload")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [router],
  );

  useEffect(() => {
    const onDragEnter = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    };

    const onDragLeave = (event: DragEvent) => {
      if (!(event.relatedTarget instanceof Node)) {
        dragDepth.current = 0;
        setIsDragging(false);
        return;
      }
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) {
        setIsDragging(false);
      }
    };

    const onDrop = (event: DragEvent) => {
      if (!isFileDrag(event) && !(event.dataTransfer?.files?.length)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dragDepth.current = 0;
      setIsDragging(false);

      const files = mediaFilesFromList(event.dataTransfer?.files, 10);
      if (files.length === 0) {
        toast("Drop a Gemini image or video to Clean.", "error");
        return;
      }
      offerFiles(files);
    };

    document.addEventListener("dragenter", onDragEnter, true);
    document.addEventListener("dragover", onDragOver, true);
    document.addEventListener("dragleave", onDragLeave, true);
    document.addEventListener("drop", onDrop, true);

    return () => {
      document.removeEventListener("dragenter", onDragEnter, true);
      document.removeEventListener("dragover", onDragOver, true);
      document.removeEventListener("dragleave", onDragLeave, true);
      document.removeEventListener("drop", onDrop, true);
    };
  }, [offerFiles, toast]);

  const value = useMemo(
    () => ({ pendingId, consumePendingFiles, isDragging }),
    [pendingId, consumePendingFiles, isDragging],
  );

  return (
    <DropToCleanContext.Provider value={value}>
      {children}
      {isDragging ? (
        <div
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-background/80 px-6 backdrop-blur-[2px]"
          aria-hidden
        >
          <div className="max-w-md border-2 border-dashed border-brand bg-cream px-8 py-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              Drop to Clean
            </p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
              Gemini images or video
            </p>
            <p className="mt-2 text-sm text-muted">
              Release to send this to the upload section. Up to 10 images, or
              one video.
            </p>
          </div>
        </div>
      ) : null}
    </DropToCleanContext.Provider>
  );
}

export function useDropToClean() {
  const value = useContext(DropToCleanContext);
  if (!value) {
    throw new Error("useDropToClean must be used within DropToCleanProvider");
  }
  return value;
}
