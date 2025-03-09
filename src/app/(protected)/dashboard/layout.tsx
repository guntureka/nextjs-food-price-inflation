import { BreadcrumbProvider } from "@/components/breadcrumb-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <BreadcrumbProvider />
      {children}
    </div>
  );
}
