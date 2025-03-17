Page({
  data: {
    currentStep: 'welcome', // welcome, city, gender, bio
    city: '',
    gender: '',
    description: '',
    cityOptions: ['北京', '上海', '广州', '深圳', '成都', '杭州']
  },

  // 从欢迎页进入引导流程
  startOnboarding() {
    this.setData({
      currentStep: 'city'
    });
  },

  // 城市输入变化
  cityInputChange(e: any) {
    this.setData({
      city: e.detail.value
    });
  },

  // 选择预设城市
  selectCity(e: any) {
    const city = e.currentTarget.dataset.city;
    this.setData({
      city
    });
  },

  // 前往性别选择步骤
  goToGender() {
    if (this.data.city) {
      this.setData({
        currentStep: 'gender'
      });
    }
  },

  // 选择性别
  selectGender(e: any) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      gender
    });
  },

  // 前往个人描述步骤
  goToBio() {
    if (this.data.gender) {
      this.setData({
        currentStep: 'bio'
      });
    }
  },

  // 个人描述输入变化
  descriptionInputChange(e: any) {
    this.setData({
      description: e.detail.value
    });
  },

  // 完成引导流程
  finishOnboarding() {
    // 保存用户信息到本地存储
    try {
      // 保存城市
      wx.setStorageSync('userCity', this.data.city);
      
      // 保存性别
      wx.setStorageSync('userGender', this.data.gender);
      
      // 保存个人描述（如果有）
      if (this.data.description) {
        wx.setStorageSync('userDescription', this.data.description);
      }
      
      // 设置已完成引导标记
      wx.setStorageSync('onboardingCompleted', true);
      
      // 跳转回首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    } catch (e) {
      console.error('保存用户信息失败', e);
      wx.showToast({
        title: '保存信息失败，请重试',
        icon: 'none'
      });
    }
  }
}) 