// import { PDFDocument, rgb, degrees } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";
// import fs from "fs";
// import path from "path";

// interface DesignTheme {
//   colorPalette?: {
//     primary?: string;
//     secondary?: string;
//     background?: string;
//     accent?: string;
//   };
//   fontStyle?: string;
//   pageLayout?: string;
//   illustrationMood?: string;
//   specialEffects?: string;
// }

// interface PDFOptions {
//   title: string;
//   storyText: string;
//   coverStyle: string;
//   imageBuffers: Buffer[];
//   recipientName: string;
//   designTheme?: DesignTheme; // 🆕 Added design theme support
// }

// export async function generatePDFWithImages(opts: PDFOptions): Promise<Uint8Array> {
//   const { title, storyText, imageBuffers, recipientName, designTheme = {} } = opts;
//   console.log("🖼️ Image Buffers:", imageBuffers.length);
//   console.log("🎨 Design Theme:", designTheme);

//   const pdfDoc = await PDFDocument.create();
//   pdfDoc.registerFontkit(fontkit);

//   // === Load fonts (fallback if theme suggests another) ===
//   const fontDir = path.join(process.cwd(), "public", "fonts");
//   const titleFontPath = path.join(fontDir, "PlayfairDisplay-Bold.ttf");
//   const bodyFontPath = path.join(fontDir, "OpenSans-Regular.ttf");

//   const titleFont = await pdfDoc.embedFont(fs.readFileSync(titleFontPath));
//   const bodyFont = await pdfDoc.embedFont(fs.readFileSync(bodyFontPath));

//   // === Helper: Convert HEX → rgb() ===
//   const hexToRgb = (hex?: string, fallback = rgb(0, 0, 0)) => {
//     if (!hex || !hex.startsWith("#")) return fallback;
//     const bigint = parseInt(hex.replace("#", ""), 16);
//     const r = ((bigint >> 16) & 255) / 255;
//     const g = ((bigint >> 8) & 255) / 255;
//     const b = (bigint & 255) / 255;
//     return rgb(r, g, b);
//   };

//   // === Extract colors from theme ===
//   const colors = {
//     background: hexToRgb(designTheme.colorPalette?.background, rgb(1, 1, 1)),
//     primary: hexToRgb(designTheme.colorPalette?.primary, rgb(0.2, 0.2, 0.2)),
//     secondary: hexToRgb(designTheme.colorPalette?.secondary, rgb(0.4, 0.4, 0.4)),
//     accent: hexToRgb(designTheme.colorPalette?.accent, rgb(0.8, 0.4, 0.6)),
//   };

//   // === Adjust typography based on fontStyle ===
//   const fontSettings = {
//     titleSize: designTheme.fontStyle?.includes("Comic")
//       ? 34
//       : designTheme.fontStyle?.includes("Classic")
//       ? 40
//       : 36,
//     bodySize: designTheme.fontStyle?.includes("Comic")
//       ? 15
//       : designTheme.fontStyle?.includes("Handwritten")
//       ? 17
//       : 15,
//   };

//   // === Page setup ===
//   const pageWidth = 600;
//   const pageHeight = 850;
//   const margin = 60;
//   let y = pageHeight - margin;

//   const addPage = () => {
//     const page = pdfDoc.addPage([pageWidth, pageHeight]);
//     y = pageHeight - margin;
//     // 🎨 Page background based on theme
//     page.drawRectangle({
//       x: 0,
//       y: 0,
//       width: pageWidth,
//       height: pageHeight,
//       color: colors.background,
//     });

//     // Optional "special effect" overlay
//     if (designTheme.specialEffects?.includes("gradient")) {
//       page.drawRectangle({
//         x: 0,
//         y: 0,
//         width: pageWidth,
//         height: pageHeight,
//         color: colors.accent,
//         opacity: 0.1,
//         rotate: degrees(15),
//       });
//     }

//     if (designTheme.specialEffects?.includes("border")) {
//       page.drawRectangle({
//         x: 20,
//         y: 20,
//         width: pageWidth - 40,
//         height: pageHeight - 40,
//         borderColor: colors.secondary,
//         borderWidth: 2,
//       });
//     }

