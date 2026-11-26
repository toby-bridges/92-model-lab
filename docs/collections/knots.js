{
  // Each triple follows the original attempt order. The pass and over-budget
  // counts are the judge's recorded flags, aggregated separately per task.
  const models = {
    astra: ['GPT-6.2 Astra', 'gpt-6.2-astra'],
    sol: ['GPT-6.2 Sol', 'gpt-6.2-sol'],
    neon: ['Gemini 4 Neon', 'gemini-4-neon'],
    hydrogen: ['Gemini 4 Hydrogen', 'gemini-4-hydrogen'],
    carbon: ['Gemini 4 Carbon', 'gemini-4-carbon'],
    deepseek: ['DeepSeek V4.1 Flash', 'deepseek-v4.1-flash'],
    hy4: ['Hy4（OpenCode Go）', 'hy4'],
  };
  const tasks = [
    {
      id: 'knotbench',
      card: 'overhand',
      name: '单结',
      description: '模型规划如何抓取、移动和松开一根绳子，让它打成单结，再接受拉力测试。可对照 7 个模型各自的三次成绩。',
      defaults: ['astra', 'neon'],
      rows: [
        ['astra',    [5, 5, 5], 3, 0, true],
        ['sol',      [5, 5, 4], 2, 2, true],
        ['neon',     [4, 5, 5], 2, 3, true],
        ['hydrogen', [1, 1, 0], 0, 3, true],
        ['carbon',   [0, 0, 0], 0, 3, false],
        ['deepseek', [1, 0, 1], 0, 3, true],
        ['hy4',      [0, 0, 0], 0, 3, false],
      ],
    },
    {
      id: 'knotbench-figure-eight',
      card: 'figure-eight',
      name: '八字结',
      description: '同一套模拟器换成八字结。评分依次检查物理约束、结型、受拉后的保持情况和收紧程度。',
      defaults: ['astra', 'hydrogen'],
      rows: [
        ['astra',    [5, 5, 5], 3, 1, true],
        ['sol',      [5, 5, 5], 3, 3, true],
        ['neon',     [0, 0, 0], 0, 3, false],
        ['hydrogen', [1, 1, 0], 0, 3, true],
        ['carbon',   [0, 0, 0], 0, 3, false],
        ['deepseek', [1, 1, 1], 0, 3, true],
        ['hy4',      [0, 0, 0], 0, 3, false],
      ],
    },
  ];
  const method = [
    ['作答条件', '每个模型对每道题独立作答三次，一次提交整套绳索动作。作答期间无模拟反馈。两批实验分别在 2026 年 11 月 10 日与 21 日进行，Hy4 一栏来自 opencode-go/hy4。各模型所用客户端、系统提示与实际输出上限有所差异。'],
    ['如何计分', '每次记录达到的最高阶梯。0 级包括答案不完整、格式无效或模拟违反物理约束；1 级满足物理约束；2 级成结；3 级得到目标结型；4 级受拉后仍保持；5 级也满足收紧要求。这两道题都有收紧参考，因此达到 5 级计为一次通过。'],
    ['输出预算', '实验约定每次最多 32,000 个输出 token，包含思考。本页采用原判分器的记录口径，超预算的尝试保留原成绩并单列次数。'],
    ['怎么看录像', '每段录像展示该模型的第一次尝试。左侧是整绳俯视图；右侧在判分器找到绳结时放大结段，其余情况放大绳索中点。镜头依据模拟粒子坐标独立绘制，动作、静置、拉力测试及释放四个阶段均已与存档的阶段末坐标核对。画面统一剪为 8 秒，右下角标出实际模拟时间。'],
    ['模拟来源', 'KnotBench v0 使用 behnamazimi/knots 的物理引擎，固定版本 41f4d513。本页展示开发题的模型实验成绩与本站绘制的轨迹。'],
  ];
  for (const task of tasks) {
    const samples = task.rows.map(([id, levels, passes, overBudget, hasMotion]) => {
      const [model, slug] = models[id];
      const stem = 'assets/knots/' + task.card + '-' + slug;
      const sample = {
        id, model,
        label: hasMotion ? '第 1 次尝试 · 轨迹重绘' : '三次输出均截断，未产生有效模拟',
        metric: passes + ' / 3 次通过',
        facts: [
          ...levels.map((level, i) => ['第 ' + (i + 1) + ' 次', '阶梯 ' + level + ' / 5']),
          ['超过输出预算', overBudget + ' / 3 次'],
        ],
      };
      if (hasMotion) {
        sample.poster = stem + '.webp';
        sample.video = stem + '.mp4';
      }
      return sample;
    });
    benchmarks.push({
      id: task.id, name: task.name, group: 'KnotBench', category: '三维规划', type: 'results',
      description: task.description, defaults: task.defaults, duration: 8,
      thumb: samples[0].poster, samples, method,
      links: [
        { label: '物理引擎固定版本', href: 'https://github.com/behnamazimi/knots/tree/41f4d513f8ac5ce1f02768ed7f732da8fb08406f' },
      ],
    });
  }
}
