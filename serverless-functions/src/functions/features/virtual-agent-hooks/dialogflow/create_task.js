const formatLabel = (str) => {
  const arr = str.split(' ');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(' ');
  return str2;
};

export const handler = async function (context, event, callback) {
  let response = new Twilio.Response();

  console.log('>>> INCOMING >>>');
  console.log(event);

  try {
    // Create task
    let client = context.getTwilioClient();
    let task = await client.taskrouter.v1.workspaces(context.TWILIO_FLEX_WORKSPACE_SID).tasks.create({
      taskChannel: event.fulfillmentInfo.tag,
      attributes: JSON.stringify({
        name: formatLabel(event.fulfillmentInfo.tag),
        ...event.sessionInfo.parameters,
      }),
      workflowSid: context.VIRTUAL_AGENT_TASK_WORKFLOW_SID,
    });

    console.log(`Created task ${task.sid}`);
    response.setBody({ status: 'created', task_sid: task.sid });
    callback(null, response);
  } catch (e) {
    console.error(`Failed to create task ` + event.fulfillmentInfo.tag);
    response.setStatusCode(500);
    response.setBody(e.message);
    console.error(e);
    callback(null, response);
  }
};