//     return page;
//   };

//   // === COVER PAGE ===
//   let page = addPage();
//   page.drawText(title, {
//     x: margin,
//     y: y - 60,
//     size: fontSettings.titleSize,
//     font: titleFont,
//     color: colors.primary,
//   });
//   y -= 120;

//   page.drawText(`A story for ${recipientName}`, {
//     x: margin,
//     y,
//     size: fontSettings.bodySize + 4,
//     font: bodyFont,
//     color: colors.secondary,
//   });
//   y -= 80;

//   // === COVER IMAGE ===
//   if (imageBuffers?.[0]) {
//     try {
//       const imgType = isPng(imageBuffers[0]) ? "png" : "jpg";
//       const img =
//         imgType === "png"
//           ? await pdfDoc.embedPng(imageBuffers[0])
//           : await pdfDoc.embedJpg(imageBuffers[0]);
//       const maxImgWidth = pageWidth - 2 * margin;
//       const maxImgHeight = 350;
//       const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
//       const imgWidth = img.width * scale;
//       const imgHeight = img.height * scale;
//       page.drawImage(img, {
//         x: (pageWidth - imgWidth) / 2,
//         y: y - imgHeight,
//         width: imgWidth,
//         height: imgHeight,
//       });
//       y -= imgHeight + 40;
//     } catch (err) {
//       console.error("❌ Failed to embed cover image:", err);
//     }
//   }

//   page.drawLine({
//     start: { x: margin, y },
//     end: { x: pageWidth - margin, y },
//     thickness: 1.5,
//     color: colors.accent,
//   });

//   // === STORY PAGES ===
//   page = addPage();
//   const paragraphs = storyText.split("\n\n").map((p) => p.trim()).filter(Boolean);
//   let imageIndex = 1;

//   for (const para of paragraphs) {
//     const fragments = parseBoldText(para);
//     for (const frag of fragments) {
//       const fontUsed = frag.bold ? titleFont : bodyFont;
//       const size = frag.bold ? fontSettings.bodySize + 3 : fontSettings.bodySize;
//       const color = frag.bold ? colors.accent : colors.primary;
//       const lines = wrapText(frag.text, fontUsed, size, pageWidth - 2 * margin);

//       for (const line of lines) {
//         if (y < 120) page = addPage();
//         page.drawText(line, { x: margin, y, size, font: fontUsed, color });
//         y -= size + 8;
//       }
//     }

//     y -= 20;

//     // === Insert next image if available ===
//     if (imageBuffers[imageIndex]) {
//       try {
//         const imgType = isPng(imageBuffers[imageIndex]) ? "png" : "jpg";
//         const img =
//           imgType === "png"
//             ? await pdfDoc.embedPng(imageBuffers[imageIndex])
//             : await pdfDoc.embedJpg(imageBuffers[imageIndex]);
//         const maxImgWidth = pageWidth - 2 * margin - 40;
//         const maxImgHeight = 250;
//         const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
//         const imgWidth = img.width * scale;
//         const imgHeight = img.height * scale;

//         page.drawImage(img, {
//           x: (pageWidth - imgWidth) / 2,
//           y: y - imgHeight,
//           width: imgWidth,
//           height: imgHeight,
//         });
//         y -= imgHeight + 40;
//       } catch (err) {
//         console.error("❌ Failed to embed paragraph image:", err);
//       }
//       imageIndex++;
//     }
//   }

//   // === END PAGE ===
//   page = addPage();
//   page.drawText("With love,", {
//     x: margin,
//     y: pageHeight - 200,
//     size: fontSettings.titleSize - 6,
//     font: titleFont,
//     color: colors.accent,
//   });
//   page.drawText("From your heart to theirs ❤️", {
//     x: margin,
//     y: pageHeight - 250,
//     size: fontSettings.bodySize + 2,
//     font: bodyFont,
//     color: colors.secondary,
//   });

//   return await pdfDoc.save();
// }

// // === Detect PNG by header ===
// function isPng(buffer: Buffer): boolean {
//   return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
// }

