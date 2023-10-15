import React from 'react';
import {
  Card,
  Heading,
  DataGrid,
  DataGridHead,
  DataGridRow,
  DataGridHeader,
  DataGridBody,
  DataGridCell,
  Separator,
  Table,
  THead,
  Tr,
  TBody,
  Th,
  Td,
  Text,
  Box,
  Button,
  Paragraph,
  Stack,
} from '@twilio-paste/core';

import { ProductHomeIcon } from '@twilio-paste/icons/esm/ProductHomeIcon';
import { BusinessIcon } from '@twilio-paste/icons/esm/BusinessIcon';
import { CalendarIcon } from '@twilio-paste/icons/esm/CalendarIcon';
import { CommunityIcon } from '@twilio-paste/icons/esm/CommunityIcon';
import { Notifications } from '@twilio/flex-ui';

import { Panel2MultiTabsNotifications } from '../../flex-hooks/notifications';

interface IHotelBooking {
  date: string;
  type: string;
  description: string;
  duration: string;
  earnings: string;
}

const FauxHotelBookings = () => {
  const onClick = async () => {
    Notifications.showNotification(Panel2MultiTabsNotifications.ExtendCheckOutSuccess);
  };
  const fauxHotelBookings: Array<IHotelBooking> = [
    {
      date: '09/27/2023',
      type: 'Hotel Stay',
      description: 'Altira - Macau',
      duration: '09/27/2023 - 09/29/2023',
      earnings: '+6,453 Points',
    },
    {
      date: '08/14/2023',
      type: 'Hotel Stay',
      description: 'Altira - Macau',
      duration: '08/14/2023 - 08/17/2023',
      earnings: '+7,762 Points',
    },
    {
      date: '07/19/2023',
      type: 'Hotel Stay',
      description: 'City of Dreams',
      duration: '07/19/2023 - 07/21/2023',
      earnings: '+8,518 Points',
    },
  ];
  return (
    <Card padding="space70">
      <Heading as={'h2'} variant={'heading40'}>
        Current Stay
      </Heading>
      <Table>
        <THead>
          <Tr>
            <Th>Altira - Macau</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td>
              <Text as="span" display={'flex'}>
                <CommunityIcon decorative={true} about="Age Group" />
                <Box marginLeft="space40">2 Pax</Box>
              </Text>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <Text as="span" display={'flex'}>
                <BusinessIcon decorative={true} about="Location" />
                <Box marginLeft="space40">Macau</Box>
              </Text>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <Text as="span" display={'flex'}>
                <CalendarIcon decorative={true} about="Check Out Date" />
                <Box marginLeft="space40">14/10/2023 (2 Nights)</Box>
              </Text>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <Text as="span" display={'flex'}>
                <ProductHomeIcon decorative={true} about="Room" />
                <Box marginLeft="space40">1717</Box>
              </Text>
            </Td>
          </Tr>
        </TBody>
      </Table>
      <Separator orientation="horizontal" verticalSpacing="space50" />
      <Stack orientation="vertical" spacing="space40">
        <Card padding="space120">
          <Heading as="h2" variant="heading20">
            Extend Check-out Time
          </Heading>
          <Paragraph>Pre-Approved: 4PM</Paragraph>
          <Button variant="primary" onClick={onClick}>
            Extend Checkout
          </Button>
        </Card>
      </Stack>
      <Separator orientation="horizontal" verticalSpacing="space50" />
      <Heading as={'h2'} variant={'heading40'}>
        Past Stays
      </Heading>
      <DataGrid aria-label="User information table" striped>
        <DataGridHead>
          <DataGridRow>
            <DataGridHeader>Date</DataGridHeader>
            <DataGridHeader>Type</DataGridHeader>
            <DataGridHeader>Description</DataGridHeader>
            <DataGridHeader>Earnings</DataGridHeader>
          </DataGridRow>
        </DataGridHead>
        <DataGridBody>
          {fauxHotelBookings?.map((booking: IHotelBooking, rowIndex: number) => (
            <DataGridRow key={'row-' + rowIndex}>
              <DataGridCell key={'cell-' + rowIndex + '-date'}>{booking.date}</DataGridCell>
              <DataGridCell key={'cell-' + rowIndex + '-type'}>{booking.type}</DataGridCell>
              <DataGridCell key={'cell-' + rowIndex + '-description'}>
                {booking.description}
                <br />
                {booking.duration}
              </DataGridCell>
              <DataGridCell key={'cell-' + rowIndex + '-earnings'}>{booking.earnings}</DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGrid>
    </Card>
  );
};

export default FauxHotelBookings;
