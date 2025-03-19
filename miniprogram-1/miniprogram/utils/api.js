// API基础URL
const BASE_URL = 'http://localhost:3000'; // 本地开发服务器地址

/**
 * 获取城市天气数据
 * @param {string} city - 城市名称
 * @returns {Promise} 返回Promise对象，包含天气数据
 */
function getWeather(city) {
  console.log('正在请求天气数据，城市:', city);
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/weather`,
      method: 'POST',
      data: { city },
      header: {
        'content-type': 'application/json' // 确保设置了正确的内容类型
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('天气数据获取成功:', res.data);
          resolve(res.data);
        } else {
          console.error('天气请求失败:', res);
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('天气请求错误:', err);
        reject(err);
      }
    });
  });
}

/**
 * 生成OOTD推荐
 * @param {Object} params - 包含城市、性别、描述、风格以及天气数据的对象
 * @returns {Promise} 返回Promise对象，包含OOTD推荐
 */
function generateOOTD(params) {
  console.log('正在生成OOTD推荐，参数:', params);
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/generate-ootd`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('OOTD推荐生成成功:', res.data);
          resolve(res.data);
        } else {
          console.error('OOTD推荐生成失败:', res);
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('OOTD推荐生成错误:', err);
        reject(err);
      }
    });
  });
}

module.exports = {
  getWeather,
  generateOOTD
}; 