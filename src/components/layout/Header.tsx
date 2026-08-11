import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { DesktopNavigation } from "@/components/layout/DesktopNavigation";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

function Brand() {
    return (
        <Link
            href="/"
            aria-label="Casa Nova — Nikson e Letícia"
            className="inline-flex items-center gap-2 rounded-md font-serif text-lg font-semibold tracking-[0.01em] text-[#263748] outline-none focus-visible:ring-2 focus-visible:ring-[#1682C0]/30"
        >
            <img src="/favicon.png" alt="Casa Nova" className="size-8 shrink-0" />

            <span>
                Casa Nova <span className="text-[#1682C0]">— Nikson & Letícia</span>
            </span>
        </Link>
    );
}

export function Header() {
    return (
        <header className="h-[68px] border-b border-[#D9E5EC] bg-white lg:h-16">
            <Container className="h-full">
                <div className="flex h-full items-center lg:grid lg:grid-cols-[1fr_auto_1fr]">
                    <Brand />
                    <DesktopNavigation />
                    <MobileNavigation logo={<Brand />} />
                </div>
            </Container>
        </header>
    );
}
