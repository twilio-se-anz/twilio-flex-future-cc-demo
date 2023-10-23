import { getFeatureFlags } from '../../utils/configuration';
import MessageDropZoneConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.message_drop_zone as MessageDropZoneConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
