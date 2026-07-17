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
    console.error("[auth-event] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is missing");
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      console.error("[auth-event] Telegram notify failed:", json.description);
    }
  } catch (err) {
    console.error("[auth-event] Failed to send Telegram notification:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AuthEventBody;
    const { type, userId, email, fullName, phone } = body;

    if (!type || !userId || !email) {
      console.error("[auth-event] Missing required fields:", { type, userId, email });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const username = email.split("@")[0];
    let profileSaved = true;
    let profileError: string | null = null;

    if (type === "register") {
      // Auto-confirm the email so the member can log in immediately —
      // registration is documentation-only, no email verification required.
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });
      if (confirmError) {
        console.error("[auth-event] Failed to auto-confirm user:", confirmError.message);
      }

      // Upsert member profile (bypasses RLS via service role — safe, server-only).
      // IMPORTANT: check .error explicitly — Supabase JS never throws on failed
      // upserts, it just returns an error object, so this must be checked or
      // failures happen silently and the user "disappears" from the database.
      const { error: upsertError } = await supabaseAdmin.from("forex_profiles").upsert(
        {
          id: userId,
          email,
          full_name: fullName || null,
          phone: phone || null,
          vip_status: "free",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (upsertError) {
        profileSaved = false;
        profileError = upsertError.message;
        console.error("[auth-event] FAILED to save forex_profiles row:", {
          userId,
          email,
          error: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code,
        });
      } else {
        console.log(`[auth-event] Profile saved OK for ${email} (${userId})`);
      }
    }

    // Log activity (best-effort — don't fail the whole request if this errors)
    const { error: logError } = await supabaseAdmin.from("forex_activity_logs").insert({
      user_id: userId,
      email,
      action: type === "register" ? "register" : "login",
      ip_address: req.headers.get("x-forwarded-for") || null,
    });
    if (logError) {
      console.error("[auth-event] Failed to insert activity log:", logError.message);
    }

    const label = type === "register" ? "REGISTRASI MEMBER BARU" : "MEMBER LOGIN";
    const text =
      `<b>${label}</b>\n\n` +
      `Username: <b>@${username}</b>\n` +
      `Email: ${email}` +
      (fullName ? `\nNama: ${fullName}` : "") +
      (phone ? `\nTelepon: ${phone}` : "") +
      (profileError ? `\n\n⚠️ GAGAL SIMPAN PROFIL: ${profileError}` : "") +
      `\nWaktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB`;

    await sendTelegramNotification(text);

    if (type === "register" && !profileSaved) {
      // Surface the failure to the client instead of silently returning ok:true —
      // the register page will show this to the user and ask them to retry/contact admin.
      return NextResponse.json(
        { ok: false, error: `Gagal menyimpan profil ke database: ${profileError}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth-event] Unhandled error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
