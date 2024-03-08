import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import DataResponse from "./data-response";
import { CardDescription, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard | Next-Fullstack",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "admin") {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="items-start flex flex-col">
        <CardTitle className="text-3xl font-bold tracking-tight xs:hidden sm:block">
          Dashboard
        </CardTitle>
        <CardDescription className="xs:hidden sm:block">
          This page is only accessible to admin users, and will display user data.
        </CardDescription>
      </div>
      <div className="container mx-auto py-10 !px-0">
        <DataResponse />
      </div>
    </main>
  );
}
