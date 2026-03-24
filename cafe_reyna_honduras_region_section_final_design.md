# Café Reyna — Honduras Regions Section Final Design

## Section Name
**Origin — Honduras**

## Final Direction
This section uses the recommended approach:
- **Minimal map** as the visual anchor
- **Six-region card grid** as the educational core
- **Warm branded editorial layout** rather than an academic infographic

The goal is to make the section feel premium, informative, and brand-aligned while educating visitors on the major Honduran coffee regions.

---

## 1. Section Purpose
This section should:
- educate visitors on the major coffee-growing regions of Honduras
- reinforce sourcing credibility
- create a stronger sense of place and origin
- support Café Reyna’s premium brand positioning

The takeaway should be:

> Café Reyna understands Honduran coffee as a landscape of distinct regions, not a generic origin.

---

## 2. Layout Overview

### Desktop structure
A vertically stacked section with four layers:

1. **Intro band**
2. **Map + framing copy**
3. **Region card grid**
4. **Closing brand statement**

### Responsive behavior
- **Desktop:** spacious editorial layout with map and copy side by side, then 3-column card grid
- **Tablet:** map stacks above or beside intro depending on width, card grid becomes 2 columns
- **Mobile:** everything stacks into a single-column reading flow

---

## 3. Section Container

### Background
Use the global Café Reyna paper tone:

```css
background: #f4ede4;
color: #2a2a2a;
```

### Section feel
- warm paper-like background
- subtle earthy borders
- minimal or no shadow
- soft visual separation from adjacent sections
- slightly organic spacing, not rigid corporate grid energy

### Recommended spacing
- top padding: 96px desktop / 72px tablet / 56px mobile
- bottom padding: 96px desktop / 72px tablet / 56px mobile
- max content width: 1200px
- horizontal padding: 24px mobile, 32px tablet, 48px desktop

---

## 4. Intro Band

### Layout
Two-column layout on desktop:
- **Left:** headline and intro paragraph
- **Right:** minimal supporting copy or small visual cue

On mobile this stacks.

### Headline
**The Coffee Regions of Honduras**

### Intro copy
Honduras is one of the most diverse coffee-producing countries in the world. From high-altitude mountain farms to humid forest microclimates, each region expresses a distinct cup shaped by elevation, terrain, climate, and local tradition.

### Optional eyebrow label
**Origin**

### Typography direction
- eyebrow: small uppercase with letter spacing
- headline: serif, elegant, medium-large scale
- body: clean sans-serif for readability

### Visual treatment
- keep the intro airy and premium
- avoid oversized marketing copy
- allow breathing room before the map and cards

---

## 5. Visual Anchor — Minimal Honduras Map

### Recommended option
Use a **minimal Honduras map**, not a heavily illustrated geography graphic.

### Why this is the right choice
- communicates place immediately
- keeps the section grounded and credible
- avoids overpowering the rest of the layout
- fits better with a premium ecommerce/editorial brand presentation

### Map styling
- thin outline of Honduras
- softly tinted region zones or subtle location markers
- muted earth tones drawn from the Café Reyna palette
- no bright colors
- no harsh infographic lines
- no dense labels directly on the map if they clutter the composition

### Map placement
Position beneath or beside the intro content depending on layout width.

### Accompanying framing copy
Place a short supporting line near the map:

> From western highlands to eastern mountain ranges, Honduran coffee grows across a remarkably varied landscape.

### Optional small legend
A minimal legend can identify the six featured regions with dots or soft region highlights:
- Copán
- Montecillos
- Opalaca
- Comayagua
- El Paraíso
- Agalta

Keep the legend understated.

---

## 6. Region Grid

### Grid layout
Use a six-card grid.

- **Desktop:** 3 columns
- **Tablet:** 2 columns
- **Mobile:** 1 column

### Grid spacing
- column gap: 24px
- row gap: 24px to 28px

### Card styling
Each card should feel like a refined informational tile, not a product card.

#### Card appearance
- warm off-white or slightly tinted paper surface
- 1px muted brown border
- 20px to 24px internal padding
- rounded corners, soft not playful
- no heavy drop shadow
- optional subtle tone shifts between cards using very muted palette changes

#### Hover behavior
- slight lift or translateY effect
- border becomes slightly stronger
- flavor profile line gains emphasis
- motion should remain soft and premium

