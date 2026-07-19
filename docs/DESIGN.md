---
name: Smart Commerce AI
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#c5c5d6'
  on-secondary: '#2e303d'
  secondary-container: '#474856'
  on-secondary-container: '#b7b7c8'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8691a7'
  on-tertiary-container: '#1f2a3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e1e1f3'
  secondary-fixed-dim: '#c5c5d6'
  on-secondary-fixed: '#191b27'
  on-secondary-fixed-variant: '#444654'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1.5rem
  margin-desktop: 2rem
  margin-mobile: 1rem
  section-gap: 4rem
---

## Brand & Style
The design system is engineered for high-stakes enterprise commerce environments, where clarity and rapid decision-making are paramount. The brand personality is authoritative yet approachable, merging the precision of data science with the fluid experience of premium consumer retail.

The visual style follows a **Modern Corporate** aesthetic with **Glassmorphic** nuances. It prioritizes information density without sacrificing breathing room. By utilizing deep backgrounds and subtle luminous accents, the system evokes a sense of "intelligence behind the screen," positioning the AI as a sophisticated partner rather than just a tool.

## Colors
The palette is rooted in a "Deep Space" hierarchy to maximize contrast and reduce eye strain during prolonged analytical sessions.

- **Primary (Indigo):** Used for primary actions, active states, and critical data highlights. It represents the "intelligence" layer.
- **Base (Deep Dark Navy):** The foundational surface color. It provides a rich, low-glare canvas that makes data points pop.
- **Surface (Slate):** Used for card backgrounds and elevated containers to create structural depth.
- **Accents:** Utilize 7% white (rgba(255, 255, 255, 0.07)) for borders and dividers to maintain a premium, low-friction aesthetic.

## Typography
This design system relies exclusively on **Inter** to project a systematic and utilitarian feel. The type scale is optimized for data-heavy dashboards.

- **Headlines:** Use tighter letter-spacing and heavier weights to anchor the page.
- **Numerical Data:** For tables and metrics, use `tabular-nums` OpenType features to ensure columns of figures align perfectly.
- **Hierarchy:** Use Slate-400 for secondary body text to maintain a clear visual contrast against white primary text.

## Layout & Spacing
The layout employs a **Fluid Grid** system within a max-width container for desktop, ensuring that massive datasets expand to fill the screen while marketing or settings pages remain legible.

- **Grid:** A 12-column grid is used for desktop. Components should snap to 4, 6, or 12 column spans.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Mobile:** Elements reflow to a single column with 16px horizontal margins. Cards lose their external padding but retain internal 24px padding for a "full-bleed" premium look.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Soft Gradients** rather than aggressive shadows. 

1. **Floor:** The #0C0E1A background.
2. **Cards:** Elevated using a 7% white border and a slightly lighter surface (#1E293B). 
3. **Overlays:** Modals and menus use a backdrop blur (12px) and a subtle Indigo-tinted shadow to signify they are temporary layers floating above the logic.
4. **Gradients:** Use linear gradients (Indigo to transparent) at 10% opacity for "active" card backgrounds to indicate selection or AI-driven insights.

## Shapes
The system utilizes a **rounded-2xl** (16px) standard for main UI containers. This generous radius softens the technical nature of the data, making the enterprise environment feel more accessible and modern.

- **Primary Containers:** 16px (2xl).
- **Secondary Elements (Buttons, Inputs):** 12px (xl) to create a subtle nested hierarchy.
- **Small Elements (Tags, Tooltips):** 8px (lg).

## Components
Consistent implementation of components ensures the "Smart Commerce" feel across the platform.

- **Tables:** High-fidelity tables must feature "sticky" headers and first columns. Rows use a 1px border-bottom (7% white). Hover states should trigger a subtle Indigo glow on the left edge.
- **Cards:** Defined by a 16px corner radius and a 1px solid border at 7% white opacity. Padding is locked at 24px for all four sides.
- **Buttons:** Primary buttons use a solid Indigo background. Secondary buttons use a "ghost" style with the 7% white border and white text.
- **Inputs:** Fields are dark-themed with a 1px border. On focus, the border transitions to Indigo with a 4px outer glow of the same color at 20% opacity.
- **Chips:** Used for category filtering; they feature a subtle background tint (Indigo at 10% opacity) and 12px text.
- **AI Insight Module:** A specialized card variant featuring a very subtle moving mesh gradient background in the corner to denote live AI processing.