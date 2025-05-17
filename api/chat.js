import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(config);

  const userMessage = req.body.message;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Você é uma nutricionista chamada Lillian, simpática e bem didática. Responda sempre com foco em saúde, emagrecimento e bem-estar da mulher." },
      { role: "user", content: userMessage },
    ],
  });

  res.status(200).json({ reply: completion.data.choices[0].message.content });
}
