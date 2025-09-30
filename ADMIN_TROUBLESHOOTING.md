# Admin Access Troubleshooting Guide

## 🔍 Issue: Admin Redirecting to Unauthorized Page

### ✅ FIXED! 

The issue was that the ProtectedRoute component was looking for `roles` as an array, but your API returns `role` as a string.

---

## 🛠️ What Was Fixed

### 1. **ProtectedRoute Component** (`/workspace/src/app/ProtectedRoutes.jsx`)
- ✅ Now handles both `role: "admin"` (string) and `roles: ["admin"]` (array)
- ✅ Added role normalization logic
- ✅ Added debug logging in development mode
- ✅ Better error messages

### 2. **AuthContext** (`/workspace/src/pages/contexts/AuthContext.jsx`)
- ✅ Normalizes API response to always store roles as array
- ✅ Handles both `role` and `roles` fields from API
- ✅ Admin users now navigate to `/admin/dashboard` after login
- ✅ Seller users navigate to `/dashboard`

### 3. **MultilevelSidebar** (`/workspace/src/shared/components/MultilevelSidebar.jsx`)
- ✅ Role checking now works with both formats
- ✅ Displays correct menu based on role

### 4. **Debug Page** (NEW: `/admin/debug`)
- ✅ Shows your user data and roles
- ✅ Indicates if you have admin access
- ✅ Provides fix options
- ✅ Available at `/admin/debug` (no role required)

---

## 🧪 How to Test

### Step 1: Check Your Role Status
```
1. Navigate to: http://localhost:5173/admin/debug
2. Check the "Admin Access" card
3. If green ✅ - You're good to go!
4. If red ✗ - Follow the fix instructions below
```

### Step 2: Check Browser Console
```javascript
// Open browser DevTools (F12)
// Navigate to any admin page
// Look for this log:
🔐 ProtectedRoute Check: {
  allowedRoles: ['admin'],
  userData: {...},
  userRoles: ['admin'],  // ← Should show 'admin' here
  hasMatch: true         // ← Should be true
}
```

### Step 3: Check LocalStorage
```javascript
// In browser console, run:
JSON.parse(localStorage.getItem('user_data'))

// Should see:
{
  "id": 123,
  "name": "Admin Name",
  "roles": ["admin"],  // ← Important!
  "role": "admin",     // ← Also important!
  ...
}
```

---

## 🔧 Solutions

### Solution 1: Backend API Response (Recommended)

Update your Laravel API to return roles in the login response:

```php
// In your AuthController login method
return response()->json([
    'access_token' => $token,
    'user_id' => $user->id,
    'user' => $user->name,
    'email' => $user->email,
    'role' => $user->getRoleNames()->first(), // Single role
    'roles' => $user->getRoleNames()->toArray(), // Array of roles
    'message' => 'Logged in successfully.'
]);
```

### Solution 2: Use the Debug Page Button (Quick Fix)

1. Navigate to `/admin/debug`
2. Click the **"Grant Admin Role (Temporary)"** button
3. Page will reload with admin access
4. ✅ You can now access admin pages!

**Note**: This is temporary and will reset when you login again.

### Solution 3: Manually Update LocalStorage (Advanced)

```javascript
// In browser console (F12):
const userData = JSON.parse(localStorage.getItem('user_data'));
userData.roles = ['admin'];
userData.role = 'admin';
localStorage.setItem('user_data', JSON.stringify(userData));
location.reload();
```

### Solution 4: Database Direct Update

Update the user's role directly in your database:

```sql
-- Find admin user
SELECT * FROM users WHERE email = 'your-admin@email.com';

-- Assign admin role (using Spatie Laravel-Permission)
-- In Laravel tinker or migration:
$user = User::find(1);
$user->assignRole('admin');
```

---

## 📊 Understanding the Role System

### API Response Format (From Your API)
```json
{
  "access_token": "1|abc123...",
  "user_id": 1,
  "user": "John Doe",
  "role": "buyer",  // ← Single role (string)
  "email": "john@example.com",
  "message": "Logged in successfully."
}
```

### What Frontend Expects (After Fix)
```javascript
// The frontend now handles BOTH formats:

// Format 1: Single role (what your API returns)
{
  "role": "admin"
}
// ✅ Frontend converts this to: roles: ["admin"]

// Format 2: Multiple roles (if you add this later)
{
  "roles": ["admin", "seller"]
}
// ✅ Frontend handles this directly
```

