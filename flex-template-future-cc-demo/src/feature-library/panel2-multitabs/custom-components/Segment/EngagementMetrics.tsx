import React, { useEffect, useState } from 'react';
import { Box, Stack, SkeletonLoader } from '@twilio-paste/core';
import Typography from '@material-ui/core/Typography';
import { SegmentTraits } from '../../types/Segment/SegmentTraits';
import Progress from './Progress';

type EngagementMetricsProps = {
  traits: SegmentTraits;
  loading: boolean;
};

const EngagementMetrics = ({ traits, loading }: EngagementMetricsProps) => {
  const [digitalEngagementRating, setDigitalEngagementRating] = useState(0.75);
  const [marketingEngagementRating, setMarketingEngagementRating] = useState(0.3);

  useEffect(() => {
    if (traits && Object.hasOwn(traits, 'digital_engagement_score'))
      setDigitalEngagementRating(traits.digital_engagement_score as number);
    if (traits && Object.hasOwn(traits, 'marketing_engagement_score'))
      setMarketingEngagementRating(traits.marketing_engagement_score as number);
  }, [traits]);

  if (loading)
    return (
      <Stack orientation={'vertical'} spacing={'space70'}>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </Stack>
    );

  return (
    <>
      <Box>
        <Typography component="legend">Digital Engagment</Typography>
        <Progress value={digitalEngagementRating * 100} />
      </Box>
      <Box>
        <Typography component="legend">Marketing Engagment</Typography>
        <Progress value={marketingEngagementRating * 100} />
      </Box>
    </>
  );
};

export default EngagementMetrics;
