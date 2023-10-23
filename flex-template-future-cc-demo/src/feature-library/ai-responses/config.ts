import { getFeatureFlags } from '../../utils/configuration';
import AiResponsesConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.ai_responses as AiResponsesConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
