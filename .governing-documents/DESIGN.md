# DESIGN SYSTEM SPECIFICATION

**PURPOSE:** UI/UX standards for Associated Psych Platform
**AUDIENCE:** AI agents building interface components
**VERSION:** 2.0

---

## 🎨 DESIGN TOKENS (COPY-PASTE READY)

### Colors
```typescript
// tailwind.config.ts - Add to theme.extend.colors
export const colors = {
  brand: {
    background: '#E6EEF5',  // Soft calm base
    primary: '#1A365D',     // Trust, intellect
    accent: '#6B8EAE',      // Warm professionalism
    white: '#F7FAFC',       // White space
    text: '#2D3748',        // Grounded contrast
  },
  // shadcn/ui overrides
  primary: {
    DEFAULT: '#1A365D',
    foreground: '#F7FAFC',
  },
  accent: {
    DEFAULT: '#6B8EAE',
    foreground: '#F7FAFC',
  },
  background: '#E6EEF5',
  foreground: '#2D3748',
} as const;
```

### Typography
```typescript
// tailwind.config.ts - Add to theme.extend
export const typography = {
  fontFamily: {
    heading: ['Inter', 'sans-serif'],
    body: ['Lato', 'sans-serif'],
    button: ['Nunito Sans', 'sans-serif'],
  },
  // Font weights
  fontWeight: {
    heading: '600', // semibold
    body: '400',    // regular
    button: '500',  // medium
  },
} as const;
```

### Spacing & Layout
```typescript
// Already in Tailwind by default, but documented here
export const layout = {
  maxWidth: '1200px',      // Container max-width
  gridColumns: 12,         // Grid system
  spacingScale: 4,         // 4px base unit (Tailwind default)
  
  // Common spacing values
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
  },
} as const;
```

### Motion & Animation
```typescript
// Framer Motion variants (copy-paste into components)
export const animations = {
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  
  // Slide up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  // Scale (for modals)
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  
  // Slide from right (for sidebars)
  slideFromRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
} as const;

// CSS transitions (for non-Framer elements)
export const cssTransitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.15s ease-in-out',
  slow: 'all 0.3s ease-in-out',
} as const;
```

### Component Styles
```typescript
// Common component patterns
export const componentStyles = {
  card: {
    base: 'rounded-xl bg-white/70 backdrop-blur-sm shadow-md border border-white/20',
    hover: 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200',
  },
  
  button: {
    base: 'rounded-xl font-button font-medium shadow-sm transition-all duration-200',
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90',
    accent: 'bg-brand-accent text-white hover:bg-brand-accent/90',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  },
  
  input: {
    base: 'rounded-lg border border-gray-300 px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all',
  },
  
  container: {
    base: 'max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8',
  },
} as const;
```

---

## 📐 LAYOUT PATTERNS

### Page Container
```tsx
// Standard page wrapper
<div className="min-h-screen bg-brand-background">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </div>
</div>
```

### Card Grid
```tsx
// Responsive card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="rounded-xl bg-white/70 backdrop-blur-sm shadow-md">
      {/* Card content */}
    </Card>
  ))}
</div>
```

### Two-Column Layout
```tsx
// Sidebar + main content
<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
  <aside className="hidden lg:block">
    {/* Sidebar */}
  </aside>
  <main>
    {/* Main content */}
  </main>
</div>
```

---

## 🎯 UX PRINCIPLES

### 1. Empathetic & Calm
**Goal:** Reduce cognitive load, create sense of safety

**Implementation:**
- Use soft colors (background: `#E6EEF5`)
- Ample white space (padding: `py-8`, `px-6`)
- Clear visual hierarchy (headings: `text-3xl`, body: `text-base`)
- No aggressive CTAs or popups
- Gentle animations (200-300ms)

