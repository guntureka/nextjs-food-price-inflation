"use client";

import { ExportExcel } from "@/lib/excel";
import { Button } from "../ui/button";

interface ExportButtonProps<T> {
  title?: string;
  datas: T[];
  fields?: (keyof T)[];
}

export function ExportButton<T>({
  title,
  datas,
  fields,
}: ExportButtonProps<T>) {
  const onClick = () => {
    let filteredData: any[] = datas;

    if (fields) {
      filteredData = datas.map((item) =>
        Object.fromEntries(fields.map((key) => [key, item[key]])),
      );
    }

    return ExportExcel(title ?? "data", filteredData);
  };
  return (
    <Button onClick={onClick} disabled={datas.length < 1}>
      Export
    </Button>
  );
}
