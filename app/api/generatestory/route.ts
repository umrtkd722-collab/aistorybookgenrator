import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Story } from "@/lib/modals/Story";
import { BookPlan } from "@/lib/modals/Book";
import { getCurrentUser } from "@/lib/auth";
import { initGridFS, uploadFile, downloadFromGridFS } from "@/lib/gridf";
import fs from "fs";
import path from "path";
import os from "os";
import { generatePDFWithImages } from "@/lib/pdfGenerate";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface GenerateBookRequest {
  bookIdea: string;
  bookType: string;
  name: string;
  age: string;
  relationship: string;
  occasion: string;
  tone: string;
  funnyMemory: string;
  personality: string;
  favourite: string;
  catchphrase: string;
  superpower: string;
  story: string;
  extra: string;
  coverStyle: string;
  title: string;
  imageFileIds: string[];
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    await initGridFS();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const body: GenerateBookRequest = await req.json();
    const {
      bookIdea, bookType, name, age, relationship, occasion, tone,
      funnyMemory, personality, favourite, catchphrase, superpower,
      story: userStory, extra, coverStyle, title, imageFileIds = []
    } = body;

    if (!bookIdea || !title || !name) {
      return NextResponse.json(
        { error: "Book idea, title, and recipient name are required." },
        { status: 400 }
      );
    }

    // 🔹 STEP 1: Build prompt for story
  const storyPrompt = `
You are a world-class children's book author. Write a long, detailed, emotional, age-appropriate storybook for a printed edition of about 250 pages.

Recipient: ${name}
Age: ${age}
Relationship: ${relationship || "someone special"}
Occasion: ${occasion || "a loving surprise"}

Must naturally include:
- Funny memory: "${funnyMemory}"
- Personality traits: ${personality}
- Favorite things: ${favourite}
- Catchphrase: "${catchphrase}"
- Superpower: "${superpower}"
- Personal moment: "${userStory}"
- Extra detail: ${extra}

CORE REQUIREMENT:
- Generate a story long enough to fill **at least 200–250 pages** when printed (Lulu 6×9 format).
- Total word count target: **28,000 to 35,000 words**.
- Chapters: **25 to 35 long chapters**.
- Each chapter: **700–1200 words**, divided into **many paragraphs**, perfect for page-by-page layout.
- Story tone: highly emotional, magical, warm, full of love and adventure.
- Use simple, poetic language based on child's age.
- Catchphrase should appear naturally multiple times.
- The last chapter must end with a heartfelt, tear-jerking personal message from the giver to ${name}.

FORMAT STRICTLY LIKE THIS:

Chapter 1: Title
[8–15 paragraphs]

Chapter 2: Title
[8–15 paragraphs]

...continue until final chapter

Begin now and generate the full long-format story without summarizing.`.trim();

    // 🔹 STEP 2: Generate Story
    const storyResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: storyPrompt }],
      temperature: 0.8,
    });

    const storyText = storyResponse.choices[0].message.content?.trim();
    if (!storyText) {
      return NextResponse.json({ error: "Failed to generate story." }, { status: 500 });
    }

    // 🔹 STEP 3: Generate Design Theme for PDF
    const designPrompt = `
    You are a creative children's book designer. Based on this story and its details, 
    generate a JSON theme describing the perfect visual style for the storybook.

    Title: "${title}"
    Book Idea: "${bookIdea}"
    Tone: "${tone}"
    Story Summary: "${storyText.substring(0, 500)}..."

    Respond ONLY in JSON like this:
    {
      "colorPalette": {
        "primary": "#HEX",
        "secondary": "#HEX",
        "background": "#HEX",
        "accent": "#HEX"
      },
      "fontStyle": "Playful | Classic | Modern | Handwritten | Comic-style",
      "pageLayout": "Full-page illustrations | Split text and image | Text with borders",
      "illustrationMood": "Dreamy | Magical | Bright | Calm | Whimsical",
      "specialEffects": "Watercolor texture, sparkles, gradients, or simple paper look"
    }
    `;

    const designResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: designPrompt }],
      temperature: 0.7,
    });

    let designTheme: any = {};
    try {
      const raw = designResponse.choices[0].message.content?.trim();
      const jsonMatch = raw?.match(/\{[\s\S]*\}/);
      console.log(raw)
     if (jsonMatch) {
     designTheme = JSON.parse(jsonMatch[0]);
     } else {
      console.warn("⚠️ No valid JSON block found in design theme output:", raw);
    }
    } catch {
      designTheme = {};
    }

    console.log("🎨 Generated Design Theme:", designTheme);

    // 🔹 STEP 4: Download Images from GridFS
    const imageBuffers: Buffer[] = [];
    for (const fileId of imageFileIds) {
      try {
        const buffer = await downloadFromGridFS(fileId);
        console.log(buffer)
                imageBuffers.push(buffer);
      } catch (err) {
        console.warn(`Failed to load image ${fileId}:`, err);
      }
    }

    // 🔹 STEP 5: Generate PDF with AI-styled appearance
    const pdfBuffer = await generatePDFWithImages({
      title,
      storyText,
      
      imageBuffers,
      recipientName: name,
      
    });

    // 🔹 STEP 6: Save PDF and upload
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.pdf`;
    tempFilePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempFilePath, pdfBuffer);

    const pdfFileId = await uploadFile(tempFilePath, filename);

    // 🔹 STEP 7: Save story + book plan in DB
    const storyDoc = await Story.create({
      userId: user._id,
      planId: user.plan || null,
      title,
      prompt: storyPrompt,
      storyText,
      coverUrl: imageFileIds[0] ? `/api/gridfs/image/${imageFileIds[0]}` : undefined,
      pdfFileId,
    });

    const bookPlan = await BookPlan.create({
      userId: user._id,
      planId: user.plan || null,
      title,
      description: bookIdea,
      type: occasion?.toLowerCase()?.includes("gift") ? "gift" : "relationship",
      storyIds: [storyDoc._id],
      coverUrl: imageFileIds[0] ? `/api/gridfs/image/${imageFileIds[0]}` : undefined,
    });

    // 🔹 STEP 8: Success Response
    return NextResponse.json({
      storyId: storyDoc.id.toString(),
      bookPlanId: bookPlan.id.toString(),
      message: "Book generated successfully with custom design!",
      previewUrl: `/api/pdf/view/${pdfFileId}`,
    });

  } catch (error: any) {
    console.error("❌ Book generation error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
