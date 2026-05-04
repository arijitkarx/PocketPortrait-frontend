# Finyo - Financial Tracker

A modern, sleek financial transaction tracking webapp built with SvelteJS and Tailwind CSS.

## Features

- 📊 **Dashboard** - View financial overview with stats and charts
- 💳 **Transaction Management** - Track income and expenses
- 💰 **Budget Tracking** - Set and monitor budgets
- 🏷️ **Tags & Categories** - Organize transactions with custom tags and categories
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Beautiful UI** - Built with Tailwind CSS for a modern look

## Tech Stack

- **Frontend**: SvelteJS 4 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API
- **Charts**: Chart.js

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd PocketPortrait-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` and configure the backend URL:

```bash
cp .env.example .env.local
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Backend API

Finyo connects to a backend API running at `http://localhost:5000`. The API proxy is configured in `vite.config.js`.

**API Endpoints Used:**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/transactions/transactions` - Get transactions list
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/dashboard` - Get dashboard stats
- `GET /api/budgets` - Get budgets
- `POST /api/budgets` - Create budget

## Project Structure

```
src/
├── components/        # Svelte components
│   ├── App.svelte
│   ├── Sidebar.svelte
│   ├── Dashboard.svelte
│   ├── TransactionList.svelte
│   └── AddTransaction.svelte
├── lib/
│   ├── stores.ts      # Svelte stores for state management
│   └── types.ts       # TypeScript type definitions
├── main.ts            # Application entry point
└── app.css            # Global styles with Tailwind directives
```

## License

MIT
