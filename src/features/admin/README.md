# Admin Dashboard - AgriMeet Platform

A comprehensive admin dashboard for managing the AgriMeet e-commerce platform. This feature provides complete oversight and control over users, sellers, products, transactions, disputes, and platform analytics.

## Features

### 1. **Admin Dashboard** (`/admin/dashboard`)
- **Overview Statistics**: Total users, products, revenue, and orders
- **Action Cards**: Quick access to pending tasks (KYC approvals, product moderation, disputes)
- **Recent Activities**: Real-time feed of platform activities
- **Platform Health**: System status monitoring
- **Quick Actions**: Shortcuts to common admin tasks

### 2. **User Management** (`/admin/users`)
- View all platform users with filtering and search
- User details including contact info, registration date, and activity
- Suspend/activate user accounts
- Delete user accounts (with confirmation)
- User statistics (total, active, suspended, new users)
- Pagination for large datasets

### 3. **Seller Approval** (`/admin/seller-approval`)
- Review pending KYC applications
- View detailed seller information (business details, documents)
- Approve or reject KYC applications with notes/reasons
- Track KYC statistics (pending, approved, rejected)
- Document verification workflow

### 4. **Product Moderation** (`/admin/products`)
- Review products before they go live
- View product details, images, and seller information
- Approve or reject products with feedback
- Filter by category, status, and search
- Product moderation statistics
- Grid view with product cards

### 5. **Transaction Oversight** (`/admin/transactions`)
- Monitor all platform transactions
- View transaction details (user, amount, status, payment method)
- Filter by status, type, and date range
- Export transactions to CSV
- Revenue and transaction analytics
- Real-time transaction tracking

### 6. **Dispute Management** (`/admin/disputes`)
- Handle buyer-seller disputes
- View dispute details with all parties involved
- Add admin notes to disputes
- Update dispute status (open, in progress, resolved)
- Resolve disputes with refund options
- Priority-based filtering (high, medium, low)

### 7. **Reports & Analytics** (`/admin/reports`)
- Platform-wide metrics and KPIs
- Revenue trends and analytics
- User growth statistics
- Top products and sellers
- Order statistics
- Category performance analysis
- Export reports (PDF/CSV)
- Customizable time periods (7 days, 30 days, 90 days, yearly)

## Project Structure

```
src/features/admin/
├── api/
│   └── adminService.js          # API service with all backend calls
├── pages/
│   ├── AdminDashboard.jsx       # Main dashboard overview
│   ├── UserManagement.jsx       # User management page
│   ├── SellerApproval.jsx       # KYC approval page
│   ├── ProductModeration.jsx    # Product moderation page
│   ├── TransactionOversight.jsx # Transaction monitoring page
│   ├── DisputeManagement.jsx    # Dispute resolution page
│   ├── ReportsAnalytics.jsx     # Analytics and reports page
│   └── index.js                 # Page exports
└── README.md                    # This file
```

## API Integration

All admin pages are designed to work with a REST API. The `adminService.js` file contains methods for:

### User Management
- `getUsers(filters)` - Get all users with filters
- `getUserById(userId)` - Get user details
- `suspendUser(userId, reason)` - Suspend a user
- `activateUser(userId)` - Activate a user
- `deleteUser(userId)` - Delete a user
- `getUserStats()` - Get user statistics

### Seller Approval
- `getPendingKyc(filters)` - Get pending KYC applications
- `getKycById(kycId)` - Get KYC details
- `approveKyc(kycId, notes)` - Approve KYC
- `rejectKyc(kycId, reason)` - Reject KYC
- `getKycStats()` - Get KYC statistics

### Product Moderation
- `getPendingProducts(filters)` - Get pending products
- `getProductById(productId)` - Get product details
- `approveProduct(productId, notes)` - Approve product
- `rejectProduct(productId, reason)` - Reject product
- `getProductStats()` - Get product statistics

### Transaction Oversight
- `getTransactions(filters)` - Get all transactions
- `getTransactionById(transactionId)` - Get transaction details
- `getTransactionStats()` - Get transaction statistics
- `exportTransactions(filters)` - Export transactions to CSV

### Dispute Management
- `getDisputes(filters)` - Get all disputes
- `getDisputeById(disputeId)` - Get dispute details
- `updateDisputeStatus(disputeId, status, resolution)` - Update status
- `addDisputeNote(disputeId, note)` - Add admin note
- `resolveDispute(disputeId, resolution, refundAmount)` - Resolve dispute
- `getDisputeStats()` - Get dispute statistics

### Reports & Analytics
- `getDashboardStats()` - Get dashboard overview stats
- `getRevenueAnalytics(period)` - Get revenue data
- `getUserGrowthAnalytics(period)` - Get user growth data
- `getProductAnalytics(period)` - Get product data
- `getOrderAnalytics(period)` - Get order data
- `getPlatformMetrics()` - Get platform-wide metrics
- `exportReport(reportType, filters)` - Export reports

