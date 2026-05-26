

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {

  try {

    const body = await req.json();
    const image = body.image || null;
    const question = body.question || "";

    const cards: string[] =
    body.cards || [];

   const cardNames = cards;

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
- jangan terdengar seperti AI formal
- jangan terlalu pendek
- fokus refleksi diri dan energi emosional
- jangan mengklaim masa depan pasti
- jangan diagnosis medis

BAHASA:
${
  body.language === "en"
    ? `
- Semua hasil reading WAJIB full bahasa Inggris.
- Jangan gunakan bahasa Indonesia.
- Semua section harus English.
`
    : `
- Semua hasil reading WAJIB full bahasa Indonesia.
- Jangan gunakan bahasa Inggris.
`
}

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

    content: [
  {
    type: "text" as const,

    text: `
Pertanyaan user:
"${question}"

CARD 1:
${cardNames[0]}

CARD 2:
${cardNames[1]}

CARD 3:
${cardNames[2]}

WAJIB gunakan EXACT kartu di atas.
Jangan mengganti nama kartu.
Jangan menambahkan kartu lain.

Buat pembacaan tarot premium yang panjang, emosional, cinematic, personal, immersive, dan mystical.

Jika ada foto user:
- baca vibe emosional
- ekspresi wajah
- aura visual
- energi visual
- body language

Gabungkan interpretasi foto dengan tarot reading secara natural.
`,
  },

  ...(image
    ? [
        {
          type: "image_url" as const,

          image_url: {
            url: image,
          },
        },
      ]
    : []),
],
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