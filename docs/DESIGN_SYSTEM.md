# DESIGN_SYSTEM.md

## Smart Commerce AI — Design System Specification

**Version:** 1.0.0  
**Status:** Production  
**Last Updated:** 2026-07-20  
**Depends On:** PROJECT_BRIEF.md, AGENTS.md, PRD.md, ARCHITECTURE.md, FOLDER_STRUCTURE.md, CODING_STANDARDS.md  
**Read By:** All frontend engineers, AI agents, UI/UX contributors, and design reviewers  

---

## 1. Design Philosophy

Smart Commerce AI is an **AI-first enterprise SaaS platform** built for commerce operators who demand clarity, speed, and trust. The design philosophy is rooted in three pillars:

### 1.1 Intelligence as Ambiance
The AI is not a feature — it is the atmosphere of the product. The visual language must communicate that intelligence is always present, always working, and always accessible. This is achieved through subtle motion, luminous accents, and the recurring AI Insight motif (sparkle iconography, violet tints, confidence indicators) rather than through overt "AI panels" or chatbot chrome.

### 1.2 Density Without Clutter
Store Owners manage hundreds of products, thousands of orders, and complex inventory states. The interface must present high information density without cognitive overload. Every pixel serves a purpose; whitespace is intentional, not decorative. Data-heavy views (tables, dashboards, analytics) are the primary canvas, and the design system optimizes for rapid scanning, comparison, and decision-making.

### 1.3 Trust Through Transparency
Every state change, every AI recommendation, every automated action must be visible and auditable. The visual system reinforces trust through clear status semantics, immutable audit trails, and deterministic feedback patterns. A Store Owner must never wonder "what just happened" — the interface always answers.

### 1.4 Dark-First, Light-Ready
The platform ships with a single, deeply refined dark theme as the default. This is not a "dark mode toggle" — it is the canonical visual expression of the product. A light theme may be introduced in a future phase, but the dark theme must be architecturally complete and production-ready without compromise. All tokens, components, and layouts are designed for dark-first implementation.

---

## 2. Brand Identity

### 2.1 Brand Name & Voice
- **Product Name:** Smart Commerce AI
- **Technical Name:** Workspace (used in code, database, and architecture contexts)
- **Brand Voice:** Authoritative yet approachable. Precise but not cold. The AI is a partner, not a replacement.
- **Tone:** Confident, helpful, transparent, never apologetic about complexity.

### 2.2 Brand Mark
The brand mark is a **geometric abstract icon** (exact shape to be finalized by design team) rendered in the Primary color (`#8B5CF6`). It appears in:
- Sidebar header (top-left)
- Auth card headers
- Favicon and app icons
- Loading states and empty states

The mark must never be distorted, recolored (except to white on dark backgrounds), or placed on busy backgrounds without sufficient contrast.

### 2.3 Brand Promise
> "Your commerce, intelligently managed."

This promise is reflected in every design decision: the interface reduces manual work, surfaces actionable intelligence, and keeps the human operator in control.

### 2.4 Product Positioning
Smart Commerce AI occupies the intersection of **operational control** (inventory, orders, products) and **conversational commerce** (AI-assisted Messenger selling). The visual system must serve both modes equally well — the dashboard for operational oversight, and the AI-driven workflows for conversational automation.

---

## 3. Design Principles

These principles govern every design decision. They are ranked by priority; when principles conflict, the higher-ranked principle wins.

### 3.1 Clarity Over Decoration
Every visual element must communicate meaning. Decorative flourishes (gradients, shadows, animations) are permitted only when they reinforce understanding, never when they distract from it. The default state of any component is "clear and functional"; embellishment is added deliberately.

### 3.2 Consistency Over Novelty
Once a pattern is established (e.g., how status badges work, how cards are structured), it is reused identically across all contexts. Novel UI patterns are introduced only when no existing pattern can solve the problem. This reduces cognitive load and accelerates development.

### 3.3 Feedback Over Silence
Every user action produces visible, deterministic feedback. Buttons show loading states. Forms show validation errors inline. State changes animate. The system never leaves the user guessing whether their action was received.

### 3.4 Hierarchy Over Flatness
Information is organized in clear visual hierarchies through size, weight, color, and spacing. Not everything is equally important. The most critical information (pending orders, low stock alerts, AI recommendations) is visually dominant; secondary information (timestamps, metadata, footer links) is visually subordinate.

### 3.5 Accessibility Over Aesthetics
The interface must be usable by people with visual, motor, and cognitive disabilities. Color is never the sole carrier of meaning. Interactive elements meet minimum touch targets. Motion respects user preferences. Aesthetics that compromise accessibility are not permitted.

### 3.6 Performance Over Polish
Animations and effects must not degrade perceived performance. The interface must remain responsive (60fps) on mid-tier hardware. Heavy visual effects (blur, complex gradients) are used sparingly and only where they provide meaningful value.

---

## 4. Color System

The color system is built on a **token-based architecture** with four foundational brand colors, each extended into a full tint/shade ramp. All UI colors are derived from these tokens — no hardcoded hex values are permitted in component code.

### 4.1 Brand Colors [EXACT]

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Primary** | `#8B5CF6` | `rgb(139, 92, 246)` | Primary actions, active states, links, focus rings, AI accents, brand mark |
| **Secondary** | `#2DD4BF` | `rgb(45, 212, 191)` | Success states, positive metrics, secondary accents, confirmation feedback |
| **Tertiary** | `#F472B6` | `rgb(244, 114, 182)` | Danger/alert accents, destructive actions, edit indicators, highlight badges |
| **Neutral** | `#0F172A` | `rgb(15, 23, 42)` | Base dark background, deepest surface layer |

### 4.2 Color Ramp Structure
Each brand color is extended into a **9-step scale** (50, 100, 200, 300, 400, 500, 600, 700, 800, 900), where 500 is the base color. The scale follows a perceptually uniform lightness curve, not a linear mathematical interpolation.

**Primary Scale [EXACT from style guide]:**
| Step | Hex | Usage |
|------|-----|-------|
| Primary-50 | `#F5F3FF` | Lightest tint, rarely used in dark theme |
| Primary-100 | `#EDE9FE` | Hover backgrounds on primary buttons |
| Primary-200 | `#DDD6FE` | Subtle primary backgrounds |
| Primary-300 | `#C4B5FD` | Disabled primary states |
| Primary-400 | `#A78BFA` | Secondary primary accents |
| Primary-500 | `#8B5CF6` | **Base Primary** — CTA buttons, active nav |
| Primary-600 | `#7C3AED` | Primary button hover |
| Primary-700 | `#6D28D9` | Primary button active/pressed |
| Primary-800 | `#5B21B6` | Deep primary backgrounds |
| Primary-900 | `#4C1D95` | Darkest primary, used for subtle depth |

**Secondary Scale [EST]:**
| Step | Approx. Hex | Usage |
|------|-------------|-------|
| Secondary-50 | `#F0FDFA` | Lightest tint |
| Secondary-100 | `#CCFBF1` | Subtle success backgrounds |
| Secondary-200 | `#99F6E4` | Success hover states |
| Secondary-300 | `#5EEAD4` | Success accents |
| Secondary-400 | `#2DD4BF` | **Base Secondary** — success badges, positive trends |
| Secondary-500 | `#14B8A6` | Success button hover |
| Secondary-600 | `#0D9488` | Success button active |
| Secondary-700 | `#0F766E` | Deep success backgrounds |
| Secondary-800 | `#115E59` | Darkest success tint |
| Secondary-900 | `#134E4A` | Subtle success depth |

**Tertiary Scale [EST]:**
| Step | Approx. Hex | Usage |
|------|-------------|-------|
| Tertiary-50 | `#FDF2F8` | Lightest tint |
| Tertiary-100 | `#FCE7F3` | Subtle danger backgrounds |
| Tertiary-200 | `#FBCFE8` | Danger hover states |
| Tertiary-300 | `#F9A8D4` | Danger accents |
| Tertiary-400 | `#F472B6` | **Base Tertiary** — danger badges, destructive actions |
| Tertiary-500 | `#EC4899` | Danger button hover |
| Tertiary-600 | `#DB2777` | Danger button active |
| Tertiary-700 | `#BE185D` | Deep danger backgrounds |
| Tertiary-800 | `#9D174D` | Darkest danger tint |
| Tertiary-900 | `#831843` | Subtle danger depth |

**Neutral Scale [EST]:**
| Step | Approx. Hex | Usage |
|------|-------------|-------|
| Neutral-50 | `#F8FAFC` | Not used in dark theme |
| Neutral-100 | `#F1F5F9` | Not used in dark theme |
| Neutral-200 | `#E2E8F0` | Lightest text on dark (headings) |
| Neutral-300 | `#CBD5E1` | Primary text on dark |
| Neutral-400 | `#94A3B8` | Secondary text, labels, metadata |
| Neutral-500 | `#64748B` | Muted text, placeholders, disabled |
| Neutral-600 | `#475569` | Subtle borders, dividers |
| Neutral-700 | `#334155` | Card borders, hairline dividers |
| Neutral-800 | `#1E293B` | Elevated surface backgrounds |
| Neutral-900 | `#0F172A` | **Base Neutral** — page background, deepest surface |

### 4.3 Surface Colors [EST]

Surfaces are layered using the Neutral scale to create depth without shadows:

| Token | Approx. Hex | Usage |
|-------|-------------|-------|
| **Surface-Base** | `#0B1120` | Deepest page background (slightly darker than Neutral-900 for extra depth) |
| **Surface-Primary** | `#0F172A` | Default page background, sidebar background |
| **Surface-Secondary** | `#131C2E` | Card backgrounds, panel backgrounds |
| **Surface-Tertiary** | `#161F33` | Elevated cards, hover states on cards |
| **Surface-Elevated** | `#1B2438` | Dropdown menus, popovers, modals, toasts |
| **Surface-Overlay** | `rgba(15, 23, 42, 0.85)` | Backdrop overlays, modal scrims |

### 4.4 Border Colors [EST]

| Token | Approx. Hex / Value | Usage |
|-------|---------------------|-------|
| **Border-Default** | `#232D42` | Card borders, panel borders, input borders |
| **Border-Subtle** | `rgba(255, 255, 255, 0.06)` | Hairline dividers, table row separators |
| **Border-Active** | `#8B5CF6` | Focus rings, active input borders |
| **Border-Error** | `#F472B6` | Invalid input borders |
| **Border-Success** | `#2DD4BF` | Valid form fields (optional) |


---

## 5. Semantic Colors

Semantic colors map brand tokens to functional meanings. They ensure consistent communication of state across the entire interface.

### 5.1 Status Semantics

| Status | Background | Text | Border | Icon | Usage |
|--------|-----------|------|--------|------|-------|
| **Success / Active / Approved** | `Secondary-400` bg at 15% opacity | `Secondary-400` | `Secondary-400` at 30% opacity | `Secondary-400` | Approved orders, active products, active stores, positive trends |
| **Warning / Pending / Low Stock** | Amber `#F59E0B` bg at 15% opacity | Amber `#F59E0B` | Amber at 30% opacity | Amber `#F59E0B` | Pending orders, low stock alerts, trial expiring soon |
| **Danger / Rejected / Out of Stock** | `Tertiary-400` bg at 15% opacity | `Tertiary-400` | `Tertiary-400` at 30% opacity | `Tertiary-400` | Rejected orders, out of stock, destructive actions, errors |
| **Info / Neutral / Inactive** | `Neutral-500` bg at 15% opacity | `Neutral-400` | `Neutral-500` at 30% opacity | `Neutral-400` | Inactive products, stable status, informational notes |
| **Primary / AI / Premium** | `Primary-500` bg at 15% opacity | `Primary-400` | `Primary-500` at 30% opacity | `Primary-400` | AI features, premium badges, primary callouts |

### 5.2 Action Semantics

| Action | Background | Text | Hover | Active | Usage |
|--------|-----------|------|-------|--------|-------|
| **Primary Action** | `Primary-500` | White | `Primary-600` | `Primary-700` | Main CTAs: Create, Save, Approve, Sign In |
| **Secondary Action** | Transparent | `Neutral-300` | `Surface-Tertiary` | `Surface-Elevated` | Cancel, Discard, secondary options |
| **Destructive Action** | `Tertiary-500` | White | `Tertiary-600` | `Tertiary-700` | Delete, Reject, Remove, Danger Zone actions |
| **Ghost Action** | Transparent | `Neutral-400` | `Surface-Tertiary` | `Surface-Elevated` | Icon buttons, table actions, subtle interactions |

### 5.3 Feedback Semantics

| Feedback Type | Background | Border | Icon | Text |
|---------------|-----------|--------|------|------|
| **Success Toast** | `Secondary-900` | `Secondary-700` | `Secondary-400` check | `Neutral-200` |
| **Error Toast** | `Tertiary-900` | `Tertiary-700` | `Tertiary-400` alert | `Neutral-200` |
| **Warning Toast** | `#451A03` (amber dark) | `#92400E` | Amber `#F59E0B` | `Neutral-200` |
| **Info Toast** | `Primary-900` | `Primary-700` | `Primary-400` info | `Neutral-200` |

