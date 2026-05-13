# VaultMarket Agent Guidelines

These instructions apply to all agent work in this repository.

## Product Boundaries

- VaultMarket is a frontend/UI showcase.
- Do not add backend logic, databases, auth, payments, API calls, server actions, Supabase, Stripe, Paystack, Prisma, or real persistence unless explicitly requested.
- Keep changes scoped to the route or component named in the prompt.
- Do not redesign unrelated routes while polishing one surface.

## Skills And Review Standards

- Use relevant installed skills automatically when the task fits them.
- For UI work, apply the Vercel Web Interface Guidelines, `userinterface-wiki`, `frontend-design`, `responsive-design`, `baseline-ui`, and accessibility guidance where relevant.
- Prefer existing VaultMarket components, data, tokens, and motion patterns before creating new abstractions.
- If a new skill is installed, inspect its `SKILL.md` before using it.

## Interaction And Accessibility

- Keyboard access must work for interactive flows.
- Focusable elements need visible `focus-visible` states.
- Use native `Link`, `a`, and `button` semantics correctly.
- Navigation must use links, not click-only containers.
- Icon-only controls need accessible names.
- Disabled or simulated actions must clearly explain their state.
- Hit targets should be easy to tap, especially on mobile.

## Motion

- Respect `prefers-reduced-motion`.
- Prefer CSS or existing motion utilities over new JavaScript animation.
- Animate compositor-friendly properties such as `transform` and `opacity`.
- Avoid aggressive looping, layout animation, and `transition: all`.
- Motion should clarify state, direction, or product quality without distracting from the collector workflow.

## Layout And Responsiveness

- Verify desktop, tablet, and mobile behavior for visual changes.
- Avoid horizontal scroll and unwanted visible scrollbars.
- Use intrinsic layout, flex, and grid before measuring with JavaScript.
- Preserve safe areas for fixed or sticky UI.
- Keep sticky content clear of the app header.
- Make dense cards resilient to long titles, prices, cert numbers, and status labels.

## Content And Visual Design

- Maintain the premium collector desk identity.
- Avoid generic SaaS filler, testimonials, FAQs, pricing sections, or newsletter patterns unless requested.
- Use concise, action-oriented copy.
- Prefer positive, problem-solving language.
- Status and signal meaning should not rely on color alone.
- Use tabular or monospaced numbers for comparable data.
- Keep CTAs intentional and route them to real app pages.

## Verification

- Run lint and build when available after code changes.
- Check relevant local routes return `200` when route behavior changes.
- Report any verification that could not be performed.
- If browser automation is unavailable, say so and rely on code review plus local HTTP/build checks.

## Commits

- Commit every coherent change, even small ones.
- Use grammatically correct commit messages in the style:
  - `changed the X by Y`
  - `updated the X by Y`
  - `added X for Y`
- If multiple coherent changes happen in one prompt, make multiple commits where practical.
