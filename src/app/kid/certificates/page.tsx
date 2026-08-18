import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { certificates, childCertificates } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { Scene, TopBar } from "@/components/magic";
export const metadata = { title: "Certificates" };
export const dynamic = "force-dynamic";
export default async function CertificatesPage() {
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  const catalog = await db.select().from(certificates);
  const unlocked = await db.select().from(childCertificates).where(eq(childCertificates.childId, child.id));
  return (
    <Scene image="/images/certificate-bg.jpg" overlay="bg-[#07040a]/70">
      <TopBar brandHref="/kid/dashboard" />
      <main className="mx-auto max-w-5xl px-5 pb-16">
        <h1 className="font-display text-4xl">Certificates</h1>
        <p className="mt-2 text-white/75">Awards you can print and hang on the fridge — or on the workshop door.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {catalog.map((cert) => {
            const open = unlocked.some((row) => row.certificateId === cert.id);
            return (
              <article key={cert.id} className="paper rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a32]">{cert.premium ? "Special award" : "Workshop award"}</p>
                <h2 className="font-display mt-2 text-2xl text-[#7a0c1a]">{cert.title}</h2>
                <p className="mt-2 text-sm">{cert.description}</p>
                {open ? (
                  <Link className="btn btn-green mt-4" href={`/kid/certificates/${cert.slug}`}>
                    Open & print
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-[#8a5a32]">
                    {cert.premium ? "Ask a parent to unlock this special award." : "Write a letter to unlock this one."}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </Scene>
  );
}