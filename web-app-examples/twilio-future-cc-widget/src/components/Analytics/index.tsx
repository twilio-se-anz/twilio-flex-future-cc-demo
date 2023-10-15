import { AnalyticsBrowser } from "@segment/analytics-next";
import React from "react";

// eslint-disable-next-line
const AnalyticsContext = React.createContext<AnalyticsBrowser>(undefined!);

type Props = {
    writeKey: string;
    children: React.ReactNode;
};

export const AnalyticsProvider = ({ children, writeKey }: Props) => {
    const analytics = React.useMemo(() => AnalyticsBrowser.load({ writeKey }), [writeKey]);
    return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
};

// Create an analytics hook that we can use with other components.
export const useAnalytics = () => {
    const result = React.useContext(AnalyticsContext);
    if (!result) {
        throw new Error("Context used outside of its Provider!");
    }
    return result;
};
