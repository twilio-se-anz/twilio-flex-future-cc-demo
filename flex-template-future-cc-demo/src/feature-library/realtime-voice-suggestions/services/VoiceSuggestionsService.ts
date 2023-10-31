import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { AiSuggestion, TranscriptTurn } from '../types/VoiceAssistTypes';

export interface VoiceSuggestionsResponse {
  success: boolean;
  suggestions: AiSuggestion[];
}

class VoiceSuggestionsService extends ApiService {
  getSuggestions = async (language: string, transcript: Array<TranscriptTurn>): Promise<VoiceSuggestionsResponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        language: encodeURIComponent(language),
        transcript: encodeURIComponent(JSON.stringify(transcript)),
        Token: encodeURIComponent(this.manager.user.token),
      };

      // `${this.serverlessProtocol}://${this.serverlessDomain}/features/realtime-voice-suggestions/flex/ai-suggestion`,
      this.fetchJsonWithReject<VoiceSuggestionsResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/realtime-voice-suggestions/flex/ai-suggestion`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: VoiceSuggestionsResponse) => {
          resolve(resp);
        })
        .catch((error) => {
          console.log('Error generating message recommendation', error);
          reject(error);
        });
    });
  };
}

export default new VoiceSuggestionsService();
