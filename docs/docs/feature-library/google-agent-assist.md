# Google Agent Assist
This feature adds Google Agent Assist to Twilio Flex, it depends on the transcript being generated and available to the plugin.

To create the transcript using Microsoft, Deepgram or Google please [see this project](https://github.com/chaosloth/twilio-stream-transcript)

## Setup

Summary
1. Create Google project
2. Enable Billing for this project
3. Enable DialogFlow API, Labeling API
4. Create a Knowledge Base (see below)
5. Create a Pub/Sub topic for Agent Assist (see below)
6. Create the Conversation Profile

### Create Knowledge base
Follow the steps to create a knowledge base [here](https://agentassist.cloud.google.com/projects/)

### Create Pub/Sub Topic
- Ensure you are connected to the appropriate environment with:
```sh
gcloud info
```
- Create the topic
Example:
```sh
gcloud pubsub topics create agent-assist
```

- Verify the topic has been created with:
Example:
```sh
gcloud pubsub topics list
```

## Create subscription
Configure the pub/sub service to trigger Twilio Serverless, see:
`https://console.cloud.google.com/cloudpubsub/topic/addSubscription/agent-assist?project=<PROJECT_ID>`

*Enable authentication if required*

### Check the pub sub subscription
Check the topic is working and your endpoint is getting messages with:
```sh
gcloud pubsub topics publish agent-assist \
  --message="This is an example" \
  --attribute=TWILIO="FLEX"
  ```

## Create the conversation profile
Nagivate to your project space, for example
`https://agentassist.cloud.google.com/projects/<PROJECT>/locations/<LOCATION>/conversation-profiles`


Create a new conversation profile, in the profile:
- Enable article/FAQ suggestion and choose the newly created Knowledge Base
- Enable pub/sub and enter the previously created topic (e.g.: `projects/<PROJECT>/topics/agent-assist`)


# Testing
## Create conversation
```sh
curl -X POST \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "x-goog-user-project: cc-insurance-378400" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @request.json \
    "https://dialogflow.googleapis.com/v2/projects/<PROJECT_ID>/conversations"
```
