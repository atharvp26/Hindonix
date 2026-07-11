import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Hindonix for inquiries about architectural hardware, door handles, door knobs, and export/import services.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
