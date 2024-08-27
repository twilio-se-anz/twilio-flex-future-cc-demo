import { getFeatureFlags } from '../../utils/configuration';
import RealtimeVoiceSuggestionsConfig from './types/ServiceConfiguration';

const { enabled = false, legacy_mode = false } =
  (getFeatureFlags()?.features?.realtime_voice_suggestions as RealtimeVoiceSuggestionsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isLegacyModeEnabled = () => {
  return enabled && legacy_mode;
};
