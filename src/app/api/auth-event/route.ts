import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type AuthEventBody = {
  type: "register" | "login";
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
};

async function sendTelegramNotification(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is missing");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AuthEventBody;
    const { type, userId, email, fullName, phone } = body;

    if (!type || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const username = email.split("@")[0];

    if (type === "register") {
      // Auto-confirm the email so the member can log in immediately —
      // registration is documentation-only, no email verification required.
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });
      if (confirmError) {
        console.error("Failed to auto-confirm user:", confirmError.message);
      }

      // Upsert member profile (bypasses RLS via service role — safe, server-only)
      await supabaseAdmin.from("forex_profiles").upsert(
        {
          id: userId,
          email,
          full_name: fullName || null,
          phone: phone || null,
          vip_status: "free",
        },
        { onConflict: "id" }
      );
    }

    // Log activity
    await supabaseAdmin.from("forex_activity_logs").insert({
      user_id: userId,
      email,
      action: type === "register" ? "register" : "login",
      ip_address: req.headers.get("x-forwarded-for") || null,
    });

    const label = type === "register" ? "🆕 REGISTRASI MEMBER BARU" : "🔐 MEMBER LOGIN";
    const text =
      `<b>${label}</b>\n\n` +
      `👤 Username: <b>@${username}</b>\n` +
      `📧 Email: ${email}` +
      (fullName ? `\n📛 Nama: ${fullName}` : "") +
      (phone ? `\n📱 Telepon: ${phone}` : "") +
      `\n🕒 ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB`;

    await sendTelegramNotification(text);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("auth-event error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
