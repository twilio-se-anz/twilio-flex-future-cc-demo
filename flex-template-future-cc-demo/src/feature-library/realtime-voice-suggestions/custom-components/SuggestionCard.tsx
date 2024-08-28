import React from 'react';
import { Callout, CalloutHeading, CalloutText } from '@twilio-paste/core/callout';

import { AiSuggestion } from '../types/VoiceAssistTypes';

export interface SuggestionCardProps {
  suggestion: AiSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = (props: SuggestionCardProps) => {
  return (
    <Callout variant="new">
      <CalloutHeading as="h2">{props.suggestion.title}</CalloutHeading>
      <CalloutText>{props.suggestion.suggestion}</CalloutText>
    </Callout>
  );
};

export default SuggestionCard;