// // === Bold text parser ===
// function parseBoldText(text: string) {
//   const fragments: { text: string; bold: boolean }[] = [];
//   const parts = text.split(/(\*[^*]+\*)/g);
//   for (const part of parts) {
//     if (part.startsWith("*") && part.endsWith("*")) {
//       fragments.push({ text: part.slice(1, -1), bold: true });
//     } else if (part.trim()) {
//       fragments.push({ text: part, bold: false });
//     }
//   }
//   return fragments;
// }

// // === Word wrap ===
// function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
//   const words = text.split(" ");
//   const lines: string[] = [];
//   let current = "";

//   for (const word of words) {
//     const test = current + word + " ";
//     const width = font.widthOfTextAtSize(test, fontSize);
//     if (width > maxWidth) {
//       lines.push(current.trim());
//       current = word + " ";
//     } else {
//       current = test;
//     }
//   }
//   if (current) lines.push(current.trim());
//   return lines;
// }

// import { PDFDocument, rgb, degrees } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";
// import fs from "fs";
// import path from "path";

// interface DesignTheme {
//   colorPalette?: {
//     primary?: string;
//     secondary?: string;
//     background?: string;
//     accent?: string;
//   };
//   fontStyle?: string;
//   pageLayout?: string;
//   illustrationMood?: string;
//   specialEffects?: string;
// }

// interface PDFOptions {
//   title: string;
//   storyText: string;
//   coverStyle: string;
//   imageBuffers: Buffer[];
//   recipientName: string;
//   designTheme?: DesignTheme;
// }

// // export async function generatePDFWithImages(opts: PDFOptions): Promise<Uint8Array> {
// //   const { title, storyText, imageBuffers, recipientName,  } = opts;
// //   console.log("🖼️ Image Buffers:", imageBuffers.length);
// //   const designTheme = {
// //     colorPalette: {
// //       primary: "#3B2F5C",      // Dark purple, readable for text
// //       secondary: "#5D4E7A",    // Slightly lighter for subtitles
// //       background: "#FFF8F0",   // Warm, neutral page background
// //       accent: "#A78BFA",       // Soft accent for lines or title decoration
// //     },
// //     fontStyle: "Handwritten",   // Storybook-friendly
// //     pageLayout: "Full-page illustrations",
// //     illustrationMood: "Whimsical | Bright | Magical",
// //     specialEffects: "",         // No garish effects
// //   };
// //   console.log("🎨 Design Theme:", designTheme);
// //   const pdfDoc = await PDFDocument.create();
// //   pdfDoc.registerFontkit(fontkit);

// //   // === Load fonts ===
// //   const fontDir = path.join(process.cwd(), "public", "fonts");
// //   const titleFontPath = path.join(fontDir, "OpenSans_Condensed-Bold.ttf");
// //   const bodyFontPath = path.join(fontDir, "OpenSans-Regular.ttf");

// //   const titleFont = await pdfDoc.embedFont(fs.readFileSync(titleFontPath));
// //   const bodyFont = await pdfDoc.embedFont(fs.readFileSync(bodyFontPath));

// //   // === Helper: Convert HEX → RGB ===
// //   const hexToRgb = (hex?: string, fallback = rgb(0, 0, 0)) => {
// //     if (!hex || !hex.startsWith("#")) return fallback;
// //     const bigint = parseInt(hex.replace("#", ""), 16);
// //     const r = ((bigint >> 16) & 255) / 255;
// //     const g = ((bigint >> 8) & 255) / 255;
// //     const b = (bigint & 255) / 255;
// //     return rgb(r, g, b);
// //   };

// //   // === Extract theme colors ===
// //   const colors = {
// //     background: hexToRgb(designTheme.colorPalette?.background, rgb(1, 1, 1)),
// //     primary: hexToRgb(designTheme.colorPalette?.primary, rgb(0.2, 0.2, 0.2)),
// //     secondary: hexToRgb(designTheme.colorPalette?.secondary, rgb(0.4, 0.4, 0.4)),
// //     accent: hexToRgb(designTheme.colorPalette?.accent, rgb(0.8, 0.4, 0.6)),
// //   };

