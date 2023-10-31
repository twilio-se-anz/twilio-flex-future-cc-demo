import { getFeatureFlags } from '../../utils/configuration';
import RealtimeVoiceSuggestionsConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.realtime_voice_suggestions as RealtimeVoiceSuggestionsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