---

## 6. Color Scales

### 6.1 Opacity Scale
A standardized opacity scale is used for overlays, disabled states, and subtle effects:

| Token | Value | Usage |
|-------|-------|-------|
| **Opacity-0** | `0` | Fully transparent |
| **Opacity-5** | `0.05` | Subtle backgrounds |
| **Opacity-10** | `0.10` | Hover backgrounds, disabled text |
| **Opacity-15** | `0.15` | Badge backgrounds, subtle fills |
| **Opacity-20** | `0.20` | Focus ring glows |
| **Opacity-30** | `0.30` | Disabled borders, subtle dividers |
| **Opacity-50** | `0.50` | Placeholder text, disabled icons |
| **Opacity-70** | `0.70` | Backdrop overlays |
| **Opacity-85** | `0.85` | Modal scrims |
| **Opacity-100** | `1.00` | Fully opaque |

### 6.2 Gradient Patterns
Gradients are used sparingly and only for specific brand moments:

| Gradient | Definition | Usage |
|----------|-----------|-------|
| **Auth Background Glow** | Radial gradient from `Primary-500` at 20% opacity to transparent | Auth screen background accents |
| **Primary Button Gradient** | Linear gradient from `Primary-500` to `Primary-600` | Primary CTA buttons (optional enhancement) |
| **AI Insight Card Background** | Linear gradient from `Primary-900` at 50% opacity to `Surface-Secondary` | AI Insight card subtle tint |
| **Chart Area Fill** | Linear gradient from `Primary-500` at 30% opacity to transparent | Area chart fills |

### 6.3 Chart Colors
A dedicated palette for data visualization, distinct from semantic colors to avoid confusion:

| Token | Hex | Usage |
|-------|-----|-------|
| **Chart-Primary** | `#8B5CF6` | Primary data series |
| **Chart-Secondary** | `#2DD4BF` | Secondary data series |
| **Chart-Tertiary** | `#F472B6` | Tertiary data series |
| **Chart-Quaternary** | `#F59E0B` | Quaternary data series |
| **Chart-Quinary** | `#60A5FA` | Quinary data series |
| **Chart-Track** | `#1E293B` | Donut/ring chart background track |

---

## 7. CSS Variables

All design tokens are exposed as CSS custom properties on the `:root` element. This enables runtime theming, dynamic overrides, and consistent reference across Tailwind, HeroUI, and custom CSS.

### 7.1 Core Token Variables

```css
:root {
  /* Brand Colors */
  --color-primary-50: #F5F3FF;
  --color-primary-100: #EDE9FE;
  --color-primary-200: #DDD6FE;
  --color-primary-300: #C4B5FD;
  --color-primary-400: #A78BFA;
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-primary-700: #6D28D9;
  --color-primary-800: #5B21B6;
  --color-primary-900: #4C1D95;

  --color-secondary-50: #F0FDFA;
  --color-secondary-100: #CCFBF1;
  --color-secondary-200: #99F6E4;
  --color-secondary-300: #5EEAD4;
  --color-secondary-400: #2DD4BF;
  --color-secondary-500: #14B8A6;
  --color-secondary-600: #0D9488;
  --color-secondary-700: #0F766E;
  --color-secondary-800: #115E59;
  --color-secondary-900: #134E4A;

  --color-tertiary-50: #FDF2F8;
  --color-tertiary-100: #FCE7F3;
  --color-tertiary-200: #FBCFE8;
  --color-tertiary-300: #F9A8D4;
  --color-tertiary-400: #F472B6;
  --color-tertiary-500: #EC4899;
  --color-tertiary-600: #DB2777;
  --color-tertiary-700: #BE185D;
  --color-tertiary-800: #9D174D;
  --color-tertiary-900: #831843;

  --color-neutral-50: #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-400: #94A3B8;
  --color-neutral-500: #64748B;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1E293B;
  --color-neutral-900: #0F172A;

  /* Surfaces */
  --surface-base: #0B1120;
  --surface-primary: #0F172A;
  --surface-secondary: #131C2E;
  --surface-tertiary: #161F33;
  --surface-elevated: #1B2438;
  --surface-overlay: rgba(15, 23, 42, 0.85);

  /* Borders */
  --border-default: #232D42;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-active: #8B5CF6;
  --border-error: #F472B6;
  --border-success: #2DD4BF;

  /* Text */
  --text-primary: #E2E8F0;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-placeholder: #475569;
  --text-inverse: #0F172A;

  /* Typography */
  --font-headline: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Shadows (dark theme — minimal) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-glow-primary: 0 0 20px rgba(139, 92, 246, 0.3);
  --shadow-glow-secondary: 0 0 20px rgba(45, 212, 191, 0.3);
  --shadow-glow-tertiary: 0 0 20px rgba(244, 114, 182, 0.3);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

### 7.2 Variable Usage Rules
- All component styles must reference CSS variables, never hardcoded values.
- CSS variables may be overridden at the component level for scoped theming (e.g., a modal with a different surface color).
- The `data-theme` attribute on `<html>` controls theme switching (future light mode support).

---

## 8. Typography System

The typography system uses two typefaces with distinct roles, creating a clear hierarchy between display/headline text and body/functional text.

### 8.1 Typeface Selection [EXACT]

| Role | Font | Fallback Stack | Usage |
|------|------|---------------|-------|
| **Headline** | Plus Jakarta Sans | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Page titles, section headers, stat values, card titles, marketing copy |
| **Body / Label** | Inter | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Body text, descriptions, form labels, table content, buttons, badges, metadata |

### 8.2 Font Loading Requirements
- Both fonts must be loaded via `next/font` for optimal performance and zero layout shift.
- Font display strategy: `swap` (show fallback immediately, swap when loaded).
- Subsetting: Latin character set is sufficient for Phase 1 (Libya market, Arabic support may be added in future phases).
- Variable font versions should be used if available to reduce HTTP requests.


---

## 9. Font Sizes

The type scale is based on a **4px grid** with a ratio of approximately 1.25 (major third). Sizes are named by function, not by arbitrary t-shirt sizes.

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| **text-hero** | 40px | 48px (1.2) | Marketing headlines, auth page titles |
| **text-display** | 32px | 40px (1.25) | Page titles, large stat values |
| **text-headline** | 24px | 32px (1.33) | Section headers, card titles, modal titles |
| **text-title** | 20px | 28px (1.4) | Sub-section headers, dialog titles |
| **text-body-lg** | 18px | 28px (1.55) | Lead paragraphs, important descriptions |
| **text-body** | 16px | 24px (1.5) | Default body text, form inputs, table content |
| **text-body-sm** | 14px | 20px (1.43) | Secondary text, descriptions, captions |
| **text-label** | 12px | 16px (1.33) | Form labels, badges, metadata, overline text |
| **text-caption** | 11px | 14px (1.27) | Timestamps, fine print, technical metadata |

### 9.1 Responsive Font Sizes
On viewports below 768px, `text-hero` scales to 32px and `text-display` scales to 28px. All other sizes remain constant.

---

## 10. Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| **Light** | 300 | Marketing body text, large display numbers (optional) |
| **Regular** | 400 | Body text, descriptions, input values |
| **Medium** | 500 | Buttons, labels, table headers, navigation items |
| **SemiBold** | 600 | Card titles, section headers, stat labels, active nav |
| **Bold** | 700 | Page titles, hero text, stat values, emphasis |
| **ExtraBold** | 800 | Marketing headlines, large display numbers (rare) |

### 10.1 Weight Pairing Rules
- Headlines use **Bold (700)** or **SemiBold (600)**.
- Body text uses **Regular (400)**.
- Labels and metadata use **Medium (500)**.
- Never use Light (300) for text smaller than 18px — it compromises readability.

---

## 11. Line Heights

Line heights are specified as unitless ratios relative to font size. This ensures proportional scaling across all font sizes.

| Token | Ratio | Usage |
|-------|-------|-------|
| **leading-tight** | 1.2 | Headlines, display text, stat values (minimal leading for impact) |
| **leading-snug** | 1.33 | Sub-headlines, card titles, labels (compact but readable) |
| **leading-normal** | 1.5 | Body text, descriptions, form inputs (optimal reading) |
| **leading-relaxed** | 1.625 | Long-form paragraphs, help text, tooltips (generous for readability) |

### 11.1 Tabular Figures
All numeric data in tables, stat cards, and metrics must use `font-variant-numeric: tabular-nums` to ensure columns of numbers align perfectly. This is non-negotiable for data-dense views.

---

## 12. Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| **tracking-tighter** | -0.02em | Large headlines, display text (tightens large type) |
| **tracking-tight** | -0.01em | Headlines, card titles |
| **tracking-normal** | 0em | Body text, default state |
| **tracking-wide** | 0.05em | Uppercase labels, badges, overline text |
| **tracking-wider** | 0.1em | Small uppercase labels, eyebrow text, metadata categories |

### 12.1 Uppercase Text Rules
- Uppercase text is reserved for labels, badges, overlines, and table headers only.
- Never use uppercase for body text, descriptions, or sentences.
- All uppercase text must use `tracking-wide` or `tracking-wider` to improve readability.

---

## 13. Spacing System

The spacing system is based on an **8px grid** with 4px micro-increments for fine adjustments. All spacing values are derived from this scale.

| Token | Value | Usage |
|-------|-------|-------|
| **space-0** | 0px | No spacing |
| **space-px** | 1px | Hairline borders, 1px adjustments |
| **space-0.5** | 2px | Micro gaps, icon-to-text tight spacing |
| **space-1** | 4px | Tight internal padding, icon gaps |
| **space-2** | 8px | Default gap between related elements, icon-to-label |
| **space-3** | 12px | Form field label-to-input gap, compact card padding |
| **space-4** | 16px | Standard gap, compact section spacing |
| **space-5** | 20px | Card internal padding (horizontal), form section gaps |
| **space-6** | 24px | Card internal padding (vertical), section gaps |
| **space-8** | 32px | Section vertical spacing, modal padding |
| **space-10** | 40px | Large section spacing, page content top margin |
| **space-12** | 48px | Major section breaks |
| **space-16** | 64px | Page-level vertical spacing |
| **space-20** | 80px | Marketing section spacing |
| **space-24** | 96px | Hero section spacing |

### 13.1 Spacing Rules
- Use `space-2` (8px) as the default gap between related elements.
- Use `space-4` to `space-6` (16–24px) for card internal padding.
- Use `space-8` to `space-10` (32–40px) for section vertical spacing.
- Never use arbitrary pixel values — always round to the nearest token.
- Component internal padding and external margins should use the same scale.

---

## 14. Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| **radius-none** | 0px | Tables, data grids, full-bleed images |
| **radius-sm** | 6px | Small buttons, tags, inline badges, input fields |
| **radius-md** | 10px | Standard buttons, form inputs, small cards |
| **radius-lg** | 12px | Medium cards, panels, dropdown menus |
| **radius-xl** | 16px | Large cards, stat cards, primary content containers |
| **radius-2xl** | 20px | Auth cards, modals, major panels |
| **radius-full** | 9999px | Pills, badges, avatars, circular buttons, status indicators |

### 14.1 Radius Rules
- Cards use `radius-xl` (16px) as the default.
- Buttons use `radius-md` (10px) as the default.
- Inputs use `radius-md` (10px) as the default.
- Badges and pills use `radius-full` (9999px).
- Avatars use `radius-full` (9999px).
- Tables use `radius-none` (0px) internally; the table container may use `radius-xl`.
- Nested elements should have slightly smaller radii than their containers (e.g., a button inside a card uses `radius-md` while the card uses `radius-xl`).

---

## 15. Border Rules

### 15.1 Border Widths
| Token | Value | Usage |
|-------|-------|-------|
| **border-none** | 0px | No border (default for most elements) |
| **border-thin** | 1px | Card borders, dividers, input borders, table row separators |
| **border-medium** | 2px | Focus rings, active states, selected items |

### 15.2 Border Styles
- Default border style: `solid`.
- Dividers inside cards and panels use `border-thin` (1px) with `border-subtle` color.
- Focus rings use `border-medium` (2px) with `border-active` color.
- No dashed or dotted borders are used in the standard component set.

### 15.3 Border Color Rules
- **Default borders:** `border-default` (`#232D42`) — used for card outlines, panel borders.
- **Subtle borders:** `border-subtle` (`rgba(255,255,255,0.06)`) — used for hairline dividers, table row separators.
- **Active borders:** `border-active` (`#8B5CF6`) — used for focus states, active inputs, selected items.
- **Error borders:** `border-error` (`#F472B6`) — used for invalid form fields.
- **Success borders:** `border-success` (`#2DD4BF`) — used for valid form fields (optional).

---

