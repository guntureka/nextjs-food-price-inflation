"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer, Tooltip } from "react-leaflet";

// Fix untuk marker icons di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});
interface SIGMapProps {
  data: {
    countries: {
      id: string;
      name: string;
      currency: string;
      geojson: any;
    }[];
    prices: {
      id: string;
      food: {
        id: string;
        name: string;
      } | null;
      inflation: number | null | string;
      close: number | null;
      countryId: string;
    }[];
  };
}

export default function SIGMap({ data }: SIGMapProps) {
  const { countries, prices } = data;

  const getColor = (value: number | null | string | undefined) => {
    if (value === null || value === undefined || value === "N/A")
      return "#cccccc";

    const inflation = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(inflation)) return "#cccccc";

    if (inflation < 0) return "#00cc00"; // hijau gelap, inflasi negatif
    if (inflation >= 0 && inflation <= 20) return "#99ff99"; // hijau muda
    if (inflation > 20 && inflation <= 40) return "#ffff00"; // kuning
    if (inflation > 40 && inflation <= 60) return "#ffcc00"; // oranye
    if (inflation > 60 && inflation <= 80) return "#ff6600"; // oranye gelap
    if (inflation > 80) return "#ff0000"; // merah

    return "#cccccc"; // fallback warna abu-abu
  };

  const getPriceInfo = (countryId: string) => {
    return prices.find((p) => p.countryId === countryId) || null;
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm font-medium">
        <LegendItem color="#00cc00" label="Inflasi Negatif" />
        <LegendItem color="#99ff99" label="0 - 20%" />
        <LegendItem color="#ffff00" label="21 - 40%" />
        <LegendItem color="#ffcc00" label="41 - 60%" />
        <LegendItem color="#ff6600" label="61 - 80%" />
        <LegendItem color="#ff0000" label="> 80%" />
        <LegendItem color="#cccccc" label="Data Tidak Tersedia" />
      </div>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        // scrollWheelZoom={false}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countries.map((country, i) => {
          const price = getPriceInfo(country.id);
          const color = getColor(price?.inflation);

          return (
            <GeoJSON
              key={i}
              data={country.geojson}
              style={{
                fillColor: color,
                weight: 1,
                color: "#999",
                fillOpacity: 0.7,
              }}
            >
              <Tooltip sticky>
                <div className="text-sm">
                  <strong>{country.name.toUpperCase()}</strong>
                  <div>
                    <strong>{price?.food?.name ?? "N/A"}</strong>
                  </div>
                  <div>Currency: {country.currency ?? "N/A"}</div>
                  <div>Price: {price?.close ?? "N/A"}</div>
                  <div>
                    <p>
                      Inflation:{" "}
                      {price?.inflation != null
                        ? `${price.inflation} %`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Tooltip>
            </GeoJSON>
          );
        })}
      </MapContainer>
    </>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-6 w-6 rounded border border-gray-400"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
