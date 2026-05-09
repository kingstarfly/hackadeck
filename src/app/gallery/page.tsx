import { redirect } from "next/navigation";
import type { Route } from "next";

export default function GalleryPage() {
  redirect("/events/ai-engineer-hack-2026" as Route);
}
