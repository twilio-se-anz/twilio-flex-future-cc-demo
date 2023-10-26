import { Card, SkeletonLoader, Heading, Paragraph, Stack, Badge } from '@twilio-paste/core';
import { useEffect, useState } from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import { AiSuggestion, TranscriptTurn } from '../types/VoiceAssistTypes';
import VoiceSuggestionsService from '../services/VoiceSuggestionsService';
import SuggestionCard from './SuggestionCard';

export interface AiSuggestionProps {
  transcript: TranscriptTurn[];
}

const VoiceAssist: React.FC<AiSuggestionProps> = (props: AiSuggestionProps) => {
  const [blocking, setBlocking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>();

  useEffect(() => {
    setBlocking(true);
    const timer = setTimeout(() => setBlocking(false), 5000);
    return () => clearTimeout(timer);
  }, [suggestions]);

  useEffect(() => {
    if (blocking) {
      console.log('Blocking new requests for AI suggestions');
      return;
    }

    if (props.transcript && props.transcript.length <= 0) {
      console.log('Not enough transcript turns');
      return;
    }

    console.log('Getting AI suggestion');
    setLoading(true);
    VoiceSuggestionsService.getSuggestions('en', props.transcript)
      .then((ai_suggestion) => {
        if (ai_suggestion.success == true) setSuggestions(ai_suggestion.suggestions);
      })
      .catch((err) => console.warn('Error getting voice AI suggestion', err))
      .finally(() => setLoading(false));
  }, [props.transcript]);

  if (!suggestions || Object.hasOwn(suggestions, 'map')) return <></>;

  return (
    <Stack orientation={'vertical'} spacing={'space20'}>
      <Stack orientation={'horizontal'} spacing={'space20'}>
        {loading && (
          <Badge as="span" variant={'new'}>
            Fetching AI Suggestions...
          </Badge>
        )}
        {blocking && (
          <Badge as="span" variant={blocking ? 'warning' : 'success'}>
            {blocking ? 'Waiting...' : 'Ready'}
          </Badge>
        )}
      </Stack>
      {suggestions === null || (Object.hasOwn(suggestions, 'map') && <></>)}
      {suggestions.map((item: AiSuggestion, idx: number) => (
        <SuggestionCard suggestion={item} />
      ))}
    </Stack>
  );
};

export default withTaskContext(VoiceAssist);
