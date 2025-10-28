/**
 * Internationalization (i18n) Configuration
 * Simple i18n implementation for English and Vietnamese
 */

import type { Language } from '@/types';

export const translations = {
  en: {
    // Common
    'common.welcome': 'Welcome to RescueNet',
    'common.home': 'Home',
    'common.about': 'About',
    'common.contact': 'Emergency Contact',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.register': 'Register',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.emergency': 'Emergency',
    'common.urgent': 'Urgent',
    'common.callNow': 'Call Now',
    'common.minutes': 'minutes',
    
    // Navigation
    'nav.dashboard': 'Control Center',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.users': 'Personnel',
    'nav.tasks': 'Missions',
    'nav.reports': 'Incident Reports',
    'nav.emergencies': 'Active Emergencies',
    'nav.dispatch': 'Dispatch',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember me',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.fullName': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.selectRole': 'Select Role',
    'auth.verificationCode': 'Verification Code',
    'auth.sendCode': 'Send Code',
    'auth.resendCode': 'Resend Code',
    'auth.verify': 'Verify',
    'auth.backToLogin': 'Back to Login',
    'auth.registerAs': 'Register as',
    'auth.citizen': 'Citizen',
    'auth.volunteer': 'Volunteer',
    'auth.staff': 'Staff/Rescuer',
    'auth.citizenDesc': 'Report emergencies, request help',
    'auth.volunteerDesc': 'Join rescue operations, help community',
    'auth.staffDesc': 'Professional rescue team member',
    'auth.verifyEmail': 'Verify Your Phone',
    'auth.codeSent': 'Verification code sent to your phone',
    'auth.enterCode': 'Enter the 6-digit code',
    'auth.codeExpires': 'Code expires in',
    'auth.invalidCode': 'Invalid verification code',
    'auth.accountCreated': 'Account created successfully!',
    'auth.welcomeTo': 'Welcome to',
  'auth.joinAs': 'Join as',
  'auth.fillDetails': 'Fill in your details to get started as',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.noAccount': "Don't have an account?",
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.minLength': 'Minimum length is {min} characters',
    'validation.maxLength': 'Maximum length is {max} characters',
    'validation.passwordMatch': 'Passwords do not match',
  'validation.phone': 'Please enter a valid phone number (at least 10 digits)',
  'validation.fullNameMin': 'Full name must be at least {min} characters',
    
    // Messages
    'message.loginSuccess': 'Login successful',
    'message.loginError': 'Login failed',
    'message.logoutSuccess': 'Logout successful',
    'message.saveSuccess': 'Saved successfully',
    'message.deleteSuccess': 'Deleted successfully',
    'message.updateSuccess': 'Updated successfully',
    'message.createSuccess': 'Created successfully',
  'message.createFailed': 'Failed to create resource',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'theme.toggle': 'Toggle theme',
    
    // Language
    'language.english': 'English',
    'language.vietnamese': 'Vietnamese',
    
    // Roles
    'role.admin': 'Administrator',
    'role.user': 'User',
    'role.staff': 'Staff',
    
    // Page titles
    'page.home': 'Home',
    'page.dashboard': 'Dashboard',
    'page.profile': 'Profile',
    'page.settings': 'Settings',
    'page.notFound': 'Page Not Found',
    
    // Example page
    'example.title': 'Welcome to RescueNet',
    'example.subtitle': 'Professional Next.js Application with Modern Stack',
    'example.description': 'This is a base project with consistent styling, dark/light mode, internationalization, and modular architecture.',
    'example.features': 'Features',
    'example.feature1': 'TypeScript & Next.js 15',
    'example.feature2': 'Dark/Light Mode',
    'example.feature3': 'Internationalization (EN/VI)',
    'example.feature4': 'Modular Architecture',
    'example.feature5': 'Consistent Design System',
    'example.feature6': 'Responsive Design',
  // Small feature labels used in auth hero
  'feature.quickResponse': 'Quick emergency response',
  'feature.realTimeUpdates': 'Real-time updates',
  'feature.support24': '24/7 support',
    
    // Emergency / SOS
    'sos.title': 'Emergency SOS',
    'sos.button': 'EMERGENCY SOS',
    'sos.tapToActivate': 'Tap to activate emergency',
    'sos.countdown': 'Sending in {seconds} seconds',
    'sos.cancelButton': 'CANCEL',
    'sos.sending': 'Sending SOS...',
    'sos.sendingLocation': 'Your location is being sent to the rescue team. Please keep your network and GPS on.',
    'sos.cancelConfirm': 'Are you sure you want to cancel the emergency request? This will deduct 1 SOS usage from your account.',
    'sos.cancelled': 'Emergency request cancelled. 1 SOS usage deducted.',
    'sos.sent': 'SOS Sent Successfully',
    'sos.failed': 'Failed to send SOS',
    'sos.imOkay': "I'm Okay",
    'sos.okayPenaltyNote': 'Clicking this will mark the emergency as resolved and deduct 1 SOS usage',
    'sos.okayConfirm': 'Confirm you are okay? This will deduct 1 SOS usage from your account.',
    'sos.okayCompleted': 'Great! Emergency marked as resolved. 1 SOS usage deducted.',
    'sos.etaLabel': 'Help arriving in',
    'sos.etaMinutes': '{minutes} minutes',
    'sos.statusPending': 'Waiting for confirmation',
    'sos.statusAssigned': 'Team assigned',
    'sos.statusOnRoute': 'Team on the way',
    'sos.statusArrived': 'Team arrived',
    'sos.statusCompleted': 'Emergency resolved',
    'sos.statusCancelled': 'Request cancelled',
    
    // Status descriptions
    'sos.statusPendingDesc': 'Processing your emergency request...',
    'sos.sendingDesc': 'Connecting to emergency services...',
    'sos.sentDesc': 'Emergency team has been notified',
    'sos.statusAssignedDesc': 'Response team assigned to your location',
    'sos.statusOnRouteDesc': 'Team is on the way to your location',
    'sos.statusArrivedDesc': 'Emergency team has arrived',
    'sos.statusCompletedDesc': 'Emergency situation resolved',
    'sos.statusCancelledDesc': 'Emergency request cancelled',
    'sos.failedDesc': 'Failed to send emergency request',
    
    // Media upload
    'sos.media': 'Photos/Videos',
    'sos.uploadMedia': 'Add Photo/Video',
    
    // Priority levels
    'priority.low': 'LOW PRIORITY',
    'priority.normal': 'NORMAL PRIORITY',
    'priority.high': 'HIGH PRIORITY',
    'priority.critical': 'CRITICAL',
    
    // Incident types
    'incident.medical': 'Medical Emergency',
    'incident.fire': 'Fire',
    'incident.flood': 'Flood',
    'incident.security': 'Security',
    'incident.accident': 'Accident',
    'incident.other': 'Other',
    'incident.selectType': 'Select emergency type',
    'incident.description': 'Description (optional)',
    'incident.addMedia': 'Add photo/video',
    
    // Verification
    'verify.level0': 'Anonymous (Low Priority)',
    'verify.level1': 'Phone Verified (Normal Priority)',
    'verify.level2': 'Full Account (High Priority)',
    'verify.upgradePrompt': 'Verify phone for faster response',
    'verify.benefits': 'Phone verification benefits:',
    'verify.benefit1': 'Higher priority (ETA reduced from 15 → 10 minutes)',
    'verify.benefit2': 'Increased SOS limit (2 → 5 times/day)',
    'verify.benefit3': 'Receive SMS updates on rescue status',
    'verify.phoneNumber': 'Phone Number',
    'verify.enterOtp': 'Enter 6-digit code',
    'verify.sendOtp': 'Send Code',
    'verify.verifying': 'Verifying...',
    'verify.success': 'Verified successfully',
    'verify.failed': 'Verification failed',
    'verify.captchaRequired': 'Complete CAPTCHA to continue',
    'verify.level': 'Verification Level',
    'verify.levelValue': 'Level {level}',
    
    // Rate limit
    'rateLimit.exceeded': 'Too many requests. Try again later.',
    'rateLimit.remaining': '{count} requests remaining',
    'rateLimit.cooldown': 'Available in {time}',
    'rateLimit.blocked': 'Temporarily blocked due to suspicious activity',
    
    // Location
    'location.getting': 'Getting your location...',
    'location.allow': 'Allow location access for emergency',
    'location.denied': 'Location access denied',
    'location.error': 'Failed to get location',
  // Incident helpers
  'incident.selectTypeTooltip': 'Select the type of emergency to help responders prepare appropriate resources and personnel.',
  'incident.descriptionPlaceholder': 'Describe the emergency situation (optional)...',
  'incident.example1': 'Example: "Person unconscious, not breathing" or "Heavy smoke from building"',
  'priority.createFullAccount': 'Create a full account for highest priority response',
    // Quick tips
    'tips.stayCalm': 'Stay calm and ensure your safety first',
    'tips.allowLocation': 'Allow location access for fastest response',
    'tips.keepPhone': 'Keep your phone accessible for updates',
    'tips.call113': 'Call 113 directly for life-threatening emergencies',
    'tips.title': 'Quick Tips',
    
    // Footer
    'footer.description': 'Professional emergency response platform serving communities 24/7',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.connect': 'Connect',
    'footer.followUs': 'Follow us for updates on emergency response protocols and community safety tips',
    'footer.copyright': '© {year} RescueNet. All rights reserved. Built with dedication to save lives.',
    'footer.certified': 'Certified Emergency Response Platform',
    'footer.version': 'Version 1.0.0',
    
    // SOS additional
    'sos.processingRequest': 'Your emergency request is being processed. Help is on the way.',
    'sos.pressButton': 'Press the emergency button below if you need immediate assistance. Our response team is available 24/7.',
    'sos.activationTitle': 'Emergency Activation',
    'sos.activationTooltip': 'Hold the button for 3 seconds to activate emergency SOS. Cancel anytime before sending.',
    'sos.holdButtonInstruction': 'Hold the button below for 3 seconds to send emergency alert',
    
    // Location additional
    'location.detected': 'Location detected',
    'location.detecting': 'Detecting location...',
    'location.yourLocation': 'Your Location',
    
    // Status card
    'status.label': 'Status',
    'status.yourStatus': 'Your Status',
    'status.priorityLevel': 'Priority Level',
    'status.estimatedResponse': 'Estimated Response',
    'status.dailyLimit': 'Daily Limit',
    'status.requests': 'requests',
    
    // Verification additional
    'verify.tooltipTitle': 'Verification Levels:',
    'verify.level0Short': 'Anonymous',
    'verify.level1Short': 'Phone Verified',
    'verify.level2Short': 'Full Account',
    'verify.level0Details': '2 requests/day, 15min ETA',
    'verify.level1Details': '5 requests/day, 10min ETA',
    'verify.level2Details': '20 requests/day, 5min ETA',
    'verify.upgradePriorityTitle': 'Upgrade Priority',
    'verify.enterCodeTitle': 'Enter Verification Code',
    'verify.codeSentTo': 'We sent a 6-digit code to {phone}',
    
    // Chat
    'chat.title': 'Emergency Chat',
    'chat.placeholder': 'Type a message...',
    'chat.send': 'Send',
    'chat.connected': 'Connected',
    'chat.disconnected': 'Disconnected',
    'chat.reconnecting': 'Reconnecting...',
    'chat.typingIndicator': '{user} is typing...',
    'chat.noMessages': 'No messages yet. Start the conversation!',
    'chat.guestName': 'Guest',
    'chat.connecting': 'Connecting...',
    'chat.sendHint': 'Press Enter to send, Shift+Enter for new line',
  },
  vi: {
    // Common
    'common.welcome': 'Chào mừng đến RescueNet',
    'common.home': 'Trang chủ',
    'common.about': 'Giới thiệu',
    'common.contact': 'Liên hệ khẩn cấp',
    'common.login': 'Đăng nhập',
    'common.logout': 'Đăng xuất',
    'common.register': 'Đăng ký',
    'common.submit': 'Gửi',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.search': 'Tìm kiếm',
    'common.loading': 'Đang tải...',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',
    'common.confirm': 'Xác nhận',
    'common.yes': 'Có',
    'common.no': 'Không',
    'common.emergency': 'Khẩn cấp',
    'common.urgent': 'Cấp bách',
    'common.callNow': 'Gọi ngay',
    'common.minutes': 'phút',
    
    // Navigation
    'nav.dashboard': 'Trung tâm điều hành',
    'nav.profile': 'Hồ sơ',
    'nav.settings': 'Cài đặt',
    'nav.users': 'Nhân viên',
    'nav.tasks': 'Nhiệm vụ cứu hộ',
    'nav.reports': 'Báo cáo sự cố',
    'nav.emergencies': 'Tình huống khẩn cấp',
    'nav.dispatch': 'Điều phối',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.confirmPassword': 'Xác nhận mật khẩu',
    'auth.forgotPassword': 'Quên mật khẩu?',
    'auth.rememberMe': 'Ghi nhớ đăng nhập',
    'auth.dontHaveAccount': 'Chưa có tài khoản?',
    'auth.alreadyHaveAccount': 'Đã có tài khoản?',
    'auth.signIn': 'Đăng nhập',
    'auth.signUp': 'Đăng ký',
    'auth.signOut': 'Đăng xuất',
    'auth.fullName': 'Họ và tên',
    'auth.phone': 'Số điện thoại',
    'auth.selectRole': 'Chọn vai trò',
    'auth.verificationCode': 'Mã xác thực',
    'auth.sendCode': 'Gửi mã',
    'auth.resendCode': 'Gửi lại mã',
    'auth.verify': 'Xác thực',
    'auth.backToLogin': 'Quay lại đăng nhập',
    'auth.registerAs': 'Đăng ký với tư cách',
    'auth.citizen': 'Công dân',
    'auth.volunteer': 'Tình nguyện viên',
    'auth.staff': 'Nhân viên cứu hộ',
    'auth.citizenDesc': 'Báo cáo khẩn cấp, yêu cầu hỗ trợ',
    'auth.volunteerDesc': 'Tham gia cứu hộ, giúp đỡ cộng đồng',
    'auth.staffDesc': 'Thành viên đội cứu hộ chuyên nghiệp',
    'auth.verifyEmail': 'Xác thực số điện thoại',
    'auth.codeSent': 'Mã xác thực đã được gửi đến SĐT của bạn',
    'auth.enterCode': 'Nhập mã 6 chữ số',
    'auth.codeExpires': 'Mã hết hạn sau',
    'auth.invalidCode': 'Mã xác thực không hợp lệ',
    'auth.accountCreated': 'Tạo tài khoản thành công!',
    'auth.welcomeTo': 'Chào mừng đến',
  'auth.joinAs': 'Đăng ký với tư cách',
  'auth.fillDetails': 'Điền thông tin để bắt đầu với vai trò',
    'auth.invalidCredentials': 'Email hoặc mật khẩu không đúng',
    'auth.noAccount': 'Chưa có tài khoản?',
    
    // Validation
    'validation.required': 'Trường này là bắt buộc',
    'validation.email': 'Vui lòng nhập email hợp lệ',
    'validation.minLength': 'Độ dài tối thiểu là {min} ký tự',
    'validation.maxLength': 'Độ dài tối đa là {max} ký tự',
    'validation.passwordMatch': 'Mật khẩu không khớp',
  'validation.phone': 'Vui lòng nhập số điện thoại hợp lệ (ít nhất 10 chữ số)',
  'validation.fullNameMin': 'Họ tên phải có ít nhất {min} ký tự',
    
    // Messages
    'message.loginSuccess': 'Đăng nhập thành công',
    'message.loginError': 'Đăng nhập thất bại',
    'message.logoutSuccess': 'Đăng xuất thành công',
    'message.saveSuccess': 'Lưu thành công',
    'message.deleteSuccess': 'Xóa thành công',
    'message.updateSuccess': 'Cập nhật thành công',
    'message.createSuccess': 'Tạo thành công',
  'message.createFailed': 'Tạo thất bại',
    
    // Theme
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
    'theme.system': 'Hệ thống',
    'theme.toggle': 'Chuyển đổi giao diện',
    
    // Language
    'language.english': 'Tiếng Anh',
    'language.vietnamese': 'Tiếng Việt',
    
    // Roles
    'role.admin': 'Quản trị viên',
    'role.user': 'Người dùng',
    'role.staff': 'Nhân viên',
    
    // Page titles
    'page.home': 'Trang chủ',
    'page.dashboard': 'Bảng điều khiển',
    'page.profile': 'Hồ sơ',
    'page.settings': 'Cài đặt',
    'page.notFound': 'Không tìm thấy trang',
    
    // Example page
    'example.title': 'Chào mừng đến với RescueNet',
    'example.subtitle': 'Ứng dụng Next.js chuyên nghiệp với công nghệ hiện đại',
    'example.description': 'Đây là dự án cơ sở với phong cách nhất quán, chế độ sáng/tối, đa ngôn ngữ và kiến trúc modular.',
    'example.features': 'Tính năng',
    'example.feature1': 'TypeScript & Next.js 15',
    'example.feature2': 'Chế độ Sáng/Tối',
    'example.feature3': 'Đa ngôn ngữ (EN/VI)',
    'example.feature4': 'Kiến trúc Modular',
    'example.feature5': 'Hệ thống thiết kế nhất quán',
    'example.feature6': 'Thiết kế responsive',
  // Small feature labels used in auth hero
  'feature.quickResponse': 'Phản hồi khẩn cấp nhanh chóng',
  'feature.realTimeUpdates': 'Cập nhật theo thời gian thực',
  'feature.support24': 'Hỗ trợ 24/7',
    
    // Emergency / SOS
    'sos.title': 'Cứu hộ khẩn cấp SOS',
    'sos.button': 'KHẨN CẤP SOS',
    'sos.tapToActivate': 'Chạm để kích hoạt khẩn cấp',
    'sos.countdown': 'Gửi sau {seconds} giây',
    'sos.cancelButton': 'HỦY',
    'sos.sending': 'Đang gửi SOS...',
    'sos.sendingLocation': 'Vị trí của bạn đang được gửi đến đội cứu hộ. Vui lòng giữ kết nối mạng và GPS.',
    'sos.cancelConfirm': 'Bạn có chắc muốn hủy yêu cầu khẩn cấp? Điều này sẽ trừ 1 lần sử dụng SOS của bạn.',
    'sos.cancelled': 'Yêu cầu khẩn cấp đã bị hủy. Đã trừ 1 lần sử dụng SOS.',
    'sos.sent': 'Đã gửi SOS thành công',
    'sos.failed': 'Gửi SOS thất bại',
    'sos.imOkay': 'Tôi ổn rồi',
    'sos.okayPenaltyNote': 'Nhấn nút này sẽ đánh dấu khẩn cấp đã giải quyết và trừ 1 lần sử dụng SOS',
    'sos.okayConfirm': 'Xác nhận bạn đã ổn? Hành động này sẽ trừ 1 lần sử dụng SOS của bạn.',
    'sos.okayCompleted': 'Tuyệt vời! Đã đánh dấu khẩn cấp hoàn tất. Đã trừ 1 lần sử dụng SOS.',
    'sos.etaLabel': 'Cứu hộ sẽ đến trong',
    'sos.etaMinutes': '{minutes} phút',
    'sos.statusPending': 'Đang chờ xác nhận',
    'sos.statusAssigned': 'Đã phân công đội',
    'sos.statusOnRoute': 'Đội đang trên đường',
    'sos.statusArrived': 'Đội đã đến',
    'sos.statusCompleted': 'Đã xử lý xong',
    'sos.statusCancelled': 'Đã hủy yêu cầu',
    
    // Status descriptions
    'sos.statusPendingDesc': 'Đang xử lý yêu cầu khẩn cấp của bạn...',
    'sos.sendingDesc': 'Đang kết nối tới dịch vụ khẩn cấp...',
    'sos.sentDesc': 'Đội cứu hộ đã được thông báo',
    'sos.statusAssignedDesc': 'Đội ứng phó đã được phân công đến vị trí của bạn',
    'sos.statusOnRouteDesc': 'Đội đang trên đường đến vị trí của bạn',
    'sos.statusArrivedDesc': 'Đội cứu hộ đã đến',
    'sos.statusCompletedDesc': 'Tình huống khẩn cấp đã được xử lý',
    'sos.statusCancelledDesc': 'Yêu cầu khẩn cấp đã bị hủy',
    'sos.failedDesc': 'Gửi yêu cầu khẩn cấp thất bại',
    
    // Emergency Form
    'sos.formTitle': 'Chi tiết khẩn cấp',
    'sos.formDescription': 'Vui lòng cung cấp chi tiết để giúp dịch vụ khẩn cấp phản ứng hiệu quả',
    'sos.incidentType': 'Loại khẩn cấp',
    'sos.description': 'Mô tả',
    'sos.descriptionPlaceholder': 'Mô tả tình huống...',
    'sos.media': 'Ảnh/Video',
    'sos.uploadMedia': 'Thêm ảnh/video',
    
    // Priority levels
    'priority.low': 'ƯU TIÊN THẤP',
    'priority.normal': 'ƯU TIÊN BÌNH THƯỜNG',
    'priority.high': 'ƯU TIÊN CAO',
    'priority.critical': 'NGUY CẤP',
    
    // Incident types
    'incident.medical': 'Cấp cứu y tế',
    'incident.fire': 'Hỏa hoạn',
    'incident.flood': 'Lũ lụt',
    'incident.security': 'An ninh',
    'incident.accident': 'Tai nạn',
    'incident.other': 'Khác',
    'incident.selectType': 'Chọn loại khẩn cấp',
    'incident.description': 'Mô tả (không bắt buộc)',
    'incident.addMedia': 'Thêm ảnh/video',
    
    // Verification
    'verify.level0': 'Ẩn danh (Ưu tiên thấp)',
    'verify.level1': 'Đã xác thực SĐT (Ưu tiên bình thường)',
    'verify.level2': 'Tài khoản đầy đủ (Ưu tiên cao)',
    'verify.upgradePrompt': 'Xác thực SĐT để được hỗ trợ nhanh hơn',
    'verify.benefits': 'Lợi ích khi xác minh SĐT:',
    'verify.benefit1': 'Ưu tiên cao hơn (ETA giảm từ 15 → 10 phút)',
    'verify.benefit2': 'Tăng giới hạn SOS (2 → 5 lần/ngày)',
    'verify.benefit3': 'Nhận thông báo SMS về trạng thái cứu hộ',
    'verify.phoneNumber': 'Số điện thoại',
    'verify.enterOtp': 'Nhập mã 6 chữ số',
    'verify.sendOtp': 'Gửi mã',
    'verify.verifying': 'Đang xác thực...',
    'verify.success': 'Xác thực thành công',
    'verify.failed': 'Xác thực thất bại',
    'verify.captchaRequired': 'Hoàn thành CAPTCHA để tiếp tục',
    'verify.level': 'Mức độ xác thực',
    'verify.levelValue': 'Mức {level}',
    
    // Rate limit
    'rateLimit.exceeded': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
    'rateLimit.remaining': 'Còn {count} lượt yêu cầu',
    'rateLimit.cooldown': 'Có thể sử dụng sau {time}',
    'rateLimit.blocked': 'Tạm thời bị chặn do hoạt động đáng ngờ',
    
    // Location
    'location.getting': 'Đang lấy vị trí của bạn...',
    'location.allow': 'Cho phép truy cập vị trí để cứu hộ',
    'location.denied': 'Bị từ chối truy cập vị trí',
    'location.error': 'Không thể lấy vị trí',
  // Incident helpers
  'incident.selectTypeTooltip': 'Chọn loại khẩn cấp để người ứng cứu chuẩn bị nguồn lực phù hợp.',
  'incident.descriptionPlaceholder': 'Mô tả tình huống khẩn cấp (không bắt buộc)...',
  'incident.example1': 'Ví dụ: "Người bất tỉnh, không thở" hoặc "Khói dày từ tòa nhà"',
  'priority.createFullAccount': 'Tạo tài khoản đầy đủ để được ưu tiên cao nhất',
    // Quick tips
    'tips.stayCalm': 'Giữ bình tĩnh và đảm bảo an toàn cho bản thân trước',
    'tips.allowLocation': 'Cho phép truy cập vị trí để nhận hỗ trợ nhanh nhất',
    'tips.keepPhone': 'Giữ điện thoại trong tầm tay để nhận cập nhật',
    'tips.call113': 'Gọi 113 trực tiếp trong trường hợp đe dọa tính mạng',
    'tips.title': 'Mẹo hữu ích',
    
    // Footer
    'footer.description': 'Nền tảng ứng phó khẩn cấp chuyên nghiệp phục vụ cộng đồng 24/7',
    'footer.support': 'Hỗ trợ',
    'footer.legal': 'Pháp lý',
    'footer.connect': 'Kết nối',
    'footer.followUs': 'Theo dõi chúng tôi để cập nhật các quy trình ứng phó khẩn cấp và mẹo an toàn cộng đồng',
    'footer.copyright': '© {year} RescueNet. Bản quyền đã được bảo hộ. Xây dựng với sứ mệnh cứu người.',
    'footer.certified': 'Nền tảng ứng phó khẩn cấp được chứng nhận',
    'footer.version': 'Phiên bản 1.0.0',
    
    // SOS additional
    'sos.processingRequest': 'Yêu cầu khẩn cấp của bạn đang được xử lý. Đội cứu hộ đang trên đường đến.',
    'sos.pressButton': 'Nhấn nút khẩn cấp bên dưới nếu bạn cần hỗ trợ ngay lập tức. Đội ứng phó của chúng tôi luôn sẵn sàng 24/7.',
    'sos.activationTitle': 'Kích hoạt khẩn cấp',
    'sos.activationTooltip': 'Giữ nút trong 3 giây để kích hoạt SOS khẩn cấp. Có thể hủy bất cứ lúc nào trước khi gửi.',
    'sos.holdButtonInstruction': 'Giữ nút bên dưới trong 3 giây để gửi cảnh báo khẩn cấp',
    
    // Location additional
    'location.detected': 'Đã phát hiện vị trí',
    'location.detecting': 'Đang phát hiện vị trí...',
    'location.yourLocation': 'Vị trí của bạn',
    
    // Status card
    'status.label': 'Trạng thái',
    'status.yourStatus': 'Trạng thái của bạn',
    'status.priorityLevel': 'Mức độ ưu tiên',
    'status.estimatedResponse': 'Thời gian phản hồi ước tính',
    'status.dailyLimit': 'Giới hạn hàng ngày',
    'status.requests': 'yêu cầu',
    
    // Verification additional
    'verify.tooltipTitle': 'Các cấp độ xác thực:',
    'verify.level0Short': 'Ẩn danh',
    'verify.level1Short': 'Đã xác thực SĐT',
    'verify.level2Short': 'Tài khoản đầy đủ',
    'verify.level0Details': '2 yêu cầu/ngày, ETA 15 phút',
    'verify.level1Details': '5 yêu cầu/ngày, ETA 10 phút',
    'verify.level2Details': '20 yêu cầu/ngày, ETA 5 phút',
    'verify.upgradePriorityTitle': 'Nâng cấp ưu tiên',
    'verify.enterCodeTitle': 'Nhập mã xác thực',
    'verify.codeSentTo': 'Chúng tôi đã gửi mã 6 chữ số đến {phone}',
    
    // Chat
    'chat.title': 'Chat khẩn cấp',
    'chat.placeholder': 'Nhập tin nhắn...',
    'chat.send': 'Gửi',
    'chat.connected': 'Đã kết nối',
    'chat.disconnected': 'Mất kết nối',
    'chat.reconnecting': 'Đang kết nối lại...',
    'chat.typingIndicator': '{user} đang nhập...',
    'chat.noMessages': 'Chưa có tin nhắn. Bắt đầu cuộc trò chuyện!',
    'chat.guestName': 'Khách',
    'chat.connecting': 'Đang kết nối...',
    'chat.sendHint': 'Nhấn Enter để gửi, Shift+Enter để xuống dòng',
  },
};

export function translate(key: string, language: Language = 'en', params?: Record<string, string | number>): string {
  let text = translations[language][key as keyof typeof translations['en']] || key;
  
  // Replace parameters in translation
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }
  
  return text;
}

export function getLanguageLabel(language: Language): string {
  const labels = {
    en: 'English',
    vi: 'Tiếng Việt',
  };
  return labels[language];
}
