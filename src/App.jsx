import { lazy, Suspense, useEffect } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Instagram, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import NotFoundPage from "./NotFoundPage.jsx";

const HomePage = lazy(() => import("./HomePage.jsx"));
const ShopPage = lazy(() => import("./ShopPage.jsx"));
const AdminPage = lazy(() => import("./AdminPage.jsx"));
const PHONE = "351961662065";

function PageLoading() {
  return <div className="page-loading" role="status"><img src="/fjpm-logo.svg" alt="" /><span>A preparar a tua visita…</span></div>;
}

function Header() {
  const { pathname } = useLocation();
  return (
    <>
      <div className="topbar">
        <div className="wrap topbar__inner">
          <span className="topbar__status">Atendimento personalizado</span>
          <div className="topbar__right">
            <a href={`tel:+${PHONE}`}><Phone size={12} /> 961 662 065</a>
            <a className="topbar__social" href="https://www.instagram.com/fjpmpecasauto/" target="_blank" rel="noreferrer"><Instagram size={12} /> Instagram</a>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="wrap header__inner">
          <Link className="brand" to="/" aria-label="FJPM Peças Auto — início"><img src="/fjpm-logo.svg" alt="FJPM Peças Auto" /></Link>
          <nav className="nav" aria-label="Navegação principal">
            <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>Início</Link>
            <Link className="nav__shop" to="/loja" aria-current={pathname === "/loja" ? "page" : undefined}>Loja</Link>
          </nav>
          <div className="header__actions">
            <a className="button button--small" href={`https://wa.me/${PHONE}`} target="_blank" rel="noreferrer">Pedir uma peça <span>↗</span></a>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__main">
          <div className="footer__brand">
            <Link to="/"><img src="/fjpm-logo.svg" alt="FJPM Peças Auto" /></Link>
            <p>Peças auto, atendimento próximo e ajuda para encontrares a solução certa para o teu automóvel.</p>
          </div>
          <div><h3>Explorar</h3><div className="footer__links"><Link to="/loja">Loja online</Link><a href="https://www.instagram.com/fjpmpecasauto/" target="_blank" rel="noreferrer">Instagram</a></div></div>
          <div><h3>Contactos</h3><div className="footer__links"><a href={`tel:+${PHONE}`}>961 662 065</a><a href={`https://wa.me/${PHONE}`} target="_blank" rel="noreferrer">WhatsApp</a><span>FJPM Peças Auto</span></div></div>
        </div>
        <div className="footer__bottom"><span>© {new Date().getFullYear()} FJPM Peças Auto. Todos os direitos reservados.</span><span>Peças certas. Sem complicações.</span></div>
      </div>
    </footer>
  );
}

function StoreLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === "Digit6") {
        event.preventDefault();
        navigate("/admin", { state: { adminAccess: "shortcut" } });
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [navigate]);

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
    }
  }, [location.pathname, location.hash, reduceMotion]);

  return (
    <>
      <Header />
      <motion.main key={location.pathname} className="route-content" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .42, ease: [.22, 1, .36, 1] }}>
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageLoading />}><HomePage /></Suspense>} />
          <Route path="/loja" element={<Suspense fallback={<PageLoading />}><ShopPage /></Suspense>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.main>
      <Footer />
      <motion.a className="whatsapp-float" href={`https://wa.me/${PHONE}`} target="_blank" rel="noreferrer" aria-label="Falar com a FJPM no WhatsApp" whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: .94 }}>
        <Phone size={21} />
      </motion.a>
    </>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const pageMeta = {
      "/": ["FJPM Peças Auto | Peças certas. Sem complicações.", "FJPM Peças Auto: peças para automóveis, atendimento próximo e ajuda para encontrar a referência certa. Consulte o catálogo e fale connosco."],
      "/loja": ["Loja de Peças Auto | FJPM", "Consulta as peças auto disponíveis na loja FJPM. Pesquisa por categoria e fala connosco para esclarecer dúvidas ou fazer uma proposta."],
      "/admin": ["Administração | FJPM Peças Auto", "Gestão do catálogo da FJPM Peças Auto."],
    };
    const [title, description] = location.pathname === "/admin" && location.state?.adminAccess !== "shortcut"
      ? ["404 | FJPM Peças Auto", "Esta página não existe. Volta ao início ou consulta a loja FJPM Peças Auto."]
      : pageMeta[location.pathname] ?? ["Página não encontrada | FJPM", "A página pedida não foi encontrada."];
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = description;
  }, [location.pathname]);

  if (location.pathname === "/admin") {
    return location.state?.adminAccess === "shortcut" ? <Suspense fallback={<PageLoading />}><AdminPage /></Suspense> : <NotFoundPage />;
  }
  if (location.pathname !== "/" && location.pathname !== "/loja") return <NotFoundPage />;
  return (
    <StoreLayout />
  );
}
