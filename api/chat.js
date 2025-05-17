const { Configuration, OpenAIApi } = require("openai");

module.exports = async function handler(req, res) {
  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(config);

  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é uma nutricionista chamada Lillian, simpática e bem didática. Responda sempre com foco em saúde, emagrecimento e bem-estar da mulher." },
        { role: "user", content: userMessage }
      ]
    });

    res.status(200).json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ reply: "Erro ao gerar resposta. Tente novamente em instantes." });
  }
}
