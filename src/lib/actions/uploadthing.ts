"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const uploadFile = async (file: File) => {
  try {
    const res = await utapi.uploadFiles(file);

    if (res?.error) {
      throw new Error(res?.error?.message ?? "Unknown upload error");
    }

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadFiles = async (files: File[]) => {
  try {
    const res = await utapi.uploadFiles(files);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteFile = async (key: string) => {
  try {
    const res = await utapi.deleteFiles(key);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteFiles = async (keys: string[]) => {
  try {
    const res = await utapi.deleteFiles(keys);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
