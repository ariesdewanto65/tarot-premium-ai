

import OpenAI from "openai";
//import { prisma } from "@/lib/prisma";

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

type PremiumServiceType =
  | "tarot"
  | "fengshui";

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
// PREMIUM STATUS CHECKER
// =====================================================

/*async function checkPremiumFromDatabase(userEmail: string) {
  const premiumPayment =
    await prisma.payment.findFirst({
      where: {
        userEmail,
        status: {
          in: [
            "settlement",
            "capture",
          ],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  const isPremium =
    Boolean(premiumPayment);

  return isPremium;
}    */
export async function POST(req: Request) {

  try {

   const body = await req.json();

const image =
  body.image || null;

const question =
  body.question || "";

const cards: string[] =
  body.cards || [];

const cardNames = cards;



// ===============================
// TEST OPENAI MINIMAL
// ===============================

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

FORMAT JAWABAN WAJIB:

# PEMBUKA ENERGI
Jelaskan suasana energi utama dari kombinasi 3 kartu yang muncul.

# KARTU 1 — AKAR ENERGI / SUMBER MASALAH
Jelaskan kartu pertama secara mendalam: makna utama, hubungan dengan kondisi user, emosi tersembunyi, dan pesan batinnya.

# KARTU 2 — SITUASI SAAT INI
Jelaskan kartu kedua sebagai kondisi yang sedang terjadi sekarang: dinamika aktif, konflik, perasaan user, dan hal yang mungkin belum disadari.

# KARTU 3 — ARAH ENERGI / POTENSI HASIL
Jelaskan kartu ketiga sebagai arah energi ke depan: potensi perkembangan, peluang positif, risiko yang perlu dijaga, dan sikap terbaik.

# KEKUATAN TERSEMBUNYI USER
Jelaskan kekuatan batin user berdasarkan kombinasi kartu.

# TANTANGAN YANG PERLU DIWASPADAI
Jelaskan hambatan emosional, pola pikir, atau situasi yang bisa mengganggu perjalanan user.

# SARAN PRAKTIS
Berikan 3 sampai 5 saran nyata yang bisa dilakukan user. Gunakan format poin bernomor.

# PESAN INTUITIF
Berikan pesan spiritual yang lembut, emosional, tenang, dan reflektif.

# KESIMPULAN
Tutup dengan rangkuman yang kuat, hangat, dan memberi rasa arah.

PANJANG JAWABAN:
- Minimal 900 kata.
- Maksimal 1400 kata.
- Jangan jawab pendek.
`;

const testAiResponse =
  await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
Pertanyaan user:
${question}

Kartu yang dipilih:
${cardNames.join(", ")}

Buat pembacaan tarot lengkap, panjang, personal, dan mendalam sesuai format wajib.
Jelaskan setiap kartu satu per satu.
Jangan hanya memberi ringkasan pendek.
`,
      },
    ],
    temperature: 0.85,
    max_completion_tokens: 2600,
  });

const testReading =
  testAiResponse.choices[0]?.message?.content || "";

console.log("TEST AI RESPONSE:", testAiResponse);
console.log("TEST READING:", testReading);

return Response.json({
  success: true,
  result: testReading || "TEST OPENAI KOSONG",
  cards: cardNames,
});

const aiResponse =
  await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah pembaca tarot. Jawab dalam bahasa Indonesia.",
      },
      {
        role: "user",
        content: `Buat pembacaan tarot singkat untuk kartu: ${cardNames.join(", ")}`,
      },
    ],
    temperature: 0.8,
    //max_tokens: 700,
    max_completion_tokens: 700,
  });

const result =
  aiResponse.choices[0]?.message?.content || "";

console.log("TAROT RESULT:", result);

return Response.json({
  success: true,
  result,
  cards: cardNames,
});

// ===============================
// PREMIUM + GPT MODEL CHECK
// ===============================

/*const userEmail =
  body.userEmail ||
  "test-user@tarot-premium.local";

const serviceType: PremiumServiceType =
  body.serviceType || "tarot";

const isPremium =
  await checkPremiumFromDatabase(userEmail);

const model = getGPTModel({
  isPremium,
  serviceType,
});

console.log("TAROT USER:", userEmail);
console.log("SERVICE TYPE:", serviceType);
console.log("IS PREMIUM:", isPremium);
console.log("GPT MODEL:", model);
 */

// ===============================
// PREMIUM + GPT MODEL CHECK
// SEMENTARA DIMATIKAN DULU BIAR READING NORMAL
// ===============================

/*
const userEmail =
  body.userEmail ||
  "test-user@tarot-premium.local";

const serviceType: PremiumServiceType =
  body.serviceType || "tarot";

const isPremium =
  await checkPremiumFromDatabase(userEmail);

const model = getGPTModel({
  isPremium,
  serviceType,
});

console.log("TAROT USER:", userEmail);
console.log("SERVICE TYPE:", serviceType);
console.log("IS PREMIUM:", isPremium);
console.log("GPT MODEL:", model);
*/

const userEmail =
  "test-user@tarot-premium.local";

