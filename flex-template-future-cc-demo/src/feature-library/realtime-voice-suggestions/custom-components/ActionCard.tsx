import React from 'react';
import { Anchor } from '@twilio-paste/core/anchor';
import { Callout, CalloutHeading, CalloutText } from '@twilio-paste/core/callout';

import { AiAction } from '../types/VoiceAssistTypes';

export interface ActionCardProps {
  action: AiAction;
}

const SuggestionCard: React.FC<ActionCardProps> = (props: ActionCardProps) => {
  return (
    <Callout variant="neutral">
      <CalloutHeading as="h2">
        <Anchor
          showExternal
          href="#"
          onClick={() => {
            window.open(props.action.action_url, '_blank');
          }}
        >
          {props.action.title}
        </Anchor>
      </CalloutHeading>
      <CalloutText>{props.action.description}</CalloutText>
    </Callout>
  );
};

export default SuggestionCard;
