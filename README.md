# 📦 E-Commerce Inventory & Stock Management Dashboard

Web Engineering / Frontend Development – Assignment 01 (CLO1 & CLO2). Built with **React 18 + Vite**.

- **GitHub repository:** _<paste your repo link>_
- **Live deployment:** _<paste your deployed link>_

## Features
- Add products, increase/decrease stock, delete products
- Stock badges: **In Stock / Low Stock (≤ 5) / Out of Stock**
- Search + category + stock-status filters, live inventory metrics
- Light / Dark theme (Context API), data persisted in `localStorage`
- Audit log (class component) with toast notifications

## Run locally
```bash
npm install
npm run dev      # development
npm run build    # production build in dist/
```

## Project structure
```
src/
├── components/
│   ├── class/AuditLogger.jsx
│   └── functional/ (ProductForm, ProductList, ProductCard, CardWrapper, Header, InventoryMetrics, Filters, ThemeToggle)
├── context/ThemeContext.jsx
├── hooks/useLocalStorage.js
└── App.jsx
```

## Requirement coverage
| Task | Where |
|---|---|
| 1 Component architecture | Structure above, required folders respected |
| 2 Functional components, props, `children` | `ProductForm`, `ProductList`, `ProductCard`, `Header`; callback props (`onAddProduct`, `onUpdateStock`, `onDelete`); `CardWrapper` uses `props.children` |
| 3 Class component & lifecycle | `AuditLogger`: `componentDidMount` (load logs from localStorage), `componentDidUpdate` (persist logs, show toast), `componentWillUnmount` (clear timer, remove `keydown` listener); `this.state` / `this.setState` |
| 4 JSX vs JS | `{}` expressions everywhere; ternary & `&&` for empty state and badges; `.map()` with unique `key`s; `onClick`, `onChange`, `onSubmit` |
| 5 Hooks | `useState` (form, filters), `useEffect` (localStorage sync, document title), `useContext` (theme), `useRef` (title focus on mount & submit), `useMemo`/`useCallback` (filtering, metrics, stable handlers + `React.memo`) |

## Task 6 – CSR vs. SSR

**1. How do CSR and SSR differ?** In Client-Side Rendering (a standard Vite + React SPA) the server delivers a nearly empty HTML shell plus a JavaScript bundle. The browser downloads and executes the bundle, React builds the DOM, and only then does the user see content; the server does no rendering and acts as a static file host. In Server-Side Rendering (e.g. Next.js) a server runs React on every request (or at build time for static generation), returns fully formed HTML that is visible immediately, and then "hydrates" it with JavaScript to make it interactive. SSR therefore needs a running Node runtime and often a data fetch before the first byte, while CSR needs none but shifts the work to the user's device.

**2. Trade-offs for an enterprise e-commerce dashboard.** *Performance:* SSR gives a faster First Contentful Paint, especially on slow devices, but a higher Time To First Byte and server load; CSR has a slower first load yet very fast navigation afterwards. *SEO:* crawlers index SSR HTML reliably, which matters for public product catalogue pages; CSR content depends on the crawler executing JavaScript and is riskier. *Hosting:* CSR deploys as static files on any CDN (Netlify, GitHub Pages) at minimal cost; SSR needs servers or serverless functions, caching strategy and more operations effort. *Conclusion:* this inventory dashboard is a private, login-protected, highly interactive tool where SEO is irrelevant, so CSR is the pragmatic choice. A customer-facing storefront, however, would benefit from SSR or static generation for SEO and first-load speed. Many enterprises combine both: an SSR storefront with a CSR admin dashboard.
