# Admin API Endpoints - Quick Reference

## 🔵 Base URL
```
https://agrimeet.udehcoglobalfoodsltd.com/api/v1
```

## 🔑 Authentication
All admin endpoints require:
```
Authorization: Bearer {access_token}
```

---

## ✅ WORKING ENDPOINTS (Use These Now!)

### KYC Review (WORKING!)
```http
PUT /seller/kyc/{id}/review
Content-Type: application/json

{
  "status": "approved",      // or "rejected"
  "admin_notes": "string"    // optional
}
```

### Get All Products (WORKING!)
```http
GET /allproducts?status=draft&page=1&per_page=12
```

### Get Product Details (WORKING!)
```http
GET /seller/products/{id}/show_product
```

### Categories (WORKING!)
```http
GET    /admin/categories
POST   /admin/categories
GET    /admin/categories/{id}
PUT    /admin/categories/{id}
DELETE /admin/categories/{id}
```

### Business Types (WORKING!)
```http
GET    /admin/business_types
POST   /admin/business_types
PUT    /admin/business_types/{id}
DELETE /admin/business_types/{id}
```

### Units (WORKING!)
```http
GET    /admin/units
POST   /admin/units
PUT    /admin/units/{id}
DELETE /admin/units/{id}
```

### Coupons (WORKING!)
```http
GET    /buyer/coupons?page=1
POST   /admin/coupons
GET    /buyer/coupons/{id}
PUT    /admin/coupons/{id}
DELETE /admin/coupons/{id}
```

### User Profile (WORKING!)
```http
GET    /buyer/users/{id}
PUT    /buyer/users/{id}
DELETE /buyer/users/{id}
```

---

## ⚠️ ENDPOINTS TO IMPLEMENT

### User Management
```http
GET  /admin/users
  ?search=john
  &status=active|suspended|pending
  &role=buyer|seller|admin
  &page=1
  &per_page=10

GET  /admin/users/stats

POST /admin/users/{id}/suspend
  { "reason": "string" }

POST /admin/users/{id}/activate
```

### KYC Management
```http
GET /admin/kyc/pending
  ?search=store_name
  &status=pending|approved|rejected
  &page=1

GET /admin/kyc/{id}

GET /admin/kyc/stats
```

### Product Moderation
```http
POST /admin/products/{id}/approve
  { "notes": "string" }

POST /admin/products/{id}/reject
  { "reason": "string" }

GET /admin/products/stats
```

### Transactions
```http
GET /admin/transactions
  ?search=tx_id
  &status=completed|pending|failed
  &type=payment|refund|payout
  &date_from=2024-01-01
  &date_to=2024-12-31
  &page=1

GET /admin/transactions/{id}

GET /admin/transactions/stats

GET /admin/transactions/export
  Response: CSV file
```

### Disputes
```http
GET /admin/disputes
  ?search=order_id
  &status=open|in_progress|resolved|closed
  &priority=high|medium|low
  &page=1

GET /admin/disputes/{id}

POST /admin/disputes/{id}/status
  {
    "status": "in_progress|resolved",
    "resolution": "string"
  }

POST /admin/disputes/{id}/notes
  { "note": "string" }

POST /admin/disputes/{id}/resolve
  {
    "resolution": "string",
    "refundAmount": 0.00
  }

GET /admin/disputes/stats
```

### Analytics
```http
GET /admin/dashboard/stats

GET /admin/analytics/revenue?period=7days|30days|90days|year

GET /admin/analytics/users?period=30days

GET /admin/analytics/products?period=30days

GET /admin/analytics/orders?period=30days

GET /admin/analytics/metrics

GET /admin/reports/{type}/export?period=30days
  Response: PDF file
```

---

## 📊 Response Formats

### Success (Single Resource)
```json
{
  "data": {
    "id": 1,
    "name": "Resource Name",
    ...
  }
}
```

### Success (Collection with Pagination)
```json
{
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "links": {
    "first": "?page=1",
    "last": "?page=10",
    "prev": null,
    "next": "?page=2"
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

### Error (Validation)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Error message here"
    ]
  }
}
```

### Error (Unauthenticated)
```json
{
  "message": "Unauthenticated."
}
```

### Error (Unauthorized)
```json
{
  "message": "This action is unauthorized."
}
```

---

## 🎯 Example Implementations

### User Management

#### Index
```php
public function index(Request $request)
{
    $query = User::query()
        ->with('roles', 'seller');
    
    if ($request->search) {
        $query->where('name', 'like', "%{$request->search}%")
              ->orWhere('email', 'like', "%{$request->search}%");
    }
    
    if ($request->status) {
        $query->where('status', $request->status);
    }
    
    if ($request->role) {
        $query->whereHas('roles', function($q) use ($request) {
            $q->where('name', $request->role);
        });
    }
    
    $users = $query->paginate($request->per_page ?? 10);
    
    return UserResource::collection($users);
}
```

