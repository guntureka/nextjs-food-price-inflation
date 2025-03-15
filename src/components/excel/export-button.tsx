"use client";

import { ExportExcel } from "@/lib/excel";
import { NestedKey } from "@/lib/types";
import { Button } from "../ui/button";

const getNestedValue = (obj: Record<string, any>, key: string): any => {
  return key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
};

interface ExportButtonProps<TData> {
  title?: string;
  datas: TData[];
  fields?: NestedKey<TData>[];
}

export function ExportButton<TData>({
  title,
  datas,
  fields,
}: ExportButtonProps<TData>) {
  const onClick = () => {
    let filteredData: Record<string, any>[] = datas as Record<string, any>[];

    if (fields) {
      filteredData = datas.map((item) =>
        Object.fromEntries(
          fields.map((key) => {
            const value = getNestedValue(
              item as Record<string, any>,
              key as string,
            );
            const newKey = (key as string).split(".")[0];
            return [newKey, value] as [string, any];
          }),
        ),
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
