# Sendly Marketing App - Page Documentation

## 📋 Overview
Αυτό το έγγραφο περιγράφει λεπτομερώς κάθε σελίδα του Sendly Marketing App, τα components που χρησιμοποιεί, και τον τρόπο σχεδιασμού.

---

## 🏠 Dashboard Page

### File: `app/routes/pages/dashboard.jsx`

#### Purpose & Functionality
Η κεντρική σελίδα του εφαρμογής που παρέχει ένα comprehensive overview των SMS marketing metrics, system health, και recent activity.

#### Key Features
1. **KPI Metrics Grid**
   - Total SMS Sent
   - Delivery Rate
   - Total Contacts
   - Wallet Balance

2. **Activity Monitoring**
   - Recent SMS messages
   - Transaction history
   - System events

3. **System Health**
   - Service status checks
   - Uptime monitoring
   - Error tracking

4. **Campaign Performance**
   - Active campaigns
   - Scheduled campaigns
   - Completed campaigns

#### Components Used
```jsx
// Layout Components
<PageLayout>
  <PageHeader title="Dashboard" subtitle="SMS Marketing Overview">
    <Breadcrumb>
      <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
    </Breadcrumb>
  </PageHeader>
</PageLayout>

// Data Display Components
<Card className="hover:shadow-lg transition-all duration-200">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total SMS Sent</p>
        <p className="text-3xl font-bold text-gray-900">1,234</p>
      </div>
      <div className="w-12 h-12 bg-primary/10 rounded-xl">
        <span className="text-2xl">📱</span>
      </div>
    </div>
  </CardContent>
</Card>

// Interactive Components
<Button variant="primary" onClick={handleRefresh}>
  Refresh Data
</Button>
```

#### Design Pattern
- **Grid Layout**: 4-column responsive grid for KPI cards
- **Card Design**: Soft shadows with hover effects
- **Color Coding**: Green for success, red for errors, primary for branding
- **Interactive Elements**: Smooth transitions and hover states

#### Data Flow
```jsx
// Data loading
const data = useLoaderData();
const overview = data?.overview?.data || {};
const quickStats = data?.quickStats?.data || {};
const health = data?.health || {};

// State management
const [mounted, setMounted] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [alert, setAlert] = useState(null);
```

#### Styling Approach
- **Background**: Gradient from `#F7F9F8` to `#EAF5F3`
- **Cards**: White background with `rounded-2xl` corners
- **Shadows**: `shadow-md` with `hover:shadow-lg` transitions
- **Typography**: Inter font with proper hierarchy

---

## 📧 Campaigns Page

### File: `app/routes/pages/campaigns.jsx`

#### Purpose & Functionality
Διαχείριση SMS campaigns με δυνατότητα δημιουργίας, επεξεργασίας, προγραμματισμού και monitoring.

#### Key Features
1. **Campaign Management**
   - Create new campaigns
   - Edit existing campaigns
   - Delete campaigns
   - Duplicate campaigns

2. **Status Management**
   - Active campaigns
   - Scheduled campaigns
   - Draft campaigns
   - Completed campaigns

3. **Campaign Builder**
   - Message composition
   - Contact selection
   - Scheduling options
   - Preview functionality

4. **Analytics Integration**
   - Delivery rates
   - Open rates
   - Click rates
   - Performance metrics

#### Components Used
```jsx
// Navigation Components
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All Campaigns</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
    <TabsTrigger value="draft">Drafts</TabsTrigger>
  </TabsList>
</Tabs>

// Form Components
<Modal isOpen={isModalOpen} onClose={closeModal}>
  <ModalHeader>Create Campaign</ModalHeader>
  <ModalContent>
    <FormSection title="Campaign Details">
      <FormField label="Campaign Name" required>
        <Input placeholder="Enter campaign name" />
      </FormField>
      <FormField label="Message">
        <Textarea placeholder="Enter your message" />
      </FormField>
    </FormSection>
  </ModalContent>
</Modal>

// Data Display Components
<Card className="hover:shadow-md transition-all duration-200">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Campaign Name</CardTitle>
      <Badge variant="positive">Active</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-600">Message preview...</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-500">Sent: 1,234</span>
      <Button variant="outline" size="sm">Edit</Button>
    </div>
  </CardContent>
</Card>
```

