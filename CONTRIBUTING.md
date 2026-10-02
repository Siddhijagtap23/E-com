# 🤝 Contributing & Code Conventions

This document outlines the coding standards, branch conventions, and contribution guidelines for the **MERN Mini E-Commerce Project**.

---

## 1. Branching & Commit Conventions

### Branch Strategy
- `main`: Production-ready, stable documentation and code.
- `feature/<feature-name>`: Dedicated feature development branches (e.g., `feature/admin-orders`, `feature/cart-stock-check`).
- `bugfix/<issue-name>`: Bug fixes and edge-case handling.

### Commit Message Guidelines
Follow conventional commits:
- `feat:` A new feature or endpoint.
- `fix:` A bug fix.
- `docs:` Documentation changes only (e.g., Markdown files).
- `style:` Formatting, missing semicolons, CSS tweaks (no code logic changes).
- `refactor:` Code restructuring without changing external API or UI behavior.

**Examples:**
- `docs: add comprehensive REST API documentation and MongoDB schemas`
- `feat(server): implement order placement with atomic stock reduction`
- `fix(client): enforce stock ceiling in cart quantity counter`

---

## 2. Code Quality & Standards

### JavaScript & React Conventions
- Use functional components with React Hooks (`useState`, `useEffect`, `useContext`, `useMemo`).
- Keep components focused and modular (extract reusable components like `Modal`, `Button`, `Toast`, `Badge`).
- Use Tailwind CSS utility classes; avoid inline styles.
- Maintain consistent file naming: PascalCase for components (`ProductCard.jsx`), camelCase for utilities and hooks (`useCart.js`).

### Node.js & Express Conventions
- Structure controllers with `async/await` and wrapped in `try/catch` or an async handler middleware.
- Never write business logic directly inside route files; delegate to dedicated controller functions.
- Always validate incoming payload boundaries prior to database interaction.
- Respond with standard JSON envelopes containing `{ success, data, message }`.

---

## 3. Pull Request (PR) Checklist

Before submitting a PR or merging into `main`:
1. [ ] Documentation updated if endpoints or schemas change.
2. [ ] No sensitive credentials, secrets, or hardcoded tokens in commits.
3. [ ] All routes protected with appropriate middleware (`authMiddleware`, `adminMiddleware`).
4. [ ] Frontend builds cleanly with no unresolved imports (`npm run build`).
