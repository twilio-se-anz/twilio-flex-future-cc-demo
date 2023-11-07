const fetch = require('node-fetch');

const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['userId'];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    let token = Buffer.from(`${context.SEGMENT_API_ACCESS_TOKEN}:`, 'utf8').toString('base64');
    const email = encodeURIComponent(event.userId || '').toLowerCase();
    const url = `${context.SEGMENT_PROFILES_API_BASE_URL}/spaces/${context.SEGMENT_SPACE_ID}/collections/users/profiles/email:${email}/events?limit=100`;
    console.log(`Fetching segment Event Data from: ${url}`);

    var options = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${token}`,
      },
    };

    const result = await fetch(url, options);
    const segmentPayload = await result.json();

    // Guard clause
    if (!segmentPayload || !segmentPayload.data || segmentPayload.data.length <= 0) {
      response.setBody([]);
      callback(null, response);
      return;
    }

    const responseData = [];

    segmentPayload.data.map((e) => {
      // console.log(JSON.stringify(e, null, 2));
      responseData.push({
        timestamp: e.timestamp,
        event: e.event,
        title: e?.properties?.title || e.event || 'No title',
        url: e?.context?.page?.url,
        userAgent: e.context.userAgent,
      });
    });

    response.setBody(responseData);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
