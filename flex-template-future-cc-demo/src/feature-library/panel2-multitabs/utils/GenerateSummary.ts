import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { MessageType } from '../types/MessageType';

export interface ConversationSummaryResponse {
  success: boolean;
  summary: string;
}

class GenerateSummaryService extends ApiService {
  generate = async (language: string, messages: Array<MessageType>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        language: encodeURIComponent(language),
        messages: encodeURIComponent(JSON.stringify(messages)),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ConversationSummaryResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-summary/flex/generate-summary`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: ConversationSummaryResponse) => {
          resolve(resp.summary);
        })
        .catch((error) => {
          console.log('Error generating summary', error);
          reject(error);
        });
    });
  };
}

export default new GenerateSummaryService();