#### Stats
```php
public function stats()
{
    $total = User::count();
    $active = User::where('status', 'active')->count();
    $suspended = User::where('status', 'suspended')->count();
    $newThisMonth = User::whereMonth('created_at', now()->month)->count();
    
    $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)->count();
    $growth = $lastMonth > 0 
        ? '+' . round((($newThisMonth - $lastMonth) / $lastMonth) * 100, 1) . '%'
        : '+0%';
    
    return response()->json([
        'data' => [
            'total' => $total,
            'active' => $active,
            'suspended' => $suspended,
            'newThisMonth' => $newThisMonth,
            'growth' => $growth,
        ]
    ]);
}
```

#### Suspend
```php
public function suspend(Request $request, $id)
{
    $request->validate([
        'reason' => 'required|string|max:500'
    ]);
    
    $user = User::findOrFail($id);
    $user->update([
        'status' => 'suspended',
        'suspension_reason' => $request->reason,
        'suspended_at' => now(),
        'suspended_by' => auth()->id(),
    ]);
    
    // Log admin action
    AdminLog::create([
        'admin_id' => auth()->id(),
        'action' => 'user_suspended',
        'target_id' => $user->id,
        'target_type' => 'user',
        'details' => $request->reason,
    ]);
    
    return response()->json([
        'message' => 'User suspended successfully',
        'data' => new UserResource($user)
    ]);
}
```

### KYC Management

#### Pending List
```php
public function pending(Request $request)
{
    $query = KycSubmission::query()
        ->with('seller.user', 'businessType')
        ->where('status', 'pending');
    
    if ($request->search) {
        $query->whereHas('seller', function($q) use ($request) {
            $q->where('store_name', 'like', "%{$request->search}%")
              ->orWhereHas('user', function($q2) use ($request) {
                  $q2->where('name', 'like', "%{$request->search}%");
              });
        });
    }
    
    $submissions = $query->latest()->paginate(10);
    
    return KycSubmissionResource::collection($submissions);
}
```

#### Stats
```php
public function stats()
{
    return response()->json([
        'data' => [
            'pending' => KycSubmission::where('status', 'pending')->count(),
            'approvedToday' => KycSubmission::whereDate('verified_at', today())
                ->where('status', 'approved')->count(),
            'totalApproved' => KycSubmission::where('status', 'approved')->count(),
            'rejected' => KycSubmission::where('status', 'rejected')->count(),
        ]
    ]);
}
```

### Product Moderation

#### Approve
```php
public function approve(Request $request, $id)
{
    $product = Product::findOrFail($id);
    
    $product->update([
        'status' => 'active',
        'approved_at' => now(),
        'approved_by' => auth()->id(),
        'admin_notes' => $request->notes,
    ]);
    
    // Notify seller
    $product->seller->user->notify(new ProductApproved($product));
    
    return response()->json([
        'message' => 'Product approved successfully',
        'data' => new ProductResource($product)
    ]);
}
```

---

## 🔧 Laravel Controller Template

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'role:admin']);
    }
    
    public function index(Request $request)
    {
        // Implementation here
    }
    
    public function stats()
    {
        // Implementation here
    }
    
    public function suspend(Request $request, $id)
    {
        // Implementation here
    }
    
    public function activate($id)
    {
        // Implementation here
    }
}
```

---

## 🧪 Testing with cURL

### Get Users
```bash
curl -X GET \
  'https://agrimeet.udehcoglobalfoodsltd.com/api/v1/admin/users?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Accept: application/json'
```

### Approve KYC
```bash
curl -X PUT \
  'https://agrimeet.udehcoglobalfoodsltd.com/api/v1/seller/kyc/1/review' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "approved",
    "admin_notes": "All documents verified"
  }'
```

### Suspend User
```bash
curl -X POST \
  'https://agrimeet.udehcoglobalfoodsltd.com/api/v1/admin/users/5/suspend' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "Violation of terms"
  }'
```

---

## 📝 Checklist for Backend Team

- [ ] Create admin middleware for role checking
- [ ] Create AdminUserController
- [ ] Create AdminKycController  
- [ ] Create AdminProductController
- [ ] Create AdminTransactionController
- [ ] Create AdminDisputeController
- [ ] Create AdminAnalyticsController
- [ ] Add routes to api.php (v1 group)
- [ ] Create API Resources (User, KYC, Transaction, etc.)
- [ ] Test all endpoints with Postman
- [ ] Deploy to production
- [ ] Notify frontend team ✅

**Frontend is ready! Just implement the backend endpoints and everything will work!** 🚀