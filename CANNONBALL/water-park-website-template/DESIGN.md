---
version: alpha
name: "Water park template by 8B"
description: "A loud, heavy-type one-pager for a water park or leisure pool: orange on black with pool-blue and dusk-navy bands. Free HTML template by 8B, MIT."
colors:
  primary: "#ff4400"
  secondary: "#006bb8"
  tertiary: "#0b1e3a"
  neutral: "#ffffff"
  night: "#0a0a0b"
  surface-light: "#f1f2f4"
  caption: "#66666d"
  caption-on-dark: "#a3a3ab"
  hairline: "#e2e3e7"
  hairline-on-dark: "#29292e"
typography:
  headline-display:
    fontFamily: Reddit Sans
    fontSize: 136px
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: Reddit Sans
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.035em
  accent-serif:
    fontFamily: Kalnia
    fontSize: 52px
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: -0.01em
  lead:
    fontFamily: Reddit Sans
    fontSize: 34px
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Reddit Sans
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.02em
  body-md:
    fontFamily: Reddit Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.005em
  label-caps:
    fontFamily: Reddit Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0.06em
  button:
    fontFamily: Reddit Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.01em
rounded:
  none: 0px
  sheet: 32px
  full: 999px
spacing:
  gutter: 40px
  section-padding: 168px
  content-max: 1440px
  control-height: 52px
  header-button-height: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 26px"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.night}"
    textColor: "{colors.primary}"
  nav-tickets-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "{spacing.header-button-height}"
  nav-logo-tab:
    backgroundColor: "{colors.night}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
  ticket-card:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.night}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
  input-field:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.night}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "{spacing.control-height}"
  lane-number:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    height: 56px
---

# Water park template by 8B

## Overview

This is a one-page site for a water park, leisure pool or other family attraction that sells day tickets and a season pass. The one idea is a single loud brand tab: a giant orange wordmark on a black strap that shrinks into the header as the page scrolls. Around it sit full-screen photo sheets, a heading that water rises through, and a Friday evening that turns the page from navy to black. It is meant to feel like a day out: big, wet and a little cheeky, not like a corporate leisure centre. The demo business is invented; replace every fact.

## Colors

- **Orange (#ff4400, primary):** the only warm colour. It fills buttons, colours the header logo tab text, the season strap, the After Dark times, the lane numbers, the rope lines and the focus rings. On white grounds it appears only as thin lines (link underlines, ticket list rings, the FAQ icons), never as text.
- **Pool blue (#006bb8, secondary):** the water that floods the zones heading, and the ground of the swim school section.
- **Dusk navy (#0b1e3a, tertiary):** where After Dark begins; the ground then darkens to black as you scroll.
- **Black (#0a0a0b, night):** the opening, rides, season band, lifeguards and footer grounds, the wordmark strap and the text on orange buttons.
- **White (#ffffff, neutral):** the light grounds of the zones and prices sections, and text on dark and blue grounds.
- **Light grey (#f1f2f4):** the ticket card and the party form.
- **Greys (#66666d, #a3a3ab):** secondary text on light and on dark grounds.
- **Hairlines (#e2e3e7, #29292e):** rules between rows on light grounds and in the footer.

## Typography

Reddit Sans carries everything except the serif lines. Display lines are weight 800 and tightly tracked at -0.05em, in sentence case except the zones heading, which is all lowercase; they scale from 54 to 136 px. Section headings are weight 600, 34 to 60 px. Leads are weight 500, 22 to 34 px; item titles are weight 600, 20 to 26 px; body is 17 px. Small labels are 13 px capitals at 0.06em. The opening wordmark and the footer wordmark are sized from their character count through a `--len` property, so they fill the width; the zones heading works the same way. Kalnia appears only at weight 300 for short lines such as the tagline and the Fridays line, usually ending in a dash. Never set body text in it.

## Layout

Content sits in a wrapper up to 1440 px wide with a fluid gutter of 16 to 40 px. Sections are spaced by 96 to 168 px of vertical padding. The first screen is a full-bleed photo over the wordmark strap; the second is a framed photo with five floating cards (four on phones). Rides are four full-height sheets with a 560 px minimum. Zones are three rows under a huge heading; the season band is one long strap; swim school is four lanes; lifeguards are four portraits in a row. Below 900 px the After Dark hours stack and the stage no longer pins; below 760 px the opening and several grids stack in one column.

## Elevation & Depth

There are no soft shadows. Depth comes from stacking: ride sheets cover one another, the sheet underneath shrinks to 88 percent, rounds to 32 px corners and darkens, and photos settle from enlarged to their frame. The opening photo sits under dark scrims so the text on it reads.

## Shapes

Buttons and the ticket tabs are pills. The header Tickets button, the menu button, the social tags and the form fields are square. Lane numbers and the ring bullets of the ticket lists are round. Lanes are split by orange-and-white striped rope lines. Photos are cropped rectangles.

## Components

- **Button:** orange pill with black text; on hover a black fill rises from below with a curved top and the label turns orange, with an orange ring.
- **Header:** four small black social tags on the left, a black logo tab with orange text in the middle that appears after the opening, a square Tickets button and a menu button on the right.
- **Ticket card:** light grey, a tall photo and two tabs, Day ticket and Season band, with prices and a four-item list each.
- **Lane number:** a 56 px circle that fills orange when its swimmer reaches the far wall.
- **Form field:** square, white, 1 px grey border, capital label above.

## Motion

Motion is CSS scroll-driven animation plus a small inline script, with no animation library and no script from a CDN. A gate script in the head turns scroll motion on only when the browser supports scroll-driven animations and reduced motion is not requested. Entrances use three shared effects: surface (rise from below with a slight overshoot), ripple (a hairline spreads from its centre) and settle (a photo scales down into its frame).

- **Opening:** on load the photo eases in, the wordmark lifts and the copy rises; scrolling shrinks the wordmark into the header tab, settles the framed photo and lifts five cards at different speeds.
- **Rides:** sticky sheets stack; each covered sheet shrinks, rounds and darkens.
- **Zones:** a blue field rises through a black copy of the heading, tilted, then level.
- **Season band:** the stage holds while the orange strap travels sideways.
- **After Dark:** from 900 px, a 400 svh run holds the stage while photos drop in and the ground darkens.
- **Swim school:** each lane block swims across at its own pace.
- **Lifeguards:** an orange frame walks the row and each portrait turns to colour.

Without scroll-driven support (Firefox today) the scroll scenes, the entrances and the smooth wheel are off and the page shows its finished static layout: rides still stack as sticky sheets, the strap wraps into panels, After Dark lists its four hours. The opening load-in and its two slow loops (the strap bobbing, the photo swelling) still play there. Reduced motion turns those off too; hover fills keep working.

## Do's and Don'ts

- Do keep orange as the only warm colour and the only fill of primary buttons.
- Do set display lines at weight 800 and tight, with the zones heading in lowercase; do update `--len` when a line changes.
- Do keep Kalnia light, short and ending in a dash.
- Do keep four After Dark hours, four swim lanes and four lifeguards, or adjust the scene CSS written for those counts.
- Don't add soft shadows, purple gradients, rounded icon cards or a centred hero with two buttons.
- Don't set body text in the serif or add a third typeface.
- Don't invent prices, heights, hours or safety claims; leave marked placeholders.
- Don't add an animation library; extend the CSS scenes and the inline kit instead.
