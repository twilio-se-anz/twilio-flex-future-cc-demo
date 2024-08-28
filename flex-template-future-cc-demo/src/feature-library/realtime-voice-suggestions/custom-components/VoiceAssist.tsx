import {
  ChatBubble,
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core/stack';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Avatar } from '@twilio-paste/core/avatar';
import { useEffect, useState } from 'react';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { SyncClient } from 'twilio-sync';
import { AiTranscriptionMessage } from '../types/VoiceAssistTypes';

import SuggestionCard from './SuggestionCard';
import ActionCard from './ActionCard';
import { SyncStreamEvent } from './LegacyVoiceAssist';
import VoiceSuggestionsService from '../services/VoiceSuggestionsService';

export type VoiceAssistProps = {
  client: SyncClient;
  callSid: string;
};

const VoiceAssist: React.FC<VoiceAssistProps> = ({ client, callSid }) => {
  const BASE_URL = VoiceSuggestionsService.getAPIBaseUri() || '';
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<AiTranscriptionMessage[]>([]);
  const [requestAnalysis, setRequestAnalysis] = useState(false);

  useEffect(() => {
    if (requestAnalysis === false) return;
    // if (transcript.length <= 2 === false) return; // Don't analyse small transcript

    let signalCancel = false;

    const performAnalysis = () => {
      console.log('Performing analysis on transcript');

      fetch(`${BASE_URL}/api/perform-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, CallSid: callSid }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (signalCancel) {
            console.log('Analysis cancelled before result returned');
            return;
          }
          console.log('Analysis result:', data);
          // Do something with the analysis result
          // setTranscript((transcript) => [msg, ...transcript]);
        })
        .catch((error) => {
          console.error('Error performing analysis:', error);
        })
        .finally(() => setRequestAnalysis(false));
    };

    performAnalysis();
    return () => {
      signalCancel = true;
    };
  }, [requestAnalysis]);

  useEffect(() => {
    if (!client) {
      console.log('Error: Missing client for Voice Assist');
      return;
    }

    if (!callSid || callSid === '') {
      console.log('Error: Missing callSid for Voice Assist');
      return;
    }
    console.log('Using this CallSid for stream connection:', callSid);

    let signalCancel = false;
    const subscribeToStream = async function subscribeToStream() {
      try {
        const stream = await client.stream(`TRANSCRIPTION_${callSid}`);

        if (signalCancel) {
          console.log('Subscription has been cancelled, returning');
          stream.removeAllListeners();
          stream.close();
          return;
        }
        setLoading(false);
        console.log('Access to stream:', stream);

        stream.on('messagePublished', (event: SyncStreamEvent) => {
          const msg: AiTranscriptionMessage = event.message.data as AiTranscriptionMessage;
          console.log(`Transcription event (${msg.actor})`, event);
          setTranscript((transcript) => [msg, ...transcript]);
          if (msg.actor === 'inbound') setRequestAnalysis(true);
        });
      } catch (error) {
        console.error('RVS: Unable to subscribe to Sync stream', error);
      }
    };

    subscribeToStream();
    return () => {
      signalCancel = true;
      console.log('Tearing down useEffect subscription');
    };
  }, [callSid, client]);

  const RenderMessage = (item: AiTranscriptionMessage) => {
    const direction = item.actor === 'outbound' ? 'outbound' : 'inbound';
    if (item.actor === 'AI') {
      switch (item.type) {
        case 'suggestion':
          if (!item.ai) return <></>;
          return <SuggestionCard suggestion={item.ai} />;
        case 'action':
          return <ActionCard action={item.ai} />;
        default:
          return <></>;
      }
    }

    return (
      <ChatMessage variant={direction}>
        <ChatBubble>{item.transcriptionText}</ChatBubble>
        <ChatMessageMeta aria-label={direction}>
          <Tooltip text={direction}>
            <ChatMessageMetaItem>
              <Avatar name={direction} size="sizeIcon20" icon={direction === 'inbound' ? UserIcon : AgentIcon} />
              {direction === 'inbound' ? 'Customer' : 'You'}
            </ChatMessageMetaItem>
          </Tooltip>
        </ChatMessageMeta>
      </ChatMessage>
    );
  };

  if (loading)
    return (
      <Stack orientation={'vertical'} spacing={'space20'}>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </Stack>
    );

  return (
    <Box width={'100%'} overflow="scroll" inset={undefined} backgroundColor={'colorBackgroundBody'}>
      {/* <AiSuggestion transcript={transcript} /> */}
      <ChatLog>
        {transcript && (
          <ChatBookend>
            <ChatBookendItem>
              <strong>Twilio</strong> real-time voice suggestion
            </ChatBookendItem>
          </ChatBookend>
        )}

        {transcript &&
          transcript.map((item: AiTranscriptionMessage, idx: number) => (
            <RenderMessage {...item} key={`chat-${idx}`} />
          ))}
      </ChatLog>
    </Box>
  );
};

export default VoiceAssist;
