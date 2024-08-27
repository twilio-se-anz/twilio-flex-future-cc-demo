import { Badge, Card, Heading, Text } from '@twilio-paste/core';
import { GoogleAgentAssistSuggestion } from '../types/GoogleAgentAssistTypes';

export interface GoogleSuggestionCardProps {
  suggestion: GoogleAgentAssistSuggestion;
}

const GoogleSuggestionCard: React.FC<GoogleSuggestionCardProps> = (props: GoogleSuggestionCardProps) => {
  return (
    <Card>
      <Heading as={'div'} variant={'heading10'}>
        {props.suggestion.title}
      </Heading>
      <Text as={'h2'} fontWeight={'fontWeightBold'}>
        {props.suggestion.suggestion}
      </Text>
      <Badge variant={'neutral'} as={'span'}>
        {props.suggestion.type}
      </Badge>
    </Card>
  );
};

export default GoogleSuggestionCard;
