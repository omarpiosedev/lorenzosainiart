# GSAP + React Best Practices 2025

## 📘 Complete Guide for Modern GSAP Integration

This document outlines the definitive best practices for using GSAP with React in 2025, based on the successful refactoring of `sez4.tsx`.

---

## 🎯 Golden Rules

1. **ALWAYS use `useGSAP`** instead of `useEffect` for GSAP animations
2. **ALWAYS register `useGSAP`** with `gsap.registerPlugin(useGSAP)`
3. **ALWAYS provide a `scope`** ref to isolate GSAP context
4. **ALWAYS set `revertOnUpdate: true`** to prevent property leaks
5. **ALWAYS add null checks** before using refs in animations
6. **NEVER manually kill tweens** - let useGSAP handle cleanup
7. **NEVER forget `dependencies`** - even if empty `[]`

---

## ✅ The Perfect Pattern

### Minimal Example

```typescript
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// ALWAYS register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AnimatedComponent() {
  // Container ref for GSAP scope
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ALWAYS add null check
    if (!boxRef.current) return;

    // Initial state with gsap.set
    gsap.set(boxRef.current, {
      opacity: 0,
      y: 50,
    });

    // Animate
    gsap.to(boxRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: boxRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    // NO manual cleanup - automatic!
  }, {
    dependencies: [],           // Run once on mount
    scope: containerRef,        // Isolate to this component
    revertOnUpdate: true,       // Revert properties on unmount
  });

  return (
    <div ref={containerRef}>
      <div ref={boxRef}>
        Animated Content
      </div>
    </div>
  );
}
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ DON'T: Use useEffect

```typescript
// ❌ BAD - Legacy pattern
useEffect(() => {
  gsap.to(element.current, { x: 100 });

  return () => {
    // Only kills ScrollTriggers, NOT tweens!
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}, []);
```

```typescript
// ✅ GOOD - Modern pattern
useGSAP(() => {
  gsap.to(element.current, { x: 100 });
  // Automatic cleanup of EVERYTHING
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

### ❌ DON'T: Skip null checks

```typescript
// ❌ BAD - Crash if ref not ready
useGSAP(() => {
  gsap.to(boxRef.current, { x: 100 }); // Crash if null!
}, { scope: containerRef });
```

```typescript
// ✅ GOOD - Safe with early return
useGSAP(() => {
  if (!boxRef.current) return;
  gsap.to(boxRef.current, { x: 100 });
}, { scope: containerRef });
```

---

### ❌ DON'T: Forget scope

```typescript
// ❌ BAD - Global GSAP context
useGSAP(() => {
  gsap.to('.box', { x: 100 }); // Affects ALL .box elements globally!
}, { dependencies: [] });
```

```typescript
// ✅ GOOD - Scoped GSAP context
useGSAP(() => {
  gsap.to('.box', { x: 100 }); // Only affects .box inside containerRef
}, {
  dependencies: [],
  scope: containerRef, // Isolates to this component
});
```

---

### ❌ DON'T: Manually kill tweens

```typescript
// ❌ BAD - Manual cleanup
useGSAP(() => {
  const tween = gsap.to(box.current, { x: 100 });

  return () => {
    tween.kill(); // Unnecessary!
    ScrollTrigger.getAll().forEach(t => t.kill()); // Unnecessary!
  };
}, { scope: containerRef });
```

```typescript
// ✅ GOOD - Automatic cleanup
useGSAP(() => {
  gsap.to(box.current, { x: 100 });
  // All tweens and ScrollTriggers auto-killed!
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

## 🏗️ Advanced Patterns

### Pattern 1: Multiple Refs (Desktop + Mobile)

```typescript
export default function ResponsiveAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Organize refs by purpose
  const desktopBoxRef = useRef<HTMLDivElement>(null);
  const mobileBoxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop animation
    if (desktopBoxRef.current) {
      gsap.to(desktopBoxRef.current, {
        x: 200,
        scrollTrigger: {
          trigger: desktopBoxRef.current,
          start: 'top 80%',
        },
      });
    }

    // Mobile animation
    if (mobileBoxRef.current) {
      gsap.to(mobileBoxRef.current, {
        x: 100,
        scrollTrigger: {
          trigger: mobileBoxRef.current,
          start: 'top 80%',
        },
      });
    }
  }, {
    dependencies: [],
    scope: containerRef,
    revertOnUpdate: true,
  });

  return (
    <div ref={containerRef}>
      <div ref={desktopBoxRef} className="hidden lg:block">
        Desktop Content
      </div>
      <div ref={mobileBoxRef} className="lg:hidden">
        Mobile Content
      </div>
    </div>
  );
}
```

---

### Pattern 2: Stagger Animations

```typescript
export default function StaggeredList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    if (!listRef.current) return;

    const items = listRef.current.querySelectorAll('li');

    // Initial state
    gsap.set(items, {
      opacity: 0,
      y: 30,
    });

    // Stagger animation
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1, // 100ms between each item
      ease: 'power2.out',
      scrollTrigger: {
        trigger: listRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, {
    dependencies: [],
    scope: containerRef,
    revertOnUpdate: true,
  });

  return (
    <div ref={containerRef}>
      <ul ref={listRef}>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  );
}
```

---

### Pattern 3: State Updates in Callbacks

```typescript
export default function CounterAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useGSAP(() => {
    if (!counterRef.current) return;

    // State updates in callbacks are safe if:
    // 1. They don't trigger re-renders that affect GSAP animations
    // 2. They're isolated to specific UI updates (like counters)
    ScrollTrigger.create({
      trigger: counterRef.current,
      start: 'top 80%',
      onEnter: () => {
        setCount(prev => prev + 1); // Safe: isolated state
      },
    });
  }, {
    dependencies: [], // Don't add 'count' - would cause infinite loop
    scope: containerRef,
    revertOnUpdate: true,
  });

  return (
    <div ref={containerRef}>
      <div ref={counterRef}>
        Counter: {count}
      </div>
    </div>
  );
}
```

**⚠️ CAUTION:** Only use state updates in ScrollTrigger callbacks when:
- State doesn't affect GSAP animations
- State is isolated (e.g., counters, flags)
- Dependencies array doesn't include the state (avoid infinite loops)

---

### Pattern 4: Dynamic Dependencies

```typescript
export default function DynamicAnimation({ color }: { color: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!boxRef.current) return;

    gsap.to(boxRef.current, {
      backgroundColor: color, // Uses prop
      duration: 1,
    });
  }, {
    dependencies: [color], // Re-run when color changes
    scope: containerRef,
    revertOnUpdate: true, // Reverts old color before applying new
  });

  return (
    <div ref={containerRef}>
      <div ref={boxRef}>Box</div>
    </div>
  );
}
```

---

## 📋 Configuration Options

### useGSAP Config Object

```typescript
useGSAP(() => {
  // Animation code
}, {
  // REQUIRED
  dependencies: any[],      // When to re-run (like useEffect)

  // HIGHLY RECOMMENDED
  scope: RefObject,         // Container ref for isolation
  revertOnUpdate: boolean,  // Revert properties on cleanup

  // OPTIONAL
  revertOnDependenciesChange: boolean, // Revert when dependencies change
});
```

### Common Configurations

#### 1. Run Once (Most Common)
```typescript
{
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
}
```

#### 2. Reactive to Props
```typescript
{
  dependencies: [propA, propB],
  scope: containerRef,
  revertOnUpdate: true,
  revertOnDependenciesChange: true, // Clean slate on prop change
}
```

#### 3. Simple Animation (No Container)
```typescript
{
  dependencies: [],
  revertOnUpdate: true,
}
```
**⚠️ Note:** Without `scope`, GSAP affects all matching selectors globally!

---

## 🧪 Testing Patterns

### 1. Verify Refs Exist

```typescript
useGSAP(() => {
  // Test in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Refs:', {
      container: containerRef.current,
      box: boxRef.current,
    });
  }

  if (!boxRef.current) return;

  gsap.to(boxRef.current, { x: 100 });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

