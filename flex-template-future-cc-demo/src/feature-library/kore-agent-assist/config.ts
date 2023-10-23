import { getFeatureFlags } from '../../utils/configuration';
import KoreAgentAssistConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.kore_agent_assist as KoreAgentAssistConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
