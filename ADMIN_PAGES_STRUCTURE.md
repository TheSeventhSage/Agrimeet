# Admin Pages Visual Structure Guide

## 1. Admin Dashboard (`/admin/dashboard`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                                  │
│ Welcome back! Here's your platform overview                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Total Users]    [Active Products]  [Total Revenue]  [Orders]  │
│   12,458           3,892              $156,890        5,234     │
│   +12%             +8%                +23%            +15%      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Pending KYC: 15]  [Pending Products: 23]                      │
│  [Open Disputes: 8] [Active Users: 342]                         │
│   Review Now         Moderate         Resolve      View All     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Quick Statistics                                               │
│  Avg Order: $45.50  | Conversion: 3.2% | Active Sellers: 892   │
├─────────────────────────────────────────────────────────────────┤
│  Recent Activities              │  Platform Health              │
│  • New user registered          │  Server: ████████░░ 98%       │
│  • Product approved             │  API: ███████░░░ 95%          │
│  • Order completed              │  Database: ██████░░░ 92%      │
│  • Dispute resolved             │  Payment: ██████████ 100%     │
└─────────────────────────────────────────────────────────────────┘
```

## 2. User Management (`/admin/users`)

```
┌─────────────────────────────────────────────────────────────────┐
│ User Management                                                  │
│ Manage all platform users and their accounts                    │
├─────────────────────────────────────────────────────────────────┤
│ [Total: 12,458]  [Active: 11,234]  [Suspended: 45]  [New: 234] │
├─────────────────────────────────────────────────────────────────┤
│ Search: [________________]  Status: [All ▼]  Role: [All ▼]     │
├─────────────────────────────────────────────────────────────────┤
│ User Table                                                       │
│ ┌────────────┬──────────┬──────┬────────┬──────────┬─────────┐ │
│ │ User       │ Contact  │ Role │ Status │ Joined   │ Actions │ │
│ ├────────────┼──────────┼──────┼────────┼──────────┼─────────┤ │
│ │ John Doe   │ john@... │Seller│ Active │ Jan 2024 │ 👁️ ⏸️ 🗑️ │ │
│ │ Jane Smith │ jane@... │ Buyer│ Active │ Feb 2024 │ 👁️ ⏸️ 🗑️ │ │
│ └────────────┴──────────┴──────┴────────┴──────────┴─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Showing 1-10 of 12,458      [◄] Page 1 of 1,246 [►]           │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Seller Approval (`/admin/seller-approval`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Seller Approval                                                  │
│ Review and verify seller KYC applications                        │
├─────────────────────────────────────────────────────────────────┤
│ [Pending: 15]  [Approved Today: 8]  [Total: 892]  [Rejected: 5]│
├─────────────────────────────────────────────────────────────────┤
│ Search: [________________]  Status: [Pending ▼]                 │
├─────────────────────────────────────────────────────────────────┤
│ KYC Applications Grid                                            │
│ ┌─────────────────────┐  ┌─────────────────────┐               │
│ │ 🏢 AgriCorp Ltd     │  │ 🏢 FarmFresh Co     │               │
│ │ John Manager        │  │ Sarah Owner         │               │
│ │ 📍 Lagos, Nigeria   │  │ 📍 Abuja, Nigeria   │               │
│ │ 📅 Applied: Jan 15  │  │ 📅 Applied: Jan 16  │               │
│ │ [View] [✓ Approve]  │  │ [View] [✓ Approve]  │               │
│ │        [✗ Reject]   │  │        [✗ Reject]   │               │
│ └─────────────────────┘  └─────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Product Moderation (`/admin/products`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Product Moderation                                               │
│ Review and moderate product listings before they go live         │
├─────────────────────────────────────────────────────────────────┤
│ [Pending: 23] [Approved Today: 12] [Total: 3,892] [Rejected: 3]│
├─────────────────────────────────────────────────────────────────┤
│ Search: [____] Category: [All ▼] Status: [Pending ▼]           │
├─────────────────────────────────────────────────────────────────┤
│ Product Cards Grid                                               │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│ │ [Image]  │  │ [Image]  │  │ [Image]  │                       │
│ │ Maize    │  │ Rice     │  │ Tomatoes │                       │
│ │ $50/bag  │  │ $80/bag  │  │ $30/crate│                       │
│ │ Grains   │  │ Grains   │  │ Veggies  │                       │
│ │[View][✓] │  │[View][✓] │  │[View][✓] │                       │
│ │     [✗]  │  │     [✗]  │  │     [✗]  │                       │
│ └──────────┘  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Transaction Oversight (`/admin/transactions`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Transaction Oversight                        [Export CSV]        │
│ Monitor all platform transactions and payment records            │
├─────────────────────────────────────────────────────────────────┤
│ [Revenue: $156,890] [Today: 45] [Pending: 12] [Failed: 3]      │
├─────────────────────────────────────────────────────────────────┤
│ Search: [_______] Status: [All ▼] Type: [All ▼] Date: [____]  │
├─────────────────────────────────────────────────────────────────┤
│ Transaction Table                                                │
│ ┌──────┬────────┬──────┬────────┬────────┬──────────┬────────┐ │
│ │ Txn  │ User   │ Type │ Amount │ Status │ Date     │ Action │ │
│ ├──────┼────────┼──────┼────────┼────────┼──────────┼────────┤ │
│ │TX001 │ John D │ Pay  │ $120   │Complete│ Jan 15   │   👁️   │ │
│ │TX002 │ Jane S │ Pay  │ $85    │ Pending│ Jan 15   │   👁️   │ │
│ └──────┴────────┴──────┴────────┴────────┴──────────┴────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 5,234        [◄] Page 1 of 262 [►]            │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Dispute Management (`/admin/disputes`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Dispute Management                                               │
│ Handle buyer-seller disputes and resolve issues                  │
├─────────────────────────────────────────────────────────────────┤
│ [Open: 8] [In Progress: 5] [Resolved Today: 12] [Total: 456]   │
├─────────────────────────────────────────────────────────────────┤
│ Search: [________] Status: [Open ▼] Priority: [All ▼]          │
├─────────────────────────────────────────────────────────────────┤
│ Dispute List                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚠️  Order Not Delivered         [Open] [High Priority]      │ │
│ │ Buyer: John Doe | Seller: FarmCo | Order: #ORD-001          │ │
│ │ Created: Jan 15, 2024                    [View Details] →   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚠️  Product Quality Issue       [In Progress] [Medium]      │ │
│ │ Buyer: Jane Smith | Seller: AgriCorp | Order: #ORD-002      │ │
│ │ Created: Jan 14, 2024                    [View Details] →   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 7. Reports & Analytics (`/admin/reports`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Reports & Analytics              Period: [30 Days ▼] [Export]   │
│ Platform insights and performance metrics                        │
├─────────────────────────────────────────────────────────────────┤
│ [Revenue: $156,890] [Users: 12,458] [Orders: 5,234] [Prod: 3K] │
│     +23%                +12%            +15%            +8%     │
├─────────────────────────────────────────────────────────────────┤
│ Key Performance Metrics                                          │
│ Avg Order: $45.50 | Conversion: 3.2% | Active Sellers: 892     │
├─────────────────────────────────────────────────────────────────┤
│ Revenue Trend                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │        📊 Chart Area (Revenue over time)                  │   │
│ │                                                            │   │
│ └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ Top Products            │  Top Sellers                           │
│ 1. Maize - $45K        │  1. FarmCo - $120K                     │
│ 2. Rice - $38K         │  2. AgriCorp - $98K                    │
│ 3. Tomatoes - $25K     │  3. GreenFarms - $76K                  │
├─────────────────────────────────────────────────────────────────┤
│ Category Performance                                             │
│ [Grains: 1.2K] [Veggies: 892] [Fruits: 654] [Dairy: 423]      │
└─────────────────────────────────────────────────────────────────┘
```

## Common UI Elements Across All Pages

### Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│ [Page Title]                                      [Action Btn]   │
│ Description text                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Stat Cards
```
┌──────────────────┐
│ Title            │
│ 12,458      📊   │
│ +12% ↑           │
└──────────────────┘
```

### Data Table Pattern
```
┌──────────────────────────────────────────────┐
│ Col 1    │ Col 2    │ Col 3    │ Actions    │
├──────────┼──────────┼──────────┼────────────┤
│ Data     │ Data     │ Badge    │ 👁️ ✏️ 🗑️   │
└──────────┴──────────┴──────────┴────────────┘
```

### Modal Dialog
```
┌─────────────────────────────────────┐
│ Modal Title                    [✗]  │
├─────────────────────────────────────┤
│                                     │
│ Content Area                        │
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Confirm]     │
└─────────────────────────────────────┘
```

### Filter Bar
```
┌─────────────────────────────────────────────────────────────────┐
│ Search: [__________] Filter1: [▼] Filter2: [▼] Filter3: [▼]   │
└─────────────────────────────────────────────────────────────────┘
```

### Pagination
```
┌─────────────────────────────────────────────────────────────────┐
│ Showing 1-10 of 1,234        [◄] Page 1 of 124 [►]            │
└─────────────────────────────────────────────────────────────────┘
```

### Status Badges
```
[Active] [Pending] [Completed] [Failed] [Open] [Closed]
 Green    Yellow     Green       Red      Blue    Gray
```

### Priority Badges
```
[High]    [Medium]   [Low]
 Red       Yellow     Green
```

## Responsive Behavior

### Desktop (1280px+)
- Full sidebar visible
- 4-column stat cards
- Wide data tables
- Multi-column layouts

### Tablet (768px - 1279px)
- Collapsible sidebar
- 2-column stat cards
- Scrollable tables
- Adapted layouts

### Mobile (< 768px)
- Hidden sidebar (hamburger menu)
- Single-column stat cards
- Card-based tables
- Stacked layouts

## Color Legend

- 🟢 Green: Success, Active, Approved
- 🟡 Yellow: Warning, Pending, In Progress
- 🔴 Red: Error, Rejected, Critical
- 🔵 Blue: Info, Default, Neutral
- 🟣 Purple: Analytics, Reports
- ⚫ Gray: Inactive, Disabled

## Icon Legend

- 👁️ View/Preview
- ✏️ Edit
- 🗑️ Delete
- ✓ Approve/Confirm
- ✗ Reject/Cancel
- 📊 Statistics
- 📅 Date/Calendar
- 🏢 Business/Company
- 📍 Location
- ⚠️ Alert/Warning
- 💰 Money/Payment
- 📦 Package/Product
- 👤 User/Person

---

This structure provides a consistent, intuitive interface across all admin pages with familiar patterns and clear visual hierarchy.