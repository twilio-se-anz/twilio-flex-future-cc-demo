import { styled } from '@twilio/flex-ui';

export const ResponseEnhancerWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  button {
    background: none;
    border: none;
    cursor: pointer;
    width: 25px;
    height: 25px;
    padding: 5px;
  }
  button:hover {
    background: rgb(225, 227, 234);
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  button svg {
    fill: currentColor;
  }
`;
