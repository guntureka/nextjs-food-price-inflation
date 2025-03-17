"use client";

import { MapProps } from "@/components/leaflet/map";
import dynamic from "next/dynamic";
import { useMemo } from "react";
export function MapCaller({ ...props }: MapProps) {
  const LazyMap = useMemo(
    () =>
      dynamic(() => import("@/components/leaflet/map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
      }),
    [],
  );
  return <LazyMap {...props} />;
}
