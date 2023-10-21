const VideoInvitationCard = {
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  type: 'AdaptiveCard',
  version: '1.6',
  fallbackText: "Opps, if you can't see this, ask the operate to send you a video link instead",
  body: [
    {
      type: 'TextBlock',
      text: 'Join Video Room',
      wrap: true,
      style: 'heading',
    },
    {
      type: 'TextBlock',
      text: 'No download required, click the join room button below to start a video session. You will be prompted to allow your camera and microphone',
      wrap: true,
    },
    {
      type: 'Image',
      url: 'https://www.twilio.com/content/dam/twilio-com/global/en/products/video/overview/illo-video-capabilities-quality.png/_jcr_content/renditions/compressed-original.webp',
      horizontalAlignment: 'Center',
    },
  ],
  actions: [
    {
      type: 'Action.OpenUrl',
      title: 'Join Video Room',
      style: 'positive',
      url: 'flex-video-uri',
    },
  ],
};

export default VideoInvitationCard;
