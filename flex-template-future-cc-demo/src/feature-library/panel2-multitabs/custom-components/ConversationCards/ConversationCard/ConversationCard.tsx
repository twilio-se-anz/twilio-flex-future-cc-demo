import React from 'react';
import { ITask, withTaskContext } from '@twilio/flex-ui';
import { replaceStringAttributes } from '../../../utils/ConversationCards/helpers';
import { Card, Heading, Paragraph } from '@twilio-paste/core';

interface ConversationCardProps {
  label: string;
  text: string;
  data: any;
  task: ITask;
}

const ConversationCard: React.FunctionComponent<ConversationCardProps> = ({ label, text, task, data }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const parsedText = replaceStringAttributes(text, task);

  const onDragStart = (e: any) => {
    setIsDragging(true);
    console.log("i'm getting dragged", e);
    e.dataTransfer?.clearData();
    e.dataTransfer?.setData('text/plain', parsedText);
    e.dataTransfer?.setData('adaptive-card', JSON.stringify(data));
  };

  const onDragEnd = (e: any) => {
    setIsDragging(false);
    console.log('dragging ended', e);
  };

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      element={isDragging ? 'CONVERSATION_CARD_DRAGGING' : 'CONVERSATION_CARD'}
    >
      <Heading as="h2" variant="heading40">
        {label}
      </Heading>
      <Paragraph>{text}</Paragraph>
    </Card>
  );
};

export default withTaskContext(ConversationCard);
