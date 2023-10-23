import { BoxStyleProps } from "@twilio-paste/core/box";

export const outerContainerStyles: BoxStyleProps = {
    position: "fixed",
    /*
     * bottom: "space50",
     * right: "space60",
     */
    bottom: "space0",
    right: "space0",
    // marginBottom: "spaceNegative50",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    height: "100%"
};

export const innerContainerStyles: BoxStyleProps = {
    boxShadow: "shadow",
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100%",
    marginBottom: "space0",
    borderRadius: "borderRadius10",
    /*
     * marginBottom: "space50",
     * borderRadius: "borderRadius30",
     */
    backgroundColor: "colorBackgroundBody"
};