// //   // === Font sizing ===
// //   const fontSettings = {
// //     titleSize: 38,
// //     bodySize: 15,
// //   };

// //   const pageWidth = 600;
// //   const pageHeight = 850;
// //   const margin = 60;
// //   let y = pageHeight - margin;

// //   const addPage = () => {
// //     const page = pdfDoc.addPage([pageWidth, pageHeight]);
// //     y = pageHeight - margin;

// //     // Page background
// //     page.drawRectangle({
// //       x: 0,
// //       y: 0,
// //       width: pageWidth,
// //       height: pageHeight,
// //       color: colors.background,
// //     });

// //     return page;
// //   };

// //   // === COVER PAGE ===
// //   let page = addPage();

// //   // Normalize title: capitalize words
// //   const formattedTitle = title
// //     .split(" ")
// //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
// //     .join(" ");

// //   // Center title dynamically
// //   const titleLines = wrapText(formattedTitle, titleFont, fontSettings.titleSize, pageWidth - 2 * margin);
// //   let titleHeight = titleLines.length * (fontSettings.titleSize + 6);
// //   let titleY = y - 100;

// //   for (const line of titleLines) {
// //     const textWidth = titleFont.widthOfTextAtSize(line, fontSettings.titleSize);
// //     const x = (pageWidth - textWidth) / 2;
// //     page.drawText(line, { x, y: titleY, size: fontSettings.titleSize, font: titleFont, color: colors.primary });
// //     titleY -= fontSettings.titleSize + 6;
// //   }

// //   y = titleY - 50;

// //   const subtitle = `A Story for ${recipientName}`;
// //   const subtitleWidth = bodyFont.widthOfTextAtSize(subtitle, fontSettings.bodySize + 3);
// //   page.drawText(subtitle, {
// //     x: (pageWidth - subtitleWidth) / 2,
// //     y,
// //     size: fontSettings.bodySize + 3,
// //     font: bodyFont,
// //     color: colors.secondary,
// //   });
// //   y -= 100;

// //   // COVER IMAGE
// //   // if (imageBuffers?.[0]) {
// //   //   try {
// //   //     const imgType = isPng(imageBuffers[0]) ? "png" : "jpg";
// //   //     const img =
// //   //       imgType === "png"
// //   //         ? await pdfDoc.embedPng(imageBuffers[0])
// //   //         : await pdfDoc.embedJpg(imageBuffers[0]);
// //   //     const maxImgWidth = pageWidth - 2 * margin;
// //   //     const maxImgHeight = 350;
// //   //     const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
// //   //     const imgWidth = img.width * scale;
// //   //     const imgHeight = img.height * scale;
// //   //     page.drawImage(img, {
// //   //       x: (pageWidth - imgWidth) / 2,
// //   //       y: y - imgHeight,
// //   //       width: imgWidth,
// //   //       height: imgHeight,
// //   //     });
// //   //   } catch (err) {
// //   //     console.error("❌ Failed to embed cover image:", err);
// //   //   }
// //   // }
// // if (imageBuffers[0] && imageBuffers[0].length > 0) {
// //   try {
// //     const buffer = imageBuffers[0];
// //     const imgType = isPng(buffer) ? 'png' : 'jpg';
// //     const img = imgType === 'png'
// //       ? await pdfDoc.embedPng(new Uint8Array(buffer))
// //       : await pdfDoc.embedJpg(new Uint8Array(buffer));

// //     const maxImgWidth = pageWidth - 2 * margin;
// //     const maxImgHeight = 350;
// //     const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
// //     const imgWidth = img.width * scale;
// //     const imgHeight = img.height * scale;

// //     page.drawImage(img, {
// //       x: (pageWidth - imgWidth) / 2,
// //       y: y - imgHeight,
// //       width: imgWidth,
// //       height: imgHeight,
// //     });

// //     y -= imgHeight + 40;
// //   } catch (err) {
// //     console.error('❌ Failed to embed cover image:', err);
// //   }
// // }

