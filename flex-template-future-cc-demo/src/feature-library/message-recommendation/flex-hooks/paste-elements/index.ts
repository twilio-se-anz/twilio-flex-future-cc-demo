import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  SUGGESTIONS_ICON: {
    backgroundColor: 'transparent',
    borderRadius: 'borderRadiusCircle',
    padding: 'space30',
    ':hover:enabled': {
      backgroundColor: 'colorBackgroundStrong',
    },
  },
} as { [key: string]: PasteCustomCSS };