**Example:**
```tsx
// Good: Calm, clear
<div className="space-y-6 py-8">
  <h1 className="text-3xl font-heading font-semibold text-brand-text">
    Find Your Therapist
  </h1>
  <p className="text-base font-body text-gray-600 max-w-2xl">
    Browse our verified therapists and schedule a consultation.
  </p>
</div>

// Bad: Aggressive, cluttered
<div className="bg-red-500 text-white py-2 px-4 animate-bounce">
  🔥 LIMITED TIME! BOOK NOW OR LOSE YOUR SPOT! 🔥
</div>
```

### 2. Clinical & Professional
**Goal:** Build trust, convey competence

**Implementation:**
- Use primary color (`#1A365D`) for trust
- Clean, minimal layouts
- Professional photography (not stock)
- Clear credentials display
- No marketing jargon

**Example:**
```tsx
// Therapist card - professional tone
<Card className="p-6">
  <div className="flex items-start gap-4">
    <Avatar className="w-16 h-16">
      <AvatarImage src={therapist.avatar_url} />
      <AvatarFallback>{therapist.initials}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <h3 className="text-xl font-heading font-semibold">
        {therapist.full_name}
      </h3>
      <p className="text-sm text-gray-600 font-body">
        {therapist.specializations.join(', ')}
      </p>
      <Badge variant="secondary" className="mt-2">
        {therapist.years_experience} years experience
      </Badge>
      {therapist.license_verified && (
        <Badge variant="default" className="ml-2">
          ✓ Verified
        </Badge>
      )}
    </div>
  </div>
</Card>
```

### 3. Progressive Disclosure
**Goal:** Show information only when needed

**Implementation:**
- Use accordions for detailed info
- Tooltips for clarifications
- Modals for actions
- Steppers for complex forms

**Example:**
```tsx
// Show details on demand
<Accordion type="single" collapsible>
  <AccordionItem value="bio">
    <AccordionTrigger>Full Biography</AccordionTrigger>
    <AccordionContent>
      <p className="text-gray-600">{therapist.bio}</p>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="approach">
    <AccordionTrigger>Therapeutic Approach</AccordionTrigger>
    <AccordionContent>
      <p className="text-gray-600">{therapist.approach}</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### 4. Accessible First
**Goal:** WCAG 2.1 AA compliance

**Implementation:**
- 4.5:1 contrast ratio minimum
- Keyboard navigation on all interactions
- Screen reader labels on all icons
- Focus indicators on all focusable elements
- Skip navigation link

**Example:**
```tsx
// Icon button with accessibility
<Button
  variant="ghost"
  size="icon"
  aria-label="Close modal"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</Button>

// Form field with proper labels
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email Address</FormLabel>
      <FormControl>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          aria-describedby="email-error"
          aria-invalid={!!form.formState.errors.email}
          {...field}
        />
      </FormControl>
      <FormMessage id="email-error" role="alert" />
    </FormItem>
  )}
/>
```

---

## 🧩 COMPONENT LIBRARY (shadcn/ui)

### Installation
```bash
npx shadcn-ui@latest init
# Select: Default style, Zinc color, CSS variables

# Install all needed components
npx shadcn-ui@latest add button input card dialog dropdown-menu select toast form label textarea calendar popover tabs avatar badge separator accordion scroll-area
```

### Customization (After Install)

**Update `components/ui/button.tsx`:**
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-button font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1A365D] text-white hover:bg-[#1A365D]/90 shadow-sm",
        accent: "bg-[#6B8EAE] text-white hover:bg-[#6B8EAE]/90 shadow-sm",
        outline: "border-2 border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D] hover:text-white",
        ghost: "hover:bg-gray-100",
        link: "text-[#1A365D] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Update `tailwind.config.ts`:**
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#E6EEF5',
          primary: '#1A365D',
          accent: '#6B8EAE',
          white: '#F7FAFC',
          text: '#2D3748',
        },
        primary: {
          DEFAULT: '#1A365D',
          foreground: '#F7FAFC',
        },
        accent: {
          DEFAULT: '#6B8EAE',
          foreground: '#F7FAFC',
        },
        background: '#E6EEF5',
        foreground: '#2D3748',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
        button: ['Nunito Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

---

## 🖼️ ICON USAGE (Lucide React)

### Installation
```bash
npm install lucide-react
```

### Usage
```tsx
import { Calendar, Clock, MapPin, User, X, Check, AlertCircle } from 'lucide-react';

