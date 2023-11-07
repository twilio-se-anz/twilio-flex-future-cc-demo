import { Flex, Box } from '@twilio-paste/core';

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

export default Progress;
