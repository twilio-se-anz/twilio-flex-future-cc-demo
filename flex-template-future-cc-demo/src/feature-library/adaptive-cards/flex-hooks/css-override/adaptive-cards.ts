import * as Flex from '@twilio/flex-ui';

export const cssOverrideHook = (flex: typeof Flex, manager: Flex.Manager) => {
  return {
    RootContainer: {
      '.ac-textBlock': {
        'font-size': '1rem',
        'line-height': '1.5rem',
        margin: '0px 0px 0.75rem',
      },
      'label.ac-textBlock': {
        'line-height': 'unset',
        'font-weight': 'unset !important',
        margin: 'unset',
      },
      '.ac-pushButton': {
        padding: '0.25rem 0.5rem',
        'align-self': 'center',
        'font-weight': '600',
        'line-height': '1.25rem',
        'white-space': 'nowrap',
        'border-style': 'solid',
        'border-width': '1px',
        'border-radius': '4px',
        color: 'rgb(18, 28, 45)',
        background: 'rgb(255, 255, 255)',
        'box-shadow': 'rgb(202, 205, 216) 0px 0px 0px 1px',
        'min-width': '64px',
        width: '100%',
        'box-sizing': 'border-box',
        transition:
          'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        'font-family':
          "'Inter var experimental', 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
      },
      '.ac-pushButton.primary': {
        color: 'rgb(255, 255, 255)',
        background: 'rgb(2, 99, 224)',
        'border-color': 'rgb(2, 99, 224)',
        'background-color': 'rgb(2, 99, 224)',
      },
    },
  };
};
