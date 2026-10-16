import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, getProducts } from "./productStore.js";
import { useProductImage } from "./useProductImage.js";

function ProductCard({ product, index, onDetails }) {
  const image = useProductImage(product.imageUrl);
  const reduceMotion = useReducedMotion();
  const price = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(product.price);
  return (
    <motion.article className="product-card" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .4, delay: Math.min(index * .055, .3) }} layout>
      <button className="product-card__open" type="button" onClick={() => onDetails(product)} aria-label={`Ver ${product.name}`}>
        <div className="product-card__image">{image ? <img src={image} alt={product.name} loading="lazy" /> : <span className="product-card__placeholder">FJPM</span>}<span className="product-card__badge">{product.condition}</span><span className="product-card__image-arrow"><ArrowUpRight size={18} /></span></div>
        <div className="product-card__body">
          <div className="product-card__meta"><span>{product.category}</span><span>{product.reference ? `Ref. ${product.reference}` : ""}</span></div>
          <h2>{product.name}</h2>
          <p className="product-card__description">{product.description}</p>
          <div className="product-card__bottom"><span className="product-price">{price}{product.negotiable && <small>Aceita propostas</small>}</span><span className="product-card__link">Detalhes <ArrowUpRight size={14} /></span></div>
        </div>
      </button>
    </motion.article>
  );
}

function ProductDialog({ product, onClose }) {
  const image = useProductImage(product?.imageUrl);
  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);
  if (!product) return null;
  const message = `Olá, tenho interesse em ${product.name}${product.reference ? ` (ref. ${product.reference})` : ""}.`;
  return (
    <motion.div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-name" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ duration: .28 }}>
        <div className="product-dialog__inner">
          <div className="product-dialog__visual">{image ? <img src={image} alt={product.name} /> : <span className="product-card__placeholder">FJPM</span>}</div>
          <div className="product-dialog__copy">
            <button className="product-dialog__close" type="button" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
            <span className="eyebrow">{product.category} · {product.condition}</span>
            <h2 id="dialog-name">{product.name}</h2>
            {product.reference && <p className="dialog-reference">Referência: {product.reference}</p>}
            <p>{product.description}</p>
            <span className="product-dialog__price">{new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(product.price)}</span>
            {product.negotiable && <span className="dialog-negotiable">Este produto aceita propostas.</span>}
            <a className="button" href={`https://wa.me/351961662065?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Consultar no WhatsApp <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [params, setParams] = useSearchParams();
  const [activeProduct, setActiveProduct] = useState(null);
  const [loadError, setLoadError] = useState("");
  const category = CATEGORIES.includes(params.get("categoria")) ? params.get("categoria") : "";
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!activeProduct) return undefined;
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.content ?? "";
    document.title = activeProduct.seoTitle || activeProduct.name;
    if (descriptionTag) descriptionTag.content = activeProduct.seoDescription || activeProduct.description;
    return () => {
      document.title = previousTitle;
      if (descriptionTag) descriptionTag.content = previousDescription;
    };
  }, [activeProduct]);

  useEffect(() => {
    getProducts().then(setProducts).catch((error) => {
      console.error("Erro ao carregar o catálogo:", error);
      setLoadError("Não foi possível carregar o catálogo. Atualiza a página ou contacta-nos diretamente.");
    });
  }, []);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-PT");
    return products.filter((product) => {
      const text = `${product.name} ${product.description} ${product.reference ?? ""} ${product.category}`.toLocaleLowerCase("pt-PT");
      return (!normalized || text.includes(normalized)) && (!category || product.category === category);
    });
  }, [products, query, category]);

  const selectCategory = (value) => setParams(value ? { categoria: value } : {});
  const noProducts = products.length === 0 && !loadError;

  return (
    <>
      <section className="page-heading">
        <div className="wrap page-heading__inner">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <span className="eyebrow">FJPM Peças Auto</span>
            <h1>Loja de peças<br /><em>auto.</em></h1>
            <p>Pesquisa o catálogo por nome ou categoria. Queres confirmar compatibilidade ou fazer uma proposta? Fala diretamente connosco.</p>
          </motion.div>
          <motion.div className="shop-heading__mark" initial={reduceMotion ? false : { opacity: 0, rotate: -20, scale: .85 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: .8, delay: .15 }}><SlidersHorizontal size={62} strokeWidth={1} /></motion.div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap">
          <div className="shop-tools">
            <label className="shop-searchbox"><Search size={17} /><span className="sr-only">Pesquisar peças</span><input className="field-control shop-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar peça, marca ou referência…" /></label>
            <label className="sr-only" htmlFor="category-filter">Filtrar por categoria</label>
            <select className="field-control shop-select" id="category-filter" value={category} onChange={(event) => selectCategory(event.target.value)}>
              <option value="">Todas as categorias</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="catalog-label"><span>{category || "Catálogo"}</span><strong>{visibleProducts.length} {visibleProducts.length === 1 ? "peça" : "peças"}</strong></div>
          <AnimatePresence mode="popLayout">
            {visibleProducts.length > 0 && <motion.div className="product-grid" layout><AnimatePresence mode="popLayout">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onDetails={setActiveProduct} />)}</AnimatePresence></motion.div>}
          </AnimatePresence>
          {!visibleProducts.length && <motion.div className="empty-state" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="empty-state__icon"><Search size={22} /></span>
            <h2>{loadError ? "Catálogo indisponível." : noProducts ? "Estamos a preparar o catálogo." : "Não encontrámos essa peça."}</h2>
            <p>{loadError || (noProducts ? "Ainda não há peças publicadas. Contacta-nos e diz-nos o que procuras; teremos todo o gosto em ajudar." : "Experimenta outra pesquisa ou categoria. Se preferires, envia-nos os dados do teu automóvel.")}</p>
            {category || query ? <button className="button button--outline" type="button" onClick={() => { setQuery(""); selectCategory(""); }}>Limpar filtros</button> : <a className="button" href="https://wa.me/351961662065" target="_blank" rel="noreferrer">Perguntar no WhatsApp <ArrowUpRight size={15} /></a>}
          </motion.div>}
          <p className="catalog-note">Os anúncios e disponibilidade são confirmados diretamente com a FJPM Peças Auto.</p>
        </div>
      </section>
      <section className="cta-band"><div className="wrap cta-band__inner"><div><h2>Precisas de ajuda a escolher?</h2><p>Envia a marca, modelo, ano e referência da peça.</p></div><a className="button" href="https://wa.me/351961662065?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20para%20encontrar%20uma%20pe%C3%A7a." target="_blank" rel="noreferrer">Falar connosco <ArrowUpRight size={16} /></a></div></section>
      <AnimatePresence>{activeProduct && <ProductDialog product={activeProduct} onClose={() => setActiveProduct(null)} />}</AnimatePresence>
      <div className="shop-back"><Link to="/">← Voltar ao início</Link></div>
    </>
  );
}
