import { getFeatureFlags } from '../../utils/configuration';
import VideoInviteCardConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.video_invite_card as VideoInviteCardConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
