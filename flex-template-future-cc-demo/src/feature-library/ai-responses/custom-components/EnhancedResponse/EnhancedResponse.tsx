import React, { ChangeEvent, useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { NewIcon } from '@twilio-paste/icons/esm/NewIcon';
import { withTaskContext, TaskContextProps } from '@twilio/flex-ui';
import { Button, Select, Option, Switch, Text, Flex as PasteFlex } from '@twilio-paste/core';

import { ResponseEnhancerWrapper } from './ResponseEnhancerWrapperStyles';
import AiResponsesService from '../../utils/AiResponsesService';
import { personas } from '../../types/Personas';
import SegmentService from '../../../panel2-multitabs/utils/SegmentService/SegmentService';
import { KnownTraits } from '../../../panel2-multitabs/flex-hooks/strings/segmentTraits';
import { SegmentTraits } from '../../../panel2-multitabs/types/Segment/SegmentTraits';

interface OwnProps {
  // Props passed directly to the component
}

type Props = TaskContextProps & OwnProps;

const EnhancedResponse: React.FunctionComponent<Props> = ({ task }) => {
  const conversationSid = task?.attributes.conversationSid;

  const [loading, setLoading] = useState(false);
  const [persona, setAiPersona] = useState('corporate and concise');
  const [traitsOn, setTraitsOn] = React.useState(false);
  const [traits, setTraits] = useState<SegmentTraits>({});

  const currResponse = Flex.useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid].inputText);

  useEffect(() => {
    SegmentService.fetchTraitsForUser(task?.attributes.email)
      .then((userTraits) => setTraits(userTraits))
      .catch((err) => console.error('AI Enhanced Responses - Error fetching user traits', err))
      .finally(() => setLoading(false));
  }, [task?.attributes.email]);

  const getUserContext = (): string => {
    let userContext: string = '';
    if (traitsOn) {
      KnownTraits.forEach((item) => {
        if (traits && traits.hasOwnProperty(item.key)) {
          userContext += '\n - ' + item.label + ' is ' + (traits as any)[item.key] + ' ';
        }
      });

      if (userContext.length > 0) userContext.length + '\n';
    }
    return userContext;
  };

  const rephraseResponse = () => {
    if (currResponse.trim().length == 0) {
      return;
    }

    setLoading(true);

    AiResponsesService.getEnhancedResponseWithPersonaAndUserContext(currResponse, persona, getUserContext())
      .then((response) => {
        if (!response || response === '') return;

        Flex.Actions.invokeAction('SetInputText', {
          body: response,
          conversationSid: task?.attributes.conversationSid,
        });
      })
      .catch((err) => console.error('Error fetching AI response', err))
      .finally(() => setLoading(false));
  };

  const handlePersonaChoice = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log('Handle persona selection', e);
    setAiPersona(e.target.value);
  };

  const makeSelectBetter = () => {
    return (
      <Select id="persona" value={persona} onChange={(choice) => handlePersonaChoice(choice)}>
        {personas.map((persona) => {
          return (
            <Option key={persona.name} value={persona.prompt}>
              {persona.name}
            </Option>
          );
        })}
      </Select>
    );
  };

  return (
    <ResponseEnhancerWrapper>
      <PasteFlex hAlignContent="center" vAlignContent="center" padding="space10">
        {makeSelectBetter()}
        <Switch name="useTraits" value="traits" checked={traitsOn} onChange={() => setTraitsOn(!traitsOn)}>
          <Text as={'p'} fontSize="fontSize20">
            Traits
          </Text>
        </Switch>
        <Button onClick={rephraseResponse} size="circle" variant="secondary_icon" loading={loading}>
          <NewIcon decorative={false} title="Rephrase" />
        </Button>
      </PasteFlex>
    </ResponseEnhancerWrapper>
  );
};

export default withTaskContext(EnhancedResponse);
