import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function useReveal() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const visible = useInView(ref, { once: true, amount: .16 });
  return {
    ref,
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: visible || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: .65, ease: [.22, 1, .36, 1] },
  };
}
