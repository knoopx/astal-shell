const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatBytes(bytes: number): { value: string; unit: string } {
  if (!Number.isFinite(bytes) || bytes < 0 || bytes === 0)
    return { value: "0", unit: "B" };

  const i = Math.max(
    0,
    Math.min(
      BYTE_UNITS.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024)),
    ),
  );
  const scaled = bytes / Math.pow(1024, i);
  return { value: Math.round(scaled).toString(), unit: BYTE_UNITS[i] };
}
