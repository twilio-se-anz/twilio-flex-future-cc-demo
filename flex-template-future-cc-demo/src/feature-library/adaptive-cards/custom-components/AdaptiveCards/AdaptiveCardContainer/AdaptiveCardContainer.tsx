import React, { useEffect, useRef } from 'react';
import { Alert, Box, Card } from '@twilio-paste/core';
import { Message } from '@twilio/conversations';
import * as AdaptiveCards from 'adaptivecards';

interface AdaptiveCardContainerProps {
  message: Message;
}

interface IDictionary {
  [index: string]: string;
}

const ADAPTIVE_CARD_KEY_NAME: string = 'adaptive-card';

const AdaptiveCardContainer: React.FunctionComponent<AdaptiveCardContainerProps> = ({ message }) => {
  const attributes: IDictionary = message.attributes as IDictionary;
  const mountRef = useRef<HTMLElement>(null);

  // Create the reference to the adaptive card once and maintain a reference to it
  useEffect(() => {
    if (!attributes || !attributes[ADAPTIVE_CARD_KEY_NAME]) return;

    const hostConfig: Partial<AdaptiveCards.HostConfig> = {
      supportsInteractivity: true,
      fontFamily:
        '"Inter var experimental", "Inter var", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    };
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(hostConfig);
    adaptiveCard.parse(attributes[ADAPTIVE_CARD_KEY_NAME]);

    // Provide an onExecuteAction handler to handle the Action.Submit
    adaptiveCard.onExecuteAction = (action: AdaptiveCards.Action) => {
      if (action instanceof AdaptiveCards.SubmitAction) {
        // If you copy this code sample, remove the alert statement and provide your own custom handling code
        console.info('User clicked: ', action.title);
      }
    };

    const renderedCard = adaptiveCard.render();
    if (renderedCard && mountRef.current) mountRef.current.appendChild(renderedCard);
  }, [attributes]);

  if (!attributes || !attributes[ADAPTIVE_CARD_KEY_NAME]) {
    console.log('No adaptive card found in the message', message);
    return (
      <Alert variant="warning">
        <strong>Message error</strong> Adaptive card data is missing for this message.
      </Alert>
    );
  }

  return (
    <Box marginTop="space20" marginBottom="space50">
      <Card padding="space20">
        <div ref={mountRef as React.RefObject<HTMLDivElement>} />
      </Card>
    </Box>
  );
};

export default AdaptiveCardContainer;
