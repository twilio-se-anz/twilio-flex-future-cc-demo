// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  TranscriptTab = 'PSTranscriptTab',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TranscriptTab]: 'Transcript',
  },
});
