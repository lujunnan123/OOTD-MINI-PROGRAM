# 1. 请求天气API

-请求方式：
```bash
curl -X POST 'https://api.coze.cn/v1/workflow/run' \
-H "Authorization: Bearer pat_gOlQq0D6AFxvY3ye7pk2qM3h7XpCacZMcWoTV1tneGWjsGgKgYRMqPjUMNV7030E" \
-H "Content-Type: application/json" \
-d '{
  "parameters": {
    "city": "杭州"
  },
  "workflow_id": "7482681584441655322",
  "app_id": "7482660177985519616"
}'

-返回值
```json
{"code":0,"cost":"0","data":"{\"output\":[{\"condition\":\"晴\",\"humidity\":48,\"predict_date\":\"2025-03-18\",\"temp_high\":14,\"temp_low\":5,\"weather_day\":\"晴\",\"wind_dir_day\":\"北风\",\"wind_dir_night\":\"东北风\",\"wind_level_day\":\"3\",\"wind_level_night\":\"3\"},{\"condition\":\"多云\",\"humidity\":56,\"predict_date\":\"2025-03-19\",\"temp_high\":14,\"temp_low\":5,\"weather_day\":\"多云\",\"wind_dir_day\":\"南风\",\"wind_dir_night\":\"南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"},{\"condition\":\"晴\",\"humidity\":54,\"predict_date\":\"2025-03-20\",\"temp_high\":21,\"temp_low\":9,\"weather_day\":\"晴\",\"wind_dir_day\":\"西南风\",\"wind_dir_night\":\"西南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"},{\"condition\":\"晴\",\"humidity\":51,\"predict_date\":\"2025-03-21\",\"temp_high\":24,\"temp_low\":9,\"weather_day\":\"晴\",\"wind_dir_day\":\"西南风\",\"wind_dir_night\":\"西南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"},{\"condition\":\"晴\",\"humidity\":47,\"predict_date\":\"2025-03-22\",\"temp_high\":26,\"temp_low\":11,\"weather_day\":\"晴\",\"wind_dir_day\":\"西南风\",\"wind_dir_night\":\"西南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"},{\"condition\":\"阴\",\"humidity\":46,\"predict_date\":\"2025-03-23\",\"temp_high\":27,\"temp_low\":14,\"weather_day\":\"阴\",\"wind_dir_day\":\"西南风\",\"wind_dir_night\":\"西南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"},{\"condition\":\"多云\",\"humidity\":47,\"predict_date\":\"2025-03-24\",\"temp_high\":28,\"temp_low\":14,\"weather_day\":\"多云\",\"wind_dir_day\":\"西南风\",\"wind_dir_night\":\"西南风\",\"wind_level_day\":\"2\",\"wind_level_night\":\"2\"}]}","debug_url":"https://www.coze.cn/work_flow?execute_id=7483106157831290880&space_id=7482680402822529036&workflow_id=7482681584441655322&execute_mode=2","msg":"Success","token":0}

# 2. 生成OOTD

-请求方式：
```bash
curl -X POST 'https://api.coze.cn/v1/workflow/run' \
-H "Authorization: Bearer pat_gOlQq0D6AFxvY3ye7pk2qM3h7XpCacZMcWoTV1tneGWjsGgKgYRMqPjUMNV7030E" \
-H "Content-Type: application/json" \
-d '{
  "parameters": {
    "city": "杭州",
    "gender": "女",
    "description": "我是一名大学生，喜欢看书和音乐",
    "selectedStyle": "可爱风",
    "weather": {
      "condition": "晴",
      "humidity": 48,
      "predict_date": "2025-03-18",
      "temp_high": 14,
      "temp_low": 5,
      "weather_day": "晴",
      "wind_dir_day": "北风",
      "wind_dir_night": "东北风",
      "wind_level_day": "3",
      "wind_level_night": "3"
    }
  },
  "workflow_id": "7482762736730013737",
  "app_id": "7482660177985519616"
}'


-返回值：
```json
{"code":0,"cost":"0","data":"{\"advice\":\"杭州天气多变，今日若晴，适合可爱风穿搭。上身可以选择粉色或淡蓝色的泡泡袖衬衫，下装搭配白色百褶裙或浅紫色短裙。搭配一双浅粉色的玛丽珍鞋，再加上一个粉色的蝴蝶结发夹。整体色调甜美可爱，展现出大学生爱看书和听音乐的文艺气质。\",\"output\":[\"https://s.coze.cn/t/gX_zAx-VyOc/\",\"https://s.coze.cn/t/SoLDwrVCsmo/\",\"https://s.coze.cn/t/HWs10XKk5BQ/\"]}","debug_url":"https://www.coze.cn/work_flow?execute_id=7483087124225867810&space_id=7482680402822529036&workflow_id=7482762736730013737&execute_mode=2","msg":"Success","token":2432}