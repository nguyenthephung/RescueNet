# Đồng bộ hóa chức năng Login giữa Frontend và Backend

## Tổng quan
Đã đồng bộ hóa thành công các object dữ liệu và API endpoints giữa frontend (Next.js) và backend (Spring Boot) cho chức năng login.

## Các thay đổi Backend

### 1. AuthenticationResponse.java
**File:** `backend/auth-service/src/main/java/com/example/demo/dto/response/AuthenticationResponse.java`

**Thay đổi:**
- ✅ Thêm field `refreshToken: String`
- ✅ Thêm field `expiresIn: Long` (thời gian hết hạn token tính bằng giây)

**Trước:**
```java
public class AuthenticationResponse {
    String token;
    boolean authenticated;
}
```

**Sau:**
```java
public class AuthenticationResponse {
    String token;
    String refreshToken;
    Long expiresIn;
    boolean authenticated;
}
```

### 2. AuthenticationService.java
**File:** `backend/auth-service/src/main/java/com/example/demo/service/AuthenticationService.java`

**Thay đổi:**
- ✅ Cập nhật method `authentication()` để sinh refreshToken và trả về expiresIn
- ✅ Cập nhật method `refreshToken()` để trả về đầy đủ thông tin

**Method `authentication()`:**
```java
return AuthenticationResponse.builder()
    .token(token)
    .refreshToken(refreshToken)
    .expiresIn(VALID_DURATION)
    .authenticated(true)
    .build();
```

**Method `refreshToken()`:**
```java
return AuthenticationResponse.builder()
    .token(token)
    .refreshToken(token)
    .expiresIn(VALID_DURATION)
    .authenticated(true)
    .build();
```

## Các thay đổi Frontend

### 1. auth.ts - API Endpoints
**File:** `frontend/src/lib/api/auth.ts`

**Các endpoint đã được cập nhật:**

| Endpoint cũ | Endpoint mới | Trạng thái |
|------------|-------------|-----------|
| `/auth/login` | `/identity/auth/login` | ✅ |
| `/identity/users/register` | `/identity/users/register` | ✅ (không đổi) |
| `/identity/auth/verify` | `/identity/auth/verify` | ✅ (không đổi) |
| `/auth/resend-code` | `/identity/auth/resend-code` | ✅ |
| `/auth/logout` | `/identity/auth/logout` | ✅ |
| `/auth/introspect` | `/identity/auth/introspect` | ✅ |
| `/auth/refresh` | `/identity/auth/refresh` | ✅ |

### 2. auth.ts - Login Function
**Cải tiến:**
- ✅ Xử lý đúng response structure từ backend `{ code, message, result: {...} }`
- ✅ Lưu `token`, `refreshToken`, và `expiresIn` vào localStorage
- ✅ Tự động gọi API `/identity/users/my-info` để lấy thông tin user thật
- ✅ Fallback nếu không lấy được thông tin user
- ✅ Xử lý error tốt hơn với backend error response

### 3. auth.ts - New getMyInfo() Function
**Thêm mới:**
```typescript
export async function getMyInfo(): Promise<User>
```
- Gọi API `/identity/users/my-info` từ backend
- Map `UserResponse` (backend) → `User` (frontend)
- Lấy role từ user.roles[0].name

### 4. apiClient.ts - Token Management
**File:** `frontend/src/lib/api/apiClient.ts`

**Cập nhật:**
- ✅ Public endpoints: `/identity/auth/login`, `/identity/users/register`, `/identity/auth/verify`, `/identity/auth/resend-code`, `/identity/auth/refresh`
- ✅ Refresh token endpoint: `/identity/auth/refresh`
- ✅ Request body cho refresh: `{ token: refreshToken }` (backend expects `token` field)
- ✅ Sử dụng `tokenManager.clearTokens()` thay vì xóa localStorage trực tiếp

## API Gateway Configuration

**File:** `backend/api-gateway/src/main/resources/application.properties`

**Routing:**
```properties
spring.cloud.gateway.server.webflux.routes[0].id=auth_service
spring.cloud.gateway.server.webflux.routes[0].uri=http://localhost:8080
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/api/v1/identity/**
spring.cloud.gateway.server.webflux.routes[0].filters[0]=StripPrefix=2
```

**URL mapping:**
- Frontend gọi: `http://localhost:8888/api/v1/identity/auth/login`
- API Gateway strip prefix (2 levels): `/api/v1` → loại bỏ
- Auth Service nhận: `http://localhost:8080/auth/login` ✅

## Data Mapping

### Backend → Frontend

