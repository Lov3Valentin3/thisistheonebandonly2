import Link from "next/link";
import { redirect } from "next/navigation";
import { MagicForm } from "@/components/forms";
import { Scene, TopBar } from "@/components/magic";
import { getParentSession } from "@/lib/auth";
export const metadata = { title: "Parent Register" };
export default async function ParentRegisterPage() {
  if (await getParentSession()) redirect("/parent/dashboard");
  return (
    <Scene image="/images/village-night.jpg">
      <TopBar />
      <main className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-5 pb-16">
        <div className="paper w-full rounded-[32px] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Family door</p>
          <h1 className="font-display mt-2 text-3xl text-[#7a0c1a]">Parent Register</h1>
          <p className="mt-2 text-sm text-[#5b3a24]">Create a grown-up key so you can watch over the mailbox.</p>
          <div className="mt-6">
            <MagicForm
              action="/api/auth/parent/register"
              next="/parent/dashboard"
              submit="Create family account"
              fields={[
                { name: "name", label: "Your name" },
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Password", type: "password" },
              ]}
            />
          </div>
          <p className="mt-4 text-sm text-[#5b3a24]">
            Already registered? <Link className="font-bold underline" href="/parent/login">Parent login</Link>
          </p>
        </div>
      </main>
    </Scene>
  );
}