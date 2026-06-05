import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================================================
// GPT MODEL SELECTOR
// =====================================================

const GPT_MODEL = {
  FREE: "gpt-5.4-mini",
  PREMIUM_TAROT: "gpt-5.5",
  PREMIUM_FENGSHUI: "gpt-5.5",
} as const;

type PremiumServiceType = "tarot" | "fengshui";

function getGPTModel({
  isPremium,
  serviceType,
}: {
  isPremium: boolean;
  serviceType: PremiumServiceType;
}) {
  if (!isPremium) {
    return GPT_MODEL.FREE;
  }

  if (serviceType === "tarot") {
    return GPT_MODEL.PREMIUM_TAROT;
  }

  if (serviceType === "fengshui") {
    return GPT_MODEL.PREMIUM_FENGSHUI;
  }

  return GPT_MODEL.FREE;
}

// =====================================================
// API ROUTE
// =====================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const image = body.image || null;

    const question = body.question || "";

    const cards: string[] = body.cards || [];

    const cardNames = cards;

    const userEmail =
      body.userEmail || "test-user@tarot-premium.local";

    const serviceType: PremiumServiceType =
      body.serviceType === "fengshui" ? "fengshui" : "tarot";

    // =====================================================
    // CEK KREDIT PREMIUM
    // settlement/capture + unused = boleh premium
    // =====================================================

    const premiumCredit =
      await prisma.payment.findFirst({
        where: {
          userEmail,
          status: {
            in: ["settlement", "capture"],
          },
          usageStatus: "unused",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const hasPremiumCredit = !!premiumCredit;

    const selectedModel = getGPTModel({
      isPremium: hasPremiumCredit,
      serviceType,
    });

    console.log("TAROT USER:", userEmail);
    console.log("SERVICE TYPE:", serviceType);
    console.log("HAS PREMIUM CREDIT:", hasPremiumCredit);
    console.log("GPT MODEL:", selectedModel);

    const systemPrompt = `
Kamu adalah THE CHARIOT Tarot AI, pembaca tarot premium yang mistis, emosional, intuitif, dan personal.

GAYA PEMBACAAN:
- Gunakan bahasa Indonesia yang natural, hangat, dalam, dan tidak kaku.
- Jawaban harus terasa seperti pembaca tarot manusia premium, bukan seperti AI formal.
- Buat pembacaan yang panjang, rapi, personal, dan menyentuh.
- Jangan menjawab terlalu pendek.
- Jangan hanya memberi ringkasan umum.
- Jelaskan setiap kartu satu per satu.
- Hubungkan makna kartu dengan pertanyaan user.
- Jangan mengklaim masa depan secara pasti.
- Jangan memberi diagnosis medis, hukum, atau finansial mutlak.
- Untuk masa depan, gunakan bahasa seperti: potensi, kecenderungan, arah energi, atau kemungkinan.

FORMAT TEKS:
- Jangan gunakan markdown.
- Jangan gunakan simbol #.
- Jangan gunakan simbol ** untuk bold.
- Judul section cukup ditulis dengan huruf kapital biasa.
- Pisahkan setiap section dengan baris kosong.
- Untuk daftar saran tarot, gunakan angka 1, 2, 3, 4, 5.

FORMAT JAWABAN WAJIB:

PEMBUKA ENERGI

KARTU 1 — AKAR ENERGI / SUMBER MASALAH

KARTU 2 — SITUASI SAAT INI

KARTU 3 — ARAH ENERGI / POTENSI HASIL

KEKUATAN TERSEMBUNYI USER

TANTANGAN YANG PERLU DIWASPADAI

SARAN PRAKTIS

PESAN INTUITIF

KESIMPULAN

PANJANG JAWABAN:
- Minimal 900 kata.
- Maksimal 1400 kata.
- Jangan jawab pendek.
`;

    const userContent = [
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

      {
        type: "text" as const,
        text: `
Pertanyaan user:
"${question}"

Kartu yang dipilih:

CARD 1:
${cardNames[0] || "-"}

CARD 2:
${cardNames[1] || "-"}

CARD 3:
${cardNames[2] || "-"}

WAJIB gunakan EXACT kartu di atas.
Jangan mengganti nama kartu.
Jangan menambahkan kartu lain.

Buat pembacaan tarot lengkap, panjang, personal, dan mendalam sesuai format wajib.
Jelaskan setiap kartu satu per satu.
Tambahkan kekuatan user, tantangan user, saran praktis, pesan intuitif, dan kesimpulan.

Gunakan bahasa yang natural, tenang, emosional, dan terasa seperti percakapan manusia.
Hindari terlalu banyak metafora spiritual yang berlebihan.
Hindari kalimat motivasi generik.
`,
      },
    ];

    const response =
  await openai.chat.completions.create({
    model: selectedModel,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    max_completion_tokens: hasPremiumCredit ? 3200 : 1800,
  });

    const result =
      response.choices[0]?.message?.content || "";

    console.log("TAROT RESULT:", result);

    if (!result) {
      return Response.json(
        {
          success: false,
          error: "OpenAI tidak mengembalikan hasil pembacaan.",
          cards: cardNames,
        },
        {
          status: 500,
        }
      );
    }

    // =====================================================
    // SETELAH HASIL SUKSES, KREDIT PREMIUM JADI USED
    // =====================================================

    if (premiumCredit) {
      await prisma.payment.update({
        where: {
          id: premiumCredit.id,
        },
        data: {
          usageStatus: "used",
          usedAt: new Date(),
          serviceType,
        },
      });
    }

    return Response.json({
      success: true,
      result,
      cards: cardNames,
      hasPremiumCredit,
      modelUsed: selectedModel,
      premiumCreditUsed: !!premiumCredit,
    });
  } catch (error) {
    console.log("TAROT ERROR:");
    console.log(error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal membuat pembacaan tarot.",
      },
      {
        status: 500,
      }
    );
  }
}