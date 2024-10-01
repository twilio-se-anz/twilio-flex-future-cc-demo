import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { TranscriptListItem } from '../types/TranscriptViewer';

class TranscriptService extends ApiService {
  getAPIBaseUri = () => {
    return `${this.serverlessProtocol}://${this.serverlessDomain}`;
  };

  getTranscript = async (CallSid: string): Promise<TranscriptListItem[]> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        CallSid,
        Token: encodeURIComponent(this.manager.user.token),
      };

      // `${this.serverlessProtocol}://${this.serverlessDomain}/features/realtime-voice-suggestions/flex/ai-suggestion`,
      this.fetchJsonWithReject<TranscriptListItem[]>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/transcript-viewer/flex/transcript`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: TranscriptListItem[]) => {
          resolve(resp);
        })
        .catch((error) => {
          console.log('Error generating message recommendation', error);
          reject(error);
        });
    });
  };
}

export default new TranscriptService();
