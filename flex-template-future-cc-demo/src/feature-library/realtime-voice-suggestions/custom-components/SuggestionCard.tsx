import { Callout, CalloutHeading, CalloutText } from '@twilio-paste/core/callout';
import { Text } from '@twilio-paste/core/text';

import { AiSuggestion } from '../types/VoiceAssistTypes';

export interface SuggestionCardProps {
  suggestion: AiSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = (props: SuggestionCardProps) => {
  return (
    <Callout variant="new">
      <CalloutHeading as="h2">
        <Text as={'h2'} fontWeight={'fontWeightBold'}>
          {props.suggestion.title}
        </Text>
      </CalloutHeading>
      <CalloutText>{props.suggestion.suggestion}</CalloutText>
    </Callout>
  );
};

export default SuggestionCard;