## 16. Shadow & Elevation System

The platform uses a **border-and-fill elevation model** rather than shadow-based elevation. This is a deliberate design choice that aligns with modern dark-theme SaaS aesthetics (Linear, Vercel, Raycast).

### 16.1 Elevation Levels

| Level | Surface Color | Border | Usage |
|-------|--------------|--------|-------|
| **Level 0 (Base)** | `Surface-Base` (`#0B1120`) | None | Deepest background, page base |
| **Level 1 (Surface)** | `Surface-Primary` (`#0F172A`) | None | Sidebar, default page background |
| **Level 2 (Card)** | `Surface-Secondary` (`#131C2E`) | `border-default` | Cards, panels, content containers |
| **Level 3 (Elevated)** | `Surface-Tertiary` (`#161F33`) | `border-default` | Hover states, elevated cards, active items |
| **Level 4 (Overlay)** | `Surface-Elevated` (`#1B2438`) | `border-default` | Dropdowns, popovers, toasts, tooltips |
| **Level 5 (Modal)** | `Surface-Elevated` (`#1B2438`) | `border-default` + backdrop | Modals, dialogs, drawers |

### 16.2 Shadow Usage (Minimal)
Shadows are used sparingly in the dark theme, primarily for:
- **Glow effects:** Primary, secondary, and tertiary colored glows for active/focus states.
- **Modal backdrop:** A dark scrim (`Surface-Overlay`) behind modals.
- **Dropdown elevation:** A very subtle dark shadow (`shadow-md`) to separate dropdowns from content.

### 16.3 Backdrop Rules
- Modal backdrops use `Surface-Overlay` (`rgba(15, 23, 42, 0.85)`).
- Drawer backdrops use `Surface-Overlay` at 70% opacity.
- Dropdown backdrops do not use a scrim — the dropdown itself provides sufficient separation via elevation.


---

## 17. Icon System (Lucide React)

### 17.1 Icon Library
**Lucide React** is the sole icon library for the platform. No other icon library (FontAwesome, Material Icons, Heroicons) is permitted without explicit design team approval.

### 17.2 Icon Sizing
| Token | Size | Usage |
|-------|------|-------|
| **icon-xs** | 12px | Inline text icons, compact table actions |
| **icon-sm** | 16px | Button icons, form field leading icons, inline actions |
| **icon-md** | 20px | Sidebar navigation icons, card header icons |
| **icon-lg** | 24px | Stat card icons, feature callout icons |
| **icon-xl** | 32px | Empty state icons, modal header icons |
| **icon-2xl** | 40px | Auth card icons, large feature illustrations |

### 17.3 Icon Color Rules
- Default icon color: `text-secondary` (`#94A3B8`).
- Active/selected icon color: `Primary-400` (`#A78BFA`) or white.
- Success icon color: `Secondary-400` (`#2DD4BF`).
- Danger icon color: `Tertiary-400` (`#F472B6`).
- Disabled icon color: `text-muted` (`#64748B`) at 50% opacity.

### 17.4 Icon + Text Pairing
- Icon-to-text gap: `space-2` (8px).
- Icons are always aligned to the text baseline or vertically centered with the text.
- In buttons, icons are placed on the leading edge (left) by default, or trailing edge (right) for directional actions (e.g., "Next →").

### 17.5 Required Icon Mapping
The following Lucide icons are mapped to specific platform concepts and must be used consistently:

| Concept | Lucide Icon | Notes |
|---------|-------------|-------|
| Dashboard | `LayoutDashboard` | Sidebar nav, breadcrumbs |
| Orders | `ShoppingCart` | Sidebar nav, order-related actions |
| Products | `Package` | Sidebar nav, product management |
| Inventory | `Warehouse` | Sidebar nav, stock management |
| AI / Intelligence | `Sparkles` | AI Insight cards, AI features |
| Settings | `Settings` | Sidebar nav, settings pages |
| Workspace | `Building2` | Workspace settings, store management |
| Analytics | `BarChart3` | Analytics pages, stat cards |
| Subscription | `CreditCard` | Subscription pages, billing |
| Channels | `MessageSquare` | Messenger integration, channels |
| Search | `Search` | Search inputs, global search |
| Notification | `Bell` | Notification bell, alerts |
| User / Profile | `User` | User menu, profile pages |
| Logout | `LogOut` | Sign out actions |
| Add / Create | `Plus` | Create buttons, add actions |
| Edit | `Pencil` | Edit actions, inline editing |
| Delete / Remove | `Trash2` | Destructive actions |
| View / Details | `Eye` | View details, preview |
| Close | `X` | Close modals, dismiss notifications |
| Check / Success | `Check` | Success states, confirmations |
| Alert / Warning | `AlertTriangle` | Warnings, alerts |
| Error / Danger | `AlertCircle` | Errors, critical alerts |
| Info | `Info` | Informational tooltips |
| Chevron Right | `ChevronRight` | Navigation, breadcrumbs, expandable rows |
| Chevron Down | `ChevronDown` | Dropdowns, expandable sections |
| Filter | `Filter` | Filter controls |
| Export | `Download` | Export actions |
| Refresh | `RefreshCw` | Refresh, sync actions |
| Lock | `Lock` | Security, password fields |
| Mail | `Mail` | Email fields, contact |
| Phone | `Phone` | Phone fields, contact |
| Calendar | `Calendar` | Date pickers, scheduling |
| Clock | `Clock` | Timestamps, history |
| Arrow Right | `ArrowRight` | CTA buttons, directional actions |
| External Link | `ExternalLink` | Links that open externally |
| More Actions | `MoreHorizontal` | Overflow menus, context menus |
| Sort | `ArrowUpDown` | Table column sorting |
| Drag | `GripVertical` | Reorderable lists |
| Upload | `Upload` | File upload actions |
| Image | `Image` | Image placeholders |
| Help | `HelpCircle` | Help links, support |
| Menu | `Menu` | Mobile hamburger menu |

---

## 18. Layout Rules

### 18.1 App Shell Structure
All authenticated pages share a common layout structure:

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar (fixed, ~240px) │ Header (~64px height)              │
│                         ├────────────────────────────────────┤
│                         │                                    │
│                         │ Page Content (scrollable)          │
│                         │                                    │
│                         │                                    │
└─────────────────────────┴────────────────────────────────────┘
```

### 18.2 Sidebar Rules
- **Width:** 240px (fixed, not responsive within desktop breakpoints).
- **Position:** Fixed left, full viewport height.
- **Background:** `Surface-Primary` (`#0F172A`).
- **Content:** Logo header, navigation items, user profile footer.
- **Behavior:** Always expanded on desktop. Collapsible to icon-only (~64px) on tablet and below (future enhancement).
- **Z-index:** `z-sticky` (200).

### 18.3 Header Rules
- **Height:** 64px (fixed).
- **Position:** Fixed top, spanning from sidebar right edge to viewport right edge.
- **Background:** `Surface-Primary` (`#0F172A`) with subtle bottom border (`border-subtle`).
- **Content:** Left side = search input or breadcrumbs. Right side = notifications, help, user menu.
- **Z-index:** `z-sticky` (200).

### 18.4 Content Area Rules
- **Position:** Offset from sidebar (240px) and header (64px).
- **Padding:** `space-8` (32px) horizontal, `space-6` (24px) vertical.
- **Background:** `Surface-Base` (`#0B1120`).
- **Scroll:** Vertical scroll only, independent of sidebar and header.
- **Min-height:** `100vh - 64px` (full viewport minus header).

### 18.5 Page Title Area
- **Layout:** Full width, above content grid.
- **Structure:** Page title (`text-display`) + optional subtitle (`text-body-sm`, `text-secondary`) + optional action buttons (right-aligned).
- **Spacing:** `space-6` (24px) bottom margin before content.

---

## 19. Grid System

### 19.1 Content Grid
The content area uses a **12-column grid** for desktop layouts:

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Desktop (≥1280px) | 12 | 24px (`space-6`) | 32px (`space-8`) |
| Laptop (≥1024px) | 12 | 20px (`space-5`) | 24px (`space-6`) |
| Tablet (≥768px) | 8 | 16px (`space-4`) | 16px (`space-4`) |
| Mobile (<768px) | 4 | 12px (`space-3`) | 16px (`space-4`) |

### 19.2 Common Column Spans
- **Stat cards row:** 4 cards × 3 columns each (12 total).
- **Two-column layout:** 8 columns + 4 columns, or 6 + 6.
- **Three-column layout:** 4 + 4 + 4.
- **Single column:** 12 columns (full width).
- **Sidebar + content:** Sidebar is outside the grid; content grid starts after sidebar offset.

### 19.3 Grid Rules
- All cards and panels should align to the grid columns.
- Gutters are consistent within a breakpoint; never mix gutter sizes in the same row.
- On tablet and below, 3-column layouts collapse to 1-column stacked.
- On mobile, all multi-column layouts collapse to single column.

---

## 20. Container Width Rules

### 20.1 Max Widths
| Token | Value | Usage |
|-------|-------|-------|
| **container-sm** | 640px | Narrow forms, auth cards, centered dialogs |
| **container-md** | 768px | Medium forms, settings panels |
| **container-lg** | 1024px | Wide forms, detail pages |
| **container-xl** | 1280px | Dashboard content, list pages |
| **container-2xl** | 1440px | Maximum content width for ultra-wide screens |
| **container-full** | 100% | Full-bleed layouts, tables, data grids |

### 20.2 Container Rules
- Dashboard and list pages use `container-full` (full width of content area) to maximize data density.
- Auth pages center their cards within `container-sm` (640px max).
- Settings pages use `container-md` (768px max) for readable form layouts.
- Detail pages (Order Details, Product Details) use `container-lg` (1024px max).
- The content area itself is fluid; containers constrain internal content.

---

## 21. Responsive Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| **sm** | 640px | Small tablets, large phones |
| **md** | 768px | Tablets, small laptops |
| **lg** | 1024px | Laptops, small desktops |
| **xl** | 1280px | Standard desktops |
| **2xl** | 1536px | Large desktops, ultra-wide |

### 21.1 Responsive Behavior by Breakpoint
- **≥1280px (xl):** Full sidebar (240px), 12-column grid, all features visible.
- **≥1024px (lg):** Full sidebar, 12-column grid, minor spacing adjustments.
- **≥768px (md):** Full sidebar, 8-column grid, some 3-column layouts collapse to 2-column.
- **<768px (sm):** Sidebar collapses to hamburger menu (future), 4-column grid, all layouts stack to single column.

### 21.2 Mobile-First Approach
All styles are written mobile-first. Base styles target the smallest viewport, and breakpoints add complexity for larger screens. This ensures the interface works on all devices even if some features are hidden or simplified on smaller screens.


---

## 22. Dark Theme Guidelines

### 22.1 Dark-First Philosophy
The dark theme is the **canonical and only theme** at launch. Every design decision is optimized for dark backgrounds. Light theme support is a future consideration and must not compromise the dark theme's quality.

### 22.2 Dark Theme Principles
1. **Contrast ratios:** All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text) against its background.
2. **Color temperature:** The palette leans cool (blue-violet) rather than warm. This reduces eye strain during prolonged use.
3. **Saturation discipline:** Background colors are desaturated (slate/navy). Only accent colors (primary, secondary, tertiary) carry full saturation.
4. **Elevation via lightness:** Higher elevation = lighter surface color, not darker. This inverts the light-theme convention and must be consistently applied.
5. **Glow over shadow:** Active states and focus rings use colored glows rather than dark shadows. This is more visible and aesthetically appropriate for dark themes.

### 22.3 Dark Theme Color Relationships
- Text on `Surface-Base` (`#0B1120`): Use `text-primary` (`#E2E8F0`) for headings, `text-secondary` (`#94A3B8`) for body.
- Text on `Surface-Secondary` (`#131C2E`): Same as above — the contrast difference is minimal.
- Text on `Primary-500` (`#8B5CF6`): Use white for maximum contrast on primary buttons.
- Text on `Secondary-400` (`#2DD4BF`): Use `Neutral-900` (`#0F172A`) for dark text on teal backgrounds.
- Text on `Tertiary-400` (`#F472B6`): Use `Neutral-900` for dark text on pink backgrounds.

### 22.4 Future Light Theme Considerations
If a light theme is introduced in the future:
- All CSS variables must be re-mappable via a `data-theme="light"` attribute.
- Surface colors would invert (light backgrounds, dark text).
- Semantic colors would remain the same (success is still green, danger is still red).
- Primary, secondary, and tertiary brand colors would remain unchanged.
- Shadows would become more prominent; glows would be reduced.

---

## 23. HeroUI v3 Customization Rules

### 23.1 HeroUI Integration Strategy
HeroUI v3 provides foundational components (Button, Input, Card, Modal, etc.) that must be **thematically customized** to match the Smart Commerce AI design system. HeroUI components are never used with default styling — they are always wrapped or themed.

### 23.2 Required Customizations