const serviceType: PremiumServiceType =
  "tarot";

const isPremium =
  false;

const model =
  "gpt-5.4-mini";

console.log("TAROT USER:", userEmail);
console.log("SERVICE TYPE:", serviceType);
console.log("IS PREMIUM:", isPremium);
console.log("GPT MODEL:", model);



/*const systemPrompt = `
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
*/
    

    const response =
      await openai.chat.completions.create({
    model: "gpt-5.4-mini",

       messages: [
  {
    role: "system",
    content: systemPrompt,
  },

  {
    role: "user",

    content: [

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

CARD 1:
${cardNames[0]}

CARD 2:
${cardNames[1]}

CARD 3:
${cardNames[2]}

Hindari pengulangan kata seperti "aura", "energi", dan "tatapan mata" terlalu sering.


WAJIB gunakan EXACT kartu di atas.
Jangan mengganti nama kartu.
Jangan menambahkan kartu lain.
Sesekali gunakan observasi yang terasa realistis dan manusiawi, seolah benar-benar memahami kondisi hidup user saat ini.

Jangan terlalu puitis di setiap kalimat. Campurkan gaya spiritual dengan pengamatan emosional yang natural dan relatable.

Prioritaskan bahasa sederhana dan realistis.

Jangan selalu memulai pembacaan dengan langsung menjelaskan kartu.
Buat pembacaan tarot yang emosional, personal, tenang, intimate, dan terasa manusiawi.
Mulailah dengan observasi emosional yang terasa personal terhadap kondisi user saat ini, lalu perlahan hubungkan dengan kartu tarot secara natural .
Jika user mengupload foto:

Perhatikan ekspresi wajah, tatapan mata, aura emosional, energi visual, dan body language user.

Rasakan emosi tersembunyi yang terpancar dari wajahnya, lalu hubungkan secara natural dengan makna kartu tarot yang muncul.

Jika user terlihat lelah, penuh tekanan, kehilangan arah, menyimpan harapan besar, atau sedang memendam beban emosional, jelaskan secara lembut, personal, hangat, dan menyentuh hati.


Jangan hanya mendeskripsikan wajah user secara dangkal.

Cobalah membaca emosi tersembunyi yang mungkin sedang dipendam, seperti rasa lelah yang tidak diucapkan, tekanan hidup, kesepian, kehilangan arah, harapan yang masih bertahan, atau luka emosional yang belum selesai.

Sesekali hubungkan pembacaan dengan situasi hidup nyata seperti:
- tekanan pekerjaan
- hubungan yang renggang
- rasa lelah menghadapi hidup
- overthinking tentang masa depan
- kehilangan semangat
- sulit percaya diri
- merasa berjalan sendirian
Hindari saran yang terlalu umum atau terdengar seperti motivasi generik.

Berikan nasihat yang terasa personal, lembut, emosional, dan seolah benar-benar memahami kondisi batin user saat ini.

Jangan terlalu sering memakai kata:
- beban
- harapan
- kegelapan
- cahaya
Namun jangan terlalu spesifik atau menghakimi.
Gunakan lebih banyak observasi emosional realistis dibanding metafora spiritual.

Biarkan pembacaan terasa seperti seseorang benar-benar memahami kondisi psikologis dan emosional user, bukan hanya sekadar puitis.
Hindari penutup yang terlalu generic atau terdengar seperti quote motivasi umum.
Hindari terlalu sering menggunakan frasa seperti:
- "ini adalah panggilan"
- "ini adalah sinyal"
- "simbol"
- "menggambarkan"
Hindari terlalu sering menggunakan kata seperti:
- bayangan
- getaran
- kedalaman
- cahaya
- kegelapan
- jiwa
Hindari metafora motivasional yang terlalu umum seperti:
- pelangi setelah hujan
- cahaya di ujung jalan
- badai akan berlalu
- semesta menyiapkan sesuatu

Hindari terlalu banyak menggunakan kata abstrak seperti:
- kedamaian
- keseimbangan
- harapan
- kebahagiaan
- kekuatan batin

Gunakan observasi yang lebih konkret dan emosional.

Gunakan penutup yang lebih sederhana, tenang, dan manusiawi.

Gunakan bahasa yang lebih natural dan dekat dengan percakapan manusia sehari-hari.
Tidak semua bagian harus panjang.
Hindari terlalu sering menggunakan pola kalimat yang terdengar seperti narator spiritual atau quote motivasi.
Tidak semua pembacaan harus terdengar indah.

Sesekali biarkan ada rasa lelah, sunyi, bingung, atau hening dalam cara berbicara agar emosi terasa lebih nyata.
Biarkan bahasa terasa lebih tenang, personal, dan seperti percakapan tulus dari seseorang yang benar-benar memahami kondisi emosional user.
Sesekali gunakan paragraf pendek yang tenang dan sederhana agar emosi terasa lebih nyata dan intimate.
Biarkan pembacaan mengalir lebih natural seperti percakapan emosional yang tulus.
Buat pesan akhir terasa hangat, personal, tenang, dan emosional, seolah benar-benar ditujukan khusus untuk user ini saja.
Buat user merasa benar-benar dipahami dan dilihat secara emosional.
Jangan terdengar seperti artikel, buku motivasi, atau narator film.
Jangan selalu mencoba menjelaskan arti dari setiap emosi atau keadaan.


Tidak semua rasa harus diubah menjadi pelajaran atau motivasi.

Kadang cukup akui bahwa perasaan itu ada, tanpa harus memberi makna besar terhadapnya.

Biarkan pembacaan terasa seperti seseorang yang sedang duduk tenang dan berbicara langsung kepada user dengan tulus.
Prioritaskan observasi emosional yang sederhana, tenang, dan realistis dibanding metafora spiritual yang berlebihan.
Prioritaskan kesederhanaan emosional dibanding dramatisasi spiritual.

Jangan mencoba membuat setiap bagian terdengar mendalam atau puitis.
Kadang kalimat sederhana terasa lebih jujur dan lebih menyentuh.
Kalimat yang jujur dan sederhana sering terasa lebih menyentuh dibanding paragraf yang terlalu puitis.
Hindari ending yang terlalu optimistis, terlalu sempurna, atau terdengar seperti janji motivasi.
Hindari kalimat filosofis atau metafora yang terlalu umum.

Utamakan bahasa yang sederhana, jujur, dan terasa seperti percakapan manusia biasa.


Tidak semua rasa sakit harus langsung memiliki jawaban.
Jangan selalu mencoba mengubah rasa sedih menjadi motivasi atau harapan.
Tidak semua pembacaan harus memberikan solusi.
Hindari terlalu sering memberi arahan, pelajaran hidup, atau nasihat langsung.

Biarkan pembacaan lebih banyak berisi pemahaman emosional dibanding mencoba mengarahkan user.


Kadang mereka hanya ingin merasa dimengerti.
Sesekali cukup hadir, memahami, dan menemani emosi user tanpa mencoba memperbaiki semuanya.
Kadang cukup akui bahwa user memang sedang lelah, bingung, atau kehilangan arah.
Kadang cukup menemani user dalam emosinya tanpa mencoba memperbaiki semuanya.
Hindari kebutuhan untuk selalu menutup pembacaan dengan harapan besar atau perubahan positif.

Kadang cukup akhiri dengan penerimaan, ketenangan, atau rasa dimengerti.
Biarkan beberapa ending terasa pelan, tenang, dan menggantung secara emosional, seperti percakapan yang belum benar-benar selesai.
Biarkan beberapa ending terasa belum selesai sepenuhnya, seperti seseorang yang hanya ingin menemani user dalam emosinya.

Jika sebuah emosi sudah terasa kuat, tidak perlu selalu diperindah atau dijelaskan lagi.
Biarkan beberapa perasaan tetap sederhana dan apa adanya.
Biarkan beberapa bagian terasa tidak sepenuhnya pasti atau selesai.

Karena dalam hidup nyata, tidak semua perasaan langsung memiliki jawaban.
Hindari kalimat yang terdengar seperti quote motivasi umum atau caption inspirasi.

Contoh yang harus dihindari:
- setiap akhir adalah awal baru
- semuanya terjadi karena alasan tertentu
- kamu lebih kuat dari yang kamu kira
- badai pasti berlalu
- semesta punya rencana
Hindari frasa emosional generik yang terdengar seperti motivasi AI atau narator inspiratif.
Contoh frasa yang harus dihindari:
- kekuatan yang kamu miliki
- potensi besar dalam dirimu
- perjalanan hidup
- menemukan makna hidup
- bangkit dari keterpurukan
- versi terbaik dirimu

Hindari frasa emosional generik yang terdengar seperti motivasi AI.

Contoh frasa yang harus dihindari:
- ada kekuatan dalam dirimu
- kamu lebih kuat dari yang kamu kira
- semuanya akan baik-baik saja
- kamu pasti bisa melewati ini
- perjalanan hidup
- potensi besar dalam dirimu
- bangkit kembali

Gunakan bahasa yang terdengar seperti percakapan manusia biasa,
bukan tulisan motivasi internet atau narator inspiratif.
Gunakan bahasa yang lebih natural, tenang, dan realistis.

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

        //max_tokens: 1400,
        max_completion_tokens: 1400,
      });

   // TARUH DI SINI BRO, SETELAH BLOK OPENAI SELESAI
const testResult =
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

return Response.json({
  success: true,
  result,
  cards: cardNames,
}); 


  /*  const result =
      response.choices[0].message.content;

    return Response.json({
      success: true,
      result,
      cards: cardNames,
    }); */

   //const result =
  //response.choices[0]?.message?.content || "";

console.log("TAROT RESULT:", result);

if (!result) {
  return Response.json(
    {
      success: false,
      error: "OpenAI tidak mengembalikan hasil pembacaan.",
    },
    {
      status: 500,
    }
  );
}

return Response.json({
  success: true,
  result,
  cards: cardNames,
});


 
  //console.log("MIDTRANS ERROR:");
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
               