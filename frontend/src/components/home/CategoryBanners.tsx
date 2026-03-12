import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Unique Unsplash images for category banners (higher res for larger display)
const BANNER_IMAGES = {
  living: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1600",
  dining: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1600",
  bedroom: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=1600",
};

interface BannerData {
    category: string;
    title: string;
    tagline: string;
    href: string;
    image: string;
}

const banners: BannerData[] = [
    {
        category: "Living",
        title: "Welcoming",
        tagline: "Comfort Redefined",
        href: "/living",
        image: BANNER_IMAGES.living,
    },
    {
        category: "Dining",
        title: "Elegant",
        tagline: "Dining Essentials",
        href: "/dining",
        image: BANNER_IMAGES.dining,
    },
    {
        category: "Bedroom",
        title: "Serene",
        tagline: "Sleep Spaces",
        href: "/bedroom",
        image: BANNER_IMAGES.bedroom,
    },
];

export default function CategoryBanners() {
    const ref = useScrollReveal<HTMLElement>(0.08);
    return (
        <section ref={ref} className="animate-on-scroll w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full mx-auto max-w-[1920px] gap-16 lg:gap-24">
                {banners.map((banner, index) => {
                    // Define background colors based on category to match design
                    let bgColor = "bg-white";
                    if (banner.category === "Living") bgColor = "bg-[#d8e2c8]"; // Light green
                    if (banner.category === "Dining") bgColor = "bg-[#dbcfc4]"; // Light tan/brown
                    if (banner.category === "Bedroom") bgColor = "bg-[#e2deb8]"; // Light beige/yellow

                    const isImageFirst = index % 2 === 0;

                    return (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-stretch w-full group ${bgColor} overflow-hidden shadow-sm`}
                        >
                            {/* Text Content Block (30%) */}
                            <div
                                className={`w-full md:w-[30%] flex flex-col justify-center p-8 md:p-12 lg:p-20 ${isImageFirst ? 'order-2' : 'order-1'} md:order-none`}
                                style={{ order: isImageFirst ? 2 : 1 }}
                            >
                                <h3 className="text-[#3b2b2b] text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase mb-4">
                                    {banner.category}
                                </h3>
                                <div className="mb-6">
                                    <span className="text-[#4a3b3b] text-xl md:text-2xl font-light uppercase block leading-tight">
                                        {banner.title}
                                    </span>
                                    <span className="text-[#4a3b3b] text-xl md:text-2xl font-light uppercase block leading-tight">
                                        {banner.tagline}
                                    </span>
                                </div>
                                <p className="text-[#5c4d4d] text-sm md:text-base mb-8 max-w-[280px]">
                                    {banner.category === "Living" && "Create a living space that defines comfort and elegance."}
                                    {banner.category === "Dining" && "Set the stage for meaningful conversations and memorable meals."}
                                    {banner.category === "Bedroom" && "Transform your bedroom into a sanctuary of rest and beauty."}
                                </p>

                                <div>
                                    <Link
                                        to={banner.href}
                                        className="inline-block bg-[#D8C38B] text-white px-8 py-3.5 text-xs font-bold uppercase hover:bg-[#c2a969] transition-colors duration-300 rounded-none w-fit"
                                    >
                                        Explore Now
                                    </Link>
                                </div>
                            </div>

                            {/* Image Block (70%) — larger aspect so full images look perfect */}
                            <div className="w-full md:w-[70%] relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] min-h-[260px] md:min-h-[320px] lg:min-h-[400px] overflow-hidden" style={{ order: isImageFirst ? 1 : 2 }}>
                                <img
                                    src={banner.image}
                                    alt={`${banner.category} Collection - ${banner.title}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
