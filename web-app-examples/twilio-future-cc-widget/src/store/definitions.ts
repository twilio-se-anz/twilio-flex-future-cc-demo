import { Client, Conversation, Participant, Message, User } from "@twilio/conversations";
import { GenericThemeShape } from "@twilio-paste/theme";
import { AlertVariants } from "@twilio-paste/alert/dist/Alert";

import { FileAttachmentConfig, TranscriptConfig } from "../definitions";

export enum EngagementPhase {
    PreEngagementDestination = "PreEngagementDestination",
    PreEngagementColour = "PreEngagementColour",
    PreEngagementAnimal = "PreEngagementAnimal",
    PreEngagementForm = "PreEngagementForm",
    MessagingCanvas = "MessagingCanvas",
    Loading = "Loading"
}

export type IPInfo = {
    ipVersion: number;
    ipAddress: string;
    latitude: number;
    longitude: number;
    countryName: string;
    countryCode: string;
    timeZone: string;
    zipCode: string;
    cityName: string;
    regionName: string;
    continent: string;
    continentCode: string;
};

export type ChatState = {
    conversationsClient?: Client;
    conversation?: Conversation;
    participants?: Participant[];
    users?: User[];
    messages?: Message[];
    attachedFiles?: File[];
    conversationState?: string;
};

export type PreEngagementData = {
    name: string;
    email: string;
    phone: string;
    query: string;
    animal: string;
    colour: string;
    destination: string;
    ip_info?: IPInfo;
};

export type SessionState = {
    currentPhase: EngagementPhase;
    expanded: boolean;
    token?: string;
    conversationSid?: string;
    conversationsClient?: Client;
    conversation?: Conversation;
    users?: User[];
    participants?: Participant[];
    messages?: Message[];
    conversationState?: "active" | "inactive" | "closed";
    preEngagementData?: PreEngagementData;
};

export type ConfigState = {
    serverUrl?: string;
    theme?: {
        isLight?: boolean;
        overrides?: Partial<GenericThemeShape>;
    };
    fileAttachment?: FileAttachmentConfig;
    transcript?: TranscriptConfig;
};

export type Notification = {
    dismissible: boolean;
    id: string;
    onDismiss?: () => void;
    message: string;
    timeout?: number;
    type: AlertVariants;
};

export type NotificationState = Notification[];

export type AppState = {
    chat: ChatState;
    config: ConfigState;
    session: SessionState;
    notifications: NotificationState;
};
