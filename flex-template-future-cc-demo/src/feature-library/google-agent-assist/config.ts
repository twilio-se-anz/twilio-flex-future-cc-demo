import { getFeatureFlags } from '../../utils/configuration';
import GoogleAgentAssistConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.google_agent_assist as GoogleAgentAssistConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
