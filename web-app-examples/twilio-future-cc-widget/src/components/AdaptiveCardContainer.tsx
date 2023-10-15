import log from "loglevel";
import React, { useEffect, useRef } from "react";
import { Alert, Box, Card } from "@twilio-paste/core";
import { Message } from "@twilio/conversations";
import * as AdaptiveCards from "adaptivecards";
import { useSelector } from "react-redux";

import { AppState } from "../store/definitions";

import "./AdaptiveCardContainer.css";

interface AdaptiveCardContainerProps {
    message: Message;
}

interface IDictionary {
    [index: string]: string;
}

type CardAction = {
    text: string;
};

const ADAPTIVE_CARD_KEY_NAME: string = "adaptive-card";

const AdaptiveCardContainer: React.FunctionComponent<AdaptiveCardContainerProps> = ({ message }) => {
    const { conversation } = useSelector((state: AppState) => ({
        conversation: state.chat.conversation
    }));

    const attributes: IDictionary = message.attributes as IDictionary;
    const mountRef = useRef<HTMLElement>(null);

    const openWindow = (url: string) => {
        if (window && window?.open) {
            const w = window.open(url, "_blank");
            if (w) w.focus();
        }
    };

    // Create the reference to the adaptive card once and maintain a reference to it
    useEffect(() => {
        if (!attributes || !attributes[ADAPTIVE_CARD_KEY_NAME]) return;

        const hostConfig: Partial<AdaptiveCards.HostConfig> = {
            supportsInteractivity: true,
            fontFamily:
                '"Inter var experimental", "Inter var", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
        };
        const adaptiveCard = new AdaptiveCards.AdaptiveCard();
        adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(hostConfig);
        adaptiveCard.parse(attributes[ADAPTIVE_CARD_KEY_NAME]);

        // Provide an onExecuteAction handler to handle the Action.Submit
        adaptiveCard.onExecuteAction = (action: AdaptiveCards.Action) => {
            if (action instanceof AdaptiveCards.SubmitAction) {
                // Send back data as text
                if (action?.data?.hasOwnProperty("text")) {
                    const { text } = action.data as CardAction;
                    if (!conversation) {
                        log.error("Failed sending message: no conversation found");
                        return;
                    }

                    let preparedMessage = conversation.prepareMessage();
                    preparedMessage = preparedMessage.setBody(text);
                    preparedMessage.build().send();
                }
            } else if (action instanceof AdaptiveCards.OpenUrlAction && action && action.url) {
                openWindow(action.url);
            }
        };

        const renderedCard = adaptiveCard.render();
        if (renderedCard && mountRef.current) mountRef.current.appendChild(renderedCard);
    }, [attributes, conversation]);

    if (!attributes || !attributes[ADAPTIVE_CARD_KEY_NAME]) {
        return (
            <Alert variant="warning">
                <strong>Message error</strong> Adaptive card data is missing for this message.
            </Alert>
        );
    }

    return (
        <Box marginTop="space20" marginBottom="space50">
            <Card padding="space20">
                <div ref={mountRef as React.RefObject<HTMLDivElement>} />
            </Card>
        </Box>
    );
};

export default AdaptiveCardContainer;
