// const { Configuration, OpenAIApi } = require('openai');
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

  // const configuration = new Configuration({ apiKey: context.OPENAI_API_KEY });
  // const openai = new OpenAIApi(configuration);

  try {
    const prompt = [
      {
        role: 'system',
        content: `In 90 words or less, provide a summarization in ${language} of the following transcript: ${messages} without including the messages`,
      },
    ];

    const openai = new OpenAI({
      apiKey: context.OPENAI_API_KEY,
    });

    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: prompt,
    });

    console.log('OPEN AI RESULT', result);

    // const { status } = result;
    // response.setStatusCode(status);

    console.log(result.choices[0].message);

    if (result.choices[0].message.content) {
      const summary = result.choices[0].message.content?.trim();
      response.setBody({ summary, ...extractStandardResponse(result) });
      return callback(null, response);
    }
    throw new Error('Unable to fetch summary.');
  } catch (error) {
    console.log('Error', error);
    return handleError(error);
  }
});
