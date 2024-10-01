const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  {
    key: 'CallSid',
    purpose: 'CallSid',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const twilioSyncServiceSid = context.TWILIO_FLEX_SYNC_SID;
  console.log('Incoming event to retrieve transcript', event);

  if (!event.CallSid) {
    const error = 'Missing CallSid data';
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  // eslint-disable-next-line prefer-template
  const listUniqueName = 'TRANSCRIPTION_' + event.CallSid;
  const client = context.getTwilioClient();

  console.log('Using Sync service with SID', twilioSyncServiceSid);
  console.log('List Unique ID', listUniqueName);

  try {
    // Check if list exists and update
    const syncListItems = await client.sync.v1
      .services(twilioSyncServiceSid)
      .syncLists(listUniqueName)
      .syncListItems.list({ limit: 50 });
    response.setBody(syncListItems);
    return callback(null, response);
  } catch (err) {
    console.log('Oh shoot. Something went really wrong, check logs', err);
    return handleError(err);
  }
});
