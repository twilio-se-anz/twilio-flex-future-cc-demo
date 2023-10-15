import { Box } from "@twilio-paste/core/box";
import { useSelector } from "react-redux";

import { MessagingCanvasPhase } from "./MessagingCanvasPhase";
import { AppState, EngagementPhase } from "../store/definitions";
import { PreEngagementFormPhase } from "./PreEngagementFormPhase";
import { LoadingPhase } from "./LoadingPhase";
import { innerContainerStyles, outerContainerStyles } from "./styles/RootContainer.styles";
import { PreEngagementColour } from "./PreEngagementColour";
import { PreEngagementAnimal } from "./PreEngagementAnimal";
import { PreEngagementDestination } from "./PreEngagementDestination";

const getPhaseComponent = (phase: EngagementPhase) => {
    switch (phase) {
        case EngagementPhase.Loading:
            return <LoadingPhase />;
        case EngagementPhase.MessagingCanvas:
            return <MessagingCanvasPhase />;
        case EngagementPhase.PreEngagementForm:
            return <PreEngagementFormPhase />;
        case EngagementPhase.PreEngagementColour:
            return <PreEngagementColour />;
        case EngagementPhase.PreEngagementAnimal:
            return <PreEngagementAnimal />;
        case EngagementPhase.PreEngagementDestination:
            return <PreEngagementDestination />;
        default:
            return <PreEngagementColour />;
    }
};

export function RootContainer() {
    const { currentPhase, expanded } = useSelector(({ session }: AppState) => ({
        currentPhase: session.currentPhase,
        expanded: session.expanded
    }));

    return (
        <Box>
            <Box {...outerContainerStyles}>
                {expanded && (
                    <Box data-test="root-container" {...innerContainerStyles}>
                        {getPhaseComponent(currentPhase)}
                    </Box>
                )}
                {/* <EntryPoint /> */}
            </Box>
        </Box>
    );
}
