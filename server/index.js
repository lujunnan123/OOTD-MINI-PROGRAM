const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// Coze API配置
const COZE_TOKEN = process.env.COZE_TOKEN || 'pat_gOlQq0D6AFxvY3ye7pk2qM3h7XpCacZMcWoTV1tneGWjsGgKgYRMqPjUMNV7030E';
const WEATHER_WORKFLOW_ID = '7482681584441655322';
const OOTD_WORKFLOW_ID = '7482762736730013737';
const APP_ID = '7482660177985519616';

// 天气API路由
app.post('/api/weather', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: '城市名称不能为空' });
    }
    
    console.log(`请求天气数据，城市: ${city}`);
    
    const response = await axios.post('https://api.coze.cn/v1/workflow/run', {
      parameters: {
        city
      },
      workflow_id: WEATHER_WORKFLOW_ID,
      app_id: APP_ID
    }, {
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 解析Coze API返回的数据
    if (response.data && response.data.code === 0) {
      const weatherData = JSON.parse(response.data.data).output;
      return res.json(weatherData);
    } else {
      console.error('Coze API返回错误:', response.data);
      return res.status(500).json({ error: '获取天气数据失败', details: response.data });
    }
  } catch (error) {
    console.error('天气API错误:', error);
    res.status(500).json({ error: '服务器错误', message: error.message });
  }
});

// OOTD推荐API路由
app.post('/api/generate-ootd', async (req, res) => {
  try {
    const { city, gender, description, selectedStyle, weather } = req.body;
    
    if (!city || !gender || !weather) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    console.log(`生成OOTD推荐，城市: ${city}, 性别: ${gender}`);
    
    const response = await axios.post('https://api.coze.cn/v1/workflow/run', {
      parameters: {
        city,
        gender,
        description,
        selectedStyle,
        weather
      },
      workflow_id: OOTD_WORKFLOW_ID,
      app_id: APP_ID
    }, {
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 解析Coze API返回的数据
    if (response.data && response.data.code === 0) {
      const ootdData = JSON.parse(response.data.data);
      return res.json(ootdData);
    } else {
      console.error('Coze API返回错误:', response.data);
      return res.status(500).json({ error: '生成OOTD推荐失败', details: response.data });
    }
  } catch (error) {
    console.error('OOTD API错误:', error);
    res.status(500).json({ error: '服务器错误', message: error.message });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 