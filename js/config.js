export const GAME_CONFIG = {
  maxDays: 3,
  dayDurationSec: 110,
  nextGuestGapSec: 2.6,
  miracleDurationSec: 22,
  miracleTipMultiplier: 2,
  initialSilver: 50,
  initialReputation: 100,
  bankruptSilver: -50,
  spawnWeights: { libai: 0.24, wife: 0.24 },
  normal: { maxPatienceSec: 45, smashPenaltySilver: 15, smashPenaltyRep: 10 },
  libai: { needWineCount: 2, maxPatienceSec: 55, patienceExtendPerWine: 12, smashPenaltySilver: 20, smashPenaltyRep: 10 },
  wife: { maxPatienceSec: 48, choice1: { silver: 100, rep: -10, wenxin: 0 }, choice2: { silver: 0, rep: 10, wenxin: 10 }, smashPenaltySilver: 20, smashPenaltyRep: 12 }
};

export const DISH_KEYS = ['osmanthus_cake', 'meat', 'plum_wine', 'wine'];

export const BOARD_RECIPES = {
  osmanthus_cake: {
    name: '桂花糕',
    semanticSteps: ['筛粉', '涂蜜', '撒桂', '出品'],
    img: './assets/dishes/osmanthus_cake.png',
    price: 34,
    props: [
      { id: 'flour', img: './assets/props/flour.png', label: '青瓷糯米粉碗', x: 16, y: 26 },
      { id: 'honey', img: './assets/props/honey.png', label: '琥珀桂花蜜罐', x: 84, y: 26 },
      { id: 'petal', img: './assets/props/petal.png', label: '淡紫金桂碟', x: 16, y: 74 },
      { id: 'knife', img: './assets/props/knife.png', label: '木柄青银菜刀', x: 84, y: 74 }
    ],
    steps: [
{ stageIndex: 0, type: 'tap', propId: 'flour', tag: '第一步 · 筛粉', icon: '👆', hint: '轻点下方高亮的【青瓷糯米粉碗】，将糯米粉筛上木案', poetic: '细腻蓬松的糯米粉落上温润木案，泛起浅蓝柔光。' },
      { stageIndex: 0, type: 'circle', tag: '第二步 · 揉团', icon: '🔄', hint: '在面粉堆上【画圈揉捏】，揉成晶莹素白糕坯', poetic: '指腹缓缓转圈揉捏，水汽散开，蜕变为温润玉白糕坯。' },
      { stageIndex: 1, type: 'tap', propId: 'honey', tag: '第三步 · 执蜜勺', icon: '👆', hint: '轻点下方高亮的【琥珀桂花蜜罐】，蘸取透亮花蜜', poetic: '提起木蜜勺，琥珀色金桂花蜜晶莹欲滴。' },
      { stageIndex: 1, type: 'paint', mode: 'honey', tag: '第四步 · 涂抹蜜汁', icon: '🖌️', hint: '手指按住糕坯【来回涂抹】，亲手刷满琥珀桂花蜜', poetic: '指尖划过之处，温润蜜汁层层铺满素白糕面。' },
      { stageIndex: 2, type: 'tap', propId: 'petal', tag: '第五步 · 取金桂', icon: '👆', hint: '轻点下方高亮的【淡紫金桂碟】，准备点缀碎金桂花', poetic: '指尖轻捻一撮秋日金桂，清香扑鼻。' },
      { stageIndex: 2, type: 'scatter', mode: 'osmanthus', tag: '第六步 · 指哪落哪撒桂', icon: '🌼', hint: '在糕面上【自由点击或轻扫】，指哪落哪撒满金桂', poetic: '碎金桂花随指尖落于蜜面，如秋月洒满玉盘。' },
      { stageIndex: 2, type: 'tap', propId: 'knife', tag: '第七步 · 执刀', icon: '🔪', hint: '轻点下方高亮的【木柄青银菜刀】，准备切块分离', poetic: '执起青银菜刀，准备将糕体切作方正小块。' },
      { stageIndex: 3, type: 'slice', tag: '第八步 · 划刀切块', icon: '↔️', hint: '在糕体上【滑动切过】，切开糕块并装入青花瓷盘', poetic: '银刃轻划，糕块整齐切开分离，盛入淡蓝瓷盘大功告成！' }
    ]
  },
  meat: {
    name: '炙羊肉',
    semanticSteps: ['摆串', '刷油', '撒料', '出品'],
    img: './assets/dishes/meat.png',
    price: 40,
    props: [
      { id: 'raw_meat', img: './assets/props/raw_meat.png', label: '鲜羊排盘', x: 16, y: 26 },
      { id: 'brush', img: './assets/props/brush.png', label: '竹柄油刷', x: 84, y: 26 },
      { id: 'spice', img: './assets/props/spice.png', label: '香草孜然碟', x: 16, y: 74 },
      { id: 'tongs', img: './assets/props/tongs.png', label: '竹夹素木盘', x: 84, y: 74 }
    ],
    steps: [
{ stageIndex: 0, type: 'tap', propId: 'raw_meat', tag: '第一步 · 摆串', icon: '👆', hint: '轻点下方高亮的【鲜羊排盘】，将三串粉嫩羊排铺上木案', poetic: '鲜嫩粉润的羊排串排开在木案上，纹理清晰。' },
      { stageIndex: 1, type: 'tap', propId: 'brush', tag: '第二步 · 执油刷', icon: '👆', hint: '轻点下方高亮的【竹柄油刷】，蘸取清亮胡麻香油', poetic: '竹刷饱蘸胡麻香油，刷毛泛起温润金光。' },
      { stageIndex: 1, type: 'paint', mode: 'oil', tag: '第三步 · 刷油炙烤', icon: '🖌️', hint: '手指在羊排上【来回刷油】，指尖划过处渐变焦香金黄', poetic: '油刷所过之处，生肉渐渐转为焦香油亮的琥珀炙羊！' },
      { stageIndex: 2, type: 'tap', propId: 'spice', tag: '第四步 · 取香草孜然', icon: '👆', hint: '轻点下方高亮的【香草孜然碟】，准备点缀提香', poetic: '翠绿香草叶与金黄孜然粒已备好。' },
      { stageIndex: 2, type: 'scatter', mode: 'herbs', tag: '第五步 · 自由撒料', icon: '🌿', hint: '在肉串上【点击或轻扫】，指哪撒哪点缀香草与孜然', poetic: '翠叶与孜然均匀落满炙羊表面，香气四溢。' },
      { stageIndex: 3, type: 'tap', propId: 'tongs', tag: '第六步 · 夹起装盘', icon: '🥢', hint: '轻点下方高亮的【竹夹素木盘】，将炙羊肉盛入陶盘', poetic: '竹夹轻拢，油亮焦香的汴京炙羊肉已盛盘备妥！' }
    ]
  },
  plum_wine: {
    name: '青梅酿',
    semanticSteps: ['投梅', '注酒', '搅匀', '出品'],
    img: './assets/dishes/plum_wine.png',
    price: 34,
    props: [
      { id: 'plums', img: './assets/props/plums.png', label: '鲜青梅碟', x: 16, y: 26 },
      { id: 'plum_jug', img: './assets/props/plum_jug.png', label: '琥珀酒壶', x: 84, y: 26 },
      { id: 'sugar', img: './assets/props/sugar.png', label: '晶莹冰糖碟', x: 16, y: 74 },
      { id: 'spoon', img: './assets/props/spoon.png', label: '长柄木匙', x: 84, y: 74 }
    ],
    steps: [
{ stageIndex: 0, type: 'tap', propId: 'plums', tag: '第一步 · 取青梅', icon: '👆', hint: '轻点下方高亮的【鲜青梅碟】，准备将青梅投入琉璃坛', poetic: '带着晨露的脆嫩青梅已备妥，琉璃坛泛起欧泊柔光。' },
      { stageIndex: 0, type: 'scatter', mode: 'plums', tag: '第二步 · 投梅入坛', icon: '🟢', hint: '在琉璃坛内【自由点击投放】，一颗颗放入脆嫩青梅', poetic: '青梅颗颗落入剔透琉璃坛，清翠动人。' },
      { stageIndex: 1, type: 'tap', propId: 'plum_jug', tag: '第三步 · 执琥珀壶', icon: '👆', hint: '轻点下方高亮的【琥珀酒壶】，准备缓注陈年酒液', poetic: '提起琥珀琉璃酒壶，酒香清冽柔和。' },
      { stageIndex: 1, type: 'hold', tag: '第四步 · 长按注酒', icon: '⏳', hint: '【长按琉璃坛】，让琥珀酒液自下而上漫过青梅', poetic: '酒液潺潺上升漫过翠梅，酸甜清香在坛中荡漾。' },
      { stageIndex: 2, type: 'tap', propId: 'sugar', tag: '第五步 · 投晶莹冰糖', icon: '👆', hint: '轻点下方高亮的【晶莹冰糖碟】，投入冰糖调和酸甜', poetic: '晶莹冰糖沉入坛底，静待融化人间离愁。' },
      { stageIndex: 2, type: 'tap', propId: 'spoon', tag: '第六步 · 执木匙', icon: '👆', hint: '轻点下方高亮的【长柄木匙】，准备轻搅融合梅香', poetic: '执起温润木匙，轻轻探入琥珀酒液之中。' },
      { stageIndex: 3, type: 'circle', tag: '第七步 · 画圈搅匀', icon: '🔄', hint: '在坛口【画圈搅拌】，令梅香与蜜意交融成酿', poetic: '酒面漾开温柔漩涡，一坛青梅酿已然大成！' }
    ]
  },
  wine: {
    name: '温酒',
    semanticSteps: ['注酒', '拨炭', '扇风', '出品'],
    img: './assets/dishes/wine.png',
    price: 30,
    props: [
      { id: 'wine_jar', img: './assets/props/wine_jar.png', label: '清酒坛', x: 16, y: 26 },
      { id: 'stove', img: './assets/props/stove.png', label: '小泥炉', x: 84, y: 26 },
      { id: 'fan', img: './assets/props/fan.png', label: '竹编蒲扇', x: 66, y: 80 },
      { id: 'cup', img: './assets/props/cup.png', label: '温酒瓷杯', x: 84, y: 80 }
    ],
    steps: [
{ stageIndex: 0, type: 'tap', propId: 'wine_jar', tag: '第一步 · 启清酒坛', icon: '👆', hint: '轻点下方高亮的【清酒坛】，准备将清酒注入青瓷壶', poetic: '启封珊瑚布封口的清酒坛，醇厚米香扑面而来。' },
      { stageIndex: 0, type: 'hold', tag: '第二步 · 长按注酒', icon: '⏳', hint: '【长按青瓷壶】，缓缓注满琥珀清酒', poetic: '清酒顺壶口流淌，叮咚如山间清泉。' },
      { stageIndex: 1, type: 'tap', propId: 'stove', tag: '第三步 · 拨炭生火', icon: '👆', hint: '轻点下方高亮的【小泥炉】，点亮炉中红炭准备温酒', poetic: '红泥小火炉微微发亮，青瓷壶安稳落座。' },
      { stageIndex: 1, type: 'tap', propId: 'fan', tag: '第四步 · 执蒲扇', icon: '👆', hint: '轻点下方高亮的【竹编蒲扇】，准备轻扇控温', poetic: '执起竹编蒲扇，火候讲求不急不躁、恰到好处。' },
      { stageIndex: 2, type: 'rub', tag: '第五步 · 扇风温酒', icon: '↕️', hint: '在泥炉旁【上下轻滑扇风】，见红炭渐旺、白汽袅袅升起', poetic: '微风拂过红炭，壶口渐渐升起一缕珠光白汽！' },
      { stageIndex: 3, type: 'tap', propId: 'cup', tag: '第六步 · 滤渣斟杯', icon: '👆', hint: '轻点下方高亮的【温酒瓷杯】，斟酒装盘敬予客官', poetic: '一盏暖意融融的温酒斟满，正待知音品鉴。' }
    ]
  }
};

