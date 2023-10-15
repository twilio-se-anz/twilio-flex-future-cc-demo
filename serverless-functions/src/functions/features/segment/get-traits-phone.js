const fetch = require('node-fetch');

const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['userId'];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    let token = Buffer.from(`${context.SEGMENT_API_ACCESS_TOKEN}:`, 'utf8').toString('base64');
    const phone = encodeURIComponent(event.From || '').toLowerCase();
    const url = `${context.SEGMENT_PROFILES_API_BASE_URL}/spaces/${context.SEGMENT_SPACE_ID}/collections/users/profiles/phone:${phone}/traits?limit=200`;
    console.log(`Fetching segment Event Data from: ${url}`);

    var options = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${token}`,
      },
    };

    const result = await fetch(url, options);
    const segmentPayload = await result.json();

    // console.log(JSON.stringify(segmentPayload, null, 2));

    // Guard clause
    if (!segmentPayload || !segmentPayload.hasOwnProperty('traits')) {
      response.setBody([]);
      callback(null, response);
      return;
    }

    response.setBody(segmentPayload.traits);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
