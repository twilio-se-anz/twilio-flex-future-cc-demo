import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum Panel2MultiTabsNotifications {
  ExtendCheckOutSuccess = 'FauxExtendCheckoutSuccess',
}

// Return an array of Flex.Notification
export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: Panel2MultiTabsNotifications.ExtendCheckOutSuccess,
    type: Flex.NotificationType.success,
    content: StringTemplates.FauxHotelBookingsExtendCheckoutSuccess,
    timeout: 3000,
  },
];
