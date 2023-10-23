import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { MessageType } from '../types/MessageType';

export interface SentimentAnalysisResponse {
  success: boolean;
  analysis: string;
}

class SentimentAnalysisService extends ApiService {
  generate = async (language: string, messages: Array<MessageType>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        language: encodeURIComponent(language),
        messages: encodeURIComponent(JSON.stringify(messages)),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<SentimentAnalysisResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/sentiment-analysis/flex/sentiment-analysis`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: SentimentAnalysisResponse) => {
          resolve(resp.analysis);
        })
        .catch((error) => {
          console.log('Error generating sentiment analysis', error);
          reject(error);
        });
    });
  };
}

export default new SentimentAnalysisService();
