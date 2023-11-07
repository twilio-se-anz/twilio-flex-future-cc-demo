const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['sid'];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  let response = new Twilio.Response();

  console.log('>>> INCOMING >>>');
  console.log(event);

  try {
    // Create task
    let client = context.getTwilioClient();

    await client.conversations.v1.conversations(event.sid).update({ state: 'closed' });

    console.log(`Update conversation to closed  ${event.sid}`);
    return callback(null, { status: 'updated' });
  } catch (e) {
    console.error(`Failed to create task ` + event.sid);
    return handleError(e);
  }
});
