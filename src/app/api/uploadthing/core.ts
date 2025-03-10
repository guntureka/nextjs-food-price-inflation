import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const OurFileRouter = {
  imageUploader: f(["image"]).onUploadComplete(async ({ file }) => {
    return {
      ...file,
    };
  }),
  fileUploader: f(["blob"]).onUploadComplete(async ({ file }) => {
    return {
      ...file,
    };
  }),
} satisfies FileRouter;

export type UploadRouter = typeof OurFileRouter;
