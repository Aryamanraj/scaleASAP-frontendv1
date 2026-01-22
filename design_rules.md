# Design Rules & Architectural Patterns

This document outlines the core design and architectural principles for the Scalemvp codebase. Adhering to these rules ensures modularity, scalability, and a consistent, premium user experience.

## 1. Architectural Patterns

### 1.1 Modularity (Components)
- **Feature-Based Nesting**: Components should be grouped by feature (e.g., `components/onboarding/`).
- **Sub-step Organization**: For complex flows like onboarding, further break down components into sub-folders (e.g., `components/onboarding/steps/`).
- **Shared UI**: Use `components/ui/` for primitive, reusable components (mostly Radix UI / Shadcn based).

### 1.2 Modularity (Prompts)
- **Segmented Prompts**: Large system prompts must be broken into logical segments (e.g., `lib/prompts/discovery/core.md`).
- **Orchestration**: Use an orchestrator (e.g., `orchestrator.ts`) to dynamically assemble prompt segments based on the current state or `turnCount`.
- **Variable Injection**: Use double-curly braces for variables (e.g., `{{user_name}}`) to be replaced at runtime.

### 1.3 State & Persistence
- **Primary Persistence**: Use **Supabase** for all permanent application data (workspaces, user profiles, credentials).
- **Transient State**: Use `localStorage` ONLY for transient UI state that doesn't require backend sync (e.g., active tab, draft form data before submission).
- **Data Integrity**: Always use server actions (`app/actions/`) for database mutations to ensure type safety and security.

## 2. UI & Design System

### 2.1 Typography & Aesthetics
- **Wow Factor**: Aim for a premium feel using:
    - **Typography**: Modern sans-serif (Inter/Outfit).
    - **Colors**: Primary text `#4A4A4A`.
    - **Accents**: Vibrant green `#43B97B` for primary actions.
    - **Glassmorphism**: Subtle backgrounds and blurs for overlays.
- **Personalized Headings**: Use personalised greetings where possible (e.g., "Select Workspace, [Name]").

### 2.2 Buttons
- **Primary**: Green background, used for the main call to action.
- **Secondary**: White background (`#ffffff`), border `#EEEEEE`, text `#4A4A4A`. Hover: text `#43B97B`.
- **Ghost**: Used for secondary actions (e.g., "Edit Details"). No border, muted text.
- **Destructive**: Red text (`text-red-500`). Hover: `hover:text-red-500/80`. Use for logout or delete triggers.

### 2.3 Card Patterns
- **Workspace Cards**: 
    - Display **Website** in descriptions.
    - Show "Finish Onboarding" for incomplete workspaces.
    - Show "Enter Workspace" (Primary/Secondary) and "Edit Details" (Ghost) side-by-side for completed workspaces.
- **Deletion**: Use a `Trash2` icon in the top-right. Must trigger an `AlertDialog` for confirmation.

## 3. Interaction & Accessibility

### 3.1 Form Submission
- **Enter Key Support**: Always wrap inputs in a `<form>` to ensure "Enter" key submits the data.
- **Validation**: Provide immediate visual feedback for validation errors.
- **Loading States**: Display loaders or disable buttons during async operations to prevent double-submission.

### 3.2 Navigation & Footers
- **Fixed Footers**: Use bottom-fixed footers for utility links (Privacy, Terms, Logout).
- **Consistency**: Maintain consistent padding and gaps (e.g., `gap-4`) across navigation elements.

