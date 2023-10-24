import * as Flex from '@twilio/flex-ui';
import ApiService from '../../../utils/serverless/ApiService';
import { KoreTokenResponse } from '../types/KoreTokenResponse';

class KoreAgentAssistService extends ApiService {
  getToken = async (): Promise<KoreTokenResponse> => {
    return new Promise((resolve, reject) => {
      const manager = Flex.Manager.getInstance();

      const params = {
        Token: manager.user.token,
      };
      this.fetchJsonWithReject<KoreTokenResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/kore-agent-assist/get-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        }
      )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(`Error fetching Kore AI Token\r\n`, error);
          reject(error);
        });
    });
  };

  // sendMessage = async (
  //   koreToken: string,
  //   koreAgentAssistUrl: string,
  //   koreBotId: string,
  //   conversationSid: string,
  //   agentId: string
  // ): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     const manager = Flex.Manager.getInstance();

  //     const body = JSON.stringify({
  //       agentId: `${agentId}` || '1000',
  //       botId: `${process.env.botId}`,
  //       conversationId: `${conversationSid}` || '1000',
  //       query: `${query}` || 'connection',
  //     });

  //     this.fetchJsonWithReject<KoreTokenResponse>(
  //       `${koreAgentAssistUrl}/agentassist/api/v1/hooks/${koreBotId}`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json', 'token': koreToken },
  //         body: JSON.stringify(body),
  //       }
  //     )
  //       .then((response) => {
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         console.error(`Error fetching Kore AI Token\r\n`, error);
  //         reject(error);
  //       });
  //   });
  // };
}

export default new KoreAgentAssistService();
