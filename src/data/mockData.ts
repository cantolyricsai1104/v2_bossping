export interface BossData {
  id: string;
  name: string;
  title: string;
  avatarColor: string;
  taskCard: {
    title: string;
    scenario: string;
    requirement: string;
  };
  taskBrief: string;
  taskScenario: string;
  taskRequirement: string;
  templateAnswers: {
    label: string;
    content: string;
    description: string;
  }[];
  conversation: {
    id: string;
    sender: string;
    type: string;
    content: string;
    timestamp: number;
  }[];
}

export const INITIAL_BOSSES: BossData[] = [
  {
    id: 'boss_huang',
    name: '黄老板',
    title: '产品经理 · 某互联网大厂',
    avatarColor: '#4A90D9',
    taskCard: {
      title: '📋 撰写用户故事',
      scenario: '为校园图书馆实时占座功能定义核心用户场景',
      requirement: '格式：作为 [谁]，我想要 [做什么]，以便 [获得什么价值]。需要3条，每条不少于15字。'
    },
    taskBrief: '为校园占座功能写 3 条用户故事',
    taskScenario: '团队准备开发一个图书馆实时占座功能，学生可以在手机上查看座位状态并预约。',
    taskRequirement: '3条用户故事，格式：作为…我想要…以便…。每条至少15字。',
    templateAnswers: [
      {
        label: '👍 标准版',
        content:
          '1. 作为学生，我想要查看图书馆当前的座位空余情况，以便决定是否出发去图书馆。\n2. 作为自习的学生，我想要预约一个指定座位，以便到达后能保证有位置。\n3. 作为临时有事的学生，我想要随时取消预约，以便释放座位给其他同学。',
        description: '逻辑清晰，覆盖核心流程'
      },
      {
        label: '🌟 优秀版',
        content:
          '1. 作为期末复习的学生，我想要提前一天预约图书馆的安静区域座位，以便在考试周能有一个稳定的学习环境。\n2. 作为小组做项目的学生，我想要查看相邻空座并一次性预约，以便和组员坐在一起讨论。\n3. 作为容易忘记事的学生，我想要在预约时间开始前收到提醒，以便不会因超时而导致预约失效。',
        description: '场景具体，细节丰富'
      },
      {
        label: '🆕 初级版',
        content: '1. 作为学生，我想要看空位。\n2. 作为学生，我想要订座。\n3. 作为学生，我想要取消。',
        description: '格式正确但过于简略'
      }
    ],
    conversation: [
      {
        id: 'msg-h-1',
        sender: 'boss',
        type: 'text',
        content: '小陈，刚好你在线。我们准备在校园App里加一个图书馆实时占座的功能，你帮我想几条用户故事。',
        timestamp: Date.now() - 120000
      },
      {
        id: 'msg-h-2',
        sender: 'boss',
        type: 'text',
        content: '就按「作为…我想要…以便…」的格式写，把学生真正会遇到的场景写出来，写 3 条。',
        timestamp: Date.now() - 110000
      },
      {
        id: 'msg-h-3',
        sender: 'system',
        type: 'taskCard',
        content: JSON.stringify({
          title: '📋 撰写用户故事',
          scenario: '为校园图书馆实时占座功能定义核心用户场景',
          requirement: '格式：作为 [谁]，我想要 [做什么]，以便 [获得什么价值]。需要3条，每条不少于15字。'
        }),
        timestamp: Date.now() - 100000
      }
    ],
  },
  {
    id: 'boss_chen',
    name: '陈老板',
    title: '新媒体运营 · 头部科技媒体',
    avatarColor: '#F5A623',
    taskCard: {
      title: '📋 拟写推送标题',
      scenario: '文章主题：AI大模型正在改变普通人的日常生活',
      requirement: '3个标题：震惊体、干货体、对话体。每个≤25字，能吸引点击。'
    },
    taskBrief: '',
    taskScenario: '',
    taskRequirement: '',
    templateAnswers: [
      {
        label: '👁️ 标准版',
        content:
          '震惊体：AI竟能帮你做这些事，最后一个让人惊呼“离谱”\n干货体：普通人的AI应用指南：这三个场景让你效率翻倍\n对话体：“你用AI干什么？”“以前两小时的活，现在五分钟。”',
        description: '符合风格要求，字数合规'
      },
      {
        label: '🎨 创意版',
        content:
          '震惊体：别再说AI是泡沫了，这些功能已经渗透你的每一天\n干货体：不写代码也能玩转AI，送你三个超实用方法\n对话体：“你居然还不会用AI？”“嘘，我现在买菜都让它挑。”',
        description: '网感强，点击欲高'
      }
    ],
    conversation: [
      {
        id: 'msg-c-1',
        sender: 'boss',
        type: 'text',
        content: '江湖救急！我们公众号今天要发一篇关于AI大模型在日常生活中的应用的文章，你马上给我拟3个推送标题。',
        timestamp: Date.now() - 120000
      },
      {
        id: 'msg-c-2',
        sender: 'boss',
        type: 'text',
        content: '要3种不同风格：震惊体、干货体、对话体。每个标题别超过25字，要抓眼球！',
        timestamp: Date.now() - 110000
      },
      {
        id: 'msg-c-3',
        sender: 'system',
        type: 'taskCard',
        content: JSON.stringify({
          title: '📋 拟写推送标题',
          scenario: '文章主题：AI大模型正在改变普通人的日常生活',
          requirement: '3个标题：震惊体、干货体、对话体。每个≤25字，能吸引点击。'
        }),
        timestamp: Date.now() - 100000
      }
    ],
  },
  {
    id: 'boss_li',
    name: '李老板',
    title: '数据分析师 · 新零售公司',
    avatarColor: '#7ED321',
    taskCard: {
      title: '📋 业务数据分析',
      scenario: '如上数据，基于销量与利润做初步判断',
      requirement: '需要直接回答两个问题，并引用数据支撑'
    },
    taskBrief: '',
    taskScenario: '',
    taskRequirement: '',
    templateAnswers: [
      {
        label: '📊 数据驱动版',
        content:
          '1. 最值得加大库存的是奶茶。奶茶销量最高(320杯)且利润率达60%，周转快利润高。果茶紧随其后(280杯)也值得关注。2. 周末促销主推奶茶+果茶组合套餐，因为两者都是高销量高利润品，打包促销可提升客单价，同时带动甜品销量(甜品利润最低，可作赠品清库存)。',
        description: '有数据引用，逻辑完整'
      },
      {
        label: '⚡ 拍脑袋版',
        content: '1. 奶茶吧，卖得最好。2. 促销就推奶茶，大家都爱喝。',
        description: '有结论但缺乏分析'
      }
    ],
    conversation: [
      {
        id: 'msg-l-1',
        sender: 'boss',
        type: 'text',
        content:
          '上周销售数据出来了，你简单帮我分析一下：奶茶卖了320杯，果茶280杯，咖啡150杯，甜品90份。奶茶和果茶利润都在60%左右，咖啡50%，甜品40%。',
        timestamp: Date.now() - 120000
      },
      {
        id: 'msg-l-2',
        sender: 'boss',
        type: 'text',
        content: '回答我两个问题：1. 哪个品类最值得加大库存？2. 周末促销你建议主推什么？',
        timestamp: Date.now() - 110000
      },
      {
        id: 'msg-l-3',
        sender: 'system',
        type: 'taskCard',
        content: JSON.stringify({
          title: '📋 业务数据分析',
          scenario: '如上数据，基于销量与利润做初步判断',
          requirement: '需要直接回答两个问题，并引用数据支撑'
        }),
        timestamp: Date.now() - 100000
      }
    ],
  },
  {
    id: 'boss_zhou',
    name: '周老板',
    title: '市场策划 · 新茶饮品牌',
    avatarColor: '#D0021B',
    taskCard: {
      title: '📋 品牌创意策划',
      scenario: '品牌：醒神茶，大学生茶饮，主打提神。',
      requirement: '1句Slogan（5-15字）+ 2个线上线下推广点子（各100字以内）'
    },
    taskBrief: '',
    taskScenario: '',
    taskRequirement: '',
    templateAnswers: [
      {
        label: '💡 经典版',
        content:
          'Slogan：醒神一下，满血出发。\n推广点子1（线上）：发起抖音话题#醒神挑战#，邀请大学生拍摄自己考前/熬夜时喝醒神茶的瞬间，抽奖送学期茶券。\n推广点子2（线下）：在图书馆、自习室门口设置「醒神补给站」，凭学生证免费领取小杯试饮，扫码加群可获首单折扣。',
        description: '定位清晰，方案可执行'
      },
      {
        label: '🧠 脑洞版',
        content:
          'Slogan：别睡，还有十页。\n点子1：和高校晨跑社团合作，晨跑终点放醒神茶摊，叫「醒神跑」。\n点子2：用校园表白墙发文：「醒神茶喝了会清醒，但想到你，我还是上头」，引发传播。',
        description: '更贴合Z世代语境'
      }
    ],
    conversation: [
      {
        id: 'msg-z-1',
        sender: 'boss',
        type: 'text',
        content: '我们品牌叫「醒神茶」，主打大学生提神醒脑，现在缺一句Slogan和两个推广点子。你年轻，你帮我想想。',
        timestamp: Date.now() - 120000
      },
      {
        id: 'msg-z-2',
        sender: 'system',
        type: 'taskCard',
        content: JSON.stringify({
          title: '📋 品牌创意策划',
          scenario: '品牌：醒神茶，大学生茶饮，主打提神。',
          requirement: '1句Slogan（5-15字）+ 2个线上线下推广点子（各100字以内）'
        }),
        timestamp: Date.now() - 110000
      }
    ],
  }
];
