// import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
// import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
// import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { CheckboxLineIcon as SentimentNeutralIcon } from '@twilio-paste/icons/esm/CheckboxLineIcon';
import { AcceptIcon as SentimentVerySatisfiedIcon } from '@twilio-paste/icons/esm/AcceptIcon';
import { ClearIcon as SentimentVeryDissatisfiedIcon } from '@twilio-paste/icons/esm/ClearIcon';

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Column,
  Grid,
  Heading,
  Paragraph,
  Flex as PasteFlex,
  SkeletonLoader,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from '@twilio-paste/core';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';
import { LoadingIcon } from '@twilio-paste/icons/esm/LoadingIcon';
import * as Flex from '@twilio/flex-ui';
import React, { useEffect, useState } from 'react';

import { CustomerType } from '../../types/CustomerType';
import { MessageType } from '../../types/MessageType';
import GenerateSummary from '../../utils/GenerateSummary';
import PushSummary from '../../utils/PushSummary';
import SentimentAnalysis from '../../utils/SentimentAnalysis';

interface CardProps {
  task?: Flex.ITask;
  selectedTaskSid?: string;
  locale?: string;
  worker?: string;
  customer?: CustomerType;
  currentLanguage: string;
}

interface SentimentAnalysisProps {
  sentiment: string;
  translated_sentiment: string;
}

const TRANSLATIONS = [
  { locale: 'Default', title: 'Conversation Summary', language: 'English' },
  { locale: 'en-US', title: 'Conversation Summary', language: 'English' },
  { locale: 'pt-BR', title: 'Resumo da Conversa', language: 'Portuguese (Brazil)' },
  { locale: 'es-MX', title: 'Resumen de la Conversación', language: 'Spanish (Mexico)' },
  { locale: 'zh-Hans', title: '对话摘要', language: 'Chinese' },
  { locale: 'th', title: 'สรุปการสนทนา', language: 'Thai' },
  { locale: 'es-ES', title: 'Resumen de la Conversación', language: 'Spanish' },
];

