import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';

export interface PushSummaryResponse {
  success: boolean;
}

class PushSummaryService extends ApiService {
  push = async (userId: string, email: string, summary: string, sentiment: string, language: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        userId: encodeURIComponent(userId),
        email: encodeURIComponent(email),
        summary: encodeURIComponent(summary),
        sentiment: encodeURIComponent(sentiment),
        language: encodeURIComponent(language),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<PushSummaryResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-summary/flex/push-summary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: PushSummaryResponse) => {
          resolve(resp);
        })
        .catch((error) => {
          console.log('Error pushing summary', error);
          reject(error);
        });
    });
  };
}

export default new PushSummaryService();
