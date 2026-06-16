import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase environment variables are missing",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("keep_alive")
       .select("id, note, created_at")
       .limit(1);

    if (error) {
      console.error("SUPABASE KEEP ALIVE ERROR:", error);

      return NextResponse.json(
        {
          ok: false,
          message: "Supabase keep-alive failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase keep-alive success",
      checkedAt: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error("KEEP ALIVE SERVER ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Server error during keep-alive",
      },
      { status: 500 }
    );
  }
}