Component({
  properties: {
    // 骨架屏类型：'today' 或 'forecast'
    type: {
      type: String,
      value: 'today'
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      value: true,
      observer(newVal: boolean) {
        console.log(`天气骨架屏[${this.data.type}]加载状态变为: ${newVal}`);
      }
    }
  },
  
  data: {
    // 组件内部数据
  },
  
  methods: {
    // 组件方法
  }
}); 