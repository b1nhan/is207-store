---
name: frontend-redesign
description: >
  Redesign and enhance existing UI systems with premium visual effects: gradients,
  motion animations, MagicUI-style interactive components, and scroll-driven reveals.
  Use when upgrading a working UI — not building from scratch. Preserves existing
  functionality and color system (global.css), adds visual polish and depth.
  Triggers: "redesign", "upgrade UI", "add animations", "make it look better",
  "add motion", "enhance components", "add effects".
---

# Frontend Redesign Skill

## Mission

Upgrade an existing UI system with premium visual effects — gradients, motion, interactive
component patterns, and animation — without breaking functionality or replacing the design
system. All color decisions must be derived from the project's `global.css` CSS variables.

This skill is **additive and targeted**, not a full rewrite. Read the codebase first, audit
what exists, then apply surgical upgrades in priority order.

---

## Phase 0 — Pre-Work (Mandatory)

Before touching any file:

1. **Read `global.css`** — extract all CSS custom properties (colors, radii, spacing, etc.).
   These are the only color sources. Never hardcode hex values that aren't already in the file.
2. **Scan the component tree** — identify which components are high-visibility (hero, cards,
   nav, CTAs) vs. utility (forms, tables, modals).
3. **Check `package.json`** — confirm which of these are already installed:
   - `framer-motion` / `motion`
   - `gsap`
   - `tailwindcss` (and version — v3 vs v4 syntax differs)
   - Any MagicUI or similar component library
4. **Identify the framework** — React, Next.js, Vue, or plain HTML/CSS.
5. **Note existing animation patterns** — don't duplicate or conflict with them.

Never install a library that isn't already in `package.json` without explicitly stating the
install command and waiting for confirmation.

---

## Phase 1 — Gradient System

Replace flat background fills and solid color blocks with gradient treatments derived from
`global.css` variables.

### Rules

- **Source of truth:** All gradient stops must use CSS variables from `global.css`.
  Example: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`.
- **One gradient direction per section** — don't mix 45°, 90°, and 135° in the same view.
- **No pure black or pure white backgrounds** — use near-black/near-white tinted with the
  brand hue.
- **Mesh gradients** for hero or large background sections:
  use multiple radial-gradient layers with low opacity stacked on a base color.
- **Text gradients** only on display/headline text, never body text.
  Use `background-clip: text; -webkit-background-clip: text; color: transparent`.
- **Borders** — replace solid 1px borders on highlighted cards with a gradient border using
  the `border-image` trick or a `::before` pseudo-element overlay.
- **Glow/halo** — subtle `box-shadow` using `hsl(var(--primary) / 0.3)` tint.
  Never use pure black shadows.

### Gradient Patterns by Context

| Context | Pattern |
|---------|---------|
| Hero background | Mesh: 3–4 radial gradients at corners, 15–25% opacity |
| Section divider | Linear gradient from transparent → brand tint → transparent |
| Card surface | Subtle linear gradient from `--card` to a slightly lighter tint |
| CTA button | Linear gradient between primary and a shifted hue variant |
| Stat/highlight text | Gradient text using primary → accent |
| Badge/tag | Solid fill with `hsl(var(--primary) / 0.15)` + border tint |

---

## Phase 2 — Motion (Framer Motion / motion.div)

Add `motion.div` wrappers and animation variants to sections and key UI elements.
**Never animate layout properties** (`width`, `height`, `top`, `left`).
Only animate: `transform`, `opacity`, `filter`, `clip-path`.

### Dependency Check

```bash
# If not installed:
npm install framer-motion
# or (for newer projects)
npm install motion
```

Import: `import { motion, AnimatePresence } from "framer-motion"`

### Standard Variants

Use these consistently across the project. Define in a shared `lib/motion.ts` or inline:

```ts
// Fade up — default entry for sections and cards
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// Stagger container — wrap lists, grids, feature rows
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

// Stagger item — child of staggerContainer
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

// Scale in — for modals, tooltips, badges
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } },
}

