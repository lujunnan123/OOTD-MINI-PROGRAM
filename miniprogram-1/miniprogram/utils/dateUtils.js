/**
 * 获取当前日期和7天后的日期（年-月-日格式）
 * @returns {Object} 包含当前日期和7天后日期的对象
 */
function getDateAndNextWeek() {
  // 获取当前日期
  const today = new Date();
  
  // 计算7天后的日期
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  // 格式化日期为YYYY-MM-DD格式
  function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  // 返回结果对象
  return {
    today: formatDateToYMD(today),
    nextWeek: formatDateToYMD(nextWeek),
    todayObj: today,
    nextWeekObj: nextWeek
  };
}

module.exports = {
  getDateAndNextWeek
}; 