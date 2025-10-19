# Shopify App Navigation Implementation Guide

## Overview

Αυτός ο οδηγός εξηγεί πώς έχει υλοποιηθεί το navigation system σύμφωνα με τις [Shopify Navigation Guidelines](https://shopify.dev/docs/apps/design/navigation).

## Architecture

### 1. Shopify App Bridge Navigation (Required)
```jsx
// app/routes/app.jsx
<s-app-nav>
  <s-link href="/app/dashboard">Dashboard</s-link>
  <s-link href="/app/campaigns">Campaigns</s-link>
  <s-link href="/app/contacts">Contacts</s-link>
  <s-link href="/app/settings">Settings</s-link>
  <s-link href="/app/templates">Templates</s-link>
  <s-link href="/app/automations">Automations</s-link>
  <s-link href="/app/reports">Reports</s-link>
</s-app-nav>
```

**Σημαντικό**: Το `<s-app-nav>` είναι **υποχρεωτικό** για την σωστή ενσωμάτωση με το Shopify admin. Δεν πρέπει να αφαιρεθεί ή να αντικατασταθεί.

### 2. Page Layout Components

#### PageLayout
```jsx
import { PageLayout, PageHeader, PageContent, PageSection } from "../components/ui/PageLayout";

<PageLayout>
  <PageHeader title="Page Title" subtitle="Page description" />
  <PageContent>
    <PageSection>
      {/* Page content */}
    </PageSection>
  </PageContent>
</PageLayout>
```

#### PageHeader
- **Title**: Κύριο όνομα της σελίδας
- **Subtitle**: Περιγραφή της σελίδας
- **Actions**: Primary/Secondary buttons
- **Breadcrumb**: Navigation breadcrumbs

#### PageContent
- **Container**: Max-width container με responsive padding
- **Spacing**: Consistent spacing system

#### PageSection
- **Sections**: Οργανωμένα sections με consistent spacing

### 3. Navigation Components

#### Breadcrumb
```jsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../components/ui/Breadcrumb";

<Breadcrumb>
  <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem href="/app/campaigns">Campaigns</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem isLast>New Campaign</BreadcrumbItem>
</Breadcrumb>
```

#### ActionButton
```jsx
import { ActionButton, ActionGroup } from "../components/ui/ActionButton";

<ActionGroup>
  <ActionButton variant="primary">Create Campaign</ActionButton>
  <ActionButton variant="secondary">Export</ActionButton>
  <ActionButton variant="ghost">Help</ActionButton>
</ActionGroup>
```

## Implementation Examples

### Dashboard Page
```jsx
export default function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your SMS marketing performance"
        actions={
          <ActionGroup>
            <ActionButton variant="secondary">Refresh</ActionButton>
            <ActionButton variant="primary">New Campaign</ActionButton>
          </ActionGroup>
        }
      >
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Dashboard</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      <PageContent>
        <PageSection>
          {/* Dashboard content */}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
```

### Campaigns Page
```jsx
export default function CampaignsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Campaigns"
        subtitle="Manage your SMS campaigns"
        actions={
          <ActionGroup>
            <ActionButton variant="secondary">Filter</ActionButton>
            <ActionButton variant="primary">Create Campaign</ActionButton>
          </ActionGroup>
        }
      >
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Campaigns</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      <PageContent>
        <PageSection>
          {/* Campaigns content */}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
```

## Key Principles

### 1. Shopify Integration
- **App Bridge Navigation**: Πάντα χρησιμοποιεί `<s-app-nav>` για main navigation
- **Page Structure**: Ακολουθεί τις Shopify page structure guidelines
- **Breadcrumbs**: Παρέχει clear navigation path

### 2. iOS 18 Styling
- **Glass Effects**: Backdrop blur για headers
- **Rounded Corners**: Large border radius (20px+)
- **Smooth Animations**: iOS-style transitions
- **Color System**: Brand colors με semantic naming

### 3. Accessibility
- **Focus Management**: Proper focus rings
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Touch Targets**: Minimum 44px touch targets

### 4. Responsive Design
- **Mobile First**: Design για mobile, enhance για desktop
- **Breakpoints**: Consistent responsive breakpoints
- **Touch Friendly**: Large touch targets για mobile

## Best Practices

### 1. Navigation Structure
- **Max 7 Items**: Στο `<s-app-nav>` χρησιμοποιεί max 7 items
- **Clear Labels**: Χρησιμοποιεί nouns αντί για verbs
- **Logical Grouping**: Οργανώνει items λογικά

### 2. Page Actions
- **Primary Action**: Μία primary action per page
- **Secondary Actions**: Μέχρι 3 secondary actions
- **Clear Labels**: Action-led button labels (verb + noun)

### 3. Breadcrumbs
- **Navigation Path**: Shows current location
- **Clickable**: Previous levels clickable
- **Consistent**: Same structure across pages

### 4. Content Organization
- **Single Purpose**: Κάθε σελίδα έχει έναν σκοπό
- **Clear Hierarchy**: Proper heading structure
- **Consistent Spacing**: 8px grid system

## Troubleshooting

### Common Issues

1. **Navigation Not Working**
   - Ελέγξε ότι το `<s-app-nav>` είναι present
   - Ελέγξε ότι τα `<s-link>` έχουν σωστά href attributes

2. **Styling Issues**
   - Ελέγξε ότι τα Tailwind classes είναι valid
   - Ελέγξε ότι τα custom components χρησιμοποιούν σωστά classes

3. **Accessibility Issues**
   - Ελέγξε ότι τα ARIA labels είναι present
   - Ελέγξε ότι το keyboard navigation δουλεύει

### Debug Tips

1. **Console Logs**: Check browser console για errors
2. **Network Tab**: Check για failed requests
3. **Elements Tab**: Inspect rendered HTML structure
4. **Accessibility Tab**: Check accessibility compliance

## Migration Guide

### From Custom Navigation
1. **Remove Custom Nav**: Αφαίρεσε custom navigation components
2. **Add App Bridge**: Πρόσθεσε `<s-app-nav>` στο app.jsx
3. **Update Pages**: Χρησιμοποίησε PageLayout components
4. **Test Navigation**: Ελέγξε ότι όλα δουλεύουν

### From Polaris Navigation
1. **Keep App Bridge**: Διατήρησε το `<s-app-nav>`
2. **Update Styling**: Χρησιμοποίησε iOS 18 styling
3. **Add Breadcrumbs**: Πρόσθεσε breadcrumb navigation
4. **Test Integration**: Ελέγξε Shopify integration

## Conclusion

Αυτό το navigation system ακολουθεί τις Shopify guidelines ενώ παρέχει modern iOS 18 styling. Η σωστή υλοποίηση εξασφαλίζει:

- ✅ **Shopify Integration**: Proper App Bridge navigation
- ✅ **iOS 18 Aesthetics**: Modern, polished design
- ✅ **Accessibility**: WCAG AA compliance
- ✅ **Responsive**: Mobile-first design
- ✅ **Maintainable**: Clean, organized code structure
