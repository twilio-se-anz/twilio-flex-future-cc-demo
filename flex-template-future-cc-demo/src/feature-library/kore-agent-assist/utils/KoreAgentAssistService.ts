import * as Flex from '@twilio/flex-ui';
import ApiService from '../../../utils/serverless/ApiService';
import { KoreTokenResponse } from '../types/KoreTokenResponse';

class KoreAgentAssistService extends ApiService {
  getToken = async (): Promise<KoreTokenResponse> => {
    return new Promise((resolve, reject) => {
      this.fetchJsonWithReject<KoreTokenResponse>(
        `${this.serverlessProtocol}://${
          this.serverlessDomain
        }/features/kore-agent-assist/get-token?Token=${
          Flex.Manager.getInstance().user.token
        }`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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
}

export default new KoreAgentAssistService();
