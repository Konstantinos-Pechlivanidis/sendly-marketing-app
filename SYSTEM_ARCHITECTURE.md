# Sendly Marketing App - System Architecture Documentation

## 🏗️ System Overview

Το Sendly Marketing App είναι ένα Shopify embedded application που παρέχει SMS marketing capabilities για e-commerce stores. Η εφαρμογή είναι χτισμένη με React 18, React Router, Tailwind CSS, και Prisma ORM.

### Technology Stack
- **Frontend**: React 18 + React Router v7
- **Styling**: Tailwind CSS + Custom Design System
- **Backend**: Node.js + Express
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Prisma
- **Authentication**: Shopify App Bridge
- **Deployment**: Shopify App Store

---

## 📁 Project Structure

```
sendly-marketing-app/
├── app/
│   ├── components/
│   │   └── ui/                    # Reusable UI Components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── Table.jsx
│   │       ├── Modal.jsx
│   │       ├── PageLayout.jsx
│   │       └── ...
│   ├── routes/
│   │   ├── pages/                # Page Components
│   │   │   ├── dashboard.jsx
│   │   │   ├── campaigns.jsx
│   │   │   ├── contacts.jsx
│   │   │   ├── settings.jsx
│   │   │   ├── templates.jsx
│   │   │   ├── automations.jsx
│   │   │   └── reports.jsx
│   │   ├── app.jsx               # Main App Layout
│   │   ├── app.dashboard.jsx     # Dashboard Route
│   │   ├── app.campaigns.jsx     # Campaigns Route
│   │   └── ...
│   ├── styles/
│   │   ├── tailwind.css          # Global Styles
│   │   └── tokens.css            # Design Tokens
│   ├── utils/
│   │   ├── api.client.js         # Client-side API
│   │   ├── api.server.js         # Server-side API
│   │   └── cn.js                 # Class Name Utility
│   ├── hooks/
│   │   ├── useApi.js
│   │   ├── useShopifyAuth.js
│   │   └── useStoreContext.js
│   └── db.server.js              # Database Configuration
├── prisma/
│   ├── schema.prisma             # Database Schema
│   └── migrations/               # Database Migrations
├── public/
│   └── favicon.ico
├── build/                        # Production Build
├── node_modules/
├── package.json
├── tailwind.config.js            # Tailwind Configuration
├── vite.config.js               # Vite Configuration
├── shopify.app.toml             # Shopify App Configuration
└── README.md
```

---

## 🎨 Design System Architecture

### Design Tokens (`app/styles/tokens.css`)
```css
:root {
  /* Brand Palette */
  --color-primary: #64D3C1;
  --color-secondary: #1C7B7B;
  --color-deep: #004E47;
  --color-neutral: #D9B88C;
  --color-accent: #E27D43;
  --color-danger: #8A3E2E;

  /* Semantic Colors */
  --color-ink: #1F2937;
  --color-ink-secondary: #6B7280;
  --color-card: #FFFFFF;
  --color-surface: #FFFFFF;

  /* Spacing (8px Grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
}
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./extensions/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Palette with 9 shades each
        primary: { /* Teal shades */ },
        secondary: { /* Dark teal shades */ },
        deep: { /* Dark teal shades */ },
        neutral: { /* Sand shades */ },
        accent: { /* Orange shades */ },
        danger: { /* Terracotta shades */ },
      },
      spacing: {
        // 8px grid system
        "1": "4px", "2": "8px", "3": "12px", "4": "16px",
        "5": "20px", "6": "24px", "8": "32px", "10": "40px",
        "12": "48px", "16": "64px", "20": "80px", "24": "96px",
      },
      borderRadius: {
        sm: "8px", md: "12px", lg: "16px", xl: "20px",
        "2xl": "24px", "3xl": "28px",
      },
      boxShadow: {
        card: "0 4px 16px 0 rgba(0, 0, 0, 0.08)",
        elevated: "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
        floating: "0 16px 40px 0 rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
```

---

## 🧩 Component Architecture

### Component Hierarchy
```
PageLayout
├── PageHeader
│   ├── Breadcrumb
│   └── ActionGroup
└── PageContent
    └── PageSection
        ├── Card
        │   ├── CardHeader
        │   ├── CardContent
        │   └── CardFooter
        ├── Table
        │   ├── TableHeader
        │   ├── TableBody
        │   └── TableFooter
        ├── FormSection
        │   ├── FormField
        │   └── FormGroup
        └── Modal
            ├── ModalHeader
            ├── ModalContent
            └── ModalFooter
```

### Component Design Patterns

