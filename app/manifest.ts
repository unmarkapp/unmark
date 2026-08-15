import type { MetadataRoute } from "next";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

const IMAGE_ACCEPT = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/*",
];

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_TAGLINE,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F4F0E6",
    theme_color: "#D61C0D",
    categories: ["photo", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Clean watermark",
        short_name: "Clean",
        description: "Remove the Gemini sparkle from an image or video",
        url: "/",
      },
      {
        name: "Remove background",
        short_name: "Cutout",
        description: "Cut out the subject as a transparent PNG",
        url: "/tools/background-removal",
      },
    ],
    share_target: {
      action: "/share-target",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        title: "title",
        text: "text",
        url: "url",
        files: [
          {
            name: "media",
            accept: IMAGE_ACCEPT,
          },
        ],
      },
    },
    file_handlers: [
      {
        action: "/share",
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
          "image/webp": [".webp"],
          "image/gif": [".gif"],
        },
      },
    ],
  };
}
