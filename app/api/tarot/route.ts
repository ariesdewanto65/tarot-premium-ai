import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tarotCards: Record<number, string> = {
  1: "Ace of Cups",
  2: "Two of Wands",
  3: "Three of Pentacles",
  4: "Four of Cups",
  5: "The Hierophant",
  6: "Six of Swords",
  7: "The Chariot",
  8: "Strength",
  9: "The Hermit",
};

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const question = body.question || "";

    const cards = body.cards || [];

    const cardNames = cards.map(
      (card: number) =>
        tarotCards[card] || `Unknown Card`
    );

    const systemPrompt = `
Kamu adalah Oracle Noir Tarot.

Gaya reading:
- misterius
- personal
- emosional
- immersive
- cinematic
- natural seperti tarot reader manusia

RULES:
- Fokus refleksi diri dan energi emosional.
- Jangan mengklaim masa depan pasti.
- Jangan diagnosis medis.
- Jangan manipulatif.
- Reading harus intimate dan natural.
- Gunakan bahasa Indonesia.
- Hindari tone AI formal.

FLOW:
- Jelaskan energi dari tiap kartu.
- Buat reading terasa hidup dan personal.
- Gunakan simbolisme emosional.
- Hindari pengulangan frasa.

FORMAT:

CARD 1:
akar energi atau sumber masalah.

CARD 2:
kondisi sekarang atau konflik utama.

CARD 3:
arah energi atau kemungkinan hasil.

Tambahkan:
- hidden energy
- kekuatan user
- tantangan user
- saran tarot
- pesan akhir

STYLE:
- maksimal 2 paragraf pendek per kartu.
- immersive.
- mystical.
- cinematic.
`;

    const userPrompt = `
Pertanyaan user:
"${question}"

Kartu tarot:
${cardNames.join(", ")}

Berikan pembacaan tarot premium yang emosional, immersive, dan terasa personal.
`;

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],

        temperature: 0.95,

        max_tokens: 1200,
      });

    const result =
      response.choices[0].message.content;

    return Response.json({
      success: true,
      cards: cardNames,
      result,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      result:
        "OpenAI API Error / saldo mungkin habis 😅🔥",
    });
  }
}