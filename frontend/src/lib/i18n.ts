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
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.noAccount': "Don't have an account?",
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.minLength': 'Minimum length is {min} characters',
    'validation.maxLength': 'Maximum length is {max} characters',
    'validation.passwordMatch': 'Passwords do not match',
    
    // Messages
    'message.loginSuccess': 'Login successful',
    'message.loginError': 'Login failed',
    'message.logoutSuccess': 'Logout successful',
    'message.saveSuccess': 'Saved successfully',
    'message.deleteSuccess': 'Deleted successfully',
    'message.updateSuccess': 'Updated successfully',
    'message.createSuccess': 'Created successfully',
    
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
    'auth.invalidCredentials': 'Email hoặc mật khẩu không đúng',
    'auth.noAccount': 'Chưa có tài khoản?',
    
    // Validation
    'validation.required': 'Trường này là bắt buộc',
    'validation.email': 'Vui lòng nhập email hợp lệ',
    'validation.minLength': 'Độ dài tối thiểu là {min} ký tự',
    'validation.maxLength': 'Độ dài tối đa là {max} ký tự',
    'validation.passwordMatch': 'Mật khẩu không khớp',
    
    // Messages
    'message.loginSuccess': 'Đăng nhập thành công',
    'message.loginError': 'Đăng nhập thất bại',
    'message.logoutSuccess': 'Đăng xuất thành công',
    'message.saveSuccess': 'Lưu thành công',
    'message.deleteSuccess': 'Xóa thành công',
    'message.updateSuccess': 'Cập nhật thành công',
    'message.createSuccess': 'Tạo thành công',
    
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
