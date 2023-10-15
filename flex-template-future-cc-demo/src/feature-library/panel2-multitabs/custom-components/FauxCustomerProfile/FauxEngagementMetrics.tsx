import React, { useEffect, useState } from 'react';
import { Flex, Box, Stack, SkeletonLoader } from '@twilio-paste/core';
import Typography from '@material-ui/core/Typography';
import { withTaskContext } from '@twilio/flex-ui';

type PropsTask = {
  task?: any;
};
type Props = {
  value: number;
};

const Progress = (props: Props) => {
  return (
    <Box borderRadius="borderRadius20" width="100%" overflow="hidden">
      <Flex width="100%">
        <Flex width="100%" grow>
          <Box backgroundColor="colorBackgroundBrand" padding="space40" width={props.value + '%'}></Box>
          <Box
            backgroundColor="colorBackgroundDecorative10Weakest"
            padding="space40"
            width={100 - props.value + '%'}
          ></Box>
        </Flex>
      </Flex>
    </Box>
  );
};

const FauxEngagementMetrics = (props: PropsTask) => {
  return (
    <>
      <Box>
        <Typography component="legend">Digital Engagment</Typography>
        <Progress value={0.3 * 100} />
      </Box>
      <Box>
        <Typography component="legend">Marketing Engagment</Typography>
        <Progress value={0.8 * 100} />
      </Box>
    </>
  );
};

export default withTaskContext(FauxEngagementMetrics);
