# 文章封面图说明

本目录用于存放 7 个文章分类的封面图。

## 需要生成的图片

1. `memory.webp` - 记忆力分类封面
2. `attention.webp` - 注意力分类封面
3. `reaction.webp` - 反应力分类封面
4. `executive.webp` - 执行功能分类封面
5. `relaxation.webp` - 放松分类封面
6. `nutrition.webp` - 营养分类封面
7. `sleep.webp` - 睡眠分类封面

## 图片规格

- 格式：WebP（优先）或 PNG
- 尺寸：1200x630px（推荐）或 800x400px
- 风格：暖色调，与网站整体配色一致
- 主题：与对应分类相关的抽象或具象图像

## 生成方式

使用 AI 图片生成 API：
```
https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={prompt}&image_size=landscape_16_9
```

### 示例 Prompt

**Memory (记忆力)**:
```
Warm sunset tones, abstract neural network connections, glowing synapses, orange and gold gradient, soft lighting, cognitive science visualization
```

**Attention (注意力)**:
```
Warm amber light, focused beam of light, concentration concept, golden rays, warm color palette, mental clarity visualization
```

**Reaction (反应力)**:
```
Dynamic warm colors, lightning bolt in orange and gold, speed and agility concept, sunset energy, vibrant warm tones
```

**Executive (执行功能)**:
```
Warm coral and peach tones, organized geometric patterns, strategic planning concept, warm gradient, professional and calm
```

**Relaxation (放松)**:
```
Soft warm sunset, peaceful meditation scene, gentle orange and pink sky, tranquility, warm and calming atmosphere
```

**Nutrition (营养)**:
```
Warm golden hour light, healthy food concept, orange and yellow fruits, warm and inviting, nutritious lifestyle
```

**Sleep (睡眠)**:
```
Warm twilight sky, peaceful night scene, soft orange and purple gradient, restful atmosphere, warm and cozy
```

## 下一步

1. 使用上述 prompt 调用 API 生成 7 张图片
2. 将生成的图片保存到本目录
3. 更新 `apps/web/src/data/articles.ts` 中的 `coverImage` 字段
4. 更新 `ArticleCard` 组件显示封面图

## 临时方案

在图片生成前，ArticleCard 组件将不显示封面图，仅显示文字内容。