**UserResponse (Backend):**
```java
{
    userId: Long,
    fullName: String,
    email: String,
    phone: String,
    firstName: String,
    lastName: String,
    roles: Set<RoleResponse>,
    status: String,
    createdAt: LocalDateTime
}
```

**User (Frontend):**
```typescript
{
    id: string,
    email: string,
    name: string,
    fullName: string,
    role: UserRole,
    createdAt: string,
    updatedAt: string
}
```

**Mapping logic:**
```typescript
{
    id: userResponse.userId.toString(),
    email: userResponse.email,
    name: userResponse.fullName,
    fullName: userResponse.fullName,
    role: userResponse.roles[0].name.toLowerCase(),
    createdAt: userResponse.createdAt,
    updatedAt: userResponse.createdAt
}
```

## Flow hoạt động

### 1. Login Flow
```
1. User nhập email/password
2. Frontend → POST /api/v1/identity/auth/login
   Body: { fullName: email, passwordHash: password }
3. Backend verify credentials
4. Backend trả về: { result: { token, refreshToken, expiresIn, authenticated } }
5. Frontend lưu tokens vào localStorage
6. Frontend gọi GET /api/v1/identity/users/my-info
7. Backend trả về user info đầy đủ
8. Frontend map UserResponse → User
9. Login thành công với đầy đủ thông tin user
```

### 2. Token Refresh Flow
```
1. Request bị reject với 401
2. apiClient interceptor catch error
3. Gọi POST /api/v1/identity/auth/refresh
   Body: { token: refreshToken }
4. Backend verify refresh token
5. Backend trả về: { result: { token, refreshToken, expiresIn, authenticated } }
6. Frontend update tokens
7. Retry original request với token mới
```

### 3. Logout Flow
```
1. User click logout
2. Frontend → POST /api/v1/identity/auth/logout
   Body: { token }
3. Backend invalidate token
4. Frontend clear localStorage (tokenManager.clearTokens())
5. Redirect to login page
```

## Kiểm tra hoạt động

### Test Backend
```bash
# Start auth service
cd backend/auth-service
./mvnw spring-boot:run

# Start API Gateway
cd backend/api-gateway
./mvnw spring-boot:run
```

### Test Frontend
```bash
cd frontend
npm run dev
```

### Test API với curl
```bash
# Login
curl -X POST http://localhost:8888/api/v1/identity/auth/login \
  -H "Content-Type: application/json" \
  -d '{"fullName":"user@example.com","passwordHash":"password123"}'

# Get user info
curl -X GET http://localhost:8888/api/v1/identity/users/my-info \
  -H "Authorization: Bearer YOUR_TOKEN"

# Refresh token
curl -X POST http://localhost:8888/api/v1/identity/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_REFRESH_TOKEN"}'
```

## Checklist ✅

- [x] Backend AuthenticationResponse có đầy đủ fields
- [x] Backend authentication() method trả về refreshToken và expiresIn
- [x] Frontend endpoints đúng với API Gateway routing
- [x] Frontend xử lý response structure từ backend
- [x] Frontend lưu tokens đúng cách
- [x] Frontend có hàm getMyInfo() để lấy user info
- [x] apiClient.ts có đúng public endpoints
- [x] apiClient.ts refresh token endpoint đúng
- [x] Logout sử dụng tokenManager.clearTokens()
- [x] Data mapping Backend ↔ Frontend

## Notes

1. **Backend field naming:** Backend sử dụng `fullName` thay vì `email` cho username field
2. **Token refresh:** Backend expect `{ token: refreshToken }` không phải `{ refreshToken }`
3. **User info:** Sau khi login thành công, frontend tự động gọi `/users/my-info` để lấy thông tin đầy đủ
4. **Role mapping:** Frontend lấy role từ `user.roles[0].name` và convert sang lowercase
5. **Error handling:** Frontend có xử lý fallback nếu không lấy được user info

## Lỗi thường gặp và cách fix

### 1. CORS Error
- Kiểm tra `cors.allowed-origins` trong `application.properties`
- Default: `http://localhost:3000,http://localhost:3001`

### 2. 401 Unauthorized
- Token hết hạn → Tự động refresh
- Refresh token hết hạn → Redirect to login
- Check `jwt.valid-duration` và `jwt.refreshable-duration`

### 3. User info không load
- Check API Gateway có route đến auth-service
- Check token có trong Authorization header
- Check `/users/my-info` endpoint có authentication

## Tài liệu tham khảo

- Backend API: `http://localhost:8888/api/v1`
- Auth Service: `http://localhost:8080`
- API Gateway: `http://localhost:8888`
- Frontend: `http://localhost:3000`
