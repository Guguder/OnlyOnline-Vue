export function formatTimeAgo(date) {
  const now = new Date();
  const timestamp = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
  const diff = now.getTime() - timestamp;

  // 转换为秒
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) {
    return '刚刚';
  }
  
  // 转换为分钟
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  
  // 转换为小时
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }
  
  // 转换为天
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }
  
  // 转换为月
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}个月前`;
  }
  
  // 转换为年
  const years = Math.floor(months / 12);
  return `${years}年前`;
}