// Slide from left — for sidebars, drawers
export const slideFromLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}
```

### Scroll-Triggered Entry (whileInView)

Wrap each major section or card grid:

```tsx
<motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
>
```

### Hover & Tap Micro-Interactions

Apply to all interactive elements (buttons, cards, links):

```tsx
// Button
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>

// Card
<motion.div
  whileHover={{ y: -4, boxShadow: "0 16px 40px hsl(var(--primary) / 0.15)" }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
```

### Page Load Stagger

For the top hero or first visible section, orchestrate a staggered entrance:

```tsx
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.h1 variants={staggerItem}>Headline</motion.h1>
  <motion.p variants={staggerItem}>Subheadline</motion.p>
  <motion.div variants={staggerItem}><CTAButton /></motion.div>
</motion.div>
```

### Rules

- `viewport={{ once: true }}` on all `whileInView` — never repeat on scroll-back.
- Wrap perpetual/looping animations in `React.memo` to prevent re-render.
- Every component using motion must respect `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from "framer-motion"
const reduced = useReducedMotion()
const variants = reduced ? {} : fadeUp
```

- **NEVER** mix GSAP and Framer Motion in the same component.

---

## Phase 3 — Interactive Component Upgrades (MagicUI Patterns)

Replace generic `div` cards and static containers with interactive, effect-rich components.
These can be implemented from scratch without installing MagicUI if the library isn't present.

### 3.1 Magic Card (Spotlight Border)

Replaces: generic card with `border` + `box-shadow`

```tsx
// SpotlightCard.tsx
"use client"
import { useRef, useState } from "react"

export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect()
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight(s => ({ ...s, opacity: 0 }))}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-card ${className}`}
    >
      {/* Spotlight gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, hsl(var(--primary) / 0.12), transparent 70%)`,
          opacity: spotlight.opacity,
        }}
      />
      {children}
    </div>
  )
}
```

**Use for:** feature cards, pricing cards, dashboard widgets.

### 3.2 Shimmer Button

Replaces: plain filled button

```tsx
export function ShimmerButton({ children, className, ...props }) {
  return (
    <button
      className={`relative overflow-hidden rounded-lg px-6 py-3 font-medium
        bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)]
        text-primary-foreground transition-all duration-200
        hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] active:scale-[0.97] ${className}`}
      {...props}
    >
      {/* Shimmer sweep */}
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
        bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="relative">{children}</span>
    </button>
  )
}

