# moonviewer - view the night sky of another solar system

Visualize the night sky from the surface of planet(s) from different solar systems. Made for my D&D campaign to see what eclipses would be like to experience.

> This was written when Vue 3 first came out, and so a lot of the Vue 3 techniques are out-of-date. I'm not sure, but I don't think it even had the `<script setup>` sugar. Good times. Anyway, I should update it.  

This is much slower than I'd like it to be, but it represents the best (and most recent) iteration of this toy that I've rewritten quite a few times.

I've included some older iterations of the code. Older versions had performance issues that couldn't easily be resolved because of the slapdash way I had written them (this started as a codepen).

Calculating the positions of planets is hard, if you're curious.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

## Screenshots

> Note 2025-05: As of me writing this bit of the README, the app doesn't have any significant CSS applied. That's unusual for me, and was also an intentional choice on my part. I had a tendency to get lost in the CSS for toys such as this. None of the views are permanent, they mostly as a sandbox for the rest of my tools. Once I get those in order, I will work on a really cool looking page for it. But at the moment I'm not even sure what will be interesting to show! The 3D diagram pop-up? Seems neat. Backgrounds? Stars? Only show above the horizon, or show "below the earth" as well? The list goes on. I already made the mistake of trying to pre-solve these things in the past, but no more!
>
> Anyway my point is, this whole thing reeks of programmer art.

### Normal (s l o w) view w/ 3D diagram
![](https://github.com/user-attachments/assets/b01897a6-37c3-4e5b-a5f7-4094f079a1ab)

### SVG (much faster) view. WiP
![](https://github.com/user-attachments/assets/6d6debc6-7862-4ae7-af9e-38c79d167501)

This gif has a slower FPS than the app:
![](https://github.com/user-attachments/assets/2915cc78-83f5-4ed3-819a-9dccd92ec82b)



## About the code

Previous rewrites taught me three important lessons:
- Caching this many numbers isn't feasible
- Keep the calculations and the drawing completely separated
- Be more flexible with the calculation classes' "current time" (the [Julian date](https://en.wikipedia.org/wiki/Julian_calendar) / `JD`)

### Folders

- `src/_old` - Previous attempts at this app, presrved so I can crib some of the calculations from old versions
- `src/calculations` - Perhaps better named `classes`, but it does mostly have to do with orbital calculations. Also contains some helper libs for drawing
- `src/calculations/OrbitalBodies` - Represents an orbital body (a moon, planet, or sun) and contains a multitude of getters for various params. Internally tracks the `JD`, which maybe was a mistake
- `src/calculations/Utils` - Manipulating and converting coordinates, dates, and times is hard and ugly, let's put them in their own special corner. (Also, there's a cheatcodes class? Apparently? Maybe I was bored or something.)
- `src/SpaceDrawing` - This is where the calculations and the drawing meet. These are the methods which iterate the orbits, track JD, track objects, etc.
- `src/svg-technique` - A WiP SVG version of the app. Once I finished the main app and saw how s l o w it was, I wanted to see how much better a (simpler, to boot!) SVG method would work. The answer: It worked well. This is where I left off a few years ago.
