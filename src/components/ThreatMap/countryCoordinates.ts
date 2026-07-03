export interface Coordinate {
  x: number;
  y: number;
  label: string;
}

export const countryCoordinates: Record<string, Coordinate> = {
  "USA": { x: 14, y: 38, label: "Washington D.C." },
  "Canada": { x: 12, y: 28, label: "Ottawa" },
  "United Kingdom": { x: 42, y: 30, label: "London" },
  "Germany": { x: 46, y: 34, label: "Berlin" },
  "Ukraine": { x: 50, y: 33, label: "Kyiv" },
  "Russia": { x: 55, y: 28, label: "Moscow" },
  "Egypt": { x: 51, y: 48, label: "Cairo" },
  "Nigeria": { x: 46, y: 58, label: "Lagos" },
  "South Africa": { x: 52, y: 74, label: "Cape Town" },
  "India": { x: 68, y: 48, label: "New Delhi" },
  "China": { x: 76, y: 38, label: "Beijing" },
  "Japan": { x: 86, y: 38, label: "Tokyo" },
  "Philippines": { x: 82, y: 52, label: "Manila" },
  "Indonesia": { x: 78, y: 62, label: "Jakarta" },
  "Australia": { x: 88, y: 74, label: "Canberra" },
  "Brazil": { x: 30, y: 64, label: "Brasilia" },
  "Iceland": { x: 38, y: 24, label: "Reykjavik" }
};
