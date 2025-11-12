// app/api/book/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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
  imageFileIds: string[]; // ← Changed from imageUrls
}

interface GenerateBookResponse {
  storyId: string;
  bookPlanId: string;
  message: string;
  previewUrl?: string;
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

    // 1. Build Prompt
      const prompt = `
      You are a world-class children's storyteller with a gift for weaving **heartfelt, imaginative, and emotionally rich** tales. Write a **beautiful, personalized story** for **${name}** (${age} years old) that feels like it was written just for them — full of wonder, warmth, and magic.

      ---

      **Recipient Details**  
      - Name: ${name}  
      - Age: ${age}  
      - Relationship to you: ${relationship}  
      - Occasion: ${occasion || 'a special surprise'}  

      **Must Include (weave naturally into the story)**  
      - A **hilarious memory**: "${funnyMemory}"  
      - Personality traits: ${personality}  
      - Favorite things: ${favourite}  
      - Catchphrase: "${catchphrase}"  
      - Superpower: **${superpower}**  
      - A personal story/event: "${userStory}"  
      - Extra quirks: ${extra}  

      **Core Idea to Build On**  
      > "${bookIdea}"

      ---

      **Style & Tone**  
      - **${tone || 'warm, playful, and deeply emotional'}**  
      - **Engaging, cinematic, and vivid** — paint scenes like a movie  
      - **400–800 words**  
      - **Age-appropriate language** (fun, clear, magical)  
      - **End with a tender, loving message** from the giver to ${name}  

      ---

      **Creative Freedom**  
      - Add **whimsical characters, talking animals, magical worlds, or time travel** if it fits  
      - Let **${name}'s superpower** spark the adventure  
      - Turn the **funny memory** into a legendary moment in the tale  
      - Make **${catchphrase}** a heroic or heartwarming refrain  

      ---

      **Final Touch**  
      Close with a **personal, tear-jerking message** from the storyteller to ${name}, mentioning love, pride, and forever friendship/family bond.

      Begin now.
  `.trim();

    // 2. Generate Story
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      
      temperature: 0,
    });

    const storyText = completion.choices[0].message.content?.trim();
    if (!storyText) {
      return NextResponse.json({ error: "Failed to generate story." }, { status: 500 });
    }
console.log(imageFileIds , )
    // 3. Download Images from GridFS
    const imageBuffers: Buffer[] = [];
    for (const fileId of imageFileIds) {
      try {
        const buffer = await downloadFromGridFS(fileId);
        imageBuffers.push(buffer);
      } catch (err) {
        console.warn(`Failed to load image ${fileId}:`, err);
      }
    }
console.log("buffer",imageBuffers)
    // 4. Generate PDF with images from GridFS
    const pdfBuffer = await generatePDFWithImages({
      title,
      storyText,
      coverStyle: coverStyle || "classic",
      imageBuffers, // ← Pass buffers
      recipientName: name,
    });

    // 5. Save PDF to temp + upload
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.pdf`;
    tempFilePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempFilePath, pdfBuffer);

    const pdfFileId = await uploadFile(tempFilePath, filename);

    // 6. Save Story
    const storyDoc = await Story.create({
      userId: user._id,
      planId: user.plan || null,
      title,
      prompt,
      storyText,
      coverUrl: imageFileIds[0] ? `/api/gridfs/image/${imageFileIds[0]}` : undefined,
      pdfFileId,
    });

    // 7. Create BookPlan
    const bookPlan = await BookPlan.create({
      userId: user._id,
      planId: user.plan || null,
      title,
      description: bookIdea,
      type: occasion.toLowerCase().includes("gift") ? "gift" : "relationship",
      storyIds: [storyDoc._id],
      coverUrl: imageFileIds[0] ? `/api/gridfs/image/${imageFileIds[0]}` : undefined,
    });

    // 8. Success
    return NextResponse.json({
      storyId: storyDoc.id.toString(),
      bookPlanId: bookPlan.id.toString(),
      message: "Book generated and saved!",
      previewUrl: `/api/pdf/view/${pdfFileId}`,
    });

  } catch (error: any) {
    console.error("Book generation error:", error);
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