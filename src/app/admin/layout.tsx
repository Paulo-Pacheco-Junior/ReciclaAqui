import { getCurrentAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}