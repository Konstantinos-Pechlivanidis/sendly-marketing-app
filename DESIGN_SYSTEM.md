# Sendly Marketing App - Design System

## Overview
This document outlines the complete design system for the Sendly Marketing App, built with Tailwind CSS and inspired by Outseta's clean SaaS dashboard patterns with iOS 18 design elements.

## Brand Palette

### Primary Colors
- **Primary**: `#64D3C1` - Teal green for primary actions and branding
- **Secondary**: `#1C7B7B` - Darker teal for secondary elements
- **Deep**: `#004E47` - Dark teal for text and emphasis
- **Neutral**: `#D9B88C` - Sand/beige for neutral elements
- **Accent**: `#E27D43` - Orange for highlights and CTAs
- **Danger**: `#8A3E2E` - Terracotta for errors and warnings

### Semantic Colors
- **Text**: `text-gray-900` (primary), `text-gray-600` (secondary), `text-gray-500` (tertiary)
- **Backgrounds**: `bg-white` (cards), `bg-gray-50` (subtle backgrounds)
- **Borders**: `border-gray-200` (default), `border-gray-300` (focused)

## Typography

### Font Family
- **Primary**: Inter (sans-serif)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

## Spacing (8px Grid System)

### Base Scale
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

## Border Radius

### iOS 18 Inspired
- **sm**: 8px
- **default**: 12px
- **md**: 16px
- **lg**: 20px
- **xl**: 24px
- **2xl**: 28px
- **3xl**: 32px

## Shadows

### Elevation Levels
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **default**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Special Shadows
- **card**: `0 4px 16px 0 rgba(0, 0, 0, 0.08)`
- **elevated**: `0 8px 24px 0 rgba(0, 0, 0, 0.12)`
- **floating**: `0 16px 40px 0 rgba(0, 0, 0, 0.16)`

## Components

### Cards
```jsx
<Card className="hover:shadow-lg transition-all duration-200">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Buttons
```jsx
<Button variant="primary" size="md">
  Primary Action
</Button>
<Button variant="outline" size="sm">
  Secondary Action
</Button>
```

### Form Elements
```jsx
<FormSection title="Settings" description="Configure your preferences">
  <FormField label="Email" required>
    <Input type="email" placeholder="Enter your email" />
  </FormField>
</FormSection>
```

### Tables
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Layout Patterns

### Page Structure
```jsx
<PageLayout>
  <PageHeader title="Page Title" subtitle="Description">
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>Current Page</BreadcrumbItem>
    </Breadcrumb>
  </PageHeader>
  
  <PageContent>
    <PageSection>
      {/* Page content */}
    </PageSection>
  </PageContent>
</PageLayout>
```

### Grid Layouts
```jsx
{/* KPI Cards */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  <Card>...</Card>
</div>

{/* Two Column Layout */}
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <Card>...</Card>
</div>
```

## Accessibility

### Focus Management
- All interactive elements have visible focus rings
- Focus rings use brand color with 50% opacity
- Focus offset of 2px for better visibility

### Color Contrast
- All text meets WCAG AA standards
- Primary text: `text-gray-900` on white backgrounds
- Secondary text: `text-gray-600` for supporting information
- Error states: `text-red-600` for clear error indication

### Touch Targets
- Minimum 44px touch targets for all interactive elements
- Proper spacing between clickable elements

## Animations & Transitions

### Standard Transitions
- **Duration**: 200ms for most interactions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (iOS 18 inspired)
- **Properties**: `transition-all duration-200`

### Hover Effects
- Cards: `hover:shadow-lg` with subtle lift
- Buttons: `active:scale-98` for press feedback
- Interactive elements: `hover:bg-gray-50` for subtle feedback

## Best Practices

### Color Usage
- Use semantic color names over hex values
- Primary color for main actions and branding
- Secondary color for supporting elements
- Accent color for highlights and CTAs
- Danger color only for errors and destructive actions

### Spacing
- Use the 8px grid system consistently
- Prefer `space-y-4` over individual margins
- Use `gap-6` for card grids
- Use `p-6` for card padding

### Typography
- Use `font-semibold` for headings
- Use `font-medium` for labels and important text
- Use `text-sm` for secondary information
- Maintain consistent line heights

### Component Usage
- Always use the provided UI components
- Prefer composition over custom styling
- Use semantic HTML elements
- Include proper ARIA labels where needed

## File Structure

```
app/components/ui/
├── Button.jsx          # Primary button component
├── Card.jsx            # Card container and variants
├── Input.jsx           # Form inputs (Input, Textarea, Select)
├── Badge.jsx           # Status and category badges
├── Table.jsx           # Data tables
├── FormSection.jsx     # Form organization
├── Hero.jsx            # Landing page hero sections
├── CTA.jsx             # Call-to-action components
├── Stat.jsx            # KPI/metric displays
├── PageLayout.jsx      # Page structure components
├── Breadcrumb.jsx      # Navigation breadcrumbs
├── ActionButton.jsx    # Action button groups
├── Tabs.jsx            # Tab navigation
├── Modal.jsx           # Modal dialogs
├── Alert.jsx           # Alert messages
└── LoadingSpinner.jsx  # Loading indicators
```

## Implementation Notes

- All components use `forwardRef` for proper ref handling
- Components accept `className` prop for customization
- Consistent use of `cn()` utility for class merging
- All interactive elements have proper focus management
- Components follow React best practices for accessibility
