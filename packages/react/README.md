# duma-icons-react

Hand-drawn icons as React components.

```bash
npm i duma-icons-react
```

```tsx
import { ArrowRight } from "duma-icons-react";

// inherits the surrounding text color (currentColor)
<ArrowRight />

// explicit color + size (size scales the longest side, ratio preserved)
<ArrowRight color="#0a0a0a" size={64} />

// works with CSS / Tailwind too
<ArrowRight className="text-red-500" />

// accessible label
<ArrowRight title="Next" />
```

## Props

`IconProps` extends `SVGProps<SVGSVGElement>` plus:

| Prop    | Type               | Default          | Notes                                            |
| ------- | ------------------ | ---------------- | ------------------------------------------------ |
| `size`  | `number \| string` | `24`             | Scales the longest side; other side from viewBox |
| `color` | `string`           | `"currentColor"` | Resolves the icon's `currentColor`               |
| `title` | `string`           | —                | Renders `<title>` + `role="img"`; else aria-hidden |

The `ref` is forwarded to the underlying `<svg>`. All extra props are spread onto it.
