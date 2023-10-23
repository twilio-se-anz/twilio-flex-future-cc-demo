import { Column, Grid, Heading } from "@twilio-paste/core";
import { Box } from "@twilio-paste/core/box";
import { useDispatch } from "react-redux";
import { Text } from "@twilio-paste/core/text";

import { changeEngagementPhase, updatePreEngagementData } from "../store/actions/genericActions";
import { EngagementPhase } from "../store/definitions";
import { Header } from "./Header";
import { NotificationBar } from "./NotificationBar";
import { titleStyles, formStyles, cardStyles } from "./styles/PreEngagementColour.styles";
import { useAnalytics } from "./Analytics";

export const PreEngagementColour = () => {
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    const handleChoice = (item: string) => {
        dispatch(updatePreEngagementData({ colour: item }));
        dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementAnimal }));
        analytics.track("Colour Preference", { colour: item });
    };

    return (
        <>
            <Header />
            <NotificationBar />
            <Box as="form" data-test="pre-engagement-chat-form" {...formStyles}>
                <Text {...titleStyles} as="h3">
                    Pick a colour
                </Text>

                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Verdigris Green")} {...cardStyles}>
                                    <Heading as="h2" variant="heading10">
                                        Verdigris Green
                                    </Heading>
                                    <img width="100%" src="Verdigris.png" alt="Colour" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Tranquil Blue")} {...cardStyles}>
                                    <Heading as="h2" variant="heading10">
                                        Tranquil Blue
                                    </Heading>
                                    <img width="100%" src="Tranquil-Blue.png" alt="Colour" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Luscious Red")} {...cardStyles}>
                                    <Heading as="h2" variant="heading10">
                                        Luscious Red
                                    </Heading>
                                    <img width="100%" src="Luscious-Red.png" alt="Colour" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Digital Lavender")} {...cardStyles}>
                                    <Heading as="h2" variant="heading10">
                                        Digital Lavender
                                    </Heading>
                                    <img width="100%" src="Digital-Lavender.png" alt="Colour" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
            </Box>
        </>
    );
};
