import { getFeatureFlags } from '../../utils/configuration';
import AdaptiveCardsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  show_cards_tab = false,
  tab_order = 1,
} = (getFeatureFlags()?.features?.adaptive_cards as AdaptiveCardsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const showCardsTab = () => {
  return enabled && show_cards_tab;
};

export const tabOrder = () => {
  return tab_order;
};
