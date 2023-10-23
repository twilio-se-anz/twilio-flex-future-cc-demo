const { prepareFlexFunction } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

var jwt = require('jsonwebtoken');

const requiredParameters = [];

exports.handler = prepareFlexFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    console.log('context: ', context);
    try {
      let agentassistURL = context.KORE_AGENT_ASSIST_URL;
      let smartassistURL = agentassistURL.replace('agentassist', 'smartassist');

      const data = {
        iss: context.KORE_CLIENT_ID,
        sub: event.identity,
        aud: context.KORE_AUD,
        botId: context.KORE_BOT_ID,
        isAnonymous: context.KORE_IS_ANONYMOUS,
      };

      const token = jwt.sign(
        data,
        context.KORE_CLIENT_SECRET,
        { algorithm: 'HS256' },
        { expiresIn: '1d' }
      );

      let autoBotId = context.KORE_AUTO_BOT_ID;
      let agentGroup = context.KORE_AGENT_GROUP;

      response.setBody({
        token: token,
        agentassistURL: agentassistURL,
        smartassistURL: smartassistURL,
        botId: context.KORE_BOT_ID,
        autoBotId: autoBotId ? autoBotId : 'null',
        agentGroup: agentGroup ? agentGroup : 'null',
      });

      return callback(null, response);
    } catch (error) {
      return handleError(error);
    }
  }
);