// In tailwind.config: add keyframe
// shimmer: { '100%': { transform: 'translateX(100%)' } }
// Or in global.css:
// @keyframes shimmer { to { transform: translateX(100%) } }
```

### 3.3 Gradient Border Card

Replaces: card with flat border

```css
/* In component or global.css */
.gradient-border {
  position: relative;
  border-radius: var(--radius);
  background: hsl(var(--card));
}
.gradient-border::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, hsl(var(--primary) / 0.6), transparent 50%, hsl(var(--secondary) / 0.4));
  z-index: -1;
}
```

### 3.4 Animated Number Counter

For stat/metric displays:

```tsx
import { useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

export function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (inView) mv.set(value)
  }, [inView, value, mv])

  useEffect(() => spring.on("change", v => {
    if (ref.current) ref.current.textContent = Math.round(v).toLocaleString()
  }), [spring])

  return <span ref={ref}>0</span>
}
```

### 3.5 Floating Particles / Ambient Background

For hero sections or large background areas (CSS-only, no library required):

```css
/* Floating orbs — place in hero wrapper */
.ambient-bg {
  position: relative;
  overflow: hidden;
}
.ambient-bg::before,
.ambient-bg::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}
.ambient-bg::before {
  width: 500px; height: 500px;
  background: hsl(var(--primary) / 0.3);
  top: -100px; left: -100px;
  animation-delay: 0s;
}
.ambient-bg::after {
  width: 400px; height: 400px;
  background: hsl(var(--secondary) / 0.25);
  bottom: -80px; right: -80px;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -30px) scale(1.05); }
  66%       { transform: translate(-20px, 20px) scale(0.97); }
}
```

---

## Phase 4 — GSAP (Basic Rules)

GSAP is available for scroll-driven storytelling, pinned sections, and timeline sequences
that go beyond Framer Motion's scope. A dedicated GSAP skill covers the full rule set.

**Basic constraints for this skill:**

- **Never** mix GSAP and Framer Motion on the same element or in the same component.
- GSAP must be **lazy-loaded**: `const gsap = (await import("gsap")).default`.
- Every `gsap.context()` or `ScrollTrigger` instance must be cleaned up in `useEffect` return:
  `return () => ctx.revert()`.
- Only animate GPU-safe properties: `x`, `y`, `rotation`, `scale`, `opacity`, `clipPath`.
- Disable ScrollTrigger pin on mobile (`< 768px`).
- Use GSAP only for: pinned scroll sequences, horizontal scroll hijack,
  SVG path draws, or timeline-based multi-element choreography.
  For everything else, use Framer Motion.

---

## Phase 5 — Animation Polish Checklist

Run through this before considering any redesign task complete:

### Timing & Easing
- [ ] Entry animations: `duration` 0.4–0.6s, easing `[0.16, 1, 0.3, 1]` (smooth decel)
- [ ] Micro-interactions (hover/tap): `duration` 0.15–0.25s
- [ ] Spring configs used for physical feel on cards/buttons
- [ ] No `ease: "linear"` on visible UI — reserved for infinite loops only

### Stagger
- [ ] Lists and card grids use `staggerChildren: 0.08–0.12`
- [ ] Hero section uses orchestrated stagger on load
- [ ] Items don't all animate simultaneously

### Gradients
- [ ] All gradient stops use `hsl(var(--*))` values from `global.css`
- [ ] No hardcoded hex in gradient definitions
- [ ] Hero/large sections have ambient gradient background
- [ ] At least one CTA button upgraded to gradient + shimmer treatment

### Interactive Components
- [ ] High-visibility cards upgraded to SpotlightCard or gradient-border variant
- [ ] Primary buttons upgraded with hover glow or shimmer
- [ ] Stat displays use AnimatedNumber on scroll entry

### Accessibility
- [ ] `prefers-reduced-motion` respected in all motion components
- [ ] Focus rings visible on all interactive elements
- [ ] No flashing content > 3×/second

### Performance
- [ ] Perpetual animations isolated in `React.memo` components
- [ ] GSAP and heavy libs lazy-loaded
- [ ] `will-change: transform` applied only during active animation, not permanently

---

## Anti-Patterns (Never Do)

| Category | Banned |
|----------|--------|
| Color | Hardcoded hex values not from `global.css` |
| Color | Purple/blue AI gradient clichés unless that IS the brand color |
| Motion | Animating `width`, `height`, `top`, `left`, `margin` |
| Motion | Mixing GSAP + Framer Motion in the same component |
| Motion | `viewport={{ once: false }}` on section reveals |
| Components | Adding MagicUI or new animation libraries without confirming install |
| Effects | Neon glows with high opacity (max 40% opacity on glow effects) |
| Effects | Gradient text on body/paragraph text |
| Performance | `will-change: transform` on every element permanently |
| Behavior | Breaking existing interactivity or state logic while adding effects |

---

## Upgrade Priority Order

Apply in this sequence for maximum impact with minimum breakage:

1. **Gradient system** — hero background, card surfaces, CTA buttons
2. **Motion entry animations** — `whileInView` fadeUp on sections
3. **Hover/tap micro-interactions** — all cards and buttons
4. **Hero stagger** — orchestrated page load sequence
5. **SpotlightCard** — replace top-priority feature cards
6. **AnimatedNumber** — stat/metric displays
7. **Ambient background** — hero and large background sections
8. **Shimmer buttons** — primary CTA upgrade
9. **GSAP sequences** — only if pinned scroll or complex timelines are needed

---

## Working Notes

- **Always ask** before installing any library not in `package.json`.
- **Always read `global.css` first** — never invent colors.
- **Work file by file** — show what changed and why before moving to the next component.
- When in doubt between two approaches, pick the one with fewer new dependencies.
- Functional correctness takes priority over visual enhancement at every step.