import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent } from '../../../../types/feature-loader';
import AgentAssistTab from '../../custom-components/AgentAssistTab';

// If Enhanced CRM Container Tabs are enabled, register the individual components as Tabs
export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    // Only render when we have a task selected
    if (!payload.task) {
      return;
    }

    // Append with our component definition
    payload.components = [
      ...payload.components,
      {
        title: 'Agent Assist',
        order: 25, // optionally define preferred tab order, defaults to 999 if not present
        component: <AgentAssistTab props={payload} key="agent-assist-tab" />,
      },
    ];
  });
};