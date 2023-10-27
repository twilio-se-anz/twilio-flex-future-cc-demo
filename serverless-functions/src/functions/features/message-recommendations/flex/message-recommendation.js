const { OpenAI } = require('openai');

const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  {
    key: 'messages',
    purpose: 'Chat history',
  },
  {
    key: 'language',
    purpose: 'Language in which the summary will be generated',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { messages: stringMessages, language } = event;
  const messages = JSON.parse(stringMessages);

  if (!language || !messages) {
    throw new Error('Missing LANGUAGE or MESSAGES parameters.');
  }

  const openai = new OpenAI({
    apiKey: context.OPENAI_API_KEY,
  });

  try {
    const formatMessage = (body, author) => ({
      role: author.includes('customer') ? 'user' : 'assistant',
      content: body,
    });

    const prompt = [
      {
        role: 'system',
        content: `You are a Customer Service Representative, and are currently connected to a customer live. As you can see from the transcript, the customer was transferred from a conversation with a Virtual Assistant to one with a human assistant. You need to pick up where the transcript leaves off, and suggests the best response. You should be extremely cognizant of the information that has already shared with either the Virtual Assistant or yourself, and absolutely do not ask the customer for information that is already available in the transcript. If the customer asked to talk to an agent, understand that you are the agent that he would like to speak and continue the conversation with further assistance. Do not duplicate existing messages. If the last message was sent by you, the next one should be a improvement of that one. With all that in mind, respond in ${language} with the next best message, and do so in the first person without prefixing your response, do not use more than 20 words and 40 tokens.`,
      },
    ];

    messages.forEach(({ body, author }) => prompt.push(formatMessage(body, author)));

    const result = await openai.chat.completions.create({
      model: context.OPENAI_MODEL,
      messages: prompt,
      max_tokens: 40,
      temperature: 0.3,
    });

    if (result.choices[0].message.content) {
      const messageRecommendation = result.choices[0].message.content?.trim();
      response.setBody({ messageRecommendation, ...extractStandardResponse(result) });
      return callback(null, response);
    }

    throw new Error('Unable to fetch message recommendation.');
  } catch (error) {
    console.log(error.message);
    return handleError(error);
  }
});
