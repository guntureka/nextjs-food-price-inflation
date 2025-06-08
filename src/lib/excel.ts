import * as XLSX from "xlsx";

export async function importExcel(file: File) {
  const fileBuffer = await file.arrayBuffer();

  const wb = XLSX.read(fileBuffer);
  const ws = wb.Sheets[wb.SheetNames[0]];

  // Konversi sheet ke JSON dengan header
  const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

  // Fungsi untuk mengubah header menjadi camelCase
  const toCamelCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase(),
      )
      .replace(/\s+/g, "");

  // Ubah key setiap objek ke format camelCase
  rawData.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [toCamelCase(key), value]),
    ),
  );

  return rawData;
}

export function ExportExcel<T>(title: string, datas: T[]) {
  const ws = XLSX.utils.json_to_sheet(datas);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  return XLSX.writeFile(wb, `${title}.xlsx`, { compression: true });
}
