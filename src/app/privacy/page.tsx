import { Scene, TopBar } from "@/components/magic";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <Scene image="/images/village-night.jpg">
      <TopBar />
      <main className="mx-auto max-w-3xl px-5 pb-16">
        <article className="paper rounded-[32px] p-7">
          <h1 className="font-display text-3xl text-[#7a0c1a]">Privacy</h1>
          <div className="mt-4 space-y-3 text-sm leading-7">
            <p>North Pole Post is built for families. We store parent accounts, child first names, mailbox names, letters, game badges, and preferences so the friendship can continue across devices.</p>
            <p>Children sign in with a mailbox name and PIN, not an email address. Parents can read every letter.</p>
            <p>We do not sell children&apos;s letters. Passwords and PINs are stored as one-way secrets.</p>
          </div>
        </article>
      </main>
    </Scene>
  );
}