// //   // === INDEX PAGE ===
// //   const paragraphs = storyText.split("\n\n").map((p) => p.trim()).filter(Boolean);
// //   const indexPage = addPage();
// //   indexPage.drawText("Contents", {
// //     x: margin,
// //     y: pageHeight - 100,
// //     size: 28,
// //     font: titleFont,
// //     color: colors.primary,
// //   });

// //   let indexY = pageHeight - 150;
// //   paragraphs.forEach((_, i) => {
// //     const chapter = `Chapter ${i + 1}: Part of the Story`;
// //     indexPage.drawText(chapter, {
// //       x: margin + 20,
// //       y: indexY,
// //       size: fontSettings.bodySize + 1,
// //       font: bodyFont,
// //       color: colors.secondary,
// //     });
// //     indexY -= 24;
// //   });

// //   // === STORY PAGES ===
// //   let imageIndex = 1;
// //   let storyPage = addPage();
// // for (let i = 0; i < paragraphs.length; i++) {
// //   const para = paragraphs[i];
// //   const lines = wrapText(para, bodyFont, fontSettings.bodySize, pageWidth - 2 * margin);

// //   // Add chapter title
// //   storyPage.drawText(`Chapter ${i + 1}`, {
// //     x: margin,
// //     y,
// //     size: fontSettings.bodySize + 4,
// //     font: titleFont,
// //     color: colors.accent,
// //   });
// //   y -= 30;

// //   for (const line of lines) {
// //     if (y < 120) storyPage = addPage();
// //     storyPage.drawText(line, { x: margin, y, size: fontSettings.bodySize, font: bodyFont, color: colors.primary });
// //     y -= fontSettings.bodySize + 6;
// //   }

// //   y -= 30;

// //   // ✅ Add images safely
// //   if (imageIndex < imageBuffers.length && imageBuffers[imageIndex].length > 0) {
// //     try {
// //       const buffer = imageBuffers[imageIndex];
// //       const imgType = isPng(buffer) ? "png" : "jpg";
// //       const img = imgType === "png"
// //         ? await pdfDoc.embedPng(new Uint8Array(buffer))
// //         : await pdfDoc.embedJpg(new Uint8Array(buffer));

// //       const maxImgWidth = pageWidth - 2 * margin - 40;
// //       const maxImgHeight = 250;
// //       const scale = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
// //       const imgWidth = img.width * scale;
// //       const imgHeight = img.height * scale;

// //       storyPage.drawImage(img, {
// //         x: (pageWidth - imgWidth) / 2,
// //         y: y - imgHeight,
// //         width: imgWidth,
// //         height: imgHeight,
// //       });
// //       y -= imgHeight + 40;

// //       imageIndex++; // increment after successful embed
// //     } catch (err) {
// //       console.error(`❌ Failed to embed image at index ${imageIndex}:`, err);
// //       imageIndex++; // increment anyway to avoid infinite loop
// //     }
// //   }
// // }


// //   // === END PAGE ===
// //   const endPage = addPage();
// //   endPage.drawText("With love,", {
// //     x: margin,
// //     y: pageHeight - 200,
// //     size: 28,
// //     font: titleFont,
// //     color: colors.accent,
// //   });
// //   endPage.drawText("From your heart to theirs ❤️", {
// //     x: margin,
// //     y: pageHeight - 250,
// //     size: fontSettings.bodySize + 2,
// //     font: bodyFont,
// //     color: colors.secondary,
// //   });

// //   return await pdfDoc.save();
// // }

// // // === Detect PNG ===
// // function isPng(buffer: Buffer): boolean {
// //   return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
// // }

// // // === Word Wrap ===
// // function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
// //   const words = text.split(" ");
// //   const lines: string[] = [];
// //   let current = "";

// //   for (const word of words) {
// //     const test = current + word + " ";
// //     const width = font.widthOfTextAtSize(test, fontSize);
// //     if (width > maxWidth) {
// //       lines.push(current.trim());
// //       current = word + " ";
// //     } else {
// //       current = test;
// //     }
// //   }
// //   if (current) lines.push(current.trim());
// //   return lines;
// // }


