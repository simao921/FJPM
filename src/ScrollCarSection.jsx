import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

function WheelPart({ cx }) {
  return (
    <g>
      <circle cx={cx} cy="270" r="39" fill="#090e18" stroke="#8290a4" strokeWidth="4" />
      <circle cx={cx} cy="270" r="25" fill="#1e2a3c" stroke="#e1e5ec" strokeWidth="3" />
      <circle cx={cx} cy="270" r="7" fill="#ef2334" />
      <path d={`M${cx} 247v46m-23-23h46m-39-16 32 32m0-32-32 32`} fill="none" stroke="#96a2b5" strokeWidth="3" />
    </g>
  );
}

function EnginePart() {
  return (
    <g>
      <path d="M143 199h93l16 15-9 37h-87l-23-17z" fill="#27364a" stroke="#c7d0de" strokeWidth="2" />
      <path d="M162 208v31m19-32v32m20-32v32m19-31v30" stroke="#8492a7" strokeWidth="5" />
      <path d="M146 221h91" stroke="#ef2334" strokeWidth="4" />
    </g>
  );
}

export default function ScrollCarSection() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 115, damping: 25, mass: .25 });

  const bonnet = useTransform(progress, [0, .28, .6, 1], [0, -12, -52, -100]);
  const windscreen = useTransform(progress, [0, .2, .58, 1], [0, -8, -42, -86]);
  const frontBumper = useTransform(progress, [0, .18, .52, 1], [0, -10, -48, -94]);
  const rearBumper = useTransform(progress, [0, .2, .56, 1], [0, 8, 48, 100]);
  const frontWheel = useTransform(progress, [0, .24, .62, 1], [0, 12, 45, 86]);
  const rearWheel = useTransform(progress, [0, .28, .68, 1], [0, -10, -42, -82]);
  const door = useTransform(progress, [0, .3, .67, 1], [0, 18, 65, 105]);
  const glassY = useTransform(progress, [0, 1], [0, -42]);
  const glassRotate = useTransform(progress, [0, 1], [0, 8]);
  const doorY = useTransform(progress, [0, 1], [0, 29]);
  const doorRotate = useTransform(progress, [0, 1], [0, 4]);
  const bumperFrontY = useTransform(progress, [0, 1], [0, 27]);
  const bumperFrontRotate = useTransform(progress, [0, 1], [0, -7]);
  const bumperRearY = useTransform(progress, [0, 1], [0, 26]);
  const bumperRearRotate = useTransform(progress, [0, 1], [0, 7]);
  const wheelFrontY = useTransform(progress, [0, 1], [0, 64]);
  const wheelFrontRotate = useTransform(progress, [0, 1], [0, -115]);
  const wheelRearY = useTransform(progress, [0, 1], [0, -57]);
  const wheelRearRotate = useTransform(progress, [0, 1], [0, 115]);
  const engineY = useTransform(progress, [0, .2, .65, 1], [0, -8, -44, -68]);
  const exhaustX = useTransform(progress, [0, 1], [0, 22]);
  const exhaustY = useTransform(progress, [0, 1], [0, 54]);
  const hoodRotate = useTransform(progress, [0, .4, 1], [0, -3, -8]);
  const partsOpacity = useTransform(progress, [0, .2, .52, .86, 1], [0, .16, .58, .92, 1]);
  const textOne = useTransform(progress, [0, .2, .34, .4], [1, 1, 0, 0]);
  const textTwo = useTransform(progress, [.32, .42, .61, .72], [0, 1, 1, 0]);
  const textThree = useTransform(progress, [.65, .77, 1], [0, 1, 1]);
  const fixedY = useTransform(progress, [0, 1], [0, -20]);

  return (
    <section className="scroll-car" ref={sectionRef} aria-label="Desmontagem animada de um automóvel">
      <div className="scroll-car__sticky">
        <div className="wrap scroll-car__inner">
          <div className="scroll-car__copy">
            <span className="eyebrow">Cada componente importa</span>
            <motion.div className="scroll-car__messages">
              <motion.div className="scroll-car__message" style={{ opacity: reduceMotion ? 1 : textOne }}>
                <span className="scroll-car__step">01 <i /></span>
                <h2>Um carro.<br /><em>Mil peças.</em></h2>
                <p>Encontra o componente certo para manter cada viagem em movimento.</p>
              </motion.div>
              <motion.div className="scroll-car__message scroll-car__message--overlap" style={{ opacity: reduceMotion ? 1 : textTwo }}>
                <span className="scroll-car__step">02 <i /></span>
                <h2>Peça a peça,<br /><em>tudo encaixa.</em></h2>
                <p>Motor, carroçaria, travagem. Ajudamos-te a encontrar o que procuras.</p>
              </motion.div>
              <motion.div className="scroll-car__message scroll-car__message--overlap" style={{ opacity: reduceMotion ? 1 : textThree }}>
                <span className="scroll-car__step">03 <i /></span>
                <h2>A solução<br /><em>está aqui.</em></h2>
                <p>Explora o catálogo FJPM ou fala connosco para identificar a referência certa.</p>
              </motion.div>
            </motion.div>
            <div className="scroll-car__progress"><motion.span style={{ scaleX: reduceMotion ? 1 : progress }} /></div>
            <span className="scroll-car__hint">{reduceMotion ? "FJPM Peças Auto" : "Continua a descer para desmontar"}</span>
          </div>
          <motion.div className="scroll-car__visual" style={{ y: reduceMotion ? 0 : fixedY }}>
            <span className="scroll-car__halo" />
            <svg viewBox="0 0 700 390" role="img" aria-label="Automóvel desmontado em componentes individuais">
              <defs>
                <linearGradient id="car-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0f2f6" /><stop offset=".5" stopColor="#9ca9bc" /><stop offset="1" stopColor="#53627a" /></linearGradient>
                <linearGradient id="part-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#31445f" /><stop offset="1" stopColor="#101a2a" /></linearGradient>
              </defs>
              <ellipse cx="352" cy="322" rx="265" ry="18" fill="#03060b" opacity=".6" />
              <motion.g style={{ x: reduceMotion ? 0 : bonnet, rotate: reduceMotion ? 0 : hoodRotate, transformOrigin: "185px 210px" }}>
                <path d="M89 242l22-37 60-21 26 13 37 35-7 35H96z" fill="url(#car-shell)" stroke="#d6dce6" strokeWidth="2" />
                <path d="M132 207l42-15 23 15-11 35h-63z" fill="#b6c1d1" opacity=".35" />
                <path d="M107 244h30" stroke="#ef2334" strokeWidth="5" />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : windscreen, y: reduceMotion ? 0 : glassY, rotate: reduceMotion ? 0 : glassRotate, transformOrigin: "365px 140px" }}>
                <path d="M204 198l59-91c13-20 30-29 54-31l101-2c26 0 42 8 60 29l47 67-23 31H205z" fill="url(#part-glass)" stroke="#d6dce6" strokeWidth="2" />
                <path d="M270 114c10-13 20-18 39-20l39-1v67h-93zm91-21 65-1c20 0 31 7 44 22l37 47H361z" fill="#111c2d" stroke="#8390a4" strokeWidth="1.5" />
                <path d="M352 94v68" stroke="#8491a4" strokeWidth="2" />
                <path d="M253 183h246" stroke="#e5e9ef" strokeWidth="2" opacity=".4" />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : door, y: reduceMotion ? 0 : doorY, rotate: reduceMotion ? 0 : doorRotate, transformOrigin: "382px 225px" }}>
                <path d="M245 195h267l30 22-18 59H233l12-81z" fill="url(#car-shell)" stroke="#e1e6ed" strokeWidth="2" />
                <path d="M374 198v75m93-74-13 74" stroke="#647188" strokeWidth="2" />
                <path d="M397 209h34" stroke="#ef2334" strokeWidth="4" strokeLinecap="round" />
                <path d="M256 196l-11 76m252-74 16 74" stroke="#f7f8fa" strokeWidth="2" opacity=".4" />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : frontBumper, y: reduceMotion ? 0 : bumperFrontY, rotate: reduceMotion ? 0 : bumperFrontRotate, transformOrigin: "100px 270px" }}>
                <path d="M93 237l-31 12-17 26 15 20 55 3 24-18-9-34z" fill="#7f8da3" stroke="#e2e6ed" strokeWidth="2" />
                <path d="M57 270l40-8 22 13-14 14-46-1z" fill="#111b2b" />
                <path d="M59 251l24-7 15 4" fill="none" stroke="#ff4756" strokeWidth="5" strokeLinecap="round" />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : rearBumper, y: reduceMotion ? 0 : bumperRearY, rotate: reduceMotion ? 0 : bumperRearRotate, transformOrigin: "572px 266px" }}>
                <path d="M547 212l47 16 24 25 5 36-28 11-49-15-18-21 19-52z" fill="#748198" stroke="#dfe4eb" strokeWidth="2" />
                <path d="M582 251l23 8v19l-23 6-15-16z" fill="#111b2b" />
                <path d="M585 258l18 4" stroke="#ff4756" strokeWidth="5" strokeLinecap="round" />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : frontWheel, y: reduceMotion ? 0 : wheelFrontY, rotate: reduceMotion ? 0 : wheelFrontRotate, transformOrigin: "202px 270px" }}>
                <WheelPart cx={202} />
              </motion.g>
              <motion.g style={{ x: reduceMotion ? 0 : rearWheel, y: reduceMotion ? 0 : wheelRearY, rotate: reduceMotion ? 0 : wheelRearRotate, transformOrigin: "493px 270px" }}>
                <WheelPart cx={493} />
              </motion.g>
              <motion.g style={{ y: reduceMotion ? 0 : engineY, opacity: reduceMotion ? 1 : partsOpacity }}>
                <EnginePart />
              </motion.g>
              <motion.g style={{ y: reduceMotion ? 0 : exhaustY, x: reduceMotion ? 0 : exhaustX, opacity: reduceMotion ? .6 : partsOpacity, transformOrigin: "337px 215px" }}>
                <path d="M310 205h47l13 11-4 20h-58l-10-13z" fill="#33445b" stroke="#b9c4d4" strokeWidth="2" />
                <circle cx="327" cy="222" r="8" fill="#ef2334" /><circle cx="348" cy="222" r="8" fill="#a7b2c2" />
              </motion.g>
            </svg>
            <motion.span className="scroll-car__part-label scroll-car__part-label--wheel" style={{ opacity: reduceMotion ? 1 : partsOpacity }}>RODAS</motion.span>
            <motion.span className="scroll-car__part-label scroll-car__part-label--motor" style={{ opacity: reduceMotion ? 1 : partsOpacity }}>MOTOR</motion.span>
            <motion.span className="scroll-car__part-label scroll-car__part-label--body" style={{ opacity: reduceMotion ? 1 : partsOpacity }}>CARROÇARIA</motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
