"use server";

import path from "path";
import { minioClient } from "../minio";

const bucketName = process.env.MINIO_BUCKET!;
const folderName = "geojson";

export async function createBucketIfNotExist() {
  try {
    const exist = await minioClient.bucketExists(bucketName);

    if (!exist) {
      await minioClient.makeBucket(bucketName);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadFile(file: File) {
  try {
    await createBucketIfNotExist();

    const ext = path.extname(file.name);

    const randomName = `${folderName}/${crypto.randomUUID()}${ext}`;

    const res = await minioClient.putObject(
      bucketName,
      randomName,
      Buffer.from(await file.arrayBuffer()),
    );

    const fileUrl = `http://localhost:9000/${bucketName}/${randomName}`;

    // return { key: randomName, url: fileUrl, res };
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFile(key: string) {
  try {
    const exist = await minioClient.bucketExists(bucketName);

    if (!exist) {
      throw new Error("Bucket doesn't exist");
    }

    const filename = `${folderName}/${key}`;

    const res = await minioClient.removeObject(bucketName, filename);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFiles(keys: string[]) {
  try {
    const exist = await minioClient.bucketExists(bucketName);

    if (!exist) {
      throw new Error("Bucket doesn't exist");
    }

    const filenames = keys.map((key) => `${folderName}/${key}`);

    const res = await minioClient.removeObjects(bucketName, filenames);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