// lib/pdfGenerate.ts
// lib/pdfGenerate.ts
// lib/pdfGenerate.ts
// lib/pdfGenerate.ts
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

interface PDFOptions {
  title: string;
  storyText: string;
  imageBuffers: Buffer[];
  recipientName: string;
}

export async function generatePDFWithImages(opts: PDFOptions): Promise<Uint8Array> {
  const { title, storyText, imageBuffers, recipientName } = opts;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // LULU 8.5x8.5 with bleed
  const PAGE_WIDTH = 621;
  const PAGE_HEIGHT = 621;
  const BLEED = 9;
  const MARGIN = 60;
  const SAFE_LEFT = BLEED + MARGIN;
  const SAFE_TOP = PAGE_HEIGHT - BLEED - MARGIN;
  const SAFE_WIDTH = PAGE_WIDTH - 2 * (BLEED + MARGIN);

  // PERFECT SPACING (FINAL)
  const FONT_SIZE = 17;           // Chota + readable
  const LINE_HEIGHT = 28;         // Breathable gap
  const PARAGRAPH_SPACING = 44;   // Paragraphs alag dikhein
  const IMAGE_GAP = 70;           // Image ke baad thoda zyada space

  // PROFESSIONAL COLORS
  const colors = {
    bg: rgb(0.98, 0.97, 0.93),
    chapterNum: rgb(0.15, 0.45, 0.55),
    chapterTitle: rgb(0.1, 0.15, 0.35),
    text: rgb(0.2, 0.2, 0.2),
    pageNumber: rgb(0.5, 0.5, 0.5),
  };

  const fontDir = path.join(process.cwd(), "public", "fonts");
  const titleFont = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDir, "PlayfairDisplay-Italic.ttf")));
  const bodyFont = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDir, "PlayfairDisplay-Italic.ttf")));

  let y = SAFE_TOP;
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let pageCount = 1;

  const fillBg = (p: any) => {
    p.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: colors.bg });
  };
  fillBg(page);

  // COVER PAGE
  if (imageBuffers[0]) {
    try {
      const img = imageBuffers[0][0] === 0x89
        ? await pdfDoc.embedPng(imageBuffers[0])
        : await pdfDoc.embedJpg(imageBuffers[0]);
      page.drawImage(img, { x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT });
      page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: rgb(0,0,0), opacity: 0.48 });
    } catch (err) {
      console.warn("Cover image failed");
    }
  }

  const cleanTitle = title.replace(/[\*\#\-\_]/g, "").trim();
  const titleLines = wrapText(cleanTitle, titleFont, 50, SAFE_WIDTH);
  y = PAGE_HEIGHT / 2 + titleLines.length * 32;
  for (const line of titleLines) {
    const w = titleFont.widthOfTextAtSize(line, 50);
    page.drawText(line, { x: (PAGE_WIDTH - w) / 2, y, size: 50, font: titleFont, color: rgb(1,1,1) });
    y -= 68;
  }
  page.drawText(`For ${recipientName}`, {
    x: SAFE_LEFT,
    y: y - 70,
    size: 30,
    font: bodyFont,
    color: rgb(1,1,1)
  });

  // CLEAN STORY
  const cleanStory = storyText
    .replace(/\*\*|\*|\#|\-|\_|>/g, "")
    .replace(/\n+/g, "\n")
    .trim();

  // EXTRACT CHAPTERS
  const chapterRegex = /Chapter\s*(\d+)[\s:]*([^\n]+)\n([\s\S]*?)(?=Chapter\s*\d+|$)/gi;
  const chapters: { number: string; title: string; content: string }[] = [];
  let match;
  while ((match = chapterRegex.exec(cleanStory)) !== null) {
    chapters.push({
      number: match[1].trim(),
      title: match[2].replace(/[\*\#\-\_]/g, "").trim(),
      content: match[3].trim()
    });
  }
  if (chapters.length === 0) {
    chapters.push({ number: "1", title: "A Magical Journey", content: cleanStory });
  }

  let imgIndex = 1;

  for (const chap of chapters) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    fillBg(page);
    y = SAFE_TOP;
    pageCount++;

    // PAGE NUMBER
    if (pageCount > 1) {
      page.drawText(`${pageCount}`, {
        x: PAGE_WIDTH / 2 - 15,
        y: BLEED + 22,
        size: 11,
        font: bodyFont,
        color: colors.pageNumber
      });
    }

    // CHAPTER NUMBER
    const chapNumText = `Chapter ${chap.number}`;
    const numWidth = titleFont.widthOfTextAtSize(chapNumText, 46);
    page.drawText(chapNumText, {
      x: (PAGE_WIDTH - numWidth) / 2,
      y: y - 25,
      size: 46,
      font: titleFont,
      color: colors.chapterNum
    });
    y -= 96;

    // CHAPTER TITLE
    const titleLines = wrapText(chap.title, titleFont, 38, SAFE_WIDTH);
    for (const line of titleLines) {
      const w = titleFont.widthOfTextAtSize(line, 38);
      page.drawText(line, {
        x: (PAGE_WIDTH - w) / 2,
        y,
        size: 38,
        font: titleFont,
        color: colors.chapterTitle
      });
      y -= 58;
    }
    y -= 70;

    // PARAGRAPHS - BREATHABLE + CLEAN
    const paragraphs = chap.content.split("\n\n").map(p => p.trim()).filter(Boolean);
    for (const para of paragraphs) {
      const cleanPara = para.replace(/[\*\#\-\_]/g, "").trim();
      if (!cleanPara) continue;

      const lines = wrapText(cleanPara, bodyFont, FONT_SIZE, SAFE_WIDTH);

      for (const line of lines) {
        if (y - LINE_HEIGHT < BLEED + MARGIN + 70) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          fillBg(page);
          pageCount++;
          page.drawText(`${pageCount}`, {
            x: PAGE_WIDTH / 2 - 15,
            y: BLEED + 22,
            size: 11,
            font: bodyFont,
            color: colors.pageNumber
          });
          y = SAFE_TOP;
        }

        page.drawText(line, {
          x: SAFE_LEFT,
          y: y,
          size: FONT_SIZE,
          font: bodyFont,
          color: colors.text
        });

        y -= LINE_HEIGHT;
      }

      y -= PARAGRAPH_SPACING;
    }

    // IMAGE AFTER CHAPTER
    if (imgIndex < imageBuffers.length) {
      try {
        const buffer = imageBuffers[imgIndex];
        const img = buffer[0] === 0x89
          ? await pdfDoc.embedPng(buffer)
          : await pdfDoc.embedJpg(buffer);

        const maxHeight = 330;
        const scale = Math.min(SAFE_WIDTH / img.width, maxHeight / img.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        if (y < imgHeight + 130) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          fillBg(page);
          pageCount++;
          page.drawText(`${pageCount}`, {
            x: PAGE_WIDTH / 2 - 15,
            y: BLEED + 22,
            size: 11,
            font: bodyFont,
            color: colors.pageNumber
          });
          y = SAFE_TOP;
        }

        page.drawImage(img, {
          x: SAFE_LEFT + (SAFE_WIDTH - imgWidth) / 2,
          y: y - imgHeight,
          width: imgWidth,
          height: imgHeight
        });

        y -= imgHeight + IMAGE_GAP;
        imgIndex++;
      } catch (err) {
        imgIndex++;
      }
    }
  }

  // THE END PAGE
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  fillBg(page);
  pageCount++;
  page.drawText(`${pageCount}`, {
    x: PAGE_WIDTH / 2 - 15,
    y: BLEED + 22,
    size: 11,
    font: bodyFont,
    color: colors.pageNumber
  });

  page.drawText("The End", {
    x: SAFE_LEFT,
    y: PAGE_HEIGHT / 2 + 80,
    size: 78,
    font: titleFont,
    color: colors.chapterNum
  });
  page.drawText("With all my love forever", {
    x: SAFE_LEFT,
    y: PAGE_HEIGHT / 2 - 25,
    size: 30,
    font: bodyFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  return await pdfDoc.save();
}

// WRAP TEXT
function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}