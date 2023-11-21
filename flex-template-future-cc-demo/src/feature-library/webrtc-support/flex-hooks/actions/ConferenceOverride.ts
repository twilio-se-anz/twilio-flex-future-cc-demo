import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';

// If Enhanced CRM Container Tabs are enabled, register the individual components as Tabs
export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function addConferenceOptions(flex: typeof Flex, manager: Flex.Manager) {
  /*
   * Conference calls need a From number in case of using PSTN
   * This adds a From number using the Task Attributes
   * Ref: FLEXUI-1625
   */
  Flex.Actions.addListener('beforeAcceptTask', (payload: any) => {
    if (Flex.TaskHelper.isCallTask(payload.task)) {
      const fromAttribute = payload.task.attributes.from;
      const clientTest = /[a-zA-Z]/;
      if (clientTest.test(fromAttribute)) {
        payload.conferenceOptions.from = fromAttribute;
      }
    }
  });
};