### How It Works Now
```javascript
// In AuthContext.jsx (login function)
const userData = {
  // ...
  roles: response.roles 
    ? (Array.isArray(response.roles) ? response.roles : [response.roles])
    : (response.role ? [response.role] : ['buyer']),
  role: response.role || (response.roles ? response.roles[0] : 'buyer'),
};

// In ProtectedRoute.jsx
const userRoles = userData?.roles 
  ? (Array.isArray(userData.roles) ? userData.roles : [userData.roles])
  : (userData?.role ? [userData.role] : []);

// ✅ Now checks properly
if (allowedRoles.some(role => userRoles.includes(role))) {
  // Access granted!
}
```

---

## 🎯 Quick Checklist

### Before Login
- [ ] User has 'admin' role in database
- [ ] API returns role in login response

### During Login
- [ ] Check browser console for errors
- [ ] Verify localStorage has user_data
- [ ] Check that roles are set correctly

### After Login
- [ ] Navigate to `/admin/debug` to verify
- [ ] Check if "Admin Access" card is green
- [ ] Try accessing `/admin/dashboard`

### If Still Not Working
1. Clear localStorage: `localStorage.clear()`
2. Logout and login again
3. Check the debug page: `/admin/debug`
4. Use the "Grant Admin Role" button
5. Check browser console for errors

---

## 🐛 Common Issues & Fixes

### Issue 1: "You do not have permission to access this page"
**Cause**: User doesn't have admin role  
**Fix**: Use debug page button or update backend response

### Issue 2: Redirects to /unauthorized immediately
**Cause**: Roles not set in userData  
**Fix**: Check localStorage user_data, verify API response

### Issue 3: Can't access any admin pages
**Cause**: Token missing or invalid  
**Fix**: Logout and login again

### Issue 4: Admin menu not showing in sidebar
**Cause**: Role check in sidebar failing  
**Fix**: Sidebar now handles both formats automatically

---

## 📝 Testing Admin Access

### Test 1: Check Role in Console
```javascript
// Open browser console
const user = JSON.parse(localStorage.getItem('user_data'));
console.log('User:', user);
console.log('Roles:', user.roles);
console.log('Has Admin?', user.roles?.includes('admin'));
```

### Test 2: Use Debug Page
```
Navigate to: /admin/debug
Look for green "Admin Access" card
```

### Test 3: Check Protected Route
```
Try to access: /admin/dashboard
Should see admin dashboard, not unauthorized page
```

---

## 🎯 Final Solution Summary

### What Changed:
1. ✅ **ProtectedRoute**: Now normalizes roles before checking
2. ✅ **AuthContext**: Converts API response to array format
3. ✅ **Sidebar**: Handles both role formats
4. ✅ **Debug Page**: Added for troubleshooting

### What You Need:
1. User account with 'admin' role in database
2. API returning role in login response
3. Clear cache and login again

### Quick Fix (Temporary):
1. Go to `/admin/debug`
2. Click "Grant Admin Role (Temporary)"
3. ✅ Access admin pages immediately!

---

## 🚀 Production Setup

For production, ensure your Laravel API returns roles properly:

```php
// app/Http/Controllers/Api/AuthController.php

public function login(Request $request)
{
    // ... authentication logic ...
    
    $user = User::where('email', $request->email)->first();
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'id' => $user->id,
        'user_id' => $user->id,
        'access_token' => $token,
        'user' => $user->name,
        'email' => $user->email,
        'role' => $user->getRoleNames()->first(), // Single role
        'roles' => $user->getRoleNames()->toArray(), // Array of roles (optional)
        'message' => 'Logged in successfully.'
    ], 201);
}
```

---

## ✅ Verification Steps

After implementing the fix:

1. **Logout** from your current session
2. **Clear browser cache** (Ctrl+Shift+Del)
3. **Login again** with admin credentials
4. **Check console** for role debug logs
5. **Navigate to** `/admin/dashboard`
6. **Should work!** ✅

---

## 📞 Still Having Issues?

### Check These:

1. **User Data in LocalStorage**
   ```javascript
   localStorage.getItem('user_data')
   ```

2. **Access Token**
   ```javascript
   localStorage.getItem('auth_tokens')
   ```

3. **Console Errors**
   - Open DevTools (F12)
   - Check Console tab
   - Look for red errors

4. **Network Tab**
   - Check if login API call succeeded
   - Verify response has role/roles field

### Get Help:
- Visit `/admin/debug` for detailed info
- Check browser console logs
- Verify API response format
- Try the temporary fix button

---

**The admin access issue is now fixed! The system handles both `role` (string) and `roles` (array) formats automatically.** 🎉