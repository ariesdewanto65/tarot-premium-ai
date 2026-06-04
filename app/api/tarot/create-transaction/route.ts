
// @ts-ignore
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";
export async function POST() {

console.log("CREATE TRANSACTION API DIPANGGIL");

  try {

    const snap = new midtransClient.Snap({

      isProduction: false,

      serverKey:
        process.env
          .MIDTRANS_SERVER_KEY!,

    });

 const userEmail = "test-user@tarot-premium.local";

const orderId =
  "ORDER-" + Date.now();

console.log("ORDER ID DIBUAT:", orderId);

await prisma.user.upsert({
  where: {
    email: userEmail,
  },
  update: {},
  create: {
    email: userEmail,
    name: "User Tarot",
  },
});

const amount = 59900;

await prisma.payment.create({
  data: {
    orderId,
    userEmail,
    amount ,
    status: "pending",
  },
});

const parameter = {
  transaction_details: {
    order_id: orderId,
     gross_amount: amount,
  },
  
     

      customer_details: {

        first_name:
          "User Tarot",

      },

callbacks: {
  finish:
    "http://localhost:3000",
  error:
    "http://localhost:3000",
  pending:
    "http://localhost:3000",
},

    };

    const transaction =
      await snap.createTransaction(
        parameter
        
      );

       console.log(transaction);
   return Response.json({

  token:
    transaction.token,

  orderId,

});

  } catch (error: any) {
  console.log("CREATE TRANSACTION ERROR");
  console.log("ERROR MESSAGE:", error?.message);
  console.log("MIDTRANS RESPONSE:", error?.response?.data);
  console.log("FULL ERROR:", error);

  return Response.json(
    {
      success: false,
      errorMessage: error?.message || "Create transaction gagal",
      midtransError: error?.response?.data || null,
    },
    { status: 500 }
  );
}
}