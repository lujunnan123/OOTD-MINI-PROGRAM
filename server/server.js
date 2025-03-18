require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 天气API路由
app.post('/api/weather', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: '需要提供城市参数' });
    }
    
    const { data } = await axios.post('https://api.coze.cn/v1/workflow/run', {
      parameters: {
        city
      },
      workflow_id: process.env.WEATHER_WORKFLOW_ID,
      app_id: process.env.APP_ID
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.COZE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (data.code === 0 && data.data) {
      // 解析返回的数据
      const weatherData = JSON.parse(data.data);
      res.json(weatherData);
    } else {
      res.status(500).json({ error: '获取天气数据失败', details: data });
    }
  } catch (error) {
    console.error('天气API错误:', error.message);
    res.status(500).json({ 
      error: '服务器错误', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// OOTD生成API路由
app.post('/api/generate-ootd', async (req, res) => {
  try {
    const { city, gender, description, selectedStyle, weather } = req.body;
    
    if (!city || !gender || !selectedStyle || !weather) {
      return res.status(400).json({ 
        error: '缺少必要参数',
        required: ['city', 'gender', 'selectedStyle', 'weather'] 
      });
    }
    
    const { data } = await axios.post('https://api.coze.cn/v1/workflow/run', {
      parameters: {
        city,
        gender,
        description: description || '',
        selectedStyle,
        weather
      },
      workflow_id: process.env.OOTD_WORKFLOW_ID,
      app_id: process.env.APP_ID
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.COZE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (data.code === 0 && data.data) {
      // 解析返回的数据
      const ootdData = JSON.parse(data.data);
      res.json(ootdData);
    } else {
      res.status(500).json({ error: '生成OOTD失败', details: data });
    }
  } catch (error) {
    console.error('OOTD生成API错误:', error.message);
    res.status(500).json({ 
      error: '服务器错误', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 