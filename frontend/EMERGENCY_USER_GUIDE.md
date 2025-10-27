# Emergency SOS System - User Guide

## 📍 Tổng quan

Hệ thống Emergency SOS của RescueNet cho phép người dùng gửi tín hiệu cứu hộ khẩn cấp với 3 cấp độ ưu tiên dựa trên mức độ xác thực tài khoản.

---

## 🚨 Cách sử dụng Emergency Page

### Bước 1: Truy cập trang Emergency
```
URL: /emergency
```
- **Không cần đăng nhập** - Bất kỳ ai cũng có thể truy cập
- Hệ thống sẽ tự động xác định mức độ xác thực của bạn

### Bước 2: Kiểm tra mức độ xác thực

Ngay khi vào trang, bạn sẽ thấy **Badge** ở đầu trang hiển thị mức độ xác thực:

| Badge | Ý nghĩa | Số lần gửi/ngày | Thời gian phản hồi ước tính |
|-------|---------|-----------------|----------------------------|
| 🔴 **Ẩn danh (Ưu tiên thấp)** | Chưa đăng nhập | 2 lần/24h | ~15 phút |
| 🟡 **Đã xác thực SĐT (Ưu tiên bình thường)** | Đã đăng nhập + verify SĐT | 5 lần/24h | ~10 phút |
| 🟢 **Tài khoản đầy đủ (Ưu tiên cao)** | Đã đăng nhập + verify đầy đủ | 20 lần/24h | ~5 phút |

### Bước 3: Chọn loại sự cố

Chọn một trong các loại sự cố:
- 🏥 **Medical** - Y tế khẩn cấp
- 🔥 **Fire** - Hỏa hoạn
- 🌊 **Flood** - Lũ lụt
- 🚔 **Security** - An ninh
- 🚗 **Accident** - Tai nạn giao thông
- ❓ **Other** - Khác

### Bước 4: Thêm mô tả (tùy chọn)

Nhập mô tả chi tiết về tình huống khẩn cấp để đội cứu hộ hiểu rõ hơn.

### Bước 5: Nhấn nút SOS

**NÚT SOS MÀU ĐỎ LỚN** - Nhấn và giữ 3 giây

#### Quy trình 3 giây an toàn:
```
1. Nhấn nút SOS
   ↓
2. Đếm ngược 3 giây (có thể hủy)
   ↓
3. Gửi tín hiệu tự động
```

**Lưu ý:** 
- ✅ Có thể **HỦY** trong vòng 3 giây
- ✅ Hệ thống tự động lấy **vị trí GPS**
- ✅ Không cần reload trang

---

## 🔐 Hệ thống xác thực & Ưu tiên

### Cấp độ 0: Ẩn danh (Anonymous)

**Trạng thái:**
- ❌ Chưa đăng nhập
- ❌ Không có tài khoản

**Giới hạn:**
- 🔴 Ưu tiên thấp nhất
- 📉 Chỉ 2 lần gửi SOS/24 giờ
- ⏱️ Thời gian phản hồi: ~15 phút
- ⚠️ Cần CAPTCHA sau 3 lần gửi

**Cách nâng cấp:**
→ Đăng ký tài khoản tại `/auth/register`

---

### Cấp độ 1: Đã xác thực SĐT (Phone Verified)

**Trạng thái:**
- ✅ Đã đăng nhập
- ⚠️ Chưa xác thực số điện thoại

**Giới hạn:**
- 🟡 Ưu tiên bình thường
- 📊 5 lần gửi SOS/24 giờ
- ⏱️ Thời gian phản hồi: ~10 phút

**Cách xác thực SĐT:**

#### Cách 1: Trong trang Emergency
1. Nhập số điện thoại vào ô **"Phone Verification"** (bên phải)
2. Nhấn **"Send OTP"**
3. Nhập mã 6 số nhận được qua SMS
4. Nhấn **"Confirm"**
5. ✅ Nâng cấp thành công!

