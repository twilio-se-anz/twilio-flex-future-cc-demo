const { OAuth2Client } = require('google-auth-library');
const authClient = new OAuth2Client();

exports.handler = async (context, event, callback) => {
  try {
    console.log('google-agent-assist >> incoming >>', event);

    const response = new Twilio.Response();

    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    // Verify and decode the JWT.

    const bearer = event.request.headers.authorization;
    const [, token] = bearer.match(/Bearer (.*)/);

    const ticket = await authClient.verifyIdToken({
      idToken: token,
      audience: 'twilio.com',
    });

    const claim = ticket.getPayload();
    if (claim.aud !== context.CCAI_JWT_AUDIENCE) {
      console.log(`Error, audience does not match ticket claim`, ticket);
      response.setStatusCode(400);
      return callback(null, response);
    }

    if (event.message?.data) {
      // console.log(`Message data, raw`, event.message.data);
      const decodedData = Buffer.from(event.message.data, 'base64').toString('utf-8');
      const jsonData = JSON.parse(decodedData);
      console.log('Decoded message:', jsonData);

      // if(jsonData.type) {
      //   switch(jsonData.type) {
      //     case "NEW_MESSAGE": parseNewMessage(jsonData); break;
      //     case "NEW_MESSAGE": parseNewMessage(jsonData); break;
      //   }
      // }

      if (jsonData.suggestionResults && jsonData.suggestionResults.length > 0) {
        console.log('Suggestions:', jsonData.suggestionResults);
      }
    }

    // Publish message to Sync
    // const streamId = 'TOcaf00af62db5472b64e452279496ba6e';
    // console.log(`Using Sync Service ${context.CCAI_TRANSCRIPT_SYNC_SERVICE_SID} with stream ID ${streamId}`);
    // const client = context.getTwilioClient();
    // client.sync.v1
    //   .services(context.CCAI_TRANSCRIPT_SYNC_SERVICE_SID)
    //   .syncStreams(streamId)
    //   .streamMessages.create({ data: { status: 'testing' } })
    //   .then((stream_message) => console.log('Sync Stream message created:', stream_message));

    response.setStatusCode(200);
    response.setBody({ status: 'tested ok', ticket });

    return callback(null, response);
  } catch (error) {
    console.log('An error occurred processing message', error);
  }
};
