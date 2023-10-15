import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { FlexComponent } from '../../../../types/feature-loader';
import AdaptiveCardFlexWrapper from '../../custom-components/AdaptiveCards/AdaptiveCardFlexWrapper';

export const componentName = FlexComponent.MessageListItem;
export const componentHook = function addAdaptiveCardComponent(flex: typeof Flex, _manager: Flex.Manager) {
  const options: Flex.ContentFragmentProps = {
    if: (props: any) => {
      if (props?.message?.source?.attributes?.['adaptive-card']) return true;
      return false;
    },
    sortOrder: -1,
  };

  const data = {};

  flex.MessageListItem.Content.add(<AdaptiveCardFlexWrapper key="adaptive-card" />, options);
};
