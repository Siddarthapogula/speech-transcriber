import Groq from "groq-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const groq = new Groq({
  apiKey: process.env.groq_key,
});

export async function getGroqChatCompletion({userLang, speech, lang} : any) {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
  Hey, I'm building a language helper where I input a language speech is in ${userLang}, and it gets transcribed into ${lang} language.
  
  Here is the speech: "${speech}" 
  
  Your task:
  - Analyze the above speech.
  - Transcribe it to the ${lang} language.
  
  Return the output strictly in this JSON format:
  
  {
    "transcribe": "your transcribed ${lang} text here"
  }
  
  Do not include any explanation or additional text — only return the JSON object.`,
      },
    ],
  });
}

function extractContent(jsonString: any) {
  try {
    const cleaned = jsonString.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    return [];
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { speech, lang, userLang} = req.body;
  const context = { speech, lang, userLang};
  const response = await getGroqChatCompletion(context);
  return res.json(extractContent(response.choices[0].message.content).transcribe);
}
