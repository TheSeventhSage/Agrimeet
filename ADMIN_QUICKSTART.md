# Admin Dashboard Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Access the Admin Dashboard

```javascript
// Login with a user that has 'admin' role
// Your user object should look like:
{
  id: "123",
  name: "Admin User",
  email: "admin@agrimeet.com",
  roles: ["admin"]  // ← This is crucial
}
```

Navigate to: `http://localhost:5173/admin`

### Step 2: Configure Your Backend API

Set the API base URL in your environment file:

```env
# .env or .env.local
VITE_API_BASE_URL=https://api.agrimeet.com
```

### Step 3: Test the Pages

Visit each admin page to ensure routing works:
- `/admin/dashboard` - Overview
- `/admin/users` - User management
- `/admin/seller-approval` - KYC approval
- `/admin/products` - Product moderation
- `/admin/transactions` - Transaction oversight
- `/admin/disputes` - Dispute management
- `/admin/reports` - Analytics

---

## 📋 Backend API Checklist

Implement these endpoints for full functionality:

### Must Have (Core Features)
```
✅ GET    /api/admin/dashboard/stats
✅ GET    /api/admin/users
✅ GET    /api/admin/kyc/pending
✅ GET    /api/admin/products/pending
✅ GET    /api/admin/transactions
✅ GET    /api/admin/disputes
```

### Should Have (User Management)
```
✅ GET    /api/admin/users/:id
✅ POST   /api/admin/users/:id/suspend
✅ POST   /api/admin/users/:id/activate
✅ DELETE /api/admin/users/:id
✅ GET    /api/admin/users/stats
```

### Should Have (Seller Approval)
```
✅ GET    /api/admin/kyc/:id
✅ POST   /api/admin/kyc/:id/approve
✅ POST   /api/admin/kyc/:id/reject
✅ GET    /api/admin/kyc/stats
```

### Should Have (Product Moderation)
```
✅ GET    /api/admin/products/:id
✅ POST   /api/admin/products/:id/approve
✅ POST   /api/admin/products/:id/reject
✅ GET    /api/admin/products/stats
```

### Nice to Have (Advanced Features)
```
✅ GET    /api/admin/transactions/export
✅ POST   /api/admin/disputes/:id/resolve
✅ GET    /api/admin/analytics/*
✅ GET    /api/admin/reports/export
```

---

## 🔑 Authentication Setup

### JWT Token Format
```javascript
// Your JWT should include:
{
  user_id: "123",
  email: "admin@agrimeet.com",
  roles: ["admin"],  // ← Required
  exp: 1234567890
}
```

### Storage Manager
The app uses `storageManager` to handle authentication:

```javascript
import { storageManager } from './pages/utils/storageManager';

// Get current user
const user = storageManager.getUserData();

// Check role
const isAdmin = user?.roles?.includes('admin');

// Get token
const token = storageManager.getAccessToken();
```

---

## 🎨 Customizing the Design

### Change Brand Colors

Edit `/workspace/tailwind.config.js`:

```javascript
colors: {
  brand: {
    500: '#71CB2A',  // Change primary color
    600: '#83C541',
    // ...
  }
}
```

### Modify Sidebar

Edit `/workspace/src/shared/components/MultilevelSidebar.jsx`:

```javascript
// Add new menu item
const adminMenuItems = [
  // ... existing items
  {
    key: 'new-feature',
    label: 'New Feature',
    icon: NewIcon,
    path: '/admin/new-feature'
  }
];
```

### Add New Admin Page

1. Create page file:
```javascript
// /workspace/src/features/admin/pages/NewFeature.jsx
import DashboardLayout from '../../../layouts/DashboardLayout';

const NewFeature = () => {
  return (
    <DashboardLayout>
      <h1>New Feature</h1>
    </DashboardLayout>
  );
};

export default NewFeature;
```

2. Add route in `/workspace/src/app/router.jsx`:
```javascript
import NewFeature from '../features/admin/pages/NewFeature';

// In routes:
<Route 
  path="/admin/new-feature" 
  element={
    <ProtectedRoutes allowedRoles={['admin']}>
      <NewFeature />
    </ProtectedRoutes>
  } 
/>
```

---

## 📊 Understanding the Data Flow

### 1. User Accesses Page
```
User → Route (/admin/users)
  ↓
ProtectedRoute checks role
  ↓
UserManagement.jsx loads
```

### 2. Component Loads Data
```
useEffect() runs
  ↓
adminService.getUsers() called
  ↓
API request with auth token
  ↓
Response returned
  ↓
State updated, UI renders
```

