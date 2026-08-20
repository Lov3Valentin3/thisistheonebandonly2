import { pool } from "@/db";
let ready = false;
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS parents (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      password_hash text NOT NULL,
      invite_code text NOT NULL,
      response_mode text NOT NULL DEFAULT 'ai',
      plan text NOT NULL DEFAULT 'free',
      plan_status text NOT NULL DEFAULT 'trial',
      plan_renews_at timestamptz,
      share_opt_in boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS parents_email_idx ON parents (email)`,
  `CREATE TABLE IF NOT EXISTS children (
      id serial PRIMARY KEY,
      parent_id integer,
      first_name text NOT NULL,
      mailbox_name text NOT NULL,
      pin_hash text NOT NULL,
      age integer NOT NULL,
      favorite_color text NOT NULL,
      favorite_activity text NOT NULL,
      birthday text,
      elf_id integer,
      wishes text,
      timezone text NOT NULL DEFAULT 'America/New_York',
      last_seen_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS children_mailbox_idx ON children (mailbox_name)`,
  `CREATE TABLE IF NOT EXISTS elves (
      id serial PRIMARY KEY,
      slug text NOT NULL,
      name text NOT NULL,
      gender text NOT NULL,
      title text NOT NULL,
      bio text NOT NULL,
      personality text NOT NULL,
      hobbies text NOT NULL,
      job text NOT NULL,
      treat text NOT NULL,
      fun_fact text NOT NULL,
      greeting text NOT NULL,
      voice_notes text NOT NULL,
      accent_color text NOT NULL,
      hat_color text NOT NULL,
      tunic_color text NOT NULL,
      hair_color text NOT NULL,
      skin text NOT NULL,
      eyes text NOT NULL,
      accessory text NOT NULL,
      photo text,
      featured boolean NOT NULL DEFAULT false,
      active boolean NOT NULL DEFAULT true
    )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS elves_slug_idx ON elves (slug)`,
  `CREATE TABLE IF NOT EXISTS letters (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      elf_id integer NOT NULL,
      author text NOT NULL,
      subject text NOT NULL,
      body text NOT NULL,
      status text NOT NULL DEFAULT 'sent',
      seal_color text NOT NULL DEFAULT '#b11226',
      read_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS memories (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      kind text NOT NULL,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS videos (
      id serial PRIMARY KEY,
      slug text NOT NULL,
      title text NOT NULL,
      synopsis text NOT NULL,
      scene text NOT NULL,
      image text NOT NULL,
      duration text NOT NULL,
      premium boolean NOT NULL DEFAULT false
    )`,
  `CREATE TABLE IF NOT EXISTS child_videos (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      video_id integer NOT NULL,
      unlocked_at timestamptz NOT NULL DEFAULT now(),
      watched_at timestamptz
    )`,
  `CREATE TABLE IF NOT EXISTS certificates (
      id serial PRIMARY KEY,
      slug text NOT NULL,
      title text NOT NULL,
      description text NOT NULL,
      flourish text NOT NULL,
      premium boolean NOT NULL DEFAULT false,
      price_cents integer NOT NULL DEFAULT 0
    )`,
  `CREATE TABLE IF NOT EXISTS child_certificates (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      certificate_id integer NOT NULL,
      unlocked_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS games (
      id serial PRIMARY KEY,
      slug text NOT NULL,
      title text NOT NULL,
      description text NOT NULL,
      badge text NOT NULL,
      icon text NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS game_scores (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      game_slug text NOT NULL,
      score integer NOT NULL DEFAULT 0,
      stars integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS achievements (
      id serial PRIMARY KEY,
      child_id integer NOT NULL,
      code text NOT NULL,
      title text NOT NULL,
      detail text NOT NULL,
      earned_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS quotes (
      id serial PRIMARY KEY,
      line text NOT NULL,
      day_index integer NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS notifications (
      id serial PRIMARY KEY,
      parent_id integer NOT NULL,
      title text NOT NULL,
      body text NOT NULL,
      kind text NOT NULL,
      href text,
      read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
      id serial PRIMARY KEY,
      parent_id integer NOT NULL,
      plan text NOT NULL,
      status text NOT NULL,
      amount_cents integer NOT NULL,
      addons jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS sessions (
      id serial PRIMARY KEY,
      token_hash text NOT NULL,
      role text NOT NULL,
      parent_id integer,
      child_id integer,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS admins (
      id serial PRIMARY KEY,
      email text NOT NULL,
      name text NOT NULL,
      password_hash text NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS analytics_events (
      id serial PRIMARY KEY,
      name text NOT NULL,
      role text,
      meta text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
];
export async function ensureSchema() {
  if (ready) return;
  for (const statement of STATEMENTS) {
    await pool.query(statement);
  }
  ready = true;
}
