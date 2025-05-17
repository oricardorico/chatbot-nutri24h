
const { Configuration, OpenAIApi } = require("openai");

const messagesHistory = {}; // Armazena histórico por sessão temporária

module.exports = async function handler(req, res) {
  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(config);

  const userMessage = req.body.message;
  const userId = req.headers["x-user-id"] || "default"; // Pode ser melhorado com autenticação real

  if (!messagesHistory[userId]) {
    messagesHistory[userId] = [
      {
        role: "system",
        content: "Você é uma nutricionista chamada Lillian, simpática e bem didática. Responda com foco em saúde, nutrição, emagrecimento e bem-estar feminino. Caso a pergunta seja fora do tema, gentilmente redirecione o assunto de volta."
      }
    ];
  }

  // Adiciona a nova mensagem do usuário
  messagesHistory[userId].push({ role: "user", content: userMessage });

  // Limita o histórico para os últimos 12 itens (6 trocas user/assistant)
  const maxMessages = 13; // Incluindo o system
  if (messagesHistory[userId].length > maxMessages) {
    const systemPrompt = messagesHistory[userId][0];
    messagesHistory[userId] = [systemPrompt, ...messagesHistory[userId].slice(-maxMessages + 1)];
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesHistory[userId]
    });

    const reply = completion.data.choices[0].message.content;

    // Salva a resposta no histórico
    messagesHistory[userId].push({ role: "assistant", content: reply });

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ reply: "Erro ao gerar resposta. Tente novamente em instantes." });
  }
};
