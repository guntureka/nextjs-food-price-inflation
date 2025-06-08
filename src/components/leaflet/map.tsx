"use client";

import "@/lib/leaflet-setup";
import type { Feature, FeatureCollection } from "geojson";
import { Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, TileLayer, Tooltip } from "react-leaflet";

export interface MapProps {
  datas?:
    | {
        data?: Record<string, any>;
        geojson?: FeatureCollection | null;
      }[]
    | null;
}

export function Map({ datas }: MapProps) {
  const router = useRouter();

  const onEachFeature = (feature: Feature, layer: Layer, id?: string) => {
    if (!id) return;

    layer.on("click", () => {
      router.push(`/country/${id}`);
    });
  };
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {datas &&
        datas.map(
          (v) =>
            v.geojson && (
              <GeoJSON
                key={v.geojson.features[0].id}
                data={v.geojson}
                markersInheritOptions={true}
                onEachFeature={(feature, layer) =>
                  onEachFeature(feature.properties, layer, v.data?.id)
                }
              >
                {v.data && <Tooltip direction="top">{v.data.name}</Tooltip>}
              </GeoJSON>
            ),
        )}
    </MapContainer>
  );
}

export default Map;
