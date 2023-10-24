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
  const [token, setToken] = useState({});

  useEffect(() => {
    // get isCall
    const isCall = !Flex.TaskHelper.isChatBasedTask(task as any);
    // get current call or convo SID
    const sid = isCall ? task?.attributes.call_sid : task?.attributes.conversationSid;
    KoreAgentAssistService.getToken()
      .then((response) => {
        setToken(response);
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

  useEffect(() => {
    async function init() {
      console.log("*** Search init called", task);
      const manager = Flex.Manager.getInstance();
      const worker = manager.workerClient?.name;

      const conversation =
        await manager.conversationsClient.getConversationBySid(
          task?.attributes.conversationSid ?? ''
        );

      conversation.on("messageAdded", async (message) => {
        console.log("*** Send to Kore iFrame:", message);
        const participant = message.getParticipant();
        const isWorker = message.author === worker;

        let iframe = document.getElementById('agentassist-iframe') as HTMLIFrameElement;
        if (!iframe) {
          return;
        }
        console.log("Kore Agent Assist iframe", iframe);

        var koreMessage = {
          author: { Id: '', type: isWorker ? 'AGENT' : 'USER', firstName: isWorker ? null : 'Jason' },
          name: 'agentAssist.CustomerMessage',
          value: message.body,
          conversationid: conversation.sid
        };

        console.log('koreMessage', koreMessage);
        // window post message
        var vfWindow = iframe.contentWindow;
        if (vfWindow) {
          vfWindow.postMessage(koreMessage, 'https://agentassist.kore.ai');
        }
      });
    }

    init();
  }, []);

  useEffect(() => {
    console.log("Kore Agent Assist registering window listener for agentassist changed var")
    window.addEventListener("message", async (event) => {
      console.log("**** Kore Agent Assist inside window eventlistener", event.data);

      if (event.data.name === "agentAssist.SendMessage" && event.data.conversationId === task?.attributes.conversationSid) {
        var msg = '';
        try {
          msg = JSON.parse(decodeURI(event.data.payload)).message[0].cInfo.body;
        } catch (e) {
          msg = decodeURI(encodeURI(event.data.payload));
        }
        console.log("Kore Agent Assist1 sending message", msg);

        Flex.Actions.invokeAction("SendMessage", { body: msg, conversationSid: task?.attributes.conversationSid ?? '' });

      } else if (event.data.name === "agentAssist.CopyMessage" && event.data.conversationId === task?.attributes.conversationSid) {
        var msg = decodeURI(encodeURI(event.data.payload));
        console.log("Kore Agent Assist1 copying message", msg);

        Flex.Actions.invokeAction("SetInputText", { body: msg, conversationSid: task?.attributes.conversationSid ?? '' });
      }
    });
  }, []);

  // kore-agent-assist/get-token

  return (
    <>
      <iframe
        id='agentassist-iframe'
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