### 2. Debug ScrollTrigger

```typescript
useGSAP(() => {
  if (!boxRef.current) return;

  gsap.to(boxRef.current, {
    x: 100,
    scrollTrigger: {
      trigger: boxRef.current,
      start: 'top 80%',
      markers: process.env.NODE_ENV === 'development', // Show debug markers
      onEnter: () => console.log('Entered viewport'),
      onLeave: () => console.log('Left viewport'),
    },
  });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

## 📊 Performance Tips

### 1. Use `will-change` for Better Performance

```typescript
useGSAP(() => {
  if (!boxRef.current) return;

  // Hint browser for optimization
  gsap.set(boxRef.current, {
    willChange: 'transform, opacity',
  });

  gsap.to(boxRef.current, {
    x: 100,
    opacity: 0.5,
    // Remove will-change after animation
    onComplete: () => {
      gsap.set(boxRef.current, { willChange: 'auto' });
    },
  });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

### 2. Batch Similar Animations

```typescript
// ✅ GOOD - Single batch
useGSAP(() => {
  if (!containerRef.current) return;

  const boxes = containerRef.current.querySelectorAll('.box');

  gsap.to(boxes, {
    x: 100,
    stagger: 0.1,
  });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

```typescript
// ❌ BAD - Multiple individual tweens
useGSAP(() => {
  if (!containerRef.current) return;

  const boxes = containerRef.current.querySelectorAll('.box');

  boxes.forEach(box => {
    gsap.to(box, { x: 100 }); // Inefficient!
  });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

### 3. Optimize ScrollTrigger

```typescript
useGSAP(() => {
  if (!boxRef.current) return;

  gsap.to(boxRef.current, {
    x: 100,
    scrollTrigger: {
      trigger: boxRef.current,
      start: 'top 80%',
      scrub: true,           // Smooth scrubbing
      invalidateOnRefresh: true, // Recalc on resize
      // Optimize scroll performance
      anticipatePin: 1,      // Reduce layout shift
    },
  });
}, {
  dependencies: [],
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

## 🔧 Troubleshooting

### Problem: "Cannot read properties of null"

**Cause:** Ref not ready when animation runs

**Solution:** Add null check
```typescript
useGSAP(() => {
  if (!boxRef.current) return; // ✅ Prevents crash
  gsap.to(boxRef.current, { x: 100 });
}, { scope: containerRef });
```

---

### Problem: Animations not cleaning up

**Cause:** Missing `revertOnUpdate` or `scope`

**Solution:** Add both
```typescript
useGSAP(() => {
  gsap.to(box.current, { x: 100 });
}, {
  dependencies: [],
  scope: containerRef,    // ✅ Isolate context
  revertOnUpdate: true,   // ✅ Revert on cleanup
});
```

---

### Problem: Animation runs multiple times

**Cause:** Dependencies changing unnecessarily

**Solution:** Use empty array for run-once
```typescript
useGSAP(() => {
  gsap.to(box.current, { x: 100 });
}, {
  dependencies: [], // ✅ Run only once
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

### Problem: State updates causing re-renders

**Cause:** State in dependencies array

**Solution:** Remove state from dependencies if it doesn't affect animation
```typescript
const [count, setCount] = useState(0);

useGSAP(() => {
  ScrollTrigger.create({
    trigger: ref.current,
    onEnter: () => setCount(prev => prev + 1),
  });
}, {
  dependencies: [], // ✅ Don't add 'count'
  scope: containerRef,
  revertOnUpdate: true,
});
```

---

## 📚 TypeScript Types

### Ref Types

```typescript
import type { RefObject } from 'react';

// Container
const containerRef: RefObject<HTMLDivElement> = useRef(null);

// Generic element
const elementRef: RefObject<HTMLElement> = useRef(null);

// Specific elements
const buttonRef: RefObject<HTMLButtonElement> = useRef(null);
const inputRef: RefObject<HTMLInputElement> = useRef(null);
const imageRef: RefObject<HTMLImageElement> = useRef(null);
```

---

### GSAP Types

```typescript
import type { gsap as GSAPType } from 'gsap';

// Tween reference (rarely needed with useGSAP)
let tween: GSAPType.core.Tween | null = null;

// Timeline reference
let timeline: GSAPType.core.Timeline | null = null;

// ScrollTrigger reference (rarely needed)
let scrollTrigger: ScrollTrigger | null = null;
```

---

## ✅ Migration Checklist

Use this when converting legacy `useEffect` to `useGSAP`:

- [ ] Import `useGSAP` from `@gsap/react`
- [ ] Register with `gsap.registerPlugin(useGSAP)`
- [ ] Replace `useEffect` with `useGSAP`
- [ ] Create container ref for scope
- [ ] Add config object with:
  - [ ] `dependencies: []`
  - [ ] `scope: containerRef`
  - [ ] `revertOnUpdate: true`
- [ ] Remove manual cleanup (`return () => { ... }`)
- [ ] Add null checks for all refs
- [ ] Attach container ref to JSX root element
- [ ] Test TypeScript compilation
- [ ] Test in browser
- [ ] Verify cleanup with React DevTools

---

## 🎓 Key Principles

1. **Automatic Cleanup**: useGSAP kills all tweens and ScrollTriggers automatically
2. **Scope Isolation**: Always scope to container for component-level context
3. **Property Reversion**: Always revert to prevent style leaks
4. **Null Safety**: Always check refs before using
5. **Dependencies**: Think carefully about what should trigger re-runs
6. **State Updates**: Only in callbacks, never in dependencies if it causes loops
7. **Performance**: Batch animations, use will-change, optimize ScrollTrigger

---

## 📖 Further Reading

- [Official useGSAP Docs](https://gsap.com/docs/v3/React/tools/useGSAP/)
- [React + GSAP Best Practices](https://gsap.com/resources/React/)
- [ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Forum](https://gsap.com/community/)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Based on:** Successful migration of `sez4.tsx` with 14 complex animations
**Status:** Production-Ready Pattern ✅
