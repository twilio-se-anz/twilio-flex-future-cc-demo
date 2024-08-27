const fetch = require('node-fetch');

const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['userId', 'properties'];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (!context.SEGMENT_WRITE_KEY) {
      response.setBody({ error: 'Write key not set' });
      return callback(null, response);
    }

    let token = Buffer.from(`${context.SEGMENT_WRITE_KEY}:`, 'utf8').toString('base64');

    console.log('Using token', token);
    console.log('Received event', event);

    /**************************************** */
    /* IDENTIFY */
    /**************************************** */

    let identifyEvent = {
      type: 'identify',
      userId: event.userId,
      traits: {
        email: event.userId,
      },
    };

    if (event.name) identifyEvent.traits.name = event.name;
    if (event.phone) identifyEvent.traits.phone = event.phone;

    var identifyRequestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(identifyEvent),
    };

    const identifyUrl = `https://api.segment.io/v1/identify`;
    const identifyResponse = await fetch(identifyUrl, identifyRequestOptions);
    const identifyResponseData = await identifyResponse.json();

    console.log('Segment Identify response', identifyResponseData);

    response.setBody({ message: 'accepted', ...identifyResponseData });

    return callback(null, response);
  } catch (error) {
    console.log('Error sending identify');
    return handleError(error);
  }
});
