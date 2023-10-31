// import ApiService from '../../../utils/serverless/ApiService';
// import { SyncClient } from 'twilio-sync';
// import { useEffect, useRef } from 'react';
// import { TokenResponse } from '../types/Token';

// class SyncClientHelper extends ApiService {
//   private status: string = 'Connecting...';
//   private errorMessage: string = '';
//   private clientRef: React.MutableRefObject<SyncClient | undefined> = useRef();

//   constructor(private identity: string) {
//     super();
//   }

//   public getStatus() {
//     return this.status;
//   }

//   public getErrorMessage() {
//     return this.errorMessage;
//   }

//   public getClient() {
//     return this.clientRef.current;
//   }

//   public async initialize() {
//     const accessToken = await this.retrieveToken();
//     if (accessToken) {
//       this.createSyncClient(accessToken);
//     } else {
//       this.setStatus('error');
//       this.setErrorMessage('No access token found in result');
//     }
//   }

//   private setStatus(newStatus: string) {
//     this.status = newStatus;
//   }

//   private setErrorMessage(message: string) {
//     this.errorMessage = message;
//   }

//   private async retrieveToken() {
//     return new Promise<string>((resolve, reject) => {
//       this.fetchJsonWithReject<TokenResponse>(
//         `${this.serverlessProtocol}://${this.serverlessDomain}/features/realtime-voice-suggestions/flex/token`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//         },
//       )
//         .then((response) => {
//           resolve(response.token);
//         })
//         .catch((error) => {
//           console.error(`Error fetching token response\r\n`, error);
//           reject(error);
//         });
//     });
//   }

//   private createSyncClient(token: string) {
//     const newClient = new SyncClient(token, { logLevel: 'info' });

//     newClient.on('connectionStateChanged', (state) => {
//       if (state === 'connected') {
//         this.clientRef.current = newClient;
//         this.setStatus('connected');
//         this.setErrorMessage('');
//       } else {
//         this.setStatus('error');
//         this.setErrorMessage(`Error: expected connected status but got ${state}`);
//       }
//     });

//     newClient.on('tokenAboutToExpire', () => this.retrieveToken());
//     newClient.on('tokenExpired', () => this.retrieveToken());
//   }
// }

// export default function useSyncClient(identity: string) {
//   const syncClientManager = new SyncClientHelper(identity);

//   useEffect(() => {
//     syncClientManager.initialize();
//   }, [identity]);

//   return {
//     client: syncClientManager.getClient(),
//     status: syncClientManager.getStatus(),
//     errorMessage: syncClientManager.getErrorMessage(),
//   };
// }
