// ootd-popup.ts
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    weather: {
      type: String,
      value: '晴朗'
    },
    temperature: {
      type: Number,
      value: 25
    },
    style: {
      type: String,
      value: '休闲'
    },
    outfits: {
      type: Array,
      value: []
    },
    advice: {
      type: String,
      value: '今天天气不错，适合穿轻便的衣服。选择透气性好的面料，搭配一些亮色系的单品可以提升整体造型的活力感。'
    },
    tags: {
      type: Array,
      value: ['轻便', '透气', '亮色系', '活力']
    }
  },

  data: {
    currentSlide: 0,
    ootdImages: [1, 2, 3], // 简化为数字数组，只用来控制轮播数量
    ootdAdvice: {
      paragraph1: "根据今天的天气和你的穿搭偏好，建议选择轻薄透气的衣物来应对较高温度。",
      paragraph2: "可以尝试宽松的T恤搭配休闲裤，既舒适又时尚。选择浅色系能让你在阳光下感到更凉爽。",
      tags: ['轻薄', '舒适', '透气', '简约', '休闲', '浅色系']
    },
    weatherDesc: '',
    temp: 0,
    styleType: ''
  },

  lifetimes: {
    attached() {
      this.updateContent();
      console.log('ootd-popup组件已加载');
    }
  },

  observers: {
    'show': function(show) {
      if (show) {
        this.updateContent();
        console.log('弹窗显示状态变更为:', show);
      }
    },
    'outfits, weather, temperature, style, advice, tags': function() {
      this.updateContent();
    }
  },

  methods: {
    updateContent() {
      // 使用传入的属性更新组件内容
      const { outfits, weather, temperature, style, advice, tags } = this.properties;
      
      this.setData({
        weatherDesc: weather,
        temp: temperature,
        styleType: style,
        ootdAdvice: {
          paragraph1: advice.split('.').slice(0, 2).join('.') + '.',
          paragraph2: advice.split('.').slice(2).join('.').trim(),
          tags: tags
        },
        ootdImages:outfits
      });
      console.log('ljn:',this.data.ootdImages);
      
      
      console.log('OOTD弹窗数据已更新', this.data);
    },

    onMaskTap() {
      this.onClosePopup();
    },

    stopPropagation() {
      // 阻止冒泡，防止点击弹窗内容时关闭弹窗
      return false;
    },

    onClosePopup() {
      this.setData({
        show: false
      });
      this.triggerEvent('close');
    },

    saveOOTD() {
      const { currentSlide } = this.data;
      const outfit = { id: currentSlide + 1, style: this.data.styleType };
      this.triggerEvent('save', { outfit });
      this.onClosePopup();
    },

    onSwiperChange(e: WechatMiniprogram.SwiperChange) {
      this.setData({
        currentSlide: e.detail.current
      });
    },

    prevSlide() {
      const { currentSlide, ootdImages } = this.data;
      if (currentSlide > 0) {
        this.setData({
          currentSlide: currentSlide - 1
        });
      } else {
        this.setData({
          currentSlide: ootdImages.length - 1
        });
      }
    },

    nextSlide() {
      const { currentSlide, ootdImages } = this.data;
      if (currentSlide < ootdImages.length - 1) {
        this.setData({
          currentSlide: currentSlide + 1
        });
      } else {
        this.setData({
          currentSlide: 0
        });
      }
    },

    // 阻止滑动穿透
    preventTouchMove() {
      return false;
    }
  }
}) 