#### 1. Layout Components
```jsx
// PageLayout - Main page structure
<PageLayout>
  <PageHeader title="Page Title" subtitle="Description">
    <Breadcrumb>...</Breadcrumb>
  </PageHeader>
  <PageContent>
    <PageSection>Content</PageSection>
  </PageContent>
</PageLayout>

// Section - Content organization
<Section>
  <SectionHeader title="Section Title" />
  <SectionContent>Content</SectionContent>
</Section>
```

#### 2. Data Display Components
```jsx
// Card - Content containers
<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Table - Data tables
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

// Stat - KPI metrics
<Stat 
  icon="📊" 
  label="Total SMS" 
  value="1,234" 
  delta="+12%" 
  deltaType="positive" 
/>
```

#### 3. Form Components
```jsx
// Input - Form inputs
<Input 
  type="email" 
  placeholder="Enter email" 
  error={hasError}
  required 
/>

// FormSection - Form organization
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

#### 4. Interactive Components
```jsx
// Button - Action buttons
<Button variant="primary" size="md" loading>
  Save Changes
</Button>

// Badge - Status indicators
<Badge variant="positive" size="sm">
  Active
</Badge>

// Modal - Overlay dialogs
<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader>Title</ModalHeader>
  <ModalContent>Content</ModalContent>
  <ModalFooter>
    <Button>Save</Button>
  </ModalFooter>
</Modal>
```

---

## 📄 Page Architecture

### Page Structure Pattern
```jsx
// Standard page structure
export default function PageName() {
  // State management
  const data = useLoaderData();
  const [localState, setLocalState] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Event handlers
  const handleAction = () => {
    // Action logic
  };

  return (
    <PageLayout>
      <PageHeader title="Page Title" subtitle="Description">
        <Breadcrumb>...</Breadcrumb>
        <ActionGroup>
          <ActionButton variant="primary">Primary Action</ActionButton>
        </ActionGroup>
      </PageHeader>
      
      <PageContent>
        <PageSection>
          {/* Page content */}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
```

### Data Loading Pattern
```jsx
// Server-side data loading
export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const data = await serverApi.get(request, "/api/endpoint");
    return { data };
  } catch (error) {
    console.error("Loader error:", error);
    return { data: null, error: error.message };
  }
};

// Action handling
export const action = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  
  try {
    const { session } = await authenticate.admin(request);
    return await serverApi.post(request, "/api/endpoint", {
      action,
      data: Object.fromEntries(formData)
    });
    });
  } catch (error) {
    return { error: error.message };
  }
};
```

---

## 🔄 State Management

### Local State Pattern
```jsx
// Standard page state structure
const [data, setData] = useState([]);
const [selectedItem, setSelectedItem] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  sortBy: 'createdAt'
});
```

### Form State Management
```jsx
// Form state pattern
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Form handlers
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: null }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    await api.post("/api/endpoint", formData);
    // Handle success
  } catch (error) {
    setErrors(error.response.data);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Modal State Management
```jsx
// Modal state pattern
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalData, setModalData] = useState(null);
const [modalType, setModalType] = useState('create');

// Modal handlers
const openModal = (type, data = null) => {
  setModalType(type);
  setModalData(data);
  setIsModalOpen(true);
};

const closeModal = () => {
  setModalData(null);
  setIsModalOpen(false);
  setModalType('create');
};
```

---

## 🌐 API Architecture

### Client-side API (`app/utils/api.client.js`)
```javascript
// API client configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Request wrapper
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Shop-Domain': getShopDomain(),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API methods
export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data, options) => request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
};
```

### Server-side API (`app/utils/api.server.js`)
```javascript
// Server API wrapper
export const serverApi = {
  get: async (request, endpoint) => {
    const { session } = await authenticate.admin(request);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'X-Shopify-Shop-Domain': session.shop
      }
    });
    return await response.json();
  },
  
  post: async (request, endpoint, data) => {
    const { session } = await authenticate.admin(request);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        'X-Shopify-Shop-Domain': session.shop
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
};
```

---

## 🗄️ Database Architecture

### Prisma Schema (`prisma/schema.prisma`)
```prisma
// Database configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.sqlite"
}

// User model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  shop      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  campaigns Campaign[]
  contacts  Contact[]
  
  @@map("users")
}

// Campaign model
model Campaign {
  id          String      @id @default(cuid())
  name        String
  message     String
  status      CampaignStatus @default(DRAFT)
  scheduledAt DateTime?
  sentAt      DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  contacts    Contact[]
  
  @@map("campaigns")
}

// Contact model
model Contact {
  id        String   @id @default(cuid())
  email     String
  phone     String?
  firstName String?
  lastName  String?
  status    ContactStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  campaigns  Campaign[]
  
  @@map("contacts")
}

// Enums
enum CampaignStatus {
  DRAFT
  SCHEDULED
  ACTIVE
  COMPLETED
  CANCELLED
}

enum ContactStatus {
  ACTIVE
  INACTIVE
  UNSUBSCRIBED
}
```

---

## 🔐 Authentication & Security

### Shopify App Bridge Integration
```jsx
// App provider setup
import { AppProvider } from "@shopify/shopify-app-react-router/react";

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <div className="min-h-screen bg-gradient-to-br from-[#F7F9F8] to-[#EAF5F3]">
        {/* Shopify App Bridge Navigation */}
        <s-app-nav>
          <s-link href="/app/dashboard">Dashboard</s-link>
          <s-link href="/app/campaigns">Campaigns</s-link>
          <s-link href="/app/contacts">Contacts</s-link>
          <s-link href="/app/settings">Settings</s-link>
        </s-app-nav>
        
        {/* Main App Content */}
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </AppProvider>
  );
}
```

### Authentication Flow
```javascript
// Authentication middleware
export const authenticate = {
  admin: async (request) => {
    const { session } = await shopify.authenticate.admin(request);
    return { session };
  }
};

// Route protection
export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    // Protected route logic
    return { data: await getProtectedData(session) };
  } catch (error) {
    throw new Response("Unauthorized", { status: 401 });
  }
};
```

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Tailwind breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* Ultra wide screens */
```

### Responsive Patterns
```jsx
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>

// Spacing
<div className="px-4 lg:px-6">
  {/* Responsive padding */}
</div>

// Typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Responsive text */}
</h1>
```

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Swipe Gestures**: Mobile-friendly interactions
- **Viewport**: Proper viewport meta tag
- **Performance**: Optimized for mobile networks

---

## ♿ Accessibility

### Focus Management
```jsx
// Focus ring implementation
const focusClasses = "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2";

// Keyboard navigation
const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};
```

### Screen Reader Support
```jsx
// ARIA labels
<button
  aria-label="Close modal"
  aria-describedby="modal-description"
  onClick={handleClose}
