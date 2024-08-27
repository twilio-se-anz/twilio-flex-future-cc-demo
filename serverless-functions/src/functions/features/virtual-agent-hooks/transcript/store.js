exports.handler = (context, event, callback) => {
  const response = new Twilio.Response();
  const twilioSyncServiceSid = context.TRANSCRIPT_SYNC_SERVICE_SID;
  console.log("Incoming event to store document", event);

  if (!event.CallSid || !event.VirtualAgentProviderData) {
    const error = "Missing CallSid or VirtualAgentProviderData data";
    response.setBody({ message: error });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const listUniqueName = "Transcript-" + event.CallSid;
  const client = context.getTwilioClient();

  console.log("Using Sync service with SID", twilioSyncServiceSid);
  console.log("List Unique ID", listUniqueName);
  let listSid = undefined;

  // Get the transcript data
  const transcriptData = JSON.parse(event.VirtualAgentProviderData);

  try {
    // Check if list exists and update
    client.sync.v1
      .services(twilioSyncServiceSid)
      .syncLists(listUniqueName)
      .fetch()
      .then((list) => {
        console.log("List exists, SID", list.sid);
        listSid = list.sid;
        needToCreate = false;
      })
      .catch(async (error) => {
        // Need to create document
        if (error.code && error.code == 20404) {
          console.log("List doesn't exist, creating");
          await client.sync.v1
            .services(twilioSyncServiceSid)
            .syncLists.create({ uniqueName: listUniqueName })
            .then((list) => {
              console.log("Created sync list with SID", list.sid);
              listSid = list.sid;
            })
            .catch((error) => {
              console.error(
                "Oh shoot. Something went really wrong creating the list:",
                error.message
              );
              callback(error.message);
            });
        } else {
          console.error("Oh shoot. Error fetching list");
          console.error(error);
          callback(error.message);
        }
      })
      .then(() => {
        // We have a listSid at this point - Add items to list
        client.sync.v1
          .services(twilioSyncServiceSid)
          .syncLists(listSid)
          .syncListItems.create({ data: transcriptData })
          .then((item) => {
            console.log(
              `Items inserted to list ${item.listSid} at index ${item.index}`
            );
            callback(null, {
              status: `Items inserted to list ${item.listSid} at index ${item.index}`,
            });
          })
          .catch((error) => {
            console.error("Error insert items to list", error.message);
          });
      });
  } catch (err) {
    console.log("Oh shoot. Something went really wrong, check logs", err);
    callback(err);
  }
};
