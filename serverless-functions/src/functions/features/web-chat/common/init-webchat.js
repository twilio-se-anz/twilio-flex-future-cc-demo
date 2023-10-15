// Imports global types
const axios = require('axios');

const TOKEN_TTL_IN_SECONDS = 60 * 60 * 6;

const contactWebchatOrchestrator = async (event, customerFriendlyName, context) => {
  const params = new URLSearchParams();
  params.append('AddressSid', context.ADDRESS_SID ?? '');
  params.append('ChatFriendlyName', 'Webchat widget');
  params.append('CustomerFriendlyName', customerFriendlyName);
  params.append(
    'PreEngagementData',
    JSON.stringify({
      ...event.formData,
      friendlyName: customerFriendlyName,
    }),
  );

  let conversationSid;
  let identity;

  try {
    const res = await axios.post(`https://flex-api.twilio.com/v2/WebChats`, params, {
      auth: {
        username: context.ACCOUNT_SID ?? '',
        password: context.AUTH_TOKEN ?? '',
      },
    });
    ({ identity, conversation_sid: conversationSid } = res.data);
  } catch (error) {
    console.log('Something went wrong during the orchestration:', error.response?.data?.message);
    throw error.response.data;
  }

  console.log('Webchat Orchestrator successfully called');

  return {
    conversationSid,
    identity,
  };
};

const createToken = (identity, context) => {
  console.log('Creating new token');
  const { AccessToken } = Twilio.jwt;
  const { ChatGrant } = AccessToken;

  const chatGrant = new ChatGrant({
    serviceSid: context.TWILIO_FLEX_CHAT_SERVICE_SID,
  });

  const token = new AccessToken(
    context.ACCOUNT_SID ?? '',
    context.TWILIO_API_KEY ?? '',
    context.TWILIO_API_SECRET ?? '',
    {
      identity,
      ttl: TOKEN_TTL_IN_SECONDS,
    },
  );
  token.addGrant(chatGrant);
  const jwt = token.toJwt();
  console.log('New token created');
  return jwt;
};

const sendUserMessage = async (conversationSid, identity, messageBody, context) => {
  console.log('Sending user message');
  const twilioClient = context.getTwilioClient();
  await twilioClient.conversations
    .conversations(conversationSid)
    .messages.create({
      body: messageBody,
      author: identity,
      xTwilioWebhookEnabled: 'true', // trigger webhook
    })
    .then(() => {
      console.log('(async) User message sent');
    })
    .catch((e) => {
      console.log(`(async) Couldn't send user message: ${e?.message}`);
    });
};

const sendWelcomeMessage = async (conversationSid, customerFriendlyName, context) => {
  console.log('Sending welcome message');
  const twilioClient = context.getTwilioClient();
  await twilioClient.conversations
    .conversations(conversationSid)
    .messages.create({
      body: `Welcome ${customerFriendlyName}! An agent will be with you in just a moment.`,
      author: 'Concierge',
    })
    .then(() => {
      console.log('(async) Welcome message sent');
    })
    .catch((e) => {
      console.log(`(async) Couldn't send welcome message: ${e?.message}`);
    });
};

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const customerFriendlyName = event.formData?.friendlyName || 'Customer';

  let conversationSid;
  let identity;

  // Hit Webchat Orchestration endpoint to generate conversation and get customer participant sid
  try {
    const result = await contactWebchatOrchestrator(event, customerFriendlyName, context);
    ({ identity, conversationSid } = result);
  } catch (error) {
    response.setStatusCode(500);
    response.setBody(`Couldn't initiate WebChat: ${error?.message}`);
    return callback(null, response);
  }

  // Generate token for customer
  const token = createToken(identity, context);

  // OPTIONAL — if user query is defined
  if (event.formData?.query) {
    // use it to send a message in behalf of the user with the query as body
    await sendUserMessage(conversationSid, identity, event.formData.query, context);
    // and then send another message from Concierge, letting the user know that an agent will help them soon
    // await sendWelcomeMessage(conversationSid, customerFriendlyName, context);
  }

  response.setStatusCode(200);
  response.setBody({
    token,
    conversationSid,
    expiration: Date.now() + TOKEN_TTL_IN_SECONDS * 1000,
  });

  console.log('Webchat successfully initiated');

  callback(null, response);
};
