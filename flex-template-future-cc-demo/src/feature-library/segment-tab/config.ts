import { getFeatureFlags } from '../../utils/configuration';
import SegmentTabConfig from './types/ServiceConfiguration';

const { enabled = false, tab_order = 1 } =
  (getFeatureFlags()?.features?.segment_tab as SegmentTabConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const tabOrder = () => {
  return tab_order;
};