// In components
<Calendar className="h-5 w-5 text-gray-600" />
<Button size="icon">
  <X className="h-4 w-4" />
</Button>

// Common icons for platform
import {
  Calendar,      // Scheduling
  Clock,         // Time/duration
  MapPin,        // Location
  User,          // User profile
  Users,         // Clients/therapists
  MessageCircle, // Messaging
  Video,         // Video sessions
  Phone,         // Phone sessions
  Mail,          // Email
  Bell,          // Notifications
  Search,        // Search
  Filter,        // Filters
  Settings,      // Settings
  Check,         // Success
  X,             // Close/error
  AlertCircle,   // Warning
  Info,          // Information
  ChevronRight,  // Navigation
  ChevronLeft,   // Navigation
  ChevronDown,   // Dropdown
  Menu,          // Mobile menu
  LogOut,        // Logout
  Edit,          // Edit
  Trash,         // Delete
  Plus,          // Add
} from 'lucide-react';
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints (Tailwind defaults)
```typescript
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const;
```

### Mobile-First Approach
```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col lg:flex-row gap-6">
  <div className="w-full lg:w-1/3">Sidebar</div>
  <div className="w-full lg:w-2/3">Main</div>
</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block lg:hidden">Mobile only</div>

// Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">Heading</h1>

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">Content</div>
```

---

## ✅ ACCESSIBILITY CHECKLIST

### Keyboard Navigation
- [ ] All interactive elements focusable with Tab
- [ ] Focus indicators visible (2px outline)
- [ ] Modals trap focus (use shadcn Dialog)
- [ ] Dropdown menus navigable with arrow keys
- [ ] Forms submittable with Enter key

### Screen Readers
- [ ] All images have `alt` text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form fields have associated `<label>` or `aria-label`
- [ ] Error messages use `role="alert"`
- [ ] Loading states use `aria-busy`

### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Large text (18pt+) contrast ≥ 3:1
- [ ] UI components contrast ≥ 3:1
- [ ] Don't rely on color alone to convey information

### Testing Tools
```bash
# Install axe DevTools browser extension
# Run Lighthouse accessibility audit
# Test with actual screen reader (NVDA/JAWS/VoiceOver)
```

---

## 🎨 DESIGN SYSTEM EXAMPLES

### Hero Section
```tsx
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand-background to-brand-accent/10 py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-brand-primary mb-6">
            Find the right therapist for you
          </h1>
          <p className="text-lg md:text-xl font-body text-gray-600 mb-8">
            Connect with licensed, verified therapists who specialize in what you need. 
            Your journey to better mental health starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Browse Therapists
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Therapist Card
```tsx
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';

interface TherapistCardProps {
  therapist: {
    id: string;
    full_name: string;
    avatar_url: string;
    specializations: string[];
    years_experience: number;
    rate_per_session: number;
    license_verified: boolean;
    bio: string;
  };
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={therapist.avatar_url} alt={therapist.full_name} />
          <AvatarFallback>{therapist.full_name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-heading font-semibold text-brand-text">
            {therapist.full_name}
          </h3>
          <p className="text-sm text-gray-600 font-body">
            {therapist.specializations.join(', ')}
          </p>
        </div>
        {therapist.license_verified && (
          <Badge variant="default" className="shrink-0">
            ✓ Verified
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600 font-body text-sm mb-4 line-clamp-2">
        {therapist.bio}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>{therapist.years_experience} years experience</span>
        <span className="font-semibold text-brand-primary">
          ${therapist.rate_per_session}/session
        </span>
      </div>
      
      <div className="flex gap-2">
        <Button className="flex-1" variant="default">
          <Calendar className="mr-2 h-4 w-4" />
          Book Session
        </Button>
        <Button variant="outline" size="icon">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
```

---

**Document Version:** 2.0
**Last Updated:** November 11, 2025
**Maintained By:** Gabe Cabrera
