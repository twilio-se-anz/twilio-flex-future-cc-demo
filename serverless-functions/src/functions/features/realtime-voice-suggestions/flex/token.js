const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['identity'];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    // Create a "grant" identifying the Sync service instance for this app.
    syncGrant = new SyncGrant({
      serviceSid: context.RVS_SYNC_SERVICE_ID,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created and specifying his identity.
    const token = new AccessToken(context.ACCOUNT_SID, context.TWILIO_API_KEY, context.TWILIO_API_SECRET);

    token.addGrant(syncGrant);
    token.identity = identity;

    response.setStatusCode(200);
    response.setBody({ token: token.toJwt() });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
