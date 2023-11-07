export const handler = function (context, event, callback) {
  let response = new Twilio.Response();

  console.log('>>> INCOMING', event);

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
        callback(null, { status: 'Failed' });
      }
      console.log(res);

      console.log(res.approval_request.uuid);
      callback(null, { status: 'authy sent' });
    },
  );
};
