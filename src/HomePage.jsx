import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, BadgeCheck, Boxes, CircleHelp, Instagram, Search, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useReveal } from "./useReveal.js";
import ScrollCarSection from "./ScrollCarSection.jsx";

const categories = [
  { name: "Motor", detail: "Componentes e acessórios", icon: "⚙", id: "Motor" },
  { name: "Travagem", detail: "Segurança em cada viagem", icon: "◉", id: "Travagem" },
  { name: "Carroçaria", detail: "Detalhes que fazem a diferença", icon: "◇", id: "Carroçaria" },
  { name: "Elétrica", detail: "Peças e componentes elétricos", icon: "ϟ", id: "Elétrica" },
];

function HeroCar() {
  return (
    <svg viewBox="0 0 620 350" role="img" aria-label="Silhueta estilizada de automóvel">
      <defs>
        <linearGradient id="body" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ecf0f7" /><stop offset=".48" stopColor="#9da9bb" /><stop offset="1" stopColor="#46546b" /></linearGradient>
        <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#364862" /><stop offset="1" stopColor="#111b2b" /></linearGradient>
        <linearGradient id="accent" x1="0" x2="1"><stop stopColor="#a90c1d" /><stop offset="1" stopColor="#ff3545" /></linearGradient>
      </defs>
      <ellipse cx="316" cy="290" rx="232" ry="16" fill="#000" opacity=".38" />
      <path d="M75 245l17-41 55-18 70-89c15-19 32-29 56-31l118-5c31-1 48 9 67 31l52 66 51 16c19 6 29 19 31 38l3 38-38 16h-34c-2-34-26-58-58-58s-56 24-59 56l-166 2c-2-34-27-58-59-57-32 1-55 26-56 60l-42-2-8-22z" fill="url(#body)" stroke="#f1f3f8" strokeWidth="2" />
      <path d="M231 106c11-14 24-21 43-23l51-3v77H173zm111-26 47-2c22-1 34 7 49 24l41 54H342z" fill="url(#glass)" stroke="#aab5c7" strokeWidth="2" />
      <path d="M78 238l24-5 15 11-8 10-31-3zm494-4 27 7v10l-25 6-12-12z" fill="url(#accent)" />
      <path d="M163 185h-21m332-15 21 5m-329 71 305 1" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3" opacity=".5" />
      <path d="M254 181h116" stroke="#e52638" strokeLinecap="round" strokeWidth="4" />
      <Wheel cx="197" cy="253" /><Wheel cx="464" cy="253" />
      <path d="M100 207c62 5 104-5 134-30 29-24 42-58 55-69M484 152l-56-69" fill="none" stroke="#fff" strokeWidth="2" opacity=".34" />
      <path d="M113 288h391" stroke="url(#accent)" strokeWidth="2" opacity=".8" />
    </svg>
  );
}

