export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0'; // 确保 num 是数字
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function formatPercent(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0%'; // 确保 num 是数字
  return num.toFixed(1).replace(/\.0$/, '') + '%';
}
