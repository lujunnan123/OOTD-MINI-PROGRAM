// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 导入API服务和日期工具
const apiService = require('../../utils/api');
const dateUtils = require('../../utils/dateUtils');

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    city: '北京',
    prevCity: '', // 添加记录上一次的城市变量
    selectedStyle: '温柔风',
    todayWeather: {
      temp: 25,
      feelTemp: 27,
      windLevel: 3,
      humidity: 62,
      icon: '☀️',
      desc: '晴朗'
    },
    weekWeather: [
      { day: '今天', icon: '☀️', maxTemp: 25, minTemp: 18 },
      { day: '周二', icon: '⛅', maxTemp: 23, minTemp: 17 },
      { day: '周三', icon: '🌧️', maxTemp: 21, minTemp: 16 },
      { day: '周四', icon: '☁️', maxTemp: 22, minTemp: 17 },
      { day: '周五', icon: '☀️', maxTemp: 24, minTemp: 18 },
      { day: '周六', icon: '☀️', maxTemp: 26, minTemp: 19 },
      { day: '周日', icon: '⛅', maxTemp: 25, minTemp: 19 }
    ],
    styleOptions: [
      { name: '韩系简约风' },
      { name: '甜酷风' },
      { name: '温柔风' },
      { name: '学院风' },
      { name: '设计师品牌风' },
      { name: '复古文艺风' },
      { name: '小香风' },
      { name: '森女系' },
      { name: '运动休闲风' },
      { name: 'Y2K风' }
    ],
    // OOTD弹出组件相关数据
    showOOTDPopup: false,
    generatedOutfits: [1, 2, 3], // 只用数字表示轮播数量
    stylistAdvice: "",
    adviceTags: [] as string[],
    // 骨架屏相关
    loadingToday: true,
    loadingForecast: true,
    currentWeatherData: null // 保存当前天气的完整数据
  },
  methods: {
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    // 选择穿搭风格
    selectStyle(e: any) {
      const style = e.currentTarget.dataset.style;
      this.setData({
        selectedStyle: style
      });
    },
    
    // 生成今日OOTD
    generateOOTD() {
      console.log('生成今日OOTD按钮被点击');
      
      const { city, selectedStyle, currentWeatherData } = this.data;
      
      if (!currentWeatherData) {
        wx.showToast({
          title: '天气数据加载中，请稍候',
          icon: 'none'
        });
        return;
      }
      
      // 从本地存储获取用户信息
      const gender = wx.getStorageSync('userGender') || '女';
      const description = wx.getStorageSync('userDescription') || '';
      
      // 显示加载提示
      wx.showLoading({
        title: '生成穿搭中...',
      });
      
      // 调用OOTD生成API
      apiService.generateOOTD({
        city,
        gender,
        description,
        selectedStyle,
        weather: currentWeatherData[0] // 使用今天的天气数据
      }).then((res: any) => {
        console.log('OOTD生成结果:', res);
        
        // 根据天气和风格生成穿搭建议
        const advice = res.advice || this.generateStylistAdvice();
        const tags = this.extractTags(advice);
        
        // 设置相关数据
        this.setData({
          stylistAdvice: advice,
          adviceTags: tags,
          showOOTDPopup: true
        });
        
        wx.hideLoading();
      }).catch((error: any) => {
        console.error('生成OOTD失败:', error);
        
        // 使用备选方案
        const advice = this.generateStylistAdvice();
        const tags = this.generateAdviceTags();
        
        this.setData({
          stylistAdvice: advice,
          adviceTags: tags,
          showOOTDPopup: true
        });
        
        wx.hideLoading();
        wx.showToast({
          title: '连接服务器失败，使用离线推荐',
          icon: 'none'
        });
      });
    },
    
    // 从文本中提取标签
    extractTags(text: string) {
      // 简单的标签提取算法
      const keywords = ['简约', '休闲', '保暖', '舒适', '轻薄', '透气', '时尚', '百搭', '复古', '经典',
                      '活力', '优雅', '甜美', '可爱', '防晒', '温暖', '柔和', '学院', '文艺', '气质'];
      const tags = [];
      
      // 添加风格标签
      tags.push(this.data.selectedStyle);
      
      // 查找关键词
      for (const keyword of keywords) {
        if (text.includes(keyword) && tags.length < 6) {
          tags.push(keyword);
        }
      }
      
      // 如果标签不足，使用备选标签
      if (tags.length < 4) {
        const backupTags = this.generateAdviceTags();
        for (const tag of backupTags) {
          if (!tags.includes(tag) && tags.length < 6) {
            tags.push(tag);
          }
        }
      }
      
      return tags;
    },
    
    // 生成AI造型师建议（备选方案）
    generateStylistAdvice() {
      const { temp } = this.data.todayWeather;
      const { selectedStyle } = this.data;
      
      let advice = '';
      if (temp >= 25) {
        advice = `今天气温较高，建议选择轻薄、透气的衣物。根据你喜欢的${selectedStyle}风格，可以尝试搭配宽松的上衣和短裤/短裙，增加舒适度的同时保持风格特点。`;
      } else if (temp >= 15) {
        advice = `今天气温适中，可以选择薄外套或长袖单品。结合你喜欢的${selectedStyle}风格，建议搭配长袖上衣和九分裤/长裙，既时尚又不会感到寒冷。`;
      } else {
        advice = `今天气温较低，需要注意保暖。考虑到你喜欢的${selectedStyle}风格，建议选择保暖外套，内搭毛衣或厚实的上衣，下装选择厚实长裤，保暖的同时展现风格魅力。`;
      }
      
      return advice;
    },
    
    // 生成建议标签（备选方案）
    generateAdviceTags() {
      const { temp } = this.data.todayWeather;
      const { selectedStyle } = this.data;
      
      const commonTags: string[] = [selectedStyle];
      
      let weatherTags: string[] = [];
      if (temp >= 25) {
        weatherTags = ['轻薄', '透气', '防晒'];
      } else if (temp >= 15) {
        weatherTags = ['适中', '舒适', '百搭'];
      } else {
        weatherTags = ['保暖', '厚实', '层次感'];
      }
      
      // 风格标签
      const styleTags: Record<string, string[]> = {
        '韩系简约风': ['简约', '纯色', '质感'],
        '甜酷风': ['可爱', '个性', '混搭'],
        '温柔风': ['柔和', '优雅', '淑女'],
        '学院风': ['学术', '格纹', '制服感'],
        '设计师品牌风': ['前卫', '独特', '设计感'],
        '复古文艺风': ['复古', '文艺', '怀旧'],
        '小香风': ['优雅', '经典', '高级感'],
        '森女系': ['自然', '宽松', '棉麻'],
        '运动休闲风': ['运动', '舒适', '实用'],
        'Y2K风': ['复古', 'Y2K', '流行']
      };
      
      return [...commonTags, ...weatherTags, ...(styleTags[selectedStyle] || [])].slice(0, 6);
    },
    
    // 关闭OOTD弹窗
    closeOOTDPopup() {
      console.log('关闭OOTD弹窗');
      this.setData({
        showOOTDPopup: false
      });
    },
    
    // 保存穿搭
    saveOutfit(e: any) {
      const { outfit } = e.detail;
      console.log('保存穿搭:', outfit);
      
      // 可以实现保存到收藏的功能
      wx.showToast({
        title: '穿搭已保存',
        icon: 'success',
        duration: 2000
      });
    },
    
    // 跳转到我的页面
    goToProfile() {
      wx.switchTab({
        url: '../profile/profile',
      });
    },
    
    // 获取天气数据
    getWeatherData() {
      const { city } = this.data;
      
      console.log('获取天气数据，城市:', city);
      
      // 设置骨架屏状态为显示
      this.setData({
        loadingToday: true,
        loadingForecast: true
      });
      
      // 调用API获取天气数据
      apiService.getWeather(city)
        .then((data: any) => {
          console.log('获取天气数据成功:', data);
          
          if (data && data.output && data.output.length > 0) {
            // 保存完整的天气数据
            this.setData({
              currentWeatherData: data.output
            });
            
            // 处理今日天气
            const today = data.output[0];
            const todayWeather = {
              temp: today.temp_high,
              feelTemp: Math.round((today.temp_high + today.temp_low) / 2),
              windLevel: today.wind_level_day,
              humidity: today.humidity,
              desc: today.weather_day,
              icon: this.getWeatherIcon(today.weather_day)
            };
            
            // 处理未来7天天气
            const weekWeather = data.output.map((day: any, index: number) => {
              let dayName = '今天';
              if (index === 1) dayName = '明天';
              else if (index === 2) dayName = '后天';
              else {
                const date = new Date(day.predict_date);
                const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                dayName = weekday[date.getDay()];
              }
              
              return {
                day: dayName,
                icon: this.getWeatherIcon(day.weather_day),
                maxTemp: day.temp_high,
                minTemp: day.temp_low
              };
            });
            
            // 先更新天气数据
            this.setData({
              todayWeather,
              weekWeather
            }, () => {
              // 数据更新完成后，延迟一小段时间再隐藏骨架屏，确保数据已经渲染
              setTimeout(() => {
                this.setData({
                  loadingToday: false,
                  loadingForecast: false
                });
              }, 300);
            });
          } else {
            // 如果没有数据，直接隐藏骨架屏
            this.setData({
              loadingToday: false,
              loadingForecast: false
            });
          }
        })
        .catch((error: any) => {
          console.error('获取天气数据失败:', error);
          
          // 显示错误通知
          wx.showToast({
            title: '获取天气数据失败',
            icon: 'none'
          });
          
          // 发生错误时隐藏骨架屏
          this.setData({
            loadingToday: false,
            loadingForecast: false
          });
        });
    },
    
    // 根据天气描述获取对应的表情图标
    getWeatherIcon(weatherDesc: string) {
      const iconMap: {[key: string]: string} = {
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
      
      return iconMap[weatherDesc] || '🌈';
    },
    
    // 页面加载时获取天气数据
    onLoad() {
      // 检查是否完成引导
      const onboardingCompleted = wx.getStorageSync('onboardingCompleted');
      if (!onboardingCompleted) {
        wx.redirectTo({
          url: '/pages/onboarding/onboarding',
        });
        return;
      }
      
      // 加载本地存储的用户信息
      this.loadUserInfo();
      
      // 记录初始城市
      this.setData({
        prevCity: this.data.city
      });
      
      // 获取天气数据
      this.getWeatherData();
    },
    
    // 每次页面显示时检查城市是否变化
    onShow() {
      const cityChanged = this.loadUserInfo();
      
      // 如果城市发生变化，重新获取天气数据
      if (cityChanged) {
        console.log('城市已变更，从', this.data.prevCity, '到', this.data.city);
        // 更新记录的城市
        this.setData({
          prevCity: this.data.city
        });
        // 重新获取天气数据
        this.getWeatherData();
      }
    },
    
    // 加载用户信息，返回城市是否变化
    loadUserInfo() {
      try {
        const city = wx.getStorageSync('userCity');
        if (city && city !== this.data.city) {
          this.setData({
            city
          });
          return true; // 城市发生变化
        }
      } catch (e) {
        console.error('加载用户信息失败', e);
      }
      return false; // 城市没有变化
    }
  },
})
