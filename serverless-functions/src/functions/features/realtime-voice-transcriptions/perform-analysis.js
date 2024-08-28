const { OpenAI } = require("openai");

/**
 * Expected params
 * - callSid
 * - transcript
 */
const SyncOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/sync"
].path);
exports.handler = async function handler(context, event, callback) {
  try {
    const actionInstructions = `You are a customer service assistant to the contact center agent. 
The agent can perform any of the following functions, or you can make suggestions. 
You task is to recommend which task is most appropriate based on the customer transcript. 
You must mark the task as complete if you can see it in the transcript. 

POSSIBLE ACTIONS:
- Inform the customer of our refund policy, url: https://help.twilio.com/articles/360010066814
- Check if the  refund is within policy, url: https://help.twilio.com/articles/360010066814
- View recent customer transactions, url: https://www.twilio.com/en-us/customer-data-platform
- Check stock of replacement product(s), url: https://www.twilio.com/en-us/customer-data-platform
- Escalate the customer request to manager, url: https://www.twilio.com/en-us/flex
- Discuss alternate solutions to customer, url: https://www.twilio.com/en-us/flex
- Raise a defect with the product team, url: https://www.twilio.com/en-us/flex

You MUST respond back with a JSON object based on this template {"type": "action", "title": "", "description":"", "url:"", "complete": false} or {} if no action is found
Do NOT use markdown syntax
`;

    const suggestionInstructions = `You are a customer service assistant to the contact center agent. You task is to recommend which task is most appropriate based on the customer transcript. 
You MUST respond back with a JSON object based on this template {"type": "suggestion", "title":"", "suggestion":""}
Do NOT use markdown syntax
`;

    const openai = new OpenAI({
      apiKey: context.OPENAI_API_KEY,
    });

    const formatMessage = (message, direction) => ({
      role: direction.includes("AI") ? "assistant" : "user",
      content: message,
    });

    const performInstructions = async (
      instructionType,
      instructions,
      incomingTranscript
    ) => {
      const prompt = [];
      incomingTranscript.map((transcript) => {
        if (transcript.actor === "AI") return;
        prompt.push(
          formatMessage(transcript.transcriptionText, transcript.actor)
        );
      });

      prompt.push({
        role: "system",
        content: instructions,
      });

      console.log(`[${instructionType}] Using prompt`, prompt);
      const result = await openai.chat.completions.create({
        model: context.OPENAI_MODEL,
        messages: prompt,
      });

      console.log("OpenAI Completion", result);

      if (result.choices[0].message.content) {
        const suggestionJson = result.choices[0].message.content?.trim();
        console.log(`JSON [${instructionType}] RESP >> `, suggestionJson);
        let suggestion = {};
        let success = false;
        try {
          suggestion = JSON.parse(suggestionJson);
          success = true;
          const syncStreamAIData = {
            actor: "AI",
            type: instructionType,
            ai: suggestion,
          };
          const streamMessageAIResult =
            await SyncOperations.createStreamMessage({
              context,
              name: `TRANSCRIPTION_${event.CallSid}`,
              data: syncStreamAIData,
              syncServiceSid: context.SYNC_SERVICE_SID,
            });
          console.log(streamMessageAIResult);
        } catch (err) {
          success = false;
          console.log("Error parsing results from AI", err);
        }
        console.log(suggestion);
        response.setBody({ success, ...suggestion });
      }
    };

    const response = new Twilio.Response();

    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Content-Type", "application/json");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    console.log("Incoming event", event);

    // Insert AI call here
    await Promise.all([
      performInstructions("action", actionInstructions, event.transcript),
      performInstructions(
        "suggestion",
        suggestionInstructions,
        event.transcript
      ),
    ]);

    response.setStatusCode(200);
    callback(null, response);
  } catch (err) {
    console.error("Error", err);
    callback(err, null);
  }
};
