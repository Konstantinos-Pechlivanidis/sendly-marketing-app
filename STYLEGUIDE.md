# Sendly Marketing App - Style Guide

## 🎨 Design System Overview

This style guide documents the complete design system for the Sendly Marketing App, a Shopify embedded application built with React, Tailwind CSS, and inspired by Outseta's clean SaaS dashboard aesthetic.

### Design Philosophy
- **Outseta-Inspired**: Clean, professional SaaS dashboard UI
- **iOS 18 Patterns**: Soft depth, high polish, large rounded corners
- **Accessibility First**: WCAG AA compliance with proper contrast ratios
- **Mobile-First**: Responsive design with touch-friendly interactions
- **Consistent Spacing**: 8px grid system throughout

---

## 🎨 Brand Palette

### Primary Colors
```css
/* Brand Colors - Outseta Inspired */
--color-primary: #64D3C1    /* Teal - Primary actions */
--color-secondary: #1C7B7B  /* Dark Teal - Secondary */
--color-deep: #004E47       /* Dark Teal - Text */
--color-neutral: #D9B88C    /* Sand - Neutral */
--color-accent: #E27D43     /* Orange - Highlights */
--color-danger: #8A3E2E     /* Terracotta - Errors */
```

### Semantic Colors
```css
/* Text Colors */
--text-base: #1F2937        /* text-gray-900 - Primary text */
--text-secondary: #6B7280   /* text-gray-600 - Secondary text */
--text-tertiary: #9CA3AF   /* text-gray-500 - Tertiary text */

/* Background Colors */
--bg-primary: #FFFFFF       /* bg-white - Card backgrounds */
--bg-secondary: #F9FAFB     /* bg-gray-50 - Secondary backgrounds */
--bg-tertiary: #F3F4F6      /* bg-gray-100 - Tertiary backgrounds */
```

### Status Colors
```css
/* Success States */
--color-success: #10B981    /* text-green-600 - Success text */
--bg-success: #D1FAE5       /* bg-green-100 - Success background */

/* Warning States */
--color-warning: #F59E0B    /* text-yellow-600 - Warning text */
--bg-warning: #FEF3C7      /* bg-yellow-100 - Warning background */

/* Error States */
--color-error: #EF4444     /* text-red-600 - Error text */
--bg-error: #FEE2E2       /* bg-red-100 - Error background */
```

---

## 📏 Spacing System (8px Grid)

### Base Scale
```css
/* 8px Grid System */
--space-1: 4px     /* 0.25rem - Minimal spacing */
--space-2: 8px     /* 0.5rem - Small spacing */
--space-3: 12px    /* 0.75rem - Medium-small spacing */
--space-4: 16px    /* 1rem - Base spacing */
--space-5: 20px    /* 1.25rem - Medium spacing */
--space-6: 24px    /* 1.5rem - Large spacing */
--space-8: 32px    /* 2rem - Extra large spacing */
--space-10: 40px   /* 2.5rem - Section spacing */
--space-12: 48px   /* 3rem - Page spacing */
--space-16: 64px   /* 4rem - Major spacing */
--space-20: 80px   /* 5rem - Hero spacing */
--space-24: 96px   /* 6rem - Maximum spacing */
```

### Usage Examples
```jsx
// Card padding
<Card className="p-6">  {/* 24px padding */}
  <CardContent className="space-y-4">  {/* 16px vertical spacing */}
    <div className="flex items-center gap-3">  {/* 12px horizontal gap */}
      <span>Content</span>
    </div>
  </CardContent>
</Card>

// Page layout
<PageContent className="py-8">  {/* 32px vertical padding */}
  <PageSection className="space-y-6">  {/* 24px vertical spacing */}
    <Card>Content</Card>
  </PageSection>
</PageContent>
```

---

## 🔤 Typography Scale

### Font Family
```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
```css
/* Typography Scale */
--text-xs: 0.75rem     /* 12px - Small text */
--text-sm: 0.875rem    /* 14px - Body text */
--text-base: 1rem      /* 16px - Base text */
--text-lg: 1.125rem    /* 18px - Large text */
--text-xl: 1.25rem     /* 20px - Extra large text */
--text-2xl: 1.5rem     /* 24px - Headings */
--text-3xl: 1.875rem   /* 30px - Large headings */
--text-4xl: 2.25rem    /* 36px - Hero headings */
```

### Line Heights
```css
/* Line Height Scale */
--leading-tight: 1.25    /* Tight line height */
--leading-snug: 1.375    /* Snug line height */
--leading-normal: 1.5    /* Normal line height */
--leading-relaxed: 1.625 /* Relaxed line height */
--leading-loose: 2        /* Loose line height */
```

### Usage Examples
```jsx
// Headings
<h1 className="text-3xl font-bold text-gray-900 leading-tight">Page Title</h1>
<h2 className="text-2xl font-semibold text-gray-900 leading-snug">Section Title</h2>
<h3 className="text-xl font-semibold text-gray-900 leading-snug">Card Title</h3>

