# Hướng dẫn Phân quyền Auth & Business Logic

## Tổng quan

Đã tạo hệ thống phân quyền rõ ràng cho RescueNet với 3 tầng:

### 1. **Permission System** (`src/lib/auth/permissions.ts`)
Định nghĩa quyền và role:
- Enum `Permission` - Danh sách tất cả quyền trong hệ thống
- `ROLE_PERMISSIONS` - Mapping role với permissions
- Helper functions: `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`
- `getEmergencyAccessLevel()` - Tính toán mức độ truy cập emergency

### 2. **Protected Route Component** (`src/components/auth/ProtectedRoute.tsx`)  
Auth Guard cho routes:
```tsx
<ProtectedRoute 
  requireAuth 
  requiredPermission={Permission.SEND_SOS}
>
  <YourComponent />
</ProtectedRoute>
```

### 3. **Business Logic Hook** (`src/hooks/useEmergencyAccess.ts`)
Tách logic nghiệp vụ ra khỏi UI:
```tsx
const emergencyAccess = useEmergencyAccess();
// Returns: canSendSOS, verificationLevel, maxRequestsPerDay, etc.
```

## Cách sử dụng trong Emergency Page

### Trước (Phức tạp):
```tsx
// Logic lẫn lộn auth, UI, business logic
const { user, isAuthenticated } = useAuth();
const { verificationLevel } = useAppSelector(...);

{verificationLevel === 2 ? 'Tài khoản đầy đủ' : 
 verificationLevel === 1 ? 'Đã xác thực SĐT' : 'Ẩn danh'}
```

### Sau (Rõ ràng):
```tsx
// AUTH & PERMISSIONS (import once)
const emergencyAccess = useEmergencyAccess();

// Use everywhere
<Badge variant={emergencyAccess.verificationLevel === 2 ? 'success' : 'warning'}>
  {emergencyAccess.accessLevelLabel}
</Badge>

if (!emergencyAccess.canSendSOS) {
  alert('No permission');
}
```

## File Structure

```
src/
├── lib/
│   └── auth/
│       └── permissions.ts       # Permission definitions & logic
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx   # Auth guard component
├── hooks/
│   ├── useAuth.ts              # Auth state (từ Redux)
│   └── useEmergencyAccess.ts   # Business logic cho emergency
└── app/
    └── emergency/
        └── page.tsx            # UI sử dụng hooks trên
```

## Lợi ích

1. **Separation of Concerns**
   - Auth logic: `useAuth()`
   - Business logic: `useEmergencyAccess()`
   - UI logic: Component state

2. **Dễ tìm & sửa**
   - Muốn sửa text "Ẩn danh"? → `useEmergencyAccess.ts`
   - Muốn sửa quyền? → `permissions.ts`
   - Muốn sửa UI? → `page.tsx`

3. **Reusable**
   - `useEmergencyAccess()` có thể dùng ở nhiều component
   - `ProtectedRoute` dùng cho mọi protected pages
   - `hasPermission()` dùng ở bất kỳ đâu

4. **Type-safe**
   - Enum `Permission` autocomplete
   - TypeScript check đầy đủ

## Emergency Access Levels

| Level | Status | Max/Day | Priority | Label |
|-------|--------|---------|----------|-------|
| 0 | Anonymous | 2 | Low | Ẩn danh (Ưu tiên thấp) |
| 1 | Phone Verified | 5 | Normal | Đã xác thực SĐT |
| 2 | Full Account | 20 | High | Tài khoản đầy đủ |

## Ví dụ sử dụng

### Trong Emergency Page:
```tsx
import { useEmergencyAccess } from '@/hooks/useEmergencyAccess';

export default function EmergencyPage() {
  const emergencyAccess = useEmergencyAccess();
  
  // Simple check
  if (!emergencyAccess.canSendSOS) {
    return <div>No permission</div>;
  }
  
  // Display info
  return (
    <div>
      <Badge>{emergencyAccess.accessLevelLabel}</Badge>
      <p>Max requests: {emergencyAccess.maxRequestsPerDay}/day</p>
      <p>Priority: {emergencyAccess.priorityLevel}</p>
    </div>
  );
}
```

### Protect một route:
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Permission } from '@/lib/auth/permissions';

export default function AdminPage() {
  return (
    <ProtectedRoute 
      requireAuth 
      requiredPermission={Permission.MANAGE_USERS}
    >
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

### Check permission manually:
```tsx
import { hasPermission, Permission } from '@/lib/auth/permissions';
import { useAuth } from '@/hooks/useAuthRedux';

function MyComponent() {
  const { user } = useAuth();
  
  if (hasPermission(user?.role, Permission.RESPOND_TO_EMERGENCY)) {
    return <StaffTools />;
  }
  
  return <RegularView />;
}
```

## Next Steps

Để hoàn thiện emergency page với phân quyền:

1. Import `useEmergencyAccess` thay vì logic rời rạc
2. Thay thế hardcoded text bằng `emergencyAccess.accessLevelLabel`
3. Dùng `emergencyAccess.canSendSOS` thay vì custom checks
4. Dùng `emergencyAccess.maxRequestsPerDay` để hiển thị limits

File emergency page hiện tại có syntax errors do refactor. Cần:
1. Sửa lại import statements
2. Dùng `useEmergencyAccess()` hook
3. Simplify logic với clear separation