| HeroUI Component | Customization Required |
|-----------------|----------------------|
| **Button** | Override primary color to `Primary-500`, radius to `radius-md`, remove default shadow |
| **Input** | Override background to `Surface-Secondary`, border to `border-default`, focus border to `border-active`, radius to `radius-md` |
| **Card** | Override background to `Surface-Secondary`, border to `border-default`, radius to `radius-xl`, remove default shadow |
| **Modal** | Override background to `Surface-Elevated`, backdrop to `Surface-Overlay`, radius to `radius-2xl` |
| **Dropdown** | Override background to `Surface-Elevated`, border to `border-default`, radius to `radius-lg` |
| **Badge** | Override radius to `radius-full`, map color variants to semantic colors |
| **Tooltip** | Override background to `Surface-Elevated`, text to `text-primary`, radius to `radius-lg` |
| **Tabs** | Override active indicator to `Primary-500`, text to semantic colors |
| **Select** | Override trigger background to `Surface-Secondary`, dropdown to `Surface-Elevated` |
| **Checkbox / Radio** | Override checked state to `Primary-500`, border to `border-default` |
| **Switch** | Override active track to `Primary-500`, thumb to white |
| **Progress** | Override fill to `Primary-500`, track to `Surface-Tertiary` |
| **Skeleton** | Override base color to `Surface-Tertiary`, highlight to `Surface-Elevated` |
| **Toast / Snackbar** | Override background to semantic color backgrounds, text to `text-primary` |

### 23.3 HeroUI Theme Configuration
A centralized HeroUI theme configuration file must be created that maps all HeroUI tokens to the design system CSS variables. This ensures consistency and makes future theme changes trivial.

### 23.4 HeroUI Component Restrictions
- Do not use HeroUI components that have no design system equivalent without design team approval.
- Do not mix HeroUI default colors with design system colors in the same component.
- Always verify that HeroUI's dark-mode defaults align with the design system; override where they diverge.

---

## 24. Tailwind Rules

### 24.1 Tailwind Configuration
The Tailwind configuration must be extended to include all design system tokens. The default Tailwind color palette is **not used** — all colors are replaced with design system tokens.

### 24.2 Required Tailwind Extensions
- **Colors:** All brand colors (primary, secondary, tertiary, neutral scales), semantic colors, surface colors, border colors, text colors.
- **Font Family:** `font-headline` (Plus Jakarta Sans), `font-body` (Inter).
- **Font Size:** All `text-*` tokens from the type scale.
- **Spacing:** All `space-*` tokens from the spacing scale.
- **Border Radius:** All `radius-*` tokens.
- **Box Shadow:** All `shadow-*` tokens (minimal, dark-theme optimized).
- **Z-Index:** All `z-*` tokens.
- **Transitions:** All `transition-*` tokens.

### 24.3 Tailwind Usage Rules
- Always use design system tokens (e.g., `bg-surface-secondary`, `text-primary`, `radius-xl`) instead of arbitrary values.
- Arbitrary values (e.g., `w-[123px]`, `text-[#123456]`) are prohibited except in rare, justified cases with a code comment explaining the exception.
- Use Tailwind's `@apply` directive sparingly — prefer component composition over utility extraction.
- Tailwind's `dark:` modifier is not needed since the platform is dark-only; however, keep it available for future light theme support.

### 24.4 Tailwind + CSS Variables
Tailwind classes should reference CSS variables, not hardcoded values. This ensures that runtime theme switching (future light mode) works correctly.

---

## 25. Motion & Animation Guidelines

### 25.1 Animation Philosophy
Motion in Smart Commerce AI serves three purposes:
1. **Feedback:** Confirming that an action was received (button press, form submission).
2. **Orientation:** Guiding attention to state changes (new data, errors, completions).
3. **Delight:** Adding polish to high-value moments (AI insights, success states).

Motion is never gratuitous. Every animation has a purpose and a duration.

### 25.2 Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| **duration-fast** | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover states, color transitions, opacity changes |
| **duration-base** | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button presses, focus rings, dropdown opens |
| **duration-slow** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Modal opens, card expansions, sidebar transitions |
| **duration-spring** | 400ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success animations, celebratory feedback, AI insight reveals |
| **duration-stagger** | 50ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Delay between staggered list item animations |

### 25.3 Common Animation Patterns

| Pattern | Implementation | Duration | Usage |
|---------|---------------|----------|-------|
| **Fade In** | `opacity: 0 → 1` | `duration-base` | Page transitions, modal content, toasts |
| **Slide Up** | `translateY(8px) → translateY(0)` + fade | `duration-slow` | Modal content, dropdown menus, cards |
| **Scale In** | `scale(0.95) → scale(1)` + fade | `duration-slow` | Popovers, tooltips, context menus |
| **Slide In Right** | `translateX(100%) → translateX(0)` | `duration-slow` | Drawers, side panels |
| **Pulse** | `scale(1) → scale(1.05) → scale(1)` | `duration-spring` | AI insight attention, new notification |
| **Shimmer** | Gradient sweep across surface | 1.5s linear infinite | Skeleton loading states |
| **Spin** | `rotate(0) → rotate(360deg)` | 1s linear infinite | Loading indicators |
| **Bounce** | `translateY(0) → translateY(-4px) → translateY(0)` | `duration-spring` | Success checkmark, notification dot |

### 25.4 Stagger Animation Rules
When animating lists or grids of items:
- Use a stagger delay of `duration-stagger` (50ms) between items.
- Maximum stagger delay: 500ms total (i.e., max 10 items with stagger before cutting off).
- Stagger direction: top-to-bottom for vertical lists, left-to-right for horizontal grids.

### 25.5 Reduced Motion
All animations must respect the user's `prefers-reduced-motion` preference:
- When `prefers-reduced-motion: reduce` is active, all animations become instant (0ms duration).
- Transitions still occur but without intermediate frames.
- No parallax, no continuous motion, no auto-playing animations.

### 25.6 Performance Rules
- All animations use `transform` and `opacity` only — never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Use `will-change: transform` on elements that animate frequently (e.g., sidebar, drawers).
- Avoid blur filters during animations — they are GPU-intensive.
- Limit the number of simultaneously animated elements to 10 or fewer.


---

## 26. Accessibility Guidelines

### 26.1 WCAG Compliance Target
The platform targets **WCAG 2.1 Level AA** compliance as the minimum standard. Level AAA is pursued where feasible without compromising the design intent.

### 26.2 Color Contrast
- Normal text (≤18px): Minimum 4.5:1 contrast ratio against background.
- Large text (>18px or bold >14px): Minimum 3:1 contrast ratio against background.
- UI components (buttons, inputs, icons): Minimum 3:1 contrast ratio against adjacent colors.
- All color combinations must be verified with a contrast checker before production.

### 26.3 Keyboard Navigation
- All interactive elements must be reachable via Tab key.
- Tab order follows visual reading order (left-to-right, top-to-bottom).
- Focus indicators are always visible and use the `border-active` color (`#8B5CF6`) with a 2px ring.
- No keyboard traps — users must be able to Tab into and out of any component.
- Modal dialogs trap focus within the modal while open.

### 26.4 Screen Reader Support
- All images must have meaningful `alt` text or be marked `aria-hidden="true"` if decorative.
- All form inputs must have associated `<label>` elements (visually hidden labels are acceptable if an icon or placeholder clearly indicates purpose).
- All buttons must have descriptive text. Icon-only buttons must have `aria-label`.
- Live regions (`aria-live`) must be used for dynamic content updates (toasts, real-time data).
- Status badges must include screen-reader-only text describing the status (e.g., "Status: Approved").

### 26.5 Touch Targets
- Minimum touch target size: 44×44px on touch devices.
- Buttons and interactive elements must have adequate padding to meet this minimum.
- Adjacent touch targets must have at least 8px spacing between them.

### 26.6 Motion Sensitivity
- Respect `prefers-reduced-motion` (see Section 25.5).
- No auto-playing animations that cannot be paused.
- No flashing content (more than 3 flashes per second).

### 26.7 Form Accessibility
- All form errors must be associated with their inputs via `aria-describedby`.
- Error messages must be clear, specific, and actionable.
- Required fields must be indicated visually (asterisk or "Required" label) and via `aria-required="true"`.
- Form submission must be possible via Enter key from any input.

### 26.8 Table Accessibility
- All data tables must use `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>` elements (not div-based tables).
- Column headers must use `<th scope="col">`.
- Row headers (if applicable) must use `<th scope="row">`.
- Complex tables must include `aria-label` or `aria-labelledby` describing the table's purpose.

---

## 27. Component Design Rules

### 27.1 Component Architecture
All UI components follow a consistent architecture:

1. **Atomic Design Hierarchy:**
   - **Atoms:** Buttons, inputs, badges, icons, labels (single HTML element).
   - **Molecules:** Form fields (label + input + error), stat cards (icon + value + label), table rows.
   - **Organisms:** Data tables, modals, sidebars, cards with complex content.
   - **Templates:** Page layouts (dashboard layout, auth layout, settings layout).
   - **Pages:** Concrete implementations of templates with real data.

2. **Component Composition:**
   - Prefer composition over configuration. A card should accept children, not a dozen boolean props.
   - Use compound component patterns for complex components (e.g., `<Modal>`, `<Modal.Header>`, `<Modal.Body>`, `<Modal.Footer>`).

3. **Props API:**
   - All components must have TypeScript interfaces.
   - Props should be named descriptively (e.g., `isLoading`, `isDisabled`, `onAction`).
   - Avoid prop drilling — use context or state management for deeply shared data.

### 27.2 Component States
Every interactive component must account for these states:

| State | Visual Treatment | Interaction |
|-------|-----------------|-------------|
| **Default** | Standard styling | Fully interactive |
| **Hover** | Slightly lighter background or border color change | Cursor pointer |
| **Active / Pressed** | Darker background, reduced scale (0.98) | Visual press feedback |
| **Focus** | 2px `border-active` ring, offset 2px | Keyboard navigable |
| **Disabled** | Reduced opacity (50%), `cursor: not-allowed`, no hover | Non-interactive |
| **Loading** | Spinner or skeleton replaces content, reduced opacity | Non-interactive |
| **Error** | `border-error` color, error icon, error message | Interactive, shows validation |
| **Success** | `border-success` color, check icon | Interactive, shows validation |

### 27.3 Component Documentation
Every reusable component must include:
- A brief description of its purpose.
- A props table with types, defaults, and descriptions.
- Usage examples (at least one common use case).
- Accessibility notes (if applicable).
- Design system tokens used (colors, spacing, typography).

---

## 28. Component Naming Convention

### 28.1 Naming Rules
- Components use **PascalCase** (e.g., `MetricCard`, `DataTable`, `AuthLayout`).
- Component files use **kebab-case** matching the component name (e.g., `metric-card.tsx`, `data-table.tsx`).
- One primary export per file, with named exports for sub-components (e.g., `DataTable.Row`, `DataTable.Cell`).
- Hooks use **camelCase** prefixed with `use` (e.g., `useDashboardStats`, `useOrderList`).
- Utility functions use **camelCase** (e.g., `formatCurrency`, `calculateTrend`).

### 28.2 Folder Organization
Components are organized by scope and reusability:

```
src/shared/ui/
├── atoms/           # Buttons, inputs, badges, icons
├── molecules/       # Form fields, stat cards, table rows
├── organisms/       # Data tables, modals, sidebars
├── templates/       # Page layouts
└── hooks/           # Shared UI hooks
```

### 28.3 Naming Prefixes
- **Layout components:** Suffix with `Layout` (e.g., `DashboardLayout`, `AuthLayout`).
- **Page components:** Suffix with `Page` (e.g., `OrdersPage`, `ProductsPage`).
- **Card components:** Suffix with `Card` (e.g., `MetricCard`, `AIInsightCard`).
- **Modal components:** Suffix with `Modal` (e.g., `CreateProductModal`, `ConfirmDeleteModal`).
- **Form components:** Suffix with `Form` (e.g., `ProductForm`, `LoginForm`).

---

## 29. UI State Rules

### 29.1 State Categories
UI states are categorized by their cause and visual treatment:

| Category | Cause | Visual Treatment |
|----------|-------|-----------------|
| **Loading** | Data is being fetched | Skeleton screens, spinners, shimmer effects |
| **Empty** | Data exists but is zero-length | Empty state illustrations, helpful copy, CTA |
| **Error** | Data fetch or operation failed | Error messages, retry buttons, fallback UI |
| **Success** | Operation completed successfully | Success toasts, checkmarks, green accents |
| **Partial** | Some data loaded, some failed | Loaded content + inline error for failed sections |
| **Stale** | Data may be outdated | Timestamp indicator, refresh button, subtle warning |

### 29.2 State Transition Rules
- Loading states should transition smoothly to content states (fade in, not snap).
- Error states should be clearly distinguishable from empty states (different icons, different copy).
- Success states should auto-dismiss after 5 seconds (toasts) or persist until user action (inline confirmations).
- Partial states should show what loaded successfully while clearly marking what failed.

