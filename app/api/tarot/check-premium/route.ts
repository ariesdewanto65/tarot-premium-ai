import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userEmail = "test-user@tarot-premium.local";

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return Response.json({
        success: true,
        isPremium: false,
        message: "User belum ditemukan",
      });
    }

    return Response.json({
      success: true,
      isPremium: user.isPremium,
      userEmail: user.email,
      premiumUntil: user.premiumUntil,
    });
  } catch (error: any) {
    console.log("CHECK PREMIUM ERROR:", error);

    return Response.json(
      {
        success: false,
        isPremium: false,
        error: error?.message || "Gagal cek premium",
      },
      { status: 500 }
    );
  }
}