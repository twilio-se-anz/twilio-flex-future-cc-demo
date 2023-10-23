// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ConversationCards = 'SEConversationCards',
  ErrorFetching = 'PSCannedResponsesErrorFetching',
  FauxHotelBookingsExtendCheckoutSuccess = 'FauxHotelBookingsExtendCheckoutSuccess',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ConversationCards]: 'Conversation Card Responses',
    [StringTemplates.ErrorFetching]: 'There was an error fetching responses. Please reload the page.',
    [StringTemplates.FauxHotelBookingsExtendCheckoutSuccess]: 'Succesfully extended checkout time!',
  },
});
