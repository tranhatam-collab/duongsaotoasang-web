#!/usr/bin/env node

/**
 * Auto-fix English words to Vietnamese
 * 
 * Mapping các từ tiếng Anh phổ biến sang tiếng Việt
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Mapping từ tiếng Anh sang tiếng Việt (UI/UX terms phổ biến nhất)
const WORD_MAPPING = {
  // UI/UX terms
  'Contact': 'Liên hệ',
  'contact': 'liên hệ',
  'Payment': 'Thanh toán',
  'payment': 'thanh toán',
  'Dashboard': 'Bảng điều khiển',
  'dashboard': 'bảng điều khiển',
  'Profile': 'Hồ sơ',
  'profile': 'hồ sơ',
  'Member': 'Thành viên',
  'member': 'thành viên',
  'Admin': 'Quản trị viên',
  'admin': 'quản trị viên',
  'Settings': 'Cài đặt',
  'settings': 'cài đặt',
  'Support': 'Hỗ trợ',
  'support': 'hỗ trợ',
  'website': 'trang web',
  'Website': 'Trang web',
  'show': 'hiển thị',
  'Show': 'Hiển thị',
  'read': 'đọc',
  'Read': 'Đọc',
  'upload': 'tải lên',
  'Upload': 'Tải lên',
  'share': 'chia sẻ',
  'Share': 'Chia sẻ',
  'success': 'thành công',
  'Success': 'Thành công',
  'Home': 'Trang chủ',
  'home': 'trang chủ',
  'About': 'Giới thiệu',
  'about': 'giới thiệu',
  'Login': 'Đăng nhập',
  'login': 'đăng nhập',
  'Logout': 'Đăng xuất',
  'logout': 'đăng xuất',
  'Register': 'Đăng ký',
  'register': 'đăng ký',
  'Submit': 'Gửi',
  'submit': 'gửi',
  'Cancel': 'Hủy',
  'cancel': 'hủy',
  'Save': 'Lưu',
  'save': 'lưu',
  'Delete': 'Xóa',
  'delete': 'xóa',
  'Edit': 'Chỉnh sửa',
  'edit': 'chỉnh sửa',
  'Create': 'Tạo',
  'create': 'tạo',
  'Update': 'Cập nhật',
  'update': 'cập nhật',
  'View': 'Xem',
  'view': 'xem',
  'Search': 'Tìm kiếm',
  'search': 'tìm kiếm',
  'Filter': 'Lọc',
  'filter': 'lọc',
  'Sort': 'Sắp xếp',
  'sort': 'sắp xếp',
  'Next': 'Tiếp',
  'next': 'tiếp',
  'Previous': 'Trước',
  'previous': 'trước',
  'Back': 'Quay lại',
  'back': 'quay lại',
  'Close': 'Đóng',
  'close': 'đóng',
  'Open': 'Mở',
  'open': 'mở',
  'Yes': 'Có',
  'yes': 'có',
  'No': 'Không',
  'no': 'không',
  'Confirm': 'Xác nhận',
  'confirm': 'xác nhận',
  'Loading': 'Đang tải',
  'loading': 'đang tải',
  'Application': 'Ứng dụng',
  'application': 'ứng dụng',
  'Account': 'Tài khoản',
  'account': 'tài khoản',
  'Email': 'Email',
  'email': 'email',
  'Phone': 'Số điện thoại',
  'phone': 'số điện thoại',
  'Address': 'Địa chỉ',
  'address': 'địa chỉ',
  'Name': 'Tên',
  'name': 'tên',
  'Title': 'Tiêu đề',
  'title': 'tiêu đề',
  'Description': 'Mô tả',
  'description': 'mô tả',
  'Content': 'Nội dung',
  'content': 'nội dung',
  'Message': 'Tin nhắn',
  'message': 'tin nhắn',
  'Notification': 'Thông báo',
  'notification': 'thông báo',
  'Button': 'Nút',
  'button': 'nút',
  'Link': 'Liên kết',
  'link': 'liên kết',
  'Image': 'Hình ảnh',
  'image': 'hình ảnh',
  'Video': 'Video',
  'video': 'video',
  'File': 'Tệp',
  'file': 'tệp',
  'Document': 'Tài liệu',
  'document': 'tài liệu',
  'Folder': 'Thư mục',
  'folder': 'thư mục',
  'Session': 'Phiên',
  'session': 'phiên',
  'Network': 'Mạng',
  'network': 'mạng',
  'Database': 'Cơ sở dữ liệu',
  'database': 'cơ sở dữ liệu',
  'Server': 'Máy chủ',
  'server': 'máy chủ',
  'Client': 'Khách hàng',
  'client': 'khách hàng',
  'User': 'Người dùng',
  'user': 'người dùng',
  'Customer': 'Khách hàng',
  'customer': 'khách hàng',
  'Tracking': 'Theo dõi',
  'tracking': 'theo dõi',
  'Performance': 'Hiệu suất',
  'performance': 'hiệu suất',
  'Analytics': 'Phân tích',
  'analytics': 'phân tích',
  'Statistics': 'Thống kê',
  'statistics': 'thống kê',
  'Report': 'Báo cáo',
  'report': 'báo cáo',
  'History': 'Lịch sử',
  'history': 'lịch sử',
  'Status': 'Trạng thái',
  'status': 'trạng thái',
  'Placeholder': 'Giữ chỗ',
  'placeholder': 'giữ chỗ',
  'Data': 'Dữ liệu',
  'data': 'dữ liệu',
  'Information': 'Thông tin',
  'information': 'thông tin',
  'Permission': 'Quyền',
  'permission': 'quyền',
  'Access': 'Truy cập',
  'access': 'truy cập',
  'Authentication': 'Xác thực',
  'authentication': 'xác thực',
  'Authorization': 'Ủy quyền',
  'authorization': 'ủy quyền',
  'Password': 'Mật khẩu',
  'password': 'mật khẩu',
  'Username': 'Tên người dùng',
  'username': 'tên người dùng',
  'App': 'Ứng dụng',
  'app': 'ứng dụng',
  'Mobile': 'Di động',
  'mobile': 'di động',
  'Desktop': 'Máy tính',
  'desktop': 'máy tính',
  'Web': 'Web',
  'web': 'web',
  'Site': 'Trang',
  'site': 'trang',
  'Page': 'Trang',
  'page': 'trang',
  'Navigation': 'Điều hướng',
  'navigation': 'điều hướng',
  'Menu': 'Menu',
  'menu': 'menu',
  'Sidebar': 'Thanh bên',
  'sidebar': 'thanh bên',
  'Header': 'Đầu trang',
  'header': 'đầu trang',
  'Footer': 'Chân trang',
  'footer': 'chân trang',
  'Section': 'Phần',
  'section': 'phần',
  'Panel': 'Bảng',
  'panel': 'bảng',
  'Card': 'Thẻ',
  'card': 'thẻ',
  'List': 'Danh sách',
  'list': 'danh sách',
  'Table': 'Bảng',
  'table': 'bảng',
  'Grid': 'Lưới',
  'grid': 'lưới',
  'Form': 'Biểu mẫu',
  'form': 'biểu mẫu',
  'Input': 'Đầu vào',
  'input': 'đầu vào',
  'Field': 'Trường',
  'field': 'trường',
  'Label': 'Nhãn',
  'label': 'nhãn',
  'Value': 'Giá trị',
  'value': 'giá trị',
  'Tab': 'Tab',
  'tab': 'tab',
  'Modal': 'Hộp thoại',
  'modal': 'hộp thoại',
  'Dialog': 'Hộp thoại',
  'dialog': 'hộp thoại',
  'Popup': 'Hộp bật lên',
  'popup': 'hộp bật lên',
  'Window': 'Cửa sổ',
  'window': 'cửa sổ',
  'Toast': 'Thông báo nổi',
  'toast': 'thông báo nổi',
  'Tooltip': 'Gợi ý công cụ',
  'tooltip': 'gợi ý công cụ',
  'VND': 'VNĐ',
  'CAN': 'CÓ THỂ',
  'NEW': 'MỚI',
  'ONE': 'MỘT',
  'Path': 'Đường dẫn',
  'path': 'đường dẫn',
  'Slug': 'Slug',
  'slug': 'slug',
  'Query': 'Truy vấn',
  'query': 'truy vấn',
  'URL': 'URL',
  'url': 'url',
  'ID': 'ID',
  'id': 'id',
  'Tax': 'Thuế',
  'tax': 'thuế',
  'Event': 'Sự kiện',
  'event': 'sự kiện',
  // Additional terms
  'roadmap': 'lộ trình',
  'Roadmap': 'Lộ trình',
  'calendar': 'lịch',
  'Calendar': 'Lịch',
  'timeline': 'dòng thời gian',
  'Timeline': 'Dòng thời gian',
  'video': 'video',
  'Video': 'Video',
  'audio': 'âm thanh',
  'Audio': 'Âm thanh',
  'format': 'định dạng',
  'Format': 'Định dạng',
  'country': 'quốc gia',
  'Country': 'Quốc gia',
  'region': 'vùng',
  'Region': 'Vùng',
  'directory': 'thư mục',
  'Directory': 'Thư mục',
  'forward': 'tiến',
  'Forward': 'Tiến',
  'delivery': 'giao hàng',
  'Delivery': 'Giao hàng',
  'target': 'mục tiêu',
  'Target': 'Mục tiêu',
  'strategy': 'chiến lược',
  'Strategy': 'Chiến lược',
  'signup': 'đăng ký',
  'Signup': 'Đăng ký',
  'download': 'tải xuống',
  'Download': 'Tải xuống',
  'canonical': 'chuẩn',
  'Canonical': 'Chuẩn',
  // Fix remaining violations
  'about': 'về',
  'About': 'Về',
  'website': 'trang web', // Fix remaining
  'Website': 'Trang web',
  'Contact': 'Liên hệ', // Fix remaining
  'contact': 'liên hệ',
  'Admin': 'Quản trị viên', // Fix remaining
  'admin': 'quản trị viên',
  'video': 'video', // Keep as video (technical term)
  'Video': 'Video'  // Keep as Video (technical term)
};

function isEnglishFile(filePath) {
  return filePath.includes('/en/') || filePath.includes('\\en\\');
}

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    // Skip English files
    if (isEnglishFile(filePath)) {
      return { skipped: true, reason: 'English file' };
    }
    
    // Skip _footer.html (special case)
    if (filePath.includes('_footer.html')) {
      return { skipped: true, reason: 'Footer template file' };
    }
    
    let originalContent = content;
    let replacements = 0;
    
    // Save script and style tags to restore later
    const scriptStyleMatches = [];
    content = content.replace(/(<script[^>]*>[\s\S]*?<\/script>|<style[^>]*>[\s\S]*?<\/style>)/gi, (match) => {
      scriptStyleMatches.push(match);
      return `__SCRIPT_STYLE_${scriptStyleMatches.length - 1}__`;
    });
    
    // Replace each word in mapping - only in text content
    for (const [english, vietnamese] of Object.entries(WORD_MAPPING)) {
      // Split by HTML tags, only replace text between tags
      const parts = content.split(/(<[^>]*>)/g);
      
      for (let i = 0; i < parts.length; i++) {
        // Only process text content (odd indices are tags, even are text)
        if (i % 2 === 0) {
          // Skip email addresses (e.g., contact@domain.com)
          if (parts[i].includes('@')) {
            continue;
          }
          
          const regex = new RegExp(`\\b${english}\\b`, 'gi');
          const matches = parts[i].match(regex);
          if (matches) {
            replacements += matches.length;
            parts[i] = parts[i].replace(regex, vietnamese);
          }
        }
      }
      
      content = parts.join('');
    }
    
    // Restore script and style tags
    content = content.replace(/__SCRIPT_STYLE_(\d+)__/g, (match, index) => {
      return scriptStyleMatches[parseInt(index)];
    });
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return { fixed: true, replacements };
    }
    
    return { fixed: false, replacements: 0 };
  } catch (error) {
    return { error: error.message };
  }
}

function getAllHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .git, .claude/worktrees, etc.
      if (!['node_modules', '.git', '.wrangler', 'functions', 'scripts', 'assets', '.claude'].includes(entry.name)) {
        getAllHtmlFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Skip .claude/worktrees files
      if (!fullPath.includes('.claude/worktrees')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function main() {
  console.log('🔧 Auto-fix English words to Vietnamese\n');
  
  const htmlFiles = getAllHtmlFiles(ROOT_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files\n`);
  
  const results = [];
  let totalFixed = 0;
  let totalReplacements = 0;
  let skippedFiles = 0;
  let errorFiles = 0;
  
  for (const file of htmlFiles) {
    const result = fixFile(file);
    
    if (result.skipped) {
      skippedFiles++;
      continue;
    }
    
    if (result.error) {
      errorFiles++;
      console.error(`❌ Error fixing ${file}: ${result.error}`);
      continue;
    }
    
    if (result.fixed) {
      totalFixed++;
      totalReplacements += result.replacements;
      results.push({
        file: file.replace(ROOT_DIR, ''),
        replacements: result.replacements
      });
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${htmlFiles.length}`);
  console.log(`   Skipped (English): ${skippedFiles}`);
  console.log(`   Errors: ${errorFiles}`);
  console.log(`   Files fixed: ${totalFixed}`);
  console.log(`   Total replacements: ${totalReplacements}\n`);
  
  if (results.length > 0) {
    console.log('✅ FIXED FILES:\n');
    
    for (const result of results) {
      console.log(`📄 ${result.file}`);
      console.log(`   Replacements: ${result.replacements}`);
    }
    
    console.log(`\n✅ Successfully fixed ${totalFixed} files with ${totalReplacements} replacements\n`);
  } else {
    console.log('ℹ️  No files needed fixing\n');
  }
}

main();