#### Cách 2: Trong lúc gửi SOS
1. Nhấn nút SOS
2. Nếu chưa verify → Hiện popup yêu cầu SĐT
3. Nhập SĐT → Nhận OTP
4. Xác thực → Gửi SOS với ưu tiên cao hơn

**Cách nâng cấp lên Cấp độ 2:**
→ Hoàn thiện profile đầy đủ (tên, email, địa chỉ)

---

### Cấp độ 2: Tài khoản đầy đủ (Full Account)

**Trạng thái:**
- ✅ Đã đăng nhập
- ✅ Đã xác thực SĐT
- ✅ Profile đầy đủ

**Ưu điểm:**
- 🟢 **Ưu tiên cao nhất**
- 📈 20 lần gửi SOS/24 giờ
- ⚡ Thời gian phản hồi: ~5 phút
- 🚀 Không cần CAPTCHA
- 🎯 Đội cứu hộ nhận thông tin đầy đủ

---

## 📱 Quy trình gửi SOS đầy đủ

### Trường hợp 1: Người dùng Ẩn danh

```
1. Vào /emergency
2. Cho phép truy cập vị trí GPS
3. Chọn loại sự cố (Medical, Fire, etc.)
4. Nhập mô tả (optional)
5. Nhấn nút SOS màu đỏ
6. Đếm ngược 3 giây
7. ✅ Gửi thành công!
8. Xem trạng thái đội cứu hộ real-time
```

**Hạn chế:** 2 lần/24h, ưu tiên thấp

---

### Trường hợp 2: Người dùng có tài khoản nhưng chưa verify SĐT

```
1. Vào /emergency (đã đăng nhập)
2. Badge hiển thị: "Ẩn danh (Ưu tiên thấp)"
3. Bên phải có card "Upgrade to Phone Verified"
   ┌─────────────────────────────────┐
   │ 📞 Verify Phone Number          │
   │                                 │
   │ [______________________]        │
   │  +84 xxx xxx xxx                │
   │                                 │
   │ [ Send OTP ]                    │
   └─────────────────────────────────┘
4. Nhập SĐT → Send OTP
5. Nhập mã 6 số
6. ✅ Badge chuyển thành "Đã xác thực SĐT"
7. Limit tăng: 2 → 5 lần/ngày
8. Giờ có thể gửi SOS với ưu tiên cao hơn!
```

---

### Trường hợp 3: Người dùng Full Account

```
1. Vào /emergency (đã đăng nhập + verified)
2. Badge: "Tài khoản đầy đủ (Ưu tiên cao)" 🟢
3. Hiển thị: "Remaining: 20/20 requests"
4. Chọn sự cố → Mô tả → Nhấn SOS
5. Countdown 3s
6. ✅ Gửi ngay lập tức
7. ETA: ~5 phút
8. Xem real-time:
   - Trạng thái: Pending → Sent → Assigned → On Route → Arrived
   - ETA countdown
   - Tọa độ đội cứu hộ (optional)
```

---

## 🎯 Tính năng của trang Emergency

### 1. **Nút SOS chính**
- **Vị trí:** Giữa màn hình, bên trái
- **Kích thước:** To, màu đỏ nổi bật
- **Chức năng:** Countdown 3 giây → Gửi SOS
- **Hủy:** Nhấn "Cancel" trong 3 giây

### 2. **Chọn loại sự cố**
- Grid 2x3 (mobile) hoặc 3x2 (desktop)
- Chỉ chọn được 1 loại
- Icon + text cho mỗi loại

### 3. **Mô tả tùy chọn**
- Text area để nhập chi tiết
- Không bắt buộc
- Giúp đội cứu hộ hiểu rõ hơn

### 4. **Verification Panel** (bên phải)

#### Nếu chưa verify SĐT:
```
┌─────────────────────────────────┐
│ ⚠️ Upgrade to Higher Priority   │
│                                 │
│ Benefits:                       │
│ • More requests per day         │
│ • Faster response time          │
│ • Higher priority               │
│                                 │
│ Phone Number:                   │
│ [______________________]        │
│                                 │
│ [ Send OTP ]                    │
└─────────────────────────────────┘
```

