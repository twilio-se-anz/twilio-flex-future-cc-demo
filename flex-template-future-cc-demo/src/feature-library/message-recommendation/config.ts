import { getFeatureFlags } from '../../utils/configuration';
import MessageRecommendationConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.message_recommendation as MessageRecommendationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
