const { prepareFlexFunction } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'message', purpose: 'The message text to be sent' },
  { key: 'requiredParamTwoName', purpose: 'parameter description' },
];

exports.handler = prepareFlexFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    try {
      // perform action: the following is an example of using a twilio-wrapper function
      // and extracting the standard response along with the desired phone numbers
      // object

      /* 
    const result = await PhoneNumbers.listPhoneNumbers({
      context,
    });

    const { phoneNumbers } = result;
    response.setStatusCode(result.status);
    response.setBody({ phoneNumbers, ...extractStandardResponse(result) });
    */

      return callback(null, response);
    } catch (error) {
      return handleError(error);
    }
  }
);
