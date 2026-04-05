Refine the current laptop section again. The current implementation is not correct.

The problem:

- It currently behaves like a flat screen or a flip card.
- It does not feel like a real laptop with a base and a lid.
- The opening motion is not mechanical.
- The spacing around the section is too large.
- The zoom behavior is wrong.

Important clarification:
I want a FULL laptop, not only a screen.
Think of a real laptop with:

1. a bottom base (keyboard deck / body)
2. a top lid (screen part)
3. a hinge relationship between them

Visual reference:

- Closed state: like a real closed silver laptop, thin and horizontal
- Open state: like a real open laptop, with the lid raised and the base visible
- The motion should resemble a real hinge opening, not a simple flip, fade, rotate-only panel, or screen swap

Required behavior:

1. When the laptop section first enters, the laptop should appear closed or almost closed.
2. As the user scrolls through the section, the lid should gradually open from closed to fully open.
3. The opening should be smooth, premium, and mechanical.
4. The base must remain visible during the motion.
5. The lid must rotate upward around a believable hinge point.
6. Add slight floating motion to the full laptop while keeping the opening motion stable and readable.
7. Reduce excessive empty vertical space in this section.

Home state inside the laptop:

- The laptop screen should initially show Ahmed Helal's profile home state
- Profile image
- Short intro
- Two buttons only:
  - View Portfolio
  - View CV
- Remove the side tab buttons completely

Portfolio / CV behavior:

1. When the user clicks View Portfolio or View CV:
   - do NOT make only the screen fullscreen
   - do NOT make it take the entire browser screen
2. Instead:
   - the entire laptop should scale up smoothly
   - the full laptop should occupy more visual space
   - the laptop remains visible as a laptop
   - the screen content becomes more immersive inside the opened laptop
3. Add a clear Back button inside the screen view to return to the home/profile state
4. When returning back, the whole laptop should smoothly scale back down to its normal size

Scroll-out behavior:

- As the user scrolls beyond the laptop section, the lid should begin closing again naturally
- It should feel like the laptop is leaving the stage, not abruptly resetting

Implementation requirements:

- Use Framer Motion + CSS transforms
- Avoid Three.js
- Avoid fake flip-card behavior
- Avoid treating the lid as a flat floating rectangle with no physical relationship to the base
- Build a more believable full laptop silhouette:
  - top lid
  - bottom base
  - hinge area
  - screen inset
- The laptop should look elegant, premium, slightly minimal, and cinematic
- It can be stylized rather than photorealistic, but must clearly read as a complete laptop

Spacing/layout requirements:

- tighten the spacing between the hero and laptop section
- tighten the spacing inside the laptop section so it feels intentional and not empty
- preserve responsiveness on desktop and mobile

After editing, summarize:

- how the laptop structure was changed
- how the opening/closing logic works now
- what files were edited
- any limitations that still remain
