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

import client from '../../../utils/sdk-clients/sync/SyncClient';
import SuggestionCard from './SuggestionCard';

export type VoiceAssistProps = {
  callSid: string;
};

export type AiTranscriptionSyncEvent = {
  message: AiTranscriptionEvent; // twilio-sync does not export the StreamMessage type
  isLocal: boolean;
};

export type AiTranscriptionEvent = AiEvent | TranscriptionEvent;

export type AiEvent = {
  actor: 'AI';
  suggestionsFromAI?: {
    title: string;
    suggestion: string;
  };
};

export type TranscriptionEvent = {
  actor: 'inbound' | 'outbound';
  transcriptionText: string;
};

export type LegacySyncStreamEvent = {
  message: any; // twilio-sync does not export the StreamMessage type
  isLocal: boolean;
};

const VoiceAssist: React.FC<VoiceAssistProps> = ({ callSid }) => {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<AiTranscriptionEvent[]>([]);
  useEffect(() => {
    if (!callSid || callSid === '') {
      console.log('Error: Missing callSid for Voice Assist');
      return;
    }
    console.log('Using this CallSid for stream connection:', callSid);

    try {
      client.stream(`TRANSCRIPTION_${callSid}`).then((stream: any) => {
        setLoading(false);
        console.log('Access to stream:', stream);
        stream.on('messagePublished', (event: AiTranscriptionSyncEvent) => {
          console.log(`Transcription event (${event.message.actor})`, event);
          setTranscript((transcript) => [...transcript, event.message]);
        });
      });
    } catch (error) {
      console.error('RVS: Unable to subscribe to Sync stream', error);
    }
  }, []);

  const renderMessage = (item: AiTranscriptionEvent) => {
    const direction = item.actor === 'outbound' ? 'outbound' : 'inbound';
    if (item.actor === 'AI') {
      if (!item.suggestionsFromAI) return <></>;
      return <SuggestionCard suggestion={item.suggestionsFromAI} />;
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
    <Box width={'100%'} overflow="scroll" inset={undefined} padding={'space40'} backgroundColor={'colorBackgroundBody'}>
      <Stack orientation={'vertical'} spacing={'space40'}>
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
            transcript.map((item: AiTranscriptionEvent, idx: number) => {
              return (
                <Box
                  key={idx}
                  inset={undefined}
                  gridRow={undefined}
                  gridColumn={undefined}
                  gridAutoFlow={undefined}
                  gridAutoColumns={undefined}
                  gridAutoRows={undefined}
                  gridTemplateColumns={undefined}
                  gridTemplateRows={undefined}
                  gridTemplateAreas={undefined}
                  gridArea={undefined}
                >
                  {renderMessage(item)}
                </Box>
              );
            })}
        </ChatLog>
      </Stack>
    </Box>
  );
};

export default VoiceAssist;