export const UPGRADES = [
  { id: 'gold_sign', name: '御街金字招牌', desc: '全店菜品售价 +20%，客官耐心 +8秒', baseCost: 75, maxLevel: 3 },
  { id: 'tea_service', name: '雅座奉茶礼', desc: '每次上菜额外获得 +2 文心与 +2 商誉', baseCost: 90, maxLevel: 2 }
];

export const OPENING_SCENES = [
  { tag: '卷首 · 汴梁夜色', text: '汴京灯火彻夜明，半城诗酒半城金。文人墨客求一醉，市井商贾算千银。' },
  { tag: '入肆 · 梦华开市', text: '一盏青灯照文心，两袖算盘定商道。推门便是梦华楼——今夜，掌柜开市。' }
];

export const GUEST_POOL = [
  {
    id: 'scholar', name: '落榜书生', profile: { identity: '江南寒门举子', origin: '赴京科考落第，暂居御街客栈卖字维生', preference: '偏好清酒与素雅细点，重礼节轻浮华', hiddenNeed: '渴望得人敬重体面，若获资助购墨，次夜必有厚报' }, badge: '书生', img: './assets/portraits/scholar.png',
    lines: ['借酒消愁，劳烦掌柜亲手备一份。', '夜市灯火暖人，来份细点配酒。'],
    postServe: {
      text: '掌柜好手艺！只是在下今科落第，囊中羞涩，不知掌柜可愿听我吟诗一首，聊作谢礼？',
      choices: [
        {
          title: '赠茶结缘 · 免半价请君赋诗', tag: '儒雅文商',
          effects: [{ type: 'wenxin', delta: 8 }, { type: 'rep', delta: 6 }],
          silver: 0, rep: 6, wenxin: 8, codex: 'market_humanity'
        },
        {
          title: '顺势推销 · 再荐招牌桂花糕', tag: '落袋为安',
          effects: [{ type: 'silver', delta: 22 }, { type: 'rep', delta: -2 }],
          silver: 22, rep: -2, wenxin: 0
        }
      ]
    }
  },
  {
    id: 'foodie', name: '御街食客', profile: { identity: '汴京老饕坊主', origin: '熟稔樊楼与御街各家酒肆掌故，常携友寻味', preference: '钟爱炙羊肉与桂花糕，讲究火候与卖相', hiddenNeed: '诚心切磋手艺可换取满街口碑相传' }, badge: '食客', img: './assets/portraits/foodie.png',
    lines: ['闻着梦华楼的香味来的，请掌柜费心！', '听说掌柜手作最是讲究，来一份！'],
    postServe: {
      text: '妙哉妙哉！这滋味竟比樊楼还要清爽几分！掌柜这手艺，可愿透露几分秘诀？',
      choices: [
        {
          title: '畅谈火候匠心 · 邀其常来', tag: '以诚待客',
          effects: [{ type: 'rep', delta: 8 }, { type: 'wenxin', delta: 4 }],
          silver: 0, rep: 8, wenxin: 4, codex: 'market_humanity'
        },
        {
          title: '笑称秘方金贵 · 爽快收赏', tag: '商贾机敏',
          effects: [{ type: 'silver', delta: 28 }],
          silver: 28, rep: 0, wenxin: 0
        }
      ]
    }
  },
  {
    id: 'constable', name: '夜巡捕快', profile: { identity: '开封府御街巡夜差役', origin: '每夜巡行州桥至御街，最知夜市冷暖与客流风向', preference: '爱吃热乎顶饱的炙羊肉与温酒', hiddenNeed: '奉茶相敬可增商誉，闲谈亦能探得御街商情' }, badge: '捕快', img: './assets/portraits/constable.png',
    lines: ['汴梁夜深露重，整口热乎的垫垫肚子。', '不急不急，掌柜慢慢做。'],
    postServe: {
      text: '多谢掌柜！近来御街夜市人潮汹涌，我巡夜路过此处，见你家灯火最是安稳有序。',
      choices: [
        {
          title: '再奉热茶 · 谢其守护御街', tag: '口碑相传',
          effects: [{ type: 'rep', delta: 10 }, { type: 'wenxin', delta: 4 }],
          silver: 0, rep: 10, wenxin: 4, codex: 'market_humanity'
        },
        {
          title: '打听御街商情与贵客动向', tag: '商情敏锐',
          effects: [{ type: 'silver', delta: 20 }, { type: 'rep', delta: 2 }, { type: 'wenxin', delta: 2 }],
          silver: 20, rep: 2, wenxin: 2, codex: 'market_intel'
        }
      ]
    }
  },
  {
    id: 'painter', name: '汴京画师', profile: { identity: '市井风俗画师', origin: '立志绘成《汴梁夜市图》，常在运河柳岸写生', preference: '喜青梅酿与桂花糕，痴迷清透器物光影', hiddenNeed: '资助采买石青金粉，第3夜成画后必带重金与满城盛誉归来' }, badge: '画师', img: './assets/portraits/painter.png',
    lines: ['刚画完御街灯火，来梦华楼歇歇脚。', '劳烦掌柜备一味清雅吃食。'],
    postServe: {
      text: '掌柜案板上的光影与配色实在清透！我正欲画一幅《汴梁夜市图》，可否将梦华楼画入卷中？',
      choices: [
        {
          title: '欣然应允 · 赠青梅酿一盏', tag: '风雅名扬',
          effects: [{ type: 'wenxin', delta: 10 }, { type: 'rep', delta: 6 }],
          silver: 0, rep: 6, wenxin: 10, codex: 'market_humanity'
        },
        {
          title: '请画师顺手题绘招牌灯笼', tag: '门面生辉',
          effects: [{ type: 'silver', delta: 24 }, { type: 'rep', delta: 4 }, { type: 'wenxin', delta: 2 }],
          silver: 24, rep: 4, wenxin: 2
        }
      ]
    }
  },
  {
    id: 'heroine', name: '江湖女侠', profile: { identity: '行侠南北的剑客', origin: '路过汴京歇脚，最看重掌柜是否重义轻利', preference: '大口吃炙羊肉、痛饮温酒，爽快给赏', hiddenNeed: '谈及义利之辨时，坚守“以义制利”最得其敬重' }, badge: '侠客', img: './assets/portraits/heroine.png',
    lines: ['好酒好肉尽管端来，赏银少不了你的！', '掌柜手艺名不虚传，请吧。'],
    postServe: {
      text: '痛快！走南闯北这么些年，头一回在酒楼里吃得这般松弛惬意。掌柜，你开店图的是利，还是义？',
      choices: [
        {
          title: '“以义制利，方能长久。”', tag: '侠商风骨',
          effects: [{ type: 'wenxin', delta: 8 }, { type: 'rep', delta: 8 }],
          silver: 0, rep: 8, wenxin: 8, codex: 'righteous_merchant'
        },
        {
          title: '“明码标价，童叟无欺。”', tag: '诚信生财',
          effects: [{ type: 'silver', delta: 30 }, { type: 'rep', delta: 4 }],
          silver: 30, rep: 4, wenxin: 0
        }
      ]
    }
  }
];

