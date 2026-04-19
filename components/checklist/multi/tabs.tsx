import { ReactElement, SetStateAction } from "react";
import { ChecklistType } from "@/interfaces/Checklist";
import { TAB_TITLES } from "./constants";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

interface MultiChecklistTabsProps {
    activeType: ChecklistType;
    types: ChecklistType[];
    setActiveType: (value: SetStateAction<ChecklistType>) => void;
}

export function MultiChecklistTabs(
    props: MultiChecklistTabsProps,
): ReactElement {
    const { activeType, setActiveType, types } = props;

    return (
        <MenuList className="w-full max-w-50 overflow-y-auto" sx={{ pt: 0 }}>
            {types.map((type) => (
                <MenuItem
                    selected={type === activeType}
                    key={type}
                    onClick={() => setActiveType(type)}
                    sx={{ minHeight: "auto" }}
                >
                    {TAB_TITLES[type] || type}
                </MenuItem>
            ))}
        </MenuList>
    );
}
