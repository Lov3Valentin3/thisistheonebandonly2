import Link from "next/link";
import { redirect } from "next/navigation";
import { MagicForm } from "@/components/forms";
import { Scene, TopBar } from "@/components/magic";
import { getParentSession } from "@/lib/auth";
export const metadata = { title: "Parent Login" };
export default async function ParentLoginPage() {
  if (await getParentSession()) redirect("/parent/dashboard");
  return (
    <Scene image="/images/cabin-lights.jpg">
      <TopBar />
      <main className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-5 pb-16">
        <div className="paper w-full rounded-[32px] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Family door</p>
          <h1 className="font-display mt-2 text-3xl text-[#7a0c1a]">Parent Login</h1>
          <p className="mt-2 text-sm text-[#5b3a24]">A quiet door for grown-ups. The magic stays on the other side.</p>
          <div className="mt-6">
            <MagicForm
              action="/api/auth/parent/login"
              submit="Open the family door"
              onSuccess={() => undefined}
              fields={[
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Password", type: "password" },
              ]}
            />
          </div>
          <p className="mt-4 text-sm text-[#5b3a24]">
            New here? <Link className="font-bold underline" href="/parent/register">Create a parent account</Link>
          </p>
          <p className="mt-3 text-xs text-[#8a5a32]">Preview mailbox: parent@northpole.mail / Christmas123!</p>
        </div>
      </main>
    </Scene>
  );
}