const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

// Parameters required to start the Google CCAI Agent Assist conversation
const requiredParameters = [
  {
    key: 'conversationId',
    purpose: 'Conversation ID to use with Google CCAI',
  },
  {
    key: 'agentSid',
    purpose: 'Agent SID to use as part of the conversation',
  },
  {
    key: 'customerSid',
    purpose: 'Customer SID to use as part of the conversation',
  },
];

const createParticipant = async (conversationId, participantId, role) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${context.CCAI_ACCESS_TOKEN}`,
      'x-goog-user-project': context.CCAI_PROJECT_ID,
    },
    body: JSON.stringify({
      role,
      name: participantId,
    }),
  };

  const addParticipantEndpoint =
    context.CCAI_ENDPOINT_URI +
    `/v2/projects/${context.CCAI_PROJECT_ID}" +
  "/conversations/${conversationId}/participants`;
  console.log(`Add participant to conversation URL`, addParticipantEndpoint);
  const addParticipantResponse = await fetch(addParticipantEndpoint, fetchOptions);
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    console.log('GAA create-conversation >> incoming >>', event);

    /******************************
     *
     * Create a new conversation
     *
     ******************************/
    // Fetch command to call Google Agent Assist and start a new conversation
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${context.CCAI_ACCESS_TOKEN}`,
        'x-goog-user-project': context.CCAI_PROJECT_ID,
      },
      body: JSON.stringify({
        conversationProfile: `projects/${context.CCAI_PROJECT_ID}/conversationProfiles/${context.CCAI_CONVERSATION_PROFILE}`,
      }),
    };

    const newConversationUrl =
      context.CCAI_ENDPOINT_URI +
      `/v2/projects/${context.CCAI_PROJECT_ID}/conversations?conversationId=${event.conversationId}`;
    console.log(`Creating conversation with URL`, newConversationUrl);

    const newConversationFetchResponse = await fetch(newConversationUrl, fetchOptions);

    if (newConversationFetchResponse.status !== 200) {
      response.setBody({ status: 'error' });
      const data = await newConversationFetchResponse.json();
      console.log(`Create conversation error response`, data);
      return handleError(response);
    }

    const data = await newConversationFetchResponse.json();
    console.log(`Create conversation response`, data);

    /******************************
     *
     * Create a new participant (customer)
     *
     ******************************/
    createParticipant(event.conversationId, 'TTTTTTTTTT', 'END_USER');

    /******************************
     *
     * Create a new participant (agent)
     *
     ******************************/

    createParticipant(event.conversationId, 'TTTTTTTTTT', 'HUMAN_AGENT');

    response.setStatusCode(200);
    response.setBody({ status: 'tested ok', data });

    return callback(null, response);
  } catch (error) {
    console.log('An error occurred processing message', error);
    return handleError(error);
  }
});
