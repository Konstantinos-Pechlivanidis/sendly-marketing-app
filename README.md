# 📱 Sendly Marketing App

A comprehensive **SMS Marketing Platform** built specifically for **Shopify stores**. Sendly enables merchants to create, manage, and automate SMS campaigns, track customer engagement, and drive sales through personalized messaging.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Shopify](https://img.shields.io/badge/Shopify-App-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Overview

Sendly Marketing App is a full-featured SMS marketing solution that integrates seamlessly with Shopify stores. It provides merchants with powerful tools to:

- 📧 Create and send targeted SMS campaigns
- 👥 Manage customer contacts with segmentation
- 🤖 Automate marketing messages (birthdays, abandoned carts, etc.)
- 📊 Track performance with detailed analytics
- 💳 Manage credits and billing through Stripe
- 📝 Use pre-built templates for quick campaigns

### Key Features

- **Multi-Store Support**: Each Shopify store has completely isolated data
- **Campaign Management**: Create, schedule, and send SMS campaigns with audience targeting
- **Contact Management**: Import, organize, and segment customer contacts
- **Automations**: Trigger automated messages based on customer actions (birthdays, abandoned carts, order confirmations)
- **Template Library**: Access to pre-built SMS templates across multiple categories
- **Analytics & Reporting**: Comprehensive dashboards with real-time metrics
- **Credit System**: Stripe-powered billing with flexible credit packages
- **Real-time Tracking**: Webhook integration for delivery status updates

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + React Router 7
- **UI Framework**: Shopify Polaris + Tailwind CSS
- **Backend Integration**: RESTful API with Shopify App Bridge authentication
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Session Storage**: Prisma-based session management
- **Styling**: Tailwind CSS with custom design tokens (iOS 18-inspired)
- **Build Tool**: Vite
- **Package Manager**: npm

### Project Structure

```
sendly-marketing-app/
├── app/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── routes/              # React Router routes
│   │   ├── app.*.jsx       # App routes (dashboard, campaigns, etc.)
│   │   └── pages/          # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions (API clients, etc.)
│   ├── styles/             # Global styles (Tailwind, tokens)
│   ├── shopify.server.js   # Shopify app configuration
│   └── db.server.js        # Prisma client
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── docs/                   # Documentation
└── shopify.app.toml        # Shopify app configuration
```

### Authentication Flow

```
Shopify Store → App Installation → OAuth Flow → Session Storage (Prisma)
                    ↓
            Shopify App Bridge
                    ↓
            Frontend (React Router)
                    ↓
            Backend API (with X-Shopify-Shop-Domain header)
                    ↓
            Store-Scoped Operations
```

**Key Points:**
- Each request includes `X-Shopify-Shop-Domain` header for store isolation
- All database operations are automatically scoped to the correct store
- Session tokens are validated via Shopify App Bridge
- Access tokens are used for Shopify Admin API calls

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 20.10
- **Shopify Partner Account**: [Create one here](https://partners.shopify.com/signup)
- **Test Store**: Development store or Shopify Plus sandbox
- **Shopify CLI**: [Installation guide](https://shopify.dev/docs/apps/tools/cli/getting-started)

```bash
npm install -g @shopify/cli@latest
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Konstantinos-Pechlivanidis/sendly-marketing-app.git
   cd sendly-marketing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run setup
   ```
   This runs `prisma generate` and `prisma migrate deploy`.

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SCOPES=read_products,write_products,read_orders,write_orders
   SHOPIFY_APP_URL=https://your-app-url.com
   DATABASE_URL="file:./dev.sqlite"
   API_BASE_URL=https://your-backend-api-url.com
   NODE_ENV=development
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Press `P` to open the app URL in your browser. Click "Install" to begin development.

---

## 📖 Usage

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Main Pages

- **Dashboard** (`/app/dashboard`): Overview of SMS statistics, contacts, and wallet balance
- **Campaigns** (`/app/campaigns`): Create, manage, and send SMS campaigns
- **Contacts** (`/app/contacts`): Manage customer contacts with filtering and segmentation
- **Automations** (`/app/automations`): Configure automated SMS triggers
- **Templates** (`/app/templates`): Browse and use pre-built SMS templates
- **Reports** (`/app/reports`): View detailed analytics and performance metrics
- **Settings** (`/app/settings`): Configure app settings, billing, and sender information

### API Integration

The app communicates with a backend API. See [`BACKEND_DOCUMENTATION.md`](../BACKEND_DOCUMENTATION.md) for complete API reference.

**Key Endpoints:**
- `GET /dashboard/overview` - Dashboard statistics
- `GET /campaigns` - List campaigns
- `POST /campaigns` - Create campaign
- `POST /campaigns/:id/send` - Send campaign
- `GET /contacts` - List contacts
- `POST /contacts/import` - Bulk import contacts
- `GET /automations` - List automations
- `PUT /automations/:id` - Update automation
- `GET /templates` - List templates
- `GET /reports/overview` - Report overview
- `GET /billing/balance` - Wallet balance
- `POST /billing/purchase` - Purchase credits

All requests include:
- `Authorization: Bearer <shopify_session_token>`
- `X-Shopify-Shop-Domain: your-store.myshopify.com`

---

## 🎨 Design System

The app uses a custom design system inspired by iOS 18 with:

- **Tailwind CSS** for utility-first styling
- **Custom Design Tokens** for consistent theming
- **Shopify Polaris** components for Shopify-native UI
- **Responsive Design** for all screen sizes

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) and [`STYLEGUIDE.md`](./STYLEGUIDE.md) for detailed design documentation.

---

## 📚 Documentation

- **[Backend Documentation](../BACKEND_DOCUMENTATION.md)** - Complete API reference
- **[Authentication Flow](./AUTHENTICATION_FLOW.md)** - Authentication and store scoping details
- **[System Architecture](./SYSTEM_ARCHITECTURE.md)** - Architecture overview
- **[Component Architecture](./COMPONENT_ARCHITECTURE.md)** - UI component documentation
- **[Page Documentation](./PAGE_DOCUMENTATION.md)** - Page-by-page implementation guide
- **[Navigation Guide](./NAVIGATION_GUIDE.md)** - Routing and navigation structure

---

## 🔧 Configuration

### Shopify App Configuration

Edit `shopify.app.toml` to configure:
- App name and URLs
- Webhook subscriptions
- Access scopes
- API version

### Database Configuration

The app uses Prisma for database management. Edit `prisma/schema.prisma` to modify the schema.

**For Production:**
- Use PostgreSQL, MySQL, or another production database
- Update `DATABASE_URL` in environment variables
- Run migrations: `prisma migrate deploy`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_API_KEY` | Shopify app API key | Yes |
| `SHOPIFY_API_SECRET` | Shopify app API secret | Yes |
| `SCOPES` | Comma-separated list of scopes | Yes |
| `SHOPIFY_APP_URL` | App URL (production) | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `API_BASE_URL` | Backend API URL | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |

---

## 🚢 Deployment

### Build

```bash
npm run build
```

### Hosting

Deploy to cloud providers like:
- [Heroku](https://www.heroku.com/)
- [Fly.io](https://fly.io/)
- [Railway](https://railway.app/)
- [DigitalOcean](https://www.digitalocean.com/)

### Environment Variables

Set all required environment variables in your hosting platform.

### Database

Use a production database (PostgreSQL recommended). Update `DATABASE_URL` and run migrations:

```bash
prisma migrate deploy
```

---

## 🧪 Testing

### Webhooks

Test webhooks using the Shopify CLI:

```bash
shopify app generate webhook
```

### Local Development

The app uses Cloudflare tunnels by default. For localhost development:

1. Configure `localhost` in `shopify.app.toml`
2. Use `shopify app dev --reset`

---

## 🐛 Troubleshooting

### Database Tables Don't Exist

```bash
npm run setup
```

### Authentication Issues

- Ensure `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are correct
- Check that `SHOPIFY_APP_URL` matches your app URL
- Verify scopes in `shopify.app.toml` match your app settings

### API Connection Issues

- Verify `API_BASE_URL` is correct
- Check backend API is running and accessible
- Ensure `X-Shopify-Shop-Domain` header is being sent

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build`
- Run `npm run build` again

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Links

- [Shopify App Documentation](https://shopify.dev/docs/apps)
- [React Router Documentation](https://reactrouter.com/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## 👤 Author

**Konstantinos Pechlivanidis**

- GitHub: [@Konstantinos-Pechlivanidis](https://github.com/Konstantinos-Pechlivanidis)

---

## 🙏 Acknowledgments

- Shopify for the excellent developer tools and documentation
- React Router team for the powerful routing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Made with ❤️ for Shopify merchants**
