
 import { NextResponse } from "next/server";
import crypto from "crypto";
 export async function POST(request: Request) {
  try {
    const va = process.env.IPAYMU_VA;
    const apiKey = process.env.IPAYMU_API_KEY;
    const baseUrl = process.env.IPAYMU_BASE_URL;
    const appUrl =
    request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000";

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
      .digest("hex");

    const stringToSign = `POST:${va}:${bodyHash}:${apiKey}`;

    const signature = crypto
      .createHmac("sha256", apiKey)
      .update(stringToSign)
      .digest("hex");

    const response = await fetch(`${baseUrl}/api/v2/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        va,
        signature,
        timestamp: new Date().toISOString(),
      },
      body: bodyJson,
    });

    const data = await response.json();

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

           