#### Design Pattern
- **Tab Navigation**: Clean status filtering
- **Card List**: Hover effects and status indicators
- **Modal Forms**: Centered overlays with backdrop blur
- **Form Validation**: Real-time error states

#### State Management
```jsx
// Campaign state
const [campaigns, setCampaigns] = useState([]);
const [selectedCampaign, setSelectedCampaign] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [filters, setFilters] = useState({
  status: 'all',
  search: '',
  sortBy: 'createdAt'
});
```

#### Styling Approach
- **List Layout**: Card-based campaign display
- **Status Indicators**: Color-coded badges
- **Interactive Elements**: Hover states and transitions
- **Form Design**: Clean, organized form sections

---

## 👥 Contacts Page

### File: `app/routes/pages/contacts.jsx`

#### Purpose & Functionality
Διαχείριση contact list με δυνατότητα import/export, segmentation, και bulk operations.

#### Key Features
1. **Contact Management**
   - Add new contacts
   - Edit contact information
   - Delete contacts
   - Bulk operations

2. **Data Import/Export**
   - CSV file import
   - Excel file support
   - Data validation
   - Error handling

3. **Contact Segmentation**
   - Tag-based grouping
   - Custom segments
   - Filter by status
   - Search functionality

4. **Statistics Dashboard**
   - Total contacts
   - Opted-in contacts
   - Unsubscribed contacts
   - Growth metrics

#### Components Used
```jsx
// Statistics Display
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Contacts</p>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-xl">
          <span className="text-2xl">👥</span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

// Data Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Phone</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {contacts.map((contact) => (
      <TableRow key={contact.id}>
        <TableCell>{contact.name}</TableCell>
        <TableCell>{contact.email}</TableCell>
        <TableCell>{contact.phone}</TableCell>
        <TableCell>
          <Badge variant={contact.status === 'active' ? 'positive' : 'neutral'}>
            {contact.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button variant="outline" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Form Components
<Modal isOpen={isModalOpen} onClose={closeModal}>
  <ModalHeader>Add Contact</ModalHeader>
  <ModalContent>
    <FormSection title="Contact Information">
      <FormGroup>
        <FormField label="First Name" required>
          <Input placeholder="Enter first name" />
        </FormField>
        <FormField label="Last Name" required>
          <Input placeholder="Enter last name" />
        </FormField>
      </FormGroup>
      <FormField label="Email" required>
        <Input type="email" placeholder="Enter email address" />
      </FormField>
      <FormField label="Phone">
        <Input type="tel" placeholder="Enter phone number" />
      </FormField>
    </FormSection>
  </ModalContent>
</Modal>
```

#### Design Pattern
- **Statistics Cards**: Metric display with icons
- **Table Design**: Clean rows with hover states
- **Form Modals**: Contact creation/editing
- **Status Indicators**: Visual contact status

#### State Management
```jsx
// Contact state
const [contacts, setContacts] = useState([]);
const [selectedContact, setSelectedContact] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all');
```

#### Styling Approach
- **Table Layout**: Responsive table with horizontal scroll
- **Card Statistics**: Icon-based metric display
- **Form Organization**: Logical field grouping
- **Interactive Elements**: Hover states and transitions

---

## ⚙️ Settings Page

### File: `app/routes/pages/settings.jsx`

#### Purpose & Functionality
Ρυθμίσεις εφαρμογής, billing management, system configuration, και support.

#### Key Features
1. **General Settings**
   - SMS provider configuration
   - API key management
   - Sender ID setup
   - Webhook configuration

2. **Billing Management**
   - Package selection
   - Payment processing
   - Usage tracking
   - Invoice management

3. **System Health**
   - Service status monitoring
   - Performance metrics
   - Error logging
   - Uptime tracking

4. **Support & Help**
   - Documentation links
   - Contact support
   - FAQ section
   - Video tutorials

