import AppGuard from "@/components/AppGuard";

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppGuard>{children}</AppGuard>;
}
