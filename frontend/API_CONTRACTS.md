# API Contracts - Authentication Module

Tài liệu mô tả các API contracts giữa Frontend và Backend cho module Authentication.

---

## 1. REGISTER - Đăng ký tài khoản

### Request (Frontend → Backend)
```json
POST /api/auth/register

{
  // Thông tin cơ bản
  "fullName": "Nguyễn Văn A",
  "email": "nguyen.vana@example.com",
  "phone": "+84901234567",
  
  // Mật khẩu
  "password": "SecurePass123!",
  
  // Role của user (citizen, volunteer, staff, admin)
  "role": "citizen"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 201 Created

{
  // Trạng thái thành công
  "success": true,
  
  // Message cho user
  "message": "Registration successful. Please verify your phone number.",
  
  // Data của user vừa tạo
  "data": {
    "user": {
      "id": "uuid-123-456-789",
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.vana@example.com",
      "phone": "+84901234567",
      "role": "citizen",
      "isVerified": false,
      "createdAt": "2025-10-22T10:30:00Z"
    },
    
    // Token tạm để verify
    "verificationToken": "temp-token-123",
    
    // Có cần verify không (luôn true cho new user)
    "requiresVerification": true
  }
}
```

### Response Error (Backend → Frontend)
```json
HTTP 400 Bad Request

{
  "success": false,
  "message": "Email already exists",
  "errors": [
    {
      "field": "email",
      "message": "This email is already registered"
    }
  ]
}
```

---

## 2. VERIFY - Xác thực mã OTP qua SMS

### Request (Frontend → Backend)
```json
POST /api/auth/verify

{
  // Email hoặc phone của user
  "email": "nguyen.vana@example.com",
  
  // Mã 6 số được gửi qua SMS
  "code": "123456",
  
  // Token tạm từ registration
  "verificationToken": "temp-token-123"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Phone number verified successfully",
  
  "data": {
    // User info đã verified
    "user": {
      "id": "uuid-123-456-789",
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.vana@example.com",
      "phone": "+84901234567",
      "role": "citizen",
      "isVerified": true,
      "avatar": null,
      "createdAt": "2025-10-22T10:30:00Z"
    },
    
    // Access token (JWT) - dùng cho authenticated requests
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    
    // Refresh token - dùng để lấy access token mới
    "refreshToken": "refresh-token-xyz-789",
    
    // Thời gian hết hạn của access token (seconds)
    "expiresIn": 3600
  }
}
```

### Response Error (Backend → Frontend)
```json
HTTP 400 Bad Request

{
  "success": false,
  "message": "Invalid or expired verification code",
  "errors": [
    {
      "field": "code",
      "message": "The verification code is incorrect or has expired"
    }
  ]
}
```

---

## 3. RESEND CODE - Gửi lại mã xác thực

### Request (Frontend → Backend)
```json
POST /api/auth/resend-code

{
  // Email hoặc phone để gửi lại code
  "email": "nguyen.vana@example.com"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Verification code sent to your phone",
  
  "data": {
    // Phone đã được mask để bảo mật
    "phone": "+84901***567",
    
    // Thời gian hết hạn của code (seconds)
    "expiresIn": 300,
    
    // Có thể gửi lại sau bao lâu (seconds)
    "nextResendAt": 60
  }
}
```

### Response Error (Backend → Frontend)
```json
HTTP 429 Too Many Requests

{
  "success": false,
  "message": "Please wait before requesting a new code",
  "errors": [
    {
      "field": "resend",
      "message": "You can request a new code in 45 seconds"
    }
  ]
}
```

---

## 4. LOGIN - Đăng nhập

### Request (Frontend → Backend)
```json
POST /api/auth/login

{
  // Email để đăng nhập
  "email": "nguyen.vana@example.com",
  
  // Mật khẩu
  "password": "SecurePass123!",
  
  // Remember me (optional)
  "rememberMe": true
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Login successful",
  
  "data": {
    // Thông tin user
    "user": {
      "id": "uuid-123-456-789",
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.vana@example.com",
      "phone": "+84901234567",
      "role": "citizen",
      "isVerified": true,
      "avatar": "https://cdn.example.com/avatars/123.jpg",
      "createdAt": "2025-10-22T10:30:00Z"
    },
    
    // Access token (JWT)
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    
    // Refresh token
    "refreshToken": "refresh-token-xyz-789",
    
    // Thời gian hết hạn (seconds)
    // Nếu rememberMe = true thì lâu hơn (7 days)
    // Nếu rememberMe = false thì ngắn hơn (1 hour)
    "expiresIn": 3600
  }
}
```

