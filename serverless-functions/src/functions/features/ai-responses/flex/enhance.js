const { OpenAI } = require('openai');
const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['open_ai_request'];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const openai = new OpenAI({
      apiKey: context.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: context.OPENAI_MODEL,
      messages: event.open_ai_request,
    });

    response.setStatusCode(200);
    response.setBody({ result: completion });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
