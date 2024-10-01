import * as Flex from '@twilio/flex-ui';

import CallTranscript from '../../custom-components/CallTranscript';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addTranscriptTab(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab key="transcript-viewer" uniqueName="transcript-viewer" label="Transcript">
      <CallTranscript key="call-transcript-tab" />
    </Flex.Tab>,
    {
      sortOrder: 1000,
      if: ({ task }) => Flex.TaskHelper.isCallTask(task),
    },
  );
};
