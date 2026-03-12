import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import storeShowroom from "@/assets/our-stores-showroom.png";

export default function OurStores() {
    const ref = useScrollReveal<HTMLElement>(0.08);
    return (
        <section ref={ref} className="animate-on-scroll w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full mx-auto max-w-[1400px]">
                <div className="flex flex-col md:flex-row items-stretch w-full group bg-[#dbcfc4] overflow-hidden shadow-sm">

                    {/* Text Content Block (30%) */}
                    <div className="w-full md:w-[30%] flex flex-col justify-center p-6 md:p-8 lg:p-10 order-2 md:order-1">
                        <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] text-[#2C1F1A]/80 uppercase mb-2 md:mb-3 font-body">
                            Our Stores
                        </span>

                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest uppercase mb-3 leading-tight text-[#3b2b2b]">
                            ONE-STOP SHOP<br />
                            FOR YOUR HOME
                        </h3>

                        <p className="text-[#5c4d4d] text-xs md:text-sm mb-5 max-w-[280px] leading-relaxed">
                            Discover the epitome of elegance and sophistication at our stores.
                            Visit your nearest location today to experience our premium collections firsthand.
                        </p>

                        <div className="mb-6">
                            <Link
                                to="/stores"
                                className="inline-flex items-center justify-center gap-2 bg-[#D8C38B] text-white px-6 py-2.5 text-[11px] font-bold uppercase hover:bg-[#c2a969] transition-colors duration-300 rounded-full w-fit group"
                            >
                                Get Location
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Image Block (70%) */}
                    <div className="w-full md:w-[70%] relative aspect-[16/9] md:aspect-[2.8/1] lg:aspect-[3.2/1] overflow-hidden order-1 md:order-2">
                        <img
                            src={storeShowroom}
                            alt="Our furniture showroom — living rooms, dining sets, and displays"
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </section>
    );
}
