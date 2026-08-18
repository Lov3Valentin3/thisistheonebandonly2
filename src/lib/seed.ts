import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  admins,
  certificates,
  children,
  elves,
  games,
  letters,
  parents,
  quotes,
  videos,
} from "@/db/schema";
import { CERTIFICATE_SEEDS, ELF_SEEDS, GAME_SEEDS, QUOTE_SEEDS, VIDEO_SEEDS } from "@/lib/catalog";
import { hashSecret } from "@/lib/crypto";
let seeded = false;
export async function ensureSeeded() {
  if (seeded) return;
  const [elfCount] = await db.select({ value: count() }).from(elves);
  if ((elfCount?.value ?? 0) === 0) {
    await db.insert(elves).values(
      ELF_SEEDS.map((elf) => ({
        ...elf,
        photo: elf.photo ?? null,
        featured: Boolean(elf.featured),
        active: true,
      })),
    );
  }
  const [quoteCount] = await db.select({ value: count() }).from(quotes);
  if ((quoteCount?.value ?? 0) === 0) {
    await db.insert(quotes).values(QUOTE_SEEDS.map((line, index) => ({ line, dayIndex: index })));
  }
  const [videoCount] = await db.select({ value: count() }).from(videos);
  if ((videoCount?.value ?? 0) === 0) {
    await db.insert(videos).values(VIDEO_SEEDS);
  }
  const [certCount] = await db.select({ value: count() }).from(certificates);
  if ((certCount?.value ?? 0) === 0) {
    await db.insert(certificates).values(CERTIFICATE_SEEDS);
  }
  const [gameCount] = await db.select({ value: count() }).from(games);
  if ((gameCount?.value ?? 0) === 0) {
    await db.insert(games).values(GAME_SEEDS);
  }
  const [adminCount] = await db.select({ value: count() }).from(admins);
  if ((adminCount?.value ?? 0) === 0) {
    await db.insert(admins).values({
      email: "admin@northpole.mail",
      name: "Workshop Keeper",
      passwordHash: hashSecret("Workshop123!"),
    });
  }
  const [parentCount] = await db.select({ value: count() }).from(parents);
  if ((parentCount?.value ?? 0) === 0) {
    const [parent] = await db
      .insert(parents)
      .values({
        name: "Demo Parent",
        email: "parent@northpole.mail",
        passwordHash: hashSecret("Christmas123!"),
        inviteCode: "DEMO42",
        responseMode: "ai",
        plan: "annual",
        planStatus: "active",
      })
      .returning();
    const [jingle] = await db.select().from(elves).where(eq(elves.slug, "jingle")).limit(1);
    const [child] = await db
      .insert(children)
      .values({
        parentId: parent.id,
        firstName: "Noel",
        mailboxName: "noel1225",
        pinHash: hashSecret("1225"),
        age: 7,
        favoriteColor: "green",
        favoriteActivity: "decorating the tree",
        birthday: "12-12",
        elfId: jingle?.id,
        wishes: "a wooden train and more snow days",
      })
      .returning();
    if (jingle) {
      await db.insert(letters).values([
        {
          childId: child.id,
          elfId: jingle.id,
          author: "elf",
          subject: "A letter already waiting",
          body: `Dear Noel,\n\nMy mittens are still sparkly from sledding, and I could not wait another snowflake to write you. I heard you love decorating the tree — same here! Last night I hung a tiny green ornament that reminded me of you.\n\nWill you be my pen pal? Tell me what you did today, even the small stuff. I collect small stuff the way other elves collect gumdrops.\n\nYour friend at the North Pole,\nJingle`,
          status: "sent",
          sealColor: "#15803d",
        },
      ]);
    }
  }
  seeded = true;
}
