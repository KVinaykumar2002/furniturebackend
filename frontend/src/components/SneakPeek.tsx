import { Plus } from "lucide-react";
// Local images removed to ensure 100% unique product images

const products = [
  { name: "MOVO SERVICE TROLLEY - JK-D208", image: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=600", price: 2035, oldPrice: 2325, save: 290, rating: 5, reviews: 3 },
  { name: "43 PIECES PASSIFOY DINING SET - PAS", image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=600", price: 1015, oldPrice: 1410, save: 395 },
  { name: "39-PIECE 6 PERSON TERRA DINNERWARE & STONEWARE SET", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600", price: 875, oldPrice: 1345, save: 470 },
  { name: "37-PIECE 6 PERSON HAVEN EBARZA DINNERWARE SET", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600", price: 755, oldPrice: 1165, save: 410 },
];

const SneakPeek = () => {
  return (
    <section className="py-20 px-6 bg-muted">
      <div className="container">
        <div className="text-center mb-4">
          <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-4">
            Featured Collections
          </p>
          <div className="flex items-center justify-center gap-10">
            <button className="font-display text-2xl md:text-4xl tracking-[0.15em] text-foreground border-b-2 border-primary pb-2 uppercase">
              Best Deals
            </button>
            <button className="font-display text-2xl md:text-4xl tracking-[0.15em] text-muted-foreground/40 pb-2 uppercase hover:text-muted-foreground/60 transition-colors">
              New Arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
          {products.map((product) => (
            <a key={product.name} href="#" className="group text-center">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1">
                  SAVE{product.save}
                </span>
                <button className="absolute bottom-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                  <Plus className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <p className="text-xs tracking-[0.1em] text-muted-foreground uppercase mb-2 line-clamp-2 leading-relaxed">
                {product.name}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-muted-foreground/50 line-through">₹{product.oldPrice?.toLocaleString('en-IN')}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block border border-muted-foreground/30 text-muted-foreground text-sm tracking-[0.15em] uppercase px-10 py-3 hover:bg-muted-foreground/5 transition-colors"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
};

export default SneakPeek;
