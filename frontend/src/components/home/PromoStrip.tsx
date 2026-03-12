import { useEffect, useState } from "react";
import { Users, Truck, ShieldCheck, Factory, Store } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function getTargetDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(d.getHours() + 8);
    d.setMinutes(d.getMinutes() + 11);
    return d;
}

const TARGET = getTargetDate();

function useCountdown() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0 });

    useEffect(() => {
        function tick() {
            const now = new Date();
            const diff = Math.max(0, TARGET.getTime() - now.getTime());
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ days, hrs, mins, secs });
        }
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return timeLeft;
}

const stats = [
    { icon: Users, value: "20 Lakh+", label: "Customers" },
    { icon: Truck, value: "Free", label: "Delivery" },
    { icon: ShieldCheck, value: "Best", label: "Warranty*" },
    { icon: Factory, value: "15 Lakh sq. ft.", label: "Mfg. Unit" },
];

export default function PromoStrip() {
    const { days, hrs, mins, secs } = useCountdown();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ref = useScrollReveal<HTMLElement>(0.08);

    return (
        <section ref={ref} className="animate-on-scroll w-full bg-card shadow-md py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* ── Countdown ── */}
                    <div className="flex items-center gap-5 shrink-0">
                        {/* SALE label */}
                        <div className="text-left">
                            <span className="text-2xl font-extrabold text-primary tracking-widest leading-none font-display uppercase">
                                SALE
                            </span>
                            <p className="text-[11px] text-primary font-bold mt-1 font-body tracking-wider uppercase">
                                Ends In
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="flex items-start gap-1.5">
                            {[
                                { val: pad(days), label: "Days" },
                                { val: pad(hrs), label: "Hrs" },
                                { val: pad(mins), label: "Mins" },
                                { val: pad(secs), label: "Secs" },
                            ].map(({ val, label }, i, arr) => (
                                <div key={label} className="flex items-start gap-1.5">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold tabular-nums leading-none text-foreground font-display">
                                            {val}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground mt-1 text-center font-body uppercase tracking-wide">
                                            {label}
                                        </p>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <span className="text-2xl font-bold text-primary mt-0.5 leading-none">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Vertical divider ── */}
                    <div className="hidden md:block w-px h-14 bg-border" />

                    {/* ── Store CTA ── */}
                    <a
                        href="/stores"
                        className="flex items-center gap-4 border-2 border-primary/30 bg-primary/5 px-6 py-3.5 hover:bg-primary/10 hover:border-primary transition-all duration-200 group shrink-0"
                    >
                        <Store
                            className="w-9 h-9 text-primary shrink-0"
                            strokeWidth={1.5}
                        />
                        <div className="text-left">
                            <p className="text-xs text-muted-foreground leading-snug font-body font-medium">
                                Visit Your Nearest Store &amp;
                            </p>
                            <p className="text-sm font-extrabold text-primary leading-snug tracking-wider font-body uppercase">
                                Get Extra Instant Discount
                            </p>
                        </div>
                    </a>

                    {/* ── Vertical divider ── */}
                    <div className="hidden md:block w-px h-14 bg-border" />

                    {/* ── Stats (all in one row) ── */}
                    <div className="flex items-center gap-3 sm:gap-5 flex-nowrap justify-center min-w-0">
                        {stats.map(({ icon: Icon, value, label }, i) => (
                            <div key={label} className="flex items-center gap-2 sm:gap-3 shrink-0">
                                {i > 0 && (
                                    <div className="w-px h-10 bg-border shrink-0" />
                                )}
                                {/* Icon container */}
                                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 shrink-0 rounded-sm">
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-extrabold text-foreground leading-tight font-body truncate">
                                        {value}
                                    </p>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight font-body truncate">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