// Body text
<p className="text-base text-gray-900 leading-normal">Body text content</p>
<p className="text-sm text-gray-600 leading-normal">Secondary text content</p>
<p className="text-xs text-gray-500 leading-normal">Caption text content</p>
```

---

## 🔲 Border Radius System

### Radius Scale
```css
/* Border Radius Scale */
--radius-sm: 8px      /* rounded-md - Small elements */
--radius-md: 12px     /* rounded-lg - Default elements */
--radius-lg: 16px     /* rounded-xl - Large elements */
--radius-xl: 20px     /* rounded-2xl - Cards */
--radius-2xl: 24px    /* rounded-3xl - Hero sections */
--radius-full: 50%    /* rounded-full - Pills and badges */
```

### Usage Examples
```jsx
// Buttons
<Button className="rounded-lg">Default Button</Button>
<Button className="rounded-md" size="sm">Small Button</Button>

// Cards
<Card className="rounded-2xl">Default Card</Card>
<Card className="rounded-xl" variant="outline">Outline Card</Card>

// Inputs
<Input className="rounded-lg" />
<Badge className="rounded-full">Status</Badge>
```

---

## 🌟 Shadow System

### Shadow Scale
```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)                    /* shadow-sm */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)                 /* shadow-md */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)               /* shadow-lg */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)               /* shadow-xl */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)            /* shadow-2xl */
```

### Usage Examples
```jsx
// Cards
<Card className="shadow-md">Default Card</Card>
<Card className="shadow-lg hover:shadow-xl">Elevated Card</Card>

// Buttons
<Button className="shadow-sm hover:shadow-md">Button with Shadow</Button>

// Modals
<Modal className="shadow-2xl">Modal with Strong Shadow</Modal>
```

---

## 🎭 Component System

### Button Component
```jsx
// Button Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Action</Button>
<Button variant="ghost">Ghost Action</Button>
<Button variant="danger">Danger Action</Button>

// Button Sizes
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
<Button size="xl">Extra Large Button</Button>

// Button States
<Button loading>Loading Button</Button>
<Button disabled>Disabled Button</Button>
```

### Card Component
```jsx
// Card Variants
<Card variant="default">Default Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="glass">Glass Card</Card>
<Card variant="outline">Outline Card</Card>

// Card Structure
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Components
```jsx
// Input Components
<Input 
  type="email" 
  placeholder="Enter email" 
  error={hasError}
  required 
/>

<Textarea 
  placeholder="Enter message" 
  rows={4}
/>

<Select>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</Select>

// Form Organization
<FormSection title="Personal Information">
  <FormField label="First Name" required>
    <Input placeholder="Enter first name" />
  </FormField>
  <FormField label="Last Name" required>
    <Input placeholder="Enter last name" />
  </FormField>
</FormSection>
```

### Badge Component
```jsx
// Badge Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="neutral">Neutral</Badge>

// Badge Sizes
<Badge size="sm">Small Badge</Badge>
<Badge size="md">Medium Badge</Badge>
<Badge size="lg">Large Badge</Badge>
```

### Table Component
```jsx
// Table Structure
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 📱 Layout System

### Page Layout
```jsx
// Standard Page Structure
<PageLayout>
  <PageHeader 
    title="Page Title" 
    subtitle="Page description"
    actions={<Button>Action</Button>}
  >
    <Breadcrumb>
      <BreadcrumbItem href="/app">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem isLast>Current Page</BreadcrumbItem>
    </Breadcrumb>
  </PageHeader>
  
  <PageContent>
    <PageSection>
      <Card>
        <CardContent>
          <p>Page content goes here</p>
        </CardContent>
      </Card>
    </PageSection>
  </PageContent>
</PageLayout>
```

### Grid System
```jsx
// Responsive Grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

// KPI Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Total SMS</p>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-xl">
          <span className="text-2xl">📱</span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

---

## 🎨 Color Usage Guidelines

### Text Colors
```jsx
// Primary Text
<h1 className="text-gray-900">Main Heading</h1>
<p className="text-gray-900">Primary Text</p>

// Secondary Text
<p className="text-gray-600">Secondary Text</p>
<span className="text-gray-500">Tertiary Text</span>

// Brand Colors
<span className="text-primary">Primary Brand</span>
<span className="text-secondary">Secondary Brand</span>
<span className="text-accent">Accent Color</span>
```

### Background Colors
```jsx
// Card Backgrounds
<Card className="bg-white">White Card</Card>
<Card className="bg-gray-50">Light Gray Card</Card>

// Brand Backgrounds
<div className="bg-primary text-white">Primary Background</div>
<div className="bg-secondary text-white">Secondary Background</div>
<div className="bg-accent text-white">Accent Background</div>
```

