import { Stack } from '@twilio-paste/core/stack';
import { Task } from 'types/task-router';
import { Alert } from '@twilio-paste/core/alert';

import VoiceAssist from './VoiceAssist';

export type VoiceAssistTabProps = {
  props: {
    task?: Task;
  };
};

const VoiceAssistTab: React.FC<VoiceAssistTabProps> = ({ props }) => {
  if (!props.task || props.task.taskChannelUniqueName !== 'voice')
    return (
      <Stack orientation={'vertical'} spacing={'space20'}>
        <Alert variant={'neutral'}>
          <strong>Not active for this task:</strong> This tab only displays information for Call tasks
        </Alert>
      </Stack>
    );

  return <VoiceAssist callSid={props.task.attributes.call_sid} />;
};

export default VoiceAssistTab;
