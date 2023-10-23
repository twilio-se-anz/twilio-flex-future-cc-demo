import React from 'react';
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
  Heading,
  Avatar,
  MediaBody,
  MediaFigure,
  MediaObject,
  Stack,
  Separator,
  Badge,
} from '@twilio-paste/core';

import { ThumbsUpIcon } from '@twilio-paste/icons/esm/ThumbsUpIcon';
import { BusinessIcon } from '@twilio-paste/icons/esm/BusinessIcon';
import { CommunityIcon } from '@twilio-paste/icons/esm/CommunityIcon';
import { StarIcon } from '@twilio-paste/icons/esm/StarIcon';

const FauxCustomerInfo = () => {
  return (
    <Card>
      <Stack orientation={'vertical'} spacing={'space40'}>
        <MediaObject as="div" verticalAlign="center">
          <MediaFigure as="div" spacing="space40">
            <Avatar size="sizeIcon90" name="John Tan" src="https://i.pravatar.cc/300?img=62" />
          </MediaFigure>
          <MediaBody as="div">
            <Text as="h2" variant="heading50" fontSize={'fontSize60'} fontWeight="fontWeightBold">
              John Tan
            </Text>
          </MediaBody>
        </MediaObject>

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
                  <CommunityIcon decorative={true} about="Age Group" />
                  <Box marginLeft="space40">30-40</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <BusinessIcon decorative={true} about="Location" />
                  <Box marginLeft="space40">Singapore</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <StarIcon decorative={true} about="Segment" />
                  <Box marginLeft="space40">High Net Wealth</Box>
                </Text>
              </Td>
            </Tr>

            <Tr>
              <Td>
                <Text as="span" display={'flex'}>
                  <ThumbsUpIcon decorative={true} about="Technology Profile" />
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

export default FauxCustomerInfo;
