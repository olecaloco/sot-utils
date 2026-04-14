import { Show, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export const PortalHeader = () => {
    return (
        <header className="sticky top-0 z-10 flex text-white p-4 bg-slate-950 border-b border-gray-800">
            <div className="container flex items-center justify-between mx-auto">
                <Link href="/">
                    <Image
                        className="w-full max-w-25"
                        src="/logo.png"
                        alt="SOT Utils"
                        width={1967}
                        height={534}
                    />
                </Link>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </header>
    );
};
