# Common Varietals Across Honduras

## Final Design — Option A (Static Editorial Grid)

This section is designed as a **static educational brand section** for the Café Reyna website. It introduces visitors to the varietals most commonly grown across Honduras’s major coffee-producing regions without requiring filtering, tabs, or dynamic data.

---

## Section intent

This section should:

- educate users on what a coffee varietal is
- reinforce Honduras as a diverse and credible origin
- support the premium, origin-driven character of the brand
- visually bridge the regional education section and the roast/product sections

The section should feel **editorial, refined, and easy to scan**, not technical or database-like.

---

## Placement in page flow

Recommended homepage order:

1. Hero  
2. Brand story / origin story  
3. Honduras regions section  
4. **Common Varietals Across Honduras**  
5. Roast profiles / tasting guidance  
6. Product or configurator section

This creates a clear progression:

**place → plant → flavor → purchase**

---

## Section structure

### 1. Section container

Use a warm paper-toned background consistent with the rest of the site.

Suggested section treatment:

- background: `#f4ede4`
- generous vertical padding
- centered content container
- subtle separation from adjacent sections using spacing rather than hard dividers

---

### 2. Top intro block

Use a simple editorial header with supporting copy.

#### Eyebrow
`Honduran Coffee`

#### Heading
**Common Varietals Across Honduras**

#### Supporting paragraph
Honduran coffee is shaped not only by region, altitude, and processing, but also by varietal. These are some of the coffee plant varieties most commonly grown across the country’s major producing regions, each contributing its own character to the cup.

#### Optional secondary line
While no two farms or harvests are exactly alike, these varietals help define the broader flavor landscape of Honduran coffee.

---

## Layout recommendation

### Desktop
Use an editorial grid with:

- intro block at top
- **8 varietal cards** below
- 4-column grid on large desktop
- 2-column grid on tablet
- 1-column stack on mobile

### Mobile
Cards should stack vertically with generous spacing and clear hierarchy.

Do not collapse into accordion format unless absolutely necessary.

---

## Visual design direction

### Overall feel
The section should feel:

- warm
- informative
- premium
- rooted in origin
- visually calm

### Card styling
Each varietal card should use:

- soft cream or slightly lifted paper surface
- thin earthy border
- minimal or no shadow
- rounded corners, but not overly soft
- comfortable padding
- restrained typography hierarchy

### Typography
- varietal name: serif, medium-large, elegant
- metadata labels: small uppercase or muted sans-serif
- body copy: clean, readable sans-serif

### Color usage
Use restrained earthy accents pulled from the label-inspired palette:

- coffee brown for headings
- muted olive or leaf green for metadata labels
- terracotta sparingly for emphasis
- avoid bright modern UI colors

---

## Card content structure

Each card should contain:

1. **Varietal name**
2. short one-sentence description
3. **Common in:** regions
4. **Often expresses:** flavor tendencies

The card should be easy to scan in under 5 seconds.

---

# Final section copy

## Eyebrow
**Honduran Coffee**

## Heading
**Common Varietals Across Honduras**

## Intro copy
Honduran coffee is shaped not only by region, altitude, and processing, but also by varietal. These are some of the coffee plant varieties most commonly grown across the country’s major producing regions, each contributing its own character to the cup.

While no two farms or harvests are exactly alike, these varietals help define the broader flavor landscape of Honduran coffee.

---

## Varietal card grid content

### 1. Catuai
A widely grown Honduran varietal known for balance, sweetness, and dependable cup quality.

**Common in:** Copán, Montecillos, Opalaca, Comayagua, El Paraíso, Agalta  
**Often expresses:** chocolate, citrus, soft fruit, caramel

---

### 2. Bourbon
A classic Arabica varietal valued for sweetness, depth, and a rounded cup.

**Common in:** Copán, Montecillos, parts of Comayagua  
**Often expresses:** caramel, red fruit, cocoa

---

### 3. Caturra
A compact Bourbon mutation often associated with brightness, clarity, and a clean structure.

**Common in:** Montecillos, Comayagua, El Paraíso  
**Often expresses:** citrus, brown sugar, clean acidity

---

### 4. Lempira
A Honduras-developed hybrid widely planted for resilience, consistency, and approachable cup character.

**Common in:** Opalaca, Comayagua, Agalta, El Paraíso  
**Often expresses:** cocoa, nuts, mild fruit

---

### 5. IHCAFE 90
A varietal developed in Honduras and commonly grown for strong performance and balanced cup structure.

**Common in:** multiple Honduran growing regions  
**Often expresses:** sweetness, light fruit, chocolate, balanced body

---

### 6. Pacas
A Bourbon-related varietal that can produce a sweet, approachable, and elegant cup.

**Common in:** Copán, Montecillos, western Honduras  
**Often expresses:** caramel, stone fruit, soft acidity

---

### 7. Typica
One of coffee’s oldest varietals, prized for delicacy and a refined, understated profile.

**Common in:** smaller quantities in higher-elevation areas  
**Often expresses:** floral tones, citrus, gentle sweetness

---

### 8. Parainema
A more modern Honduran varietal known for distinctive fruit-forward character and lively complexity.

**Common in:** El Paraíso, Agalta, eastern Honduras  
**Often expresses:** tropical fruit, spice, lively acidity

---

## Optional closing note
Varietal presence varies by farm, lot, and harvest, and flavor expression can shift significantly from one region to another.

---

## UI implementation notes

### Recommended spacing
- section top/bottom padding: generous
- intro block separated from grid with comfortable spacing
- consistent card gaps across breakpoints

### Recommended hierarchy
- eyebrow
- heading
- intro copy
- card grid
- optional closing note

### Avoid
- interactive filters
- dense technical agriculture language
- overly scientific descriptors
- icon-heavy cards
- strong drop shadows
- rigid corporate layout treatment

---

## Developer-facing composition guidance

### Suggested DOM structure

```text
section
  container
    intro-block
      eyebrow
      h2
      paragraph
      optional paragraph
    varietal-grid
      card x 8
        varietal name
        description
        metadata line: Common in
        metadata line: Often expresses
    optional closing note
```

### Responsive behavior

- desktop: 4 columns
- tablet: 2 columns
- mobile: 1 column
- keep card heights reasonably aligned, but do not force excessive equal-height behavior if it harms readability

---

## Tone summary

This section should read like **premium origin education**, not a catalog. The emphasis is on helping customers understand that Honduran coffee is nuanced, regionally expressive, and rooted in distinct plant varieties.
