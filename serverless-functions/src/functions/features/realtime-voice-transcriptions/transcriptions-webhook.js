const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);
exports.handler = async function handler(context, event, callback) {
  try {
    const response = new Twilio.Response();

    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    // console.log(event)

    switch (event.TranscriptionEvent) {
      case 'transcription-started':
        console.log('transcriptionEvent: transcription-started: ', event.CallSid);

        // Create Sync Stream
        const syncStreamResult = await SyncOperations.createStream({
          context,
          name: `TRANSCRIPTION_${event.CallSid}`,
          syncServiceSid: context.SYNC_SERVICE_SID,
        });
        console.log('Sync Stream create: ', syncStreamResult);

        // Create Sync map Item for call sid with
        const SyncMapResult = await SyncOperations.createMapItem({
          context,
          mapSid: context.MAP_CALL_LOG,
          key: event.CallSid,
          ttl: parseInt(context.TWILIO_TRANSCRIPTION_SYNC_TTL, 10),
          syncServiceSid: context.SYNC_SERVICE_SID,
          data: { syncStream: syncStreamResult.stream.sid },
        });
        console.log('Sync Map Item create: ', SyncMapResult);
        break;
      case 'transcription-content':
        if (event.Track === 'inbound_track') {
          const transcript = JSON.parse(event.TranscriptionData).transcript;
          console.log('transcription: user: ', transcript);
          const syncStreamInboundData = {
            actor: 'inbound',
            type: 'transcript',
            transcriptionText: transcript,
          };
          const streamMessageInboundResult = await SyncOperations.createStreamMessage({
            context,
            name: `TRANSCRIPTION_${event.CallSid}`,
            data: syncStreamInboundData,
            syncServiceSid: context.SYNC_SERVICE_SID,
          });
          console.log(streamMessageInboundResult);
        } else if (event.Track === 'outbound_track') {
          console.log('transcription: agent: ', event.TranscriptionData);
          const transcript = JSON.parse(event.TranscriptionData).transcript;
          const syncStreamOutboundData = {
            actor: 'outbound',
            type: 'transcript',
            transcriptionText: transcript,
          };
          const streamMessageOutboundResult = await SyncOperations.createStreamMessage({
            context,
            name: `TRANSCRIPTION_${event.CallSid}`,
            data: syncStreamOutboundData,
            syncServiceSid: context.SYNC_SERVICE_SID,
          });
          console.log(streamMessageOutboundResult);
        }
        break;
      case 'transcription-stopped':
        console.log('transcriptionEvent: transcription-stopped', event.CallSid);

        // Update map and remove item for call sid
        const SyncMapItemDeleteResult = await SyncOperations.deleteMapItem({
          context,
          mapSid: context.MAP_CALL_LOG,
          key: event.CallSid,
          syncServiceSid: context.SYNC_SERVICE_SID,
        });
        console.log('Sync Map Item deleted: ', SyncMapItemDeleteResult);

        const SyncStreamDeleteResult = await SyncOperations.deleteStream({
          context,
          mapSid: context.MAP_CALL_LOG,
          name: `TRANSCRIPTION_${event.CallSid}`,
          syncServiceSid: context.SYNC_SERVICE_SID,
        });
        console.log('Sync Stream deleted: ', SyncStreamDeleteResult);
        break;
      default:
        console.log(`Unknown event type received [${event.TranscriptionEvent}]`);
        break;
    }

    response.setStatusCode(200);
    callback(null, response);
  } catch (err) {
    console.error('Error', err);
    callback(err, null);
  }
};
