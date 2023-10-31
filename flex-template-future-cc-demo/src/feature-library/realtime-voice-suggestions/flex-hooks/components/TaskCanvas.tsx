import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { FlexComponent } from '../../../../types/feature-loader';
import { Tab } from '@twilio/flex-ui';
import VoiceAssist from '../../custom-components/VoiceAssist';

export const componentName = FlexComponent.MessageInputActions;
export const componentHook = function wrapTaskCanvasComponent(flex: typeof Flex, _manager: Flex.Manager) {
  const va_tab_options: Flex.ContentFragmentProps = {
    if: (props: any) => {
      // Only display if we have a va_call_sid
      return Object.hasOwn(props.task?.attributes, 'voice_assist') ? true : false;
    },
    sortOrder: -1,
  };

  /**********************
   *  TAB - Virtual Agent
   **********************/
  flex.TaskCanvasTabs.Content.add(
    <Tab uniqueName="voice_assist" key="voice_assist" label="Assist">
      <VoiceAssist />
    </Tab>,
    va_tab_options,
  );
};