function Wheel({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="43" fill="#0b1019" stroke="#8793a6" strokeWidth="4" />
      <circle cx={cx} cy={cy} r="27" fill="#172235" stroke="#d6dbe4" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="8" fill="#e5293b" />
      <path d={`M${cx} ${cy - 25}v50m-24-25h48m-41-17 34 34m0-34-34 34`} stroke="#8d9aaf" strokeWidth="3" />
    </g>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const animation = useReveal();
  return <motion.div {...animation} transition={{ ...animation.transition, delay }} className={className}>{children}</motion.div>;
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <section className="hero">
        <div className="hero__grid" aria-hidden="true" />
        <div className="wrap hero__inner">
          <motion.div className="hero__copy" initial={reduceMotion ? false : { opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>
            <span className="eyebrow">FJPM Peças Auto</span>
            <h1 className="display">A peça certa.<br /><em>Sem rodeios.</em></h1>
            <p>Procuras uma peça para o teu carro? Diz-nos a marca, o modelo e a referência. Ajudamos-te a encontrar a solução certa.</p>
            <div className="hero__buttons">
              <Link className="button" to="/loja">Explorar a loja <ArrowUpRight size={16} /></Link>
              <a className="button button--outline" href="https://wa.me/351961662065?text=Ol%C3%A1%2C%20procuro%20uma%20pe%C3%A7a%20para%20o%20meu%20carro." target="_blank" rel="noreferrer">Falar no WhatsApp</a>
            </div>
            <div className="hero__proof"><span className="proof-icon"><BadgeCheck size={17} /></span><span><strong>Atendimento próximo</strong>Estamos aqui para ajudar a encontrar a peça.</span></div>
          </motion.div>
          <motion.div className="hero__art" initial={reduceMotion ? false : { opacity: 0, scale: .88, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .95, delay: .12, ease: [.22, 1, .36, 1] }}>
            <span className="hero__tag"><i />Peças para o teu automóvel</span>
            <span className="hero__stamp">FJPM<br /><b>✦</b><br />AUTO</span>
            <motion.div className="hero__car" animate={reduceMotion ? undefined : { y: [0, -9, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><HeroCar /></motion.div>
            <span className="hero__orbit-dot" />
          </motion.div>
        </div>
        <a className="hero__scroll" href="#categorias"><span>Descobre mais</span><ArrowDown size={14} /></a>
      </section>
      <ScrollCarSection />
      <section className="trustbar" aria-label="Vantagens">
        <div className="wrap trustbar__inner">
          <div className="trust-item"><span className="trust-item__icon"><Search /></span><div><strong>Ajuda a encontrar</strong><span>Partilha marca, modelo e referência</span></div></div>
          <div className="trust-item"><span className="trust-item__icon"><Wrench /></span><div><strong>Contacto direto</strong><span>Fala connosco pelo WhatsApp</span></div></div>
          <div className="trust-item"><span className="trust-item__icon"><Boxes /></span><div><strong>Peças anunciadas</strong><span>Consulta o catálogo online</span></div></div>
        </div>
      </section>
      <section className="section" id="categorias">
        <div className="wrap">
          <Reveal className="section-heading">
            <span className="eyebrow">Encontra o que procuras</span>
            <h2>Peças para voltar<br />a pôr-te na estrada.</h2>
            <p>Explora as principais categorias ou fala connosco para te ajudarmos a identificar a peça de que precisas.</p>
          </Reveal>
          <div className="categories">{categories.map((category, index) => (
            <Reveal key={category.id} delay={index * .08}>
              <Link className="category-card" to={`/loja?categoria=${encodeURIComponent(category.id)}`}>
                <span className="category-card__icon">{category.icon}</span>
                <span><h3>{category.name}</h3><small>{category.detail}</small></span>
                <ArrowUpRight className="category-card__arrow" size={17} />
              </Link>
            </Reveal>
          ))}</div>
        </div>
      </section>
      <section className="section section--tight" id="sobre">
        <div className="wrap about">
          <Reveal className="about__visual">
            <motion.div className="about__gear" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
              <Wrench size={104} strokeWidth={1.1} />
            </motion.div>
            <div className="about__badge"><b>FJPM</b>Peças auto com atendimento próximo.</div>
          </Reveal>
          <Reveal className="about__copy" delay={.1}>
            <span className="eyebrow">Sobre a FJPM</span>
            <h2>Mais simples.<br />Mais direto.</h2>
            <p>Na FJPM Peças Auto, queremos tornar mais fácil encontrares a peça certa. Consulta os artigos disponíveis ou envia-nos os dados do teu automóvel e ajudamos-te a procurar.</p>
            <ul className="check-list">
              <li>Pesquisa por nome, categoria ou referência</li>
              <li>Informação clara em cada anúncio</li>
              <li>Contacto direto para esclarecer dúvidas e propostas</li>
            </ul>
            <Link className="button button--outline" to="/loja">Ver catálogo <ArrowUpRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap cta-band__inner">
          <div><h2>Não encontraste a peça?</h2><p>Envia-nos a referência ou os dados do teu carro. Vamos ajudar.</p></div>
          <a className="button" href="https://wa.me/351961662065?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20para%20encontrar%20uma%20pe%C3%A7a." target="_blank" rel="noreferrer">Pedir ajuda no WhatsApp <ArrowUpRight size={16} /></a>
        </div>
      </section>
      <div className="social-follow"><Instagram size={15} /><span>Segue as novidades</span><a href="https://www.instagram.com/fjpmpecasauto/" target="_blank" rel="noreferrer">@fjpmpecasauto <ArrowUpRight size={13} /></a><CircleHelp className="social-follow__deco" size={18} /></div>
    </>
  );
}
