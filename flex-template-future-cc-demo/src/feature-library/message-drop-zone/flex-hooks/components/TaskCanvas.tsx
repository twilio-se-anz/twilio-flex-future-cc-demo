import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { MessageDropZoneWrapper } from '../../custom-components/MessageDropZone/MessageDropZoneWrapper';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MessageInputActions;
export const componentHook = function wrapTaskCanvasComponent(flex: typeof Flex, _manager: Flex.Manager) {
  flex.TaskCanvas.Content.addWrapper((OriginalComponent) => (originalProps) => {
    return (
      <MessageDropZoneWrapper>
        <OriginalComponent {...originalProps} />
      </MessageDropZoneWrapper>
    );
  });
};