export const CODEX_ENTRIES = [
  {
    id: 'menghualu_tavern', title: '汴京酒楼与夜市商道', source: '《东京梦华录》',
    quote: '“凡京师酒店，门首皆缚彩楼欢门……夜市直至三更尽，才五更又复开张。”',
    note: '商道解读：宋代打破唐代坊市与宵禁制度，商业时间延伸至深夜。酒楼通过迎客礼仪与沉浸式服务吸引客流，奠定了古代餐饮服务业的雏形。',
    unlockHint: '开市营业即可解锁'
  },
  {
    id: 'menghualu_food', title: '烟火市井与手作匠心', source: '《东京梦华录》',
    quote: '“酒楼下有炙羊肉、梅花酒、细点茶果，各具风味。”',
    note: '商道解读：汴京餐饮高度专业化，揉粉、刷油、浸梅、温酒皆有法度，体现了宋代商业的“差异化产品矩阵与匠心品质”。',
    unlockHint: '在木案板亲手完成任意一道菜品解锁'
  },
  {
    id: 'changganxing_libai', title: '太白遗墨与文化招牌', source: '李白《长干行》',
    quote: '“郎骑竹马来，绕床弄青梅。同居长干里，两小无嫌猜。”',
    note: '文学与商道：宋人读唐诗如今天人读经典。梦华楼珍藏前朝太白题壁，文人慕名而来，一面诗墙即“文化招牌”。借古人之笔添今日之誉，是最早的品牌资产经营。',
    unlockHint: '款待太白遗风醉客并触发双立绘剧情解锁'
  },
  {
    id: 'jiangxiaxing_wife', title: '远行商旅与商妇情思', source: '李白《江夏行》',
    quote: '“忆昔娇小姿，春心亦自持……嫁作商人妇，长年守空闺。”',
    note: '文学与商道：唐宋水路贸易繁荣，“重利轻别离”成为时代缩影。酒楼不仅是交易之所，更是承载人间离愁与共情的公共空间。宋人常借唐诗理解当世商妇之苦，文学是时代的镜子。',
    unlockHint: '触发江夏商妇对话剧情解锁'
  },
  {
    id: 'righteous_merchant', title: '义利之辨 · 儒商格局', source: '传统商道思想',
    quote: '“君子爱财，取之有道；以义制利，商誉长青。”',
    note: '商道解读：面对失意客官，兜售高价烈酒虽能赚取一时暴利，却损及商誉；以青梅酿温言安抚，赢得文心与口碑，正是“逐利贾商”与“儒雅文商”的分水岭。',
    unlockHint: '在商妇抉择中选择青梅酿（或文心 ≥ 20）解锁'
  },
  {
    id: 'ledger_reinvest', title: '打烊盘点与资本再投入', source: '《东京梦华录》商肆制度',
    quote: '“日暮结账，核算本利，修葺炉灶，以待来朝。”',
    note: '商道解读：宋代商铺已形成完善的日清月结账房制度。将当日盈余投入招牌与奉茶礼，提升客单价与美誉度，是商业持续扩张的核心逻辑。',
    unlockHint: '完成第一夜打烊账本结算解锁'
  },
  {
    id: 'market_intel', title: '御街商情与信息套利', source: '《东京梦华录》市井商道',
    quote: '“凡市井行商，先察时令好尚，而后备货定价，百战不殆。”',
    note: '商道解读：推门出街打听今夜热销菜品、提前采买上等原料，正是古代商人的“市场调研与供应链管理”，以信息差提升利润率。',
    unlockHint: '在门外御街打听行情或采买原料解锁'
  },
  {
    id: 'market_humanity', title: '市井人情与长效商誉', source: '宋代酒楼文化',
    quote: '“酒楼非独沽酒之所，乃文人雅集、市井交心之地也。”',
    note: '文学与商道：与书生、画师、捕快、侠客以茶结缘、以诗应和，把一次性交易转化为长期口碑，体现中国传统商业中“和气生财”的深层智慧。',
    unlockHint: '在客官对话或门外奇遇中以情义结缘解锁'
  }
];

