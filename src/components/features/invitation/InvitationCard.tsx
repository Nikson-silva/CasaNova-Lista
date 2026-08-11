import { Beer, Gift as GiftIcon, Waves } from "lucide-react";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Link from "next/link";

import { InvitationInfo } from "@/components/features/invitation/InvitationInfo";
import { buttonVariants } from "@/components/ui/Button";
import { FloralCornerOrnament } from "@/components/ui/FloralCornerOrnament";
import { cn } from "@/lib/utils";

const invitationSerif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const invitationScript = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
});

type InvitationCardProps = {
    className?: string;
};

function FloralDivider() {
    return (
        <div
            aria-hidden="true"
            className="mx-auto flex w-full max-w-[316px] items-center gap-4 lg:max-w-[360px]"
        >
            <span className="h-px flex-1 bg-[#B9DCEB]" />
            <svg viewBox="0 0 48 28" className="h-7 w-12" fill="none">
                <circle cx="4" cy="14" r="2" fill="#B9DCEB" />
                <circle cx="44" cy="14" r="2" fill="#B9DCEB" />
                <path d="M24 3V25" stroke="#9CCFE5" strokeWidth="1.2" />
                <ellipse cx="24" cy="7" rx="3.2" ry="6" fill="#B9DCEB" />
                <ellipse
                    cx="24"
                    cy="7"
                    rx="3.2"
                    ry="6"
                    transform="rotate(72 24 14)"
                    fill="#A9D5E8"
                />
                <ellipse
                    cx="24"
                    cy="7"
                    rx="3.2"
                    ry="6"
                    transform="rotate(144 24 14)"
                    fill="#CDE6F1"
                />
                <ellipse
                    cx="24"
                    cy="7"
                    rx="3.2"
                    ry="6"
                    transform="rotate(216 24 14)"
                    fill="#A9D5E8"
                />
                <ellipse
                    cx="24"
                    cy="7"
                    rx="3.2"
                    ry="6"
                    transform="rotate(288 24 14)"
                    fill="#CDE6F1"
                />
                <circle cx="24" cy="14" r="2.4" fill="#7EBEDB" />
            </svg>
            <span className="h-px flex-1 bg-[#B9DCEB]" />
        </div>
    );
}

export function InvitationCard({ className }: InvitationCardProps) {
    return (
        <article
            className={cn(
                invitationSerif.className,
                "relative isolate min-h-[700px] w-full max-w-[672px] overflow-hidden border border-[#B9DCEB] bg-white px-7 pb-14 pt-12 text-center text-[#263748] shadow-[0_12px_34px_rgba(38,55,72,0.10)] lg:min-h-[760px] lg:px-16 lg:pb-16 lg:pt-16",
                className,
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 border border-[#C9E3EF]"
            />
            <FloralCornerOrnament className="left-2 top-1" />
            <FloralCornerOrnament className="bottom-1 right-2 rotate-180" />

            <div className="relative z-10">
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.38em] text-[#1682C0] lg:text-xs">
                    Você está convidado
                </p>

                <h2 className="mt-5 text-[38px] font-semibold leading-none tracking-[-0.02em] lg:mt-7 lg:text-[54px]">
                    Chá de Casa Nova
                </h2>

                <div className="mt-5 lg:mt-4">
                    <FloralDivider />
                </div>

                <p
                    className={cn(
                        invitationScript.className,
                        "mt-5 text-[32px] leading-tight text-[#2188BD] lg:mt-6 lg:text-[36px]",
                    )}
                >
                    Nikson & Letícia
                </p>

                <div className="mt-5 lg:mt-6">
                    <FloralDivider />
                </div>

                <div className="mt-8 lg:mt-10">
                    <InvitationInfo />
                </div>

                <p className="mx-auto mt-9 max-w-[480px] font-sans text-[15px] leading-6 text-[#718096] lg:mt-10">
                    Com muita alegria, convidamos você para celebrar conosco este momento especial.
                    Venha fazer parte da nossa nova história!
                </p>

                <ul
                    aria-label="Informações importantes do evento"
                    className="mx-auto mt-6 grid max-w-[520px] gap-2.5 font-sans text-left"
                >
                    <li className="flex gap-3 border border-[#D9ECF5] bg-[#F7FBFD] px-4 py-3">
                        <Waves
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-[#2188BD]"
                        />
                        <p className="text-[15px] leading-5 text-[#627489]">
                            <span className="font-semibold  text-[#263748]">Piscina:</span> O local
                            possui piscina. Quem quiser aproveitar, não esqueça de levar sua roupa
                            de banho.
                        </p>
                    </li>
                    <li className="flex gap-3 border border-[#D9ECF5] bg-[#F7FBFD] px-4 py-3">
                        <Beer
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-[#2188BD]"
                        />
                        <p className="text-[15px] leading-5 text-[#627489]">
                            <span className="font-semibold text-[#263748]">Bebidas:</span> Quem
                            quiser beber no dia, lembre-se de levar sua própria bebida.
                        </p>
                    </li>
                </ul>

                <Link
                    href="/lista-presentes"
                    className={cn(
                        buttonVariants({ size: "lg" }),
                        "mt-7 w-full max-w-[280px] rounded-[4px] bg-[#88CDF6] font-sans text-sm font-semibold text-[#263748] shadow-[0_7px_18px_rgba(46,137,189,0.18)] hover:bg-[#72C4F4] focus-visible:ring-[#1682C0]/40",
                    )}
                >
                    <GiftIcon aria-hidden="true" className="size-5" />
                    Lista de presentes
                </Link>

                <p className="mt-8 font-sans text-sm text-[#55A2C9]">
                    ✦ Com carinho, Nikson & Letícia ✦
                </p>
            </div>
        </article>
    );
}
