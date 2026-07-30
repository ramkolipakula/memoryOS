---
name: Cognitive Intelligence System
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#c8c5ca'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#007e37'
  on-tertiary-container: '#c1ffc5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style
The design system is engineered for **AI Observability and Long-Term Memory Management**. It targets developers, researchers, and power users who require high-fidelity insights into machine cognition. The brand personality is **Professional, Intelligent, and Transparent**, moving away from "black box" AI tropes toward a "Glass Box" philosophy.

The visual direction is a fusion of **Modern Corporate and Technical Minimalism**, heavily inspired by high-utility developer tools. It prioritizes clarity, information density without clutter, and a sense of architectural stability. Every interface element exists to provide context, trace data, or manage state, evoking a feeling of absolute control over complex neural systems.

## Colors
The color palette is anchored in a **Deep Zinc** spectrum to minimize eye strain during long-term monitoring. 

- **Foundation:** The background uses `#09090B` to provide a true-dark canvas, while surfaces use `#18181B` to create structural separation.
- **Accents:** The **Royal Blue** primary color is reserved for critical actions and active states. 
- **Semantic Logic:** Success, Warning, and Danger colors are calibrated for high legibility against dark backgrounds, used primarily for status indicators and data visualization nodes.
- **Borders:** Thin, subtle borders (`Zinc 800`) are used instead of shadows to define containers, maintaining a crisp, technical aesthetic.

## Typography
This design system utilizes **Geist** for its neutral, systematic utility and **JetBrains Mono** for technical data and log traces.

- **Tracking:** Headings use tight tracking (-0.02em to -0.04em) to create a dense, modern "interlocked" feel characteristic of high-end SaaS.
- **Hierarchy:** Use font weight to differentiate between data labels (Medium 500) and user-generated content (Regular 400).
- **Monospace:** All timestamps, memory addresses, and AI-generated logs must use the `mono-sm` token to ensure character alignment in vertical traces.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Navigation and sidebars are fixed-width to ensure utility remains constant, while the primary "Trace Canvas" is fluid to maximize data visualization real estate.

- **Grid:** A 12-column grid is used for dashboard views, with a consistent 20px gutter.
- **Sidebar:** The primary navigation sidebar is fixed at 240px. The secondary "Inspector" panel (for memory details) is fixed at 320px.
- **Rhythm:** A 4px baseline grid ensures vertical rhythm. Components should prioritize `16px` (md) internal padding for a spacious, premium feel.

## Elevation & Depth
Depth is communicated through **Tonal Layering and Glassmorphism** rather than traditional drop shadows.

- **Base Layer:** `#09090B` (The canvas).
- **Raised Layer:** `#18181B` with a `1px` border of `Zinc 800`.
- **Overlay/Floating:** Used for modals and dropdowns. These employ a `12px` backdrop-blur and a semi-transparent background (`#18181B` at 80% opacity) to maintain context of the underlying data.
- **Shadows:** When used for floating elements, shadows must be ultra-diffused: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`.

## Shapes
The design system adopts a **Refined Rounded** language. 
- **Standard (8px):** Used for buttons, input fields, and small cards.
- **Large (16px):** Used for primary container blocks and main dashboard sections.
- **Interactive:** All hover states should maintain the same corner radius as the parent element to ensure a "nested" visual consistency.

## Components
Consistent styling across technical components ensures the AI's "thought process" is legible.

- **Buttons:** Primary buttons use Royal Blue with white text. Secondary buttons use a Zinc 800 ghost style with no background until hover.
- **Vertical Timelines:** Used for memory retrieval logs. Use a 1px vertical line in Zinc 800 with 8px circular nodes to indicate "memory hits."
- **Terminal Logs:** A dedicated container with `#000000` background, 8px radius, and `mono-sm` typography for raw AI traces.
- **Memory Chips:** Small, low-contrast indicators for "tags" or "entities." Background: `Zinc 900`, Border: `Zinc 800`, Text: `Zinc 400`.
- **Trace Views:** Inspired by LangSmith; use a split-pane view where the left side is a hierarchical tree of "thoughts" and the right side is a detailed JSON/Markdown inspector.
- **Input Fields:** Minimalist design with a 1px `Zinc 800` border that transitions to `Royal Blue` only on active focus. No shadows.