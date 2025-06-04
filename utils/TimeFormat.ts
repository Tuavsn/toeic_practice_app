export const convertToVietnamTime = (timestamp: number | string, format: 'short' | 'medium' | 'full' = 'medium'): string => {
  // Timestamp được đổi từ giây sang milli giây
  if (typeof timestamp === 'string') {
    timestamp = Number.parseInt(timestamp);
  }
  const date = new Date(timestamp * 1000);
  
  // Kiểm tra xem timestamp có hợp lệ không
  if (isNaN(date.getTime())) {
    return 'Timestamp không hợp lệ';
  }

  try {
    // Múi giờ Việt Nam là UTC+7
    const vietnamTimeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh'
    };
    
    // Thêm các tùy chọn định dạng dựa trên loại format được chọn
    switch (format) {
      case 'short':
        Object.assign(vietnamTimeOptions, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        break;
      case 'full':
        Object.assign(vietnamTimeOptions, {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        break;
      case 'medium':
      default:
        Object.assign(vietnamTimeOptions, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        break;
    }
    
    // Sử dụng Intl.DateTimeFormat để định dạng theo múi giờ Việt Nam
    return new Intl.DateTimeFormat('vi-VN', vietnamTimeOptions).format(date);
  } catch (error) {
    console.error('Lỗi khi định dạng thời gian:', error);
    
    // Phương pháp thủ công nếu Intl không hoạt động
    // Thêm 7 giờ vào thời gian UTC để có giờ Việt Nam
    const vietnamHours = date.getUTCHours() + 7;
    date.setUTCHours(vietnamHours);
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    switch (format) {
      case 'short':
        return `${day}/${month}/${year.toString().slice(-2)} ${hours}:${minutes}`;
      case 'full':
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      case 'medium':
      default:
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  }
};