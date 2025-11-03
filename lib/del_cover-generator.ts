import client from "./openai";
import fs from "fs";
import path from "path";

export async function generateCover(prompt: string) {
  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = response.data?.[0]?.b64_json;
    const buffer = Buffer.from(imageBase64!, "base64");

    const tempFilePath = path.join(process.cwd(), `cover_${Date.now()}.png`);
    fs.writeFileSync(tempFilePath, buffer);

    return tempFilePath; // ye file ko GridFS me upload kar sakte ho
  } catch (err) {
    console.error("DALL·E cover generation failed:", err);
    throw err;
  }
}