>
  Close
</button>

// Live regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Color Contrast
- **WCAG AA**: Minimum 4.5:1 contrast ratio
- **Text Colors**: High contrast text options
- **Status Indicators**: Color + text for status
- **Error States**: Clear error communication

---

## 🚀 Performance Optimization

### Bundle Optimization
```javascript
// Vite configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          ui: ['@headlessui/react']
        }
      }
    }
  }
});
```

### Code Splitting
```jsx
// Lazy loading components
const LazyComponent = lazy(() => import('./LazyComponent'));

// Route-based splitting
const Dashboard = lazy(() => import('./pages/dashboard'));
const Campaigns = lazy(() => import('./pages/campaigns'));
```

### Runtime Performance
```jsx
// React optimization
const MemoizedComponent = memo(({ data }) => {
  return <div>{data}</div>;
});

// Debounced inputs
const debouncedSearch = useMemo(
  () => debounce((value) => {
    setSearchTerm(value);
  }, 300),
  []
);
```

---

## 🧪 Testing Strategy

### Component Testing
```jsx
// Component test example
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Testing
```jsx
// Page integration test
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard';

test('renders dashboard with KPI cards', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
  expect(screen.getByText('Total SMS Sent')).toBeInTheDocument();
});
```

---

## 📚 Documentation Standards

### Component Documentation
```jsx
/**
 * Button component for user interactions
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, ghost, danger)
 * @param {string} props.size - Button size (sm, md, lg, xl)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = forwardRef(({ 
  variant = "primary", 
  size = "md", 
  loading = false,
  disabled = false,
  className,
  children, 
  ...props 
}, ref) => {
  // Component implementation
});
```

### API Documentation
```javascript
/**
 * API client for backend communication
 * @namespace api
 */
export const api = {
  /**
   * GET request to API endpoint
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  get: async (endpoint, options = {}) => {
    // Implementation
  },

  /**
   * POST request to API endpoint
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  post: async (endpoint, data, options = {}) => {
    // Implementation
  }
};
```

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

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (future implementation)
- **Testing**: Comprehensive test coverage

---

## 📈 Future Enhancements

### Planned Features
- **TypeScript Migration**: Full TypeScript support
- **Dark Mode**: Theme switching capability
- **Advanced Analytics**: Enhanced reporting features
- **Mobile App**: React Native companion app
- **API Versioning**: Backward-compatible API updates

### Technical Improvements
- **Performance**: Further optimization
- **Accessibility**: Enhanced a11y features
- **Testing**: Increased test coverage
- **Documentation**: Expanded documentation

---

This comprehensive system architecture documentation provides a complete overview of the Sendly Marketing App's technical implementation, design system, component architecture, and development guidelines. The system is built with modern React patterns, follows accessibility best practices, and provides a scalable foundation for future development.
