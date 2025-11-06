// lib/pdfGenerate.ts
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

interface PDFOptions {
  title: string;
  storyText: string;
  coverStyle: string;
  imageBuffers: Buffer[];
  recipientName: string;
}

export async function generatePDFWithImages(opts: PDFOptions): Promise<Uint8Array> {
  const { title, storyText, imageBuffers, recipientName } = opts;
  console.log("🖼️ Image Buffers:", imageBuffers.length);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // === Load fonts ===
  const titleFontPath = path.join(process.cwd(), "public", "fonts", "PlayfairDisplay-Bold.ttf");
  const bodyFontPath = path.join(process.cwd(), "public", "fonts", "OpenSans-Regular.ttf");

  const titleFont = await pdfDoc.embedFont(fs.readFileSync(titleFontPath));
  const bodyFont = await pdfDoc.embedFont(fs.readFileSync(bodyFontPath));

  // === Page setup ===
  const pageWidth = 600;
  const pageHeight = 850;
  const margin = 60;
  let y = pageHeight - margin;

  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    return page;
  };

  let page = addPage();

  // === COVER PAGE ===
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.98, 0.95, 1),
  });

  page.drawText(title, {
    x: margin,
    y: y - 60,
    size: 36,
    font: titleFont,
    color: rgb(0.3, 0.15, 0.45),
  });
  y -= 120;

  page.drawText(`A story for ${recipientName}`, {
    x: margin,
    y,
    size: 20,
    font: bodyFont,
    color: rgb(0.45, 0.45, 0.45),
  });
  y -= 80;

  // === COVER IMAGE (JPG/PNG both supported) ===
  if (imageBuffers?.[0]) {
    try {
      const imgType = isPng(imageBuffers[0]) ? "png" : "jpg";
      const img =
        imgType === "png"
          ? await pdfDoc.embedPng(imageBuffers[0])
          : await pdfDoc.embedJpg(imageBuffers[0]);
      const maxImgWidth = pageWidth - 2 * margin;
      const maxImgHeight = 350;
      const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;
      page.drawImage(img, {
        x: (pageWidth - imgWidth) / 2,
        y: y - imgHeight,
        width: imgWidth,
        height: imgHeight,
      });
      y -= imgHeight + 40;
    } catch (err) {
      console.error("❌ Failed to embed cover image:", err);
    }
  }

  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1.5,
    color: rgb(0.8, 0.6, 0.8),
  });

  // === STORY PAGES ===
  page = addPage();
  const paragraphs = storyText.split("\n\n").map(p => p.trim()).filter(Boolean);
  let imageIndex = 1;

  for (const para of paragraphs) {
    const fragments = parseBoldText(para);

    for (const frag of fragments) {
      const fontUsed = frag.bold ? titleFont : bodyFont;
      const size = frag.bold ? 18 : 15;
      const color = frag.bold ? rgb(0.4, 0.2, 0.5) : rgb(0.2, 0.2, 0.2);
      const lines = wrapText(frag.text, fontUsed, size, pageWidth - 2 * margin);

      for (const line of lines) {
        if (y < 120) page = addPage();
        page.drawText(line, { x: margin, y, size, font: fontUsed, color });
        y -= size + 8;
      }
    }

    y -= 20;

    // === Insert next image if available ===
    if (imageBuffers[imageIndex]) {
      try {
        const imgType = isPng(imageBuffers[imageIndex]) ? "png" : "jpg";
        const img =
          imgType === "png"
            ? await pdfDoc.embedPng(imageBuffers[imageIndex])
            : await pdfDoc.embedJpg(imageBuffers[imageIndex]);
        const maxImgWidth = pageWidth - 2 * margin - 40;
        const maxImgHeight = 250;
        const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        page.drawImage(img, {
          x: (pageWidth - imgWidth) / 2,
          y: y - imgHeight,
          width: imgWidth,
          height: imgHeight,
        });
        y -= imgHeight + 40;
      } catch (err) {
        console.error("❌ Failed to embed paragraph image:", err);
      }
      imageIndex++;
    }
  }

  // === END PAGE ===
  page = addPage();
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(1, 0.97, 0.98),
  });
  page.drawText("With love,", {
    x: margin,
    y: pageHeight - 200,
    size: 26,
    font: titleFont,
    color: rgb(0.8, 0.2, 0.4),
  });
  page.drawText("From your heart to theirs ❤️", {
    x: margin,
    y: pageHeight - 250,
    size: 18,
    font: bodyFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  return await pdfDoc.save();
}

// === Detect PNG by header ===
function isPng(buffer: Buffer): boolean {
  return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
}

// === Bold text parser ===
function parseBoldText(text: string) {
  const fragments: { text: string; bold: boolean }[] = [];
  const parts = text.split(/(\*[^*]+\*)/g);
  for (const part of parts) {
    if (part.startsWith("*") && part.endsWith("*")) {
      fragments.push({ text: part.slice(1, -1), bold: true });
    } else if (part.trim()) {
      fragments.push({ text: part, bold: false });
    }
  }
  return fragments;
}

// === Wrap text ===
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current + word + " ";
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width > maxWidth) {
      lines.push(current.trim());
      current = word + " ";
    } else {
      current = test;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}
