import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "orderId tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      return NextResponse.json(
        {
          success: false,
          error: "MIDTRANS_SERVER_KEY belum ada di .env.local",
        },
        { status: 500 }
      );
    }

    const encodedServerKey = Buffer.from(serverKey + ":").toString("base64");

    const response = await fetch(
      `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const midtransData = await response.json();

    console.log("MIDTRANS STATUS RAW:", midtransData);

    const status = midtransData.transaction_status;

    const payment = await prisma.payment.findUnique({
      where: {
        orderId,
      },
    });

    console.log("PAYMENT DARI DB:", payment);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment tidak ditemukan di database",
          orderId,
          raw: midtransData,
        },
        { status: 404 }
      );
    }

    await prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status: status || "unknown",
        paymentType: midtransData.payment_type || null,
        transactionId: midtransData.transaction_id || null,
        fraudStatus: midtransData.fraud_status || null,
        rawNotification: midtransData,
      },
    });

    const paidStatuses = ["settlement", "capture"];

    if (paidStatuses.includes(status)) {
      await prisma.user.update({
        where: {
          email: payment.userEmail,
        },
        data: {
          isPremium: true,
        },
      });

      return NextResponse.json({
        success: true,
        premium: true,
        orderId,
        transaction_status: status,
        fraud_status: midtransData.fraud_status,
        payment_type: midtransData.payment_type,
        gross_amount: midtransData.gross_amount,
        message: "Pembayaran sukses, premium aktif",
        raw: midtransData,
      });
    }

    return NextResponse.json({
      success: true,
      premium: false,
      orderId,
      transaction_status: status,
      fraud_status: midtransData.fraud_status,
      payment_type: midtransData.payment_type,
      gross_amount: midtransData.gross_amount,
      message: "Pembayaran belum sukses",
      raw: midtransData,
    });
  } catch (error: any) {
    console.error("CHECK PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal cek status pembayaran",
        code: error?.code,
        meta: error?.meta,
      },
      { status: 500 }
    );
  }
}