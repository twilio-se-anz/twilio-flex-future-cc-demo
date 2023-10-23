const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { userId, email, summary, sentiment, language } = event;
  try {
    const data = {
      userId,
      event: 'GPT Summary',
      properties: {
        email,
        summary,
        sentiment,
        language,
      },
      type: 'track',
    };

    const config = {
      auth: {
        username: process.env.SEGMENT_WRITE_KEY,
        password: '',
      },
    };

    const result = await axios.post('https://api.segment.io/v1/track', data, config);
    response.setBody({ success: true, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
