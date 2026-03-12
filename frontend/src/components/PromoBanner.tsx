import hero2 from "@/assets/hero-2.jpg";

const PromoBanner = () => {
  return (
    <section className="py-16 px-6">
      <div className="container">
        <div className="relative overflow-hidden rounded-sm bg-nav">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2">
              <p className="text-sm text-nav-foreground/70 font-light mb-4 tracking-widest uppercase">
                Premium Furniture, Luxury Lighting, Unique Decorations, Vintage Rugs,
                & Quality Wall Panels for Your Home or Office.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <img src={hero2} alt="Showroom" className="w-full h-64 md:h-80 object-cover" />
              <div className="absolute bottom-4 left-4 bg-primary-foreground/90 backdrop-blur-sm p-4 rounded-sm">
                <p className="font-display text-2xl italic text-foreground">Opening Soon</p>
                <p className="text-sm text-muted-foreground">Dubai & Abu Dhabi Showrooms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
