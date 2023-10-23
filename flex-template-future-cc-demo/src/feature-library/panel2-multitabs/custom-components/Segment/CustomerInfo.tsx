import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  Card,
  Avatar,
  MediaBody,
  MediaFigure,
  MediaObject,
  Stack,
  SkeletonLoader,
  Separator,
  Badge,
} from '@twilio-paste/core';

import { ThumbsUpIcon } from '@twilio-paste/icons/esm/ThumbsUpIcon';
import { BusinessIcon } from '@twilio-paste/icons/esm/BusinessIcon';
import { CommunityIcon } from '@twilio-paste/icons/esm/CommunityIcon';
import { StarIcon } from '@twilio-paste/icons/esm/StarIcon';
import { SegmentTraits } from '../../types/Segment/SegmentTraits';
import { withTaskContext } from '@twilio/flex-ui';

type Props = {
  traits: SegmentTraits;
  loading: boolean;
};

const CustomerInfo = ({ traits, loading }: Props) => {
  if (loading)
    return (
      <Card>
        <Stack orientation={'vertical'} spacing={'space70'}>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </Stack>
      </Card>
    );

  return (
    <Card>
      <Stack orientation={'vertical'} spacing={'space40'}>
        {traits && traits.first_name && traits.last_name && (
          <MediaObject as="div" verticalAlign="center">
            <MediaFigure as="div" spacing="space40">
              <Avatar size="sizeIcon90" name={traits.first_name + ' ' + traits.last_name} />
            </MediaFigure>
            <MediaBody as="div">
              <Text as="h2" variant="heading50" fontSize={'fontSize60'} fontWeight="fontWeightBold">
                {traits.first_name} {traits.last_name}
              </Text>
            </MediaBody>
          </MediaObject>
        )}

        <Table>
          <THead>
            <Tr>
              <Th>Customer Information</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <StarIcon decorative={true} about="Age Group" />
                  <Box marginLeft="space40">35-45</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <ThumbsUpIcon decorative={true} about="Location" />
                  <Box marginLeft="space40">Newtown</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <BusinessIcon decorative={true} about="Segment" />
                  <Box marginLeft="space40">High Net Wealth</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <CommunityIcon decorative={true} about="Technology Profile" />
                  <Box marginLeft="space40">Digital Native</Box>
                </Text>
              </Td>
            </Tr>
          </TBody>
        </Table>

        <Separator orientation="horizontal" verticalSpacing="space50" />
        <Box display="flex" columnGap="space40" rowGap="space60" flexWrap="wrap">
          <Badge as="span" variant="error">
            Recent password reset
          </Badge>
          <Badge as="span" variant="success">
            10+ On-time payments
          </Badge>
          <Badge as="span" variant="success">
            Lifetime 12+ months
          </Badge>
          <Badge as="span" variant="success">
            Referred a friend
          </Badge>
          <Badge as="span" variant="new">
            Customer H2 Promo
          </Badge>
          <Badge as="span" variant="new">
            Customer H1 Promo
          </Badge>
        </Box>
      </Stack>
    </Card>
  );
};

export default withTaskContext(CustomerInfo);
