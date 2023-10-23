import { getFeatureFlags } from '../../utils/configuration';
import Panel2MultitabsConfig from './types/ServiceConfiguration';

const { enabled = false, useEnhancedCrmContainerTabs = false } =
  (getFeatureFlags()?.features?.panel2_multitabs as Panel2MultitabsConfig) ||
  {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const createEnhancedCrmContainerTabs = () => useEnhancedCrmContainerTabs;
