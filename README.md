# North Pole Post
A magical Christmas pen-pal app for kids ages 3–12. Children write letters to an elf at the North Pole. Parents keep a private family door. The same project works as a website, a phone home-screen app, and a simple `index.html` preview.
This README is written so you can finish setup **from a phone**.
## What you already have
- Magical landing page (one letter from Jingle, no spoiler language)
- Kid register / login, 20 elves, letters, inbox, videos, certificates, games
- Parent portal, plans, notifications, sharing
- Workshop admin desk
- PostgreSQL database that **creates its own tables** on first visit
- `index.html` for Spck Editor or a static Vercel preview
## Preview logins
Use these after the first page load. The workshop plants them automatically.
| Who | How to sign in |
| --- | --- |
| Parent | `parent@northpole.mail` / `Christmas123!` |
| Child | mailbox `noel1225` / PIN `1225` |
| Admin | `/admin/login` → `admin@northpole.mail` / `Workshop123!` |
A child’s mailbox name appears on their dashboard after they register. Remember the 4-digit PIN.
## The `.env` file
The project includes:
- `.env` — used on this machine
- `.env.example` — safe template you can copy
Important keys:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```
- `DATABASE_URL` is required. This is your cloud Postgres link.
- `NEXT_PUBLIC_SITE_URL` should be your live website address.
- `OPENAI_API_KEY` is optional. Leave it blank and letters still work.
Do not post your real `.env` on social media or inside a public screenshot.
---
# Deploy from your phone
Do these three jobs in order:
1. Make a free cloud database
2. Put the code on GitHub
3. Launch the website on Vercel and paste your secrets
You only need Safari or Chrome, a free GitHub account, a free Neon account, and a free Vercel account.
## 1. Create the database on Neon
Neon is free and works well in a phone browser.
1. Open [https://neon.tech](https://neon.tech) and sign up. GitHub login is the easiest.
2. Tap **Create project**.
3. Name it `north-pole-post`. Region: pick the one closest to you.
4. When the project opens, tap **Dashboard** → **Connection details**.
5. Connection string type: **URI**.
6. Turn on or keep **sslmode=require**.
7. Copy the whole line. It looks like:
```text
postgresql://neondb_owner:YOURPASSWORD@ep-cool-name-123.neon.tech/neondb?sslmode=require
```
8. Keep that note in a password app or Notes. That string is your `DATABASE_URL`.
You do **not** need to create tables by hand. The first visit to the live site builds them.
### Other database apps if you prefer
- [Supabase](https://supabase.com) → Project Settings → Database → URI. Add `?sslmode=require`.
- [Railway](https://railway.app) → New project → PostgreSQL → Variables → `DATABASE_URL`.
## 2. Put the project on GitHub
Vercel reads the app from GitHub.
### If the code is already on your phone (Spck, Working Copy, or Files)
1. Install **GitHub** and create a free account.
2. On github.com tap **+** → **New repository**.
3. Name it `north-pole-post`. Keep it **Private** if you want.
4. Do **not** add a README on GitHub if this project already has one.
5. In **Spck Editor**:
   - Open the project folder
   - Tap the Git icon
   - Add the GitHub repo as `origin`
   - Commit all files
   - Push
6. In **Working Copy** (iPhone): clone/create the repo, add these project files, then push.
### If the files are still on a computer
From the project folder:
```bash
git init
git add .
git commit -m "North Pole Post"
git branch -M main
git remote add origin https://github.com/YOURNAME/north-pole-post.git
git push -u origin main
```
Make sure `.env` is **not** uploaded. `.gitignore` already blocks it.
## 3. Launch the website on Vercel
1. On your phone open [https://vercel.com](https://vercel.com).
2. Sign in with the **same GitHub account**.
3. Tap **Add New…** → **Project**.
4. Import `north-pole-post`.
5. Framework should say **Next.js**. Leave the build command as `next build`.
6. Before you tap Deploy, open **Environment Variables** and add:
| Name | Value |
| --- | --- |
| `DATABASE_URL` | the Neon URI you copied, including `?sslmode=require` |
| `NEXT_PUBLIC_SITE_URL` | you can fill this after the first deploy |
| `OPENAI_API_KEY` | optional |
| `OPENAI_MODEL` | `gpt-4o-mini` or leave blank |
7. Tap **Deploy** and wait. The first build can take a few minutes.
8. When it finishes, copy your URL, for example `https://north-pole-post.vercel.app`.
9. Back in Vercel → **Settings** → **Environment Variables**, set:
```text
NEXT_PUBLIC_SITE_URL=https://north-pole-post.vercel.app
```
10. Tap **Deployments** → latest deploy → **Redeploy** so the new site URL is baked in.
## 4. Open the live site once
Visit the Vercel URL.
The first load:
- connects to Neon
- creates every table
- plants the 20 elves, games, certificates, and demo mailboxes
Then try:
- `/` magical homepage
- `/parent/login`
- `/kid/login` with `noel1225` / `1225`
- `/admin/login`
If the homepage snow appears but login fails, the database URL is usually missing `?sslmode=require` or was pasted with an extra space. Fix it in Vercel, then Redeploy.
## 5. Put it on an iPhone or Android home screen
This is the phone “app” without the App Store.
**iPhone**
1. Open the live site in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Name it `North Pole Post`.
**Android**
1. Open the live site in Chrome.
2. Tap the menu.
3. Tap **Add to Home screen** or **Install app**.
It opens full-screen like an app.
---
# Quick preview only (no database)
Use this when you just want the pretty first page on your phone.
1. Open the project in **Spck Editor**.
2. Open `index.html`.
3. Tap **Run / Preview**.
Or on Vercel, you can also open `/spck.html` after the full app is deployed.
This preview lets a child register locally in the browser and write Jingle. It does **not** save letters to the cloud. For real accounts, use the full Vercel + Neon deploy above.
---
# After you are live
1. Create **your** parent account at `/parent/register`.
2. Add children from the parent portal, or let a child register with your parent magic code.
3. Write down each child’s mailbox name and PIN.
4. In the parent portal, choose how replies are written.
5. Change the demo parent password by creating a new account and ignoring the preview mailbox.
6. Optional: add `OPENAI_API_KEY` in Vercel if you want richer letters. Never show this key to children.
## Custom domain later
In Vercel → Settings → Domains, add `yourfamily.com` or `mail.yourfamily.com`. Then update `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.
## Payments
Checkout currently records the membership in your database so families can try the plans. When you are ready for real cards, add a Stripe account and we can connect `STRIPE_SECRET_KEY` the same way as the other `.env` values.
---
# If you have a computer later
```bash
npm install
# put your Neon URL in .env
npx drizzle-kit push
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000).
You do not need this step for a phone-only launch. The live site builds its own tables.
---
# Project map
- `src/app/page.tsx` — landing letter
- `src/app/kid/` — child world
- `src/app/parent/` — family portal
- `src/app/admin/` — workshop desk
- `src/db/schema.ts` — database tables
- `src/lib/catalog.ts` — 20 elves, games, films, certificates
- `index.html` — Spck / static preview
- `.env` / `.env.example` — secrets
Made to feel like a North Pole workshop: cozy, child-safe, and simple to open on a phone.
