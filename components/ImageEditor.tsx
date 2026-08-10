"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Image as KonvaImage,
  Layer,
  Rect,
  Stage,
} from "react-konva";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageEditorProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  onSelectionChange?: (selection: Selection | null) => void;
}

export default function ImageEditor({
  imageUrl,
  imageWidth,
  imageHeight,
  onSelectionChange,
}: ImageEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Fit full image inside the card — never crop top/bottom/sides.
  const maxWidth = Math.max(containerWidth, 320);
  const maxHeight =
    typeof window === "undefined"
      ? 700
      : Math.min(Math.round(window.innerHeight * 0.7), 900);

  const scale = Math.min(
    maxWidth / imageWidth,
    maxHeight / imageHeight,
    1,
  );

  const stageWidth = Math.max(1, Math.round(imageWidth * scale));
  const stageHeight = Math.max(1, Math.round(imageHeight * scale));

  useLayoutEffect(() => {
    const el = containerRef.current;

    if (!el) {
      return;
    }

    const update = () => {
      setContainerWidth(el.clientWidth);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const img = new window.Image();

    img.onload = () => {
      setImage(img);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  useEffect(() => {
    setSelection(null);
  }, [imageUrl]);

  const handleMouseDown = (
    event: Parameters<
      NonNullable<
        React.ComponentProps<typeof Stage>["onMouseDown"]
      >
    >[0],
  ) => {
    const stage = event.target.getStage();

    if (!stage) {
      return;
    }

    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    startPoint.current = {
      x: pointer.x,
      y: pointer.y,
    };

    setSelection(null);
    onSelectionChange?.(null);
  };

  const handleMouseMove = (
    event: Parameters<
      NonNullable<
        React.ComponentProps<typeof Stage>["onMouseMove"]
      >
    >[0],
  ) => {
    if (!startPoint.current) {
      return;
    }

    const stage = event.target.getStage();

    if (!stage) {
      return;
    }

    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    const start = startPoint.current;

    const x = Math.max(0, Math.min(start.x, pointer.x));
    const y = Math.max(0, Math.min(start.y, pointer.y));

    const right = Math.min(
      stageWidth,
      Math.max(start.x, pointer.x),
    );

    const bottom = Math.min(
      stageHeight,
      Math.max(start.y, pointer.y),
    );

    const displaySelection = {
      x,
      y,
      width: right - x,
      height: bottom - y,
    };

    setSelection(displaySelection);

    onSelectionChange?.({
      x: Math.round(x / scale),
      y: Math.round(y / scale),
      width: Math.round(displaySelection.width / scale),
      height: Math.round(displaySelection.height / scale),
    });
  };

  const handleMouseUp = () => {
    startPoint.current = null;
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex w-full justify-center">
        <div
          className="rounded-xl border border-brand-line bg-ink"
          style={{
            width: stageWidth,
            height: stageHeight,
          }}
        >
          {image && containerWidth > 0 && (
            <Stage
              width={stageWidth}
              height={stageHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Layer>
                <KonvaImage
                  image={image}
                  width={stageWidth}
                  height={stageHeight}
                />

                {selection && (
                  <Rect
                    x={selection.x}
                    y={selection.y}
                    width={selection.width}
                    height={selection.height}
                    stroke="white"
                    strokeWidth={2}
                    dash={[8, 4]}
                    fill="rgba(255,255,255,0.15)"
                  />
                )}
              </Layer>
            </Stage>
          )}
        </div>
      </div>
    </div>
  );
}
