import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export const parents = pgTable(
  "parents",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    inviteCode: text("invite_code").notNull(),
    responseMode: text("response_mode").notNull().default("ai"),
    plan: text("plan").notNull().default("free"),
    planStatus: text("plan_status").notNull().default("trial"),
    planRenewsAt: timestamp("plan_renews_at", { withTimezone: true }),
    shareOptIn: boolean("share_opt_in").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("parents_email_idx").on(table.email)],
);
export const children = pgTable(
  "children",
  {
    id: serial("id").primaryKey(),
    parentId: integer("parent_id"),
    firstName: text("first_name").notNull(),
    mailboxName: text("mailbox_name").notNull(),
    pinHash: text("pin_hash").notNull(),
    age: integer("age").notNull(),
    favoriteColor: text("favorite_color").notNull(),
    favoriteActivity: text("favorite_activity").notNull(),
    birthday: text("birthday"),
    elfId: integer("elf_id"),
    wishes: text("wishes"),
    timezone: text("timezone").notNull().default("America/New_York"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("children_mailbox_idx").on(table.mailboxName)],
);
export const elves = pgTable(
  "elves",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    gender: text("gender").notNull(),
    title: text("title").notNull(),
    bio: text("bio").notNull(),
    personality: text("personality").notNull(),
    hobbies: text("hobbies").notNull(),
    job: text("job").notNull(),
    treat: text("treat").notNull(),
    funFact: text("fun_fact").notNull(),
    greeting: text("greeting").notNull(),
    voiceNotes: text("voice_notes").notNull(),
    accentColor: text("accent_color").notNull(),
    hatColor: text("hat_color").notNull(),
    tunicColor: text("tunic_color").notNull(),
    hairColor: text("hair_color").notNull(),
    skin: text("skin").notNull(),
    eyes: text("eyes").notNull(),
    accessory: text("accessory").notNull(),
    photo: text("photo"),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
  },
  (table) => [uniqueIndex("elves_slug_idx").on(table.slug)],
);
export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  elfId: integer("elf_id").notNull(),
  author: text("author").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("sent"),
  sealColor: text("seal_color").notNull().default("#b11226"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  kind: text("kind").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  scene: text("scene").notNull(),
  image: text("image").notNull(),
  duration: text("duration").notNull(),
  premium: boolean("premium").notNull().default(false),
});
export const childVideos = pgTable("child_videos", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  videoId: integer("video_id").notNull(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
  watchedAt: timestamp("watched_at", { withTimezone: true }),
});
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  flourish: text("flourish").notNull(),
  premium: boolean("premium").notNull().default(false),
  priceCents: integer("price_cents").notNull().default(0),
});
export const childCertificates = pgTable("child_certificates", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  certificateId: integer("certificate_id").notNull(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
});
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  badge: text("badge").notNull(),
  icon: text("icon").notNull(),
});
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  gameSlug: text("game_slug").notNull(),
  score: integer("score").notNull().default(0),
  stars: integer("stars").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
});
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  line: text("line").notNull(),
  dayIndex: integer("day_index").notNull(),
});
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: text("kind").notNull(),
  href: text("href"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull(),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  amountCents: integer("amount_cents").notNull(),
  addons: jsonb("addons").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  role: text("role").notNull(),
  parentId: integer("parent_id"),
  childId: integer("child_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
});
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  meta: text("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});