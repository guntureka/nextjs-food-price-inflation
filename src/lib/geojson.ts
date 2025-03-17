import { FeatureCollection } from "geojson";

export async function readGeojsonFile(file: File) {
  try {
    const fileToText = await file.text();
    const geojson: FeatureCollection = JSON.parse(fileToText);

    if (!geojson?.type || geojson.type !== "FeatureCollection") {
      throw new Error("Invalid GeoJSON format");
    }

    return geojson;
  } catch (error) {
    console.error("Error reading GeoJSON file:", error);
    throw error;
  }
}
