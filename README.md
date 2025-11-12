# Kifiya Payment Processing Dashboard

A modern, payment operations dashboard built for the Kifiya payment-processing. This dashboard enables internal operations teams to manage payment orders, track statuses in real-time, debug failures, and gain system insights.

## Overview

Built with Next.js 16, React 19, and TailwindCSS, the dashboard provides a complete operations experience for payment management.

deployed link 
https://kifiya-challenge.vercel.app

## Screenshoots

<img width="1905" height="876" alt="image" src="https://github.com/user-attachments/assets/68c1ab9f-6d45-4c97-87a7-726747161a70" />
<img width="1892" height="868" alt="image" src="https://github.com/user-attachments/assets/b893059b-fa3c-451d-9348-93eb94403ca6" />
<img width="1914" height="856" alt="image" src="https://github.com/user-attachments/assets/5515143f-a5e2-43aa-bf5d-65ad3a793688" />
<img width="1903" height="877" alt="image" src="https://github.com/user-attachments/assets/2f78e6f0-cef8-4032-89e4-f326e55a87b1" />

## Key Features

- **Payment Order Submission** - Submit new payments with validation
- **Live Payment Feed** - Real-time table view with search, filtering, and pagination
- **Status Tracking** - View payment lifecycle (PENDING → IN_PROGRESS → COMPLETED/FAILED)
- **Failure Handling** - Retry failed payments with error messaging and transaction logs
- **Rate Limit Awareness** - Visual warning when system approaches 2 TPS limit
- **Analytics Dashboard** - Real-time charts showing status distribution, TPS trends, and KPIs
- **Responsive Design** - Fully responsive across mobile, tablet, and desktop
- **Dark Theme** - Professional fintech-focused color scheme

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 with shadcn/ui components
- **Data Fetching**: TanStack Query for caching and real-time updates
- **Styling**: TailwindCSS v4
- **Forms**: formik + Yup validation
- **Charts**: Recharts for data visualization
- **State Management**: custom Mock data  + TanStack Query cache
- **TypeScript**: Full type safety throughout


## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── payments/
│   │   │   ├── route.ts             # GET: Fetch payments with filters
│   │   │   └── [id]/retry/route.ts  # POST: Retry failed payment
│   │   └── analytics/route.ts       # GET: Fetch analytics data
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Main dashboard page
│   └── globals.css                  # Global styles and theme tokens
│
├── components/
│   ├── kifiya-ui/                   # Custom UI components
│   └── ui/                          # shadcn/ui component library
│
├── data/
│   └── mock.ts                      # Helper to generate mock data
│
├── features/
│   ├── payments/
│   │   ├── components/              # Feature-specific components
│   │   └── index.tsx                # Payment processing page
│   └── ...                          # Other feature folders
│
└── public/                          # Static assets

```


## Setup Instructions

### Prerequisites
- Node.js 18+ or pnpm

### Installation

1. **Clone the repository**
   
   git clone https://github.com/zedatgithub12/kifiya-challenge.git
   cd kifiya-challenge

3. **Install dependencies**
   npm install
   # or
   pnpm install

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## Architecture Overview

### Data Flow

The dashboard uses a client-server architecture with server-side filtering and caching:

1. **API Routes** - Next.js API routes handle data fetching and business logic
   - `/api/payments` - Returns filtered/searched payments with pagination
   - `/api/payments/[id]/retry` - Handles payment retry logic
   - `/api/analytics` - Computes real-time analytics

2. **TanStack Query** - Client-side data fetching with automatic caching
   - Configured to auto-refetch every 3 seconds for real-time data
   - Supports mutation-based cache invalidation on user actions
   - Handles loading/error states elegantly

3. **Mock Data System** - In-memory payment storage
   - Payments update status based on timing
   - Simulates realistic payment lifecycle (5-15 seconds per transition)
   - Rate limiting simulation (2 TPS global limit)

### Component Architecture

```bash
<DashboardShell>                    # Main layout
├── <Tabs>
│   ├── <PaymentFeed />             # Table with filtering/pagination
│   └── <AnalyticsDashboard />      # Charts and metrics
```

### State Management

- **Server State**: API routes + TanStack Query cache
- **UI State**: React hooks (useState for filters, page, search)
- **Global State**: None (unnecessary for this scope)

## Features in Detail

### 1. Payment Submission Form
- Auto-generated Payment ID with ID- prefix
- Amount validation (positive numbers)
- Currency selector (ETB and USD)
- Recipient details with account validation
- Form validation with yup validation schemas
- Loading state and success feedback

### 2. Live Payment Feed
- **Search**: By Payment ID (real-time)
- **Filters**: By status (PENDING, IN_PROGRESS, COMPLETED, FAILED)
- **Pagination**: 15 items per page with navigation controls
- **Real-time Updates**: Auto-refresh every 3 seconds
- **Status Badges**: Color-coded status indicators
- **Actions**: Retry failed payments, view transaction logs

### 3. Transaction Logs
- Detailed payment history and processing steps
- Timestamps for each transaction event
- Error messages when payment fails
- Modal dialog for focused inspection

### 4. Rate Limit Warning
- Displays current TPS (transactions per second)
- Red warning when approaching 2 TPS limit
- Updates in real-time as payments process
- Located in analytics dashboard header

### 5. Analytics Dashboard
- **Status Distribution**: Pie/doughnut chart showing payment counts
- **TPS Trend**: Line chart tracking transactions over time
- **Key Metrics**: Total payments, completion rate, average processing time
- **Real-time Updates**: Refreshes every 5 seconds

## User Interactions

### Submitting a Payment
1. Click "Create Payment" button
2. Fill in payment details (amount, currency, recipient)
3. Click "Submit Payment"
4. Payment appears in feed as PENDING
5. Status automatically transitions (PENDING → IN_PROGRESS → COMPLETED/FAILED)

### Retrying a Failed Payment
1. Find failed payment in the feed
2. Click "Retry" button on the failed payment row
3. Status changes to PENDING
4. Payment re-enters the processing queue

### Viewing Transaction Logs
1. Click the "view" button on any payment
2. Modal opens showing payment history
3. View all processing steps and timestamps
4. Close modal to return to table

### Monitoring Analytics
1. Click "Analytics" tab
2. View real-time charts and metrics
3. Check TPS warning indicator
4. Monitor status distribution and trends

## Trade-offs & Notes

### Design Decisions

1. **Mock Data System** - Used in-memory storage instead of database
   - Trade-off: Data resets on page refresh (acceptable for demo)
   - Benefit: No external dependencies, instant feedback

2. **Server-side Filtering** - API routes handle search/filter logic
   - Trade-off: Slightly more server load
   - Benefit: Better data consistency, easier to scale

3. **Auto-refresh Every 3 Seconds** - Simulates real-time without WebSockets
   - Trade-off: Slightly higher polling overhead
   - Benefit: Simple implementation, works everywhere

## Debugging

### Check Real-time Updates
Open browser DevTools → Network tab. You should see requests to `/api/payments` every 3 seconds.

### View Mock Data State
Check `data/mock.ts` to see current payment records and status transitions.

### Test Rate Limiting
Submit 3+ payments quickly to see TPS warning in analytics dashboard.

## Deployment

The deployment created and the project is accessible https://kifiya-challenge.vercel.app


