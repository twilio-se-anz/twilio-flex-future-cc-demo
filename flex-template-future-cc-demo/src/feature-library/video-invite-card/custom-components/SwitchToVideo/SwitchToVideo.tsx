import React, { useState } from 'react';
import { Actions, ITask, ConversationState, Notifications, styled, IconButton, templates } from '@twilio/flex-ui';

import { ChatToVideoNotification } from '../../flex-hooks/notifications/ChatToVideo';
import { StringTemplates } from '../../flex-hooks/strings/ChatToVideo';
import ChatToVideoService from '../../utils/ChatToVideoService';
import VideoInvitationCard from '../InvitationCard/InvitationCard';

interface SwitchToVideoProps {
  task: ITask;
  context?: any;
  conversation?: ConversationState.ConversationState;
}

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`;

const SwitchToVideo: React.FunctionComponent<SwitchToVideoProps> = ({ task, conversation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);

    const { taskSid } = task;

    try {
      const response = await ChatToVideoService.generateVideoCode(taskSid);

      if (!response.roomName) {
        Notifications.showNotification(ChatToVideoNotification.FailedVideoLinkNotification);
        setIsLoading(false);
        return;
      }

      const url = ChatToVideoService.generateUrl('Customer', response.roomName);
      console.log('chat-to-video-escalation: unique link created:', url);

      let invite = VideoInvitationCard;
      invite.actions[0].url = url;

      await Actions.invokeAction('SendMessage', {
        body: `You've been invited to a video room`,
        conversation,
        messageAttributes: {
          hasVideo: true,
          videoUrl: url,
          uniqueCode: response.roomName,
          'adaptive-card': invite,
        },
      });
    } catch (error) {
      console.log('chat-to-video-escalation: error creating unique video link:', error);
      Notifications.showNotification(ChatToVideoNotification.FailedVideoLinkNotification);
    }

    setIsLoading(false);
  };

  return (
    <IconContainer>
      <IconButton
        icon="Video"
        key="chat-video-transfer-button"
        disabled={isLoading}
        onClick={onClick}
        variant="secondary"
        title={templates[StringTemplates.SwitchToVideo]()}
      />
    </IconContainer>
  );
};

export default SwitchToVideo;
