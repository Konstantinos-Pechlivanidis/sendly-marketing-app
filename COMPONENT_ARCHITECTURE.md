# Sendly Marketing App - Component Architecture Documentation

## Overview
Αυτό το έγγραφο περιγράφει την αρχιτεκτονική των components και pages του Sendly Marketing App, το οποίο είναι ένα Shopify embedded app με React Router και Tailwind CSS design system.

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + React Router
- **Styling**: Tailwind CSS + Custom Design System
- **Backend Integration**: Shopify App Bridge + Custom API
- **Database**: Prisma ORM
- **Deployment**: Shopify App Store

### Design System
- **Inspiration**: Outseta SaaS Dashboard + iOS 18 Design Patterns
- **Color Palette**: Custom brand colors (Primary: #64D3C1, Secondary: #1C7B7B, etc.)
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Reusable UI component library

---

## 📄 Pages Architecture

### 1. Dashboard Page (`app/routes/pages/dashboard.jsx`)

#### Purpose
Κεντρική σελίδα με overview των SMS marketing metrics και system health.

#### Components Used
- **PageLayout**: Main page structure
- **PageHeader**: Header with breadcrumbs and actions
- **Card**: KPI metrics display
- **Stat**: Individual metric tiles
- **Badge**: Status indicators
- **Alert**: System notifications
- **Button**: Action buttons

#### Design Pattern
```jsx
<PageLayout>
  <PageHeader title="Dashboard" subtitle="SMS Marketing Overview">
    <Breadcrumb>...</Breadcrumb>
  </PageHeader>
  <PageContent>
    <PageSection>
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>...</Card>
      </div>
      {/* Activity & Health Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Card>...</Card>
      </div>
    </PageSection>
  </PageContent>
</PageLayout>
```

#### Key Features
- **KPI Metrics**: SMS sent, delivery rate, contacts, wallet balance
- **Recent Activity**: Live activity feed
- **System Health**: Service status monitoring
- **Campaign Performance**: Active/scheduled/completed campaigns
- **Debug Panel**: Development information

#### Styling Approach
- **Grid Layout**: Responsive 4-column KPI grid
- **Card Design**: Soft shadows with hover effects
- **Color Coding**: Green for success, red for errors, primary for branding
- **Interactive Elements**: Hover states and smooth transitions

---

### 2. Campaigns Page (`app/routes/pages/campaigns.jsx`)

#### Purpose
Διαχείριση SMS campaigns με δυνατότητα δημιουργίας, επεξεργασίας και προγραμματισμού.

#### Components Used
- **PageLayout**: Main structure
- **Tabs**: Campaign status filtering
- **Card**: Campaign list items
- **Modal**: Create/edit campaign forms
- **Input/Textarea/Select**: Form elements
- **Badge**: Campaign status indicators
- **Button**: Actions (Create, Edit, Delete)

#### Design Pattern
```jsx
<PageLayout>
  <PageHeader title="Campaigns" subtitle="Manage your SMS campaigns">
    <ActionGroup>
      <ActionButton variant="primary">Create Campaign</ActionButton>
    </ActionGroup>
  </PageHeader>
  <PageContent>
    <Tabs>
      <TabsList>
        <TabsTrigger value="all">All Campaigns</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
      </TabsList>
      <TabsContent>
        {/* Campaign List */}
      </TabsContent>
    </Tabs>
  </PageContent>
</PageLayout>
```

#### Key Features
- **Campaign List**: Filterable and sortable campaign table
- **Status Management**: Active, scheduled, completed, draft states
- **Form Modals**: Create/edit campaign with validation
- **Preview Functionality**: Campaign preview before sending
- **Bulk Actions**: Multiple campaign management

#### Styling Approach
- **Tab Navigation**: Clean status filtering
- **Card List**: Hover effects and status indicators
- **Modal Forms**: Centered overlays with backdrop blur
- **Form Validation**: Real-time error states

---

### 3. Contacts Page (`app/routes/pages/contacts.jsx`)

#### Purpose
Διαχείριση contact list με δυνατότητα import/export και segmentation.

#### Components Used
- **PageLayout**: Main structure
- **Table**: Contact data display
- **Card**: Contact statistics
- **Modal**: Add/edit contact forms
- **Input/Select**: Form elements
- **Badge**: Contact status and tags
- **Button**: Actions (Add, Import, Export)

#### Design Pattern
```jsx
<PageLayout>
  <PageHeader title="Contacts" subtitle="Manage your contact list">
    <ActionGroup>
      <ActionButton variant="primary">Add Contact</ActionButton>
      <ActionButton variant="outline">Import</ActionButton>
    </ActionGroup>
  </PageHeader>
  <PageContent>
    <PageSection>
      {/* Contact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        <Card>...</Card>
      </div>
      {/* Contact Table */}
      <Table>
        <TableHeader>...</TableHeader>
        <TableBody>...</TableBody>
      </Table>
    </PageSection>
  </PageContent>
</PageLayout>
```

#### Key Features
- **Contact Management**: CRUD operations for contacts
- **Statistics**: Total contacts, opted-in, unsubscribed
- **Import/Export**: CSV file handling
- **Segmentation**: Contact grouping and filtering
- **Bulk Actions**: Multiple contact operations

#### Styling Approach
- **Table Design**: Clean rows with hover states
- **Statistics Cards**: Metric display with icons
- **Form Modals**: Contact creation/editing
- **Status Indicators**: Visual contact status

---

### 4. Settings Page (`app/routes/pages/settings.jsx`)

#### Purpose
Ρυθμίσεις εφαρμογής, billing, και system configuration.

#### Components Used
- **PageLayout**: Main structure
- **Tabs**: Settings categories
- **FormSection**: Organized form groups
- **Input/Select/Textarea**: Configuration inputs
- **Card**: Settings sections
- **Button**: Save actions
- **Modal**: Payment processing

#### Design Pattern
```jsx
<PageLayout>
  <PageHeader title="Settings" subtitle="Configure your application">
    <ActionGroup>
      <ActionButton variant="primary">Save Settings</ActionButton>
    </ActionGroup>
  </PageHeader>
  <PageContent>
    <Tabs>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent>
        <FormSection title="SMS Provider Settings">
          <FormField label="API Key" required>
            <Input type="password" />
          </FormField>
        </FormSection>
      </TabsContent>
    </Tabs>
  </PageContent>
</PageLayout>
```

#### Key Features
- **General Settings**: SMS provider configuration
- **Billing Management**: Package selection and payment
- **System Health**: Service status monitoring
- **Support**: Help and contact information
- **Account**: User profile management

#### Styling Approach
- **Tab Organization**: Logical settings grouping
- **Form Sections**: Clear field organization
- **Validation States**: Real-time form feedback
- **Payment Integration**: Secure billing interface

---

### 5. Templates Page (`app/routes/pages/templates.jsx`)

#### Purpose
Διαχείριση SMS templates με preview και customization.

#### Components Used
- **PageLayout**: Main structure
- **Card**: Template display
- **Modal**: Template editor
- **Textarea**: Template content
- **Button**: Template actions
- **Badge**: Template categories

#### Key Features
- **Template Library**: Pre-built SMS templates
- **Custom Templates**: User-created templates
- **Preview Functionality**: Template preview before use
- **Category Management**: Template organization
- **Variable Support**: Dynamic content insertion

---

### 6. Automations Page (`app/routes/pages/automations.jsx`)

#### Purpose
Διαχείριση automated SMS workflows και triggers.

#### Components Used
- **PageLayout**: Main structure
- **Card**: Automation display
- **Modal**: Automation builder
- **Select**: Trigger configuration
- **Button**: Automation actions
- **Badge**: Automation status

#### Key Features
- **Workflow Builder**: Visual automation creation
- **Trigger Management**: Event-based automation
- **Status Monitoring**: Automation performance
- **Template Integration**: SMS template usage

---

### 7. Reports Page (`app/routes/pages/reports.jsx`)

#### Purpose
Analytics και reporting για SMS campaigns και performance.

#### Components Used
- **PageLayout**: Main structure
- **Card**: Report sections
- **Table**: Data display
- **Button**: Export actions
- **Badge**: Performance indicators

#### Key Features
- **Campaign Analytics**: Performance metrics
- **Delivery Reports**: SMS delivery statistics
- **Revenue Tracking**: Billing and usage reports
- **Export Functionality**: Data export capabilities

---

## 🧩 UI Components Library

### Core Components

#### 1. Layout Components

##### PageLayout (`app/components/ui/PageLayout.jsx`)
```jsx
// Main page structure
<PageLayout>
  <PageHeader title="Page Title" subtitle="Description">
    <Breadcrumb>...</Breadcrumb>
  </PageHeader>
  <PageContent>
    <PageSection>Content</PageSection>
  </PageContent>
</PageLayout>
```

**Design Pattern**: 
- **Sticky Header**: Fixed navigation with backdrop blur
- **Responsive Content**: Adaptive layout for all screen sizes
- **Breadcrumb Navigation**: Clear page hierarchy

##### Section (`app/components/ui/Section.jsx`)
```jsx
// Content organization
<Section>
  <SectionHeader title="Section Title" />
  <SectionContent>Content</SectionContent>
</Section>
```

**Design Pattern**:
- **Max Width**: 7xl container with responsive padding
- **Spacing**: Consistent 6-unit spacing between sections
- **Typography**: Clear section hierarchy

#### 2. Data Display Components

##### Card (`app/components/ui/Card.jsx`)
```jsx
// Content containers
<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Variants**:
- **default**: Standard white background
- **elevated**: Enhanced shadow for emphasis
- **glass**: Backdrop blur effect
- **outline**: Border-only styling

**Design Pattern**:
- **Rounded Corners**: 2xl border radius (24px)
- **Soft Shadows**: Card elevation system
- **Interactive States**: Hover and focus effects
- **Content Structure**: Header, content, footer sections

##### Table (`app/components/ui/Table.jsx`)
```jsx
// Data tables
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Design Pattern**:
- **Responsive**: Horizontal scroll on mobile
- **Hover States**: Row highlighting
- **Clean Typography**: Consistent text sizing
- **Border System**: Subtle row separators

##### Stat (`app/components/ui/Stat.jsx`)
```jsx
// KPI metrics
<Stat 
  icon="📊" 
  label="Total SMS" 
  value="1,234" 
  delta="+12%" 
  deltaType="positive" 
/>
```

**Design Pattern**:
- **Icon Integration**: Visual metric representation
- **Value Emphasis**: Large, bold numbers
- **Delta Indicators**: Trend visualization
- **Color Coding**: Positive/negative states

#### 3. Form Components

##### Input (`app/components/ui/Input.jsx`)
```jsx
// Form inputs
<Input 
  type="email" 
  placeholder="Enter email" 
  error={hasError}
  required 
/>
```

**Features**:
- **Validation States**: Error and success styling
- **Focus Management**: Ring-based focus indicators
- **Accessibility**: Proper labeling and ARIA support
- **Consistent Sizing**: 11-unit height for touch targets

##### FormSection (`app/components/ui/FormSection.jsx`)
```jsx
// Form organization
<FormSection title="Settings" description="Configure options">
  <FormField label="Email" required>
    <Input type="email" />
  </FormField>
  <FormGroup>
    <FormField label="First Name">
      <Input />
    </FormField>
    <FormField label="Last Name">
      <Input />
    </FormField>
  </FormGroup>
</FormSection>
```

**Design Pattern**:
- **Logical Grouping**: Related fields together
- **Clear Labels**: Required field indicators
- **Responsive Layout**: Grid system for field organization
- **Action Areas**: Save/cancel button placement

#### 4. Interactive Components

##### Button (`app/components/ui/Button.jsx`)
```jsx
// Action buttons
<Button variant="primary" size="md" loading>
  Save Changes
</Button>
```

**Variants**:
- **primary**: Brand color with white text
- **secondary**: Secondary brand color
- **outline**: Border with brand color text
- **ghost**: Transparent with hover states
- **danger**: Red for destructive actions

**Sizes**:
- **sm**: 9-unit height for compact spaces
- **md**: 11-unit height for standard use
- **lg**: 12-unit height for emphasis
- **xl**: 14-unit height for hero actions

##### Badge (`app/components/ui/Badge.jsx`)
```jsx
// Status indicators
<Badge variant="positive" size="sm">
  Active
</Badge>
```

**Variants**:
- **primary/secondary/accent**: Brand color variants
- **positive**: Green for success states
- **warning**: Yellow for caution
- **negative**: Red for errors
- **neutral**: Gray for inactive states

#### 5. Navigation Components

##### Breadcrumb (`app/components/ui/Breadcrumb.jsx`)
```jsx
// Page navigation
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>Current Page</BreadcrumbItem>
</Breadcrumb>
```

**Design Pattern**:
- **Hierarchy**: Clear page structure
- **Interactive**: Clickable parent pages
- **Separators**: Visual path indicators
- **Responsive**: Mobile-friendly display

##### Tabs (`app/components/ui/Tabs.jsx`)
```jsx
// Content organization
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content</TabsContent>
</Tabs>
```

**Design Pattern**:
- **Clean Navigation**: Underline-based selection
- **Smooth Transitions**: Content switching animations
- **Accessibility**: Keyboard navigation support
- **Responsive**: Mobile-friendly tab display

#### 6. Feedback Components

##### Alert (`app/components/ui/Alert.jsx`)
```jsx
// System messages
<Alert type="success" message="Settings saved successfully" />
```

**Types**:
- **success**: Green for positive feedback
- **warning**: Yellow for caution
- **error**: Red for errors
- **info**: Blue for information

##### Modal (`app/components/ui/Modal.jsx`)
```jsx
// Overlay dialogs
<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader>Title</ModalHeader>
  <ModalContent>Content</ModalContent>
  <ModalFooter>
    <Button>Save</Button>
  </ModalFooter>
</Modal>
```

**Design Pattern**:
- **Backdrop Blur**: iOS-inspired overlay
- **Centered Content**: Modal positioning
- **Focus Management**: Trap focus within modal
- **Escape Handling**: Close on escape key

#### 7. Specialized Components

##### Hero (`app/components/ui/Hero.jsx`)
```jsx
// Landing sections
<Hero>
  <HeroContent>
    <HeroTitle>Welcome to Sendly</HeroTitle>
    <HeroSubtitle>Powerful SMS marketing</HeroSubtitle>
    <HeroActions>
      <Button variant="primary">Get Started</Button>
    </HeroActions>
  </HeroContent>
</Hero>
```

**Design Pattern**:
- **Gradient Background**: Subtle brand color gradients
- **Typography Hierarchy**: Clear title and subtitle
- **Action Areas**: Prominent CTA placement
- **Responsive**: Mobile-optimized layouts

##### CTA (`app/components/ui/CTA.jsx`)
```jsx
// Call-to-action sections
<CTA variant="primary">
  <CTATitle>Upgrade Your Plan</CTATitle>
  <CTADescription>Get more features</CTADescription>
  <CTAActions>
    <Button>Upgrade</Button>
  </CTAActions>
</CTA>
```

**Variants**:
- **default**: White background
- **primary**: Brand color background
- **secondary**: Secondary brand color
- **accent**: Accent color background

---

## 🎨 Design System Implementation

### Color System
```css
/* Brand Colors */
--color-primary: #64D3C1    /* Teal - Primary actions */
--color-secondary: #1C7B7B  /* Dark Teal - Secondary */
--color-deep: #004E47        /* Dark Teal - Text */
--color-neutral: #D9B88C    /* Sand - Neutral */
--color-accent: #E27D43     /* Orange - Highlights */
--color-danger: #8A3E2E     /* Terracotta - Errors */
```

### Spacing System (8px Grid)
```css
/* Base Scale */
--space-1: 4px    /* 0.25rem */
--space-2: 8px    /* 0.5rem */
--space-3: 12px   /* 0.75rem */
--space-4: 16px   /* 1rem */
--space-6: 24px   /* 1.5rem */
--space-8: 32px   /* 2rem */
```

### Typography Scale
```css
/* Font Sizes */
--text-sm: 0.875rem    /* 14px - Small text */
--text-base: 1rem      /* 16px - Body text */
--text-lg: 1.125rem    /* 18px - Large text */
--text-xl: 1.25rem     /* 20px - Extra large */
--text-2xl: 1.5rem     /* 24px - Headings */
--text-3xl: 1.875rem   /* 30px - Large headings */
```

### Border Radius System
```css
/* iOS 18 Inspired */
--radius-sm: 8px      /* Small elements */
--radius-md: 12px     /* Default */
--radius-lg: 16px     /* Cards */
--radius-xl: 20px     /* Large cards */
--radius-2xl: 24px    /* Hero sections */
```

### Shadow System
```css
/* Elevation Levels */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## 🔧 Technical Implementation

### Component Architecture
```jsx
// Standard component structure
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
      className={cn(
        "base-styles",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </element>
  );
});
```

### Styling Approach
1. **Tailwind First**: Use Tailwind utilities for styling
2. **Component Variants**: Consistent variant system
3. **Responsive Design**: Mobile-first approach
4. **Accessibility**: WCAG AA compliance
5. **Performance**: Optimized CSS with PurgeCSS

### State Management
- **React Hooks**: useState, useEffect for local state
- **React Router**: useLoaderData for server state
- **Form Handling**: Controlled components with validation
- **Modal Management**: Local state for overlay controls

### Integration Patterns
- **Shopify App Bridge**: Native Shopify integration
- **API Client**: Custom API communication
- **Error Handling**: Consistent error states
- **Loading States**: User feedback during operations

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

### Layout Patterns
- **Mobile First**: Base styles for mobile
- **Progressive Enhancement**: Features for larger screens
- **Grid Systems**: Responsive column layouts
- **Touch Targets**: 44px minimum for mobile

---

## ♿ Accessibility Features

### Focus Management
- **Visible Focus**: Ring-based focus indicators
- **Keyboard Navigation**: Full keyboard support
- **Focus Trapping**: Modal focus management
- **Skip Links**: Navigation shortcuts

### Color Contrast
- **WCAG AA**: Minimum 4.5:1 contrast ratio
- **Text Colors**: High contrast text options
- **Status Indicators**: Color + text for status
- **Error States**: Clear error communication

### Screen Reader Support
- **Semantic HTML**: Proper element usage
- **ARIA Labels**: Descriptive labels
- **Live Regions**: Dynamic content updates
- **Alternative Text**: Image descriptions

---

## 🚀 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based splitting
- **Tree Shaking**: Unused code elimination
- **CSS Purging**: Unused style removal
- **Asset Optimization**: Image and font optimization

### Runtime Performance
- **React Optimization**: Memoization where needed
- **Lazy Loading**: Component lazy loading
- **Virtual Scrolling**: Large list optimization
- **Debounced Inputs**: Search and filter optimization

---

## 📚 Documentation Standards

### Component Documentation
- **Props Interface**: TypeScript-style prop documentation
- **Usage Examples**: Code examples for each component
- **Design Guidelines**: When and how to use components
- **Accessibility Notes**: Screen reader and keyboard support

### Code Organization
- **File Structure**: Logical component organization
- **Import Patterns**: Consistent import statements
- **Naming Conventions**: Clear, descriptive names
- **Comment Standards**: Inline documentation

---

## 🔄 Maintenance Guidelines

### Component Updates
- **Backward Compatibility**: Maintain existing APIs
- **Version Control**: Semantic versioning
- **Testing**: Component testing requirements
- **Documentation**: Update docs with changes

### Design System Evolution
- **Token Updates**: Centralized design token changes
- **Component Library**: Consistent component updates
- **Accessibility**: Regular accessibility audits
- **Performance**: Ongoing performance monitoring

---

This documentation provides a comprehensive overview of the Sendly Marketing App's component architecture, design patterns, and implementation details. Each component and page has been carefully designed to provide a consistent, accessible, and maintainable user experience while following modern React and design system best practices.
