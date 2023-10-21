import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Paragraph,
  Flex as PasteFlex,
  Popover,
  PopoverButton,
  PopoverContainer,
  Spinner,
  Text,
  usePopoverState,
} from '@twilio-paste/core';
import { LoadingIcon } from '@twilio-paste/icons/esm/LoadingIcon';
import { StarIcon } from '@twilio-paste/icons/esm/StarIcon';
import * as Flex from '@twilio/flex-ui';
import { Actions, ITask, useFlexSelector, withTaskContext } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';

import { getUserLanguage } from '../../../../utils/configuration';
import { MessageType } from '../../types/MessageType';
import MessageRecommendation from '../../utils/MessageRecommendation';
import { replaceStringAttributes } from '../../utils/helpers';

interface Props {
  task: ITask;
}

const TRANSLATIONS = [
  { locale: 'Default', title: 'Reply Recommendation', language: 'English' },
  { locale: 'en-US', title: 'Reply Recommendation', language: 'English' },
  { locale: 'pt-BR', title: 'Recomendação de Resposta', language: 'Portuguese (Brazil)' },
  { locale: 'es-MX', title: 'Recomendación de Respuesta', language: 'Spanish (Mexico)' },
  { locale: 'zh-Hans', title: '回复建议', language: 'Chinese' },
  { locale: 'th', title: 'คำแนะนำในการตอบกลับ', language: 'Thai' },
  { locale: 'es-ES', title: 'Recomendación de Respuesta', language: 'Spanish' },
];

const MessageRecommendationIcon = ({ task }: Props) => {
  const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
  const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);
  const popover = usePopoverState({ baseId: 'recommendation-popover' });
  const [title, setTitle] = useState<string>();
  const [recommendation, setRecommendation] = useState<string>();
  const [error, setRecommendationError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const conversationsClient = Flex.Manager.getInstance().conversationsClient;

  const currentLanguage = getUserLanguage();

  const onClickInsert = async () => {
    if (!conversationSid || !recommendation) return;
    let currentInput = inputState;
    if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
      currentInput += ' ';
    }
    currentInput += replaceStringAttributes(recommendation, task);
    await Actions.invokeAction('SetInputText', {
      body: currentInput,
      conversationSid,
      selectionStart: currentInput.length,
      selectionEnd: currentInput.length,
    });

    popover.hide();

    Actions.addListener('SendMessage', () => {
      setRecommendation(undefined);
    });
  };

  const getRecommendation = async (updatedTranscript: MessageType[]) => {
    const language: string = currentLanguage
      ? String(
          TRANSLATIONS.find((lang) =>
            lang.locale.toLocaleLowerCase().includes(String(currentLanguage).toLocaleLowerCase()),
          )?.language,
        )
      : 'English';

    try {
      const res = await MessageRecommendation.getRecommendation(language, updatedTranscript);
      setRecommendation(res);
    } catch (error: any) {
      const err = error.message;
      if (err.status === 429) {
        setRecommendationError(true);
      }
    }
  };

  const setAgentOrCustomer = (author: string) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (author.startsWith('+') || uuidRegex.test(author) || author.startsWith('whatsapp')) {
      return 'customer';
    }

    return author.startsWith('CH') ? 'virtual assistant' : 'agent';
  };

  const formatMessages = (messages: any[]) => {
    const formattedMessages: MessageType[] = [];

    for (let index = 0; index < messages.length; index++) {
      formattedMessages.push({
        author: setAgentOrCustomer(messages[index].author),
        body: messages[index].body,
        index,
      });
    }

    return formattedMessages;
  };

  const retrieveMessages = async () => {
    try {
      const conversation = await conversationsClient.getConversationBySid(task?.attributes.conversationSid);
      const messages = (await conversation.getMessages()).items;
      return formatMessages(messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      setLoading(false);
      setRecommendationError(true);
    }
    return undefined;
  };

  const getNextRec = async () => {
    if (task?.attributes.conversationSid) {
      setLoading(true);
      try {
        const formatted = await retrieveMessages();
        if (formatted) {
          await getRecommendation(formatted);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting message recommendation:', error);
        setLoading(false);
        setRecommendationError(true);
      }
    }
  };

  useEffect(() => {
    if (!task?.attributes.conversationSid) {
      return;
    }

    if (currentLanguage) {
      setTitle(
        TRANSLATIONS.find((translation) =>
          translation.locale.toLocaleLowerCase().includes(currentLanguage?.toLocaleLowerCase() as string),
        )?.title,
      );
    } else {
      setTitle('Reply Recommendation');
    }
    conversationsClient.addListener('messageAdded', getNextRec);

    getNextRec();
  }, [task?.attributes.conversationSid]);

  return (
    <PopoverContainer state={popover}>
      <PopoverButton variant="reset" element="SUGGESTIONS_ICON">
        <StarIcon decorative={false} title="Open Reply Recommendation" />
      </PopoverButton>
      <Popover aria-label="Popover">
        <Heading as="h3" variant="heading30" marginBottom="space0">
          {title}
        </Heading>
        {loading && !error && (
          <PasteFlex hAlignContent="center" marginY="space120">
            <Spinner decorative />
          </PasteFlex>
        )}
        {!loading && !error && (
          <Box marginY={'space50'}>
            <Paragraph marginBottom="space0">{recommendation}</Paragraph>
          </Box>
        )}
        {!loading && error && (
          <Box marginBottom="space50">
            <Alert variant="error">
              <Text as="p">Unable to fetch recommendation using OpenAI.</Text>
              <Text as="p">Please refresh in a few moments.</Text>
            </Alert>
          </Box>
        )}

        <ButtonGroup>
          <Button onClick={onClickInsert} variant="primary" size="small">
            Add
          </Button>
          <Button variant="secondary" size="small" onClick={async () => getNextRec()}>
            <LoadingIcon decorative={true}></LoadingIcon> Refresh
          </Button>
        </ButtonGroup>
      </Popover>
    </PopoverContainer>
  );
};

export default withTaskContext(MessageRecommendationIcon);