### Status Colors
```jsx
// Success States
<Badge variant="success">Success</Badge>
<div className="text-green-600">Success Text</div>
<div className="bg-green-100">Success Background</div>

// Warning States
<Badge variant="warning">Warning</Badge>
<div className="text-yellow-600">Warning Text</div>
<div className="bg-yellow-100">Warning Background</div>

// Error States
<Badge variant="danger">Error</Badge>
<div className="text-red-600">Error Text</div>
<div className="bg-red-100">Error Background</div>
```

---

## ♿ Accessibility Guidelines

### Focus Management
```jsx
// Focus States
<Button className="focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
  Focusable Button
</Button>

<Input className="focus:ring-2 focus:ring-primary focus:ring-offset-0" />
```

### Color Contrast
- **Primary Text**: `text-gray-900` on white background (21:1 contrast)
- **Secondary Text**: `text-gray-600` on white background (7:1 contrast)
- **Brand Colors**: All brand colors meet WCAG AA standards
- **Status Colors**: High contrast ratios for all status indicators

### Touch Targets
```jsx
// Minimum 44px touch targets
<Button className="min-h-[44px] min-w-[44px]">Touch Target</Button>
<Input className="h-11">Touch-Friendly Input</Input>
```

### Screen Reader Support
```jsx
// ARIA Labels
<button aria-label="Close modal">×</button>
<input aria-describedby="email-help" />
<div id="email-help">Enter your email address</div>

// Live Regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## 🎭 Animation & Transitions

### Transition System
```css
/* Standard Transitions */
transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
```

### Usage Examples
```jsx
// Hover Effects
<Card className="hover:shadow-lg transition-all duration-200">
  <Button className="hover:scale-105 transition-transform duration-200">
    Hover Button
  </Button>
</Card>

// Focus Effects
<Input className="focus:ring-2 focus:ring-primary transition-all duration-200" />

// Loading States
<Button loading className="transition-opacity duration-200">
  Loading...
</Button>
```

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Tailwind Breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* Ultra wide screens */
```

### Responsive Patterns
```jsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Responsive Card</Card>
</div>

// Responsive Typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>

// Responsive Spacing
<div className="px-4 lg:px-6 py-6 lg:py-8">Responsive Container</div>
```

---

## 🛠️ Implementation Guidelines

### Component Structure
```jsx
// Standard Component Pattern
const Component = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "base-classes",
    variant: "variant-classes"
  };

  return (
    <element
      ref={ref}
      className={cn("base-styles", variants[variant], className)}
      {...props}
    >
      {children}
    </element>
  );
});
```

### Class Name Utilities
```jsx
// Using cn utility for conditional classes
import { cn } from "../../utils/cn";

<Button 
  className={cn(
    "base-classes",
    variant === "primary" && "bg-primary text-white",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )}
>
  Button Text
</Button>
```

### Design Token Usage
```jsx
// Use Tailwind classes instead of custom CSS
<Card className="bg-white rounded-2xl shadow-md p-6">
  <h3 className="text-xl font-semibold text-gray-900">Card Title</h3>
  <p className="text-sm text-gray-600">Card description</p>
</Card>
```

---

## 📚 Best Practices

### Do's
- ✅ Use semantic HTML elements
- ✅ Maintain consistent spacing with 8px grid
- ✅ Use proper contrast ratios for accessibility
- ✅ Implement focus states for all interactive elements
- ✅ Use Tailwind utility classes for styling
- ✅ Follow the component structure patterns
- ✅ Test on multiple screen sizes
- ✅ Use proper ARIA labels and descriptions

### Don'ts
- ❌ Don't use inline styles
- ❌ Don't create custom CSS classes
- ❌ Don't ignore accessibility requirements
- ❌ Don't use low contrast color combinations
- ❌ Don't create components without proper variants
- ❌ Don't forget to test keyboard navigation
- ❌ Don't use hardcoded values instead of design tokens

---

## 🎯 Component Checklist

### Before Implementing a Component
- [ ] Define all necessary variants
- [ ] Implement proper accessibility attributes
- [ ] Add focus states and keyboard navigation
- [ ] Ensure proper contrast ratios
- [ ] Test on multiple screen sizes
- [ ] Add proper TypeScript types (if applicable)
- [ ] Document component usage
- [ ] Add loading and error states
- [ ] Implement proper animations/transitions

### Before Using a Component
- [ ] Check if component exists in design system
- [ ] Use appropriate variant for the use case
- [ ] Ensure proper spacing and layout
- [ ] Test accessibility with screen reader
- [ ] Verify responsive behavior
- [ ] Check color contrast ratios
- [ ] Ensure proper focus management

---

This comprehensive style guide ensures consistent, accessible, and maintainable design across the entire Sendly Marketing App. All components and pages should follow these guidelines to maintain a cohesive user experience.