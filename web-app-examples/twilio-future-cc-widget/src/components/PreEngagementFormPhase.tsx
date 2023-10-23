/* eslint-disable camelcase */
import { Input } from "@twilio-paste/core/input";
import { Label } from "@twilio-paste/core/label";
import { Box } from "@twilio-paste/core/box";
// import { TextArea } from "@twilio-paste/core/textarea";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@twilio-paste/core/button";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@twilio-paste/core/text";
import { Anchor, HelpText, Spinner, Stack } from "@twilio-paste/core";

import { sessionDataHandler } from "../sessionDataHandler";
import { addNotification, changeEngagementPhase, updatePreEngagementData } from "../store/actions/genericActions";
import { initSession } from "../store/actions/initActions";
import { AppState, EngagementPhase, IPInfo } from "../store/definitions";
import { Header } from "./Header";
import { notifications } from "../notifications";
import { NotificationBar } from "./NotificationBar";
import { introStyles, fieldStyles, titleStyles, formStyles } from "./styles/PreEngagementFormPhase.styles";
import { useAnalytics } from "./Analytics";

export const PreEngagementFormPhase = () => {
    const [ip_info, setIPInfo] = useState<IPInfo>();
    const [form_phone, setFormPhone] = useState<string>();
    const [isFetchingPhone, setIsFetchingPhone] = useState<boolean>(false);
    const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
    const { name, email, phone, animal, colour, destination } =
        useSelector((state: AppState) => state.session.preEngagementData) || {};
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        dispatch(changeEngagementPhase({ phase: EngagementPhase.Loading }));
        analytics.identify(email, {
            name,
            email,
            phone,
            animal,
            favourite_colour: colour,
            destination_preference: destination
        });

        analytics.track("Request Engagement", { source: "Web widget" });

        try {
            const data = await sessionDataHandler.fetchAndStoreNewSession({
                formData: {
                    friendlyName: name,
                    email,
                    phone,
                    query: `I'm at playing along!`,
                    animal,
                    colour,
                    destination,
                    ip_info
                }
            });
            dispatch(initSession({ token: data.token, conversationSid: data.conversationSid }));
        } catch (err) {
            dispatch(addNotification(notifications.failedToInitSessionNotification((err as Error).message)));
            dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementForm }));
        }
    };

    const validatePhone = async (number: string) => {
        setIsValidPhone(false);

        const url = process.env.REACT_APP_SERVER_URL;

        try {
            setIsFetchingPhone(true);
            const response = await fetch(
                `https://${url}/features/web-chat/common/number-lookup?countryCode=${
                    ip_info?.countryCode || "US"
                }&From=${encodeURIComponent(number)}`
            );
            const bodyJson = await response.json();
            const normalizedPhoneNumber = bodyJson.phoneNumber;
            if (normalizedPhoneNumber && normalizedPhoneNumber.length > 0) {
                dispatch(updatePreEngagementData({ phone: normalizedPhoneNumber }));
                setIsValidPhone(true);
            }
        } catch (error) {
            setIsValidPhone(false);
        } finally {
            setIsFetchingPhone(false);
        }
    };

    useEffect(() => {
        setFormPhone(phone);

        const getInfo = async () => {
            const resp = await fetch("https://freeipapi.com/api/json");
            const data = await resp.json();
            setIPInfo(data);
            dispatch(updatePreEngagementData({ ip_info: data }));
        };
        getInfo().catch((err) => {
            return err;
        });
    }, [dispatch, phone]);

    useEffect(() => {
        validatePhone(phone || "");
        // eslint-disable-next-line
    }, [ip_info, phone]);

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormPhone(e.target.value);
        dispatch(updatePreEngagementData({ phone: e.target.value }));
        validatePhone(e.target.value);
    };

    return (
        <>
            <Header />
            <NotificationBar />
            <Box as="form" data-test="pre-engagement-chat-form" onSubmit={handleSubmit} {...formStyles}>
                <Text {...titleStyles} as="h3">
                    Hi there!
                </Text>
                <Text {...introStyles} as="p">
                    We&#39;re here to help. Please give us some info to get started.
                </Text>
                <Box {...fieldStyles}>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        placeholder="Please enter your name"
                        name="name"
                        data-test="pre-engagement-chat-form-name-input"
                        value={name}
                        onChange={(e) => dispatch(updatePreEngagementData({ name: e.target.value }))}
                        required
                    />
                </Box>
                <Box {...fieldStyles}>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        type="email"
                        placeholder="Please enter your email address"
                        name="email"
                        data-test="pre-engagement-chat-form-email-input"
                        value={email}
                        onChange={(e) => dispatch(updatePreEngagementData({ email: e.target.value }))}
                        required
                    />
                </Box>
                <Box {...fieldStyles}>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        type="tel"
                        placeholder="Please enter your phone number"
                        name="phone"
                        onChange={handleOnChange}
                        data-test="pre-engagement-chat-form-phone-input"
                        value={form_phone}
                        required
                    />

                    <HelpText variant={isValidPhone && !isFetchingPhone ? "default" : "error"}>
                        <Stack orientation="horizontal" spacing="space10">
                            {isFetchingPhone && <Spinner decorative={true} size="sizeIcon10" title="" />}
                            {isValidPhone && !isFetchingPhone
                                ? `Using phone number ${phone}`
                                : "Enter a valid phone number"}
                        </Stack>
                    </HelpText>
                </Box>

                <Box {...fieldStyles}>
                    We will use the information you provide consistent with our{" "}
                    <Anchor href="https://www.twilio.com/legal/privacy" showExternal target="_blank">
                        Privacy Policy.
                    </Anchor>
                </Box>

                {/* <Box {...fieldStyles}>
                    <Label htmlFor="query">How can we help you?</Label>
                    <TextArea
                        placeholder="Ask a question"
                        name="query"
                        data-test="pre-engagement-chat-form-query-textarea"
                        value={query}
                        onChange={(e) => dispatch(updatePreEngagementData({ query: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        required
                    />
                </Box> */}
                <Stack orientation="horizontal" spacing="space30">
                    <Button
                        variant="primary"
                        type="submit"
                        data-test="pre-engagement-start-chat-button"
                        disabled={isFetchingPhone || !isValidPhone}
                    >
                        Start chat
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementColour }))}
                        data-test="pre-engagement-start-chat-button"
                    >
                        Start over
                    </Button>
                </Stack>
            </Box>
        </>
    );
};
