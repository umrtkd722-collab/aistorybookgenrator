import client from "./openai";

export async function generateStory(prompt: string, maxTokens = 500) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",  // ya "gpt-4", "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a story writer." },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
    });

    const storyText = response.choices?.[0]?.message?.content ?? "";
    return storyText;
  } catch (err) {
    console.error("GPT story generation failed:", err);
    throw err;
  }
}
