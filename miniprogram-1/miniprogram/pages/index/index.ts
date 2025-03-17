// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

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
    adviceTags: [] as string[]
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
      // 根据天气和风格生成穿搭建议
      const advice = this.generateStylistAdvice();
      const tags = this.generateAdviceTags();
      
      // 先设置相关数据
      this.setData({
        stylistAdvice: advice,
        adviceTags: tags
      });
      
      // 然后显示弹窗（分开设置，避免数据同步问题）
      setTimeout(() => {
        this.setData({
          showOOTDPopup: true
        });
        console.log('OOTD弹窗显示状态:', this.data.showOOTDPopup);
      }, 100);
    },
    
    // 生成AI造型师建议
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
    
    // 生成建议标签
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
    
    // 获取天气数据（实际应用中需要调用天气API）
    getWeatherData() {
      // 这里应该是调用天气API的代码
      // 为了简化，我们直接使用模拟数据
      console.log('获取天气数据');
    },
    
    // 页面加载时获取天气数据
    onLoad() {
      this.getWeatherData();
      
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
    },
    
    // 加载用户信息
    loadUserInfo() {
      try {
        const city = wx.getStorageSync('userCity');
        if (city) {
          this.setData({
            city
          });
        }
      } catch (e) {
        console.error('加载用户信息失败', e);
      }
    }
  },
})
