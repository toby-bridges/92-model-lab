benchmarks.push({
  id: 'sandworm',
  name: '沙虫 · SANDWORM MK-X',
  category: '3D 场景',
  type: 'video',
  description: '六个模型各做了一台在沙丘间穿行的分节机械沙虫。同步切换正面、侧面、俯视和地下剖视，比较装甲如何随身体运动，以及镜头能否跟住钻头。',
  defaults: ['A', 'D'],
  thumb: 'assets/sandworm/a.webp',
  duration: 90,
  samples: [
    ['A', 'MiniMax M3.1', 14],
    ['B', 'HY4', 14],
    ['C', 'Kimi 3.1 Pro', 14],
    ['D', 'GPT-6.2 Sol', 14],
    ['E', 'Gemini 4 Neon', 13],
    ['F', 'Gemini 4 Hydrogen', 14]
  ].map(([id, model, clicks]) => ({
    id,
    model,
    poster: 'assets/sandworm/' + id.toLowerCase() + '.webp',
    video: 'assets/sandworm/' + id.toLowerCase() + '.mp4',
    label: '完整录屏 · 90 秒',
    metric: '控件点击 ' + clicks + ' 次'
  })),
  method: [
    ['同一段镜头调度', '六份原始网页作品都在 1728 × 1080 的浏览器视口录制，依次接收相同的镜头切换和操作。每个作品自行决定相机距离、构图和动作。网页播放器保留完整 90 秒时间线。'],
    ['从哪里看起', '0:08 看侧面装甲，0:15 切到俯视，0:22 开启地下剖视。0:44 开始环绕，0:52 展开全身做结构对照，1:22 比较同一组拖拽和缩放操作。'],
    ['怎样读控件记录', '面板记录录制脚本点击按钮的次数。Gemini 4 Neon 的剖视已经开启，脚本跳过一次点击。镜头和动画的实际效果可在录像中直接对照。不同模型的生成环境与输出预算有差异。']
  ],
  links: []
});
