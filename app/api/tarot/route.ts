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
        tarotCards[card] || "Unknown Card"
    );

    const systemPrompt = `
Kamu adalah THE CHARIOT Tarot AI.

Style:
- mystical
- immersive
- cinematic
- emotional
- personal
- natural seperti tarot reader manusia

RULES:

- WAJIB hanya menggunakan kartu yang diberikan user
- DILARANG mengganti kartu
- DILARANG menambahkan kartu lain
- CARD 1 harus membahas kartu pertama
- CARD 2 harus membahas kartu kedua
- CARD 3 harus membahas kartu ketiga
- jangan menyebut kartu tarot lain selain yang dipilih
- jangan terdengar seperti AI formal
- jangan terlalu pendek
- gunakan bahasa Indonesia
- fokus refleksi diri dan energi emosional
- jangan mengklaim masa depan pasti
- jangan diagnosis medis
FORMAT:

CARD 1:
akar energi atau sumber masalah

CARD 2:
situasi sekarang atau konflik utama

CARD 3:
arah energi atau kemungkinan hasil

Tambahkan:
- hidden energy
- kekuatan user
- tantangan user
- saran tarot
- pesan akhir

Gunakan gaya intimate dan immersive.
`;

    const userPrompt = `
Pertanyaan user:
"${question}"

CARD 1:
${cardNames[0]}

CARD 2:
${cardNames[1]}

CARD 3:
${cardNames[2]}

WAJIB gunakan kartu di atas.
Jangan mengganti nama kartu.
Jangan menambahkan kartu lain.

Buat pembacaan tarot premium yang panjang, emosional, cinematic, dan personal.
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

        temperature: 1,

        max_tokens: 1400,
      });

    const result =
      response.choices[0].message.content;

    return Response.json({
      success: true,
      result,
      cards: cardNames,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      result:
        "Terjadi kesalahan saat membaca tarot 😅",
    });
  }
}