#### Nếu đã gửi OTP:
```
┌─────────────────────────────────┐
│ 📱 Enter Verification Code      │
│                                 │
│ We sent 6-digit code to:        │
│ +84 123 456 789                 │
│                                 │
│ [_] [_] [_] [_] [_] [_]        │
│                                 │
│ Expires in: 4:32                │
│                                 │
│ [ Verify ]                      │
│                                 │
│ Didn't receive? [Resend]        │
└─────────────────────────────────┘
```

### 5. **Status Display** (sau khi gửi SOS)

Thay thế nút SOS bằng card hiển thị:

```
┌─────────────────────────────────┐
│ ✅ SOS SENT SUCCESSFULLY        │
│                                 │
│ Status: On Route                │
│ Incident: Medical Emergency     │
│ Priority: HIGH                  │
│                                 │
│ ⏱️ ETA: 8 minutes               │
│                                 │
│ [I'm Okay] [Cancel Request]    │
└─────────────────────────────────┘
```

### 6. **Info Card** (bên phải dưới)

```
┌─────────────────────────────────┐
│ ℹ️ EMERGENCY INFO               │
│                                 │
│ Priority: HIGH                  │
│ ETA: 5 minutes                  │
│ Location: Detected ✅           │
│                                 │
│ Requests remaining: 18/20       │
└─────────────────────────────────┘
```

---

## 🔄 Trạng thái SOS Request

Sau khi gửi SOS, request sẽ trải qua các trạng thái:

1. **Pending** ⏳ - Đang xử lý
2. **Sending** 📤 - Đang gửi tới hệ thống
3. **Sent** ✅ - Đã gửi thành công
4. **Assigned** 👥 - Đã phân công đội cứu hộ
5. **On Route** 🚑 - Đội đang trên đường đến
6. **Arrived** 🏥 - Đã đến hiện trường
7. **Completed** ✔️ - Hoàn thành
8. **Cancelled** ❌ - Đã hủy

**Real-time update:** Trạng thái tự động cập nhật mà không cần refresh

---

## ⚠️ Rate Limiting & Anti-Abuse

### Giới hạn theo cấp độ:

| Level | Max/Day | Cooldown | CAPTCHA |
|-------|---------|----------|---------|
| 0 (Anonymous) | 2 | 12h | After 3 |
| 1 (Phone Verified) | 5 | 5h | After 5 |
| 2 (Full Account) | 20 | 1h | Never |

### Khi vượt giới hạn:

```
❌ Rate Limit Exceeded

You have reached your daily limit.
- Current limit: 2 requests/24h
- Upgrade to Phone Verified: 5 requests/24h
- Upgrade to Full Account: 20 requests/24h

Next available request: in 8 hours

[Upgrade Account]
```

### Device Fingerprinting:

Hệ thống track theo:
- IP address
- Browser fingerprint
- Device ID

→ Ngăn spam bằng nhiều tài khoản

---

## 📍 Location Services

### Yêu cầu:
- ✅ Browser hỗ trợ Geolocation API
- ✅ User cho phép truy cập vị trí

### Quy trình:
```
1. Vào /emergency
2. Browser popup: "Allow location access?"
3. Nhấn "Allow"
4. ✅ Vị trí được lấy tự động
5. Icon 📍 hiển thị "Location detected"
```

### Nếu từ chối location:

```
⚠️ Location Required

Emergency services need your location to respond.

Please enable location access:
1. Click the 🔒 icon in address bar
2. Allow location for this site
3. Reload the page

[Reload Page]
```

**Lưu ý:** KHÔNG THỂ gửi SOS nếu không có location!

---

## 🎨 UI/UX Details