const ConversationSummaryCard = (props: CardProps) => {
  const [summary, setSummary] = useState<string>();
  const [sentiment, setSentiment] = useState<SentimentAnalysisProps>();
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<boolean>(false);
  const [pushingToSegment, setPushingToSegment] = useState<boolean>(false);
  const [cardTitle, setCardTitle] = useState<string>();

  const conversationsClient = Flex.Manager.getInstance().conversationsClient;

  const fetchSummary = async (updatedTranscript: MessageType[]) => {
    const language: string = props.currentLanguage
      ? String(
          TRANSLATIONS.find((lang) =>
            lang.locale.toLocaleLowerCase().includes(String(props.currentLanguage).toLocaleLowerCase()),
          )?.language,
        )
      : 'English';

    try {
      const res = await GenerateSummary.generate(language, updatedTranscript);
      const sentimentRes = await SentimentAnalysis.generate(language, updatedTranscript);
      setSummary(res);
      setSentiment(sentimentRes);
    } catch (error: any) {
      const err = error.message;
      if (err.status === 429) {
        setSummaryError(true);
      }
    }
  };

  const generateSentimentBadge = (variant: 'success' | 'neutral' | 'error') => {
    const icon =
      variant === 'success' ? (
        <SentimentVerySatisfiedIcon decorative={true} title="Satisfied" />
      ) : variant === 'error' ? (
        <SentimentVeryDissatisfiedIcon decorative={true} title="Dissatisfied" />
      ) : (
        <SentimentNeutralIcon decorative={true} title="Neutral" />
      );

    return (
      <Badge as="span" variant={variant}>
        {icon}
        {String(sentiment?.translated_sentiment)}
      </Badge>
    );
  };

  const sentimentMap: { [key: string]: JSX.Element } = {
    positive: generateSentimentBadge('success'),
    neutral: generateSentimentBadge('neutral'),
    negative: generateSentimentBadge('error'),
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
      const conversation = await conversationsClient.getConversationBySid(props?.task?.attributes.conversationSid);
      const messages = (await conversation.getMessages()).items;
      return formatMessages(messages);
    } catch (err) {
      console.error('Error retrieving messages:', err);
      setLoadingSummary(false);
      setSummaryError(true);
    }
    return undefined;
  };

  const getNextSummary = async () => {
    if (props?.task?.attributes.conversationSid && !props?.task?.channelType?.includes('voice')) {
      setLoadingSummary(true);
      try {
        const formatted = await retrieveMessages();

        if (formatted) {
          await fetchSummary(formatted);
          setLoadingSummary(false);
        }
      } catch (error) {
        console.error('Error getting summary:', error);
        setLoadingSummary(false);
        setSummaryError(true);
      }
    }
  };

  useEffect(() => {
    if (props.currentLanguage) {
      setCardTitle(
        TRANSLATIONS.find((translation) =>
          translation.locale.toLocaleLowerCase().includes(props.currentLanguage?.toLocaleLowerCase() as string),
        )?.title,
      );
    } else {
      setCardTitle('Conversation Summary');
    }

    if (props?.task?.channelType?.includes('voice')) {
      setSummary('Unavailable for voice tasks.');
      return;
    }

    if (!props?.task?.attributes.conversationSid && !props.selectedTaskSid) {
      setSummary('No conversation found.');
      return;
    }

    console.log(`Conversation SID: ${props.task?.attributes.conversationSid}`);

    getNextSummary();
  }, [props.task?.attributes.conversationSid, props.selectedTaskSid]);

  useEffect(() => {
    const pushSummaryToSegment = async () => {
      setPushingToSegment(false);
      const newSummary = typeof summary === 'string' ? summary?.replace(/^\n+/, '') : summary;

      try {
        if (!props.customer?.id || !props.customer?.email || !newSummary) {
          throw new Error('Missing properties');
        }
        await PushSummary.push(
          props.customer?.id as string,
          props.customer?.email as string,
          newSummary as string,
          sentiment?.sentiment as string,
          props.currentLanguage,
        );
      } catch (error: any) {
        const err = error.message;
        console.error(err);
      }
    };

    if (props?.task?.status === 'wrapping') {
      setPushingToSegment(true);
      getNextSummary().then(async () => pushSummaryToSegment());
    }
  }, [props.task?.status]);

  if (!props.task) return <></>;

  return (
    <Box marginRight="space60">
      <Card padding="space70">
        <Grid vertical={[true, true, false]}>
          <Column span={[6, 6, 8]}>
            <PasteFlex vAlignContent="center" marginBottom="space30">
              <Heading as="h2" variant="heading20" marginBottom="space0">
                {cardTitle}
              </Heading>
              <Tooltip text="This information is automatically generated using AI.">
                <Box marginLeft="space30">
                  <InformationIcon decorative={false} title="Open Tooltip" display="block" />
                </Box>
              </Tooltip>
              <Box marginLeft="space30">
                <Button variant="secondary" size="small" onClick={async () => getNextSummary()}>
                  <LoadingIcon decorative={true}></LoadingIcon> Refresh
                </Button>
              </Box>
            </PasteFlex>
          </Column>
          <Column span={[6, 6, 3]} offset={1}>
            <PasteFlex vAlignContent="center" marginBottom="space30" hAlignContent="right">
              {summary && !loadingSummary && !summaryError && <>{sentimentMap[sentiment?.sentiment as string]}</>}
            </PasteFlex>
          </Column>
        </Grid>
        {summary && !loadingSummary && !summaryError && <Paragraph marginBottom="space0">{summary}</Paragraph>}
        {!summary && !loadingSummary && !summaryError && (
          <Paragraph marginBottom="space0">
            {'There is no summary available yet as the agent is about to start a conversation with the customer'}
          </Paragraph>
        )}
        {loadingSummary && !pushingToSegment && (
          <>
            <Stack orientation="vertical" spacing="space20">
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </Stack>
            <Box marginTop="space20" marginBottom="space80">
              <SkeletonLoader width="200px" />
            </Box>
          </>
        )}
        {pushingToSegment && (
          <>
            <Box display="flex" justifyContent={'center'} marginY="space40">
              <Spinner size="sizeIcon50" color="colorTextDecorative10" decorative />
            </Box>
            <Box display="flex" justifyContent={'center'}>
              <Text as="p" color="colorTextDecorative10">
                Please wait to complete the task.
              </Text>
            </Box>
            <Box display="flex" justifyContent={'center'}>
              <Text as="p" marginBottom="space0" color="colorTextDecorative10">
                We're generating the final summary.
              </Text>
            </Box>
          </>
        )}
        {!loadingSummary && summaryError && (
          <Alert variant="error">
            <Text as="p">Unable to fetch summary using OpenAI.</Text>
            <Text as="p">Please refresh in a few moments.</Text>
          </Alert>
        )}
      </Card>
    </Box>
  );
};
export default Flex.withTaskContext(React.memo(ConversationSummaryCard));