### 29.3 State Persistence
- Form input values persist across navigation (using state management or session storage).
- Table filters and sort state persist per session (using URL query parameters or state management).
- Modal/drawer open state does not persist across navigation.

---

## 30. Form Design Rules

### 30.1 Form Layout
- Forms use a **single-column layout** by default for readability.
- Two-column layouts are permitted for closely related fields (e.g., First Name / Last Name, Password / Confirm Password).
- Field labels sit **above** the input, not inline or to the left.
- Label text: uppercase, `text-label` size, `tracking-wide`, `text-secondary` color.
- Helper text sits below the input, `text-caption` size, `text-muted` color.
- Error text sits below the input, `text-caption` size, `text-tertiary` color, with an error icon prefix.

### 30.2 Input Styling
- Background: `Surface-Secondary` (`#131C2E`).
- Border: `border-thin` (`1px`) `border-default` (`#232D42`).
- Border radius: `radius-md` (10px).
- Padding: `space-3` (12px) horizontal, `space-3` (12px) vertical.
- Text color: `text-primary` (`#E2E8F0`).
- Placeholder color: `text-placeholder` (`#475569`).
- Focus: `border-active` (`#8B5CF6`) with a 2px ring and `shadow-glow-primary`.
- Error: `border-error` (`#F472B6`) with error icon and message.
- Disabled: 50% opacity, `cursor: not-allowed`.

### 30.3 Input Types
| Type | Leading Icon | Notes |
|------|-------------|-------|
| **Text** | Optional (e.g., `User`, `Building2`) | Default input type |
| **Email** | `Mail` | Validates email format |
| **Password** | `Lock` | Toggle show/hide with eye icon |
| **Number** | None | Right-aligned text, stepper controls optional |
| **Tel** | `Phone` | Phone number formatting |
| **Search** | `Search` | Clear button appears when text entered |
| **Select** | `ChevronDown` | Dropdown trigger style |
| **Textarea** | None | Auto-resize preferred, min 3 rows |
| **Date** | `Calendar` | Date picker overlay |
| **File** | `Upload` | Drag-and-drop zone preferred |

### 30.4 Form Actions
- Primary action (Submit/Save) is left-aligned or full-width at the bottom.
- Secondary action (Cancel/Reset) is to the right of the primary action or below it.
- Destructive action (Delete) is separated from other actions (e.g., left-aligned while save is right-aligned, or in a separate section).
- All form actions use the Button component with appropriate variants.

### 30.5 Form Validation
- Validation occurs on **blur** for individual fields and on **submit** for the entire form.
- Inline errors appear immediately below the invalid field.
- Form-level errors appear at the top of the form in an alert banner.
- Success messages appear as a toast or inline confirmation after submission.
- Never use browser-native validation UI (tooltips) — always use custom styled error messages.


---

## 31. Table Design Rules

### 31.1 Table Structure
- Tables use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`).
- Header row: uppercase labels, `text-label` size, `text-secondary` color, no background separation (subtle bottom border only).
- Body rows: `text-body-sm` size, `text-primary` color, hairline bottom border (`border-subtle`).
- Row height: 56px minimum (for touch targets and readability).
- Cell padding: `space-4` (16px) horizontal, `space-3` (12px) vertical.

### 31.2 Table Header
- Column headers are sortable where applicable, indicated by `ArrowUpDown` icon.
- Active sort column shows the sort direction icon (`ArrowUp` or `ArrowDown`).
- Column headers may include tooltips (`HelpCircle` icon) for complex columns.
- Sticky headers: table headers remain visible when scrolling vertically.

### 31.3 Table Body
- Rows alternate subtly (no zebra striping; use subtle hover state instead).
- Hover state: `Surface-Tertiary` background, `duration-fast` transition.
- Selected row: `Primary-500` left border (3px), `Primary-900` background at 30% opacity.
- Empty rows: not rendered; empty state shown instead (see Section 40).

### 31.4 Table Cells
- Text cells: left-aligned, `text-primary` or `text-secondary`.
- Numeric cells: right-aligned, `tabular-nums`, `text-primary`.
- Status cells: centered, rendered as Status Badge component.
- Action cells: right-aligned, icon buttons (ghost style) or text links.
- Avatar cells: left-aligned, avatar + name + subtitle pattern.

### 31.5 Table Pagination
- Pagination bar sits below the table, separated by `space-6` (24px).
- "Showing X of Y" text on the left, page numbers in the center, prev/next on the right.
- Active page: filled `Primary-500` pill.
- Inactive pages: ghost style, `text-secondary`.
- Disabled prev/next: 50% opacity, `cursor: not-allowed`.

### 31.6 Table Actions
- Bulk actions: checkbox in header row + action bar that appears when items selected.
- Row actions: icon buttons (View, Edit, Delete) in the rightmost column.
- Expandable rows: chevron icon in first column, expands to show details below.

---

## 32. Card Design Rules

### 32.1 Card Structure
Cards are the primary content container across the platform. Every card follows this structure:

```
┌─────────────────────────────────────┐
│ [Icon]  Title              [Badge]  │  ← Header (optional)
├─────────────────────────────────────┤
│                                     │
│ Content area                        │  ← Body
│                                     │
├─────────────────────────────────────┤
│ [Action]              [Secondary]   │  ← Footer (optional)
└─────────────────────────────────────┘
```

### 32.2 Card Styling
- Background: `Surface-Secondary` (`#131C2E`).
- Border: `border-thin` (`1px`) `border-default` (`#232D42`).
- Border radius: `radius-xl` (16px).
- Padding: `space-6` (24px) all sides.
- No shadow (elevation via border + fill, not shadow).

### 32.3 Card Variants

| Variant | Background | Border | Usage |
|---------|-----------|--------|-------|
| **Default** | `Surface-Secondary` | `border-default` | Standard content cards |
| **Elevated** | `Surface-Tertiary` | `border-default` | Hover state, active cards, dropdowns |
| **AI Insight** | `Primary-900` at 30% opacity | `Primary-700` at 50% opacity | AI recommendations, premium features |
| **Alert** | `Tertiary-900` at 30% opacity | `Tertiary-700` at 50% opacity | Warnings, errors, critical notifications |
| **Success** | `Secondary-900` at 30% opacity | `Secondary-700` at 50% opacity | Success confirmations, positive states |

### 32.4 Card Header
- Icon: `icon-lg` (24px) in a rounded-square chip (`radius-lg`, 12px), colored per card variant.
- Title: `text-headline` size, `font-headline`, `text-primary`.
- Badge: right-aligned, Status Badge component.
- Header padding-bottom: `space-4` (16px), separated by `border-subtle` divider.

### 32.5 Card Body
- Content flows naturally within padding.
- No internal borders unless content is explicitly sectioned.
- Tables inside cards: remove card padding for the table, table fills card width.

### 32.6 Card Footer
- Actions aligned to the right by default.
- Primary action on the right, secondary on the left (or stacked below on mobile).
- Footer padding-top: `space-4` (16px), separated by `border-subtle` divider.

---

## 33. AI Component Design Rules

### 33.1 AI Insight Card
The AI Insight Card is a **brand-defining component** that appears across multiple screens. It must be implemented with special care.

**Structure:**
- Background: gradient from `Primary-900` at 50% opacity to `Surface-Secondary`.
- Border: `Primary-700` at 50% opacity, `radius-xl` (16px).
- Icon: `Sparkles` (`icon-lg`, `Primary-400`) in a rounded-square chip with `Primary-500` background at 20% opacity.
- Title: "AI Insight" or context-specific title, `text-title` size, `font-headline`, `Primary-400`.
- Body: Description text, `text-body-sm`, `text-secondary`.
- Stats: Key metrics displayed as label-value pairs (e.g., "Confidence Score: 98.2%").
- CTA: Primary button ("Authorize Bulk Restock", "View Details", etc.).

**States:**
- **Loading:** Shimmer effect across the card, pulsing glow.
- **Ready:** Full content visible, sparkle icon has subtle pulse animation.
- **Error:** Border changes to `Tertiary-500`, icon changes to `AlertCircle`, error message displayed.

### 33.2 AI Badge
- A small pill badge used to indicate AI-powered features.
- Background: `Primary-500` at 15% opacity.
- Text: "AI" or "PREMIUM", `text-label` size, `Primary-400`.
- Border radius: `radius-full` (9999px).
- Icon: `Sparkles` (`icon-xs`) optional prefix.

### 33.3 AI Sparkle Icon
- The `Sparkles` icon is reserved exclusively for AI-related features.
- Never use `Sparkles` for non-AI functionality (e.g., favorites, ratings).
- The sparkle icon may have a subtle continuous pulse animation on AI Insight cards.

### 33.4 AI Confidence Indicator
- Displayed as a horizontal progress bar or percentage.
- High confidence (≥90%): `Secondary-400` color.
- Medium confidence (70–89%): `Primary-400` color.
- Low confidence (<70%): `Tertiary-400` color, with warning icon.

---

## 34. Navigation Rules

### 34.1 Sidebar Navigation
- **Width:** 240px fixed.
- **Background:** `Surface-Primary` (`#0F172A`).
- **Items:** Icon (`icon-md`, 20px) + Label (`text-body-sm`, `font-body`).
- **Spacing:** `space-3` (12px) vertical padding per item, `space-4` (16px) horizontal padding.
- **Gap:** `space-3` (12px) between icon and label.
- **Active state:** Filled `Primary-500` rounded rectangle (`radius-lg`), white icon + text.
- **Inactive state:** Transparent background, `text-secondary` icon + text.
- **Hover state:** `Surface-Tertiary` background, `text-primary` icon + text.
- **Disabled state:** 50% opacity, `cursor: not-allowed`.

### 34.2 Sidebar Sections
- **Top section:** Logo + product name + optional kicker (e.g., "ENTERPRISE AI").
- **Middle section:** Navigation items grouped by category (optional section headers).
- **Bottom section:** User profile block (avatar + name + role + chevron).

### 34.3 Breadcrumbs
- Format: `Parent › Current Page` (e.g., "Orders › Order #ORD-8821").
- Separator: `›` character, `text-muted` color.
- Parent link: `text-secondary`, hover `text-primary`.
- Current page: `text-primary`, `font-semibold`, not clickable.
- Location: Below the header, above the page title.

### 34.4 Top Navigation (Header)
- **Left:** Search input (full-width pill, `Search` icon, placeholder text).
- **Right:** Notification bell (`Bell` icon, with unread dot when applicable), Help icon (`HelpCircle`), User menu (avatar + name + role + chevron dropdown).
- **Height:** 64px.
- **Border:** Bottom `border-subtle` divider.

### 34.5 Settings Sub-Navigation
- Used in settings pages (Workspace Settings, Account Settings).
- Vertical list of tabs on the left side of the content area.
- Active tab: filled `Primary-500` pill, white text.
- Inactive tab: transparent, `text-secondary` text.
- Width: ~200px.

---

## 35. Dashboard Layout Rules

### 35.1 Dashboard Structure
The Dashboard follows a consistent vertical stack:

```
Page Title + Subtitle + Time Range Selector
├── Stat Cards Row (4 columns)
├── Two-Column Widget Row (Chart + Priority Actions)
├── Three-Column Widget Row (Logs + Distribution + AI Insight)
└── Footer Bar
```

### 35.2 Stat Cards Row
- 4 cards in a row, each spanning 3 columns (12-column grid).
- Each card: MetricCard component with icon, value, label, trend/badge, caption.
- Card height: consistent (auto, but min 120px).
- Gap: `space-6` (24px) between cards.

### 35.3 Widget Rows
- **Two-column:** Large widget (8 columns) + Side widget (4 columns).
- **Three-column:** Three equal widgets (4 columns each).
- Widgets use Card component with appropriate variant.
- Gap: `space-6` (24px) between widgets.

### 35.4 Time Range Selector
- Segmented control: 7D / 30D / 90D / Custom Range.
- Active segment: filled `Primary-500` pill.
- Inactive segments: ghost style, `text-secondary`.
- Location: Top-right of page title area.

### 35.5 Dashboard Footer
- Minimal footer bar at the bottom of the content area.
- Left: Copyright text, `text-caption`, `text-muted`.
- Center: System status dot (green = healthy, amber = degraded, red = down) + status text.
- Right: Documentation links, `text-caption`, `text-secondary`.

---

## 36. Auth Layout Rules

### 36.1 Auth Shell Variants
Two distinct auth layouts are used:

**Variant A: Centered Single Card**
- Used for: Forgot Password, Reset Password, Register.
- Full-bleed dark background with radial gradient glow blobs (`Primary-500` at 20% opacity, `blur(80–120px)`).
- Centered card: `container-sm` (640px max), `Surface-Secondary` background, `radius-2xl` (20px).
- Optional: subtle dot-grid/network pattern in corners.