export const POEM_EYES = {
  libai: {
    poem: { source: '李白《长干行》', line: '郎骑竹马来，绕床弄青梅。' },
    insights: [
      { text: '借前朝旧墨写当世心事，一面诗墙即百年文脉招牌', correct: true, path: 'wen', wenxinDelta: 3, log: '读懂醉客补壁之心，守住梦华楼前朝文脉' },
      { text: '醉客只是借诗免单，留墨可作明日涨价噱头', correct: false, path: 'trade', wenxinDelta: 0, log: '将墙上太白遗墨视作招徕涨价的商机' },
      { text: '他怀念的是少年故交，温酒足矣不必多言', correct: false, path: 'heart', wenxinDelta: 1, log: '体察醉客思旧之情，静默奉酒相陪' }
    ]
  },
  wife: {
    poem: { source: '李白《江夏行》', line: '嫁作商人妇，长年守空闺。' },
    insights: [
      { text: '她缺的不是酒，是有人听她说话', correct: true, path: 'heart', wenxinDelta: 3, log: '读懂江夏商妇离愁，明白她所求乃倾听而非烈酒' },
      { text: '她恨丈夫，需要烈酒浇愁', correct: false, path: 'trade', wenxinDelta: 0, log: '以为商妇借酒浇愁，顺势推销烈酒' },
      { text: '她在试探这家店值不值得信任', correct: false, path: 'trade', wenxinDelta: 1, log: '将商妇问询视作对酒楼成色的试探' }
    ]
  },
  scholar: {
    poem: { source: '李白《将进酒》', line: '天生我材必有用，千金散尽还复来。' },
    insights: [
      { text: '他落第却未折腰，一壶热茶比施舍更能护住体面', correct: true, path: 'wen', wenxinDelta: 3, log: '读懂落榜书生傲骨，以诗茶相待护其体面' },
      { text: '既无盘缠便该顺势推销细点，商肆本分在营利', correct: false, path: 'trade', wenxinDelta: 0, log: '对落榜书生依商肆本分推销细点' },
      { text: '科场失意最怕冷落，听他吟完半首诗便是慰藉', correct: false, path: 'heart', wenxinDelta: 1, log: '耐心倾听落榜书生吟诗排遣愁绪' }
    ]
  },
  painter: {
    poem: { source: '孟元老《东京梦华录》', line: '夜市直至三更尽，才五更又复开张。' },
    insights: [
      { text: '他画的不是亭台楼阁，是汴梁夜市不灭的人间烟火', correct: true, path: 'wen', wenxinDelta: 3, log: '读懂汴京画师笔下烟火意境，引为雅集知音' },
      { text: '入画可成全城口碑广告，趁机请他题绘灯笼最划算', correct: false, path: 'trade', wenxinDelta: 1, log: '借画师入画之机为梦华楼扩大招牌声势' },
      { text: '彻夜作画最耗心神，一盏清雅青梅酿胜过客套', correct: false, path: 'heart', wenxinDelta: 0, log: '体恤画师彻夜作画辛劳，赠酒相慰' }
    ]
  }
};

export const SPECIAL_GUEST_PROFILES = {
  libai: {
    identity: '追慕太白遗风的汴梁醉客',
    origin: '遍读唐诗三十年，慕名梦华楼粉墙前朝太白题墨而来',
    preference: '唯爱亲手慢温的两壶清酒',
    hiddenNeed: '读懂其补壁诗眼，可触发「诗壁生辉」，令文人墨客纷至沓来'
  },
  wife: {
    identity: '候夫归来的江夏商人妇',
    origin: '夫君行商扬州半年音讯杳然，夜深独坐御街解愁',
    preference: '点一盏青梅酿，实则盼人静听心事',
    hiddenNeed: '若以烈酒逐利虽得百两却损口碑；以青梅温言相慰则得文心与长久人情'
  }
};
