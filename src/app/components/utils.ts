import { Category } from "./data";

export function getDaysUntil(deadline: string): number {
  const today = new Date("2026-06-02");
  const d = new Date(deadline);
  const diff = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function categoryColor(cat: Category): string {
  switch (cat) {
    case "IT":
      return "bg-blue-100 text-blue-700";
    case "Desain":
      return "bg-purple-100 text-purple-700";
    case "Bisnis":
      return "bg-orange-100 text-orange-700";
    case "Seni":
      return "bg-pink-100 text-pink-700";
    case "Akademik":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
