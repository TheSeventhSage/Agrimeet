# Admin Dashboard - API Integration Guide

## 📋 Overview

The admin dashboard has been integrated with your AgriMeet API v1. This document outlines what's working, what needs backend implementation, and how to complete the integration.

---

## ✅ **Fully Integrated Endpoints** (Working Now)

These endpoints exist in your API and are fully integrated:

### 1. **Authentication**
```
✅ POST /api/v1/auth/login
✅ POST /api/v1/auth/register
✅ POST /api/v1/auth/verify-code
```

### 2. **Business Types Management**
```
✅ GET    /api/v1/admin/business_types
✅ POST   /api/v1/admin/business_types
✅ GET    /api/v1/admin/business_types/{id}
✅ PUT    /api/v1/admin/business_types/{id}
✅ DELETE /api/v1/admin/business_types/{id}
```

### 3. **Categories Management**
```
✅ GET    /api/v1/admin/categories
✅ POST   /api/v1/admin/categories
✅ GET    /api/v1/admin/categories/{id}
✅ PUT    /api/v1/admin/categories/{id}
✅ DELETE /api/v1/admin/categories/{id}
✅ GET    /api/v1/admin/{category}/subcategories
✅ GET    /api/v1/allcategories
```

### 4. **Units Management**
```
✅ GET    /api/v1/admin/units
✅ POST   /api/v1/admin/units
✅ PUT    /api/v1/admin/units/{id}
✅ DELETE /api/v1/admin/units/{id}
✅ GET    /api/v1/seller/products/allUnits
```

### 5. **Coupon Management**
```
✅ GET    /api/v1/buyer/coupons
✅ POST   /api/v1/admin/coupons
✅ GET    /api/v1/buyer/coupons/{id}
✅ PUT    /api/v1/admin/coupons/{id}
✅ DELETE /api/v1/admin/coupons/{id}
✅ POST   /api/v1/buyer/coupons/validate
```

### 6. **Products (Public & Seller)**
```
✅ GET    /api/v1/allproducts (with filters)
✅ GET    /api/v1/seller/products
✅ GET    /api/v1/seller/products/{id}/show_product
✅ POST   /api/v1/seller/products
✅ PUT    /api/v1/seller/products/{id}
✅ DELETE /api/v1/seller/products/{id}
```

### 7. **Product Variants**
```
✅ GET    /api/v1/seller/products/{product}/variants
✅ POST   /api/v1/seller/products/{product}/variants
✅ GET    /api/v1/seller/products/{product}/variants/{variant}
✅ PUT    /api/v1/seller/products/{product}/variants/{variant}
```

### 8. **KYC Submission**
```
✅ POST /api/v1/buyer/kyc/submit
✅ GET  /api/v1/seller/kyc/status
✅ PUT  /api/v1/seller/kyc/{submission}/review  ← ADMIN CAN USE THIS!
```

### 9. **User Profile**
```
✅ GET    /api/v1/buyer/users/{id}
✅ PUT    /api/v1/buyer/users/{id}
✅ DELETE /api/v1/buyer/users/{id}
```

---

## ⚠️ **Endpoints Needed on Backend** (Admin Dashboard Ready)

The frontend admin dashboard is fully built and ready. These endpoints need to be implemented on your backend:

### 🔴 **Priority 1: Core Admin Functions**

#### User Management
```
❌ GET    /api/v1/admin/users
   Query params: search, status, role, page, per_page
   Response: { data: [...users], meta: { current_page, total_pages, total } }

❌ GET    /api/v1/admin/users/stats
   Response: { total, active, suspended, newThisMonth, growth }

❌ POST   /api/v1/admin/users/{id}/suspend
   Body: { reason: "string" }

❌ POST   /api/v1/admin/users/{id}/activate
```

#### KYC Management
```
❌ GET /api/v1/admin/kyc/pending
   Query params: search, status, page
   Response: { data: [...kyc_submissions], meta: {...} }

❌ GET /api/v1/admin/kyc/{id}
   Response: { data: {...kyc_submission_details} }

❌ GET /api/v1/admin/kyc/stats
   Response: { pending, approvedToday, totalApproved, rejected }
```

**Note**: You already have `/seller/kyc/{submission}/review` which works! Just need the listing endpoints.

#### Product Moderation
```
❌ GET /api/v1/admin/products/pending
   Query params: search, category, status, page
   Response: { data: [...products], meta: {...} }
   
   Alternative: Can use existing /allproducts with status=draft

❌ POST /api/v1/admin/products/{id}/approve
   Body: { notes: "string" }

❌ POST /api/v1/admin/products/{id}/reject
   Body: { reason: "string" }

❌ GET /api/v1/admin/products/stats
   Response: { pending, approvedToday, totalApproved, rejected }
```

### 🟡 **Priority 2: Transaction & Orders**

