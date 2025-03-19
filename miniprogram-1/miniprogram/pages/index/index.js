const app = getApp();
const api = require('../../utils/api.js');
const dateUtils = require('../../utils/dateUtils.js');

Page({
  data: {
    city: '杭州', // 默认城市
    todayWeather: {}, // 今日天气数据
    weekWeather: [], // 一周天气数据
    loadingToday: true, // 今日天气加载状态
    loadingForecast: true, // 预报天气加载状态
    styleOptions: [
      { name: '休闲风' },
      { name: '正式风' },
      { name: '运动风' },
      { name: '可爱风' },
      { name: '复古风' },
      { name: '街头风' }
    ],
    selectedStyle: '休闲风', // 默认选中的风格
    showOOTDPopup: false, // 是否显示OOTD弹窗
    generatedOutfits: [], // 生成的穿搭图片
    stylistAdvice: '', // 穿搭建议
    adviceTags: [], // 穿搭标签
    loadingOOTD: false, // OOTD加载状态
    userInfo: {
      gender: '女', // 默认性别
      description: '我是一名大学生，喜欢看书和音乐' // 默认描述
    }
  },

  onLoad: function() {
    this.fetchWeatherData();
  },

  // 获取天气数据
  fetchWeatherData: function() {
    this.setData({
      loadingToday: true,
      loadingForecast: true
    });

    api.getWeather(this.data.city)
      .then(weatherData => {
        console.log('获取到的天气数据:', weatherData);
        
        if (weatherData && weatherData.length > 0) {
          // 处理今日天气
          const today = weatherData[0];
          const todayWeather = {
            temp: Math.round((today.temp_high + today.temp_low) / 2), // 平均温度
            feelTemp: Math.round((today.temp_high + today.temp_low) / 2), // 体感温度，这里简化处理
            desc: today.weather_day,
            icon: this.getWeatherIcon(today.weather_day),
            windLevel: today.wind_level_day,
            humidity: today.humidity,
            condition: today.condition
          };
          
          // 处理一周天气
          const weekWeather = weatherData.map((day, index) => {
            return {
              day: index === 0 ? '今天' : dateUtils.formatDay(day.predict_date),
              icon: this.getWeatherIcon(day.weather_day),
              maxTemp: day.temp_high,
              minTemp: day.temp_low
            };
          });
          
          this.setData({
            todayWeather,
            weekWeather,
            loadingToday: false,
            loadingForecast: false
          });
        }
      })
      .catch(error => {
        console.error('获取天气数据失败:', error);
        wx.showToast({
          title: '获取天气数据失败',
          icon: 'none'
        });
        this.setData({
          loadingToday: false,
          loadingForecast: false
        });
      });
  },

  // 根据天气描述获取对应的图标
  getWeatherIcon: function(weather) {
    const icons = {
      '晴': '☀️',
      '多云': '⛅',
      '阴': '☁️',
      '小雨': '🌧️',
      '中雨': '🌧️',
      '大雨': '🌧️',
      '暴雨': '⛈️',
      '雷阵雨': '⛈️',
      '小雪': '❄️',
      '中雪': '❄️',
      '大雪': '❄️',
      '雾': '🌫️',
      '霾': '🌫️'
    };
    return icons[weather] || '🌈';
  },

  // 选择穿搭风格
  selectStyle: function(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      selectedStyle: style
    });
  },

  // 生成OOTD
  generateOOTD: function() {
    if (!this.data.todayWeather.condition) {
      wx.showToast({
        title: '请等待天气数据加载完成',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showOOTDPopup: true,
      loadingOOTD: true,
      generatedOutfits: [],
      stylistAdvice: ''
    });

    // 准备请求参数
    const params = {
      city: this.data.city,
      gender: this.data.userInfo.gender,
      description: this.data.userInfo.description,
      selectedStyle: this.data.selectedStyle,
      weather: {
        condition: this.data.todayWeather.condition,
        humidity: this.data.todayWeather.humidity,
        predict_date: dateUtils.formatDate(new Date()),
        temp_high: this.data.todayWeather.temp + 2, // 估算最高温度
        temp_low: this.data.todayWeather.temp - 2, // 估算最低温度
        weather_day: this.data.todayWeather.desc,
        wind_dir_day: "未知",
        wind_dir_night: "未知",
        wind_level_day: this.data.todayWeather.windLevel,
        wind_level_night: this.data.todayWeather.windLevel
      }
    };

    // 调用API生成OOTD
    api.generateOOTD(params)
      .then(result => {
        console.log('OOTD生成结果:', result);
        
        if (result) {
          // 提取标签
          const tags = this.extractTags(result.advice);
          
          this.setData({
            generatedOutfits: result.output || [],
            stylistAdvice: result.advice || '根据今天的天气，建议您...',
            adviceTags: tags,
            loadingOOTD: false
          });
        }
      })
      .catch(error => {
        console.error('生成OOTD失败:', error);
        wx.showToast({
          title: '生成穿搭推荐失败',
          icon: 'none'
        });
        this.setData({
          loadingOOTD: false
        });
      });
  },

  // 从建议文本中提取标签
  extractTags: function(advice) {
    if (!advice) return [];
    
    // 简单的标签提取逻辑，可以根据实际需求调整
    const keywords = ['休闲', '正式', '运动', '可爱', '复古', '街头', '温暖', '清凉', '舒适', '防晒', '防风', '防雨'];
    const tags = [];
    
    keywords.forEach(keyword => {
      if (advice.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // 添加天气相关标签
    if (this.data.todayWeather.desc) {
      tags.push(this.data.todayWeather.desc);
    }
    
    // 添加温度相关标签
    const temp = this.data.todayWeather.temp;
    if (temp < 10) {
      tags.push('寒冷');
    } else if (temp < 20) {
      tags.push('凉爽');
    } else if (temp < 28) {
      tags.push('舒适');
    } else {
      tags.push('炎热');
    }
    
    return tags.slice(0, 5); // 最多返回5个标签
  },

  // 关闭OOTD弹窗
  closeOOTDPopup: function() {
    this.setData({
      showOOTDPopup: false
    });
  },

  // 保存穿搭
  saveOutfit: function(e) {
    const outfit = e.detail.outfit;
    if (outfit) {
      wx.showLoading({
        title: '保存中...',
      });
      
      // 下载图片
      wx.downloadFile({
        url: outfit,
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存到相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.hideLoading();
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                });
              },
              fail: (err) => {
                wx.hideLoading();
                console.error('保存图片失败:', err);
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                });
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '下载图片失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('下载图片失败:', err);
          wx.showToast({
            title: '下载图片失败',
            icon: 'none'
          });
        }
      });
    }
  }
}); 