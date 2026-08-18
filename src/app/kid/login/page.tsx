import Link from "next/link";
import { redirect } from "next/navigation";
import { MagicForm } from "@/components/forms";
import { Scene, TopBar } from "@/components/magic";
import { getChildSession } from "@/lib/auth";
export const metadata = { title: "Kid Login" };
export default async function KidLoginPage() {
  const child = await getChildSession();
  if (child) redirect(child.elfId ? "/kid/dashboard" : "/kid/choose-elf");
  return (
    <Scene image="/images/window-display.jpg">
      <TopBar />
      <main className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-5 pb-16">
        <div className="paper w-full rounded-[32px] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Kid mailbox</p>
          <h1 className="font-display mt-2 text-3xl text-[#14532d]">Kid Login</h1>
          <p className="mt-2 text-sm text-[#5b3a24]">Type your mailbox name and secret 4-digit PIN.</p>
          <div className="mt-6">
            <MagicForm
              action="/api/auth/kid/login"
              submit="Open my mailbox"
              fields={[
                { name: "mailboxName", label: "Mailbox name", placeholder: "noel1225" },
                { name: "pin", label: "Magic PIN", placeholder: "1225" },
              ]}
            />
          </div>
          <p className="mt-4 text-sm text-[#5b3a24]">
            First visit? <Link className="font-bold underline" href="/kid/register">Kid register</Link>
          </p>
        </div>
      </main>
    </Scene>
  );