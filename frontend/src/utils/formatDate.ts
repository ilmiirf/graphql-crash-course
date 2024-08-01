export function formatDate(timestamp: any) {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
