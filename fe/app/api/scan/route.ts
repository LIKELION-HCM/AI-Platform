/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { buildHrPrompt } from "@/lib/hrPrompt";
import { buildUserPrompt } from "@/lib/userPrompt";
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

    const cvs = form.getAll("cvs") as File[];
    const jds = form.getAll("jds") as File[];

    const cvTextInput = form.get("cvText");
    const jdTextInput = form.get("jdText");

    const userType = String(form.get("userType") || "USER");

    if (
      (!cvs.length && !cvTextInput) ||
      (!jds.length && !jdTextInput)
    ) {
      return NextResponse.json(
        { error: "CV or JD is missing" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const cvTexts: { name: string; text: string }[] = [];
    const jdTexts: { name: string; text: string }[] = [];

    // ---- CV: FILE ----
    if (cvs.length) {
      const parsedCvs = await Promise.all(
        cvs.map(async (f) => ({
          name: f.name,
          text: await parseFile(f),
        }))
      );
      cvTexts.push(...parsedCvs);
    }

    // ---- CV: TEXT ----
    if (cvTextInput) {
      cvTexts.push({
        name: "Manual CV",
        text: String(cvTextInput),
      });
    }

    // ---- JD: FILE ----
    if (jds.length) {
      const parsedJds = await Promise.all(
        jds.map(async (f) => ({
          name: f.name,
          text: await parseFile(f),
        }))
      );
      jdTexts.push(...parsedJds);
    }

    // ---- JD: TEXT ----
    if (jdTextInput) {
      jdTexts.push({
        name: "Manual JD",
        text: String(jdTextInput),
      });
    }

    if (cvTexts.length > 1 && jdTexts.length > 1) {
      return NextResponse.json(
        {
          error:
            "Only one side can contain multiple documents (CVs or JDs)",
        },
        { status: 400 }
      );
    }

    const results: any[] = [];

    // COMPANY: many CVs vs 1 JD
    if (userType === "COMPANY") {
      const jd = jdTexts[0];

      for (const cv of cvTexts) {
        const prompt = buildHrPrompt(cv.text, jd.text);
        const parsed = await analyzeWithGPT(prompt, apiKey);

        results.push({
          cvName: cv.name,
          jdName: jd.name,
          ...parsed,
        });
      }
    }

    // USER: 1 CV vs many JDs
    else {
      const cv = cvTexts[0];

      for (const jd of jdTexts) {
        const prompt = buildUserPrompt(cv.text, jd.text);
        const parsed = await analyzeWithGPT(prompt, apiKey);

        results.push({
          cvName: cv.name,
          jdName: jd.name,
          ...parsed,
        });
      }
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

async function analyzeWithGPT(prompt: string, apiKey: string) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt,
      text: {
        format: { type: "json_object" },
      },
      max_output_tokens: 1200,
      temperature: 0.1,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("OpenAI error:", data);
    throw new Error(data.error?.message || "OpenAI request failed");
  }

  const output = data.output?.[0]?.content?.[0];

  if (!output || output.type !== "output_text") {
    console.error("Unexpected OpenAI response:", data);
    throw new Error("Invalid OpenAI response format");
  }

  const raw = output.text;

  let parsed;
  try {
    parsed = cleanJSON(raw);
  } catch {
    parsed = { summary: raw, match_score: 0 };
  }

  parsed.match_score = Math.max(
    0,
    Math.min(100, Number(parsed.match_score) || 0)
  );

  return parsed;
}
