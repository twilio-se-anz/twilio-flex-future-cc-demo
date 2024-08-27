import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent } from '../../../../types/feature-loader';
import { tabOrder } from '../../config';
import SegmentView from '../../custom-components/SegmentView';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task) {
      return;
    }

    const order = tabOrder();

    payload.components = [
      ...payload.components,
      {
        title: 'Profile',
        order: order,
        component: <SegmentView props={payload} key="segment-tab" />,
      },
    ];
  });
};
