const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  let authy = require('authy')(context.AUTHY_API_KEY);

  var payload = {
    message: 'Authenticate with Twilio',
    details: {
      Username: 'Christopher Connolly',
      Location: 'Sydney, Australia',
      'Account Number': '981266321',
    },
  };

  let hidden_details = {
    transaction_num: 'TR139872562346',
  };

  authy.send_approval_request(
    event?.sessionInfo?.parameters.authy_id || context.DEFAULT_AUTHY_ID,
    payload,
    hidden_details,
    undefined,
    function (_err, res) {
      if (_err) {
        console.log(_err);
        return callback(null, { status: 'Failed' });
      }
      console.log(res);

      console.log(res.approval_request.uuid);
      return callback(null, { status: 'authy sent' });
    },
  );
});
