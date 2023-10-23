import React from 'react';
import { Box, Card, Column, Grid, Heading, Paragraph, Stack } from '@twilio-paste/core';

import FauxSuggestions from './FauxSuggestions';
import FauxEngagementMetrics from './FauxEngagementMetrics';
import FauxCustomerInfo from './FauxCustomerInfo';
import FauxHotelBookings from './FauxHotelBookings';

const FauxCustomerProfile = () => {
  return (
    <Box as="main" padding="space70">
      <Grid gutter="space30">
        <Column span={4}>
          <Stack orientation={'vertical'} spacing="space50">
            <FauxCustomerInfo />

            <Card padding="space70">
              <Heading as="h4" variant="heading40">
                TIP: Solve for the customer
              </Heading>
              <Paragraph>
                Rather than looking for shortcuts or handing the case off to another rep, be invested in the situation
                as the customer. Look for long-term solutions that foster customer success, not quick fixes that will
                require more attention later.
              </Paragraph>
            </Card>
          </Stack>
        </Column>

        <Column span={8}>
          <Stack orientation={'vertical'} spacing="space50">
            <FauxHotelBookings />
            <Card padding="space70">
              <Heading as={'h2'} variant={'heading40'}>
                CDP Engagement Metrics
              </Heading>
              <FauxEngagementMetrics />
            </Card>
            <Card padding="space70">
              <Heading as={'h2'} variant={'heading40'}>
                Proactive Knowledge
              </Heading>
              <FauxSuggestions />
            </Card>
          </Stack>
        </Column>
      </Grid>
    </Box>
  );
};

export default FauxCustomerProfile;