### Response Error - Wrong Credentials (Backend → Frontend)
```json
HTTP 401 Unauthorized

{
  "success": false,
  "message": "Invalid email or password",
  "errors": [
    {
      "field": "credentials",
      "message": "The email or password you entered is incorrect"
    }
  ]
}
```

### Response Error - Account Not Verified (Backend → Frontend)
```json
HTTP 403 Forbidden

{
  "success": false,
  "message": "Account not verified",
  
  "data": {
    // Cần verify
    "requiresVerification": true,
    "email": "nguyen.vana@example.com",
    "phone": "+84901***567"
  }
}
```

---

## 5. LOGOUT - Đăng xuất

### Request (Frontend → Backend)
```json
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  // Refresh token để invalidate
  "refreshToken": "refresh-token-xyz-789"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 6. REFRESH TOKEN - Làm mới access token

### Request (Frontend → Backend)
```json
POST /api/auth/refresh

{
  // Refresh token hiện tại
  "refreshToken": "refresh-token-xyz-789"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Token refreshed successfully",
  
  "data": {
    // Access token mới
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    
    // Refresh token mới (optional - có thể giữ nguyên)
    "refreshToken": "refresh-token-new-123",
    
    // Thời gian hết hạn
    "expiresIn": 3600
  }
}
```

### Response Error (Backend → Frontend)
```json
HTTP 401 Unauthorized

{
  "success": false,
  "message": "Invalid or expired refresh token",
  "errors": [
    {
      "field": "refreshToken",
      "message": "Please login again"
    }
  ]
}
```

---

## 7. GET CURRENT USER - Lấy thông tin user hiện tại

### Request (Frontend → Backend)
```json
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123-456-789",
      "fullName": "Nguyễn Văn A",
      "email": "nguyen.vana@example.com",
      "phone": "+84901234567",
      "role": "citizen",
      "isVerified": true,
      "avatar": "https://cdn.example.com/avatars/123.jpg",
      "createdAt": "2025-10-22T10:30:00Z",
      "updatedAt": "2025-10-22T15:45:00Z"
    }
  }
}
```

### Response Error (Backend → Frontend)
```json
HTTP 401 Unauthorized

{
  "success": false,
  "message": "Unauthorized",
  "errors": [
    {
      "field": "token",
      "message": "Invalid or expired token"
    }
  ]
}
```

---

## 8. FORGOT PASSWORD - Quên mật khẩu (Future)

### Request (Frontend → Backend)
```json
POST /api/auth/forgot-password

{
  "email": "nguyen.vana@example.com"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Password reset code sent to your phone",
  
  "data": {
    "phone": "+84901***567",
    "expiresIn": 600
  }
}
```

---

## 9. RESET PASSWORD - Đặt lại mật khẩu (Future)

### Request (Frontend → Backend)
```json
POST /api/auth/reset-password

{
  "email": "nguyen.vana@example.com",
  "code": "123456",
  "newPassword": "NewSecurePass456!"
}
```

### Response Success (Backend → Frontend)
```json
HTTP 200 OK

{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### 401 Unauthorized - Token Invalid
```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": [
    {
      "field": "token",
      "message": "Invalid or expired token"
    }
  ]
}
```

### 403 Forbidden - No Permission
```json
{
  "success": false,
  "message": "Forbidden",
  "errors": [
    {
      "field": "permission",
      "message": "You don't have permission to access this resource"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": [
    {
      "field": "server",
      "message": "Something went wrong. Please try again later"
    }
  ]
}
```

---

## Notes

### 1. **Headers cho authenticated requests:**
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### 2. **JWT Token Structure:**
```json
{
  // Token header
  "alg": "HS256",
  "typ": "JWT",
  
  // Token payload
  "userId": "uuid-123-456-789",
  "email": "nguyen.vana@example.com",
  "role": "citizen",
  "iat": 1698052200,
  "exp": 1698055800
}
```

### 3. **Role-based Redirects sau login:**
- `admin` → `/admin`
- `staff` → `/staff`
- `volunteer` → `/volunteer`
- `citizen` → `/dashboard`

### 4. **Token Expiration Times:**
- Access Token (normal): 1 hour (3600s)
- Access Token (remember me): 7 days (604800s)
- Refresh Token: 30 days (2592000s)
- Verification Code: 5 minutes (300s)

### 5. **Rate Limiting:**
- Login: Max 5 attempts per 15 minutes
- Register: Max 3 attempts per hour
- Resend Code: Max 1 per minute
- Verify Code: Max 5 attempts per 10 minutes

### 6. **Phone Format:**
- Phải có country code: `+84901234567`
- Mask khi trả về: `+84901***567`