#### Components Used
```jsx
// Tab Navigation
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
    <TabsTrigger value="health">System Health</TabsTrigger>
    <TabsTrigger value="support">Support</TabsTrigger>
  </TabsList>
  
  <TabsContent value="general">
    <FormSection title="SMS Provider Settings">
      <FormField label="Provider" required>
        <Select>
          <option value="twilio">Twilio</option>
          <option value="aws">AWS SNS</option>
        </Select>
      </FormField>
      <FormField label="API Key" required>
        <Input type="password" placeholder="Enter API key" />
      </FormField>
      <FormField label="Sender ID">
        <Input placeholder="Enter sender ID" />
      </FormField>
    </FormSection>
  </TabsContent>
</Tabs>

// Billing Section
<TabsContent value="billing">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plan</span>
            <Badge variant="primary">Professional</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly Cost</span>
            <span className="font-semibold">$29.99</span>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Usage This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">SMS Sent</span>
            <span className="font-semibold">1,234 / 10,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{width: '12.34%'}}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

#### Design Pattern
- **Tab Organization**: Logical settings grouping
- **Form Sections**: Clear field organization
- **Validation States**: Real-time form feedback
- **Payment Integration**: Secure billing interface

#### State Management
```jsx
// Settings state
const [settings, setSettings] = useState({});
const [billing, setBilling] = useState({});
const [systemHealth, setSystemHealth] = useState({});
const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
```

#### Styling Approach
- **Form Layout**: Organized sections with clear labels
- **Card Design**: Information display with proper spacing
- **Progress Bars**: Visual usage indicators
- **Interactive Elements**: Hover states and transitions

---

## 📝 Templates Page

### File: `app/routes/pages/templates.jsx`

#### Purpose & Functionality
Διαχείριση SMS templates με preview, customization, και template library.

#### Key Features
1. **Template Library**
   - Pre-built templates
   - Category organization
   - Search functionality
   - Template preview

2. **Custom Templates**
   - Template creation
   - Variable insertion
   - Template editing
   - Template duplication

3. **Template Management**
   - Template categories
   - Usage tracking
   - Template sharing
   - Version control

4. **Preview System**
   - Live preview
   - Mobile preview
   - Variable testing
   - Character counting

#### Components Used
```jsx
// Template Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {templates.map((template) => (
    <Card key={template.id} className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{template.name}</CardTitle>
          <Badge variant="primary">{template.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-mono">{template.content}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">{template.characterCount} characters</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Preview</Button>
            <Button variant="primary" size="sm">Use</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

// Template Editor
<Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
  <ModalHeader>Create Template</ModalHeader>
  <ModalContent>
    <FormSection title="Template Information">
      <FormField label="Template Name" required>
        <Input placeholder="Enter template name" />
      </FormField>
      <FormField label="Category">
        <Select>
          <option value="marketing">Marketing</option>
          <option value="notification">Notification</option>
          <option value="reminder">Reminder</option>
        </Select>
      </FormField>
      <FormField label="Template Content" required>
        <Textarea 
          placeholder="Enter your template content..."
          rows={6}
        />
      </FormField>
    </FormSection>
  </ModalContent>
</Modal>
```

#### Design Pattern
- **Grid Layout**: Card-based template display
- **Preview System**: Live template preview
- **Form Organization**: Clear template creation flow
- **Category System**: Organized template library

#### State Management
```jsx
// Template state
const [templates, setTemplates] = useState([]);
const [selectedTemplate, setSelectedTemplate] = useState(null);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

#### Styling Approach
- **Card Grid**: Responsive template display
- **Preview Areas**: Monospace font for template content
- **Character Counting**: Visual character limits
- **Category Badges**: Color-coded template categories

---

## 🤖 Automations Page

### File: `app/routes/pages/automations.jsx`

#### Purpose & Functionality
Διαχείριση automated SMS workflows, triggers, και automation rules.

#### Key Features
1. **Workflow Builder**
   - Visual automation creation
   - Trigger configuration
   - Action sequencing
   - Condition logic

2. **Trigger Management**
   - Event-based triggers
   - Time-based triggers
   - User action triggers
   - System triggers

3. **Automation Rules**
   - Conditional logic
   - Delay settings
   - Frequency limits
   - Error handling

4. **Performance Monitoring**
   - Automation statistics
   - Success rates
   - Error tracking
   - Performance metrics

#### Components Used
```jsx
// Automation Cards
<div className="space-y-4">
  {automations.map((automation) => (
    <Card key={automation.id} className="hover:shadow-md transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{automation.name}</CardTitle>
            <p className="text-sm text-gray-600">{automation.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={automation.status === 'active' ? 'positive' : 'neutral'}>
              {automation.status}
            </Badge>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Trigger</p>
            <p className="text-sm font-medium">{automation.trigger}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Actions</p>
            <p className="text-sm font-medium">{automation.actions.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Run</p>
            <p className="text-sm font-medium">{automation.lastRun}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

// Automation Builder
<Modal isOpen={isBuilderModalOpen} onClose={closeBuilderModal}>
  <ModalHeader>Automation Builder</ModalHeader>
  <ModalContent>
    <FormSection title="Basic Information">
      <FormField label="Automation Name" required>
        <Input placeholder="Enter automation name" />
      </FormField>
      <FormField label="Description">
        <Textarea placeholder="Describe this automation" />
      </FormField>
    </FormSection>
    
    <FormSection title="Trigger Configuration">
      <FormField label="Trigger Type" required>
        <Select>
          <option value="user_signup">User Signup</option>
          <option value="purchase">Purchase</option>
          <option value="abandoned_cart">Abandoned Cart</option>
        </Select>
      </FormField>
    </FormSection>
  </ModalContent>
</Modal>
```

#### Design Pattern
- **Card Layout**: Automation display with status indicators
- **Builder Interface**: Step-by-step automation creation
- **Statistics Display**: Performance metrics
- **Status Management**: Active/inactive automation states

#### State Management
```jsx
// Automation state
const [automations, setAutomations] = useState([]);
const [selectedAutomation, setSelectedAutomation] = useState(null);
const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
const [builderStep, setBuilderStep] = useState(1);
```

#### Styling Approach
- **Card Design**: Clean automation display
- **Status Indicators**: Visual automation status
- **Builder Flow**: Step-by-step interface
- **Performance Metrics**: Statistical display

---

## 📊 Reports Page

### File: `app/routes/pages/reports.jsx`

#### Purpose & Functionality
Analytics και reporting για SMS campaigns, performance metrics, και business intelligence.

#### Key Features
1. **Campaign Analytics**
   - Delivery rates
   - Open rates
   - Click rates
   - Conversion rates

2. **Performance Metrics**
   - Revenue tracking
   - Cost analysis
   - ROI calculations
   - Growth metrics

3. **Data Visualization**
   - Charts and graphs
   - Trend analysis
   - Comparative reports
   - Export functionality

4. **Custom Reports**
   - Date range selection
   - Filter options
   - Custom metrics
   - Scheduled reports

#### Components Used
```jsx
// Report Sections
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Campaign Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Campaigns</span>
          <span className="text-2xl font-bold text-gray-900">24</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Success Rate</span>
          <span className="text-lg font-semibold text-green-600">94.2%</span>
        </div>
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">This Month</span>
          <span className="text-2xl font-bold text-gray-900">$2,456</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Growth</span>
          <span className="text-lg font-semibold text-green-600">+12.5%</span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

// Data Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Campaign</TableHead>
      <TableHead>Sent</TableHead>
      <TableHead>Delivered</TableHead>
      <TableHead>Rate</TableHead>
      <TableHead>Revenue</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {campaigns.map((campaign) => (
      <TableRow key={campaign.id}>
        <TableCell>{campaign.name}</TableCell>
        <TableCell>{campaign.sent}</TableCell>
        <TableCell>{campaign.delivered}</TableCell>
        <TableCell>
          <Badge variant={campaign.rate > 90 ? 'positive' : 'warning'}>
            {campaign.rate}%
          </Badge>
        </TableCell>
        <TableCell>${campaign.revenue}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Design Pattern
- **Metric Cards**: Key performance indicators
- **Data Tables**: Detailed campaign data
- **Chart Integration**: Visual data representation
- **Export Functionality**: Data export options

#### State Management
```jsx
// Report state
const [reports, setReports] = useState({});
const [dateRange, setDateRange] = useState('30d');
const [selectedMetrics, setSelectedMetrics] = useState([]);
const [isExporting, setIsExporting] = useState(false);
```

#### Styling Approach
- **Metric Display**: Clear KPI presentation
- **Data Visualization**: Chart integration
- **Table Design**: Clean data presentation
- **Export Interface**: User-friendly export options

---

## 🎨 Design System Integration

### Color Usage Across Pages
- **Primary (#64D3C1)**: Main actions, branding, success states
- **Secondary (#1C7B7B)**: Secondary actions, supporting elements
- **Deep (#004E47)**: Text, headings, emphasis
- **Neutral (#D9B88C)**: Neutral elements, inactive states
- **Accent (#E27D43)**: Highlights, CTAs, warnings
- **Danger (#8A3E2E)**: Errors, destructive actions

### Typography Hierarchy
- **Headings**: `text-2xl` to `text-4xl` with `font-bold`
- **Subheadings**: `text-lg` to `text-xl` with `font-semibold`
- **Body Text**: `text-base` with `font-normal`
- **Captions**: `text-sm` with `text-gray-600`

### Spacing System
- **Page Padding**: `px-4 lg:px-6` for responsive padding
- **Card Spacing**: `p-6` for card content
- **Grid Gaps**: `gap-6` for card grids
- **Section Spacing**: `space-y-6` for vertical spacing

### Component Consistency
- **Card Design**: `rounded-2xl` with `shadow-md`
- **Button Styles**: Consistent variants and sizes
- **Form Elements**: Unified input styling
- **Interactive States**: Hover and focus effects

---

## 🔧 Technical Implementation

### State Management Pattern
```jsx
// Standard page state structure
const [data, setData] = useState([]);
const [selectedItem, setSelectedItem] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Data Loading Pattern
```jsx
// Server-side data loading
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const data = await serverApi.get(request, "/api/endpoint");
  return { data };
};

// Client-side data usage
const data = useLoaderData();
const [localState, setLocalState] = useState(data);
```

### Form Handling Pattern
```jsx
// Form state management
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Form submission
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

### Modal Management Pattern
```jsx
// Modal state
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalData, setModalData] = useState(null);

