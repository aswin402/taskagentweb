# Onpkg Vite+React Template 🚀

A premium, highly-opinionated Vite + React starter template designed for scalability, type-safety, and modern developer experience.

## ✨ Features

- **Next.js-like Architecture**: Structured layouts, pages, and routing.
- **Tailwind CSS v4**: Modern styling with CSS variables and OKLCH color spaces.
- **Zustand State Management**: Persistent global stores for theme and application state.
- **Type-Safe API & Validation**: Axios integration with Zod schemas and React Query (TanStack).
- **Premium UI Components**: Custom-built, accessible components inspired by Shadcn UI.
- **Enhanced Logging**: Structured, group-collapsed console output for a cleaner dev experience.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Router**: [React Router 7](https://reactrouter.com/)
- **State**: [Zustand](https://docs.pmnd.rs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Installation

```bash
bun install
```

### 2. Development

```bash
bun run dev
```

### 3. Build

```bash
bun run build
```

---

## 🎨 Theme Setup & Modification

### Theme Store
The theme state is managed by Zustand in `src/store/useThemeStore.ts`. It supports `light`, `dark`, and `system` modes with automatic persistence to `localStorage`.

### Theme Provider
Wrap your application (or specific sections) with `<ThemeProvider />` from `src/components/ThemeProvider.tsx`.

### Customizing Colors
Modify the CSS variables in `src/index.css` within the `@theme` block. We use OKLCH for better color perception.

```css
@theme {
  --color-primary: oklch(0.59 0.201 273.444);
  --color-background: oklch(1 0 0);
  /* ... */
}
```

---

## 📦 Package Usage Guides

### 🌐 API (Axios + React Query)
API calls are centralized in `src/api/axios.ts`. Use React Query for data fetching:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => axiosInstance.get('/users').then(res => res.data),
});
```

### 🛡️ Validation (Zod)
Define your data shapes in `src/types/schema.ts`:

```typescript
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});
```

### 📝 Forms (React Hook Form)
Integrated with `@hookform/resolvers` for Zod support:

```tsx
const form = useForm({
  resolver: zodResolver(UserSchema),
});
```

### 📦 State (Zustand)
Create stores in `src/store/`:

```typescript
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}));
```

---

## 📂 Project Structure

```text
src/
├── api/          # Axios instance and API calls
├── assets/       # Static assets (images, svgs)
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts (e.g., RootLayout)
├── lib/          # Utilities (logger, etc.)
├── pages/        # Route-level components
├── providers/    # Context/Query providers
├── store/        # Zustand stores
└── types/        # Zod schemas and TS types
```

---

## 📜 License
MIT
