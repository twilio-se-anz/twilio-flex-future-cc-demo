
const { OpenAI } = require('openai');
const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);
exports.handler = async function (context, event, callback) {
    const openai = new OpenAI({
        apiKey: context.OPENAI_API_KEY,
    });
    const response = new Twilio.Response();

    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    // console.log(event)

    const formatMessage = (message, direction) => ({
        role: direction.includes('inbound_track') ? 'user' : 'assistant',
        content: message,
    });
    switch (event.TranscriptionEvent) {
        case 'transcription-started':
            console.log('transcriptionEvent: transcription-started: ', event.CallSid);

            //Create Sync Stream
            const syncStreamResult = await SyncOperations.createStream({ context, name: `TRANSCRIPTION_${event.CallSid}` });
            console.log('Sync Stream create: ', syncStreamResult);

            // Create Sync map Item for call sid with TTL
            const SyncMapResult = await SyncOperations.createMapItem({
                context,
                mapSid: context.MAP_CALL_LOG,
                key: event.CallSid,
                ttl: 84000,
                data: { syncStream: syncStreamResult.stream.sid }
            })
            console.log('Sync Map Item create: ', SyncMapResult)
            break;
        case 'transcription-content':
            if (event.Track == 'inbound_track') {
                const transcript = JSON.parse(event.TranscriptionData).transcript;
                console.log('transcription: user: ', transcript);
                const syncStreamInboundData = {
                    actor: 'Inbound',
                    type: 'transcript',
                    taranscriptionText: transcript,
                }
                const streamMessageInboundResult = await SyncOperations.createStreamMessage({ context, name: `TRANSCRIPTION_${event.CallSid}`, data: syncStreamInboundData });
                console.log(streamMessageInboundResult);

                const prompt = [];
                prompt.push(formatMessage(transcript, event.Track));

                prompt.push({
                    role: 'system',
                    content: `Always respond with a json array containing one or more objects with keys "suggestion" and "title", always complete both fields. You are a customer service agent assistant. Here is the call transcript so far, make a recommendation to the agent with the next best action or suggestion. Use the customers language where possible.`,
                });
                const result = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: prompt,
                });

                if (result.choices[0].message.content) {
                    const suggestionsJson = result.choices[0].message.content?.trim();
                    let suggestions = [];
                    let success = false;
                    try {
                        suggestions = JSON.parse(suggestionsJson);
                        success = true;
                        const syncStreamAIData = {
                            actor: 'AI',
                            type: 'suggestion',
                            suggestionsFromAI: suggestions,
                        }
                        const streamMessageAIResult = await SyncOperations.createStreamMessage({ context, name: `TRANSCRIPTION_${event.CallSid}`, data: syncStreamAIData });
                        console.log(streamMessageAIResult);
                    } catch (err) {
                        success = false;
                        console.log('Error parsing results from AI', err);
                    }
                    console.log(suggestions)
                    response.setBody({ success, ...suggestions, blah: true });
                }
            } else if (event.Track == 'outbound_track') {
                console.log('transcription: agent: ', event.TranscriptionData);
                const transcript = JSON.parse(event.TranscriptionData).transcript;
                const syncStreamOutboundData = {
                    actor: 'Outbound',
                    type: 'transcript',
                    taranscriptionText: transcript,
                }
                const streamMessageOutboundResult = await SyncOperations.createStreamMessage({ context, name: `TRANSCRIPTION_${event.CallSid}`, data: syncStreamOutboundData });
                console.log(streamMessageOutboundResult);
            }
            break;
        case 'transcription-stopped':

            console.log('transcriptionEvent: transcription-stopped', event.CallSid);

            //update map and remove item for call sid
            const SyncMapItemDeleteResult = await SyncOperations.deleteMapItem({
                context,
                mapSid: context.MAP_CALL_LOG,
                key: event.CallSid
            })
            console.log('Sync Map Item deleted: ', SyncMapItemDeleteResult)

            const SyncStreamDeleteResult = await SyncOperations.deleteStream({
                context,
                mapSid: context.MAP_CALL_LOG,
                name: `TRANSCRIPTION_${event.CallSid}`
            })
            console.log('Sync Stream deleted: ', SyncStreamDeleteResult)
            break;
    }

    response.setStatusCode(200);
    callback(null, response);
};