---

## 7. Region Card Content Structure
Each card should follow the same hierarchy:

1. **Region name**
2. **Elevation range**
3. **Flavor profile**
4. **Short educational description**

### Label styling suggestion
- region name: serif, medium emphasis
- elevation: small uppercase or small label style
- flavor profile: visually highlighted secondary line
- description: short paragraph in readable body text

### Optional micro-icon
A very subtle icon can be used if helpful:
- mountain
- leaf
- terrain line

Do not use overly illustrative or generic stock-style icons.

---

## 8. Final Region Content

### Copán
**Elevation:** 1,000–1,500m  
**Profile:** Chocolate, caramel, soft citrus

Located in western Honduras near Guatemala, Copán produces balanced coffees with smooth body and classic sweetness. It is an approachable profile with comforting chocolate notes and gentle citrus brightness.

### Montecillos
**Elevation:** 1,200–1,700m  
**Profile:** Bright acidity, red fruit, floral

Home to Marcala, Montecillos is one of Honduras’ most recognized coffee regions. High elevations and cooler temperatures help produce vibrant, layered coffees with elegant fruit and floral character.

### Opalaca
**Elevation:** 1,400–1,800m  
**Profile:** Crisp, citrus, light body

This mountainous growing region is known for clean cups, lively acidity, and delicate structure. Coffees from Opalaca often feel refined and high-toned, with citrus-driven clarity.

### Comayagua
**Elevation:** 1,100–1,600m  
**Profile:** Sweet, nutty, mild fruit

Comayagua produces smooth, versatile coffees with balanced sweetness and soft fruit notes. Its profile often lands in a comfortable middle ground that works well across roast styles.

### El Paraíso
**Elevation:** 1,200–1,600m  
**Profile:** Bright, tropical fruit, sweet finish

Bordering Nicaragua, El Paraíso benefits from warm days and cool nights that support pronounced sweetness and lively fruit character. Coffees here can show a vivid and energetic cup profile.

### Agalta
**Elevation:** 1,200–1,700m  
**Profile:** Deep body, cocoa, spice

Agalta, in eastern Honduras, is known for fuller-bodied coffees with richer cocoa depth and rustic spice notes. It brings a bolder, more grounded expression of Honduran coffee.

---

## 9. Brand-Specific Emphasis
Among the six cards, **Montecillos** should receive subtle emphasis because it anchors Café Reyna’s sourcing narrative through Marcala.

### Ways to emphasize without breaking consistency
- slightly richer background tint
- thin accent line at top of card
- small note such as **Includes Marcala**
- default card open state if cards ever become expandable

This emphasis should remain quiet and elegant.

---

## 10. Closing Statement
Place a short closing block below the grid.

### Recommended copy
We source our coffee from regions like Marcala in Montecillos, where altitude, climate, and tradition come together to produce exceptional beans. Every bag reflects not just a roast, but a place.

### Layout treatment
- centered or slightly left-aligned depending on page rhythm
- narrower measure than the grid above
- subtle divider above it
- slightly more generous top padding so it reads like a conclusion

---

## 11. Design Language Rules
This section should stay aligned with the Café Reyna visual system.

### Use
- warm paper backgrounds
- earthy browns and muted greens
- restrained accent colors pulled from the label world
- serif headings with clean sans body text
- fine borders
- soft organic spacing

### Avoid
- bright infographic colors
- overly technical map detail
- long encyclopedia-style paragraphs
- hard black UI boxes
- generic tourism graphics
- making every region card visually identical in tone and rhythm

Variation should be subtle but present.

---

## 12. Suggested Content Hierarchy on Page
1. Eyebrow: **Origin**
2. Headline: **The Coffee Regions of Honduras**
3. Intro paragraph
4. Minimal Honduras map
5. Six educational region cards
6. Closing brand statement

This sequence creates a natural narrative:
**country → landscape → regions → Café Reyna connection**

---

## 13. Final UX Outcome
When finished, the section should feel like:
- a premium editorial origin feature
- educational but easy to scan
- visually tied to the Café Reyna label world
- flexible enough to support future sourcing across Honduras

It should not feel like a classroom diagram or a commodity coffee reference page.

It should feel like a branded origin story.

