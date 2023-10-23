import * as Flex from '@twilio/flex-ui';

import React, { useEffect, useState } from 'react';

import KoreAgentAssistService from '../utils/KoreAgentAssistService';
import Task from '../../../types/task-router/Task';

type AgentAssistTabProps = {
  props: {
    task?: Task;
  }
};

const AgentAssistTab: React.FunctionComponent<AgentAssistTabProps> = ({ props }: AgentAssistTabProps) => {
  const task = props.task;

  const [url, setUrl] = useState('');

  useEffect(() => {
    // get isCall
    const isCall = !Flex.TaskHelper.isChatBasedTask(task as any);
    // get current call or convo SID
    const sid = isCall ? task?.attributes.call_sid : task?.attributes.conversationSid;
    KoreAgentAssistService.getToken()
      .then((response) => {
        // build URL
        let tmpUrl = ''
        let customdata = encodeURI(JSON.stringify({ fName: 'Jason', lName: '' }))
        let _source = "twilio";
        tmpUrl = `${response.agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${response.token}&botid=${response.botId}&agentassisturl=${response.smartassistURL}&conversationid=${sid}&source=${_source}&isCall=${isCall}&customdata=${customdata}`;
        if (response.autoBotId != 'null') {
          tmpUrl = `${url}&autoBotId=${response.autoBotId}`
        }
        if (response.agentGroup != 'null') {
          tmpUrl = `${url}&agentGroup=${response.agentGroup}`
        }
        console.log('Agent Assist URL: ', tmpUrl);
        setUrl(tmpUrl);
      })
      .catch(error => {
        console.log('failed to get Kore Token', error);
        return;
      });
  }, []);

  // kore-agent-assist/get-token

  return (
    <>
      <iframe
        title="agentAssistIframe"
        src={url}
        height="100%"
        width="100%"
        allowFullScreen={true}
      ></iframe>
    </>
  );

};

export default AgentAssistTab;
