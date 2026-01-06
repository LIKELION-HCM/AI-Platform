import { cleanJSON } from "./clean";

export function mapScanItem(data: any) {
  return {
    id: data.id,
    createdAt: data.matchingTime,
    cvName: data.candidateName || "Unnamed CV",
    jdName: data.jobTitle || undefined,
    data: cleanJSON(data.responseBody),
  };
}