// Modal handlers
const openModal = (data) => {
  setModalData(data);
  setIsModalOpen(true);
};

const closeModal = () => {
  setModalData(null);
  setIsModalOpen(false);
};
```

---

## 📱 Responsive Design Implementation

### Breakpoint Usage
- **Mobile First**: Base styles for mobile devices
- **Tablet**: `md:` prefix for medium screens
- **Desktop**: `lg:` prefix for large screens
- **Wide Desktop**: `xl:` prefix for extra large screens

### Grid System
```jsx
// Responsive grid patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Responsive spacing
<div className="px-4 lg:px-6">
  {/* Content */}
</div>
```

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for all interactive elements
- **Swipe Gestures**: Mobile-friendly interactions
- **Viewport**: Proper viewport meta tag
- **Performance**: Optimized for mobile networks

---

## ♿ Accessibility Implementation

### Focus Management
- **Visible Focus**: Ring-based focus indicators
- **Keyboard Navigation**: Full keyboard support
- **Focus Trapping**: Modal focus management
- **Skip Links**: Navigation shortcuts

### Screen Reader Support
- **Semantic HTML**: Proper element usage
- **ARIA Labels**: Descriptive labels
- **Live Regions**: Dynamic content updates
- **Alternative Text**: Image descriptions

### Color Contrast
- **WCAG AA**: Minimum 4.5:1 contrast ratio
- **Text Colors**: High contrast text options
- **Status Indicators**: Color + text for status
- **Error States**: Clear error communication

---

This comprehensive documentation provides detailed insights into each page of the Sendly Marketing App, including the components used, design patterns, state management, and technical implementation details. Each page has been carefully designed to provide a consistent, accessible, and maintainable user experience.
