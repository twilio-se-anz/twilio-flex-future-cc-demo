import { Table, TBody, Td, Th, THead, Tr, Text } from '@twilio-paste/core';

export interface GenericDataTableProps {
  data: any;
}

export const GenericDataTable: React.FC<GenericDataTableProps> = (props: GenericDataTableProps) => {
  if (!props.data) return <Text as={'p'}>No data to display</Text>;
  return (
    <Table width={'100%'}>
      <THead>
        <Tr>
          <Th width="size20">Item</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        {props.data &&
          Object.entries(props.data).map(([key, value]) => {
            return (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>{value as string}</Td>
              </Tr>
            );
          })}
      </TBody>
    </Table>
  );
};
