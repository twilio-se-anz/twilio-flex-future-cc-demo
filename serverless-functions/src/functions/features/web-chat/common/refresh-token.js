const jwt = require('jsonwebtoken');
const Twilio = require('twilio');

const TOKEN_TTL_IN_SECONDS = 60 * 60 * 6;

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

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('Refreshing token');
  let providedIdentity;

  try {
    const validatedToken = await new Promise((res, rej) =>
      jwt.verify(event.token ?? '', context.TWILIO_API_SECRET ?? '', {}, (err, decoded) => {
        if (err) return rej(err);
        return res(decoded);
      }),
    );
    providedIdentity = validatedToken?.grants?.identity;
  } catch (error) {
    console.log('Invalid token provided:', error.message);
    response.setStatusCode(403);
    response.setBody({ error: `Invalid token provided: ${error.message}` });
    return callback(null, response);
  }

  console.log('Token is valid for', providedIdentity);

  const refreshedToken = createToken(providedIdentity, context);

  response.setStatusCode(200);
  response.setBody({
    token: refreshedToken,
    expiration: Date.now() + TOKEN_TTL_IN_SECONDS * 1000,
  });

  callback(null, response);
};
