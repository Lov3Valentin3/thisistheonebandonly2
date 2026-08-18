import { redirect } from "next/navigation";
import { MagicForm } from "@/components/forms";
import { Scene, TopBar } from "@/components/magic";
import { getAdminSession } from "@/lib/auth";
export const metadata = { title: "Workshop Keeper" };
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <Scene image="/images/santa-office.jpg">
      <TopBar />
      <main className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-5">
        <div className="paper w-full rounded-[32px] p-7">
          <h1 className="font-display text-3xl text-[#7a0c1a]">Workshop Keeper</h1>
          <p className="mt-2 text-sm">For adding elves, films, quotes, and certificates.</p>
          <div className="mt-5">
            <MagicForm
              action="/api/auth/admin/login"
              next="/admin"
              submit="Enter the office"
              fields={[
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Password", type: "password" },
              ]}
            />
          </div>
        </div>
      </main>
    </Scene>
  );
}
