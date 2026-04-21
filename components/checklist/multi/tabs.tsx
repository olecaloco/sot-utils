import { ReactElement, SetStateAction } from "react";
import { Checklist } from "@/interfaces/Checklist";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface MultiChecklistTabsProps {
    activeChecklist: string;
    checklists: Checklist[];
    setActiveChecklist: (value: SetStateAction<string>) => void;
}

export function MultiChecklistTabs(
    props: MultiChecklistTabsProps,
): ReactElement {
    const { activeChecklist, setActiveChecklist, checklists } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Tabs
            value={activeChecklist}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            onChange={(_, value) => {
                setActiveChecklist(value);
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
            {checklists.map((c) => (
                <Tab
                    key={c.id}
                    value={c.id}
                    label={c.title}
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