```
❌ GET /api/v1/admin/transactions
   Query params: search, status, type, date_from, date_to, page

❌ GET /api/v1/admin/transactions/{id}

❌ GET /api/v1/admin/transactions/stats
   Response: { totalRevenue, todayTransactions, pendingCount, failedCount }

❌ GET /api/v1/admin/transactions/export
   Response: CSV file download
```

### 🟡 **Priority 3: Dispute Management**

```
❌ GET  /api/v1/admin/disputes
   Query params: search, status, priority, page

❌ GET  /api/v1/admin/disputes/{id}

❌ POST /api/v1/admin/disputes/{id}/status
   Body: { status, resolution }

❌ POST /api/v1/admin/disputes/{id}/notes
   Body: { note }

❌ POST /api/v1/admin/disputes/{id}/resolve
   Body: { resolution, refundAmount }

❌ GET  /api/v1/admin/disputes/stats
```

### 🟢 **Priority 4: Analytics & Reports**

```
❌ GET /api/v1/admin/dashboard/stats
   Response: Complete dashboard overview

❌ GET /api/v1/admin/analytics/revenue?period=30days

❌ GET /api/v1/admin/analytics/users?period=30days

❌ GET /api/v1/admin/analytics/products?period=30days

❌ GET /api/v1/admin/analytics/orders?period=30days

❌ GET /api/v1/admin/analytics/metrics

❌ GET /api/v1/admin/reports/{type}/export
   Response: PDF file download
```

---

## 🔧 **Current Frontend Behavior**

### What Happens Now:

1. **Working Endpoints**: Fully functional (KYC review, products, categories, etc.)

2. **Missing Endpoints**: Return mock/empty data
   - Pages load without errors
   - Display "No data found" states
   - When backend implements endpoints, frontend will automatically work

3. **Error Handling**: 
   - Toast notifications for errors
   - Graceful fallbacks for missing data
   - Loading states while fetching

---

## 📝 **Backend Implementation Guide**

### Step 1: Implement User Management Endpoints

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // User Management
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::get('/admin/users/stats', [AdminUserController::class, 'stats']);
    Route::post('/admin/users/{id}/suspend', [AdminUserController::class, 'suspend']);
    Route::post('/admin/users/{id}/activate', [AdminUserController::class, 'activate']);
});
```

### Step 2: Implement KYC Listing Endpoints

```php
// You already have the review endpoint!
// Just add:
Route::get('/admin/kyc/pending', [KycController::class, 'pending']);
Route::get('/admin/kyc/{id}', [KycController::class, 'show']);
Route::get('/admin/kyc/stats', [KycController::class, 'stats']);
```

### Step 3: Implement Product Moderation

```php
Route::post('/admin/products/{id}/approve', [AdminProductController::class, 'approve']);
Route::post('/admin/products/{id}/reject', [AdminProductController::class, 'reject']);
Route::get('/admin/products/stats', [AdminProductController::class, 'stats']);
```

### Step 4: Implement Transactions, Disputes, Analytics

Continue with the remaining endpoints as needed.

---

## 🎯 **Expected Response Formats**

All endpoints should follow Laravel API Resource format:

### Single Resource:
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

### Collection with Pagination:
```json
{
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "links": {
    "first": "http://api.com/endpoint?page=1",
    "last": "http://api.com/endpoint?page=10",
    "prev": null,
    "next": "http://api.com/endpoint?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 10,
    "per_page": 10,
    "to": 10,
    "total": 95
  }
}
```

### Error Response:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Error message here"]
  }
}
```

---

## 🔐 **Authentication**

All admin endpoints should:

1. **Require Bearer Token**:
   ```
   Authorization: Bearer {token}
   ```

2. **Check Admin Role**:
   ```php
   Route::middleware(['auth:sanctum', 'role:admin'])
   ```

3. **Return 401** for unauthenticated requests

4. **Return 403** for unauthorized (non-admin) requests

---

## 🚀 **Quick Start for Backend Team**

### 1. Create Admin Middleware
```php
// app/Http/Middleware/EnsureUserIsAdmin.php
public function handle($request, Closure $next)
{
    if (!$request->user()->hasRole('admin')) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    return $next($request);
}
```

### 2. Create Admin Controllers
```bash
php artisan make:controller Api/Admin/AdminUserController
php artisan make:controller Api/Admin/AdminKycController
php artisan make:controller Api/Admin/AdminProductController
php artisan make:controller Api/Admin/AdminTransactionController
php artisan make:controller Api/Admin/AdminDisputeController
php artisan make:controller Api/Admin/AdminAnalyticsController
```

### 3. Create API Resources
```bash
php artisan make:resource Admin/UserResource
php artisan make:resource Admin/KycSubmissionResource
php artisan make:resource Admin/TransactionResource
```

