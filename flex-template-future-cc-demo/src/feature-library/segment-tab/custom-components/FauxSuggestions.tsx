import React from 'react';
import { Box, Text, Table, TBody, Td, Th, THead, Tr, Anchor } from '@twilio-paste/core';

import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';

const FauxSuggestions = () => {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Suggested Actions</Th>
        </Tr>
      </THead>
      <TBody>
        <Tr>
          <Td>
            <Text as="span" display={'flex'}>
              <InformationIcon decorative={true} about="Channel" />
              <Box marginLeft="space40">
                <Anchor href="https://www.twilio.com/pay" target="_blank" showExternal>
                  Setting up direct debits
                </Anchor>
              </Box>
            </Text>
          </Td>
        </Tr>

        <Tr>
          <Td>
            <Text as="span" display={'flex'}>
              <InformationIcon decorative={true} about="Channel" />
              <Box marginLeft="space40">
                <Anchor href="https://www.twilio.com/pay" target="_blank" showExternal>
                  Making secure online payments
                </Anchor>
              </Box>
            </Text>
          </Td>
        </Tr>

        <Tr>
          <Td>
            <Text as="span" display={'flex'}>
              <InformationIcon decorative={true} about="Channel" />
              <Box marginLeft="space40">
                <Anchor
                  href="https://www.twilio.com/use-cases/commerce-communications/account-notifications"
                  showExternal
                  target="_blank"
                >
                  Configuring Account Notifications
                </Anchor>
              </Box>
            </Text>
          </Td>
        </Tr>

        <Tr>
          <Td>
            <Text as="span" display={'flex'}>
              <InformationIcon decorative={true} about="Channel" />
              <Box marginLeft="space40">
                <Anchor href="https://twilio.com/signal" target="_blank" showExternal>
                  Discounts for conference attendees
                </Anchor>
              </Box>
            </Text>
          </Td>
        </Tr>
      </TBody>
    </Table>
  );
};

export default FauxSuggestions;
