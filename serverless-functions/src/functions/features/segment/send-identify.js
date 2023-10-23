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

    callback(null, response);
  } catch (error) {
    console.log(error);
    response.setBody(error);
    callback(response);
  }
};