**Variant B: Split-Screen Two-Column**
- Used for: Login.
- Left column (50%): Marketing content — logo, version badge, headline, subtext, stat cards.
- Right column (50%): Form card — same styling as Variant A.
- Background: `Surface-Base` with gradient glow.

### 36.2 Auth Card Structure
```
[Logo/Icon Badge]
Title (text-hero)
Subtitle (text-body-sm, text-secondary)
[Form Fields]
[Primary CTA Button]
[Secondary Link]
[Social Login Buttons] (Login only)
[Trust Badges Footer] (Register only)
```

### 36.3 Auth Input Styling
- Same as standard inputs (Section 30.2).
- Additional: password field includes show/hide toggle (eye icon).
- Email field includes `Mail` leading icon.
- Password field includes `Lock` leading icon.

### 36.4 Auth Button Styling
- Primary CTA: full-width, `Primary-500` background, white text, trailing `ArrowRight` icon.
- Social login buttons: outlined style, brand-colored icon + text.
- "Keep me logged in" checkbox: standard checkbox, left of label.

### 36.5 Auth Footer
- "Already have an account? Sign In" / "Don't have an account? Register" links.
- Trust badges (Register only): "ISO 27001 Certified", "Instant Setup", "AI-First Engine".
- Security badges (Reset Password only): "End-to-End Encryption", "Multi-Factor Ready".

---

## 37. Settings Layout Rules

### 37.1 Settings Shell
- Uses the standard App Shell (sidebar + header + content).
- Content area is split into two columns: Settings Nav (left, ~200px) + Settings Content (right, fluid).
- Settings Nav: vertical tab list (General, Store, Danger Zone).

### 37.2 Settings Content Panels
- Each settings page contains one or more panels.
- Panel: Card component with title, description, and form fields.
- Panel title: `text-headline` size, `font-headline`.
- Panel description: `text-body-sm`, `text-secondary`, below title.
- Form fields: standard form styling (Section 30).

### 37.3 Danger Zone Panel
- Special styling for destructive actions.
- Background: `Tertiary-900` at 20% opacity.
- Border: `Tertiary-700` at 50% opacity.
- Icon: `AlertTriangle` (`Tertiary-400`).
- Title: "Danger Zone", `text-headline`, `Tertiary-400`.
- Actions: Destructive buttons only (Delete Workspace, etc.).
- Require confirmation: modal dialog with type-to-confirm pattern for destructive actions.

### 37.4 Settings Actions
- Save/Reset buttons at the bottom of each panel.
- Save: Primary button, disabled until changes detected.
- Reset: Secondary button, reverts to last saved state.
- Auto-save is not used — explicit save required for all settings changes.

---

## 38. Workspace Layout Rules

### 38.1 Workspace Shell
- Standard App Shell with sidebar navigation.
- Sidebar includes workspace-specific nav items: Dashboard, Orders, Products, Inventory, AI, Settings.
- User profile block shows current workspace name and user role.

### 38.2 Workspace Switching
- If multi-workspace support is added (future), a workspace switcher dropdown appears in the sidebar header or user profile block.
- Switcher: avatar + workspace name + chevron, dropdown lists available workspaces.
- Active workspace: highlighted in dropdown.

### 38.3 Workspace Branding
- Each workspace may have a custom name and avatar.
- Default avatar: first letter of workspace name in a colored circle.
- Workspace name appears in page titles and breadcrumbs.

---

## 39. Commerce Layout Rules

### 39.1 Orders Layout
- **List page:** Full-width data table with filters, stat cards row above, pagination below.
- **Detail page:** Two-column layout — main content (order info, items, timeline) left, metadata cards (customer, AI analysis, approval) right.
- **Actions:** Approve/Reject buttons prominently displayed on detail page.

### 39.2 Products Layout
- **List page:** Full-width data table with segmented filter tabs, stat cards row, pagination.
- **Detail page:** Single-column stacked panels — Product Information, Inventory Management, AI Forecast.
- **Actions:** Save/Discard buttons at top, Create Product button on list page.

### 39.3 Inventory Layout
- **Dashboard view:** Stat cards + low stock alerts + AI recommendations.
- **Detail view:** Product-specific stock levels, adjustment history, manual adjustment form.
- **Actions:** Adjust Stock button, bulk actions for multiple products.

### 39.4 Commerce Data Patterns
- Currency display: always includes currency symbol (e.g., "$1,420.00").
- Number formatting: thousands separator, two decimal places for currency, integers for quantities.
- Date formatting: relative for recent dates ("2 mins ago"), absolute for older dates ("Jan 15, 2026").
- Status badges: always visible, color-coded per semantic rules (Section 5.1).


---

## 40. Empty States

### 40.1 Empty State Structure
Every list, table, or data-driven view must have a defined empty state:

```
[Icon] (icon-xl or icon-2xl, muted color)
Title (text-headline, text-primary)
Description (text-body-sm, text-secondary)
[CTA Button] (optional, primary variant)
[Secondary Link] (optional)
```

### 40.2 Empty State Styling
- Centered within the content area.
- Icon: `Neutral-500` color, large size (32–40px).
- Title: "No [Items] Yet" or similar, `text-headline`, `text-primary`.
- Description: Helpful copy explaining how to create the first item, `text-body-sm`, `text-secondary`.
- CTA: Primary button to create the first item (e.g., "Create Your First Product").
- Padding: `space-16` (64px) vertical, `space-8` (32px) horizontal.

### 40.3 Empty State Variants

| Context | Icon | Title | CTA |
|---------|------|-------|-----|
| **No Products** | `Package` | "No Products Yet" | "Create Product" |
| **No Orders** | `ShoppingCart` | "No Orders Yet" | "Create Order" |
| **No Inventory** | `Warehouse` | "No Inventory Data" | "Add Stock" |
| **No Search Results** | `Search` | "No Results Found" | "Clear Filters" |
| **No Notifications** | `Bell` | "No Notifications" | None |
| **No AI Insights** | `Sparkles` | "No AI Insights Yet" | "Learn More" |

### 40.4 Empty State Animation
- Fade in with `duration-slow` when transitioning from loading to empty.
- Icon may have a subtle bounce animation on first appearance.

---

## 41. Loading States

### 41.1 Skeleton Loading
- Used for content that takes >300ms to load.
- Skeleton elements: rounded rectangles (`radius-md`) in `Surface-Tertiary` color.
- Shimmer animation: gradient sweep from left to right, 1.5s linear infinite.
- Match skeleton shape to expected content shape (e.g., stat card skeleton = icon chip + title line + value line).

### 41.2 Spinner Loading
- Used for inline actions, button loading, and small components.
- Spinner: `icon-md` (20px) rotating icon (`Loader2` from Lucide).
- Color: `Primary-500` for primary actions, `text-secondary` for secondary.
- Speed: 1s linear infinite rotation.

### 41.3 Progress Loading
- Used for multi-step operations (e.g., bulk imports, AI processing).
- Progress bar: `Primary-500` fill, `Surface-Tertiary` track, `radius-full`.
- Percentage text: `text-body-sm`, `text-secondary`, right-aligned.
- Step indicator: numbered steps with checkmarks for completed steps.

### 41.4 Page Loading
- Full-page loading: centered spinner + "Loading..." text.
- Background: `Surface-Base` with subtle pulse animation.
- Duration: shown only if load takes >500ms; otherwise, content appears instantly.

### 41.5 Button Loading
- Button content replaced by spinner + "Loading..." text.
- Button remains at full width, disabled state.
- Spinner replaces the trailing icon (if present).

---

## 42. Error States

### 42.1 Inline Error
- Appears below the relevant field or component.
- Icon: `AlertCircle` (`icon-sm`, `Tertiary-400`).
- Text: `text-caption`, `Tertiary-400`.
- Animation: slide down with `duration-fast`.

### 42.2 Form Error Summary
- Appears at the top of a form with multiple errors.
- Card variant: Alert (Section 32.3).
- Lists all errors with field names and messages.
- Auto-scrolls to first error on submit.

### 42.3 Page Error
- Full-page error for catastrophic failures (500, network error).
- Centered layout with large error icon (`AlertTriangle`, `icon-2xl`, `Tertiary-400`).
- Title: "Something Went Wrong", `text-display`.
- Description: Helpful message + error code, `text-body-sm`, `text-secondary`.
- Actions: "Try Again" primary button + "Contact Support" secondary link.

### 42.4 Data Fetch Error
- Inline within the content area where data failed to load.
- Card variant: Alert.
- Message: "Failed to load [data]. Please try again."
- Action: "Retry" button.

### 42.5 Error Toast
- Auto-dismissing notification for operation failures.
- Duration: 5 seconds.
- Position: bottom-right of viewport.
- Includes close button (`X` icon).

---

## 43. Success States

### 43.1 Inline Success
- Appears below the relevant field or component after successful validation.
- Icon: `Check` (`icon-sm`, `Secondary-400`).
- Text: `text-caption`, `Secondary-400`.
- Auto-dismisses after 3 seconds or on next interaction.

### 43.2 Success Toast
- Auto-dismissing notification for successful operations.
- Duration: 5 seconds.
- Position: bottom-right of viewport.
- Icon: `CheckCircle` (`Secondary-400`).
- Title: Operation name (e.g., "Product Created").
- Description: Brief confirmation (e.g., "iPhone 15 Pro has been added to your catalog.").

### 43.3 Success Animation
- Checkmark icon draws in with `duration-spring`.
- Confetti or sparkle effect for major milestones (optional, subtle).
- Button returns to default state from loading state.

### 43.4 Success Page
- Used for multi-step flows (registration, checkout).
- Large checkmark icon (`icon-2xl`, `Secondary-400`).
- Title: "Success!", `text-display`.
- Description: Next steps or confirmation details.
- CTA: Primary button to continue (e.g., "Go to Dashboard").

---

## 44. Notification Rules

### 44.1 Toast Notifications
- **Position:** Bottom-right corner, stacked vertically with `space-3` (12px) gap.
- **Max visible:** 5 toasts; older toasts are hidden.
- **Duration:** 5 seconds default, 10 seconds for errors, persistent for actions requiring response.
- **Dismiss:** Click X icon, click anywhere on toast, or auto-dismiss after duration.
- **Animation:** Slide in from right (`duration-slow`), fade out on dismiss (`duration-fast`).

### 44.2 Toast Structure
```
[Icon] Title                    [X]
Description (optional)
[Action Button] (optional)
```

### 44.3 Toast Variants
| Variant | Icon | Background | Border | Usage |
|---------|------|-----------|--------|-------|
| **Success** | `CheckCircle` | `Secondary-900` | `Secondary-700` | Operation completed |
| **Error** | `AlertCircle` | `Tertiary-900` | `Tertiary-700` | Operation failed |
| **Warning** | `AlertTriangle` | Amber dark | Amber | Attention needed |
| **Info** | `Info` | `Primary-900` | `Primary-700` | General information |

### 44.4 In-App Notifications
- Notification bell icon in header with unread dot (red, `Tertiary-500`).
- Dropdown panel: `Surface-Elevated` background, `radius-lg`, max-height 400px, scrollable.
- Notification items: icon + title + description + timestamp.
- Unread items: `Surface-Tertiary` background, bold title.
- Read items: transparent background, normal weight title.
- Mark all as read: secondary button at bottom of panel.

### 44.5 Notification Priority
- **Critical:** Order approval required, low stock alert, system error — immediate toast + persistent in-app.
- **High:** AI insight available, subscription reminder — toast + in-app.
- **Normal:** Activity logs, updates — in-app only.
- **Low:** Marketing, tips — batched daily digest.

---

## 45. Modal Rules

### 45.1 Modal Structure
```
┌─────────────────────────────────────┐
│ [Icon] Title              [X Close]   │  ← Header
├─────────────────────────────────────┤
│                                     │
│ Content                             │  ← Body
│                                     │
├─────────────────────────────────────┤
│ [Cancel]              [Confirm]     │  ← Footer
└─────────────────────────────────────┘
```

### 45.2 Modal Styling
- Background: `Surface-Elevated` (`#1B2438`).
- Border: `border-thin` `border-default`.
- Border radius: `radius-2xl` (20px).
- Max width: `container-sm` (640px) for standard, `container-md` (768px) for wide.
- Padding: `space-8` (32px) all sides.
- Backdrop: `Surface-Overlay` (`rgba(15, 23, 42, 0.85)`), `duration-slow` fade.

### 45.3 Modal Header
- Icon: Optional, `icon-lg`, colored per modal type.
- Title: `text-headline`, `font-headline`, `text-primary`.
- Close button: `X` icon, top-right, ghost button, `text-secondary`.

### 45.4 Modal Body
- Content flows naturally within padding.
- Form modals: standard form styling (Section 30).
- Confirmation modals: clear question + description of consequences.

### 45.5 Modal Footer
- Actions aligned right by default.
- Primary action on the right, secondary (Cancel) on the left.
- Destructive modals: destructive action on the right, cancel on the left.
- Footer separated by `border-subtle` divider.

