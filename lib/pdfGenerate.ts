import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { uploadFile } from "./gridf";

// Generate PDF from story text and upload to GridFS
export async function generateStoryPDF(title: string, storyText: string) {
  // Temp file path
  const tempFilePath = path.join(process.cwd(), `temp_${Date.now()}.pdf`);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const writeStream = fs.createWriteStream(tempFilePath);
      doc.pipe(writeStream);

      // Title
      doc.fontSize(20).text(title, { align: "center" });
      doc.moveDown();

      // Story text
      doc.fontSize(12).text(storyText, { align: "left" });

      doc.end();

      writeStream.on("finish", async () => {
        try {
          const fileId = await uploadFile(tempFilePath, `${title}_${Date.now()}.pdf`);
          fs.unlinkSync(tempFilePath); // delete temp file
          resolve(fileId); // return GridFS ObjectId
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
