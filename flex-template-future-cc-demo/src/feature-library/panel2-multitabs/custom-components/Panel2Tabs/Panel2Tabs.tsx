import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@twilio-paste/core';
import { useUID } from '@twilio-paste/core/dist/uid-library';
import ConversationCardsCRM from '../ConversationCards/ConversationCardsCRM';
import SegmentView from '../Segment/SegmentView';
import FauxCustomerProfile from '../FauxCustomerProfile/FauxCustomerProfileView';

const Panel2Tabs = () => {
  const selectedId = useUID();

  return (
    <Tabs selectedId={selectedId} baseId="panel2-fitted-tabs" variant="fitted">
      <TabList aria-label="Panel 2 tabs">
        <Tab id={selectedId}>Customer Profile</Tab>
        <Tab>Application</Tab>
        <Tab>Cards</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SegmentView />
        </TabPanel>
        <TabPanel>
          <FauxCustomerProfile />
        </TabPanel>
        <TabPanel>
          <ConversationCardsCRM />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Panel2Tabs;
