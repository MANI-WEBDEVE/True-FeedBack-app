import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey = process.env.AI_API_KEY;

export async function POST() {
  try {
    console.log(apikey);

    const genAI = new GoogleGenerativeAI(apikey as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return Response.json({ result: result.response.text() });
  } catch (error: any) {
    console.log(error.message);
    return Response.json({ error: error.message });
    //
  }
}