### 45.6 Modal Types
| Type | Icon | Primary Action | Usage |
|------|------|---------------|-------|
| **Confirm** | `HelpCircle` | "Confirm" | General confirmation |
| **Delete** | `AlertTriangle` | "Delete" (destructive) | Destructive confirmation |
| **Form** | None | "Save" | Create/edit forms |
| **Info** | `Info` | "Got It" | Informational |
| **Success** | `CheckCircle` | "Continue" | Success confirmation |

### 45.7 Modal Behavior
- Close on backdrop click (unless critical).
- Close on Escape key.
- Trap focus within modal while open.
- Return focus to trigger element on close.
- Prevent body scroll while modal is open.

---

## 46. Badge Rules

### 46.1 Badge Structure
- Text only, or icon + text.
- Fully rounded (`radius-full`, 9999px).
- Padding: `space-1` (4px) vertical, `space-2` (8px) horizontal.
- Text: `text-label` size, `font-medium`.

### 46.2 Badge Variants
| Variant | Background | Text | Icon | Usage |
|---------|-----------|------|------|-------|
| **Success** | `Secondary-400` at 15% opacity | `Secondary-400` | Optional `Check` | Approved, active, positive |
| **Warning** | Amber at 15% opacity | Amber | Optional `AlertTriangle` | Pending, low stock |
| **Danger** | `Tertiary-400` at 15% opacity | `Tertiary-400` | Optional `AlertCircle` | Rejected, error, out of stock |
| **Neutral** | `Neutral-500` at 15% opacity | `Neutral-400` | Optional `Info` | Inactive, stable |
| **Primary** | `Primary-500` at 15% opacity | `Primary-400` | Optional `Sparkles` | AI, premium, new |

### 46.3 Badge Sizes
| Size | Padding | Text Size | Usage |
|------|---------|-----------|-------|
| **Small** | `space-1` x `space-2` | `text-caption` | Table cells, compact UI |
| **Medium** | `space-1.5` x `space-3` | `text-label` | Cards, headers |
| **Large** | `space-2` x `space-4` | `text-body-sm` | Marketing, highlights |

### 46.4 Badge Rules
- Never use badges as buttons — they are read-only status indicators.
- Never stack more than 2 badges in a single cell or card header.
- Badge text should be concise (1–3 words max).
- Status badges must use the semantic color mapping (Section 5.1) consistently.

---

## 47. Button Rules

### 47.1 Button Structure
- Text label, optional leading icon, optional trailing icon.
- Minimum height: 40px (touch target).
- Padding: `space-3` (12px) horizontal minimum, `space-2` (8px) vertical.

### 47.2 Button Variants
| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| **Primary** | `Primary-500` | White | None | `Primary-600` | `Primary-700` |
| **Secondary** | Transparent | `Neutral-300` | `border-default` | `Surface-Tertiary` | `Surface-Elevated` |
| **Destructive** | `Tertiary-500` | White | None | `Tertiary-600` | `Tertiary-700` |
| **Ghost** | Transparent | `Neutral-400` | None | `Surface-Tertiary` | `Surface-Elevated` |
| **Outline** | Transparent | `Primary-400` | `Primary-500` | `Primary-900` at 30% | `Primary-800` at 50% |

### 47.3 Button Sizes
| Size | Height | Padding | Text Size | Icon Size |
|------|--------|---------|-----------|-----------|
| **Small** | 32px | `space-2` x `space-3` | `text-label` | `icon-sm` (16px) |
| **Medium** | 40px | `space-3` x `space-4` | `text-body-sm` | `icon-sm` (16px) |
| **Large** | 48px | `space-3` x `space-5` | `text-body` | `icon-md` (20px) |

### 47.4 Button States
- **Default:** Standard styling per variant.
- **Hover:** Background darkens/lightens, `duration-fast` transition.
- **Active:** Scale to 0.98, background darkens further.
- **Focus:** 2px `border-active` ring, offset 2px.
- **Disabled:** 50% opacity, `cursor: not-allowed`, no hover.
- **Loading:** Spinner replaces content, disabled state.

### 47.5 Button Icon Placement
- Leading icon: left of text, `space-2` (8px) gap.
- Trailing icon: right of text, `space-2` (8px) gap.
- Icon-only buttons: square aspect ratio, `radius-md`, ghost variant default.

### 47.6 Button Groups
- Buttons in a group: `space-2` (8px) gap.
- Primary action on the right (or bottom on mobile).
- Secondary actions to the left of primary.
- Destructive actions separated from other actions.

---

## 48. Input Rules

### 48.1 Input Structure
```
Label (uppercase, text-label, text-secondary)
[Icon] Input Field [Trailing Icon/Action]
Helper Text (optional, text-caption, text-muted)
Error Text (optional, text-caption, text-tertiary)
```

### 48.2 Input Styling
- Background: `Surface-Secondary` (`#131C2E`).
- Border: `border-thin` (`1px`) `border-default` (`#232D42`).
- Border radius: `radius-md` (10px).
- Padding: `space-3` (12px) horizontal, `space-3` (12px) vertical.
- Text: `text-body` size, `text-primary` color.
- Placeholder: `text-placeholder` color.
- Leading icon: `icon-sm` (16px), `text-muted` color, `space-3` (12px) left padding.

### 48.3 Input States
| State | Border | Background | Text | Ring |
|-------|--------|-----------|------|------|
| **Default** | `border-default` | `Surface-Secondary` | `text-primary` | None |
| **Hover** | `Neutral-600` | `Surface-Secondary` | `text-primary` | None |
| **Focus** | `border-active` | `Surface-Secondary` | `text-primary` | 2px `Primary-500` ring |
| **Error** | `border-error` | `Tertiary-900` at 10% | `text-primary` | None |
| **Success** | `border-success` | `Secondary-900` at 10% | `text-primary` | None |
| **Disabled** | `border-default` at 50% | `Surface-Secondary` at 50% | `text-muted` | None |
| **Read-only** | `border-subtle` | `Surface-Tertiary` | `text-secondary` | None |

### 48.4 Input Types
- **Text:** Standard single-line input.
- **Email:** Email validation, `Mail` leading icon.
- **Password:** Masked input, show/hide toggle, `Lock` leading icon.
- **Number:** Right-aligned, stepper controls optional.
- **Tel:** Phone formatting, `Phone` leading icon.
- **Search:** `Search` leading icon, clear button, submit on Enter.
- **Select:** Dropdown trigger, `ChevronDown` trailing icon.
- **Textarea:** Multi-line, auto-resize, min 3 rows.
- **Date:** Date picker overlay, `Calendar` leading icon.
- **File:** Drag-and-drop zone, `Upload` icon, file list below.
- **Checkbox:** Custom styled, `Primary-500` checked state.
- **Radio:** Custom styled, `Primary-500` selected state.
- **Switch:** Toggle, `Primary-500` active track, white thumb.

### 48.5 Input Validation
- Validate on blur for individual fields.
- Validate on submit for entire form.
- Show inline error immediately below field.
- Error icon: `AlertCircle` (`icon-xs`, `Tertiary-400`).
- Success icon: `Check` (`icon-xs`, `Secondary-400`) — optional, for password strength, etc.

---

## 49. Pagination Rules

### 49.1 Pagination Structure
```
Showing X of Y          [Prev] [1] [2] [3] ... [10] [Next]
```

### 49.2 Pagination Styling
- Container: horizontal flex, `space-2` (8px) gap between items.
- Page numbers: `text-body-sm`, `radius-md` (10px), min-width 36px, height 36px.
- Active page: `Primary-500` background, white text.
- Inactive page: transparent background, `text-secondary` text, hover `Surface-Tertiary`.
- Prev/Next: `ChevronLeft` / `ChevronRight` icons, ghost button style.
- Disabled prev/next: 50% opacity, `cursor: not-allowed`.
- Ellipsis: `...` text, `text-muted`, not clickable.

### 49.3 Pagination Behavior
- Show max 7 page numbers at once (including ellipsis).
- Always show first and last page.
- Current page centered in the visible range when possible.
- "Showing X of Y" text: `text-caption`, `text-muted`, left-aligned.

### 49.4 Pagination Sizes
| Size | Button Size | Text Size | Usage |
|------|-------------|-----------|-------|
| **Small** | 32px | `text-label` | Compact tables, embedded lists |
| **Medium** | 36px | `text-body-sm` | Standard tables |
| **Large** | 40px | `text-body` | Marketing, large data views |

---

## 50. Charts Guidelines

### 50.1 Chart Philosophy
Charts are used for data visualization, not decoration. Every chart must communicate a specific insight and support rapid decision-making.

### 50.2 Chart Types
| Type | Usage | Colors |
|------|-------|--------|
| **Area Chart** | Trends over time (AI conversations, orders) | `Chart-Primary` fill with gradient |
| **Line Chart** | Single metric trends | `Chart-Primary` line |
| **Bar Chart** | Category comparisons | `Chart-Primary`, `Chart-Secondary`, `Chart-Tertiary` |
| **Donut Chart** | Part-to-whole relationships | `Chart-Primary`, `Chart-Secondary`, `Chart-Track` |
| **Progress Ring** | Completion percentages | `Chart-Primary` fill, `Chart-Track` background |

### 50.3 Chart Styling
- Background: transparent (inherits card background).
- Grid lines: `border-subtle` color, minimal.
- Axis labels: `text-caption`, `text-muted`.
- Data labels: `text-body-sm`, `text-primary`.
- Tooltips: `Surface-Elevated` background, `radius-lg`, shadow, data point highlight.
- Legend: below chart, color dot + label, `text-body-sm`.

### 50.4 Chart Colors
- Primary data series: `Chart-Primary` (`#8B5CF6`).
- Secondary data series: `Chart-Secondary` (`#2DD4BF`).
- Tertiary data series: `Chart-Tertiary` (`#F472B6`).
- Quaternary: `Chart-Quaternary` (Amber).
- Quinary: `Chart-Quinary` (Blue).
- Track/background: `Chart-Track` (`#1E293B`).

### 50.5 Chart Interactions
- Hover: highlight data point, show tooltip.
- Click: drill down to detail view (if applicable).
- Legend click: toggle series visibility.
- Responsive: maintain readability at all breakpoints.

### 50.6 Chart Accessibility
- All charts must have a text alternative (summary table or alt text).
- Color is never the sole carrier of meaning — use patterns or labels.
- Tooltips must be keyboard accessible.
- Screen reader announcements for data updates.


---

## 51. Reusable Design Patterns

### 51.1 Metric Card Pattern
The Metric Card is the platform's most reused component pattern. It appears on the Dashboard, Orders list, Products list, and Analytics pages.

**Structure:**
```
┌─────────────────────────────────────┐
│ [Icon Chip]              [Badge]     │
│                                     │
│ 1,284                               │  ← Value (text-display, tabular-nums)
│ Total Products                      │  ← Label (text-label, uppercase)
│ Updated 2 mins ago                  │  ← Caption (text-caption, text-muted)
└─────────────────────────────────────┘
```

**Rules:**
- Icon chip: `icon-lg` (24px) inside a 40×40px rounded-square (`radius-lg`), colored per metric type.
- Value: `text-display` size, `font-headline`, `text-primary`, `tabular-nums`.
- Label: `text-label` size, uppercase, `tracking-wide`, `text-secondary`.
- Caption: `text-caption` size, `text-muted`.
- Badge: optional, right-aligned, Status Badge component.
- Trend indicator: optional, arrow icon + percentage, colored per direction (green = up, red = down).

### 51.2 Data Table Pattern
The Data Table pattern is used for all list views (Orders, Products, Inventory, Audit Logs).

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Filters + Search + Actions                                  │
├─────────────────────────────────────────────────────────────┤
│ Header Row (uppercase labels)                               │
├─────────────────────────────────────────────────────────────┤
│ Row 1  │ Row 1 Data  │ Status │ Actions                     │
├─────────────────────────────────────────────────────────────┤
│ Row 2  │ Row 2 Data  │ Status │ Actions                     │
├─────────────────────────────────────────────────────────────┤
│ ...                                                         │
├─────────────────────────────────────────────────────────────┤
│ Showing X of Y          [Pagination]                        │
└─────────────────────────────────────────────────────────────┘
```

**Rules:**
- Filters: segmented tabs or dropdown selects above the table.
- Search: pill-shaped input with `Search` icon.
- Actions: primary CTA ("Create Order") + secondary actions ("Export").
- Header: sticky, uppercase, `text-label`, `text-secondary`.
- Rows: 56px min-height, hover `Surface-Tertiary`, `border-subtle` divider.
- Status column: Status Badge component.
- Actions column: icon buttons (ghost style) or text links.
- Pagination: below table, `space-6` separation.

### 51.3 Detail View Pattern
The Detail View pattern is used for single-record pages (Order Details, Product Details).

**Structure:**
```
Breadcrumb
Title + Status Badge + Actions
├── Two-Column Layout
│   ├── Main Column (8 cols)
│   │   ├── Information Panel
│   │   ├── Items/History Panel
│   │   └── Timeline Panel
│   └── Side Column (4 cols)
│       ├── Metadata Card
│       ├── AI Insight Card
│       └── Actions Card
```

**Rules:**
- Breadcrumb: parent link + current page.
- Title: `text-display`, status badge right of title.
- Actions: primary + secondary buttons, right-aligned.
- Main column: stacked panels, each a Card component.
- Side column: stacked info cards, sticky on scroll.
- Timeline: vertical stepper with icons, lines, and timestamps.

### 51.4 Form Panel Pattern
The Form Panel pattern is used for create/edit flows (Create Product, Edit Order).

**Structure:**
```
Title + Discard/Save Actions (sticky top)
├── Panel 1: Basic Information
│   └── Form Fields
├── Panel 2: Additional Details
│   └── Form Fields
└── Panel 3: Danger Zone (if applicable)
    └── Destructive Actions
