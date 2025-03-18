// API基础URL
const BASE_URL = 'http://localhost:3000';

/**
 * 获取城市天气数据
 * @param {string} city - 城市名称
 * @returns {Promise} 返回Promise对象，包含天气数据
 */
function getWeather(city) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/weather`,
      method: 'POST',
      data: { city },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
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
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/generate-ootd`,
      method: 'POST',
      data: params,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  getWeather,
  generateOOTD
}; 