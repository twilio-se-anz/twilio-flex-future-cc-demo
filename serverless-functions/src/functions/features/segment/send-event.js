const fetch = require('node-fetch');

export const handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  // Set the CORS headers to allow Flex to make an error-free HTTP request
  // to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  try {
    if (!context.SEGMENT_WRITE_KEY) {
      response.setBody({ error: 'Write key not set' });
      callback(response);
    }

    let token = Buffer.from(`${context.SEGMENT_WRITE_KEY}:`, 'utf8').toString('base64');

    console.log('Using token', token);
    console.log('Received event', event);

    /**************************************** */
    /* TRACK */
    /**************************************** */

    let segmentEvent = {
      event: event.eventName || 'Flex Event',
      userId: event.userId,
      properties: {
        actor: event.actor || 'Twilio',
        ConversationSid: event.ConversationSid,
        ExecutionSid: event.ExecutionSid,
        FlowSid: event.FlowSid,
        channelType: event.channelType,
        direction: event.direction,
        email: event.userId,
        summary: event.summary,
      },
    };

    var options = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(segmentEvent),
    };

    const url = `https://api.segment.io/v1/track`;
    const segmentResponse = await fetch(url, options);
    const responseData = await segmentResponse.json();
    response.setBody({ message: 'accepted', ...responseData });

    callback(null, response);
  } catch (error) {
    console.log(error);
    response.setBody(error);
    callback(response);
  }
};