```

**Rules:**
- Actions: sticky at top of form, visible while scrolling.
- Save button: disabled until changes detected.
- Discard button: resets to last saved state.
- Panels: Card components with title and description.
- Danger Zone: last panel, special Alert styling.

### 51.5 AI Insight Pattern
The AI Insight pattern is a brand-defining reusable pattern for AI-generated recommendations.

**Structure:**
```
┌─────────────────────────────────────┐
│ [Sparkles Icon]  AI Insight         │
│                                     │
│ Recommendation description text...  │
│                                     │
│ Confidence Score: 98.2%           │
│ Potential Revenue: $1,420.00        │
│                                     │
│ [Authorize Action]                  │
└─────────────────────────────────────┘
```

**Rules:**
- Card variant: AI Insight (Section 32.3).
- Icon: `Sparkles`, `Primary-400`.
- Title: "AI Insight" or context-specific, `Primary-400`.
- Body: `text-body-sm`, `text-secondary`.
- Metrics: label-value pairs, `text-label` + `text-body`.
- CTA: Primary button, action-specific label.
- Confidence: progress bar or percentage, colored per level (Section 33.4).

---

## 52. Do & Don't

### 52.1 Colors

| Do | Don't |
|----|-------|
| Use CSS variables for all colors | Hardcode hex values in components |
| Use semantic colors for status | Invent new status colors per screen |
| Maintain contrast ratios ≥ 4.5:1 | Use text colors that fail WCAG AA |
| Use opacity for subtle variations | Create new color variants arbitrarily |
| Reserve `Sparkles` for AI features | Use `Sparkles` for non-AI functionality |

### 52.2 Typography

| Do | Don't |
|----|-------|
| Use `Plus Jakarta Sans` for headlines | Use `Inter` for headlines |
| Use `Inter` for body and labels | Use `Plus Jakarta Sans` for body text |
| Use `tabular-nums` for all numeric data | Let numbers use proportional spacing |
| Apply `tracking-wide` to uppercase text | Use default tracking on uppercase labels |
| Scale type proportionally | Use arbitrary font sizes |

### 52.3 Spacing

| Do | Don't |
|----|-------|
| Use the 8px spacing scale | Use arbitrary pixel values |
| Maintain consistent gutters | Mix gutter sizes in the same layout |
| Use 24px card padding | Use inconsistent padding across cards |
| Align to the grid | Break grid alignment for "visual appeal" |

### 52.4 Components

| Do | Don't |
|----|-------|
| Reuse existing components | Build one-off components for single use |
| Compose complex components from simple ones | Create monolithic components with many boolean props |
| Document component props and usage | Ship components without documentation |
| Handle all 8 component states (Section 27.2) | Ignore loading, error, or disabled states |

### 52.5 Accessibility

| Do | Don't |
|----|-------|
| Use semantic HTML | Use divs for tables, buttons, or headings |
| Include focus indicators | Remove focus rings for aesthetics |
| Add aria-labels to icon buttons | Leave icon buttons unlabeled |
| Respect `prefers-reduced-motion` | Auto-play animations regardless of preference |
| Test with keyboard navigation | Assume mouse-only interaction |

### 52.6 AI Components

| Do | Don't |
|----|-------|
| Use the AI Insight Card pattern consistently | Create custom AI card styles per screen |
| Show confidence scores for AI recommendations | Present AI output without confidence indicators |
| Allow users to override AI recommendations | Force AI decisions without human approval |
| Use `Sparkles` exclusively for AI | Use `Sparkles` for favorites, ratings, or general features |

### 52.7 Layout

| Do | Don't |
|----|-------|
| Use the App Shell for all authenticated pages | Create custom layouts per page |
| Maintain 240px sidebar width | Resize sidebar per page |
| Use the 12-column grid | Use arbitrary widths and positions |
| Collapse to single column on mobile | Squash multi-column layouts on small screens |

---

## 53. Future Expansion Strategy

### 53.1 Light Theme Support
- All CSS variables must support a light-theme override via `data-theme="light"`.
- Surface colors would invert: light backgrounds, dark text.
- Semantic colors remain unchanged.
- Shadows become more prominent; glows are reduced.
- Estimated effort: Medium — requires full color mapping and component testing.

### 53.2 Additional Chart Types
- Future analytics modules may require: heatmaps, scatter plots, funnel charts, Sankey diagrams.
- Chart color palette can be extended with additional colors from the brand scales.
- Chart component must be generic enough to accept new chart types via configuration.

### 53.3 Mobile-First Responsive
- Current breakpoints are desktop-first; mobile layouts are simplified.
- Future: dedicated mobile app or PWA with touch-optimized interactions.
- Sidebar collapses to bottom navigation or hamburger menu.
- Cards stack vertically, tables become card lists.

### 53.4 Multi-Language Support
- Phase 1: English only.
- Future: Arabic (RTL) support for Libya market.
- RTL implications: sidebar on right, text alignment flips, icon placement adjusts.
- All layouts must use logical properties (`inline-start`, `block-start`) where possible.

### 53.5 Custom Themes per Workspace
- Future: allow Store Owners to customize primary color per workspace.
- Requires runtime CSS variable overrides.
- Must maintain contrast ratios regardless of custom color.
- Estimated effort: High — requires color manipulation library and validation.

### 53.6 Advanced Animations
- Future: micro-interactions for drag-and-drop, page transitions, gesture responses.
- Framer Motion integration for complex orchestrated animations.
- Must maintain performance budget: no animation >16ms per frame.

### 53.7 Design System Documentation Site
- Future: interactive documentation with live component playground.
- Storybook or similar tool for component isolation and testing.
- Automated visual regression testing.

---

## 54. Best Practices

### 54.1 For Engineers
1. **Always reference CSS variables** — never hardcode colors, spacing, or typography values.
2. **Use design system tokens in Tailwind** — extend the config, don't use arbitrary values.
3. **Build mobile-first** — base styles for smallest viewport, breakpoints add complexity.
4. **Handle all states** — default, hover, active, focus, disabled, loading, error, success.
5. **Test accessibility** — keyboard navigation, screen readers, color contrast, touch targets.
6. **Document components** — props, usage examples, accessibility notes, design tokens used.
7. **Reuse before creating** — check existing components before building new ones.
8. **Respect the 8px grid** — all spacing aligns to the grid, no arbitrary values.
9. **Optimize for performance** — use `transform` and `opacity` for animations, avoid layout thrashing.
10. **Follow the naming convention** — PascalCase for components, camelCase for hooks and utilities.

### 54.2 For Designers
1. **Use Figma variables** — map all colors, spacing, and typography to design tokens.
2. **Maintain component library** — all screens should use shared components, not detached instances.
3. **Document deviations** — if a screen requires a pattern not in the system, document the rationale.
4. **Test at all breakpoints** — design for desktop, tablet, and mobile simultaneously.
5. **Validate accessibility** — check contrast ratios, touch targets, and screen reader flows.
6. **Sync with engineering** — design tokens must match CSS variables exactly.
7. **Review for consistency** — cross-reference new screens against existing patterns.
8. **Flag AI components** — any AI-related UI must use the AI Insight pattern.

### 54.3 For AI Agents
1. **Read this document first** — before generating any UI code, review the relevant sections.
2. **Use existing components** — reference the component library, don't invent new patterns.
3. **Follow the token system** — all styles must use CSS variables or Tailwind tokens.
4. **Handle edge cases** — empty states, loading states, error states are not optional.
5. **Respect accessibility** — semantic HTML, ARIA labels, keyboard navigation, reduced motion.
6. **Document assumptions** — if a design decision is not covered by this document, flag it explicitly.
7. **Test responsive behavior** — ensure layouts work at all breakpoints.
8. **Avoid arbitrary values** — round all pixel values to the nearest design token.

---

## 55. Implementation Notes

### 55.1 Font Loading
```typescript
// next/font configuration
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

export const fontHeadline = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-headline',
  display: 'swap',
});

export const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
```

### 55.2 Tailwind Configuration
```typescript
// tailwind.config.ts (excerpt)
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          // ... all steps
          500: 'var(--color-primary-500)',
          // ... all steps
          900: 'var(--color-primary-900)',
        },
        // ... secondary, tertiary, neutral scales
        surface: {
          base: 'var(--surface-base)',
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
          elevated: 'var(--surface-elevated)',
        },
        // ... semantic colors, border colors, text colors
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      // ... spacing, radius, shadows, z-index, transitions
    },
  },
  plugins: [],
};

export default config;
```

### 55.3 HeroUI Theme Configuration
```typescript
// hero-ui-theme.ts (conceptual)
export const heroUITheme = {
  colors: {
    primary: {
      DEFAULT: '#8B5CF6',
      foreground: '#FFFFFF',
    },
    // ... map all HeroUI tokens to design system variables
  },
  radius: {
    small: '6px',
    medium: '10px',
    large: '16px',
  },
  // ... other HeroUI theme overrides
};
```

### 55.4 CSS Variable Injection
Ensure CSS variables are injected at the `:root` level before any component styles. The variables defined in Section 7.1 should be placed in a global CSS file (e.g., `globals.css`) that is imported at the application root.

### 55.5 Component Library Setup
The reusable components identified in this document (Sidebar, MetricCard, DataTable, AIInsightCard, etc.) should be built as a shared component library within `src/shared/ui/`. Each component must:
- Be fully typed with TypeScript interfaces.
- Accept all standard HTML attributes via prop spreading.
- Support ref forwarding where applicable.
- Include Storybook stories (when Storybook is set up).
- Have unit tests for logic and interaction.

### 55.6 Design Token Sync
Design tokens in Figma must be kept in sync with CSS variables. When tokens change:
1. Update Figma variables first.
2. Update CSS variables in `globals.css`.
3. Update Tailwind config if new tokens are added.
4. Update HeroUI theme if affected.
5. Run visual regression tests.
6. Notify the team of breaking changes.

### 55.7 Performance Budget
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- Animation frame rate: 60fps minimum
- Total JavaScript bundle: < 200KB (gzipped) for initial load

### 55.8 Browser Support
- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile Safari: last 2 versions
- Chrome for Android: last 2 versions
- Internet Explorer: not supported

### 55.9 Versioning
This document follows semantic versioning:
- **Major (X.0.0):** Breaking changes to tokens, components, or patterns.
- **Minor (x.Y.0):** New components, new tokens, non-breaking additions.
- **Patch (x.y.Z):** Corrections, clarifications, bug fixes in documentation.

All changes must be documented in a changelog with the date, author, and rationale.

---

## 56. Cross References

- **PROJECT_BRIEF.md** — Origin of product vision, target market, and core workflow.
- **AGENTS.md** — Behavioral rules for contributors, naming principles, error handling.
- **PRD.md** — Product requirements that this design system must satisfy.
- **ARCHITECTURE.md** — System architecture informing component organization.
- **FOLDER_STRUCTURE.md** — Codebase organization for component placement.
- **CODING_STANDARDS.md** — Code conventions that complement this design system.
- **DATABASE.md** — Data model informing table and form designs.
- **API.md** — API contracts informing data display and interaction patterns.
- **SECURITY.md** — Security considerations for auth and sensitive UI flows.
- **DEPLOYMENT.md** — Deployment constraints affecting asset loading and performance.
- **TESTING.md** — Testing strategy for UI components and visual regression.
- **TASKS.md** — Implementation milestones for design system rollout.
- **ROADMAP.md** — Future phases that may introduce new design requirements.

---

## 57. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-07-20 | Design Team | Initial release — complete design system specification based on UI audit and project requirements. |

---

## 58. Approval

This document requires approval from:
- [ ] Lead Frontend Engineer
- [ ] Product Designer
- [ ] Product Manager
- [ ] Engineering Lead

Once approved, this document becomes the authoritative source for all frontend design decisions. Any deviation requires an explicit change request and re-approval.

---

*End of DESIGN_SYSTEM.md*
