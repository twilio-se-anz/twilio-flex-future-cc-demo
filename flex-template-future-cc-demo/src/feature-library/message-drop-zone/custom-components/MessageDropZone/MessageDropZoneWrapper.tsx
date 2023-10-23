import React, { DragEvent, useState } from 'react';
import { withTaskContext, ITask, Actions, Icon } from '@twilio/flex-ui';
import { Box, Heading, Paragraph } from '@twilio-paste/core';
import { MMSCapableIcon } from '@twilio-paste/icons/esm/MMSCapableIcon';

type Props = { children: React.ReactNode; task: ITask };

const Wrapper = (props: Props) => {
  const { children } = props;
  const conversationSid = props.task?.attributes.conversationSid ?? props.task?.attributes.channelSid;

  const [isTarget, setIsTarget] = useState(false);

  const handleDrop = async (e: DragEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    setIsTarget(false);

    console.log('Got a drop from:', e);
    const body = e.dataTransfer.getData('text');
    if (!conversationSid || !body) return;

    // Get the adaptive card data if it exists
    const cardData = e.dataTransfer.getData('adaptive-card');

    if (cardData && cardData !== 'undefined') {
      const cardDef = JSON.parse(cardData);
      console.log('Got a drop card:', cardDef);
      await Actions.invokeAction('SendMessage', {
        body,
        conversationSid,
        messageAttributes: {
          'adaptive-card': cardDef,
        },
      });
    } else {
      await Actions.invokeAction('SendMessage', {
        body,
        conversationSid,
      });
    }
  };

  function handleDragLeave(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    console.log('No longer hovered:', e);
    setIsTarget(false);
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    console.log('Item is now on top, not dropped yet:', e);
    setIsTarget(true);
  }

  return (
    <Box onDrop={handleDrop} onDragEnter={handleDragEnter} display="flex" position={'relative'} flexGrow={1}>
      <Box
        onDragLeave={handleDragLeave}
        onDragExit={handleDragLeave}
        display={isTarget ? 'flex' : 'none'}
        flexDirection={isTarget ? 'column' : undefined}
        position={'absolute'}
        top={0}
        left={0}
        inset={'8px'}
        borderColor={'colorBorderPrimary'}
        borderWidth={'borderWidth30'}
        borderStyle={'dashed'}
        borderRadius={'borderRadius20'}
        zIndex={'zIndex50'}
        opacity={'0.9'}
        backgroundColor={'colorBackgroundBody'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          pointerEvents="none"
          flexDirection={'column'}
        >
          <MMSCapableIcon decorative={true} size="sizeIcon90" color="colorTextIcon" />
          <Heading as="h3" variant="heading30">
            Send response
          </Heading>
          <Paragraph>Drop conversation card or suggested response here</Paragraph>
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export const MessageDropZoneWrapper = withTaskContext(Wrapper);
