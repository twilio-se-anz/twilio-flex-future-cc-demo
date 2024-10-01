import { Avatar } from '@twilio-paste/core/avatar';
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
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ITask, withTaskContext } from '@twilio/flex-ui';

import TranscriptService from '../services/TranscriptService';
import { TranscriptListItem } from '../types/TranscriptViewer';

export interface CallTranscriptProps {
  task?: ITask & { call_sid?: string };
}

const CallTranscript: React.FC<CallTranscriptProps> = (props: CallTranscriptProps) => {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptListItem[]>();

  useEffect(() => {
    const call_sid = props.task?.attributes?.original_call_sid || undefined;
    console.log('Fetching transcript for call SID:', call_sid);
    if (!call_sid) return;

    TranscriptService.getTranscript(call_sid)
      .then((transcript) => setTranscript(transcript))
      .catch((err) => console.log(`Error fetching transcript`, err))
      .finally(() => setLoading(false));
  }, [props.task?.attributes]);

  if (loading)
    return (
      <>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </>
    );

  return (
    <Box overflow="scroll">
      <ChatLog>
        {transcript && (
          <ChatBookend>
            <ChatBookendItem>
              Start of transcript・
              {moment(transcript[0].dateCreated).format('hh:mm:ss')}
            </ChatBookendItem>
          </ChatBookend>
        )}

        {transcript &&
          transcript.map((item, idx: number) => {
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
                <ChatMessage variant={item.data.actor === 'inbound_track' ? 'inbound' : 'outbound'}>
                  <ChatBubble>{item.data.transcriptionText}</ChatBubble>
                  <ChatMessageMeta aria-label={'Said by'}>
                    <ChatMessageMetaItem>
                      <Avatar
                        name={item.data.actor === 'inbound_track' ? 'Caller' : 'Virtual Agent'}
                        size="sizeIcon20"
                      />
                      {item.data.actor === 'inbound_track' ? 'Caller' : 'Virtual Agent'} ・{' '}
                      {moment(item.dateCreated).format('hh:mm:ss')}
                    </ChatMessageMetaItem>
                  </ChatMessageMeta>
                </ChatMessage>
              </Box>
            );
          })}
        {transcript && (
          <ChatBookend>
            <ChatBookendItem>
              <strong>End of transcript</strong>・
              {moment(transcript[transcript.length - 1].dateCreated).format('hh:mm:ss')}
            </ChatBookendItem>
          </ChatBookend>
        )}
      </ChatLog>
    </Box>
  );
};

export default withTaskContext(CallTranscript);
