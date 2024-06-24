import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Return an array of strings of all the artists in this music festival poster." },
            {
              type: "image_url",
              image_url: {
                url: "https://preview.redd.it/fs6nvrn9f9wc1.jpeg?width=614&auto=webp&s=62551a33447a3a7ca523b8c4867e277a75ff90b7",
              },
            },
          ],
        },
      ],
    });

    return NextResponse.json(completion.choices[0]);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