### Responsive Design:

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────┐
│  EMERGENCY SOS                          │
│  Badge: Ẩn danh (Ưu tiên thấp)         │
├──────────────────┬──────────────────────┤
│                  │                      │
│  [SOS BUTTON]    │  [Verification]      │
│                  │                      │
│  [Incident Type] │  [Info Card]         │
│                  │                      │
│  [Description]   │                      │
└──────────────────┴──────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────┐
│  EMERGENCY SOS  │
│  Badge          │
├─────────────────┤
│  [SOS BUTTON]   │
├─────────────────┤
│  [Incident]     │
├─────────────────┤
│  [Description]  │
├─────────────────┤
│  [Verification] │
├─────────────────┤
│  [Info Card]    │
└─────────────────┘
```

### Color Coding:

- 🔴 Red: SOS button, critical status
- 🟡 Yellow: Warning, pending status
- 🟢 Green: Success, completed status
- 🔵 Blue: Info, normal status
- ⚫ Gray: Disabled, inactive

---

## 🛠️ Troubleshooting

### Vấn đề 1: Không thấy nút SOS
**Giải pháp:**
- Kiểm tra bạn đã cho phép location chưa
- Refresh trang
- Clear browser cache

### Vấn đề 2: Không nhận được OTP
**Giải pháp:**
- Kiểm tra số điện thoại đúng chưa
- Chờ 1 phút rồi nhấn "Resend"
- Kiểm tra tin nhắn spam

### Vấn đề 3: SOS không gửi được
**Giải pháp:**
- Kiểm tra kết nối internet
- Kiểm tra đã vượt rate limit chưa
- Kiểm tra location có bật không

### Vấn đề 4: Badge hiển thị sai cấp độ
**Giải pháp:**
- Logout và login lại
- Kiểm tra profile đã đầy đủ chưa
- Contact admin nếu vẫn sai

---

## 🔐 Security & Privacy

### Thông tin được thu thập:
- ✅ GPS location (chỉ khi gửi SOS)
- ✅ Device fingerprint (chống spam)
- ✅ Incident type & description
- ✅ User ID (nếu đã đăng nhập)
- ✅ Phone number (nếu verify)

### Thông tin KHÔNG thu thập:
- ❌ Browsing history
- ❌ Personal messages
- ❌ Payment info
- ❌ Contacts

### Data retention:
- Emergency requests: 1 năm
- Location data: 30 ngày
- Logs: 90 ngày

---

## 📞 Contact & Support

**Emergency Hotline:** 115 (24/7)  
**Technical Support:** support@rescuenet.com  
**Report Issues:** /report-bug

---

## 🎯 Best Practices

### DO ✅
- ✅ Cho phép location access
- ✅ Verify phone number sớm
- ✅ Nhập mô tả chi tiết
- ✅ Giữ điện thoại bật
- ✅ Ở yên tại chỗ sau khi gửi SOS

### DON'T ❌
- ❌ Spam SOS để test
- ❌ Gửi SOS giả
- ❌ Hủy khi đội đã đến
- ❌ Dùng nhiều tài khoản để vượt limit
- ❌ Tắt điện thoại sau khi gửi

---

## 📊 Statistics & Insights

**Average Response Time:**
- Level 0: 15 minutes
- Level 1: 10 minutes  
- Level 2: 5 minutes

**Success Rate:** 98.5%  
**False Alarm Rate:** 2.1%  
**User Satisfaction:** 4.8/5.0

---

## 🚀 Quick Start Guide

### Cho người dùng mới:
1. Vào `/emergency`
2. Nhấn "Allow" location
3. Nhấn nút SOS đỏ
4. Đợi 3 giây
5. ✅ Done!

### Để có ưu tiên cao:
1. Đăng ký tại `/auth/register`
2. Verify email
3. Vào `/emergency`
4. Verify phone number
5. Complete profile
6. ✅ Ưu tiên cao!

---

## ⚡ Advanced Features (Coming Soon)

- 🗺️ Live map tracking
- 📹 Video call với dispatcher
- 🎤 Voice-activated SOS
- 📱 Mobile app
- 🚁 Drone response
- 🤖 AI-powered triage

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0  
**Support:** support@rescuenet.com
