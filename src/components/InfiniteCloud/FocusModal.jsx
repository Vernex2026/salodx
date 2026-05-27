import { motion, AnimatePresence } from "framer-motion";
import Glyph from "./Glyph";

export default function FocusModal({ selected, onClose }) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="cloud-focus-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cloud-focus-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="cloud-focus-card"
            style={{ ["--tile-accent"]: selected.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cloud-focus-close-x"
              onClick={onClose}
              aria-label="Zamknij szczegóły integracji"
            >
              ×
            </button>
            <div className="cloud-focus-stage">
              <Glyph type={selected.glyph} accent={selected.accent} />
            </div>
            <div className="cloud-focus-body">
              <span className="cloud-focus-tag">{selected.tag}</span>
              <h3 id="cloud-focus-title" className="cloud-focus-title">
                {selected.title}
              </h3>
              <p className="cloud-focus-metric">{selected.metric}</p>
              <p className="cloud-focus-desc">{selected.desc}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