### 3. User Takes Action
```
User clicks "Suspend"
  ↓
Confirmation modal opens
  ↓
User confirms
  ↓
adminService.suspendUser() called
  ↓
Success → Toast notification
  ↓
Data reloaded
```

---

## 🛠️ Common Customizations

### Change Pagination Size
```javascript
// In any admin page
const [filters, setFilters] = useState({
  // ...
  per_page: 20  // Change from 10 to 20
});
```

### Add New Filter
```javascript
// In filter section
<select
  value={filters.newFilter}
  onChange={(e) => setFilters({ ...filters, newFilter: e.target.value })}
>
  <option value="all">All</option>
  <option value="option1">Option 1</option>
</select>
```

### Customize Stat Cards
```javascript
const statCards = [
  {
    title: 'Your Metric',
    value: stats.yourMetric || 0,
    change: '+10%',
    icon: YourIcon,
    color: 'bg-blue-500'
  }
];
```

---

## 🐛 Troubleshooting

### Issue: "403 Forbidden" on admin pages
**Solution**: Check user has 'admin' role in their JWT/user data

### Issue: API requests failing
**Solution**: Verify `VITE_API_BASE_URL` is set correctly

### Issue: Sidebar not showing admin menu
**Solution**: Check `user?.roles?.includes('admin')` returns true

### Issue: Pages loading but no data
**Solution**: Check backend API endpoints are returning correct format:
```javascript
{
  data: [...],
  meta: { current_page, total_pages, total }
}
```

### Issue: Authentication errors
**Solution**: Ensure token is in Authorization header:
```javascript
Authorization: Bearer <your-jwt-token>
```

---

## 📝 Testing Checklist

Before deploying, test these scenarios:

### User Management
- [ ] View users list
- [ ] Search users
- [ ] Filter by status/role
- [ ] View user details
- [ ] Suspend user
- [ ] Activate user
- [ ] Delete user
- [ ] Pagination works

### Seller Approval
- [ ] View pending KYC
- [ ] View KYC details
- [ ] Approve KYC with notes
- [ ] Reject KYC with reason
- [ ] Filter by status

### Product Moderation
- [ ] View pending products
- [ ] View product details
- [ ] Approve product
- [ ] Reject product
- [ ] Filter by category/status

### Transactions
- [ ] View transaction list
- [ ] View transaction details
- [ ] Filter by status/type/date
- [ ] Export to CSV

### Disputes
- [ ] View open disputes
- [ ] View dispute details
- [ ] Add admin notes
- [ ] Update status
- [ ] Resolve dispute

### Reports
- [ ] View analytics
- [ ] Change time period
- [ ] Export reports
- [ ] View top products/sellers

### General
- [ ] Sidebar navigation works
- [ ] Responsive on mobile
- [ ] Modals open/close properly
- [ ] Confirmations work
- [ ] Toast notifications show
- [ ] Loading states display

---

## 🎯 Performance Tips

1. **Pagination**: Keep per_page reasonable (10-20)
2. **Debounce Search**: Add debounce to search inputs
3. **Lazy Loading**: Load modals only when opened
4. **Image Optimization**: Compress product images
5. **API Caching**: Cache stats/analytics data

---

## 📚 Resources

- **Main Documentation**: `/workspace/src/features/admin/README.md`
- **Implementation Summary**: `/workspace/ADMIN_DASHBOARD_IMPLEMENTATION.md`
- **Page Structures**: `/workspace/ADMIN_PAGES_STRUCTURE.md`
- **API Service**: `/workspace/src/features/admin/api/adminService.js`

---

## 🚀 Deployment Checklist

Before going to production:

- [ ] Environment variables configured
- [ ] All API endpoints implemented
- [ ] Authentication working
- [ ] Role-based access tested
- [ ] Error handling verified
- [ ] Mobile responsive tested
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained

---

## 💡 Pro Tips

1. **Test with Real Data**: Use production-like data volume
2. **Monitor Performance**: Watch API response times
3. **User Feedback**: Get input from actual admins
4. **Iterate Quickly**: Start with core features
5. **Document Changes**: Keep track of customizations

---

## 🎓 Next Steps

1. ✅ Set up backend API
2. ✅ Configure authentication
3. ✅ Test all features
4. ✅ Customize branding
5. ✅ Add new features as needed
6. ✅ Deploy to production
7. ✅ Train admin users
8. ✅ Monitor and optimize

---

**Need Help?** 
- Check the detailed documentation in `/workspace/src/features/admin/README.md`
- Review the implementation summary
- Inspect the code for examples

**Happy Administrating! 🎉**