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
  const { messages, language } = event;

  if (!language || !messages) {
    throw new Error('Missing LANGUAGE or MESSAGES parameters.');
  }

  const openai = new OpenAI({
    apiKey: context.OPENAI_API_KEY,
  });

  try {
    const prompt = [
      {
        role: 'system',
        content: `As a user sentiment analyst, your role is to infer the customer sentiment expressed in this conversation: ${messages}, which can be categorized as positive, neutral, or negative.

        Your task is to provide a response in the form of a JSON object with the following structure:
        {
          "sentiment": "positive",
          "translated_sentiment": "Sentiment: Positive"
        }

        The "sentiment" key will store the sentiment value in English (en-US), while the "translated_sentiment" key will store the value translated into ${language}

        Examples:

        Message: Eu não gostei do meu produto
        Other: Lamento ouvir isso, como podemos te auxiliar?
        Response: {
          "sentiment": "negative",
          "translated_sentiment": "Sentimento: Negativo"
        }

        Message: Me encantó mi producto
        Other: ¡Alegro que te haya gustado!
        Response: {
          "sentiment": "positive",
          "translated_sentiment": "Sentimiento: Positivo"
        }

        Message: ฉันต้องการข้อมูล
        Other: ฉันจะช่วยคุณได้อย่างไร?
        Response: {
          "sentiment": "neutral",
          "translated_sentiment": "ความรู้สึก: เป็นกลาง"
        }
        `,
      },
    ];

    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: prompt,
    });

    if (result.choices[0].message.content) {
      const analysis = JSON.parse(result.choices[0].message.content);
      response.setBody({ analysis, ...extractStandardResponse(result) });
      return callback(null, response);
    }

    throw new Error('Unable to fetch sentiment analysis.');
  } catch (error) {
    return handleError(error);
  }
});
