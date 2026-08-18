import { ELF_SEEDS } from "@/lib/catalog";
type ReplyInput = {
  childName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  wishes?: string | null;
  birthday?: string | null;
  memories: string[];
  previousLetters: { author: string; body: string }[];
  elfSlug: string;
  letter: string;
};
export async function generateElfReply(input: ReplyInput) {
  const elf = ELF_SEEDS.find((item) => item.slug === input.elfSlug) ?? ELF_SEEDS[0];
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.9,
          messages: [
            { role: "system", content: systemPrompt(elf, input) },
            { role: "user", content: input.letter },
          ],
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch {
      // Magical workshop backup ink.
    }
  }
  return fallbackReply(elf, input);
}
function systemPrompt(elf: (typeof ELF_SEEDS)[number], input: ReplyInput) {
  const ageBand = input.age <= 5 ? "very simple words, 4-7 short sentences" : input.age <= 8 ? "friendly grade-school language, 2-4 short paragraphs" : "playful and imaginative, 3-5 short paragraphs";
  return `You are ${elf.name}, a real elf living at the North Pole. You are writing a handwritten letter to your child pen pal.
Never mention AI, models, being a program, parents controlling replies, or that this is an app.
Stay in character completely.
Personality: ${elf.personality}
Hobbies: ${elf.hobbies}
Job: ${elf.job}
Favorite treat: ${elf.treat}
Voice: ${elf.voiceNotes}
Child: ${input.childName}, age ${input.age}, favorite color ${input.favoriteColor}, favorite Christmas activity ${input.favoriteActivity}.
Wishes: ${input.wishes || "still discovering"}.
Birthday: ${input.birthday || "unknown"}.
Known memories: ${input.memories.join(" | ") || "none yet"}.
Recent letters: ${input.previousLetters
    .slice(-6)
    .map((letter) => `${letter.author}: ${letter.body}`)
    .join("\n---\n")}
Write ${ageBand}.
Be personalized, encouraging, funny, imaginative, and kind.
Use the child's name naturally.
Reference something they just wrote.
If today is close to their birthday, celebrate it.
Never scare, never mention adult topics, never break the North Pole world.
Sign the letter as ${elf.name}.`;
}
function fallbackReply(elf: (typeof ELF_SEEDS)[number], input: ReplyInput) {
  const snippet = input.letter.replace(/\s+/g, " ").trim().slice(0, 90);
  const memory = input.memories[0];
  const simple = input.age <= 5;
  const birthdayNote = isBirthdaySeason(input.birthday)
    ? `\n\nP.S. I hung a tiny banner that says Happy almost-birthday, ${input.childName}! The reindeer already practiced a happy dance.`
    : "";
  if (simple) {
    return `Dear ${input.childName},\n\nHi hi! It is ${elf.name}! I read your letter and smiled so big my hat bell rang.\n\nYou said: "${snippet}${input.letter.length > 90 ? "..." : ""}"\n\nThat is wonderful. I love ${input.favoriteActivity} too. Today I ${jobMoment(elf)} and saved you a ${input.favoriteColor} sprinkle.\n\nWrite me again soon!\n\nLove,\n${elf.name}${birthdayNote}`;
  }
  return `Dear ${input.childName},\n\n${elf.greeting}\n\nI read your letter by the lantern in my loft, and I could almost hear your voice in the snow. You wrote about "${snippet}${input.letter.length > 90 ? "..." : ""}" and it made the whole workshop feel warmer.\n\nGuess what I did today? ${jobMoment(elf)} I thought of you the whole time, especially because you love ${input.favoriteActivity}. I even spotted something ${input.favoriteColor} and whispered, "That is a ${input.childName} color."${memory ? ` Also, I still remember this: ${memory}` : ""}\n\nIf you tell me one more tiny thing from your day — a snack, a giggle, a cloud that looked like a mitten — I will add it to my treasure tin.\n\nYour friend forever and two snowflakes,\n${elf.name}\n\nP.S. ${elf.funFact}${birthdayNote}`;
}
function jobMoment(elf: (typeof ELF_SEEDS)[number]) {
  return `I was busy with my job (${elf.job.toLowerCase()}) and snuck a bite of ${elf.treat.toLowerCase()}.`;
}
function isBirthdaySeason(birthday?: string | null) {
  if (!birthday) return false;
  const now = new Date();
  const [month, day] = birthday.split("-").map(Number);
  if (!month || !day) return false;
  const target = new Date(now.getFullYear(), month - 1, day);
  const diff = Math.abs(target.getTime() - now.getTime());
  return diff < 1000 * 60 * 60 * 24 * 14;
}
export function extractMemories(letter: string, childName: string) {
  const memories: { kind: string; content: string }[] = [];
  const wish = letter.match(/(?:i want|i wish|please tell santa)\s+(.{8,80})/i);
  if (wish?.[1]) memories.push({ kind: "wish", content: `${childName} mentioned: ${wish[1].trim()}` });
  const joke = letter.match(/(?:joke|funny|laugh|giggle)/i);
  if (joke) memories.push({ kind: "joke", content: `${childName} shared something funny.` });
  const pet = letter.match(/(?:my dog|my cat|my pet|hamster|goldfish)\s+(.{0,40})/i);
  if (pet) memories.push({ kind: "pet", content: pet[0] });
  return memories;
}