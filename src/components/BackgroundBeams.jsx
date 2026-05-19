/**
 * BackgroundBeams — four sharp animated diagonal beams behind hero
 * content. CSS-only (no JS). 1px wide, gradient mask, no blur.
 * Aceternity beams pattern reimplemented sharp.
 *
 * Mount as sibling to hero content (z-index 0 via .beams-layer rule).
 */
export default function BackgroundBeams() {
  return (
    <div className="beams-layer" aria-hidden="true">
      <span className="beam beam--1" />
      <span className="beam beam--2" />
      <span className="beam beam--3" />
      <span className="beam beam--4" />
    </div>
  );
}
