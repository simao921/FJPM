import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const reduceMotion = useReducedMotion();
  return (
    <main className="not-found">
      <header className="not-found__header">
        <Link to="/"><img src="/fjpm-logo.svg" alt="FJPM Peças Auto" /></Link>
        <span>FJPM · Peças Auto</span>
      </header>
      <section className="not-found__content">
        <motion.div className="not-found__graphic" initial={reduceMotion ? false : { opacity: 0, scale: .86, rotate: -9 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .7 }}>
          <span className="not-found__ring not-found__ring--outer" />
          <span className="not-found__ring not-found__ring--inner" />
          <span className="not-found__code">404</span>
          <span className="not-found__bolt">✦</span>
        </motion.div>
        <motion.div className="not-found__copy" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .6 }}>
          <span className="eyebrow">Estrada sem saída</span>
          <h1>Esta página<br /><em>não existe.</em></h1>
          <p>O endereço pode estar errado ou a página já não existir. Vamos voltar ao caminho certo.</p>
          <div className="not-found__actions">
            <Link className="button" to="/"><Home size={15} /> Voltar ao início</Link>
            <Link className="button button--outline" to="/loja"><Search size={15} /> Explorar a loja <ArrowUpRight size={15} /></Link>
          </div>
          <Link className="not-found__back" to="/"><ArrowLeft size={13} /> FJPM Peças Auto</Link>
        </motion.div>
      </section>
      <footer className="not-found__footer"><span>Peças certas. Sem complicações.</span><span>© {new Date().getFullYear()} FJPM Peças Auto</span></footer>
    </main>
  );
}
