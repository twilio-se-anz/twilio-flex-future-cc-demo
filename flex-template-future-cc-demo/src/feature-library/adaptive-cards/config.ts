import { getFeatureFlags } from '../../utils/configuration';
import AdaptiveCardsConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.adaptive_cards as AdaptiveCardsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
