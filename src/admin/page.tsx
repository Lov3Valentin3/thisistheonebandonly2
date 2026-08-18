import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { children, elves, letters, parents, videos, certificates, quotes } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { Scene, TopBar } from "@/components/magic";
import { AdminAdd } from "@/components/forms";
export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  const [parentCount] = await db.select({ value: count() }).from(parents);
  const [childCount] = await db.select({ value: count() }).from(children);
  const [letterCount] = await db.select({ value: count() }).from(letters);
  const elfRows = await db.select().from(elves);
  const videoRows = await db.select().from(videos);
  const certRows = await db.select().from(certificates);
  const quoteRows = await db.select().from(quotes);
  return (
    <Scene image="/images/santa-office.jpg" overlay="bg-[#07040a]/80">
      <TopBar
        brandHref="/admin"
        right={
          <form action="/api/auth/admin/logout" method="post">
            <button className="btn btn-ghost" type="submit">
              Sign out
            </button>
          </form>
        }
      />
      <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-16">
        <section className="paper rounded-[32px] p-6">
          <h1 className="font-display text-4xl text-[#7a0c1a]">Workshop desk</h1>
          <p className="mt-2 text-sm">Keep the North Pole stocked. Kids never see this room.</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Stat label="Parents" value={parentCount.value} />
            <Stat label="Children" value={childCount.value} />
            <Stat label="Letters" value={letterCount.value} />
          </div>
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="font-display text-2xl">Add an elf</h2>
            <AdminAdd
              kind="elf"
              fields={[
                { name: "name", label: "Name" },
                { name: "slug", label: "slug" },
                { name: "gender", label: "boy or girl" },
                { name: "title", label: "Title" },
                { name: "bio", label: "Bio" },
              ]}
            />
            <p className="mt-3 text-xs text-white/60">{elfRows.length} elves in the village</p>
          </div>
          <div className="card p-5">
            <h2 className="font-display text-2xl">Add a video</h2>
            <AdminAdd
              kind="video"
              fields={[
                { name: "title", label: "Title" },
                { name: "slug", label: "slug" },
                { name: "synopsis", label: "Synopsis" },
                { name: "scene", label: "Narration" },
                { name: "image", label: "Image path" },
              ]}
            />
            <p className="mt-3 text-xs text-white/60">{videoRows.length} films</p>
          </div>
          <div className="paper rounded-[28px] p-5">
            <h2 className="font-display text-2xl text-[#7a0c1a]">Add a certificate</h2>
            <AdminAdd
              kind="certificate"
              fields={[
                { name: "title", label: "Title" },
                { name: "slug", label: "slug" },
                { name: "description", label: "Description" },
                { name: "flourish", label: "Flourish line" },
              ]}
            />
            <p className="mt-3 text-xs">{certRows.length} certificates</p>
          </div>
          <div className="paper rounded-[28px] p-5">
            <h2 className="font-display text-2xl text-[#7a0c1a]">Daily quote</h2>
            <AdminAdd kind="quote" fields={[{ name: "line", label: "Inspirational line" }]} />
            <p className="mt-3 text-xs">{quoteRows.length} quotes in rotation</p>
          </div>
        </section>
      </main>
    </Scene>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <div className="font-display text-2xl">{value}</div>
      <div className="text-xs uppercase tracking-[0.16em]">{label}</div>
    </div>
  );
}