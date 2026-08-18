import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { certificates, childCertificates, elves } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function CertificatePrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  const [cert] = await db.select().from(certificates).where(eq(certificates.slug, slug)).limit(1);
  if (!cert) notFound();
  const unlocked = await db.select().from(childCertificates).where(eq(childCertificates.childId, child.id));
  if (!unlocked.some((row) => row.certificateId === cert.id)) redirect("/kid/certificates");
  const elf = child.elfId ? (await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1))[0] : null;
  return (
    <main className="min-h-screen bg-[#fffaf0] px-4 py-8 text-[#3b2416]">
      <div className="no-print mx-auto mb-6 flex max-w-3xl justify-between">
        <Link className="btn btn-ghost !text-[#3b2416]" href="/kid/certificates">
          Back
        </Link>
        <button className="btn btn-gold" type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <Printable name={child.firstName} certTitle={cert.title} flourish={cert.flourish} elfName={elf?.name || "an elf"} />
    </main>
  );
}
function Printable({
  name,
  certTitle,
  flourish,
  elfName,
}: {
  name: string;
  certTitle: string;
  flourish: string;
  elfName: string;
}) {
  return (
    <section
      className="mx-auto min-h-[720px] max-w-3xl rounded-[28px] border-[10px] border-[#7a0c1a] p-10 text-center shadow-2xl"
      style={{
        backgroundImage: "url(/images/certificate-bg.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="rounded-[18px] bg-[#fffaf0]/88 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a5a32]">North Pole Post</p>
        <h1 className="font-display mt-3 text-4xl text-[#7a0c1a]">{certTitle}</h1>
        <p className="mt-6 text-sm uppercase tracking-[0.2em]">Presented with twinkle-light pride to</p>
        <p className="font-script mt-2 text-6xl text-[#14532d]">{name}</p>
        <p className="font-letter mx-auto mt-6 max-w-lg text-xl leading-8">{flourish}</p>
        <p className="mt-8 text-sm">Witnessed by {elfName} in Santa&apos;s workshop</p>
        <div className="mt-10 flex items-center justify-between px-6 text-xs uppercase tracking-[0.18em]">
          <span>Wax seal affixed</span>
          <span>Official friend forever</span>
        </div>
      </div>
    </section>
  );
}