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