import { Column, Grid, Heading } from "@twilio-paste/core";
import { Box } from "@twilio-paste/core/box";
import { useDispatch } from "react-redux";
import { Text } from "@twilio-paste/core/text";

import { changeEngagementPhase, updatePreEngagementData } from "../store/actions/genericActions";
import { EngagementPhase } from "../store/definitions";
import { Header } from "./Header";
import { NotificationBar } from "./NotificationBar";
import { titleStyles, formStyles, cardStyles } from "./styles/PreEngagementDestination.styles";
import { useAnalytics } from "./Analytics";

export const PreEngagementDestination = () => {
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    const handleChoice = (item: string) => {
        dispatch(updatePreEngagementData({ destination: item }));
        dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementForm }));
        analytics.track("Destination Preference", { destination: item });
    };

    return (
        <>
            <Header />
            <NotificationBar />
            <Box as="form" data-test="pre-engagement-chat-form" {...formStyles}>
                <Text {...titleStyles} as="h3">
                    Pick a destination
                </Text>
                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box
                                    padding="space70"
                                    style={{ width: "100%" }}
                                    onClick={() => handleChoice("Airlie Beach Whitsundays")}
                                    {...cardStyles}
                                >
                                    <Heading as="h2" variant="heading20">
                                        Whitsundays
                                    </Heading>
                                    <img width="100%" src="destination1.jpg" alt="Airlie Beach Whitsundays" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box
                                    style={{ width: "100%" }}
                                    padding="space70"
                                    onClick={() => handleChoice("Bali")}
                                    {...cardStyles}
                                >
                                    <Heading as="h2" variant="heading20">
                                        Bali
                                    </Heading>
                                    <img width="100%" src="destination2.jpg" alt="Bali" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
                <Grid gutter="space30" vertical>
                    <Column>
                        <Grid gutter="space30" equalColumnHeights>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Phuket, Thailand")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Phuket
                                    </Heading>
                                    <img width="100%" src="destination3.jpg" alt="Phuket" />
                                </Box>
                            </Column>
                            <Column span={6}>
                                <Box padding="space70" onClick={() => handleChoice("Port Douglas")} {...cardStyles}>
                                    <Heading as="h2" variant="heading20">
                                        Port Douglas
                                    </Heading>
                                    <img width="100%" src="destination4.jpg" alt="Port Douglas" />
                                </Box>
                            </Column>
                        </Grid>
                    </Column>
                </Grid>
            </Box>
        </>
    );
};
