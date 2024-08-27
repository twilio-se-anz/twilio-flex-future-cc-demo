const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const requiredParameters = ['CallSid'];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const twilioSyncServiceSid = context.TRANSCRIPT_SYNC_SERVICE_SID;
  console.log('Incoming event to retrieve document', event);

  const listUniqueName = 'Transcript-' + event.CallSid;
  const client = context.getTwilioClient();

  console.log('Using Sync service with SID', twilioSyncServiceSid);
  console.log('List Unique ID', listUniqueName);

  try {
    // Check if list exists and update
    client.sync.v1
      .services(twilioSyncServiceSid)
      .syncLists(listUniqueName)
      .syncListItems.list({ limit: 50 })
      .then((syncListItems) => {
        response.setBody(syncListItems);
        callback(null, response);
      })
      .catch(async (error) => {
        console.log('Error getting list items');
        callback(error.message);
      });
  } catch (err) {
    console.log('Oh shoot. Something went really wrong, check logs', err);
    return handleError(err);
  }
});
