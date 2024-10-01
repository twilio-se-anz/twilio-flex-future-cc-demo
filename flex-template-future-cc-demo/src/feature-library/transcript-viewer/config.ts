import { getFeatureFlags } from '../../utils/configuration';
import TranscriptViewerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.transcript_viewer as TranscriptViewerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
