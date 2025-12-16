/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { buildPrompt } from "@/lib/prompt";
import { cleanJSON } from "@/utils/clean";
import mammoth from "mammoth";
import { NextResponse } from "next/server";

async function parseFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (file.name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (file.name.endsWith(".doc")) {
    return buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const cv = form.get("cv") as File | null;
    const jd = form.get("jd") as File | null;

    if (!cv || !jd) {
      return NextResponse.json(
        { error: "CV or JD is missing" },
        { status: 200 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment" },
        { status: 200 }
      );
    }

    // --- parse files ---
    const cvText = await parseFile(cv);
    const jdText = await parseFile(jd);

    // --- build prompt ---
    const prompt = buildPrompt(cvText, jdText);

    // --- call OpenAI ---
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.1,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.choices?.[0]) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI error" },
        { status: 200 }
      );
    }

    const raw = data.choices[0].message.content || "";

    // --- clean JSON ---
    let parsed;
    try {
      parsed = cleanJSON(raw);
    } catch (e) {
      parsed = { summary: raw, match_score: 0 };
    }

    parsed.match_score = Math.max(
      0,
      Math.min(100, Number(parsed.match_score) || 0)
    );

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 200 }
    );
  }
}
