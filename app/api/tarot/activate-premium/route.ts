import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body.orderId;

    if (!orderId) {
      return Response.json(
        {
          success: false,
          error: "orderId tidak ditemukan",
        },
        { status: 400 }
      );
    }

    console.log("ACTIVATE PREMIUM ORDER ID:", orderId);

    const payment = await prisma.payment.findUnique({
      where: {
        orderId,
      },
    });

    if (!payment) {
      return Response.json(
        {
          success: false,
          error: "Payment tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await prisma.payment.update({
      where: {
        orderId,
      },
      data: {
        status: "settlement",
      },
    });

    await prisma.user.update({
      where: {
        email: payment.userEmail,
      },
      data: {
        isPremium: true,
      },
    });

    return Response.json({
      success: true,
      message: "Premium berhasil diaktifkan di database",
      orderId,
      userEmail: payment.userEmail,
    });
  } catch (error: any) {
    console.log("ACTIVATE PREMIUM ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error?.message || "Gagal aktivasi premium",
      },
      { status: 500 }
    );
  }
}