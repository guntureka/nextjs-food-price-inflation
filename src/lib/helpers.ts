export function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .toLowerCase();
}

export const getFileKey = (url: string) => {
  return url.split("/").pop();
};
