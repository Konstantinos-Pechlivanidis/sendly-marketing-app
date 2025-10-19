# Sendly Marketing App - iOS 18 Style Guide

## Brand Palette

### Primary Colors
- **Primary**: `#64D3C1` - Main brand color for CTAs and highlights
- **Secondary**: `#1C7B7B` - Secondary actions and accents
- **Deep**: `#004E47` - Text and dark elements
- **Neutral**: `#D9B88C` - Warm neutral for subtle elements
- **Accent**: `#E27D43` - Orange accent for warnings and highlights
- **Danger**: `#8A3E2E` - Error states and destructive actions

### Semantic Colors
- **Brand**: `#64D3C1` (primary brand color)
- **Ink**: `#1F2937` (primary text)
- **Ink Secondary**: `#6B7280` (secondary text)
- **Ink Tertiary**: `#9CA3AF` (muted text)
- **Card**: `#FFFFFF` (card backgrounds)
- **Surface**: `#FFFFFF` (main surface)
- **Surface Secondary**: `#F9FAFB` (subtle backgrounds)
- **Muted**: `#F3F4F6` (muted backgrounds)
- **Positive**: `#10B981` (success states)
- **Warning**: `#F59E0B` (warning states)
- **Negative**: `#EF4444` (error states)

## Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif
- **Mono**: SF Mono, Monaco, Inconsolata, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Code, Droid Sans Mono, Courier New, monospace

### Text Scale
- **H1**: 2.25rem (36px) - Page titles
- **H2**: 1.875rem (30px) - Section headers
- **H3**: 1.5rem (24px) - Card titles
- **Body**: 1rem (16px) - Body text
- **Caption**: 0.875rem (14px) - Secondary text
- **Label**: 0.875rem (14px) - Form labels

## Spacing (8px Grid)

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

### iOS 18 Rounded Corners
- **sm**: 8px - Small elements
- **md**: 12px - Default
- **lg**: 16px - Cards
- **xl**: 20px - Large cards
- **2xl**: 24px - Hero elements
- **3xl**: 28px - Special cases

## Shadows

### Elevation System
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- **card**: `0 4px 16px 0 rgba(0, 0, 0, 0.08)` - Card shadows
- **elevated**: `0 8px 24px 0 rgba(0, 0, 0, 0.12)` - Hover states
- **floating**: `0 16px 40px 0 rgba(0, 0, 0, 0.16)` - Modals
- **glass**: `0 8px 32px 0 rgba(31, 38, 135, 0.37)` - Glass effects

## Components

### Buttons
```jsx
// Primary button
<Button variant="primary" size="md">Primary Action</Button>

// Secondary button
<Button variant="secondary" size="md">Secondary Action</Button>

// Ghost button
<Button variant="ghost" size="md">Ghost Action</Button>

// Danger button
<Button variant="danger" size="md">Delete</Button>
```

### Cards
```jsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Interactive card
<Card interactive>
  <CardContent>Clickable card</CardContent>
</Card>

// Glass card
<Card variant="glass">
  <CardContent>Glass effect card</CardContent>
</Card>
```

### Stats
```jsx
<Stat
  icon="📱"
  label="Total SMS Sent"
  value="1,234"
  delta="+12%"
  deltaType="positive"
/>
```

### Badges
```jsx
<Badge variant="primary">Primary</Badge>
<Badge variant="positive">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="negative">Error</Badge>
```

### Inputs
```jsx
<Input placeholder="Enter text..." />
<Input error placeholder="Error state" />
<Textarea placeholder="Enter message..." />
<Select>
  <option>Option 1</option>
  <option>Option 2</option>
</Select>
```

## Layout

### App Shell
```jsx
<AppShell>
  <AppHeader>
    {/* Header content */}
  </AppHeader>
  <AppSidebar>
    {/* Navigation */}
  </AppSidebar>
  <AppMain>
    <AppContent>
      {/* Page content */}
    </AppContent>
  </AppMain>
</AppShell>
```

### Sections
```jsx
<Section>
  <SectionHeader
    title="Section Title"
    description="Section description"
    action={<Button>Action</Button>}
  />
  <SectionContent>
    {/* Section content */}
  </SectionContent>
</Section>
```

## Animations

### Transitions
- **Fast**: 150ms - Hover states
- **Normal**: 200ms - Default transitions
- **Slow**: 300ms - Page transitions
- **iOS**: 300ms - iOS-style easing

### Easing Functions
- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **iOS**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **iOS In**: `cubic-bezier(0.42, 0, 1, 1)`
- **iOS Out**: `cubic-bezier(0, 0, 0.58, 1)`

## Accessibility

### Focus Management
- All interactive elements have visible focus rings
- Focus rings use brand color with 50% opacity
- Focus offset of 2px for better visibility

### Touch Targets
- Minimum 44px touch targets for mobile
- Proper spacing between interactive elements

### Color Contrast
- All text meets WCAG AA contrast requirements
- Brand colors tested for accessibility compliance

## Usage Patterns

### Glass Effects
```css
.glass-surface {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Hover States
```css
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}
```

### Button Press Effects
```css
.button-press:active {
  transform: scale(0.98);
}
```

## Best Practices

1. **Consistency**: Use the design system components consistently
2. **Spacing**: Follow the 8px grid system
3. **Colors**: Use semantic color tokens instead of hardcoded values
4. **Typography**: Use the defined text scale
5. **Shadows**: Use the elevation system for depth
6. **Animations**: Keep transitions smooth and purposeful
7. **Accessibility**: Ensure proper contrast and focus management
8. **Mobile First**: Design for mobile, enhance for desktop

## Implementation Notes

- All components use Tailwind CSS classes
- CSS variables are defined in `app/styles/tokens.css`
- Global styles are in `app/styles/tailwind.css`
- Components are in `app/components/ui/`
- Maintain Shopify App Bridge functionality
- Use Polaris only for complex components (Modals, Toasts)