## Routes

All admin routes are protected with role-based access control (`allowedRoles={['admin']}`):

```javascript
/admin                    - Admin Dashboard (overview)
/admin/dashboard          - Admin Dashboard (overview)
/admin/users              - User Management
/admin/seller-approval    - Seller Approval (KYC)
/admin/products           - Product Moderation
/admin/transactions       - Transaction Oversight
/admin/disputes           - Dispute Management
/admin/reports            - Reports & Analytics
```

## Navigation

The admin menu is automatically displayed in the sidebar when a user with the `admin` role is logged in. The sidebar dynamically switches between seller and admin menu items based on the user's role.

## Design Features

### Modern & Premium UI
- Clean, professional design with consistent spacing
- Smooth transitions and hover effects
- Color-coded status badges for quick identification
- Responsive grid layouts for all screen sizes
- Modal dialogs for detailed views and confirmations
- Loading states and empty states

### Color Scheme
- **Primary Brand**: Green (`#71CB2A`)
- **Blue**: User-related actions and information
- **Green**: Success states and approvals
- **Yellow**: Warnings and pending states
- **Red**: Errors, rejections, and critical actions
- **Purple**: Analytics and reports

### Icons
All pages use Lucide React icons for consistency and clarity:
- Users, Package, DollarSign, ShoppingCart
- TrendingUp, AlertTriangle, CheckCircle, XCircle
- Eye, Search, Filter, Download, Calendar

### Interactive Elements
- **Stat Cards**: Hover effects with shadow transitions
- **Action Buttons**: Color-coded with icons
- **Tables**: Hover states on rows, sortable columns
- **Modals**: Smooth animations with backdrop blur
- **Pagination**: Clean controls with page numbers
- **Filters**: Real-time search and dropdown filters

## Usage Examples

### Accessing Admin Dashboard
```javascript
// User must have 'admin' role in their JWT token or user data
// The ProtectedRoute component checks user.roles.includes('admin')
```

### Filtering Users
```javascript
// In UserManagement.jsx
const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    page: 1,
    per_page: 10
});
```

### Approving KYC
```javascript
// In SellerApproval.jsx
await adminService.approveKyc(kycId, approvalNotes);
```

### Resolving Dispute
```javascript
// In DisputeManagement.jsx
await adminService.resolveDispute(disputeId, resolution, refundAmount);
```

### Exporting Data
```javascript
// In TransactionOversight.jsx
await adminService.exportTransactions(filters);
// Downloads CSV file automatically
```

## Backend API Requirements

The backend should implement these endpoints (examples):

```
GET    /api/admin/users                 - Get users list
GET    /api/admin/users/:id             - Get user details
POST   /api/admin/users/:id/suspend     - Suspend user
POST   /api/admin/users/:id/activate    - Activate user
DELETE /api/admin/users/:id             - Delete user

GET    /api/admin/kyc/pending           - Get pending KYC
GET    /api/admin/kyc/:id               - Get KYC details
POST   /api/admin/kyc/:id/approve       - Approve KYC
POST   /api/admin/kyc/:id/reject        - Reject KYC

GET    /api/admin/products/pending      - Get pending products
POST   /api/admin/products/:id/approve  - Approve product
POST   /api/admin/products/:id/reject   - Reject product

GET    /api/admin/transactions          - Get transactions
GET    /api/admin/transactions/export   - Export transactions

GET    /api/admin/disputes              - Get disputes
POST   /api/admin/disputes/:id/resolve  - Resolve dispute
POST   /api/admin/disputes/:id/notes    - Add note

GET    /api/admin/analytics/*           - Various analytics endpoints
GET    /api/admin/dashboard/stats       - Dashboard stats
```

## Security Considerations

1. **Role-Based Access Control**: All routes protected with `allowedRoles={['admin']}`
2. **JWT Authentication**: Token sent in Authorization header
3. **Action Confirmations**: Critical actions require confirmation modals
4. **Audit Trail**: All admin actions should be logged on backend
5. **Input Validation**: Forms validate inputs before submission

## Responsive Design

All admin pages are fully responsive:
- **Desktop**: Full sidebar, multi-column layouts, detailed views
- **Tablet**: Collapsible sidebar, 2-column layouts
- **Mobile**: Hidden sidebar (toggle), single-column layouts, touch-friendly

## Future Enhancements

- Real-time notifications for new disputes/pending items
- Bulk actions (approve/reject multiple items)
- Advanced filtering and sorting options
- Data visualization charts for analytics
- Email notifications for admin actions
- Activity logs and audit trails
- Role permissions management
- Custom report builder
- Scheduled reports via email

## Support

For questions or issues with the admin dashboard, please contact the development team or refer to the main project documentation.