import * as Flex from '@twilio/flex-ui';

import EnhancedResponse from '../../custom-components/EnhancedResponse';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MessageInputActions;
export const componentHook = function addEnhancedResponsesMessageInputAction(
  flex: typeof Flex,
  _manager: Flex.Manager,
) {
  const options: Flex.ContentFragmentProps = {
    sortOrder: -1,
  };

  flex.MessageInputActions.Content.add(<EnhancedResponse key="ai-response-enhancer" />, options);
};
