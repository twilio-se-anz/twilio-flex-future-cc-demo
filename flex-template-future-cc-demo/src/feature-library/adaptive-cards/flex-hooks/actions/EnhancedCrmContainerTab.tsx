import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent } from '../../../../types/feature-loader';
import { showCardsTab, tabOrder } from '../../config';
import ConversationCardsTab from '../../custom-components/CardsTab/ConversationCardsTab';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!showCardsTab() || !payload.task || !Flex.TaskHelper.isChatBasedTask(payload.task)) {
      return;
    }

    const order = tabOrder();

    payload.components = [
      ...payload.components,
      {
        title: 'Cards',
        order: order,
        component: <ConversationCardsTab key="conversation-cards-tab" />,
      },
    ];
  });
};
