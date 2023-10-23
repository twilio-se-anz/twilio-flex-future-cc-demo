import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { MessageType } from '../types/MessageType';

export interface MessageRecommendationResponse {
  success: boolean;
  messageRecommendation: string;
}

class MessageRecommendationService extends ApiService {
  getRecommendation = async (language: string, messages: Array<MessageType>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        language: encodeURIComponent(language),
        messages: encodeURIComponent(JSON.stringify(messages)),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<MessageRecommendationResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/message-recommendations/flex/message-recommendation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: MessageRecommendationResponse) => {
          resolve(resp.messageRecommendation);
        })
        .catch((error) => {
          console.log('Error generating message recommendation', error);
          reject(error);
        });
    });
  };
}

export default new MessageRecommendationService();
