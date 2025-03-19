Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    weather: {
      type: String,
      value: ''
    },
    temperature: {
      type: Number,
      value: 0
    },
    style: {
      type: String,
      value: ''
    },
    outfits: {
      type: Array,
      value: []
    },
    advice: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
    },
    loading: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close');
    },
    
    saveOutfit() {
      const currentOutfit = this.data.outfits[this.data.currentIndex];
      this.triggerEvent('save', { outfit: currentOutfit });
    },
    
    prevImage() {
      let index = this.data.currentIndex;
      if (index > 0) {
        this.setData({
          currentIndex: index - 1
        });
      }
    },
    
    nextImage() {
      let index = this.data.currentIndex;
      if (index < this.data.outfits.length - 1) {
        this.setData({
          currentIndex: index + 1
        });
      }
    }
  }
}) 