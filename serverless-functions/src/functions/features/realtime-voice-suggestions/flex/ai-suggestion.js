const { OpenAI } = require('openai');
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  {
    key: 'transcript',
    purpose: 'Voice transcript history',
  },
  {
    key: 'language',
    purpose: 'Language in which the summary will be generated',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { messages: stringMessages, language } = event;
  const transcript = JSON.parse(event.transcript);
  // const transcript = event.transcript;
  const openai = new OpenAI({
    apiKey: context.OPENAI_API_KEY,
  });

  if (!language || !transcript) {
    throw new Error('Missing LANGUAGE or TRANSCRIPT parameters.');
  }

  try {
    const formatMessage = (message, direction) => ({
      role: direction.includes('inbound') ? 'user' : 'assistant',
      content: message,
    });

    const prompt = [];
    transcript.forEach(({ message }) => prompt.push(formatMessage(message, 'user')));

    prompt.push({
      role: 'system',
      content: `Always respond with a json array containing one or more objects with keys "suggestion" and "title". You are a customer service agent assistant. Here is the call transcript so far, make a recommendation to the agent with the next best action or suggestion.`,
    });

    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: prompt,
    });

    console.log('AI response', result.choices[0]);

    if (result.choices[0].message.content) {
      const suggestionsJson = result.choices[0].message.content?.trim();
      let suggestions = [];
      let success = false;
      try {
        suggestions = JSON.parse(suggestionsJson);
        success = true;
      } catch (err) {
        success = false;
        console.log('Error parsing results from AI', err);
      }

      response.setBody({ success, ...suggestions, blah: true });
      return callback(null, response);
    }

    throw new Error('Unable to fetch message recommendation.');
  } catch (error) {
    console.log(error.message);
    return handleError(error);
  }
});
