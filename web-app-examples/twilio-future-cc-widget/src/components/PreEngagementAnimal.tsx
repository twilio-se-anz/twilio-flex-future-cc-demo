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

export const PreEngagementAnimal = () => {
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    const handleChoice = (item: string) => {
        dispatch(updatePreEngagementData({ animal: item }));
        dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementDestination }));
        analytics.track("Animal Preference", { animal: item });
    };

    return (
        <>
            <Header />
            <NotificationBar />
            <Box as="form" data-test="pre-engagement-chat-form" {...formStyles}>
                <Text {...titleStyles} as="h3">
                    Pick an animal
                </Text>

                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Koala")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Koala
                                    </Heading>
                                    <img width="100%" src="koala.png" alt="Koala" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Fox")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Fox
                                    </Heading>
                                    <img width="100%" src="fox.png" alt="Fox" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Owl")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Owl
                                    </Heading>
                                    <img width="100%" src="owl.png" alt="Owl" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Lion")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Lion
                                    </Heading>
                                    <img width="100%" src="lion.png" alt="Lion" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
            </Box>
        </>
    );
};
