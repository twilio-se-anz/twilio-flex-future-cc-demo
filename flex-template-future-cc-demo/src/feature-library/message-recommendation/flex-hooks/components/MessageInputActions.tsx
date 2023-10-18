import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import MessageRecommendationIcon from '../../custom-components/MessageRecommendation/MessageRecommendationIcon';

export const componentName = FlexComponent.MessageInputActions;
export const componentHook = function addMessageRecommendations(flex: typeof Flex, _manager: Flex.Manager) {
  flex.MessageInputActions.Content.add(<MessageRecommendationIcon key="msg-recommendation-component" />, {
    sortOrder: -1,
  });
};
