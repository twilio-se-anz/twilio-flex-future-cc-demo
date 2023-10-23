import React, { useState, useEffect } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Column, Grid } from '@twilio-paste/core/grid';
import { ICard } from '../../../types/ConversationCards';
import ConversationCardsService from '../../../utils/ConversationCards/ConversationCardsService';
import ConversationCard from '../ConversationCard/ConversationCard';
import { Template, templates } from '@twilio/flex-ui';
import { StringTemplates } from '../../../flex-hooks/strings';
import { Heading, Stack } from '@twilio-paste/core';

const ConversationCardsCRM: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [conversationCards, setConversationCards] = useState<undefined | ICard[]>(undefined);

  useEffect(() => {
    async function getResponses() {
      try {
        const responses = await ConversationCardsService.fetchConversationCards();
        setConversationCards(responses.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    }

    getResponses();
  }, []);

  return (
    <Box as="div" padding="space50">
      {isLoading && <SkeletonLoader />}
      {!isLoading && (
        <>
          <Heading as={'label'} variant={'heading30'}>
            Conversation Cards
          </Heading>
          <Grid
            gutter={['space40', 'space40', 'space40']}
            vertical={[true, true, false]}
            element="CONVERSATION_CARD_GRID"
            equalColumnHeights
          >
            <Column span={4} element="CONVERSATION_CARD_COLUMN">
              {conversationCards?.map((card: ICard, index: number) => (
                <ConversationCard {...card} key={index} />
              ))}
            </Column>
          </Grid>
        </>
      )}
      {error && (
        <Text as="p">
          <Template source={templates[StringTemplates.ErrorFetching]} />
        </Text>
      )}
    </Box>
  );
};

export default ConversationCardsCRM;
