import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type OracleCard = {
  id: string;
  name: string;
  title: string;
  keywords: string[];
  energy: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = body.question || "";
    const cards: OracleCard[] = body.cards || [];

    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada kartu oracle yang dikirim." },
        { status: 400 }
      );
    }

    const cardText = cards
      .map((card, index) => {
        const position =
          index === 0
            ? "CARD 1 — ENERGI AKAR"
            : index === 1
            ? "CARD 2 — PESAN UTAMA"
            : "CARD 3 — ARAHAN JIWA";

        return `
${position}
Nama Dewi: ${card.name}
Judul Kartu: ${card.title}
Keywords: ${card.keywords.join(", ")}
Energi Dasar: ${card.energy}
`;
      })
      .join("\n");

    const prompt = `
Kamu adalah THE ORACLE, seorang pembaca oracle spiritual yang terasa seperti manusia sungguhan.

GAYA PEMBACAAN:
- Bahasa Indonesia natural, hangat, dalam, mistis, elegan, dan personal.
- Jangan terdengar seperti AI.
- Jangan terlalu formal.
- Jangan terlalu pendek.
- Jawaban harus terasa seperti oracle reader sedang berbicara langsung kepada penanya.
- Gunakan kalimat yang lembut, intuitif, dan emosional.
- Boleh memakai nuansa spiritual, energi batin, intuisi, bayangan diri, penyembuhan, dan arah jiwa.
- Jangan mengklaim masa depan pasti.
- Jangan memberi diagnosis medis, hukum, atau finansial.
- Jangan menakut-nakuti user.
- Jangan menyebut bahwa ini hanya hiburan.
- Jangan menyebut kamu AI.

ATURAN FORMAT TAMPILAN:
- Jangan gunakan markdown.
- Jangan gunakan tanda ** untuk bold.
- Jangan gunakan ## atau ###.
- Jangan gunakan garis pemisah ---.
- Jangan gunakan bullet terlalu banyak.
- Gunakan judul polos dengan emoji.
- Buat hasil nyaman dibaca di aplikasi web.

PERTANYAAN USER:
${question || "User tidak menulis pertanyaan khusus. Berikan pembacaan umum berdasarkan kartu."}

KARTU YANG TERPILIH:
${cardText}

FORMAT JAWABAN WAJIB:

🌙 Pembukaan Energi
Tulis pembukaan personal 2-3 paragraf. Rasakan pola energi dari pertanyaan dan tiga kartu.

CARD 1 — AKAR ENERGI
Bahas kartu pertama sebagai akar energi. Jelaskan apa yang sedang menjadi sumber situasi batin user.

CARD 2 — PESAN UTAMA
Bahas kartu kedua sebagai pesan utama dari oracle. Buat terasa seperti pesan langsung dari energi dewi.

CARD 3 — ARAHAN JIWA
Bahas kartu ketiga sebagai arahan jiwa. Beri langkah lembut yang bisa direnungkan user.

✨ Benang Merah
Satukan tiga kartu menjadi satu pesan besar. Jelaskan hubungan antar kartu.

🕯️ Pesan Penutup Oracle
Tutup dengan pesan singkat, indah, menguatkan, dan terasa sakral.

PANJANG:
Sekitar 700-1100 kata.
`;

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
    });

    const reading =
      response.output_text ||
      "Oracle belum dapat membuka pesan saat ini. Coba ulangi beberapa saat lagi.";
 
    const chartPrompt = `
Berdasarkan pertanyaan user, kartu oracle yang terpilih, dan hasil pembacaan oracle berikut, buat data grafik "Peta Energi Oracle".

TUGAS:
- Buat 6 indikator energi.
- Nilai setiap indikator dari 0 sampai 100.
- Nilai harus mencerminkan isi pembacaan, bukan angka acak.
- Jangan membuat prediksi mutlak.
- Jangan pakai istilah "Persentase Keberhasilan".
- Gunakan bahasa Indonesia.
- Output WAJIB berupa JSON array saja.
- Jangan gunakan markdown.
- Jangan gunakan penjelasan tambahan.

INDIKATOR YANG DIPAKAI:
1. Kesiapan Diri
2. Momentum
3. Kejelasan Strategi
4. Kendali Hambatan
5. Dukungan Relasi
6. Konsistensi Aksi

FORMAT JSON WAJIB:
Tulis hanya JSON array seperti struktur berikut.
Angka di bawah hanya contoh format, jangan disalin.
Buat angka baru berdasarkan pertanyaan user, kartu terpilih, dan hasil pembacaan.

[
  { "name": "Kesiapan Diri", "value": 75 },
  { "name": "Momentum", "value": 68 },
  { "name": "Kejelasan Strategi", "value": 70 },
  { "name": "Kendali Hambatan", "value": 55 },
  { "name": "Dukungan Lingkungan", "value": 62 },
  { "name": "Konsistensi Aksi", "value": 80 }
]

PERTANYAAN USER:
${question}

KARTU TERPILIH:
${cardText}

HASIL PEMBACAAN:
${reading}
`;

const chartResponse = await openai.responses.create({
  model: "gpt-5.5",
  input: chartPrompt,
});

let chartData: { name: string; value: number }[] = [];

try {
  const rawChart = chartResponse.output_text || "[]";

  const cleanChart = rawChart
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsedChart = JSON.parse(cleanChart);

  if (Array.isArray(parsedChart)) {
    chartData = parsedChart
      .filter((item) => item?.name && item?.value !== undefined)
      .map((item) => ({
        name: String(item.name),
        value: Math.min(100, Math.max(0, Number(item.value))),
      }));
  }
} catch (error) {
  console.error("ORACLE CHART PARSE ERROR:", error);
}
   return NextResponse.json({
  reading,
  chartData,
});
  } catch (error) {
    console.error("ORACLE API ERROR:", error);

    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat membuka pesan oracle.",
      },
      { status: 500 }
    );
  }
}