import Skeleton from "@mui/material/Skeleton";

export function UpsertFormLoader() {
    return (
        <div className="flex flex-col px-4 py-2 h-full gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <Skeleton animation="wave" width={200} height={28} />
                    <Skeleton animation="wave" width={240} height={20} />
                </div>
                <Skeleton animation="wave" width={40} height={30} />
            </div>
            <div>
                <Skeleton animation="wave" width={600} />
                <Skeleton animation="wave" width={600} />
                <Skeleton animation="wave" width={600} />
                <Skeleton animation="wave" width={600} />
                <Skeleton animation="wave" width={40} />
            </div>
        </div>
    );
}
