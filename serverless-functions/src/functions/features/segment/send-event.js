const fetch = require('node-fetch');

const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['userId', 'properties'];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
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

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
