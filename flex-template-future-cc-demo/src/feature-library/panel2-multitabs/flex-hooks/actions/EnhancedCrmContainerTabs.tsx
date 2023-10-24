import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent } from '../../../../types/feature-loader';
import { createEnhancedCrmContainerTabs } from '../../config';
import SegmentView from '../../custom-components/Segment/SegmentView';
import ConversationCardsCRM from '../../custom-components/ConversationCards/ConversationCardsCRM';
import FauxCustomerProfile from '../../custom-components/FauxCustomerProfile/FauxCustomerProfileView';


// If Enhanced CRM Container Tabs are enabled, register the individual components as Tabs
export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    // Only render when we have a task and createEnhancedCrmContainerTabs = true
    if (!createEnhancedCrmContainerTabs() && !payload.task) {
      return;
    }

    if (payload.task && Flex.TaskHelper.isChatBasedTask(payload.task) && !Flex.TaskHelper.isInWrapupMode(payload.task)) {
      payload.components = [
        ...payload.components,
        {
          title: 'Cards',
          order: 1, // optionally define preferred tab order, defaults to 999 if not present
          component: <ConversationCardsCRM key="conversation-cards-tab" />,
        },
        {
          title: 'Segment',
          order: 0, // optionally define preferred tab order, defaults to 999 if not present
          component: <SegmentView key="segment-tab" />,
        },
      ]
    }

    if (!Flex.TaskHelper.isChatBasedTask(payload.task) && !Flex.TaskHelper.isInWrapupMode(payload.task)) {
      payload.components = [
        ...payload.components,
        {
          title: 'Profile',
          order: 2, // optionally define preferred tab order, defaults to 999 if not present
          component: <FauxCustomerProfile key="faux-profile-tab" />,
        },
      ]
    }
  });
};