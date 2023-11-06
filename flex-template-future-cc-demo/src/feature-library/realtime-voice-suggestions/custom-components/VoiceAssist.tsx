import {
  ChatBubble,
  ChatLog,
  ChatMessage,
  SkeletonLoader,
  Box,
  ChatBookend,
  ChatBookendItem,
  TextArea,
  Label,
  Text,
  Stack,
} from '@twilio-paste/core';
import { useEffect, useState } from 'react';
import client from '../../../utils/sdk-clients/sync/SyncClient';
import { TranscriptTurn } from '../types/VoiceAssistTypes';
import AiSuggestion from './AiSuggestions';
import { Task } from 'types/task-router';

export type VoiceAssistTabProps = {
  props: {
    task?: Task;
  };
};

export type SyncStreamEvent = {
  message: any; // twilio-sync does not export the StreamMessage type
  isLocal: boolean;
};

const VoiceAssistTab: React.FC<VoiceAssistTabProps> = ({ props }) => {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [intermediateResult, setIntermediateResult] = useState<string>('');

  // const syncClient = useSyncClient(Flex.Manager.getInstance().user.identity);
  let stream: any; // twilio-sync does not export the SyncStream type

  useEffect(() => {
    if (props.task && props.task.taskChannelUniqueName === 'voice') {
      // This is a voice task, you can access the CallSid from task attributes
      const callSid = props.task.attributes.call_sid;
      console.log('Using this CallSid for stream connection:', callSid);

      try {
        client.stream('FLEX_ASSIST_' + callSid).then((stream: any) => {
          setLoading(false);
          console.log('Access to stream:', stream);
          stream.on('messagePublished', (event: SyncStreamEvent) => {
            console.log('*** NEW MSG', event);

            const words = event?.message?.data.text;

            if (event?.message?.data.isFinal == true) {
              console.log('Adding to transcript', words);
              setTranscript((transcript) => [...transcript, { message: words, direction: event.message.data.track }]);
            } else {
              setIntermediateResult(words);
            }
          });
        });
      } catch (error) {
        console.error('RVS: Unable to subscribe to Sync stream', error);
      }
    } else {
      console.log('Not currently on a voice task.');
    }
  }, []);

  if (loading)
    return (
      <Stack orientation={'vertical'} spacing={'space20'}>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </Stack>
    );

  return (
    <Box width={'100%'} overflow="scroll" inset={undefined} padding={'space40'}>
      <Stack orientation={'vertical'} spacing={'space40'}>
        <>
          <Label htmlFor="caller_text" required>
            Caller transcript
          </Label>
          <TextArea
            onChange={() => {}}
            id="caller_text"
            name="caller_text"
            insertBefore={
              <Text color="colorTextWeak" as="span" fontWeight="fontWeightSemibold">
                Caller
              </Text>
            }
            required
            value={intermediateResult}
          />
        </>

        <AiSuggestion transcript={transcript} />

        <ChatLog>
          {transcript && (
            <ChatBookend>
              <ChatBookendItem>
                <strong>Twilio</strong> real-time voice suggestion
              </ChatBookendItem>
            </ChatBookend>
          )}

          {transcript &&
            transcript.map((item: TranscriptTurn, idx: number) => {
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
                  <ChatMessage variant={item.direction}>
                    <ChatBubble>{item.message}</ChatBubble>
                  </ChatMessage>
                </Box>
              );
            })}
        </ChatLog>
      </Stack>
    </Box>
  );
};

export default VoiceAssistTab;
