export type TranscriptEntry = {
  actor: string;
  transcriptionText: string;
  type: string;
};

export type TranscriptListItem = {
  index: number;
  listSid: string;
  data: TranscriptEntry;
  dateCreated: string;
};
