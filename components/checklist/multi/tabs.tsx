import { ReactElement, SetStateAction } from "react";
import { ChecklistType } from "@/interfaces/Checklist";
import { TAB_TITLES } from "./constants";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface MultiChecklistTabsProps {
    activeType: ChecklistType;
    types: ChecklistType[];
    setActiveType: (value: SetStateAction<ChecklistType>) => void;
}

export function MultiChecklistTabs(
    props: MultiChecklistTabsProps,
): ReactElement {
    const { activeType, setActiveType, types } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Tabs
            value={activeType}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            onChange={(_, value) => {
                setActiveType(value);
            }}
            orientation={matches ? "vertical" : "horizontal"}
            sx={{
                width: "100%",
                maxWidth: {
                    xs: undefined,
                    md: "200px",
                },
                borderRight: (theme) =>
                    matches ? `1px solid ${theme.palette.divider}` : undefined,
                [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { opacity: 0.3 },
                },
            }}
        >
            {types.map((type) => (
                <Tab
                    key={type}
                    value={type}
                    label={TAB_TITLES[type] || type}
                    sx={{
                        alignItems: {
                            xs: undefined,
                            md: "flex-start",
                        },
                    }}
                />
            ))}
        </Tabs>
    );
}
