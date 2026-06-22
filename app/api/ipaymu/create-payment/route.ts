import { NextResponse } from "next/server";
import crypto from "crypto";

function getIpaymuTimestamp() {
  const now = new Date();

  const yyyy = now.getFullYear().toString();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}

export async function POST(request: Request) {
  try {
    const va = process.env.IPAYMU_VA?.trim();
    const apiKey = process.env.IPAYMU_API_KEY?.trim();
    const baseUrl = process.env.IPAYMU_BASE_URL?.trim();

    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      request.headers.get("origin") ||
      //"https://tarot.pojokdigitalstudio.com";
       "https://tarot-premium-lyxplu3mj-aries-pa-s-projects.vercel.app";

    if (!va || !apiKey || !baseUrl) {
      return NextResponse.json(
        { error: "Konfigurasi iPaymu belum lengkap." },
        { status: 500 }
      );
    }

    const body = {
      product: ["Tarot Premium AI"],
      qty: ["1"],
      price: ["59900"],
      returnUrl: `${appUrl}/payment/success`,
      cancelUrl: `${appUrl}/payment/cancel`,
      notifyUrl: `${appUrl}/api/ipaymu/callback`,
      referenceId: `TAROT-${Date.now()}`,
      buyerName: "Customer Tarot Premium",
      buyerEmail: "customer@example.com",
      buyerPhone: "081234567890",
    };

    const bodyJson = JSON.stringify(body);

    const bodyHash = crypto
      .createHash("sha256")
      .update(bodyJson)
      .digest("hex")
      .toLowerCase();

    const stringToSign = `POST:${va}:${bodyHash}:${apiKey}`;

    const signature = crypto
      .createHmac("sha256", apiKey)
      .update(stringToSign)
      .digest("hex")
      .toLowerCase();

    const timestamp = getIpaymuTimestamp();

    const response = await fetch(`${baseUrl}/api/v2/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        va,
        signature,
        timestamp,
      },
      body: bodyJson,
    });

    const data = await response.json();

    console.log("IPAYMU REQUEST CHECK:", {
      baseUrl,
      vaLast4: va.slice(-4),
      apiKeyLast4: apiKey.slice(-4),
      timestamp,
      bodyHash,
      stringToSignPreview: `POST:${va}:BODY_HASH:${apiKey.slice(-4)}`,
      status: response.status,
    });

    console.log("IPAYMU RESPONSE:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("IPAYMU CREATE PAYMENT ERROR:", error);

    return NextResponse.json(
      { error: "Gagal membuat pembayaran iPaymu." },
      { status: 500 }
    );
  }
}