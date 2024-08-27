import { getFeatureFlags } from '../../utils/configuration';
import WebrtcSupportConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.webrtc_support as WebrtcSupportConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
