import * as Flex from '@twilio/flex-ui';

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

export interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    serverless_functions_protocol: string;
    serverless_functions_port: string;
    serverless_functions_domain_future_cc_demo: string;
    serverless_functions_port_future_cc_demo: string;
    language: string;
    common: any;
    features: any;
  };
}
