import ApiService from '../../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../../types/serverless';
import { ICard } from '../../types/ConversationCards';

export interface ConversationCardsResponse {
  data: ICard[];
}

class ConversationCardsService extends ApiService {
  cannedResponseCache: ConversationCardsResponse | null = null;

  fetchConversationCards = async (): Promise<ConversationCardsResponse> => {
    return new Promise((resolve, reject) => {
      if (this.cannedResponseCache) {
        resolve(this.cannedResponseCache);
        return;
      }

      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject<ConversationCardsResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-cards/flex/chat-responses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response) => {
          this.cannedResponseCache = response;
          resolve(response);
        })
        .catch((error) => {
          console.error(`Error fetching canned responses\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new ConversationCardsService();
