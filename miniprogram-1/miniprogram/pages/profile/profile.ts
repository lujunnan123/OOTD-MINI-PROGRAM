// profile.ts
const profileAvatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';

Component({
  data: {
    userInfo: {
      avatarUrl: profileAvatarUrl,
      nickName: '小雨',
    },
    defaultAvatarUrl: profileAvatarUrl,
    city: '北京',
    gender: '女生',
    description: '热爱时尚和穿搭',
    hasUserInfo: false
  },
  methods: {
    // 跳转到OOTD页面
    goToOOTD() {
      wx.switchTab({
        url: '../index/index',
      });
    },
    
    // 编辑城市
    editCity() {
      wx.showActionSheet({
        itemList: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
        success: (res) => {
          const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州'];
          this.setData({
            city: cities[res.tapIndex]
          });
          // 保存到本地存储
          wx.setStorageSync('userCity', cities[res.tapIndex]);
        }
      });
    },
    
    // 编辑性别
    editGender() {
      wx.showActionSheet({
        itemList: ['男生', '女生'],
        success: (res) => {
          const genders = ['男生', '女生'];
          this.setData({
            gender: genders[res.tapIndex]
          });
          // 保存到本地存储
          wx.setStorageSync('userGender', genders[res.tapIndex]);
        }
      });
    },
    
    // 编辑个人描述
    editDescription() {
      wx.showModal({
        title: '个人描述',
        content: '请输入您的个人描述',
        editable: true,
        placeholderText: '例如：热爱时尚和穿搭',
        success: (res) => {
          if (res.confirm && res.content) {
            this.setData({
              description: res.content
            });
            // 保存到本地存储
            wx.setStorageSync('userDescription', res.content);
          }
        }
      });
    },
    
    // 消息通知
    goToNotifications() {
      wx.showToast({
        title: '暂无新消息',
        icon: 'none'
      });
    },
    
    // 帮助与反馈
    goToHelp() {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 设置
    goToSettings() {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 加载用户数据
    loadUserData() {
      const city = wx.getStorageSync('userCity');
      const gender = wx.getStorageSync('userGender');
      const description = wx.getStorageSync('userDescription');
      
      // 如果本地存储有数据，则使用本地数据
      if (city) {
        this.setData({ city });
      }
      if (gender) {
        this.setData({ gender });
      }
      if (description) {
        this.setData({ description });
      }
      
      // 尝试获取用户信息
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo: JSON.parse(userInfo),
          hasUserInfo: true
        });
      }
    },
    
    onLoad() {
      this.loadUserData();
    },
    
    onShow() {
      // 每次显示页面时更新数据
      this.loadUserData();
    }
  }
}) 