### 4. Add Routes
```php
// routes/api.php (v1 group)
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Users
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/stats', [AdminUserController::class, 'stats']);
    Route::post('/users/{id}/suspend', [AdminUserController::class, 'suspend']);
    Route::post('/users/{id}/activate', [AdminUserController::class, 'activate']);
    
    // KYC
    Route::get('/kyc/pending', [AdminKycController::class, 'pending']);
    Route::get('/kyc/{id}', [AdminKycController::class, 'show']);
    Route::get('/kyc/stats', [AdminKycController::class, 'stats']);
    
    // Products
    Route::post('/products/{id}/approve', [AdminProductController::class, 'approve']);
    Route::post('/products/{id}/reject', [AdminProductController::class, 'reject']);
    Route::get('/products/stats', [AdminProductController::class, 'stats']);
    
    // Transactions
    Route::get('/transactions', [AdminTransactionController::class, 'index']);
    Route::get('/transactions/{id}', [AdminTransactionController::class, 'show']);
    Route::get('/transactions/stats', [AdminTransactionController::class, 'stats']);
    Route::get('/transactions/export', [AdminTransactionController::class, 'export']);
    
    // Disputes
    Route::get('/disputes', [AdminDisputeController::class, 'index']);
    Route::get('/disputes/{id}', [AdminDisputeController::class, 'show']);
    Route::post('/disputes/{id}/status', [AdminDisputeController::class, 'updateStatus']);
    Route::post('/disputes/{id}/notes', [AdminDisputeController::class, 'addNote']);
    Route::post('/disputes/{id}/resolve', [AdminDisputeController::class, 'resolve']);
    Route::get('/disputes/stats', [AdminDisputeController::class, 'stats']);
    
    // Analytics
    Route::get('/dashboard/stats', [AdminAnalyticsController::class, 'dashboard']);
    Route::get('/analytics/revenue', [AdminAnalyticsController::class, 'revenue']);
    Route::get('/analytics/users', [AdminAnalyticsController::class, 'users']);
    Route::get('/analytics/products', [AdminAnalyticsController::class, 'products']);
    Route::get('/analytics/orders', [AdminAnalyticsController::class, 'orders']);
    Route::get('/analytics/metrics', [AdminAnalyticsController::class, 'metrics']);
    Route::get('/reports/{type}/export', [AdminAnalyticsController::class, 'export']);
});
```

---

## 🧪 **Testing the Integration**

### 1. Test with Postman/Insomnia

```bash
# Get Bearer Token (login as admin)
POST https://agrimeet.udehcoglobalfoodsltd.com/api/v1/auth/login
Body: { "email": "admin@example.com", "password": "password" }

# Use token in subsequent requests
GET https://agrimeet.udehcoglobalfoodsltd.com/api/v1/admin/users
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### 2. Frontend Environment Variable

Update `/workspace/.env` or `/workspace/.env.local`:
```env
VITE_API_BASE_URL=https://agrimeet.udehcoglobalfoodsltd.com
```

### 3. Test Admin Login

1. Login with admin credentials
2. Navigate to `/admin/dashboard`
3. Check browser console for API calls
4. Verify data displays correctly

---

## 📊 **Implementation Progress Tracker**

### Phase 1: Core Functions (Week 1)
- [ ] User Management endpoints
- [ ] KYC listing endpoints  
- [ ] Product moderation endpoints
- [ ] Basic stats endpoints

### Phase 2: Transactions (Week 2)
- [ ] Transaction listing
- [ ] Transaction details
- [ ] Transaction stats
- [ ] Export functionality

### Phase 3: Disputes (Week 3)
- [ ] Dispute listing
- [ ] Dispute details
- [ ] Status management
- [ ] Resolution workflow

### Phase 4: Analytics (Week 4)
- [ ] Dashboard overview
- [ ] Revenue analytics
- [ ] User growth analytics
- [ ] Product analytics
- [ ] Report exports

---

## 💡 **Tips for Backend Team**

1. **Use Existing Patterns**: Follow the same structure as your KYC review endpoint
2. **Reuse Resources**: You already have User, Product, Seller resources - extend them
3. **Cache When Possible**: Stats endpoints can be cached for 5-10 minutes
4. **Eager Load**: Use `with()` to avoid N+1 queries
5. **Validate Roles**: Always check admin role in middleware
6. **Log Admin Actions**: Log all admin actions for audit trail
7. **Rate Limiting**: Apply rate limits to prevent abuse

---

## 🎉 **What's Already Working**

Even without new backend endpoints, you can:

1. ✅ Review and approve/reject KYC submissions
2. ✅ Manage categories, business types, units
3. ✅ View all products (using /allproducts)
4. ✅ Manage coupons
5. ✅ View user profiles
6. ✅ Access beautiful admin UI

---

## 📞 **Support**

For questions about the frontend implementation:
- Check `/workspace/src/features/admin/README.md`
- Review `/workspace/ADMIN_DASHBOARD_IMPLEMENTATION.md`
- Inspect `/workspace/src/features/admin/api/adminService.js`

**The admin dashboard is 100% ready on the frontend. As soon as you implement the backend endpoints, everything will work automatically!** 🚀