(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  const gameShell = document.querySelector("#game-shell");
  const healthFill = document.querySelector("#health-fill");
  const healthValue = document.querySelector("#health-value");
  const ammoPips = document.querySelector("#ammo-pips");
  const fieldStatus = document.querySelector("#field-status");
  const timerNode = document.querySelector("#timer");
  const recallButton = document.querySelector("#recall-button");
  const recallCount = document.querySelector("#recall-count");
  const joystick = document.querySelector("#joystick");
  const joystickKnob = document.querySelector("#joystick-knob");
  const aimJoystick = document.querySelector("#aim-joystick");
  const aimJoystickKnob = document.querySelector("#aim-joystick-knob");
  const startPanel = document.querySelector("#start-panel");
  const startButton = document.querySelector("#start-button");
  const resultPanel = document.querySelector("#result-panel");
  const resultKicker = document.querySelector("#result-kicker");
  const resultTitle = document.querySelector("#result-title");
  const resultSummary = document.querySelector("#result-summary");
  const restartButton = document.querySelector("#restart-button");
  const sharePlaytestButton = document.querySelector("#share-playtest-button");
  const recordsButton = document.querySelector("#records-button");
  const recordsScreen = document.querySelector("#records-screen");
  const recordsBack = document.querySelector("#records-back");
  const weaponRecords = document.querySelector("#weapon-records");
  const bestRuns = document.querySelector("#best-runs");
  const resultBreakdown = document.querySelector("#result-breakdown");
  const resultUpgrades = document.querySelector("#result-upgrades");
  const pausePanel = document.querySelector("#pause-panel");
  const pauseButton = document.querySelector("#pause-button");
  const resumeButton = document.querySelector("#resume-button");
  const musicVolume = document.querySelector("#music-volume");
  const musicVolumeValue = document.querySelector("#music-volume-value");
  const sfxVolume = document.querySelector("#sfx-volume");
  const sfxVolumeValue = document.querySelector("#sfx-volume-value");
  const exitRunButton = document.querySelector("#exit-run-button");
  const exitConfirmPanel = document.querySelector("#exit-confirm-panel");
  const cancelExitButton = document.querySelector("#cancel-exit-button");
  const confirmExitButton = document.querySelector("#confirm-exit-button");
  const pauseUpgradeList = document.querySelector("#pause-upgrade-list");
  const upgradeScreen = document.querySelector("#upgrade-screen");
  const upgradeTimeLabel = document.querySelector("#upgrade-time-label");
  const upgradeOptions = document.querySelector("#upgrade-options");
  const upgradeDetailScreen = document.querySelector("#upgrade-detail-screen");
  const upgradeDetailBack = document.querySelector("#upgrade-detail-back");
  const upgradeDetailName = document.querySelector("#upgrade-detail-name");
  const upgradeDetailCopy = document.querySelector("#upgrade-detail-copy");
  const upgradePreviewVideo = document.querySelector("#upgrade-preview-video");
  const upgradePreviewCanvas = document.querySelector("#upgrade-preview-canvas");
  const upgradePreviewCtx = upgradePreviewCanvas.getContext("2d");
  const weaponSelectScreen = document.querySelector("#weapon-select-screen");
  const weaponDetailScreen = document.querySelector("#weapon-detail-screen");
  const weaponSelectBack = document.querySelector("#weapon-select-back");
  const weaponDetailBack = document.querySelector("#weapon-detail-back");
  const weaponList = document.querySelector("#weapon-list");
  const lastWeaponLabel = document.querySelector("#last-weapon-label");
  const quickStartWeapon = document.querySelector("#quick-start-weapon");
  const quickStartButton = document.querySelector("#quick-start-button");
  const weaponDetailName = document.querySelector("#weapon-detail-name");
  const weaponPlayDescription = document.querySelector("#weapon-play-description");
  const weaponAttributeList = document.querySelector("#weapon-attribute-list");
  const selectWeaponButton = document.querySelector("#select-weapon-button");
  const weaponPreviewCanvas = document.querySelector("#weapon-preview-canvas");
  const previewCtx = weaponPreviewCanvas.getContext("2d");

  const COLORS = {
    paper: "#f7f7f8",
    ink: "#111111",
    muted: "#666666",
    line: "#d7d7d9",
    accent: "#ff4f00",
    danger: "#e4002b",
    ricochet: "#0066ff",
    fieldCurrent: "#00d9ff",
    fieldEdge: "#004e9a",
    hunterGold: "#ffb000",
    weakpoint: "#e4002b",
    white: "#ffffff"
  };
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const startUiDemoMode = new URLSearchParams(window.location.search).get("start-ui-demo") === "1";
  let startUiDemoReplayTimer = null;

  const MUSIC_VOLUME_STORAGE_KEY = "musicVolume";
  const SFX_VOLUME_STORAGE_KEY = "sfxVolume";
  const DEFAULT_MUSIC_VOLUME = 70;
  const DEFAULT_SFX_VOLUME = 70;
  const RECORDS_STORAGE_KEY = "recallPersonalRecordsV1";
  const MUSIC_DUCK_PROFILES = {
    recall: { depthDb: -2, attackMs: 25, holdMs: 70, releaseMs: 65 },
    fullCharge: { depthDb: -3.5, attackMs: 25, holdMs: 80, releaseMs: 75 },
    sixBurst: { depthDb: -4.5, attackMs: 25, holdMs: 110, releaseMs: 85 },
    uiStart: { depthDb: -2, attackMs: 20, holdMs: 45, releaseMs: 55 },
    uiContinue: { depthDb: -1.5, attackMs: 18, holdMs: 35, releaseMs: 47 },
    uiExit: { depthDb: -1, attackMs: 20, holdMs: 50, releaseMs: 70 }
  };

  const MUSIC_TRACKS = {
    selection: { src: "audio_demos/scene_pack_v4/selection_opening_v4.wav", loop: true },
    combat: { src: "audio_demos/scene_pack_v4/combat_forward_motion_v4.wav", loop: true },
    boss: { src: "audio_demos/scene_pack_v4/boss_weight_and_space_v4.wav", loop: true },
    victory: { src: "audio_demos/scene_pack_v4/victory_bright_release_v4.wav", loop: false },
    results: { src: "audio_demos/scene_pack_v4/results_calm_return_v4.wav", loop: true }
  };

  const UPGRADE_PREVIEW_VIDEOS = {
    hunter: "skill_preview_videos/hunter_mark.webm",
    critical: "skill_preview_videos/critical_recall.webm",
    magnet: "skill_preview_videos/encirclement_field.webm",
    fission: "skill_preview_videos/critical_recall.webm",
    huntLoop: "skill_preview_videos/encirclement_field.webm",
    overload: "skill_preview_videos/encirclement_field_advanced.webm"
  };

  const SFX_TRACKS = {
    shot: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_focus_v6/events/shot_v6${variant}.wav`),
    empty: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/empty_v4${variant}.wav`),
    flyby: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/flyby_v4${variant}.wav`),
    impactEnemy: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/impact_enemy_v4${variant}.wav`),
    pierce: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/pierce_v4${variant}.wav`),
    landObstacle: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/land_obstacle_v4${variant}.wav`),
    landRange: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/land_range_v4${variant}.wav`),
    fullChargeLock: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/full_charge_lock_v4${variant}.wav`),
    recallStart: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/recall_start_v4${variant}.wav`),
    lift: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/lift_v4${variant}.wav`),
    recallFlyby: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/recall_flyby_v4${variant}.wav`),
    returnCatch: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/return_catch_v4${variant}.wav`),
    sixReturn: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/six_return_v4${variant}.wav`),
    recallHitLow: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/recall_hit_low_v4${variant}.wav`),
    recallHitMid: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/recall_hit_mid_v4${variant}.wav`),
    recallHitFull: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_focus_v5/events/recall_hit_full_v5${variant}.wav`),
    multiPierce: ["a", "b", "c"].map((variant) => `audio_demos/biubiu_impact_v4/events/multi_pierce_v4${variant}.wav`),
    mergedCombo: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/merged_combo_v4${variant}.wav`),
    sixBurst: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/six_burst_v4${variant}.wav`),
    killNormal: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/kill_normal_v4${variant}.wav`),
    killFull: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/kill_full_v4${variant}.wav`),
    killTailFull: ["a", "b", "c", "d"].map((variant) => `audio_demos/biubiu_impact_v4/events/kill_tail_full_v4${variant}.wav`)
  };

  const UI_SFX_TRACKS = {
    uiStart: ["a", "b", "c"].map((variant) => `audio_demos/ui_click_v1/events/ui_start_v1${variant}.wav`),
    uiBack: ["a", "b", "c"].map((variant) => `audio_demos/ui_click_v1/events/ui_back_v1${variant}.wav`),
    uiContinue: ["a", "b", "c"].map((variant) => `audio_demos/ui_click_v1/events/ui_continue_v1${variant}.wav`),
    uiExit: ["a", "b", "c"].map((variant) => `audio_demos/ui_click_v1/events/ui_exit_v1${variant}.wav`),
    uiWeaponSelect: ["a", "b", "c"].map((variant) => `audio_demos/ui_click_v1/events/ui_weapon_select_v1${variant}.wav`)
  };

  const UI_SFX_CONTRACTS = {
    uiStart: { mergeMs: 100, volume: 0.78, duckProfile: "uiStart" },
    uiBack: { mergeMs: 70, volume: 0.62 },
    uiContinue: { mergeMs: 100, volume: 0.72, duckProfile: "uiContinue" },
    uiExit: { mergeMs: 120, volume: 0.65, duckProfile: "uiExit" },
    uiWeaponSelect: { mergeMs: 55, volume: 0.68 }
  };

  const SFX_CONTRACTS = {
    shot: { priority: 55, mergeMs: 25 },
    empty: { priority: 20, mergeMs: 800 },
    flyby: { priority: 35, mergeMs: 45 },
    impactEnemy: { priority: 58, mergeMs: 25 },
    pierce: { priority: 54, mergeMs: 28 },
    landObstacle: { priority: 52, mergeMs: 35 },
    landRange: { priority: 48, mergeMs: 35 },
    fullChargeLock: { priority: 66, mergeMs: 120 },
    recallStart: { priority: 78, mergeMs: 80 },
    lift: { priority: 50, mergeMs: 28 },
    recallFlyby: { priority: 48, mergeMs: 35 },
    returnCatch: { priority: 62, mergeMs: 32 },
    sixReturn: { priority: 80, mergeMs: 100 },
    recallHitLow: { priority: 72, mergeMs: 32 },
    recallHitMid: { priority: 76, mergeMs: 32 },
    recallHitFull: { priority: 84, mergeMs: 32 },
    multiPierce: { priority: 82, mergeMs: 45 },
    mergedCombo: { priority: 86, mergeMs: 32 },
    sixBurst: { priority: 90, mergeMs: 40 },
    killNormal: { priority: 68, mergeMs: 55 },
    killFull: { priority: 92, mergeMs: 55 },
    killTailFull: { priority: 91, mergeMs: 55 }
  };

  const UPGRADES = {
    hunter: {
      id: "hunter",
      name: "猎手标记",
      compact: "回膛弹连续命中同一目标，暴露弱点并打断攻击。",
      tag: "回膛连击",
      details: [
        ["触发", "仅回膛弹；同一目标第1/2/3次命中推进连击。"],
        ["第二次", "正常回收伤害 +20，暴露弱点3秒。"],
        ["第三次", "正常回收伤害 +20并消耗弱点。"],
        ["控制", "普通敌人定身1秒；精英定身0.6秒；Boss不受控。"],
        ["限制", "每名敌人每批回收最多完成一轮连击。"]
      ]
    },
    critical: {
      id: "critical",
      name: "临界回膛",
      compact: "回收至少3颗落地弹时，释放近身伤害与击退光波。",
      tag: "近身回膛",
      details: [
        ["触发", "一批回收至少3颗落地弹，且90px内有敌人。"],
        ["伤害", "20点；每批回收最多触发一次。"],
        ["范围", "光波实际作用半径45px。"],
        ["击退", "普通45px，精英30px，Boss不击退。"],
        ["回血", "生命小于等于50%时回复最大生命10%，每局最多3次。"],
        ["限制", "不定身、不打断、不抵消远程攻击或投射物。"]
      ]
    },
    magnet: {
      id: "magnet",
      name: "合围磁场",
      compact: "一次回收至少3颗落地弹，形成减速并持续放电的3秒磁场。",
      tag: "三弹成场",
      details: [
        ["触发", "同一批回收至少3颗已落地子弹，不再检查子弹方向或夹角。"],
        ["判定", "回收开始记录资格，最后一弹回手时检查冷却。"],
        ["范围", "固定位置半径120px，持续3秒。"],
        ["减速", "敌人移动速度降低40%，不影响攻击速度。"],
        ["电流伤害", "敌人在磁场内每连续停留满1秒受到10点伤害。"],
        ["冷却", "磁场出现起计6秒；6.0秒及以后可再次触发。"]
      ]
    },
    spread: {
      id: "spread",
      base: "hunter",
      name: "弱点扩散",
      compact: "击破弱点后，将1层标记扩散给120px内的所有敌人。",
      tag: "猎手专精",
      details: [
        ["触发", "回膛弹第三次命中并消耗弱点时。"],
        ["范围", "120px内的所有敌人。"],
        ["效果", "只赋予1层标记，不自动造成伤害。"],
        ["持续", "扩散标记保留6秒。"],
        ["后续", "下一颗回膛弹进入第二段；出膛弹不推进标记。"]
      ]
    },
    echo: {
      id: "echo",
      base: "critical",
      name: "二段回震",
      compact: "六弹触发光波时，1秒后追加第二道击退光波。",
      tag: "回震专精",
      details: [
        ["触发", "一次回收全部6颗落地弹，并成功触发临界回膛。"],
        ["延迟", "1秒后，以玩家当时位置为中心释放。"],
        ["伤害", "20点。"],
        ["范围", "光波实际作用半径90px，颜色与第一道光波一致。"],
        ["击退", "普通90px，精英60px，Boss不击退。"],
        ["限制", "第二道光波不回血。"]
      ]
    },
    charge: {
      id: "charge",
      base: "magnet",
      name: "磁场蓄势",
      compact: "出膛弹穿过磁场蓄力；回膛弹穿过后命中使敌人减速。",
      tag: "磁场专精",
      details: [
        ["出膛弹", "穿过磁场获得1.5秒落地蓄力，每颗一次。"],
        ["回膛弹", "穿过后磁化；命中使敌人减速40%，持续1.5秒。"],
        ["叠加", "跳弹与磁场蓄力取较高值，不叠成3秒。"],
        ["场内敌人", "磁化命中只保留离场后的1.5秒减速尾段。"],
        ["限制", "减速不叠加、不延长、不刷新；完全结束后才可再次施加。"]
      ]
    },
    fission: {
      id: "fission",
      fusion: true,
      name: "裂变震爆",
      compact: "击破弱点时释放120px震爆，并改写附近标记状态。",
      tag: "猎手标记 × 临界回膛",
      details: [
        ["触发", "回膛弹、临界光波或直接伤害击破弱点。"],
        ["震爆", "半径120px，造成25点伤害；颜色与临界光波一致。"],
        ["标记", "命中一层标记时只升级为弱点，本次不会立即引爆。"],
        ["弱点", "命中震爆前已经存在的弱点时消耗弱点并强化破裂反馈。"],
        ["限制", "每批最多连锁3个状态目标；融合伤害不能递归触发融合。"]
      ]
    },
    huntLoop: {
      id: "huntLoop",
      fusion: true,
      name: "猎场闭环",
      compact: "磁场标记敌群；击破场内弱点后，批量制造新弱点。",
      tag: "猎手标记 × 合围磁场",
      details: [
        ["成场", "磁场生成时标记范围内最近6名敌人，不会降低已有弱点。"],
        ["闭环", "击破场内一个弱点，其他一层标记升级为弱点。"],
        ["脉冲", "释放120px、20点电流脉冲。"],
        ["持续", "磁场生成的标记至少保留到磁场结束后2秒。"],
        ["限制", "每个磁场只能触发一次闭环；脉冲不能递归击破新弱点。"]
      ]
    },
    overload: {
      id: "overload",
      fusion: true,
      name: "过载磁脉",
      compact: "回膛弹为磁场充能，最后一弹回手时释放高伤脉冲。",
      tag: "临界回膛 × 合围磁场",
      details: [
        ["成场", "一次回收至少3颗落地弹时立即生成5秒磁场，本批回膛弹全部磁化。"],
        ["3至5弹", "最后一弹回手时释放120px、45点过载脉冲。"],
        ["6弹", "释放160px、100点坍缩脉冲，0.6秒后磁场消失。"],
        ["磁化", "本批首次命中每名敌人时追加10点电伤与1.5秒40%减速。"],
        ["冷却", "过载磁场出现后8秒才能再次生成。"]
      ]
    },
    recallShield: {
      id: "recallShield",
      utility: true,
      name: "回膛护盾",
      compact: "回收至少3颗子弹时获得20点短时护盾。",
      tag: "舒适能力",
      details: [
        ["触发", "一次回收至少3颗落地弹。"],
        ["护盾", "获得20点护盾，持续2.5秒。"],
        ["冷却", "5秒。"],
        ["限制", "护盾不叠加，只刷新为20点。"]
      ]
    },
    magneticStride: {
      id: "magneticStride",
      utility: true,
      name: "磁力步伐",
      compact: "回收至少3颗子弹后短时间提高移动速度。",
      tag: "舒适能力",
      details: [
        ["触发", "一次回收至少3颗落地弹。"],
        ["移动", "移动速度提高20%，持续2秒。"],
        ["冷却", "4秒。"],
        ["限制", "效果不叠加。"]
      ]
    },
    rapidRecall: {
      id: "rapidRecall",
      utility: true,
      name: "快速回收",
      compact: "回膛速度提高30%，接弹范围提高25%。",
      tag: "舒适能力",
      details: [
        ["回膛速度", "所有回膛弹返回速度提高30%。"],
        ["接弹范围", "回手判定范围提高25%。"],
        ["伤害", "不直接提高回膛伤害。"]
      ]
    },
    wideAmp: {
      id: "wideAmp",
      amplifier: true,
      name: "广域增幅",
      compact: "融合范围提高30%，猎场闭环额外扩大扫描数量。",
      tag: "融合增幅",
      details: [
        ["范围", "裂变震爆与过载磁脉半径提高30%。"],
        ["猎场闭环", "扫描上限从6名提高到9名，脉冲范围提高30%。"]
      ]
    },
    highVoltageAmp: {
      id: "highVoltageAmp",
      amplifier: true,
      name: "高压增幅",
      compact: "融合伤害提高40%，猎场闭环获得专属高压数值。",
      tag: "融合增幅",
      details: [
        ["伤害", "裂变震爆与过载磁脉伤害提高40%。"],
        ["猎场闭环", "脉冲伤害提高至35，磁场电伤提高至每秒15点。"]
      ]
    },
    echoAmp: {
      id: "echoAmp",
      amplifier: true,
      name: "回震增幅",
      compact: "0.45秒后追加一次不会递归触发状态的融合伤害。",
      tag: "融合增幅",
      details: [
        ["延迟", "融合爆发0.45秒后在原位置追加伤害。"],
        ["伤害", "裂变与过载重复原伤害的65%。"],
        ["猎场闭环", "追加20点脉冲并轻微牵引敌人。"],
        ["限制", "回震不能推进标记、击破弱点或再次触发融合。"]
      ]
    }
  };

  const BASE_UPGRADE_IDS = ["hunter", "critical", "magnet"];
  const FUSION_BY_PAIR = {
    "critical+hunter": "fission",
    "hunter+magnet": "huntLoop",
    "critical+magnet": "overload"
  };
  const UTILITY_UPGRADE_IDS = ["recallShield", "magneticStride", "rapidRecall"];
  const AMPLIFIER_UPGRADE_IDS = ["wideAmp", "highVoltageAmp", "echoAmp"];
  const UPGRADE_MILESTONES = [25, 50, 70, 105, 135];

  const WEAPONS = {
    biubiu: {
      id: "biubiu",
      name: "biubiu枪",
      available: true,
      controlMode: "auto",
      summary: "自动攻击；均衡直射，命中后穿过敌人再落地。",
      description: "敌人进入射程后自动瞄准并射击，命中后穿过敌人一个身位落地，适合轻操作的基础回收路线。",
      damage: 10,
      rangeScale: 1,
      fireInterval: 0.45,
      postHitTravel: 30,
      bounces: 0,
      fireMode: "continuous",
      recallBaseDamage: 20,
      recallMaxDamage: 50,
      attributes: [
        ["操作方式", "自动瞄准并攻击"],
        ["普通伤害", "10"],
        ["射程", "7个身位"],
        ["射速", "0.45秒/发"],
        ["每次耗弹", "1发"],
        ["满蓄回收", "50"],
        ["命中落点", "穿过1个身位后落地"],
        ["碰墙效果", "立即落地"]
      ]
    },
    stake: {
      id: "stake",
      name: "阵线钉桩枪",
      available: true,
      controlMode: "manual",
      summary: "手动单发；每两颗钉桩组成一条高收益回收阵线。",
      description: "拖动右摇杆只预览方向，松手发射一颗钉桩。每两颗落地钉桩在十个身位内可连成阵线；敌人穿过阵线会被标记，满蓄回收可造成80点伤害。",
      damage: 8,
      rangeScale: 1,
      fireInterval: 0.2,
      postHitTravel: 0,
      bounces: 0,
      fireMode: "release",
      piercesEnemies: true,
      recallBaseDamage: 20,
      recallMaxDamage: 60,
      mechanicRecallMaxDamage: 80,
      attributes: [
        ["操作方式", "拖动瞄准，松手单发"],
        ["普通伤害", "8"],
        ["射程", "约8个身位"],
        ["射速", "由拖动节奏决定"],
        ["每次耗弹", "1发"],
        ["普通满蓄回收", "60"],
        ["标记满蓄回收", "80"],
        ["阵线长度", "最多10个身位"],
        ["子弹特性", "穿过敌人，碰墙落地"]
      ]
    },
    ricochet: {
      id: "ricochet",
      name: "跳弹枪",
      available: true,
      controlMode: "manual",
      summary: "手动连射；低伤快射，碰墙后反弹一次。",
      description: "不会自动攻击。拖动右摇杆时朝指定方向连射，松手立即停火；反弹后的子弹落地时自带蓄势进度。",
      damage: 7,
      rangeScale: 1.08,
      fireInterval: 0.32,
      postHitTravel: 0,
      bounces: 1,
      fireMode: "continuous",
      recallBaseDamage: 20,
      recallMaxDamage: 55,
      mechanicRecallMaxDamage: 72,
      attributes: [
        ["操作方式", "摇杆瞄准并连射"],
        ["普通伤害", "7"],
        ["射程", "8个身位"],
        ["射速", "0.32秒/发"],
        ["每次耗弹", "1发"],
        ["命中落点", "命中位置立即落地"],
        ["碰墙效果", "反弹1次"],
        ["普通满蓄回收", "55"],
        ["反弹满蓄回收", "72"],
        ["反弹奖励", "落地自带1.5秒蓄势"]
      ]
    }
  };

  let selectedWeaponId = localStorage.getItem("lastWeaponId") || "biubiu";
  if (!WEAPONS[selectedWeaponId] || !WEAPONS[selectedWeaponId].available) selectedWeaponId = "biubiu";
  let detailWeaponId = selectedWeaponId;

  const ENEMY_TYPES = {
    chaser: {
      id: "chaser",
      name: "追猎者",
      health: 92,
      radius: 17,
      speed: 165,
      damage: 10
    },
    interceptor: {
      id: "interceptor",
      name: "截击者",
      health: 78,
      radius: 16,
      speed: 112,
      damage: 12
    },
    bomber: {
      id: "bomber",
      name: "投弹者",
      health: 72,
      radius: 16,
      speed: 88,
      bombDamage: 12,
      directDamage: 6
    }
  };

  const PRESSURE_PHASES = [
    { until: 30, target: 5, refill: 0.72, weights: { chaser: 1 } },
    { until: 60, target: 6, refill: 0.68, weights: { chaser: 0.75, interceptor: 0.25 } },
    { until: 75, target: 4, refill: 1.15, weights: { chaser: 1 }, relief: true },
    { until: 105, target: 6, refill: 0.7, weights: { chaser: 0.7, bomber: 0.3 } },
    { until: 150, target: 8, refill: 0.58, weights: { chaser: 0.58, interceptor: 0.22, bomber: 0.2 } },
    { until: 160, target: 5, refill: 1.2, weights: { chaser: 1 }, relief: true },
    { until: 180, target: 10, refill: 0.5, weights: { chaser: 0.55, interceptor: 0.25, bomber: 0.2 } }
  ];

  const CONFIG = {
    runSeconds: 180,
    playerSpeed: 245,
    playerRadius: 15,
    outboundSpeed: 620,
    returnSpeed: 980,
    maxChargeSeconds: 3,
    stakeLineBodyLengths: 10,
    stakeMarkSeconds: 3,
    stakeSlowMultiplier: 0.58,
    magneticFieldDamageInterval: 1,
    magneticFieldDamage: 10,
    hunterMarkAdvanceSeconds: 0.12,
    hunterWeakpointAdvanceSeconds: 0.18,
    spawnWarningSeconds: 2,
    maxEnemies: 12,
    chaserWindupSeconds: 0.45,
    chaserDashSeconds: 0.2,
    chaserDashSpeed: 470,
    chaserRecoverySeconds: 0.6,
    interceptorWindupSeconds: 0.8,
    interceptorLockSeconds: 0.45,
    interceptorLeadSeconds: 0.33,
    interceptorTriggerRange: 360,
    interceptorDashSeconds: 0.42,
    interceptorDashSpeed: 570,
    interceptorRecoverySeconds: 1,
    bomberBombMinDistance: 8 * 30,
    bomberBombMaxDistance: 15 * 30,
    bomberBombCooldown: 3,
    bomberBombWarningSeconds: 1.2,
    bomberBombRadius: 42,
    bomberDirectWindupSeconds: 0.6,
    bomberDirectCooldown: 1.5,
    enemyProjectileSpeed: 320,
    recallHitStopMin: 0.024,
    recallHitStopMax: 0.065,
    maxParticles: 220,
    maxRecallImpacts: 16
  };

  function isVirtualLandscape() {
    const viewport = window.visualViewport;
    const browserWidth = viewport?.width || window.innerWidth;
    const browserHeight = viewport?.height || window.innerHeight;
    return browserHeight > browserWidth;
  }

  function getGameViewportSize() {
    const viewport = window.visualViewport;
    const browserWidth = Math.round(viewport?.width || window.innerWidth);
    const browserHeight = Math.round(viewport?.height || window.innerHeight);
    return isVirtualLandscape()
      ? { width: browserHeight, height: browserWidth }
      : { width: browserWidth, height: browserHeight };
  }

  const initialViewport = getGameViewportSize();
  let width = initialViewport.width;
  let height = initialViewport.height;
  let virtualLandscapeActive = isVirtualLandscape();
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let running = false;
  let paused = false;
  let finished = false;
  let lastTime = performance.now();
  let elapsed = 0;
  let spawnClock = 0;
  let fireClock = 0;
  let nextEnemyId = 1;
  let lockedTargetId = null;
  let kills = 0;
  let recalls = 0;
  let shake = 0;
  let hitStopRemaining = 0;
  let hitStopTime = 0;
  let recallSequenceId = 0;
  let lastHitStopRecallSequence = -1;
  let recallImpactCount = 0;
  let lastRecallImpact = null;
  let nextStakeLineId = 1;
  let pendingStakeLineId = null;
  let pendingStakeBulletId = null;
  let enemyAttacks = [];
  let enemyProjectiles = [];
  let pressurePhaseIndex = 0;
  let damageBySource = {};
  let outgoingDamageBySource = {};
  let acquiredUpgradeIds = [];
  let upgradeChoiceActive = false;
  let upgradeChoiceMilestone = 0;
  let upgradeChoiceIds = [];
  let detailUpgradeId = null;
  let upgradePreviewStartedAt = performance.now();
  let previewCaptureTime = null;
  let nextUpgradeMilestoneIndex = 0;
  let recallBatches = new Map();
  let activeFields = [];
  let nextFieldId = 1;
  let lastFieldActivatedAt = -Infinity;
  let radialWaves = [];
  let pendingWaves = [];
  let pendingFusionPulses = [];
  let fusionStats = createFusionStats();
  let maxEnemiesObserved = 0;
  let maxParticlesObserved = 0;
  let maxRadialWavesObserved = 0;
  let maxDamageLabelsObserved = 0;
  let threatScore = 0;
  let recallKills = 0;
  let fullChargeHits = 0;
  let highestRecallPierce = 0;
  let runRecorded = false;
  let lastFinishedVictory = false;

  function createFusionStats() {
    return {
      fission: 0,
      huntLoop: 0,
      overload: 0,
      overloadPartial: 0,
      overloadSix: 0,
      echo: 0,
      fields: 0,
      recursionBlocked: 0
    };
  }

  const musicPlayers = Object.fromEntries(Object.entries(MUSIC_TRACKS).map(([id, track]) => {
    const audio = new Audio(track.src);
    audio.loop = track.loop;
    audio.preload = id === "selection" ? "auto" : "none";
    return [id, audio];
  }));
  let musicState = "selection";
  let musicUnlocked = false;
  let musicSuspended = false;
  let musicBaseGain = (DEFAULT_MUSIC_VOLUME / 100) ** 2;
  let musicDuck = null;
  let sfxGain = (DEFAULT_SFX_VOLUME / 100) ** 2;
  const sfxCursors = new Map();
  const MAX_SFX_VOICES = 20;
  const sfxVoices = Array.from({ length: MAX_SFX_VOICES }, () => ({
    audio: new Audio(),
    busy: false,
    id: null,
    priority: -Infinity,
    startedAt: 0,
    token: 0
  }));
  const sfxMergeUntil = new Map();
  const uiSfxCursors = new Map();
  const uiSfxMergeUntil = new Map();
  const MAX_UI_SFX_VOICES = 2;
  const uiSfxVoices = Array.from({ length: MAX_UI_SFX_VOICES }, () => ({
    audio: new Audio(),
    busy: false,
    id: null,
    startedAt: 0,
    token: 0
  }));
  let uiDuckRequestId = 0;
  let emptySfxArmed = true;
  let emptySfxCooldownUntil = 0;

  const keys = new Set();
  const joystickState = {
    active: false,
    pointerId: null,
    originX: 0,
    originY: 0,
    x: 0,
    y: 0
  };
  const aimState = { active: false, pointerId: null, originX: 0, originY: 0, x: 0, y: 0 };
  const player = {
    x: width / 2,
    y: height / 2,
    hp: 100,
    maxHp: 100,
    criticalHealsUsed: 0,
    hitCooldown: 0,
    shield: 0,
    shieldUntil: 0,
    shieldCooldownUntil: 0,
    strideUntil: 0,
    strideCooldownUntil: 0,
    facingAngle: -Math.PI / 2,
    moveX: 0,
    moveY: 0
  };
  let bullets = [];
  let enemies = [];
  let obstacles = [];
  let spawnWarnings = [];
  let particles = [];
  let recallImpacts = [];
  let damageLabels = [];

  for (let i = 0; i < 6; i += 1) {
    const pip = document.createElement("span");
    pip.className = "ammo-pip";
    pip.dataset.state = "held";
    ammoPips.appendChild(pip);
  }

  function renderWeaponList() {
    weaponList.replaceChildren();
    Object.values(WEAPONS).filter((weapon) => weapon.available).forEach((weapon) => {
      const button = document.createElement("button");
      button.className = "weapon-tile";
      button.type = "button";
      button.dataset.weapon = weapon.id;
      button.setAttribute("aria-current", String(weapon.id === detailWeaponId));

      const symbol = document.createElement("span");
      symbol.className = "weapon-symbol";
      symbol.dataset.weapon = weapon.id;
      symbol.setAttribute("aria-hidden", "true");

      const name = document.createElement("strong");
      name.textContent = weapon.name;
      const summary = document.createElement("span");
      summary.textContent = weapon.summary;
      button.append(symbol, name, summary);
      button.addEventListener("click", () => {
        const changedWeapon = weapon.id !== detailWeaponId;
        showWeaponDetail(weapon.id);
        if (changedWeapon) playUiSfx("uiWeaponSelect");
      });
      weaponList.appendChild(button);
    });

    const selected = getSelectedWeapon();
    lastWeaponLabel.textContent = `上次使用：${selected.name}`;
    quickStartWeapon.textContent = selected.name;
  }

  function renderWeaponDetail() {
    const weapon = WEAPONS[detailWeaponId];
    weaponDetailName.textContent = weapon.name;
    weaponPlayDescription.textContent = weapon.description;
    weaponAttributeList.replaceChildren();
    weapon.attributes.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "weapon-attribute-row";
      const labelNode = document.createElement("span");
      labelNode.textContent = label;
      const valueNode = document.createElement("span");
      valueNode.textContent = value;
      row.append(labelNode, valueNode);
      weaponAttributeList.appendChild(row);
    });
  }

  function showWeaponSelection() {
    stopUpgradePreviewVideo();
    stopAllSfx();
    running = false;
    paused = false;
    setStartScreenActive(false);
    startPanel.hidden = true;
    resultPanel.hidden = true;
    pausePanel.hidden = true;
    exitConfirmPanel.hidden = true;
    upgradeScreen.hidden = true;
    upgradeDetailScreen.hidden = true;
    recordsScreen.hidden = true;
    weaponDetailScreen.hidden = true;
    weaponSelectScreen.hidden = false;
    renderWeaponList();
    playMusicState("selection");
  }

  function showWeaponDetail(weaponId) {
    detailWeaponId = weaponId;
    weaponSelectScreen.hidden = true;
    weaponDetailScreen.hidden = false;
    renderWeaponDetail();
    playMusicState("selection");
  }

  function showStartPanel() {
    stopUpgradePreviewVideo();
    stopAllSfx();
    running = false;
    paused = false;
    weaponSelectScreen.hidden = true;
    weaponDetailScreen.hidden = true;
    resultPanel.hidden = true;
    pausePanel.hidden = true;
    exitConfirmPanel.hidden = true;
    upgradeScreen.hidden = true;
    upgradeDetailScreen.hidden = true;
    recordsScreen.hidden = true;
    startPanel.hidden = false;
    setStartScreenActive(true, true);
    playMusicState("selection");
  }

  function setStartScreenActive(active, restartAnimation = false) {
    gameShell.classList.toggle("is-start-screen", active);
    window.clearTimeout(startUiDemoReplayTimer);
    startUiDemoReplayTimer = null;
    if (!active) return;
    if (restartAnimation) replayStartScreenAnimation();
    scheduleStartUiDemoReplay();
  }

  function replayStartScreenAnimation() {
    if (reducedMotionQuery.matches || startPanel.hidden) return false;
    startPanel.classList.remove("is-entering");
    void startPanel.offsetWidth;
    startPanel.classList.add("is-entering");
    return true;
  }

  function scheduleStartUiDemoReplay() {
    if (!startUiDemoMode || reducedMotionQuery.matches || startPanel.hidden) return;
    startUiDemoReplayTimer = window.setTimeout(() => {
      replayStartScreenAnimation();
      scheduleStartUiDemoReplay();
    }, 6000);
  }

  function readMusicVolume() {
    const savedValue = localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY);
    if (savedValue === null) return DEFAULT_MUSIC_VOLUME;
    const parsedValue = Number(savedValue);
    return Number.isFinite(parsedValue) ? clamp(parsedValue, 0, 100) : DEFAULT_MUSIC_VOLUME;
  }

  function readSfxVolume() {
    const savedValue = localStorage.getItem(SFX_VOLUME_STORAGE_KEY);
    if (savedValue === null) return DEFAULT_SFX_VOLUME;
    const parsedValue = Number(savedValue);
    return Number.isFinite(parsedValue) ? clamp(parsedValue, 0, 100) : DEFAULT_SFX_VOLUME;
  }

  function setMusicVolume(value, persist = true) {
    const normalizedValue = Math.round(clamp(Number(value) || 0, 0, 100));
    musicVolume.value = String(normalizedValue);
    musicVolumeValue.value = `${normalizedValue}%`;
    musicVolumeValue.textContent = `${normalizedValue}%`;
    if (persist) localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(normalizedValue));
    musicBaseGain = (normalizedValue / 100) ** 2;
    updateMusicDuck();
  }

  function updateMusicDuck(now = performance.now()) {
    let duckGain = 1;
    if (musicDuck) {
      const elapsedMs = now - musicDuck.startedAt;
      const attackEnd = musicDuck.attackMs;
      const holdEnd = attackEnd + musicDuck.holdMs;
      const releaseEnd = holdEnd + musicDuck.releaseMs;
      if (elapsedMs < attackEnd) {
        const progress = clamp(elapsedMs / Math.max(1, musicDuck.attackMs), 0, 1);
        duckGain = 1 + (musicDuck.targetGain - 1) * progress;
      } else if (elapsedMs < holdEnd) {
        duckGain = musicDuck.targetGain;
      } else if (elapsedMs < releaseEnd) {
        const progress = clamp((elapsedMs - holdEnd) / Math.max(1, musicDuck.releaseMs), 0, 1);
        duckGain = musicDuck.targetGain + (1 - musicDuck.targetGain) * progress;
      } else {
        musicDuck = null;
      }
    }
    Object.values(musicPlayers).forEach((audio) => {
      audio.volume = clamp(musicBaseGain * duckGain, 0, 1);
    });
  }

  function duckMusicForRecall(profileId, sequence) {
    const profile = MUSIC_DUCK_PROFILES[profileId] || MUSIC_DUCK_PROFILES.recall;
    if (musicDuck?.sequence === sequence) return;
    musicDuck = {
      ...profile,
      sequence,
      startedAt: performance.now(),
      targetGain: 10 ** (profile.depthDb / 20)
    };
    updateMusicDuck(musicDuck.startedAt);
  }

  function resetMusicDuck() {
    musicDuck = null;
    updateMusicDuck();
  }

  function setSfxVolume(value, persist = true) {
    const normalizedValue = Math.round(clamp(Number(value) || 0, 0, 100));
    sfxVolume.value = String(normalizedValue);
    sfxVolumeValue.value = `${normalizedValue}%`;
    sfxVolumeValue.textContent = `${normalizedValue}%`;
    if (persist) localStorage.setItem(SFX_VOLUME_STORAGE_KEY, String(normalizedValue));
    sfxGain = (normalizedValue / 100) ** 2;
  }

  function pauseAllMusic() {
    Object.values(musicPlayers).forEach((audio) => audio.pause());
  }

  function stopAllSfx() {
    sfxVoices.forEach((voice) => {
      voice.token += 1;
      voice.audio.pause();
      voice.audio.removeAttribute("src");
      voice.audio.load();
      voice.audio.onended = null;
      voice.audio.onerror = null;
      voice.busy = false;
      voice.id = null;
      voice.priority = -Infinity;
      voice.startedAt = 0;
    });
    sfxMergeUntil.clear();
    uiSfxVoices.forEach((voice) => {
      voice.token += 1;
      voice.audio.pause();
      voice.audio.removeAttribute("src");
      voice.audio.load();
      voice.audio.onended = null;
      voice.audio.onerror = null;
      voice.busy = false;
      voice.id = null;
      voice.startedAt = 0;
    });
    uiSfxMergeUntil.clear();
  }

  function playSfx(id, volume = 0.68) {
    if (!musicUnlocked || musicSuspended || paused || upgradeChoiceActive) return;
    const sources = SFX_TRACKS[id];
    if (!sources || sources.length === 0) return;
    const contract = SFX_CONTRACTS[id] || { priority: 50, mergeMs: 0 };
    const now = performance.now();
    if ((sfxMergeUntil.get(id) || 0) > now) return;
    sfxMergeUntil.set(id, now + contract.mergeMs);

    let voice = sfxVoices.find((candidate) => !candidate.busy || candidate.audio.ended);
    if (!voice) {
      voice = sfxVoices
        .slice()
        .sort((a, b) => a.priority - b.priority || a.startedAt - b.startedAt)[0];
      if (!voice || voice.priority >= contract.priority) return;
      voice.token += 1;
      voice.audio.pause();
    }

    const cursor = sfxCursors.get(id) || 0;
    sfxCursors.set(id, cursor + 1);
    const audio = voice.audio;
    const token = voice.token + 1;
    voice.token = token;
    voice.busy = true;
    voice.id = id;
    voice.priority = contract.priority;
    voice.startedAt = now;
    audio.onended = () => {
      if (voice.token !== token) return;
      voice.busy = false;
      voice.id = null;
      voice.priority = -Infinity;
      voice.startedAt = 0;
    };
    audio.onerror = audio.onended;
    audio.volume = clamp(volume, 0, 1) * sfxGain;
    audio.src = sources[cursor % sources.length];
    audio.currentTime = 0;
    audio.play().catch(() => audio.onended());
  }

  function playUiSfx(id) {
    if (!musicUnlocked || musicSuspended || document.hidden) return false;
    const sources = UI_SFX_TRACKS[id];
    const contract = UI_SFX_CONTRACTS[id];
    if (!sources || !contract) return false;
    const now = performance.now();
    if ((uiSfxMergeUntil.get(id) || 0) > now) return false;
    uiSfxMergeUntil.set(id, now + contract.mergeMs);

    let voice = uiSfxVoices.find((candidate) => candidate.busy && candidate.id === id);
    if (!voice) voice = uiSfxVoices.find((candidate) => !candidate.busy || candidate.audio.ended);
    if (!voice) voice = uiSfxVoices.slice().sort((a, b) => a.startedAt - b.startedAt)[0];
    if (!voice) return false;
    if (voice.busy) {
      voice.token += 1;
      voice.audio.pause();
    }

    const cursor = uiSfxCursors.get(id) || 0;
    uiSfxCursors.set(id, cursor + 1);
    const token = voice.token + 1;
    voice.token = token;
    voice.busy = true;
    voice.id = id;
    voice.startedAt = now;
    const media = voice.audio;
    media.onended = () => {
      if (voice.token !== token) return;
      voice.busy = false;
      voice.id = null;
      voice.startedAt = 0;
    };
    media.onerror = media.onended;
    media.volume = contract.volume * sfxGain;
    media.src = sources[cursor % sources.length];
    media.currentTime = 0;
    media.play().catch(() => media.onended());
    if (contract.duckProfile) {
      uiDuckRequestId += 1;
      duckMusicForRecall(contract.duckProfile, `ui:${id}:${uiDuckRequestId}`);
    }
    return true;
  }

  function playEmptySfx() {
    const now = performance.now();
    if (!emptySfxArmed || now < emptySfxCooldownUntil) return;
    emptySfxArmed = false;
    emptySfxCooldownUntil = now + 800;
  }

  function playUpgradePreviewVideo(id) {
    const source = UPGRADE_PREVIEW_VIDEOS[id];
    upgradeDetailCopy.parentElement.classList.toggle("is-copy-only", !source);
    if (!source) {
      stopUpgradePreviewVideo();
      upgradePreviewCanvas.hidden = true;
      return;
    }
    upgradePreviewVideo.pause();
    upgradePreviewVideo.muted = true;
    upgradePreviewVideo.src = source;
    upgradePreviewVideo.currentTime = 0;
    upgradePreviewVideo.hidden = false;
    upgradePreviewCanvas.hidden = true;
    upgradePreviewVideo.load();
    upgradePreviewVideo.play().catch(() => {});
  }

  function stopUpgradePreviewVideo() {
    upgradePreviewVideo.pause();
    upgradePreviewVideo.removeAttribute("src");
    upgradePreviewVideo.load();
    upgradePreviewVideo.hidden = true;
    upgradePreviewCanvas.hidden = false;
  }

  function playMusicState(nextState, restart = false) {
    if (!musicPlayers[nextState]) return;
    const previousState = musicState;
    musicState = nextState;
    Object.entries(musicPlayers).forEach(([id, audio]) => {
      if (id !== nextState) audio.pause();
    });
    const audio = musicPlayers[nextState];
    if (restart || previousState !== nextState || audio.ended) audio.currentTime = 0;
    if (!musicUnlocked || musicSuspended || paused || upgradeChoiceActive || document.hidden) return;
    audio.play().catch(() => {});
  }

  function resumeCurrentMusic() {
    if (!musicUnlocked || musicSuspended || paused || upgradeChoiceActive || document.hidden) return;
    const audio = musicPlayers[musicState];
    if (audio) audio.play().catch(() => {});
  }

  function unlockMusic() {
    if (musicUnlocked) {
      resumeCurrentMusic();
      return;
    }
    musicUnlocked = true;
    resumeCurrentMusic();
  }

  function readPersonalRecords() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY) || "{}");
      return {
        weaponBest: parsed.weaponBest && typeof parsed.weaponBest === "object" ? parsed.weaponBest : {},
        bestRuns: Array.isArray(parsed.bestRuns) ? parsed.bestRuns.slice(0, 5) : []
      };
    } catch (_error) {
      return { weaponBest: {}, bestRuns: [] };
    }
  }

  function formatLocalDate(date = new Date()) {
    const parts = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ];
    return `${parts.join("-")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function getTechniqueScore() {
    const pierceScore = Math.max(0, highestRecallPierce - 1) * 8;
    const recallRateScore = kills >= 10 ? Math.round((recallKills / Math.max(1, kills)) * 20) : 0;
    return recallKills * 5 + fullChargeHits * 2 + pierceScore + recallRateScore;
  }

  function getTotalScore() {
    return threatScore + getTechniqueScore();
  }

  function buildRunRecord(victory) {
    return {
      score: getTotalScore(),
      weaponId: selectedWeaponId,
      weapon: getSelectedWeapon().name,
      date: formatLocalDate(),
      victory,
      time: Math.min(elapsed, CONFIG.runSeconds),
      upgrades: acquiredUpgradeIds.map((id) => UPGRADES[id].name)
    };
  }

  function buildPlaytestReport(victory) {
    const build = document.querySelector('meta[name="app-build"]')?.content || "unknown";
    const activeFusionId = getActiveFusionId();
    const fusionName = activeFusionId ? UPGRADES[activeFusionId]?.name || activeFusionId : "未形成";
    const duration = `${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, "0")}`;
    const damageSummary = Object.entries(outgoingDamageBySource)
      .sort(([, left], [, right]) => right - left)
      .map(([source, amount]) => `${source}: ${Math.round(amount)}`)
      .join(" / ") || "无";
    const upgradeSummary = acquiredUpgradeIds.map((id) => UPGRADES[id]?.name || id).join(" / ") || "无";

    return [
      "# 《回膛：磁弹猎人》真人手机测试报告",
      "",
      "## Session Info",
      `- 日期：${formatLocalDate()}`,
      `- 构建：${build}`,
      `- 设备/系统：[请填写]`,
      `- 运行环境：[微信 / 浏览器 / 其他]`,
      `- 测试者编号：[请填写]`,
      `- 是否首次游玩：[是 / 否]`,
      "",
      "## 本局客观数据",
      `- 结果：${victory ? "完成180秒" : "角色倒下"}`,
      `- 武器：${getSelectedWeapon().name}`,
      `- 用时：${duration}`,
      `- 总分：${getTotalScore()}（威胁 ${threatScore} / 技巧 ${getTechniqueScore()}）`,
      `- 击败：${kills}；回收：${recalls}；回膛击杀：${recallKills}`,
      `- 满蓄命中：${fullChargeHits}；最高贯穿：${highestRecallPierce}`,
      `- 主融合：${fusionName}`,
      `- 升级：${upgradeSummary}`,
      `- 输出来源：${damageSummary}`,
      "",
      "## 无引导观察（由观察者填写）",
      "1. 玩家何时第一次理解‘六弹守恒 + 必须主动回收’？[时间/未理解]",
      "2. 玩家会主动等待落地弹蓄力，还是机械地立刻回收？[观察]",
      "3. 玩家能否说出本局主融合的触发方式与收益？[能 / 部分 / 不能 + 原话]",
      "4. 70秒觉醒后，操作或力量感是否明显变化？[是 / 否 + 原因]",
      "5. 操作是否疲劳？[无 / 轻微 / 明显 + 武器与部位]",
      "6. 猎场闭环、预警、弹道或伤害数字是否互相遮挡？[没有 / 有 + 场景]",
      "7. 玩家是否愿意立刻再开一局？[是 / 否 + 原话]",
      "",
      "## 总评",
      "- 情绪：[投入 / 兴奋 / 平静 / 困惑 / 挫败 / 无聊]",
      "- 难度：[过易 / 合适 / 过难]",
      "- 节奏：[过慢 / 合适 / 过快]",
      "- 最喜欢的瞬间：[请填写]",
      "- 最大痛点：[请填写]",
      "- Bug（含复现步骤）：[请填写]"
    ].join("\n");
  }

  async function sharePlaytestReport() {
    const report = buildPlaytestReport(lastFinishedVictory);
    const originalLabel = sharePlaytestButton.textContent;
    try {
      if (navigator.share) {
        await navigator.share({ title: "回膛：磁弹猎人测试报告", text: report });
        sharePlaytestButton.textContent = "已打开分享";
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(report);
        sharePlaytestButton.textContent = "已复制，填写后发回";
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = report;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("copy failed");
        sharePlaytestButton.textContent = "已复制，填写后发回";
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      sharePlaytestButton.textContent = "分享失败，请截图结算页";
    }
    window.setTimeout(() => {
      sharePlaytestButton.textContent = originalLabel;
    }, 2600);
  }

  function saveRunRecord(victory) {
    if (runRecorded) return;
    runRecorded = true;
    const record = buildRunRecord(victory);
    const records = readPersonalRecords();
    if (!records.weaponBest[selectedWeaponId] || records.weaponBest[selectedWeaponId].score < record.score) {
      records.weaponBest[selectedWeaponId] = record;
    }
    records.bestRuns.push(record);
    records.bestRuns.sort((a, b) => b.score - a.score || b.time - a.time);
    records.bestRuns = records.bestRuns.slice(0, 5);
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  }

  function createRecordRow(record, rank) {
    const row = document.createElement("div");
    row.className = "record-row";
    if (!record) {
      row.innerHTML = `<span>${rank}</span><strong>--</strong><span>暂无记录</span><span class="record-meta">完成一局后保存</span>`;
      return row;
    }
    const status = record.victory ? "完成" : "失败";
    const time = `${Math.floor(record.time / 60)}:${String(Math.floor(record.time % 60)).padStart(2, "0")}`;
    const upgrades = record.upgrades?.length ? record.upgrades.join(" / ") : "无升级";
    row.innerHTML = `<span>${rank}</span><strong>${record.score}</strong><span>${record.weapon}</span><span class="record-meta">${record.date}<br>${status} · ${time} · ${upgrades}</span>`;
    return row;
  }

  function renderRecords() {
    const records = readPersonalRecords();
    weaponRecords.replaceChildren();
    Object.values(WEAPONS).filter((weapon) => weapon.available).forEach((weapon, index) => {
      weaponRecords.appendChild(createRecordRow(records.weaponBest[weapon.id] || null, index + 1));
    });
    bestRuns.replaceChildren();
    for (let index = 0; index < 5; index += 1) {
      bestRuns.appendChild(createRecordRow(records.bestRuns[index] || null, index + 1));
    }
  }

  function showRecords() {
    setStartScreenActive(false);
    startPanel.hidden = true;
    recordsScreen.hidden = false;
    renderRecords();
    playMusicState("selection");
  }

  function renderUpgradeChips(container) {
    container.replaceChildren();
    if (acquiredUpgradeIds.length === 0) {
      const empty = document.createElement("span");
      empty.className = "upgrade-chip is-empty";
      empty.textContent = "暂未获得";
      container.appendChild(empty);
      return;
    }
    acquiredUpgradeIds.forEach((id) => {
      const chip = document.createElement("span");
      chip.className = "upgrade-chip";
      chip.textContent = UPGRADES[id].name;
      container.appendChild(chip);
    });
  }

  function getSelectedBaseUpgradeIds() {
    return BASE_UPGRADE_IDS.filter((id) => hasUpgrade(id));
  }

  function getSelectedFusionId() {
    const key = getSelectedBaseUpgradeIds().slice(0, 2).sort().join("+");
    return FUSION_BY_PAIR[key] || null;
  }

  function getUpgradeChoices(milestone) {
    if (milestone === 25) return BASE_UPGRADE_IDS.slice();
    if (milestone === 50) return BASE_UPGRADE_IDS.filter((id) => !hasUpgrade(id));
    if (milestone === 70) {
      const fusionId = getSelectedFusionId();
      return fusionId ? [fusionId] : [];
    }
    if (milestone === 105) return UTILITY_UPGRADE_IDS.slice();
    if (milestone === 135) return AMPLIFIER_UPGRADE_IDS.slice();
    return [];
  }

  function showUpgradeChoice(milestone) {
    upgradeChoiceActive = true;
    upgradeChoiceMilestone = milestone;
    upgradeChoiceIds = getUpgradeChoices(milestone);
    upgradeTimeLabel.textContent = `${milestone}秒升级`;
    upgradeOptions.replaceChildren();
    upgradeOptions.style.gridTemplateColumns = `repeat(${Math.max(1, upgradeChoiceIds.length)}, minmax(0, 1fr))`;
    upgradeChoiceIds.forEach((id) => {
      const upgrade = UPGRADES[id];
      const card = document.createElement("article");
      card.className = "upgrade-option";
      const name = document.createElement("strong");
      name.className = "upgrade-option-name";
      name.textContent = upgrade.name;
      const copy = document.createElement("span");
      copy.className = "upgrade-option-copy";
      copy.textContent = upgrade.compact;
      const tag = document.createElement("span");
      tag.className = "upgrade-option-tag";
      if (milestone === 50) {
        const pairKey = [...getSelectedBaseUpgradeIds(), id].sort().join("+");
        const fusionId = FUSION_BY_PAIR[pairKey];
        tag.textContent = fusionId ? `选择后融合：${UPGRADES[fusionId].name}` : upgrade.tag;
      } else {
        tag.textContent = upgrade.tag;
      }
      const choose = document.createElement("button");
      choose.className = "upgrade-choose";
      choose.type = "button";
      choose.textContent = milestone === 70 ? "觉醒" : "选择";
      choose.addEventListener("click", () => chooseUpgrade(id));
      const info = document.createElement("button");
      info.className = "upgrade-info";
      info.type = "button";
      info.textContent = "i";
      info.title = `查看${upgrade.name}详情`;
      info.setAttribute("aria-label", `查看${upgrade.name}详情`);
      info.addEventListener("click", () => showUpgradeDetail(id));
      card.append(name, copy, tag, choose, info);
    upgradeOptions.appendChild(card);
    });
    upgradeScreen.hidden = false;
    releaseJoystick();
    releaseAimJoystick(null, true);
    pauseAllMusic();
  }

  function chooseUpgrade(id) {
    if (!upgradeChoiceActive || !upgradeChoiceIds.includes(id)) return;
    if (!acquiredUpgradeIds.includes(id)) acquiredUpgradeIds.push(id);
    upgradeChoiceActive = false;
    upgradeScreen.hidden = true;
    upgradeDetailScreen.hidden = true;
    nextUpgradeMilestoneIndex += 1;
    lastTime = performance.now();
    renderUpgradeChips(pauseUpgradeList);
    resumeCurrentMusic();
  }

  function showUpgradeDetail(id) {
    detailUpgradeId = id;
    upgradePreviewStartedAt = performance.now();
    previewCaptureTime = null;
    const upgrade = UPGRADES[id];
    upgradeDetailName.textContent = upgrade.name;
    upgradeDetailCopy.replaceChildren();
    upgrade.details.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "upgrade-detail-row";
      const name = document.createElement("strong");
      name.textContent = label;
      const copy = document.createElement("span");
      copy.textContent = value;
      row.append(name, copy);
      upgradeDetailCopy.appendChild(row);
    });
    upgradeScreen.hidden = true;
    upgradeDetailScreen.hidden = false;
    playUpgradePreviewVideo(id);
  }

  function closeUpgradeDetail() {
    stopUpgradePreviewVideo();
    upgradeDetailScreen.hidden = true;
    upgradeScreen.hidden = false;
  }

  function startWithWeapon(weaponId) {
    selectedWeaponId = weaponId;
    localStorage.setItem("lastWeaponId", selectedWeaponId);
    startGame();
  }

  function drawPreviewGrid() {
    const w = weaponPreviewCanvas.width;
    const h = weaponPreviewCanvas.height;
    previewCtx.fillStyle = COLORS.paper;
    previewCtx.fillRect(0, 0, w, h);
    previewCtx.strokeStyle = COLORS.line;
    previewCtx.lineWidth = 1;
    previewCtx.beginPath();
    for (let x = 0.5; x < w; x += 40) {
      previewCtx.moveTo(x, 0);
      previewCtx.lineTo(x, h);
    }
    for (let y = 0.5; y < h; y += 40) {
      previewCtx.moveTo(0, y);
      previewCtx.lineTo(w, y);
    }
    previewCtx.stroke();
  }

  function drawPreviewEnemy(x, y) {
    previewCtx.save();
    previewCtx.translate(x, y);
    previewCtx.rotate(Math.PI / 4);
    previewCtx.fillStyle = COLORS.ink;
    previewCtx.fillRect(-15, -15, 30, 30);
    previewCtx.fillStyle = COLORS.paper;
    previewCtx.fillRect(-4, -4, 8, 8);
    previewCtx.restore();
  }

  function drawPreviewBullet(x, y, grounded = false) {
    previewCtx.fillStyle = COLORS.accent;
    if (grounded) {
      previewCtx.strokeStyle = COLORS.accent;
      previewCtx.lineWidth = 2;
      previewCtx.beginPath();
      previewCtx.arc(x, y, 11, 0, Math.PI * 2);
      previewCtx.stroke();
    }
    previewCtx.fillRect(x - 7, y - 3, 14, 6);
  }

  function drawWeaponPreview(now) {
    if (weaponDetailScreen.hidden) return;
    drawPreviewGrid();
    const weapon = WEAPONS[detailWeaponId];
    const cycle = (now / 1000) % 5.2;
    const playerX = 76;
    const playerY = 150;

    previewCtx.fillStyle = COLORS.ink;
    previewCtx.beginPath();
    previewCtx.moveTo(playerX + 18, playerY);
    previewCtx.lineTo(playerX - 12, playerY - 12);
    previewCtx.lineTo(playerX - 8, playerY);
    previewCtx.lineTo(playerX - 12, playerY + 12);
    previewCtx.closePath();
    previewCtx.fill();

    if (weapon.id === "stake") {
      const first = { x: 360, y: 70 };
      const second = { x: 360, y: 230 };
      const firstTravel = clamp(cycle / 0.72, 0, 1);
      const secondTravel = clamp((cycle - 0.82) / 0.72, 0, 1);
      const recall = clamp((cycle - 3.65) / 0.8, 0, 1);

      if (cycle >= 1.54 && cycle < 3.65) {
        previewCtx.strokeStyle = COLORS.accent;
        previewCtx.lineWidth = 5;
        previewCtx.beginPath();
        previewCtx.moveTo(first.x, first.y);
        previewCtx.lineTo(second.x, second.y);
        previewCtx.stroke();
      }

      const enemyProgress = clamp((cycle - 1.75) / 1.35, 0, 1);
      const enemyX = 520 - enemyProgress * 220;
      drawPreviewEnemy(enemyX, 150);
      if (enemyX <= 382 && cycle < 3.65) {
        previewCtx.strokeStyle = COLORS.accent;
        previewCtx.lineWidth = 3;
        previewCtx.setLineDash([5, 4]);
        previewCtx.beginPath();
        previewCtx.arc(enemyX, 150, 25, 0, Math.PI * 2);
        previewCtx.stroke();
        previewCtx.setLineDash([]);
      }

      if (cycle >= 3.65) {
        drawPreviewBullet(first.x + (playerX - first.x) * recall, first.y + (playerY - first.y) * recall);
        drawPreviewBullet(second.x + (playerX - second.x) * recall, second.y + (playerY - second.y) * recall);
      } else {
        drawPreviewBullet(
          playerX + (first.x - playerX) * firstTravel,
          playerY + (first.y - playerY) * firstTravel,
          firstTravel >= 1
        );
        if (cycle >= 0.82) {
          drawPreviewBullet(
            playerX + (second.x - playerX) * secondTravel,
            playerY + (second.y - playerY) * secondTravel,
            secondTravel >= 1
          );
        }
      }
      return;
    }

    if (weapon.id === "ricochet") {
      previewCtx.fillStyle = COLORS.ink;
      previewCtx.fillRect(286, 58, 174, 20);
      drawPreviewEnemy(520, 205);
      previewCtx.strokeStyle = COLORS.accent;
      previewCtx.lineWidth = 2;
      previewCtx.beginPath();
      previewCtx.arc(572, 246, 28, 0, Math.PI * 2);
      previewCtx.stroke();
      previewCtx.fillStyle = COLORS.accent;
      previewCtx.beginPath();
      previewCtx.arc(584, 238, 11, 0, Math.PI * 2);
      previewCtx.fill();
    } else {
      drawPreviewEnemy(305, 150);
      previewCtx.fillStyle = COLORS.ink;
      previewCtx.fillRect(490, 90, 20, 120);
    }

    for (let i = 0; i < 6; i += 1) {
      const launch = i * (weapon.fireInterval * 0.7);
      const local = cycle - launch;
      if (local < 0) continue;

      let landX = weapon.id === "biubiu" ? 350 : 305;
      let landY = 150 + (i - 2.5) * 8;
      if (weapon.id === "ricochet") {
        landX = 555;
        landY = 205 + (i - 2.5) * 8;
      }

      if (cycle >= 3.65) {
        const recall = clamp((cycle - 3.65) / 0.8, 0, 1);
        drawPreviewBullet(
          landX + (playerX - landX) * recall,
          landY + (playerY - landY) * recall,
          recall === 0
        );
        continue;
      }

      const travel = clamp(local / 0.7, 0, 1);
      if (weapon.id === "ricochet") {
        if (travel < 0.52) {
          const first = travel / 0.52;
          drawPreviewBullet(
            playerX + (360 - playerX) * first,
            playerY + (78 - playerY) * first
          );
        } else if (travel < 1) {
          const second = (travel - 0.52) / 0.48;
          drawPreviewBullet(360 + (landX - 360) * second, 78 + (landY - 78) * second);
        } else {
          drawPreviewBullet(landX, landY, true);
        }
      } else if (travel < 1) {
        drawPreviewBullet(playerX + (landX - playerX) * travel, playerY + (landY - playerY) * travel);
      } else {
        drawPreviewBullet(landX, landY, true);
      }
    }
  }

  function drawUpgradePreview(now) {
    if (upgradeDetailScreen.hidden || !detailUpgradeId) return;
    const preview = upgradePreviewCtx;
    const w = upgradePreviewCanvas.width;
    const h = upgradePreviewCanvas.height;
    const previewElapsed = previewCaptureTime === null
      ? Math.max(0, (now - upgradePreviewStartedAt) / 1000)
      : Math.max(0, previewCaptureTime);
    const cycle = previewElapsed % 6;
    preview.fillStyle = COLORS.paper;
    preview.fillRect(0, 0, w, h);
    preview.strokeStyle = COLORS.line;
    preview.lineWidth = 1;
    preview.beginPath();
    for (let x = 0.5; x < w; x += 40) {
      preview.moveTo(x, 0);
      preview.lineTo(x, h);
    }
    for (let y = 0.5; y < h; y += 40) {
      preview.moveTo(0, y);
      preview.lineTo(w, y);
    }
    preview.stroke();

    const drawText = (text, x, y, color = COLORS.ink, size = 13, align = "left", weight = 700) => {
      preview.save();
      preview.fillStyle = color;
      preview.font = `${weight} ${size}px Helvetica, Arial, sans-serif`;
      preview.textAlign = align;
      preview.textBaseline = "middle";
      preview.fillText(text, x, y);
      preview.restore();
    };

    const drawPill = (text, x, y, color = COLORS.ink, align = "left") => {
      preview.save();
      preview.font = "700 12px Helvetica, Arial, sans-serif";
      const textWidth = preview.measureText(text).width;
      const boxWidth = textWidth + 18;
      const left = align === "right" ? x - boxWidth : x;
      preview.fillStyle = COLORS.paper;
      preview.strokeStyle = color;
      preview.lineWidth = 2;
      preview.fillRect(left, y, boxWidth, 25);
      preview.strokeRect(left, y, boxWidth, 25);
      drawText(text, left + 9, y + 13, color, 12);
      preview.restore();
    };

    const drawConditionHeader = (condition, result, resultColor = COLORS.accent) => {
      preview.fillStyle = "rgba(247, 247, 248, 0.96)";
      preview.fillRect(0, 0, w, 42);
      preview.fillStyle = COLORS.paper;
      preview.strokeStyle = COLORS.ink;
      preview.lineWidth = 2;
      preview.fillRect(12, 8, 76, 25);
      preview.strokeRect(12, 8, 76, 25);
      drawText("演示条件", 50, 21, COLORS.ink, 11, "center");
      drawText(condition, 100, 21, COLORS.ink, 11, "left");
      drawPill(result, w - 16, 9, resultColor, "right");
    };

    const drawDemoPlayer = (x, y, angle = 0) => {
      preview.save();
      preview.translate(x, y);
      preview.rotate(angle);
      preview.fillStyle = COLORS.ink;
      preview.beginPath();
      preview.moveTo(18, 0);
      preview.lineTo(-12, -12);
      preview.lineTo(-7, 0);
      preview.lineTo(-12, 12);
      preview.closePath();
      preview.fill();
      preview.fillStyle = COLORS.paper;
      preview.beginPath();
      preview.arc(-1, 0, 4, 0, Math.PI * 2);
      preview.fill();
      preview.restore();
    };

    const drawDemoEnemy = (x, y, options = {}) => {
      preview.save();
      preview.translate(x, y);
      preview.rotate(Math.PI / 4);
      preview.fillStyle = options.flash ? COLORS.weakpoint : COLORS.ink;
      preview.fillRect(-15, -15, 30, 30);
      preview.fillStyle = COLORS.paper;
      preview.fillRect(-4, -4, 8, 8);
      preview.restore();
      if (options.stunned) {
        preview.strokeStyle = COLORS.fieldCurrent;
        preview.lineWidth = 3;
        preview.beginPath();
        preview.arc(x, y - 25, 8, 0, Math.PI * 2);
        preview.stroke();
      }
    };

    const drawReturningBullet = (time, startTime, hitTime, yOffset, playerX, playerY, enemyX, enemyY) => {
      if (time < startTime || time > hitTime + 0.42) return;
      let x;
      let y;
      if (time <= hitTime) {
        const progress = clamp((time - startTime) / Math.max(0.01, hitTime - startTime), 0, 1);
        x = 570 + (enemyX - 570) * progress;
        y = playerY + yOffset + (enemyY - playerY - yOffset) * progress;
      } else {
        const progress = clamp((time - hitTime) / 0.42, 0, 1);
        x = enemyX + (playerX - enemyX) * progress;
        y = enemyY + (playerY - enemyY) * progress;
      }
      preview.strokeStyle = "rgba(255, 79, 0, 0.38)";
      preview.lineWidth = 2;
      preview.beginPath();
      preview.moveTo(x + 18, y);
      preview.lineTo(x + 5, y);
      preview.stroke();
      preview.fillStyle = COLORS.accent;
      preview.fillRect(x - 7, y - 3, 14, 6);
    };

    const drawDamage = (value, x, y, age, color = COLORS.weakpoint) => {
      if (age < 0 || age > 0.75) return;
      preview.save();
      preview.globalAlpha = clamp(1 - age / 0.75, 0, 1);
      drawText(value, x, y - age * 24, color, 20, "center", 800);
      preview.restore();
    };

    const drawHealthBar = (x, y, current, maximum = 250) => {
      preview.fillStyle = COLORS.white;
      preview.strokeStyle = COLORS.ink;
      preview.lineWidth = 2;
      preview.fillRect(x, y, 100, 9);
      preview.strokeRect(x, y, 100, 9);
      preview.fillStyle = COLORS.weakpoint;
      preview.fillRect(x + 1, y + 1, 98 * clamp(current / maximum, 0, 1), 7);
      drawText(`${current}/${maximum}`, x + 50, y - 8, COLORS.ink, 11, "center");
    };

    if (detailUpgradeId === "hunter") {
      const time = previewElapsed % 10;
      const playerX = 92;
      const playerY = 128;
      const enemyX = 458;
      const enemyY = 128;
      const firstHit = 1.8;
      const secondHit = 4.8;
      const thirdHit = 6.3;
      const stunned = time >= thirdHit && time < thirdHit + 1;
      const hp = time < firstHit ? 250 : time < secondHit ? 200 : time < thirdHit ? 130 : 60;

      drawConditionHeader("满蓄3秒 · 仅回膛命中推进", "第三次命中定身", COLORS.fieldEdge);
      drawDemoPlayer(playerX, playerY);

      drawDemoEnemy(enemyX, enemyY, { stunned, flash: time >= thirdHit && time < thirdHit + 0.18 });
      drawHealthBar(enemyX - 50, enemyY - 68, hp);
      drawReturningBullet(time, 1.15, firstHit, -14, playerX, playerY, enemyX, enemyY);
      drawReturningBullet(time, 4.15, secondHit, 0, playerX, playerY, enemyX, enemyY);
      drawReturningBullet(time, 5.65, thirdHit, 14, playerX, playerY, enemyX, enemyY);
      drawDamage("-50", enemyX - 36, enemyY - 34, time - firstHit);
      drawDamage("-70", enemyX, enemyY - 34, time - secondHit);
      drawDamage("-70", enemyX + 36, enemyY - 34, time - thirdHit);

      if (time >= firstHit && time < secondHit) {
        const age = time - firstHit;
        const r = 27;
        if (age < 0.36) {
          const progress = clamp(age / 0.36, 0, 1);
          preview.save();
          preview.globalAlpha = 1 - progress;
          preview.strokeStyle = COLORS.hunterGold;
          preview.lineWidth = 4;
          preview.beginPath();
          preview.arc(enemyX, enemyY, 24 + progress * 22, 0, Math.PI * 2);
          preview.stroke();
          preview.restore();
        }
        preview.strokeStyle = COLORS.ink;
        preview.lineWidth = 5;
        preview.strokeRect(enemyX - r, enemyY - r, r * 2, r * 2);
        preview.strokeStyle = COLORS.hunterGold;
        preview.lineWidth = 3;
        preview.strokeRect(enemyX - r, enemyY - r, r * 2, r * 2);
      }

      if (time >= secondHit && time < thirdHit) {
        const remaining = Math.max(0, 3 - (time - secondHit));
        const ratio = remaining / 3;
        preview.strokeStyle = "rgba(228, 0, 43, 0.22)";
        preview.lineWidth = 5;
        preview.beginPath();
        preview.arc(enemyX, enemyY, 31, 0, Math.PI * 2);
        preview.stroke();
        preview.strokeStyle = COLORS.weakpoint;
        preview.beginPath();
        preview.arc(enemyX, enemyY, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
        preview.stroke();
        drawText(`弱点暴露 ${remaining.toFixed(1)}s`, enemyX, enemyY - 42, COLORS.weakpoint, 12, "center");
      }

      if (time >= thirdHit && time < thirdHit + 0.28) {
        const progress = (time - thirdHit) / 0.28;
        preview.strokeStyle = COLORS.weakpoint;
        preview.lineWidth = 3;
        for (let i = 0; i < 8; i += 1) {
          const angle = i * Math.PI / 4;
          preview.beginPath();
          preview.moveTo(enemyX + Math.cos(angle) * 20, enemyY + Math.sin(angle) * 20);
          preview.lineTo(enemyX + Math.cos(angle) * (24 + progress * 18), enemyY + Math.sin(angle) * (24 + progress * 18));
          preview.stroke();
        }
      }

      if (stunned) {
        const remaining = Math.max(0, 1 - (time - thirdHit));
        drawText("攻击打断", enemyX + 72, enemyY - 12, COLORS.fieldEdge, 13);
        drawText(`定身 ${remaining.toFixed(1)}s`, enemyX + 72, enemyY + 10, COLORS.fieldEdge, 13);
      }
      return;
    }

    if (detailUpgradeId === "critical") {
      const time = previewElapsed % 9.4;
      const playerX = 235;
      const playerY = 128;
      const hitTime = 4.35;
      const knockbackProgress = clamp((time - hitTime) / 0.35, 0, 1);
      const enemyX = 335 + knockbackProgress * 45;

      drawConditionHeader("3颗落地弹 · 90px内有敌人", "光波半径45px · -20 · 击退 · +10生命（3/3）", COLORS.fieldEdge);
      drawDemoPlayer(playerX, playerY);

      const grounded = [
        { x: 455, y: 62 },
        { x: 510, y: 128 },
        { x: 455, y: 194 }
      ];
      grounded.forEach((point, index) => {
        const recallStart = 2.1 + index * 0.22;
        const recallEnd = recallStart + 1.65;
        if (time < 2.05) {
          preview.fillStyle = COLORS.accent;
          preview.fillRect(point.x - 7, point.y - 3, 14, 6);
          preview.strokeStyle = COLORS.ink;
          preview.lineWidth = 2;
          preview.beginPath();
          preview.arc(point.x, point.y, 11, 0, Math.PI * 2);
          preview.stroke();
          drawText(`落地弹 ${index + 1}`, point.x, point.y - 18, COLORS.muted, 10, "center");
        } else if (time < recallEnd) {
          const progress = clamp((time - recallStart) / (recallEnd - recallStart), 0, 1);
          const x = point.x + (playerX - point.x) * progress;
          const y = point.y + (playerY - point.y) * progress;
          preview.strokeStyle = "rgba(255, 79, 0, 0.38)";
          preview.lineWidth = 2;
          preview.beginPath();
          preview.moveTo(x + 20, y);
          preview.lineTo(x + 6, y);
          preview.stroke();
          preview.fillStyle = COLORS.accent;
          preview.fillRect(x - 7, y - 3, 14, 6);
        }
      });

      drawDemoEnemy(enemyX, playerY, { flash: time >= hitTime && time < hitTime + 0.15 });
      if (time >= hitTime && time < hitTime + 0.3) {
        const age = time - hitTime;
        const progress = clamp(age / 0.22, 0, 1);
        const alpha = age <= 0.22 ? 1 : clamp(1 - (age - 0.22) / 0.08, 0, 1);
        preview.save();
        preview.globalAlpha = alpha;
        preview.strokeStyle = COLORS.accent;
        preview.lineWidth = 6;
        preview.beginPath();
        preview.arc(playerX, playerY, 20 + progress * 70, 0, Math.PI * 2);
        preview.stroke();
        preview.restore();
      }

      drawDamage("-20", enemyX, playerY - 35, time - hitTime);
      if (time >= hitTime && time < hitTime + 1.25) {
        drawText("+10生命", playerX, playerY - 45 - (time - hitTime) * 10, "#008f5a", 19, "center", 800);
        drawText("最大生命值的10%", playerX, playerY + 38, "#008f5a", 12, "center");
        drawText("普通敌人击退45px", enemyX, playerY + 42, COLORS.accent, 12, "center");
      }
      if (time >= 2.05 && time < hitTime) {
        drawText("三颗子弹从前方回收", playerX + 36, playerY - 42, COLORS.accent, 12, "left");
      }
      return;
    }

    if (detailUpgradeId === "magnet") {
      const time = previewElapsed % 9.2;
      const originX = 300;
      const originY = 128;
      const fieldStart = 3.65;
      const fieldEnd = 6.65;
      const playerMove = clamp((time - 4.05) / 0.95, 0, 1);
      const playerX = originX - playerMove * 150;
      const points = [
        { x: 387, y: 78 },
        { x: 400, y: 128 },
        { x: 387, y: 178 }
      ];

      drawConditionHeader("同批至少3颗落地弹 · 不限方向", "3秒 · 减速40% · 每秒伤害10", COLORS.fieldEdge);

      if (time < 1.25) {
        drawText("3颗即可成场", originX + 54, originY - 38, COLORS.fieldEdge, 14, "center", 800);
      }

      points.forEach((point, index) => {
        const start = 1.35 + index * 0.2;
        const end = index === 2 ? fieldStart : 2.45 + index * 0.4;
        if (time < start) {
          preview.fillStyle = COLORS.accent;
          preview.fillRect(point.x - 7, point.y - 3, 14, 6);
          preview.strokeStyle = COLORS.ink;
          preview.lineWidth = 2;
          preview.beginPath();
          preview.arc(point.x, point.y, 11, 0, Math.PI * 2);
          preview.stroke();
        } else if (time < end) {
          const progress = clamp((time - start) / Math.max(0.01, end - start), 0, 1);
          const x = point.x + (originX - point.x) * progress;
          const y = point.y + (originY - point.y) * progress;
          preview.strokeStyle = "rgba(0, 217, 255, 0.42)";
          preview.lineWidth = 3;
          preview.beginPath();
          preview.moveTo(point.x, point.y);
          preview.lineTo(x, y);
          preview.stroke();
          preview.fillStyle = COLORS.accent;
          preview.fillRect(x - 7, y - 3, 14, 6);
        }
      });

      if (time >= fieldStart && time < fieldEnd + 0.15) {
        const age = time - fieldStart;
        const expand = clamp(age / 0.25, 0, 1);
        const fade = time <= fieldEnd ? 1 : clamp((fieldEnd + 0.15 - time) / 0.15, 0, 1);
        const radius = 105 * expand;
        preview.save();
        preview.globalAlpha = fade;
        preview.fillStyle = "rgba(0, 217, 255, 0.09)";
        preview.beginPath();
        preview.arc(originX, originY, radius, 0, Math.PI * 2);
        preview.fill();
        preview.strokeStyle = COLORS.ink;
        preview.lineWidth = 5;
        preview.stroke();
        preview.strokeStyle = COLORS.fieldEdge;
        preview.lineWidth = 3;
        preview.stroke();
        preview.strokeStyle = COLORS.fieldCurrent;
        preview.lineWidth = 2;
        for (let i = 0; i < 8; i += 1) {
          const angle = time * 2 + i * 0.82;
          preview.beginPath();
          preview.arc(originX, originY, radius * (0.25 + (i % 4) * 0.17), angle, angle + 0.42);
          preview.stroke();
        }
        preview.restore();
        const remaining = Math.max(0, fieldEnd - time);
        drawText(`磁场 ${remaining.toFixed(1)}s`, originX, originY - 116, COLORS.fieldEdge, 13, "center");
      }

      let enemyX = 520;
      if (time >= 4.2 && time < 5.1) enemyX = 520 - (time - 4.2) * 145;
      else if (time >= 5.1) enemyX = 389 - (time - 5.1) * 35;
      drawDemoEnemy(enemyX, originY);
      if (time >= 5.1 && time < fieldEnd) {
        drawText("进入磁场 · 移速-40%", enemyX, originY + 43, COLORS.fieldEdge, 13, "center");
        drawText("每秒电流伤害 10", enemyX, originY - 42, COLORS.fieldCurrent, 11, "center");
      }
      if (time >= 6.1 && time < fieldEnd) {
        drawText("-10", enemyX, originY - 60 - (time - 6.1) * 18, COLORS.fieldCurrent, 16, "center");
      }

      drawDemoPlayer(playerX, originY);
      if (time >= 4.05 && time < fieldEnd) {
        preview.strokeStyle = "rgba(17, 17, 17, 0.28)";
        preview.setLineDash([4, 5]);
        preview.beginPath();
        preview.moveTo(originX, originY + 22);
        preview.lineTo(playerX, originY + 22);
        preview.stroke();
        preview.setLineDash([]);
        drawText("磁场固定在生成位置", originX, originY + 63, COLORS.muted, 12, "center");
      }
      if (time >= fieldEnd) drawPill("3秒结束 · 进入6秒冷却", w - 16, 48, COLORS.fieldEdge, "right");
      return;
    }

    const playerX = 110;
    const playerY = h / 2;
    preview.fillStyle = COLORS.ink;
    preview.beginPath();
    preview.moveTo(playerX + 18, playerY);
    preview.lineTo(playerX - 12, playerY - 12);
    preview.lineTo(playerX - 8, playerY);
    preview.lineTo(playerX - 12, playerY + 12);
    preview.closePath();
    preview.fill();

    const drawEnemy = (x, y, color = COLORS.ink) => {
      preview.save();
      preview.translate(x, y);
      preview.rotate(Math.PI / 4);
      preview.fillStyle = color;
      preview.fillRect(-14, -14, 28, 28);
      preview.fillStyle = COLORS.paper;
      preview.fillRect(-4, -4, 8, 8);
      preview.restore();
    };

    if (["hunter", "spread"].includes(detailUpgradeId)) {
      const enemyX = 430;
      drawEnemy(enemyX, playerY);
      const hitIndex = Math.min(2, Math.floor(cycle / 1.45));
      for (let i = 0; i <= hitIndex; i += 1) {
        const local = clamp((cycle - i * 1.45) / 0.65, 0, 1);
        const x = 560 + (playerX - 560) * local;
        preview.fillStyle = COLORS.accent;
        preview.fillRect(x - 7, playerY - 3 + i * 4, 14, 6);
      }
      if (hitIndex === 0) {
        preview.strokeStyle = COLORS.hunterGold;
        preview.lineWidth = 4;
        preview.strokeRect(enemyX - 25, playerY - 25, 50, 50);
      } else if (hitIndex >= 1) {
        preview.strokeStyle = COLORS.weakpoint;
        preview.lineWidth = 4;
        preview.beginPath();
        preview.arc(enemyX, playerY, 27 + Math.sin(cycle * Math.PI * 4) * 2, 0.3, Math.PI * 1.55);
        preview.stroke();
      }
      if (detailUpgradeId === "spread" && hitIndex >= 2) {
        const spreadTargets = [
          { x: 500, y: 65 },
          { x: 500, y: h - 65 },
          { x: 555, y: 88 },
          { x: 555, y: h - 88 }
        ];
        spreadTargets.forEach(({ x, y }) => {
          drawEnemy(x, y);
          preview.strokeStyle = COLORS.hunterGold;
          preview.lineWidth = 3;
          preview.strokeRect(x - 21, y - 21, 42, 42);
        });
      }
      return;
    }

    if (["critical", "echo"].includes(detailUpgradeId)) {
      drawEnemy(190, playerY - 45);
      drawEnemy(205, playerY + 48);
      const first = clamp(cycle / 0.3, 0, 1);
      const second = clamp((cycle - 1) / 0.3, 0, 1);
      preview.strokeStyle = COLORS.accent;
      preview.lineWidth = 5;
      preview.globalAlpha = 1 - clamp(cycle / 0.45, 0, 1);
      preview.beginPath();
      preview.arc(playerX, playerY, 20 + first * 25, 0, Math.PI * 2);
      preview.stroke();
      if (detailUpgradeId === "echo" && cycle >= 1 && cycle <= 1.5) {
        preview.globalAlpha = 1 - clamp((cycle - 1) / 0.45, 0, 1);
        preview.beginPath();
        preview.arc(playerX + 35, playerY, 20 + second * 70, 0, Math.PI * 2);
        preview.stroke();
      }
      preview.globalAlpha = 1;
      return;
    }

    const fieldX = 390;
    const fieldY = playerY;
    const fieldPulse = 1 + Math.sin(cycle * 5) * 0.025;
    preview.save();
    preview.translate(fieldX, fieldY);
    preview.scale(fieldPulse, fieldPulse);
    preview.fillStyle = "rgba(0, 217, 255, 0.09)";
    preview.strokeStyle = COLORS.fieldEdge;
    preview.lineWidth = 5;
    preview.beginPath();
    preview.arc(0, 0, 90, 0, Math.PI * 2);
    preview.fill();
    preview.stroke();
    preview.strokeStyle = COLORS.fieldCurrent;
    preview.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const angle = i * Math.PI / 4 + cycle;
      preview.beginPath();
      preview.arc(0, 0, 24 + i * 6, angle, angle + 0.55);
      preview.stroke();
    }
    preview.restore();
    drawEnemy(fieldX + 25, fieldY);
    if (detailUpgradeId === "charge") {
      const travel = (cycle % 2.4) / 2.4;
      const x = 170 + travel * 420;
      preview.fillStyle = travel > 0.5 ? COLORS.fieldCurrent : COLORS.accent;
      preview.fillRect(x - 8, fieldY - 4, 16, 8);
    }
  }

  function createBullet(id) {
    return {
      id,
      state: "held",
      x: player.x,
      y: player.y,
      vx: 0,
      vy: 0,
      traveled: 0,
      maxDistance: 0,
      landingDistance: Infinity,
      bouncesRemaining: 0,
      didBounce: false,
      chargeBonus: 0,
      fieldChargeGranted: false,
      magnetized: false,
      flybyPlayed: false,
      landedAt: 0,
      recallSequence: 0,
      recallCharge: 0,
      recallDamage: 0,
      mechanicRecallDamage: 0,
      weaponId: null,
      stakeLineId: null,
      outboundHits: new Set(),
      returnHits: new Set()
    };
  }

  function resetGame() {
    resetMusicDuck();
    elapsed = 0;
    spawnClock = 0;
    fireClock = 0.2;
    emptySfxArmed = true;
    emptySfxCooldownUntil = 0;
    nextEnemyId = 1;
    lockedTargetId = null;
    kills = 0;
    recalls = 0;
    shake = 0;
    hitStopRemaining = 0;
    hitStopTime = 0;
    recallSequenceId = 0;
    lastHitStopRecallSequence = -1;
    recallImpactCount = 0;
    lastRecallImpact = null;
    nextStakeLineId = 1;
    pendingStakeLineId = null;
    pendingStakeBulletId = null;
    pressurePhaseIndex = 0;
    damageBySource = {};
    outgoingDamageBySource = {};
    acquiredUpgradeIds = [];
    upgradeChoiceActive = false;
    upgradeChoiceMilestone = 0;
    upgradeChoiceIds = [];
    detailUpgradeId = null;
    nextUpgradeMilestoneIndex = 0;
    recallBatches = new Map();
    activeFields = [];
    nextFieldId = 1;
    lastFieldActivatedAt = -Infinity;
    radialWaves = [];
    pendingWaves = [];
    pendingFusionPulses = [];
    fusionStats = createFusionStats();
    maxEnemiesObserved = 0;
    maxParticlesObserved = 0;
    maxRadialWavesObserved = 0;
    maxDamageLabelsObserved = 0;
    threatScore = 0;
    recallKills = 0;
    fullChargeHits = 0;
    highestRecallPierce = 0;
    runRecorded = false;
    lastFinishedVictory = false;
    finished = false;
    paused = false;
    joystickState.active = false;
    joystickState.pointerId = null;
    joystickState.originX = 0;
    joystickState.originY = 0;
    joystickState.x = 0;
    joystickState.y = 0;
    joystick.classList.add("is-hidden");
    joystickKnob.style.transform = "translate(0, 0)";
    aimState.active = false;
    aimState.pointerId = null;
    aimState.x = 0;
    aimState.y = 0;
    aimJoystick.classList.add("is-hidden");
    player.x = width / 2;
    player.y = height / 2;
    player.hp = player.maxHp;
    player.criticalHealsUsed = 0;
    player.hitCooldown = 0;
    player.shield = 0;
    player.shieldUntil = 0;
    player.shieldCooldownUntil = 0;
    player.strideUntil = 0;
    player.strideCooldownUntil = 0;
    player.facingAngle = -Math.PI / 2;
    player.moveX = 0;
    player.moveY = 0;
    bullets = Array.from({ length: 6 }, (_, index) => createBullet(index));
    enemies = [];
    enemyAttacks = [];
    enemyProjectiles = [];
    buildArena();
    spawnWarnings = [];
    particles = [];
    recallImpacts = [];
    damageLabels = [];
    renderUpgradeChips(pauseUpgradeList);
    for (let i = 0; i < 3; i += 1) queueEnemySpawn("chaser");
    updateHud();
  }

  function resize() {
    const oldWidth = width || window.innerWidth;
    const oldHeight = height || window.innerHeight;
    const viewport = getGameViewportSize();
    const nextVirtualLandscape = isVirtualLandscape();
    const orientationModeChanged = virtualLandscapeActive !== nextVirtualLandscape;
    virtualLandscapeActive = nextVirtualLandscape;
    width = viewport.width;
    height = viewport.height;
    document.documentElement.style.setProperty("--game-width", `${width}px`);
    document.documentElement.style.setProperty("--game-height", `${height}px`);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (oldWidth && oldHeight) {
      const sx = width / oldWidth;
      const sy = height / oldHeight;
      player.x *= sx;
      player.y *= sy;
      bullets.forEach((bullet) => {
        if (bullet.state !== "held") {
          bullet.x *= sx;
          bullet.y *= sy;
        }
      });
      enemies.forEach((enemy) => {
        enemy.x *= sx;
        enemy.y *= sy;
      });
      spawnWarnings.forEach((warning) => {
        warning.x *= sx;
        warning.y *= sy;
      });
      enemyAttacks.forEach((attack) => {
        attack.x *= sx;
        attack.y *= sy;
        if (Number.isFinite(attack.sourceX)) attack.sourceX *= sx;
        if (Number.isFinite(attack.sourceY)) attack.sourceY *= sy;
      });
      enemyProjectiles.forEach((projectile) => {
        projectile.x *= sx;
        projectile.y *= sy;
      });
    }
    if (orientationModeChanged) {
      releaseJoystick();
      releaseAimJoystick(null, true);
    }
    buildArena();
    clampPlayer();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getSelectedWeapon() {
    return WEAPONS[selectedWeaponId];
  }

  function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function buildArena() {
    const blockWidth = clamp(width * 0.13, 84, 148);
    const blockHeight = clamp(height * 0.06, 18, 30);
    const centers = [
      [0.34, 0.37],
      [0.66, 0.37],
      [0.34, 0.69],
      [0.66, 0.69]
    ];
    obstacles = centers.map(([x, y]) => ({
      x: width * x - blockWidth / 2,
      y: height * y - blockHeight / 2,
      width: blockWidth,
      height: blockHeight
    }));
  }

  function getAttackRange() {
    return clamp(Math.min(width, height) * 0.68, 230, 360) * getSelectedWeapon().rangeScale;
  }

  function getStakeLineMaxDistance() {
    return CONFIG.playerRadius * 2 * CONFIG.stakeLineBodyLengths;
  }

  function distanceToSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y);
    const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
    return Math.hypot(point.x - (start.x + dx * t), point.y - (start.y + dy * t));
  }

  function segmentIntersectsCircle(x1, y1, x2, y2, circle) {
    return distanceToSegment(circle, { x: x1, y: y1 }, { x: x2, y: y2 }) <= circle.radius;
  }

  function hasUpgrade(id) {
    return acquiredUpgradeIds.includes(id);
  }

  function createUpgradeSnapshot() {
    return new Set(acquiredUpgradeIds);
  }

  function snapshotHasUpgrade(owner, id) {
    return owner?.upgradeIds instanceof Set ? owner.upgradeIds.has(id) : hasUpgrade(id);
  }

  function getActiveFusionId() {
    return ["fission", "huntLoop", "overload"].find((id) => hasUpgrade(id)) || null;
  }

  function getFusionRadius(baseRadius, owner = null) {
    return baseRadius * (snapshotHasUpgrade(owner, "wideAmp") ? 1.3 : 1);
  }

  function getFusionDamage(baseDamage, owner = null) {
    return baseDamage * (snapshotHasUpgrade(owner, "highVoltageAmp") ? 1.4 : 1);
  }

  function getFieldCooldownSeconds(fusionId = getActiveFusionId()) {
    return fusionId === "overload" ? 8 : 6;
  }

  function getReturnSpeed(batch = null) {
    return CONFIG.returnSpeed * (snapshotHasUpgrade(batch, "rapidRecall") ? 1.3 : 1);
  }

  function getCatchRadius(batch = null) {
    return CONFIG.playerRadius * (snapshotHasUpgrade(batch, "rapidRecall") ? 1.25 : 1);
  }

  function applyRecallUtility(bulletCount, batch) {
    if (bulletCount < 3) return;
    if (snapshotHasUpgrade(batch, "recallShield") && elapsed + 0.000001 >= player.shieldCooldownUntil) {
      player.shield = 20;
      player.shieldUntil = elapsed + 2.5;
      player.shieldCooldownUntil = elapsed + 5;
      burst(player.x, player.y, COLORS.fieldCurrent, 12, 115);
    }
    if (snapshotHasUpgrade(batch, "magneticStride") && elapsed + 0.000001 >= player.strideCooldownUntil) {
      player.strideUntil = elapsed + 2;
      player.strideCooldownUntil = elapsed + 4;
      burst(player.x, player.y, COLORS.hunterGold, 8, 90);
    }
  }

  function isEliteEnemy(enemy) {
    return enemy.type === "interceptor" || enemy.type === "bomber";
  }

  function clearHunterState(enemy, clearPending = true) {
    enemy.hunterStage = 0;
    enemy.hunterMarkUntil = 0;
    enemy.hunterStageChangedAt = elapsed;
    enemy.hunterNextAdvanceAt = elapsed;
    if (clearPending) enemy.hunterPendingHits = [];
  }

  function setHunterStage(enemy, stage, duration) {
    enemy.hunterStage = stage;
    enemy.hunterStageChangedAt = elapsed;
    enemy.hunterMarkUntil = elapsed + duration;
    enemy.hunterNextAdvanceAt = elapsed + (
      stage === 1 ? CONFIG.hunterMarkAdvanceSeconds : CONFIG.hunterWeakpointAdvanceSeconds
    );
  }

  function canAdvanceHunterStage(enemy) {
    return elapsed + 0.000001 >= enemy.hunterNextAdvanceAt;
  }

  function advanceHunterStageFromHit(enemy, sequence) {
    if (enemy.hunterStage === 0) {
      setHunterStage(enemy, 1, 5);
      return 0;
    }
    if (enemy.hunterStage === 1) {
      setHunterStage(enemy, 2, 3);
      return 20;
    }
    return breakHunterWeakpoint(enemy, sequence) ? 20 : 0;
  }

  function queueHunterHit(enemy, sequence) {
    enemy.hunterPendingHits.push({ sequence });
  }

  function processPendingHunterHits(enemy) {
    while (enemy.hunterPendingHits.length > 0 && canAdvanceHunterStage(enemy) && !enemy.dead) {
      const pending = enemy.hunterPendingHits.shift();
      const batch = recallBatches.get(pending.sequence);
      if (!snapshotHasUpgrade(batch, "hunter") || enemy.hunterCompletedSequence === pending.sequence) continue;
      const bonus = advanceHunterStageFromHit(enemy, pending.sequence);
      if (bonus > 0 && !enemy.dead) {
        damageEnemy(enemy, bonus, false, {
          source: "hunterBonus",
          sequence: pending.sequence,
          color: COLORS.hunterGold,
          allowWeakpointBreak: false
        });
      }
    }
  }

  function isEnemyInsideActiveField(enemy) {
    return activeFields.some((field) =>
      elapsed < field.activeUntil && distanceSquared(enemy, field) <= (field.radius + enemy.radius) ** 2
    );
  }

  function getRecallFieldQualification(grounded) {
    const bulletCount = grounded.length;
    return { qualified: bulletCount >= 3, bulletCount };
  }

  function getStakeLines(includeInvalid = false) {
    const groups = new Map();
    bullets.forEach((bullet) => {
      if (bullet.weaponId !== "stake" || bullet.state !== "grounded" || bullet.stakeLineId === null) return;
      if (!groups.has(bullet.stakeLineId)) groups.set(bullet.stakeLineId, []);
      groups.get(bullet.stakeLineId).push(bullet);
    });

    const lines = [];
    groups.forEach((group, id) => {
      if (group.length !== 2) return;
      const distance = Math.hypot(group[1].x - group[0].x, group[1].y - group[0].y);
      const valid = distance <= getStakeLineMaxDistance();
      if (valid || includeInvalid) lines.push({ id, start: group[0], end: group[1], distance, valid });
    });
    return lines;
  }

  function getPendingStakeAnchor() {
    if (pendingStakeBulletId === null) return null;
    return bullets.find(
      (bullet) =>
        bullet.id === pendingStakeBulletId &&
        bullet.stakeLineId === pendingStakeLineId &&
        bullet.weaponId === "stake" &&
        bullet.state === "grounded"
    ) || null;
  }

  function getProjectedLandingPoint(direction) {
    const muzzleDistance = CONFIG.playerRadius + 8;
    let previous = {
      x: player.x + direction.x * muzzleDistance,
      y: player.y + direction.y * muzzleDistance
    };
    const maxDistance = getAttackRange();
    for (let traveled = 4; traveled <= maxDistance; traveled += 4) {
      const point = {
        x: player.x + direction.x * (muzzleDistance + traveled),
        y: player.y + direction.y * (muzzleDistance + traveled)
      };
      const outside = point.x < 14 || point.x > width - 14 || point.y < 68 || point.y > height - 14;
      const blocked = obstacles.some((rect) => circleIntersectsRect(point.x, point.y, 4, rect));
      if (outside || blocked) return previous;
      previous = point;
    }
    return previous;
  }

  function circleIntersectsRect(x, y, radius, rect) {
    const nearestX = clamp(x, rect.x, rect.x + rect.width);
    const nearestY = clamp(y, rect.y, rect.y + rect.height);
    const dx = x - nearestX;
    const dy = y - nearestY;
    return dx * dx + dy * dy < radius * radius;
  }

  function resolveCircleRect(entity, radius, rect) {
    if (!circleIntersectsRect(entity.x, entity.y, radius, rect)) return false;
    const nearestX = clamp(entity.x, rect.x, rect.x + rect.width);
    const nearestY = clamp(entity.y, rect.y, rect.y + rect.height);
    let dx = entity.x - nearestX;
    let dy = entity.y - nearestY;
    const distance = Math.hypot(dx, dy);

    if (distance > 0.001) {
      const push = radius - distance;
      entity.x += (dx / distance) * push;
      entity.y += (dy / distance) * push;
      return true;
    }

    const left = Math.abs(entity.x - rect.x);
    const right = Math.abs(rect.x + rect.width - entity.x);
    const top = Math.abs(entity.y - rect.y);
    const bottom = Math.abs(rect.y + rect.height - entity.y);
    const edge = Math.min(left, right, top, bottom);
    if (edge === left) entity.x = rect.x - radius;
    else if (edge === right) entity.x = rect.x + rect.width + radius;
    else if (edge === top) entity.y = rect.y - radius;
    else entity.y = rect.y + rect.height + radius;
    return true;
  }

  function segmentIntersectsRect(x1, y1, x2, y2, rect) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    let t0 = 0;
    let t1 = 1;
    const p = [-dx, dx, -dy, dy];
    const q = [
      x1 - rect.x,
      rect.x + rect.width - x1,
      y1 - rect.y,
      rect.y + rect.height - y1
    ];

    for (let i = 0; i < 4; i += 1) {
      if (Math.abs(p[i]) < 0.0001) {
        if (q[i] < 0) return false;
        continue;
      }
      const ratio = q[i] / p[i];
      if (p[i] < 0) t0 = Math.max(t0, ratio);
      else t1 = Math.min(t1, ratio);
      if (t0 > t1) return false;
    }
    return true;
  }

  function hasClearLineOfSight(target) {
    return !obstacles.some((rect) => segmentIntersectsRect(player.x, player.y, target.x, target.y, rect));
  }

  function landBullet(bullet, x = bullet.x, y = bullet.y) {
    bullet.state = "grounded";
    bullet.x = clamp(x, 14, width - 14);
    bullet.y = clamp(y, 68, height - 14);
    bullet.landedAt = elapsed - bullet.chargeBonus;
    bullet.vx = 0;
    bullet.vy = 0;
    bullet.landingDistance = Infinity;
    burst(bullet.x, bullet.y, bullet.didBounce ? COLORS.ricochet : COLORS.accent, 4, 60);
  }

  function getPressurePhase() {
    return PRESSURE_PHASES.find((phase) => elapsed < phase.until) || PRESSURE_PHASES[PRESSURE_PHASES.length - 1];
  }

  function chooseEnemyType() {
    const weights = getPressurePhase().weights;
    let roll = Math.random();
    for (const [type, weight] of Object.entries(weights)) {
      roll -= weight;
      if (roll <= 0) return type;
    }
    return Object.keys(weights)[0];
  }

  function getSpawnPosition(enemyType = "chaser") {
    const minimumDistance = enemyType === "bomber" ? 270 : enemyType === "interceptor" ? 210 : 180;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const point = {
        x: 38 + Math.random() * Math.max(1, width - 76),
        y: 82 + Math.random() * Math.max(1, height - 120)
      };
      if (distanceSquared(point, player) < minimumDistance * minimumDistance) continue;
      if (point.y > height - 142 && (point.x < 155 || point.x > width - 155)) continue;
      if (obstacles.some((rect) => circleIntersectsRect(point.x, point.y, 25, rect))) continue;
      if (spawnWarnings.some((warning) => distanceSquared(point, warning) < 70 * 70)) continue;
      return point;
    }
    return { x: width - 48, y: 92 };
  }

  function queueEnemySpawn(enemyType = chooseEnemyType()) {
    if (enemies.length + spawnWarnings.length >= CONFIG.maxEnemies) return;
    const point = getSpawnPosition(enemyType);
    spawnWarnings.push({
      x: point.x,
      y: point.y,
      enemyType,
      remaining: CONFIG.spawnWarningSeconds,
      duration: CONFIG.spawnWarningSeconds
    });
  }

  function spawnEnemyAt(x, y, enemyType = "chaser") {
    const type = ENEMY_TYPES[enemyType] || ENEMY_TYPES.chaser;
    enemies.push({
      id: nextEnemyId++,
      type: type.id,
      x,
      y,
      hp: type.health,
      maxHp: type.health,
      radius: type.radius,
      flash: 0,
      spawnGrace: 0.35,
      stakeMarkedUntil: 0,
      hunterStage: 0,
      hunterMarkUntil: 0,
      hunterStageChangedAt: -Infinity,
      hunterNextAdvanceAt: 0,
      hunterPendingHits: [],
      hunterCompletedSequence: -1,
      magnetTailPending: false,
      magnetSlowUntil: 0,
      magneticFieldDamageTime: 0,
      mode: "move",
      stateTimer: 0,
      attackCooldown: 0.6 + Math.random() * 0.8,
      attackHit: false,
      aimX: 0,
      aimY: 0,
      dashX: 0,
      dashY: 0,
      strafeDirection: nextEnemyId % 2 === 0 ? 1 : -1,
      displacementFrameAt: -Infinity,
      displacementMagnitude: 0,
      displacementStartX: x,
      displacementStartY: y,
      dead: false
    });
    maxEnemiesObserved = Math.max(maxEnemiesObserved, enemies.length);
    burst(x, y, COLORS.ink, 10, 130);
  }

  function clampPlayer() {
    const margin = 26;
    player.x = clamp(player.x, margin, width - margin);
    player.y = clamp(player.y, 66, height - margin);
  }

  function getLockedTarget() {
    const range = getAttackRange();
    let target = enemies.find((enemy) => enemy.id === lockedTargetId && enemy.hp > 0);
    if (target && distanceSquared(player, target) < range * range && hasClearLineOfSight(target)) return target;

    target = null;
    let bestDistance = Infinity;
    enemies.forEach((enemy) => {
      const d2 = distanceSquared(player, enemy);
      if (enemy.hp > 0 && d2 < bestDistance && d2 < range * range && hasClearLineOfSight(enemy)) {
        bestDistance = d2;
        target = enemy;
      }
    });
    lockedTargetId = target ? target.id : null;
    return target;
  }

  function getManualAimDirection() {
    if (getSelectedWeapon().controlMode !== "manual") return null;
    const magnitude = Math.hypot(aimState.x, aimState.y);
    if (!aimState.active || magnitude < 0.18) return null;
    return { x: aimState.x / magnitude, y: aimState.y / magnitude };
  }

  function assignStakeLine(bullet) {
    const pendingBullet = bullets.find(
      (candidate) =>
        candidate.id === pendingStakeBulletId &&
        candidate.stakeLineId === pendingStakeLineId &&
        candidate.weaponId === "stake" &&
        (candidate.state === "outbound" || candidate.state === "grounded")
    );

    if (pendingBullet) {
      bullet.stakeLineId = pendingStakeLineId;
      pendingStakeLineId = null;
      pendingStakeBulletId = null;
      return;
    }

    bullet.stakeLineId = nextStakeLineId++;
    pendingStakeLineId = bullet.stakeLineId;
    pendingStakeBulletId = bullet.id;
  }

  function fireBullet(directionOverride = null) {
    const bullet = bullets.find((candidate) => candidate.state === "held");
    const weapon = getSelectedWeapon();
    const manualDirection = weapon.controlMode === "manual" ? directionOverride || getManualAimDirection() : null;
    const target = weapon.controlMode === "auto" ? getLockedTarget() : null;
    if (!bullet) {
      playEmptySfx();
      return false;
    }
    emptySfxArmed = true;
    if (!manualDirection && !target) return false;

    const dx = manualDirection ? manualDirection.x : target.x - player.x;
    const dy = manualDirection ? manualDirection.y : target.y - player.y;
    const distance = Math.hypot(dx, dy) || 1;
    const nx = dx / distance;
    const ny = dy / distance;

    bullet.state = "outbound";
    bullet.x = player.x + nx * (CONFIG.playerRadius + 8);
    bullet.y = player.y + ny * (CONFIG.playerRadius + 8);
    bullet.vx = nx * CONFIG.outboundSpeed;
    bullet.vy = ny * CONFIG.outboundSpeed;
    bullet.traveled = 0;
    bullet.maxDistance = manualDirection
      ? getAttackRange()
      : Math.min(
        getAttackRange(),
        Math.hypot(target.x - player.x, target.y - player.y) + weapon.postHitTravel
      );
    bullet.landingDistance = Infinity;
    bullet.bouncesRemaining = weapon.bounces;
    bullet.didBounce = false;
    bullet.chargeBonus = 0;
    bullet.fieldChargeGranted = false;
    bullet.magnetized = false;
    bullet.flybyPlayed = false;
    bullet.weaponId = weapon.id;
    bullet.stakeLineId = null;
    if (weapon.id === "stake") assignStakeLine(bullet);
    bullet.outboundHits.clear();
    bullet.returnHits.clear();
    burst(player.x + nx * 19, player.y + ny * 19, COLORS.accent, 4, 85);
    playSfx("shot", 0.28);
    return true;
  }

  function knockbackEnemy(enemy, originX, originY, distance) {
    const magnitude = Math.abs(distance);
    if (magnitude <= 0 || enemy.dead) return;
    const sameFrame = Math.abs(enemy.displacementFrameAt - elapsed) <= 0.000001;
    const previousMagnitude = sameFrame ? enemy.displacementMagnitude : 0;
    if (magnitude <= previousMagnitude) return;
    if (!sameFrame) {
      enemy.displacementStartX = enemy.x;
      enemy.displacementStartY = enemy.y;
    } else {
      enemy.x = enemy.displacementStartX;
      enemy.y = enemy.displacementStartY;
    }
    const appliedDistance = magnitude * Math.sign(distance);
    const dx = enemy.x - originX;
    const dy = enemy.y - originY;
    const length = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / length) * appliedDistance;
    enemy.y += (dy / length) * appliedDistance;
    enemy.displacementFrameAt = elapsed;
    enemy.displacementMagnitude = magnitude;
    obstacles.forEach((rect) => resolveCircleRect(enemy, enemy.radius, rect));
    enemy.x = clamp(enemy.x, enemy.radius, width - enemy.radius);
    enemy.y = clamp(enemy.y, 66 + enemy.radius, height - enemy.radius);
  }

  function spawnRadialWave(x, y, second = false, options = {}) {
    radialWaves.push({
      x,
      y,
      second,
      radius: options.radius || (second ? 90 : 45),
      color: options.color || COLORS.accent,
      lineWidth: options.lineWidth || (second ? 4 : 6),
      life: options.life || 0.3,
      maxLife: options.life || 0.3
    });
  }

  function triggerCriticalWave(x, y, second = false, options = {}) {
    const radius = second ? 90 : 45;
    const affected = enemies.filter((enemy) =>
      !enemy.dead && distanceSquared(enemy, { x, y }) <= (radius + enemy.radius) ** 2
    );
    affected.forEach((enemy) => {
      damageEnemy(enemy, 20, false, {
        source: second ? "secondWave" : "criticalWave",
        sequence: options.sequence || 0,
        allowWeakpointBreak: !second
      });
      const knockback = enemy.type === "boss"
        ? 0
        : isEliteEnemy(enemy)
          ? second ? 60 : 30
          : second ? 90 : 45;
      knockbackEnemy(enemy, x, y, knockback);
    });
    spawnRadialWave(x, y, second);
    if (!second && affected.length > 0 && player.hp <= player.maxHp * 0.5 && player.criticalHealsUsed < 3) {
      player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.1));
      player.criticalHealsUsed += 1;
      burst(player.x, player.y, COLORS.white, 12, 120);
    }
    return affected.length > 0;
  }

  function markHuntLoopTargets(field) {
    if (field.fusionId !== "huntLoop") return;
    const scanRadius = getFusionRadius(120, field);
    const limit = snapshotHasUpgrade(field, "wideAmp") ? 9 : 6;
    enemies
      .filter((enemy) => !enemy.dead && distanceSquared(enemy, field) <= (scanRadius + enemy.radius) ** 2)
      .sort((a, b) => distanceSquared(a, field) - distanceSquared(b, field))
      .slice(0, limit)
      .forEach((enemy) => {
        if (enemy.hunterStage === 0) setHunterStage(enemy, 1, Math.max(0, field.activeUntil + 2 - elapsed));
        if (enemy.hunterStage === 1) {
          enemy.hunterMarkUntil = Math.max(enemy.hunterMarkUntil, field.activeUntil + 2);
        }
        field.huntMarkedIds.add(enemy.id);
        burst(enemy.x, enemy.y, COLORS.hunterGold, 6, 90);
      });
  }

  function createMagneticField(options = {}) {
    const fusionId = options.fusionId || getActiveFusionId();
    const upgradeIds = options.upgradeIds instanceof Set
      ? new Set(options.upgradeIds)
      : createUpgradeSnapshot();
    const duration = options.duration || (fusionId === "overload" ? 5 : 3);
    const field = {
      id: nextFieldId,
      x: Number.isFinite(options.x) ? options.x : player.x,
      y: Number.isFinite(options.y) ? options.y : player.y,
      radius: 120,
      createdAt: elapsed,
      activeUntil: elapsed + duration,
      visualUntil: elapsed + duration + 0.15,
      fusionId,
      sequence: options.sequence || 0,
      upgradeIds,
      huntLoopUsed: false,
      huntMarkedIds: new Set(),
      damagePerTick: fusionId === "huntLoop" && upgradeIds.has("highVoltageAmp")
        ? 15
        : CONFIG.magneticFieldDamage
    };
    nextFieldId += 1;
    activeFields = [field];
    lastFieldActivatedAt = elapsed;
    fusionStats.fields += 1;
    burst(field.x, field.y, COLORS.fieldCurrent, 18, 150);
    markHuntLoopTargets(field);
    return field;
  }

  function isFieldCooldownReady(now = elapsed, previous = lastFieldActivatedAt, fusionId = getActiveFusionId()) {
    return now - previous + 0.000001 >= getFieldCooldownSeconds(fusionId);
  }

  function finalizeRecallBatch(sequence) {
    const batch = recallBatches.get(sequence);
    if (!batch || batch.finalized) return;
    batch.finalized = true;
    if (batch.fusionId === "overload" && batch.fieldCreated) {
      const field = activeFields.find((candidate) => candidate.id === batch.fieldId);
      if (field) {
        const sixShot = batch.bulletCount === 6;
        const radius = getFusionRadius(sixShot ? 160 : 120, batch);
        const damage = getFusionDamage(sixShot ? 100 : 45, batch);
        triggerFusionDamage(field.x, field.y, radius, damage, {
          source: "overload",
          color: COLORS.fieldCurrent,
          echoDamage: damage * 0.65,
          echoEnabled: snapshotHasUpgrade(batch, "echoAmp")
        });
        fusionStats.overload += 1;
        if (sixShot) fusionStats.overloadSix += 1;
        else fusionStats.overloadPartial += 1;
        if (sixShot) {
          field.collapseAt = elapsed + 0.6;
          field.collapsePlayed = false;
          field.activeUntil = Math.min(field.activeUntil, field.collapseAt);
          field.visualUntil = Math.min(field.visualUntil, field.activeUntil + 0.15);
          shake = Math.max(shake, 10);
        }
      }
    }
  }

  function queueFusionEcho(x, y, radius, damage, options = {}) {
    if (!options.echoEnabled || damage <= 0) return;
    pendingFusionPulses.push({
      triggerAt: elapsed + 0.45,
      x,
      y,
      radius,
      damage,
      color: options.color || COLORS.accent,
      pull: options.echoPull || 0
    });
  }

  function triggerFusionDamage(x, y, radius, damage, options = {}) {
    const affected = enemies.filter((enemy) =>
      !enemy.dead && distanceSquared(enemy, { x, y }) <= (radius + enemy.radius) ** 2
    );
    affected.forEach((enemy) => {
      damageEnemy(enemy, damage, false, {
        source: options.source || "fusion",
        color: options.color || COLORS.accent,
        allowWeakpointBreak: false
      });
      if (!enemy.dead && options.immediatePull) knockbackEnemy(enemy, x, y, -Math.abs(options.immediatePull));
    });
    spawnRadialWave(x, y, true, {
      radius,
      color: options.color || COLORS.accent,
      lineWidth: options.lineWidth || 6,
      life: 0.38
    });
    if (options.echoDamage) queueFusionEcho(x, y, radius, options.echoDamage, options);
    return affected.length;
  }

  function triggerFissionExplosion(sourceEnemy, sequence) {
    const batch = recallBatches.get(sequence);
    if (batch) {
      if (batch.fissionSources.has(sourceEnemy.id)) return;
      batch.fissionSources.add(sourceEnemy.id);
    }
    const radius = getFusionRadius(120, batch);
    const damage = getFusionDamage(25, batch);
    const affected = enemies
      .filter((enemy) => !enemy.dead && distanceSquared(enemy, sourceEnemy) <= (radius + enemy.radius) ** 2)
      .sort((a, b) => distanceSquared(a, sourceEnemy) - distanceSquared(b, sourceEnemy));
    const chainBudget = Math.max(0, 3 - (batch?.fissionChainCount || 0));
    const chainTargets = affected
      .filter((enemy) => enemy !== sourceEnemy && enemy.hunterStage > 0 && canAdvanceHunterStage(enemy))
      .slice(0, chainBudget)
      .map((enemy) => ({ enemy, stage: enemy.hunterStage }));
    affected.forEach((enemy) => {
      if (batch?.fissionDamagedTargets.has(enemy.id)) return;
      if (batch) batch.fissionDamagedTargets.add(enemy.id);
      damageEnemy(enemy, damage, false, {
        source: "fission",
        color: COLORS.accent,
        allowWeakpointBreak: false
      });
    });
    chainTargets.forEach(({ enemy, stage }) => {
      if (enemy.dead) return;
      if (stage === 1) {
        setHunterStage(enemy, 2, 3);
      } else if (stage === 2) {
        clearHunterState(enemy);
        burst(enemy.x, enemy.y, COLORS.weakpoint, 12, 170);
      }
    });
    if (batch) batch.fissionChainCount += chainTargets.length;
    spawnRadialWave(sourceEnemy.x, sourceEnemy.y, true, {
      radius,
      color: COLORS.accent,
      lineWidth: 6,
      life: 0.38
    });
    queueFusionEcho(sourceEnemy.x, sourceEnemy.y, radius, damage * 0.65, {
      color: COLORS.accent,
      echoEnabled: snapshotHasUpgrade(batch, "echoAmp")
    });
    fusionStats.fission += 1;
  }

  function triggerHuntLoop(sourceEnemy, sequence) {
    const field = activeFields.find((candidate) =>
      candidate.fusionId === "huntLoop" &&
      !candidate.huntLoopUsed &&
      elapsed < candidate.activeUntil &&
      distanceSquared(sourceEnemy, candidate) <= (candidate.radius + sourceEnemy.radius) ** 2
    );
    if (!field) return;
    field.huntLoopUsed = true;
    const stagedTargets = enemies
      .filter((enemy) =>
        enemy !== sourceEnemy &&
        !enemy.dead &&
        enemy.hunterStage === 1 &&
        canAdvanceHunterStage(enemy) &&
        distanceSquared(enemy, field) <= (field.radius + enemy.radius) ** 2
      );
    const radius = getFusionRadius(120, field);
    const damage = snapshotHasUpgrade(field, "highVoltageAmp") ? 35 : 20;
    const echoEnabled = snapshotHasUpgrade(field, "echoAmp");
    triggerFusionDamage(sourceEnemy.x, sourceEnemy.y, radius, damage, {
      source: "huntLoop",
      color: COLORS.fieldCurrent,
      echoDamage: echoEnabled ? 20 : 0,
      echoPull: echoEnabled ? 30 : 0,
      echoEnabled
    });
    stagedTargets.forEach((enemy) => {
      if (enemy.dead) return;
      setHunterStage(enemy, 2, 3);
    });
    fusionStats.huntLoop += 1;
  }

  function breakHunterWeakpoint(enemy, sequence, options = {}) {
    if (enemy.hunterStage !== 2 || !canAdvanceHunterStage(enemy)) return false;
    clearHunterState(enemy);
    enemy.hunterCompletedSequence = sequence;
    if (options.applyControl !== false && !enemy.dead && enemy.type !== "boss") {
      enemy.mode = "stunned";
      enemy.stateTimer = isEliteEnemy(enemy) ? 0.6 : 1;
      enemy.attackHit = false;
      enemyAttacks = enemyAttacks.filter((attack) => attack.sourceId !== enemy.id);
    }
    burst(enemy.x, enemy.y, COLORS.weakpoint, 14, 190);
    if (options.allowFusion !== false) {
      const batch = recallBatches.get(sequence);
      const fusionId = batch ? batch.fusionId : getActiveFusionId();
      if (fusionId === "fission") triggerFissionExplosion(enemy, sequence);
      if (fusionId === "huntLoop") triggerHuntLoop(enemy, sequence);
    }
    return true;
  }

  function processHunterHit(enemy, sequence) {
    const batch = recallBatches.get(sequence);
    if (!snapshotHasUpgrade(batch, "hunter") || enemy.hunterCompletedSequence === sequence) return 0;
    if (enemy.hunterStage > 0 && enemy.hunterMarkUntil < elapsed) clearHunterState(enemy);
    if (enemy.hunterPendingHits.length > 0 || !canAdvanceHunterStage(enemy)) {
      queueHunterHit(enemy, sequence);
      return 0;
    }
    return advanceHunterStageFromHit(enemy, sequence);
  }

  function applyMagnetizedHit(enemy, batch) {
    if (batch?.fusionId !== "overload" || batch.magnetizedHitTargets.has(enemy.id)) return;
    batch.magnetizedHitTargets.add(enemy.id);
    damageEnemy(enemy, 10, false, {
      source: "magnetized",
      color: COLORS.fieldCurrent,
      allowWeakpointBreak: false
    });
    if (enemy.dead) return;
    const locked = enemy.magnetTailPending || enemy.magnetSlowUntil > elapsed;
    if (locked) return;
    if (isEnemyInsideActiveField(enemy)) {
      enemy.magnetTailPending = true;
    } else {
      enemy.magnetSlowUntil = elapsed + 1.5;
    }
  }

  function recallGroundedBullets() {
    if (!running || paused || finished || upgradeChoiceActive) return;
    const grounded = bullets.filter((bullet) => bullet.state === "grounded");
    if (grounded.length === 0) return;

    recalls += 1;
    recallSequenceId += 1;
    const sequence = recallSequenceId;
    const fieldQualification = getRecallFieldQualification(grounded);
    const fullChargeBulletCount = grounded.filter(
      (bullet) => elapsed - bullet.landedAt >= CONFIG.maxChargeSeconds
    ).length;
    const allSixFullyCharged = grounded.length === 6 && fullChargeBulletCount === 6;
    const upgradeIds = createUpgradeSnapshot();
    const batch = {
      id: sequence,
      bulletIds: new Set(grounded.map((bullet) => bullet.id)),
      bulletCount: grounded.length,
      hitCount: 0,
      hitSoundPlayed: false,
      allSixFullyCharged,
      fieldQualified: fieldQualification.qualified,
      finalized: false,
      fieldCreated: false,
      fieldId: null,
      fusionId: getActiveFusionId(),
      upgradeIds,
      magnetizedHitTargets: new Set(),
      fissionSources: new Set(),
      fissionDamagedTargets: new Set(),
      fissionChainCount: 0
    };
    recallBatches.set(sequence, batch);

    if (
      snapshotHasUpgrade(batch, "magnet") &&
      batch.fieldQualified &&
      isFieldCooldownReady(elapsed, lastFieldActivatedAt, batch.fusionId)
    ) {
      const field = createMagneticField({
        x: player.x,
        y: player.y,
        sequence,
        fusionId: batch.fusionId,
        upgradeIds
      });
      batch.fieldCreated = true;
      batch.fieldId = field.id;
      if (batch.fusionId === "overload") {
        grounded.forEach((bullet) => {
          bullet.magnetized = true;
        });
      }
    }

    const closeEnemy = enemies.some((enemy) =>
      !enemy.dead && distanceSquared(enemy, player) <= (90 + enemy.radius) ** 2
    );
    const criticalTriggered = snapshotHasUpgrade(batch, "critical") && grounded.length >= 3 && closeEnemy
      ? triggerCriticalWave(player.x, player.y, false, { sequence })
      : false;
    batch.criticalTriggered = criticalTriggered;
    applyRecallUtility(grounded.length, batch);
    grounded.forEach((bullet) => {
      const age = elapsed - bullet.landedAt;
      const weapon = WEAPONS[bullet.weaponId] || getSelectedWeapon();
      const charge = clamp(age / CONFIG.maxChargeSeconds, 0, 1);
      bullet.recallSequence = sequence;
      bullet.recallCharge = charge;
      bullet.recallDamage = weapon.recallBaseDamage +
        (weapon.recallMaxDamage - weapon.recallBaseDamage) * charge;
      const mechanicMax = weapon.mechanicRecallMaxDamage || weapon.recallMaxDamage;
      bullet.mechanicRecallDamage = weapon.recallBaseDamage +
        (mechanicMax - weapon.recallBaseDamage) * charge;
      bullet.state = "returning";
      bullet.returnHits.clear();
      burst(bullet.x, bullet.y, bullet.didBounce ? COLORS.ricochet : COLORS.accent, 7, 120);
    });
    shake = Math.max(shake, 4);
    updateHud();
  }

  function updateSpawnWarnings(dt) {
    spawnWarnings.forEach((warning) => {
      warning.remaining -= dt;
    });
    const ready = spawnWarnings.filter((warning) => warning.remaining <= 0);
    spawnWarnings = spawnWarnings.filter((warning) => warning.remaining > 0);
    ready.forEach((warning) => spawnEnemyAt(warning.x, warning.y, warning.enemyType));
  }

  function damageEnemy(enemy, amount, isRecall, recallImpact = null) {
    if (enemy.dead) return;
    const wasWeakpoint = enemy.hunterStage === 2;
    const hpBefore = enemy.hp;
    enemy.hp -= amount;
    const killed = enemy.hp <= 0;
    const source = recallImpact?.source || (isRecall ? "recall" : "outbound");
    const appliedDamage = Math.min(Math.max(0, hpBefore), Math.max(0, amount));
    outgoingDamageBySource[source] = (outgoingDamageBySource[source] || 0) + appliedDamage;
    const electricHit = !isRecall && recallImpact?.source === "magneticField";
    enemy.flash = 0.1;
    damageLabels.push({
      x: enemy.x,
      y: enemy.y - enemy.radius - 7,
      value: electricHit ? `-${Math.round(amount)}` : Math.round(amount),
      life: 0.55,
      maxLife: 0.55,
      recall: isRecall,
      color: isRecall ? recallImpact?.color || COLORS.accent : recallImpact?.color || COLORS.ink,
      strength: recallImpact?.charge || 0,
      mechanic: Boolean(recallImpact?.mechanic)
    });
    if (isRecall) {
      if ((recallImpact?.charge || 0) >= 1) fullChargeHits += 1;
      spawnRecallImpact(
        enemy.x,
        enemy.y,
        recallImpact?.vx ?? 1,
        recallImpact?.vy ?? 0,
        recallImpact?.charge || 0,
        Boolean(recallImpact?.mechanic),
        killed,
        recallImpact?.sequence || 0,
        recallImpact?.color || COLORS.accent
      );
    } else {
      burst(
        enemy.x,
        enemy.y,
        recallImpact?.color || COLORS.ink,
        electricHit ? 8 : 4,
        electricHit ? 125 : 95
      );
    }

    if (killed) {
      enemy.dead = true;
      kills += 1;
      threatScore += enemy.type === "bomber" ? 20 : enemy.type === "interceptor" ? 15 : 10;
      if (isRecall) recallKills += 1;
      if (lockedTargetId === enemy.id) lockedTargetId = null;
      burst(enemy.x, enemy.y, COLORS.accent, 15, 220);
    }
    const allowedWeakpointBreak = isRecall || source === "criticalWave" || source === "magneticField";
    if (wasWeakpoint && allowedWeakpointBreak && recallImpact?.allowWeakpointBreak !== false) {
      breakHunterWeakpoint(enemy, recallImpact?.sequence || 0, { applyControl: !killed });
    } else if (wasWeakpoint && recallImpact?.allowWeakpointBreak === false) {
      fusionStats.recursionBlocked += 1;
    }
  }

  function updatePlayer(dt) {
    let x = joystickState.x;
    let y = joystickState.y;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) x += 1;
    if (keys.has("KeyW") || keys.has("ArrowUp")) y -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) y += 1;
    const magnitude = Math.hypot(x, y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }
    player.moveX = x;
    player.moveY = y;
    const strideMultiplier = player.strideUntil > elapsed ? 1.2 : 1;
    player.x += x * CONFIG.playerSpeed * strideMultiplier * dt;
    player.y += y * CONFIG.playerSpeed * strideMultiplier * dt;
    obstacles.forEach((rect) => resolveCircleRect(player, CONFIG.playerRadius, rect));
    clampPlayer();
    player.hitCooldown = Math.max(0, player.hitCooldown - dt);
    if (player.shieldUntil <= elapsed) player.shield = 0;
  }

  function updateBullets(dt) {
    bullets.forEach((bullet) => {
      if (bullet.state === "held") {
        bullet.x = player.x;
        bullet.y = player.y;
        return;
      }

      if (bullet.state === "outbound") {
        const previousX = bullet.x;
        const previousY = bullet.y;
        const stepX = bullet.vx * dt;
        const stepY = bullet.vy * dt;
        bullet.x += stepX;
        bullet.y += stepY;
        bullet.traveled += Math.hypot(stepX, stepY);
        if (!bullet.flybyPlayed && bullet.traveled >= 80) {
          bullet.flybyPlayed = true;
        }

        if (hasUpgrade("charge") && !bullet.fieldChargeGranted) {
          const crossedField = activeFields.some((field) =>
            elapsed < field.activeUntil && segmentIntersectsCircle(previousX, previousY, bullet.x, bullet.y, field)
          );
          if (crossedField) {
            bullet.fieldChargeGranted = true;
            bullet.chargeBonus = Math.max(bullet.chargeBonus, 1.5);
            burst(bullet.x, bullet.y, COLORS.fieldCurrent, 5, 80);
          }
        }

        const hitObstacle = obstacles.find((rect) => circleIntersectsRect(bullet.x, bullet.y, 4, rect));
        if (hitObstacle) {
          if (bullet.bouncesRemaining > 0) {
            const crossedVerticalEdge =
              previousX <= hitObstacle.x || previousX >= hitObstacle.x + hitObstacle.width;
            bullet.x = previousX;
            bullet.y = previousY;
            if (crossedVerticalEdge) bullet.vx *= -1;
            else bullet.vy *= -1;
            bullet.bouncesRemaining -= 1;
            bullet.didBounce = true;
            bullet.chargeBonus = Math.max(bullet.chargeBonus, 1.5);
            burst(bullet.x, bullet.y, COLORS.ricochet, 9, 130);
          } else {
            landBullet(bullet, previousX, previousY);
            return;
          }
        }

        const weapon = WEAPONS[bullet.weaponId] || getSelectedWeapon();
        if (weapon.piercesEnemies || bullet.outboundHits.size === 0) {
          for (const enemy of enemies) {
            if (enemy.dead || bullet.outboundHits.has(enemy.id)) continue;
            const hitRadius = enemy.radius + 5;
            if (distanceSquared(bullet, enemy) <= hitRadius * hitRadius) {
              bullet.outboundHits.add(enemy.id);
              damageEnemy(enemy, weapon.damage, false, { source: "outbound" });
              if (!weapon.piercesEnemies) {
                bullet.landingDistance = bullet.traveled + weapon.postHitTravel;
                break;
              }
            }
          }
        }

        if (
          bullet.traveled >= Math.min(bullet.maxDistance, bullet.landingDistance) ||
          bullet.x < 14 || bullet.x > width - 14 ||
          bullet.y < 68 || bullet.y > height - 14
        ) {
          landBullet(bullet);
        }
        return;
      }

      if (bullet.state === "returning") {
        const returnBatch = recallBatches.get(bullet.recallSequence);
        const previousX = bullet.x;
        const previousY = bullet.y;
        const dx = player.x - bullet.x;
        const dy = player.y - bullet.y;
        const distance = Math.hypot(dx, dy) || 1;
        const returnSpeed = getReturnSpeed(returnBatch);
        const step = returnSpeed * dt;
        bullet.vx = (dx / distance) * returnSpeed;
        bullet.vy = (dy / distance) * returnSpeed;
        bullet.x += bullet.vx * dt;
        bullet.y += bullet.vy * dt;

        if (hasUpgrade("charge") && !bullet.magnetized) {
          const crossedField = activeFields.some((field) =>
            elapsed < field.activeUntil && segmentIntersectsCircle(previousX, previousY, bullet.x, bullet.y, field)
          );
          if (crossedField) {
            bullet.magnetized = true;
            burst(bullet.x, bullet.y, COLORS.fieldCurrent, 5, 80);
          }
        }

        enemies.forEach((enemy) => {
          if (enemy.dead || bullet.returnHits.has(enemy.id)) return;
          const hitRadius = enemy.radius + 8;
          if (distanceSquared(bullet, enemy) <= hitRadius * hitRadius) {
            bullet.returnHits.add(enemy.id);
            const batch = returnBatch;
            if (bullet.magnetized) applyMagnetizedHit(enemy, batch);
            if (enemy.dead) return;
            const mechanicSucceeded =
              (bullet.weaponId === "ricochet" && bullet.didBounce) ||
              (bullet.weaponId === "stake" && enemy.stakeMarkedUntil >= elapsed);
            const hunterBonus = processHunterHit(enemy, bullet.recallSequence);
            if (batch) batch.hitCount += 1;
            if (batch?.allSixFullyCharged && !batch.hitSoundPlayed) {
              playSfx("recallHitFull", 0.82);
              duckMusicForRecall("sixBurst", bullet.recallSequence);
              batch.hitSoundPlayed = true;
            }
            damageEnemy(
              enemy,
              (mechanicSucceeded ? bullet.mechanicRecallDamage : bullet.recallDamage) + hunterBonus,
              true,
              {
                charge: bullet.recallCharge,
                sequence: bullet.recallSequence,
                mechanic: mechanicSucceeded,
                vx: bullet.vx,
                vy: bullet.vy,
                color: bullet.didBounce ? COLORS.ricochet : COLORS.accent,
                source: "recall"
              }
            );
          }
        });

        if (distance <= step + getCatchRadius(returnBatch)) {
          highestRecallPierce = Math.max(highestRecallPierce, bullet.returnHits.size);
          const batch = returnBatch;
          if (batch) {
            batch.bulletIds.delete(bullet.id);
            if (batch.bulletIds.size === 0) finalizeRecallBatch(bullet.recallSequence);
          }
          bullet.state = "held";
          bullet.x = player.x;
          bullet.y = player.y;
          burst(player.x, player.y, bullet.didBounce ? COLORS.ricochet : COLORS.accent, 3, 70);
          emptySfxArmed = true;
          bullet.magnetized = false;
        }
      }
    });
  }

  function damagePlayer(amount, sourceX, sourceY, sourceType = "unknown") {
    if (player.hitCooldown > 0 || player.hp <= 0) return false;
    let remainingDamage = amount;
    if (player.shieldUntil > elapsed && player.shield > 0) {
      const absorbed = Math.min(player.shield, remainingDamage);
      player.shield -= absorbed;
      remainingDamage -= absorbed;
      burst(player.x, player.y, COLORS.fieldCurrent, 10, 135);
    }
    if (remainingDamage > 0) {
      player.hp = Math.max(0, player.hp - remainingDamage);
      damageBySource[sourceType] = (damageBySource[sourceType] || 0) + remainingDamage;
    }
    player.hitCooldown = 0.72;
    const dx = player.x - sourceX;
    const dy = player.y - sourceY;
    const distance = Math.hypot(dx, dy) || 1;
    player.x += (dx / distance) * 18;
    player.y += (dy / distance) * 18;
    clampPlayer();
    shake = 7;
    burst(player.x, player.y, COLORS.danger, 12, 180);
    return true;
  }

  function moveEnemy(enemy, nx, ny, speed, dt) {
    const length = Math.hypot(nx, ny) || 1;
    const moveX = (nx / length) * speed * dt;
    const moveY = (ny / length) * speed * dt;
    enemy.x += moveX;
    enemy.y += moveY;
    let blocked = false;
    obstacles.forEach((rect) => {
      blocked = resolveCircleRect(enemy, enemy.radius, rect) || blocked;
    });
    enemy.x = clamp(enemy.x, enemy.radius, width - enemy.radius);
    enemy.y = clamp(enemy.y, 66 + enemy.radius, height - enemy.radius);
    return blocked;
  }

  function beginDash(enemy, targetX, targetY, mode, seconds) {
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    enemy.dashX = dx / distance;
    enemy.dashY = dy / distance;
    enemy.aimX = targetX;
    enemy.aimY = targetY;
    enemy.mode = mode;
    enemy.stateTimer = seconds;
    enemy.attackHit = false;
  }

  function updateChaser(enemy, dt, speedMultiplier, activeAttackCount) {
    const type = ENEMY_TYPES.chaser;
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (enemy.mode === "windup") {
      if (enemy.stateTimer <= 0) {
        enemy.mode = "dash";
        enemy.stateTimer = CONFIG.chaserDashSeconds;
      }
      return;
    }
    if (enemy.mode === "dash") {
      const blocked = moveEnemy(
        enemy,
        enemy.dashX,
        enemy.dashY,
        CONFIG.chaserDashSpeed * speedMultiplier,
        dt
      );
      if (
        !enemy.attackHit &&
        enemy.spawnGrace <= 0 &&
        distanceSquared(enemy, player) <= (enemy.radius + CONFIG.playerRadius) ** 2
      ) {
        enemy.attackHit = damagePlayer(type.damage, enemy.x, enemy.y, type.id);
      }
      if (blocked) enemy.stateTimer = 0;
      if (enemy.stateTimer <= 0) {
        enemy.mode = "recovery";
        enemy.stateTimer = CONFIG.chaserRecoverySeconds;
      }
      return;
    }
    if (enemy.mode === "recovery") {
      if (enemy.stateTimer <= 0) {
        enemy.mode = "move";
        enemy.attackCooldown = 0.7;
      }
      return;
    }

    if (distance <= 68 && enemy.attackCooldown <= 0 && activeAttackCount < 2) {
      beginDash(enemy, player.x, player.y, "windup", CONFIG.chaserWindupSeconds);
      return;
    }
    const blocked = moveEnemy(enemy, dx, dy, type.speed * speedMultiplier, dt);
    if (blocked) moveEnemy(enemy, -dy, dx * enemy.strafeDirection, type.speed * 0.55 * speedMultiplier, dt);
  }

  function updateInterceptor(enemy, dt, speedMultiplier, activeAttackCount) {
    const type = ENEMY_TYPES.interceptor;
    if (enemy.mode === "windup") {
      if (enemy.stateTimer > CONFIG.interceptorLockSeconds) updateInterceptorAim(enemy);
      if (enemy.stateTimer <= 0) {
        enemy.mode = "dash";
        enemy.stateTimer = CONFIG.interceptorDashSeconds;
      }
      return;
    }
    if (enemy.mode === "dash") {
      const blocked = moveEnemy(
        enemy,
        enemy.dashX,
        enemy.dashY,
        CONFIG.interceptorDashSpeed * speedMultiplier,
        dt
      );
      if (
        !enemy.attackHit &&
        enemy.spawnGrace <= 0 &&
        distanceSquared(enemy, player) <= (enemy.radius + CONFIG.playerRadius) ** 2
      ) {
        enemy.attackHit = damagePlayer(type.damage, enemy.x, enemy.y, type.id);
      }
      if (blocked) enemy.stateTimer = 0;
      if (enemy.stateTimer <= 0) {
        enemy.mode = "recovery";
        enemy.stateTimer = CONFIG.interceptorRecoverySeconds;
      }
      return;
    }
    if (enemy.mode === "recovery") {
      if (enemy.stateTimer <= 0) {
        enemy.mode = "move";
        enemy.attackCooldown = 1.4;
      }
      return;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    if (enemy.attackCooldown <= 0 && distance <= CONFIG.interceptorTriggerRange && activeAttackCount < 1) {
      beginDash(enemy, player.x, player.y, "windup", CONFIG.interceptorWindupSeconds);
      updateInterceptorAim(enemy);
      return;
    }
    const blocked = moveEnemy(enemy, dx, dy, type.speed * speedMultiplier, dt);
    if (blocked) moveEnemy(enemy, -dy, dx * enemy.strafeDirection, type.speed * 0.65 * speedMultiplier, dt);
  }

  function updateInterceptorAim(enemy) {
    const moveMagnitude = Math.hypot(player.moveX, player.moveY);
    const leadDistance = moveMagnitude > 0.1
      ? CONFIG.playerSpeed * CONFIG.interceptorLeadSeconds * Math.min(moveMagnitude, 1)
      : 0;
    const targetX = clamp(
      player.x + (moveMagnitude > 0.1 ? player.moveX / moveMagnitude * leadDistance : 0),
      26,
      width - 26
    );
    const targetY = clamp(
      player.y + (moveMagnitude > 0.1 ? player.moveY / moveMagnitude * leadDistance : 0),
      66,
      height - 26
    );
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    enemy.aimX = targetX;
    enemy.aimY = targetY;
    enemy.dashX = dx / distance;
    enemy.dashY = dy / distance;
  }

  function fireBomberProjectile(enemy) {
    const dx = enemy.aimX - enemy.x;
    const dy = enemy.aimY - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    enemyProjectiles.push({
      type: "direct",
      x: enemy.x,
      y: enemy.y,
      vx: (dx / distance) * CONFIG.enemyProjectileSpeed,
      vy: (dy / distance) * CONFIG.enemyProjectileSpeed,
      remaining: CONFIG.bomberBombMinDistance,
      damage: ENEMY_TYPES.bomber.directDamage,
      radius: 5
    });
  }

  function updateBomber(enemy, dt, speedMultiplier, activeBombCount, activeDirectCount) {
    const type = ENEMY_TYPES.bomber;
    if (enemy.mode === "directWindup") {
      if (enemy.stateTimer <= 0) {
        fireBomberProjectile(enemy);
        enemy.mode = "move";
        enemy.attackCooldown = CONFIG.bomberDirectCooldown;
      }
      return;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    if (distance > CONFIG.bomberBombMaxDistance) {
      moveEnemy(enemy, dx, dy, type.speed * speedMultiplier, dt);
      return;
    }

    if (
      distance < CONFIG.bomberBombMinDistance &&
      enemy.attackCooldown <= 0 &&
      activeDirectCount < 2
    ) {
      enemy.aimX = player.x;
      enemy.aimY = player.y;
      enemy.mode = "directWindup";
      enemy.stateTimer = CONFIG.bomberDirectWindupSeconds;
      return;
    }

    const bombCap = elapsed >= 160 ? 2 : 1;
    if (
      distance >= CONFIG.bomberBombMinDistance &&
      enemy.attackCooldown <= 0 &&
      activeBombCount < bombCap
    ) {
      enemyAttacks.push({
        type: "bomb",
        sourceId: enemy.id,
        x: player.x,
        y: player.y,
        sourceX: enemy.x,
        sourceY: enemy.y,
        radius: CONFIG.bomberBombRadius,
        remaining: CONFIG.bomberBombWarningSeconds,
        duration: CONFIG.bomberBombWarningSeconds,
        damage: type.bombDamage
      });
      enemy.attackCooldown = CONFIG.bomberBombCooldown;
    }

    moveEnemy(
      enemy,
      -dy * enemy.strafeDirection,
      dx * enemy.strafeDirection,
      type.speed * 0.52 * speedMultiplier,
      dt
    );
  }

  function updateEnemyAttacks(dt) {
    enemyAttacks.forEach((attack) => {
      attack.remaining -= dt;
      if (attack.remaining > 0) return;
      if (distanceSquared(attack, player) <= (attack.radius + CONFIG.playerRadius) ** 2) {
        damagePlayer(attack.damage, attack.x, attack.y, "bomberBomb");
      }
      burst(attack.x, attack.y, COLORS.accent, 18, 230);
      shake = Math.max(shake, 5);
    });
    enemyAttacks = enemyAttacks.filter((attack) => attack.remaining > 0);
  }

  function updateEnemyProjectiles(dt) {
    enemyProjectiles.forEach((projectile) => {
      if (projectile.dead) return;
      const stepX = projectile.vx * dt;
      const stepY = projectile.vy * dt;
      projectile.x += stepX;
      projectile.y += stepY;
      projectile.remaining -= Math.hypot(stepX, stepY);
      const blocked = obstacles.some((rect) =>
        circleIntersectsRect(projectile.x, projectile.y, projectile.radius, rect)
      );
      const outside =
        projectile.x < 0 || projectile.x > width || projectile.y < 64 || projectile.y > height;
      if (blocked || outside || projectile.remaining <= 0) {
        projectile.dead = true;
        return;
      }
      if (distanceSquared(projectile, player) <= (projectile.radius + CONFIG.playerRadius) ** 2) {
        damagePlayer(projectile.damage, projectile.x, projectile.y, "bomberDirect");
        projectile.dead = true;
      }
    });
    enemyProjectiles = enemyProjectiles.filter((projectile) => !projectile.dead);
  }

  function getMagneticFieldContactSeconds(enemy, dt) {
    const frameStart = elapsed - dt;
    const field = activeFields.find((candidate) =>
      frameStart < candidate.activeUntil &&
      elapsed >= candidate.createdAt &&
      distanceSquared(enemy, candidate) <= (candidate.radius + enemy.radius) ** 2
    );
    if (!field) return { seconds: 0, field: null };
    return {
      seconds: Math.max(
        0,
        Math.min(elapsed, field.activeUntil) - Math.max(frameStart, field.createdAt)
      ),
      field
    };
  }

  function updateMagneticFieldDamage(enemy, dt) {
    const contact = getMagneticFieldContactSeconds(enemy, dt);
    if (contact.seconds <= 0) {
      enemy.magneticFieldDamageTime = 0;
      return;
    }
    enemy.magneticFieldDamageTime += contact.seconds;
    while (enemy.magneticFieldDamageTime + 0.000001 >= CONFIG.magneticFieldDamageInterval && !enemy.dead) {
      enemy.magneticFieldDamageTime -= CONFIG.magneticFieldDamageInterval;
      damageEnemy(enemy, contact.field?.damagePerTick || CONFIG.magneticFieldDamage, false, {
        source: "magneticField",
        sequence: contact.field?.sequence || 0,
        color: COLORS.fieldCurrent,
        allowWeakpointBreak: true
      });
    }
  }

  function updateEnemies(dt) {
    const stakeLines = getStakeLines();
    let activeChaserAttacks = enemies.filter(
      (enemy) => enemy.type === "chaser" && (enemy.mode === "windup" || enemy.mode === "dash")
    ).length;
    let activeInterceptorAttacks = enemies.filter(
      (enemy) => enemy.type === "interceptor" && (enemy.mode === "windup" || enemy.mode === "dash")
    ).length;
    let activeBombs = enemyAttacks.filter((attack) => attack.type === "bomb").length;
    let activeDirect = enemies.filter((enemy) => enemy.type === "bomber" && enemy.mode === "directWindup").length +
      enemyProjectiles.length;

    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.spawnGrace = Math.max(0, enemy.spawnGrace - dt);
      enemy.stateTimer = Math.max(0, enemy.stateTimer - dt);
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
      processPendingHunterHits(enemy);
      if (enemy.dead) return;
      if (enemy.hunterStage > 0 && enemy.hunterMarkUntil < elapsed) clearHunterState(enemy);
      const crossingStakeLine = stakeLines.some(
        (line) => distanceToSegment(enemy, line.start, line.end) <= enemy.radius + 5
      );
      if (crossingStakeLine) enemy.stakeMarkedUntil = elapsed + CONFIG.stakeMarkSeconds;
      const insideField = isEnemyInsideActiveField(enemy);
      if (enemy.magnetTailPending && !insideField) {
        enemy.magnetTailPending = false;
        enemy.magnetSlowUntil = elapsed + 1.5;
      }
      updateMagneticFieldDamage(enemy, dt);
      if (enemy.dead) return;
      const magneticSlow = insideField || enemy.magnetSlowUntil > elapsed;
      const speedMultiplier = (crossingStakeLine ? CONFIG.stakeSlowMultiplier : 1) * (magneticSlow ? 0.6 : 1);

      if (enemy.mode === "stunned") {
        if (enemy.stateTimer <= 0) {
          enemy.mode = "move";
          enemy.attackCooldown = Math.max(enemy.attackCooldown, 0.35);
        } else {
          return;
        }
      }

      const previousMode = enemy.mode;
      if (enemy.type === "interceptor") {
        updateInterceptor(enemy, dt, speedMultiplier, activeInterceptorAttacks);
        if (previousMode !== "windup" && enemy.mode === "windup") activeInterceptorAttacks += 1;
      } else if (enemy.type === "bomber") {
        updateBomber(enemy, dt, speedMultiplier, activeBombs, activeDirect);
        if (previousMode !== "directWindup" && enemy.mode === "directWindup") activeDirect += 1;
        if (enemyAttacks.length > activeBombs) activeBombs = enemyAttacks.length;
      } else {
        updateChaser(enemy, dt, speedMultiplier, activeChaserAttacks);
        if (previousMode !== "windup" && enemy.mode === "windup") activeChaserAttacks += 1;
      }
    });
    enemies = enemies.filter((enemy) => !enemy.dead);
  }

  function burst(x, y, color, count, speed) {
    const availableSlots = Math.max(0, CONFIG.maxParticles - particles.length);
    const spawnCount = Math.min(count, availableSlots);
    for (let i = 0; i < spawnCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * (0.45 + Math.random() * 0.55);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        shape: "square",
        life: 0.28 + Math.random() * 0.18,
        maxLife: 0.46,
        size: 2 + Math.random() * 2
      });
    }
  }

  function spawnRecallImpact(x, y, vx, vy, charge, mechanic, killed, sequence = 0, color = COLORS.accent) {
    const strength = clamp(charge, 0, 1);
    const direction = Math.atan2(vy, vx);
    const motionScale = reducedMotionQuery.matches ? 0.65 : 1;
    const duration = 0.15 + strength * 0.08 + (mechanic ? 0.03 : 0);
    const radius = 20 + strength * 15 + (mechanic ? 6 : 0) + (killed ? 5 : 0);

    if (recallImpacts.length < CONFIG.maxRecallImpacts) {
      recallImpacts.push({
        x,
        y,
        angle: direction,
        strength,
        mechanic,
        killed,
        color,
        life: duration,
        maxLife: duration,
        radius
      });
    }

    const requestedFragments = Math.round((5 + strength * 6 + (mechanic ? 3 : 0)) * motionScale);
    const fragmentCount = Math.min(requestedFragments, Math.max(0, CONFIG.maxParticles - particles.length));
    for (let i = 0; i < fragmentCount; i += 1) {
      const angle = direction + (Math.random() - 0.5) * 1.5;
      const speed = (125 + strength * 135) * (0.65 + Math.random() * 0.5) * motionScale;
      const life = 0.14 + Math.random() * 0.12;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        shape: "streak",
        rotation: angle,
        length: 7 + strength * 8 + Math.random() * 5,
        life,
        maxLife: life,
        size: 2 + strength * 1.4
      });
    }

    const hitStopRange = CONFIG.recallHitStopMax - CONFIG.recallHitStopMin;
    const emphasis = clamp(strength + (mechanic ? 0.18 : 0) + (killed ? 0.12 : 0), 0, 1);
    const hitStop = (CONFIG.recallHitStopMin + hitStopRange * emphasis) * motionScale;
    if (sequence !== lastHitStopRecallSequence || hitStopRemaining > 0) {
      hitStopRemaining = Math.max(hitStopRemaining, hitStop);
      lastHitStopRecallSequence = sequence;
    }
    shake = Math.max(shake, (2.2 + strength * 2.2 + (mechanic ? 0.8 : 0)) * motionScale);
    recallImpactCount += 1;
    lastRecallImpact = { strength, mechanic, killed, hitStop };
  }

  function updateEffects(dt) {
    maxParticlesObserved = Math.max(maxParticlesObserved, particles.length);
    maxRadialWavesObserved = Math.max(maxRadialWavesObserved, radialWaves.length);
    maxDamageLabelsObserved = Math.max(maxDamageLabelsObserved, damageLabels.length);
    particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.92;
      particle.vy *= 0.92;
      particle.life -= dt;
    });
    particles = particles.filter((particle) => particle.life > 0);

    recallImpacts.forEach((impact) => {
      impact.life -= dt;
    });
    recallImpacts = recallImpacts.filter((impact) => impact.life > 0);

    radialWaves.forEach((wave) => {
      wave.life -= dt;
    });
    radialWaves = radialWaves.filter((wave) => wave.life > 0);

    const readyWaves = pendingWaves.filter((wave) => wave.triggerAt <= elapsed);
    pendingWaves = pendingWaves.filter((wave) => wave.triggerAt > elapsed);
    readyWaves.forEach(() => triggerCriticalWave(player.x, player.y, true));

    const readyFusionPulses = pendingFusionPulses.filter((pulse) => pulse.triggerAt <= elapsed);
    pendingFusionPulses = pendingFusionPulses.filter((pulse) => pulse.triggerAt > elapsed);
    readyFusionPulses.forEach((pulse) => {
      triggerFusionDamage(pulse.x, pulse.y, pulse.radius, pulse.damage, {
        source: "fusionEcho",
        color: pulse.color,
        immediatePull: pulse.pull
      });
      fusionStats.echo += 1;
    });
    activeFields.forEach((field) => {
      if (!field.collapseAt || field.collapsePlayed || elapsed < field.collapseAt) return;
      field.collapsePlayed = true;
      burst(field.x, field.y, COLORS.fieldCurrent, 24, 210);
      spawnRadialWave(field.x, field.y, true, {
        radius: field.radius,
        color: COLORS.fieldCurrent,
        lineWidth: 5,
        life: 0.28
      });
    });
    activeFields = activeFields.filter((field) => elapsed < field.visualUntil);

    damageLabels.forEach((label) => {
      label.y -= 28 * dt;
      label.life -= dt;
    });
    damageLabels = damageLabels.filter((label) => label.life > 0);
    shake = Math.max(0, shake - 18 * dt);
  }

  function checkUpgradeMilestone() {
    const milestone = UPGRADE_MILESTONES[nextUpgradeMilestoneIndex];
    if (!milestone || elapsed < milestone || upgradeChoiceActive) return false;
    showUpgradeChoice(milestone);
    return true;
  }

  function update(dt) {
    elapsed += dt;
    if (checkUpgradeMilestone()) {
      updateHud();
      return;
    }
    updatePlayer(dt);
    updateBullets(dt);
    updateSpawnWarnings(dt);
    updateEnemyAttacks(dt);
    updateEnemyProjectiles(dt);
    updateEnemies(dt);
    updateEffects(dt);

    fireClock -= dt;
    const weapon = getSelectedWeapon();
    if (weapon.fireMode !== "release" && fireClock <= 0 && fireBullet()) {
      fireClock = weapon.fireInterval;
    }

    spawnClock -= dt;
    if (spawnClock <= 0) {
      const phase = getPressurePhase();
      const nextPhaseIndex = PRESSURE_PHASES.indexOf(phase);
      if (nextPhaseIndex !== pressurePhaseIndex) {
        pressurePhaseIndex = nextPhaseIndex;
        if (pressurePhaseIndex === 1) queueEnemySpawn("interceptor");
        if (pressurePhaseIndex === 3) queueEnemySpawn("bomber");
      }
      if (enemies.length + spawnWarnings.length < phase.target) queueEnemySpawn();
      spawnClock = phase.refill;
    }

    if (elapsed >= 150 && musicState === "combat") playMusicState("boss", true);

    if (player.hp <= 0) finish(false);
    if (elapsed >= CONFIG.runSeconds) finish(true);
    updateHud();
  }

  function drawGrid() {
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1;
    const grid = 48;
    ctx.beginPath();
    for (let x = 0.5; x < width; x += grid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0.5; y < height; y += grid) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 79, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  function drawObstacles() {
    obstacles.forEach((rect) => {
      ctx.fillStyle = COLORS.ink;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = COLORS.paper;
      ctx.fillRect(rect.x + 3, rect.y + 3, rect.width - 6, rect.height - 6);
      ctx.save();
      ctx.beginPath();
      ctx.rect(rect.x + 3, rect.y + 3, rect.width - 6, rect.height - 6);
      ctx.clip();
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 3;
      for (let x = rect.x - rect.height; x < rect.x + rect.width + rect.height; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, rect.y + rect.height - 3);
        ctx.lineTo(x + rect.height, rect.y + 3);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawMagneticFields() {
    activeFields.forEach((field) => {
      const age = elapsed - field.createdAt;
      const expand = clamp(age / 0.25, 0, 1);
      const fade = elapsed <= field.activeUntil ? 1 : clamp((field.visualUntil - elapsed) / 0.15, 0, 1);
      const radius = field.radius * expand;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.fillStyle = "rgba(0, 217, 255, 0.08)";
      ctx.beginPath();
      ctx.arc(field.x, field.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(field.x, field.y, radius + 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.fieldEdge;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(field.x, field.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.fieldCurrent;
      ctx.lineWidth = 2;
      const currentCount = 8;
      for (let i = 0; i < currentCount; i += 1) {
        const ring = radius * (0.28 + (i % 4) * 0.16);
        const phase = elapsed * (2.4 + (i % 3) * 0.35) + i * 0.92;
        ctx.beginPath();
        ctx.arc(field.x, field.y, ring, phase, phase + 0.35 + (i % 2) * 0.18);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawStakeLines() {
    getStakeLines(true).forEach((line) => {
      ctx.save();
      if (!line.valid) {
        ctx.strokeStyle = "rgba(17, 17, 17, 0.32)";
        ctx.lineWidth = 2;
        ctx.setLineDash([7, 8]);
      } else {
        const charge = Math.min(
          clamp((elapsed - line.start.landedAt) / CONFIG.maxChargeSeconds, 0, 1),
          clamp((elapsed - line.end.landedAt) / CONFIG.maxChargeSeconds, 0, 1)
        );
        ctx.strokeStyle = `rgba(255, 79, 0, ${0.48 + charge * 0.42})`;
        ctx.lineWidth = 3 + charge * 2;
        ctx.shadowColor = COLORS.accent;
        ctx.shadowBlur = charge >= 1 ? 9 : 0;
      }
      if (!line.valid) {
        const dx = line.end.x - line.start.x;
        const dy = line.end.y - line.start.y;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = dx / distance;
        const ny = dy / distance;
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.start.x + nx * 38, line.start.y + ny * 38);
        ctx.moveTo(line.end.x, line.end.y);
        ctx.lineTo(line.end.x - nx * 38, line.end.y - ny * 38);
        ctx.stroke();

        const midX = (line.start.x + line.end.x) / 2;
        const midY = (line.start.y + line.end.y) / 2 - 22;
        ctx.setLineDash([]);
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(midX - 7, midY - 7);
        ctx.lineTo(midX + 7, midY + 7);
        ctx.moveTo(midX + 7, midY - 7);
        ctx.lineTo(midX - 7, midY + 7);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawStakeAimPreview() {
    if (getSelectedWeapon().id !== "stake") return;
    const direction = getManualAimDirection();
    const anchor = getPendingStakeAnchor();
    if (!direction || !anchor) return;

    const endpoint = getProjectedLandingPoint(direction);
    const distance = Math.hypot(endpoint.x - anchor.x, endpoint.y - anchor.y);
    const valid = distance <= getStakeLineMaxDistance();

    ctx.save();
    ctx.strokeStyle = "rgba(17, 17, 17, 0.16)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, getStakeLineMaxDistance(), 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = valid ? COLORS.accent : COLORS.ink;
    ctx.lineWidth = 3;
    ctx.setLineDash(valid ? [] : [7, 8]);
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(endpoint.x, endpoint.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = valid ? COLORS.accent : COLORS.ink;
    ctx.beginPath();
    ctx.arc(endpoint.x, endpoint.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSpawnWarnings() {
    spawnWarnings.forEach((warning) => {
      const progress = clamp(1 - warning.remaining / warning.duration, 0, 1);
      const radius = 29 - progress * 8;
      ctx.save();
      ctx.translate(warning.x, warning.y);
      ctx.rotate(elapsed * 1.8);
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = COLORS.accent;
        ctx.beginPath();
        ctx.moveTo(0, -radius - 5);
        ctx.lineTo(-4, -radius - 11);
        ctx.lineTo(4, -radius - 11);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.fillStyle = "rgba(255, 79, 0, 0.08)";
      ctx.beginPath();
      ctx.arc(warning.x, warning.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(warning.x, warning.y - 7);
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (warning.enemyType === "interceptor") {
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-6, 6);
        ctx.closePath();
      } else if (warning.enemyType === "bomber") {
        ctx.rect(-6, -6, 12, 12);
      } else {
        ctx.moveTo(0, -7);
        ctx.lineTo(7, 0);
        ctx.lineTo(0, 7);
        ctx.lineTo(-7, 0);
        ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = COLORS.accent;
      ctx.font = "700 12px Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(Math.max(1, Math.ceil(warning.remaining))), warning.x, warning.y + 9);
    });
    ctx.textBaseline = "alphabetic";
  }

  function drawTarget() {
    if (getSelectedWeapon().controlMode === "manual" || getManualAimDirection()) return;
    const target = enemies.find((enemy) => enemy.id === lockedTargetId);
    if (!target) return;
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i += 1) {
      const angle = i * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(
        target.x + Math.cos(angle) * (target.radius + 4),
        target.y + Math.sin(angle) * (target.radius + 4)
      );
      ctx.lineTo(
        target.x + Math.cos(angle) * (target.radius + 13),
        target.y + Math.sin(angle) * (target.radius + 13)
      );
      ctx.stroke();
    }
  }

  function drawEnemyTelegraphs() {
    enemyAttacks.forEach((attack) => {
      if (attack.type !== "bomb") return;
      const progress = clamp(1 - attack.remaining / attack.duration, 0, 1);
      ctx.save();
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = 2 + progress * 2;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.arc(attack.x, attack.y, attack.radius * (1.18 - progress * 0.18), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(255, 79, 0, ${0.06 + progress * 0.15})`;
      ctx.beginPath();
      ctx.arc(attack.x, attack.y, attack.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 79, 0, 0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(attack.sourceX, attack.sourceY);
      ctx.quadraticCurveTo(
        (attack.sourceX + attack.x) / 2,
        Math.min(attack.sourceY, attack.y) - 72,
        attack.x,
        attack.y
      );
      ctx.stroke();
      ctx.restore();
    });

    enemies.forEach((enemy) => {
      if (enemy.mode !== "windup" && enemy.mode !== "directWindup") return;
      ctx.save();
      ctx.strokeStyle = COLORS.accent;
      ctx.lineWidth = enemy.type === "interceptor" ? 3 : 2;
      if (enemy.type === "interceptor") ctx.setLineDash([12, 7]);
      ctx.beginPath();
      ctx.moveTo(enemy.x, enemy.y);
      if (enemy.type === "interceptor") {
        ctx.lineTo(enemy.x + enemy.dashX * 240, enemy.y + enemy.dashY * 240);
      } else {
        ctx.lineTo(enemy.aimX, enemy.aimY);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(enemy.aimX, enemy.aimY, enemy.type === "chaser" ? 12 : 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawEnemyProjectiles() {
    enemyProjectiles.forEach((projectile) => {
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(Math.atan2(projectile.vy, projectile.vx));
      ctx.strokeStyle = COLORS.paper;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-5, 0);
      ctx.stroke();
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-5, 0);
      ctx.stroke();
      ctx.fillStyle = COLORS.accent;
      ctx.fillRect(-5, -4, 10, 8);
      ctx.restore();
    });
  }

  function drawEnemies() {
    enemies.forEach((enemy) => {
      const healthRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      const angle = enemy.mode === "dash"
        ? Math.atan2(enemy.dashY, enemy.dashX)
        : Math.atan2(player.y - enemy.y, player.x - enemy.x);
      ctx.rotate(angle);
      ctx.fillStyle = enemy.flash > 0 || enemy.mode === "windup" || enemy.mode === "directWindup"
        ? COLORS.accent
        : COLORS.ink;

      if (enemy.type === "interceptor") {
        ctx.beginPath();
        ctx.moveTo(enemy.radius + 4, 0);
        ctx.lineTo(-enemy.radius, -enemy.radius * 0.78);
        ctx.lineTo(-enemy.radius * 0.55, 0);
        ctx.lineTo(-enemy.radius, enemy.radius * 0.78);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = COLORS.paper;
        ctx.fillRect(-5, -2, 11, 4);
      } else if (enemy.type === "bomber") {
        ctx.fillRect(-enemy.radius, -enemy.radius, enemy.radius * 2, enemy.radius * 2);
        ctx.fillStyle = COLORS.paper;
        ctx.fillRect(-8, -8, 16, 16);
        ctx.fillStyle = COLORS.accent;
        ctx.fillRect(-4, -4, 8, 8);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -enemy.radius);
        ctx.lineTo(enemy.radius, 0);
        ctx.lineTo(0, enemy.radius);
        ctx.lineTo(-enemy.radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = COLORS.paper;
        ctx.fillRect(-4, -4, 8, 8);
      }

      if (enemy.stakeMarkedUntil >= elapsed) {
        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      if (enemy.hunterStage === 1) {
        const r = enemy.radius + 9;
        ctx.save();
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(enemy.x - r, enemy.y - r + 8);
        ctx.lineTo(enemy.x - r, enemy.y - r);
        ctx.lineTo(enemy.x - r + 8, enemy.y - r);
        ctx.moveTo(enemy.x + r - 8, enemy.y + r);
        ctx.lineTo(enemy.x + r, enemy.y + r);
        ctx.lineTo(enemy.x + r, enemy.y + r - 8);
        ctx.stroke();
        ctx.strokeStyle = COLORS.hunterGold;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      } else if (enemy.hunterStage === 2) {
        const pulse = 1 + Math.sin(elapsed * Math.PI * 4) * 0.08;
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 10, 0.2, 2.65);
        ctx.arc(0, 0, enemy.radius + 10, 3.05, 5.65);
        ctx.stroke();
        ctx.strokeStyle = COLORS.weakpoint;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-5, -5, 10, 10);
        ctx.restore();
      }

      if (enemy.mode === "stunned") {
        ctx.strokeStyle = COLORS.fieldCurrent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y - enemy.radius - 12, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = COLORS.line;
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 8, enemy.radius * 2, 3);
      ctx.fillStyle = COLORS.danger;
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 8, enemy.radius * 2 * healthRatio, 3);
    });
  }

  function drawBullets() {
    bullets.forEach((bullet) => {
      if (bullet.state === "held") return;

      const bulletColor = bullet.didBounce ? COLORS.ricochet : COLORS.accent;

      if (bullet.state === "returning") {
        ctx.strokeStyle = bullet.didBounce ? "rgba(17, 17, 17, 0.46)" : "rgba(255, 79, 0, 0.38)";
        ctx.lineWidth = bullet.didBounce ? 6 : 3;
        ctx.beginPath();
        ctx.moveTo(bullet.x, bullet.y);
        ctx.lineTo(player.x, player.y);
        ctx.stroke();
        if (bullet.didBounce) {
          ctx.strokeStyle = "rgba(0, 102, 255, 0.72)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (bullet.state === "grounded") {
        const age = elapsed - bullet.landedAt;
        const charge = clamp(age / CONFIG.maxChargeSeconds, 0, 1);
        const pulse = charge >= 1 ? 1 + Math.sin(elapsed * 8) * 0.14 : 1;
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = `rgba(17, 17, 17, ${0.22 + charge * 0.68})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 10 + charge * 7, 0, Math.PI * 2);
        ctx.stroke();
        if (charge >= 1) {
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 21, 0, Math.PI * 2);
          ctx.stroke();
          for (let i = 0; i < 4; i += 1) {
            const angle = i * Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 23, Math.sin(angle) * 23);
            ctx.lineTo(Math.cos(angle) * 28, Math.sin(angle) * 28);
            ctx.stroke();
          }
        }
        ctx.fillStyle = bulletColor;
        ctx.globalAlpha = 0.45 + charge * 0.55;
        ctx.fillRect(-7, -3, 14, 6);
        if (bullet.didBounce) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = COLORS.white;
          ctx.fillRect(-2, -2, 4, 4);
        }
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      const angle = Math.atan2(bullet.vy, bullet.vx);
      ctx.rotate(angle);
      ctx.strokeStyle = bulletColor;
      ctx.lineWidth = bullet.state === "returning" ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-5, 0);
      ctx.stroke();
      if (bullet.magnetized) {
        ctx.strokeStyle = COLORS.fieldCurrent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-16, -4);
        ctx.lineTo(-7, -4);
        ctx.stroke();
      }
      ctx.fillStyle = bulletColor;
      ctx.fillRect(-6, -3, 13, 6);
      if (bullet.didBounce) {
        ctx.fillStyle = COLORS.white;
        ctx.fillRect(-1, -2, 4, 4);
      }
      ctx.restore();
    });
  }

  function drawPlayer() {
    const weapon = getSelectedWeapon();
    const manualDirection = getManualAimDirection();
    const target = weapon.controlMode === "auto" ? getLockedTarget() : null;
    let angle = player.facingAngle;
    if (manualDirection) angle = Math.atan2(manualDirection.y, manualDirection.x);
    else if (target) angle = Math.atan2(target.y - player.y, target.x - player.x);
    player.facingAngle = angle;

    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.shieldUntil > elapsed && player.shield > 0) {
      ctx.strokeStyle = COLORS.fieldCurrent;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.75 + Math.sin(elapsed * 10) * 0.15;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.rotate(angle);
    if (player.hitCooldown > 0 && Math.floor(player.hitCooldown * 18) % 2 === 0) ctx.globalAlpha = 0.35;
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-12, -13);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-12, 13);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.paper;
    ctx.beginPath();
    ctx.arc(-1, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPlayerStatus() {
    const held = bullets.filter((bullet) => bullet.state === "held").length;
    const fullyCharged = bullets.filter(
      (bullet) => bullet.state === "grounded" && elapsed - bullet.landedAt >= CONFIG.maxChargeSeconds
    ).length;
    const y = player.y + 35;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.paper;
    ctx.fillStyle = COLORS.ink;
    ctx.font = "700 14px Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";

    ctx.strokeRect(player.x - 43, y - 5, 16, 10);
    ctx.fillRect(player.x - 43, y - 5, 16, 10);
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(player.x - 40, y - 2, 3, 4);
    ctx.fillRect(player.x - 34, y - 2, 3, 4);
    ctx.strokeText(String(held), player.x - 19, y + 5);
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(String(held), player.x - 19, y + 5);

    ctx.strokeStyle = COLORS.paper;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(player.x + 29, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x + 29, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(player.x + 25, y - 2, 8, 4);
    ctx.strokeStyle = COLORS.paper;
    ctx.lineWidth = 3;
    ctx.strokeText(String(fullyCharged), player.x + 47, y + 5);
    ctx.fillText(String(fullyCharged), player.x + 47, y + 5);
    ctx.restore();
  }

  function drawEffects() {
    radialWaves.forEach((wave) => {
      const progress = 1 - wave.life / wave.maxLife;
      const targetRadius = wave.radius || (wave.second ? 90 : 45);
      const radius = progress <= 0.6
        ? 20 + (targetRadius - 20) * (progress / 0.6)
        : targetRadius;
      const alpha = progress <= 0.6 ? 0.9 : 0.9 * (1 - (progress - 0.6) / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = wave.color || COLORS.accent;
      ctx.lineWidth = wave.lineWidth || (wave.second ? 4 : 6);
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    recallImpacts.forEach((impact) => {
      const progress = 1 - impact.life / impact.maxLife;
      const alpha = (1 - progress) * (0.62 + impact.strength * 0.28);
      const radius = impact.radius * (0.3 + progress * 0.7);
      ctx.save();
      ctx.translate(impact.x, impact.y);
      ctx.rotate(impact.angle);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = impact.color || COLORS.accent;
      ctx.lineWidth = 2 + impact.strength * 2 + (impact.mechanic ? 1 : 0);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-radius * 0.7, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();
      if (impact.mechanic || impact.killed) {
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.68, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });

    particles.forEach((particle) => {
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      if (particle.shape === "streak") {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillRect(-particle.length / 2, -particle.size / 2, particle.length, particle.size);
        ctx.restore();
      } else {
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      }
    });
    ctx.globalAlpha = 1;

    damageLabels.forEach((label) => {
      ctx.globalAlpha = clamp(label.life / label.maxLife, 0, 1);
      ctx.fillStyle = label.color || (label.recall ? COLORS.accent : COLORS.ink);
      const recallSize = 17 + label.strength * 4 + (label.mechanic ? 2 : 0);
      ctx.font = `${label.recall ? 700 : 600} ${label.recall ? recallSize : 13}px Helvetica, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(String(label.value), label.x, label.y);
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.save();
    const shakeX = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const shakeY = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    ctx.translate(shakeX, shakeY);
    drawGrid();
    drawObstacles();
    drawMagneticFields();
    drawStakeLines();
    drawStakeAimPreview();
    drawSpawnWarnings();
    drawEnemyTelegraphs();
    drawTarget();
    drawEnemies();
    drawEnemyProjectiles();
    drawBullets();
    drawEffects();
    drawPlayer();
    drawPlayerStatus();
    ctx.restore();
  }

  function updateHud() {
    const hpRatio = clamp(player.hp / player.maxHp, 0, 1);
    healthFill.style.transform = `scaleX(${hpRatio})`;
    healthFill.style.background = COLORS.danger;
    healthValue.textContent = String(player.hp);

    let grounded = 0;
    let fullyCharged = 0;
    bullets.forEach((bullet, index) => {
      ammoPips.children[index].dataset.state = bullet.state;
      if (bullet.state === "grounded") {
        grounded += 1;
        if (elapsed - bullet.landedAt >= CONFIG.maxChargeSeconds) fullyCharged += 1;
      }
    });
    const lineStatus = getSelectedWeapon().id === "stake" ? ` · 阵线 ${getStakeLines().length}` : "";
    fieldStatus.textContent = `落地 ${grounded}${lineStatus} · 满蓄 ${fullyCharged}`;
    recallCount.textContent = String(grounded);
    recallButton.disabled = grounded === 0 || !running || paused || finished || upgradeChoiceActive;

    const remaining = Math.max(0, Math.ceil(CONFIG.runSeconds - elapsed));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerNode.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function finish(victory) {
    if (finished) return;
    releaseJoystick();
    releaseAimJoystick(null, true);
    finished = true;
    lastFinishedVictory = victory;
    running = false;
    spawnWarnings = [];
    enemyAttacks = [];
    enemyProjectiles = [];
    resultKicker.textContent = victory ? "生存完成" : "本轮结束";
    resultTitle.textContent = victory ? "完成测试" : "角色倒下";
    saveRunRecord(victory);
    resultSummary.textContent = `总分 ${getTotalScore()} · 击败 ${kills} 个敌人 · 执行 ${recalls} 次回收。`;
    const stats = [
      ["威胁分", threatScore],
      ["技巧分", getTechniqueScore()],
      ["满蓄命中", fullChargeHits],
      ["最高贯穿", highestRecallPierce],
      ["回膛击杀", recallKills],
      ["回膛击杀占比", kills ? `${Math.round(recallKills / kills * 100)}%` : "0%"],
      ["武器", getSelectedWeapon().name],
      ["用时", `${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, "0")}`]
    ];
    resultBreakdown.replaceChildren();
    stats.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "result-stat";
      item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      resultBreakdown.appendChild(item);
    });
    renderUpgradeChips(resultUpgrades);
    const upgradeLabel = document.createElement("strong");
    upgradeLabel.textContent = "本局升级";
    resultUpgrades.prepend(upgradeLabel);
    pausePanel.hidden = true;
    exitConfirmPanel.hidden = true;
    resultPanel.hidden = false;
    if (victory) playMusicState("victory", true);
    else playMusicState("results", true);
    updateHud();
  }

  function startGame() {
    resetGame();
    stopUpgradePreviewVideo();
    stopAllSfx();
    setStartScreenActive(false);
    startPanel.hidden = true;
    resultPanel.hidden = true;
    pausePanel.hidden = true;
    exitConfirmPanel.hidden = true;
    weaponSelectScreen.hidden = true;
    weaponDetailScreen.hidden = true;
    recordsScreen.hidden = true;
    upgradeScreen.hidden = true;
    upgradeDetailScreen.hidden = true;
    running = true;
    lastTime = performance.now();
    playMusicState("combat", true);
    updateHud();
  }

  function setPaused(value) {
    if (!running || finished || upgradeChoiceActive) return;
    paused = value;
    if (paused) {
      releaseJoystick();
      releaseAimJoystick(null, true);
    }
    pausePanel.hidden = !paused;
    exitConfirmPanel.hidden = true;
    if (paused) {
      renderUpgradeChips(pauseUpgradeList);
      pauseAllMusic();
      stopAllSfx();
    }
    else {
      lastTime = performance.now();
      resumeCurrentMusic();
    }
    updateHud();
  }

  function showExitConfirmation() {
    if (!running || !paused || finished) return;
    pausePanel.hidden = true;
    exitConfirmPanel.hidden = false;
    confirmExitButton.focus();
  }

  function closeExitConfirmation() {
    if (exitConfirmPanel.hidden) return;
    exitConfirmPanel.hidden = true;
    pausePanel.hidden = false;
    exitRunButton.focus();
  }

  function exitCurrentRun() {
    keys.clear();
    releaseJoystick();
    releaseAimJoystick(null, true);
    running = false;
    paused = false;
    resetGame();
    showStartPanel();
  }

  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;
    updateMusicDuck(now);
    if (running && !paused && !finished && !upgradeChoiceActive) {
      if (hitStopRemaining > 0) {
        hitStopRemaining = Math.max(0, hitStopRemaining - dt);
        hitStopTime += dt;
        elapsed += dt;
        if (checkUpgradeMilestone()) updateHud();
        else if (elapsed >= CONFIG.runSeconds) finish(true);
        else updateHud();
      } else {
        update(dt);
      }
    }
    draw();
    drawWeaponPreview(now);
    drawUpgradePreview(now);
    requestAnimationFrame(frame);
  }

  function getPointerGamePoint(event) {
    const rect = gameShell.getBoundingClientRect();
    if (virtualLandscapeActive) {
      return {
        x: clamp(event.clientY - rect.top, 0, width),
        y: clamp(rect.right - event.clientX, 0, height)
      };
    }
    return {
      x: clamp(event.clientX - rect.left, 0, width),
      y: clamp(event.clientY - rect.top, 0, height)
    };
  }

  function updateJoystick(point) {
    let dx = point.x - joystickState.originX;
    let dy = point.y - joystickState.originY;
    const maxDistance = joystick.offsetWidth * 0.31;
    const distance = Math.hypot(dx, dy);
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    joystickState.x = dx / maxDistance;
    joystickState.y = dy / maxDistance;
    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function releaseJoystick(event) {
    if (!joystickState.active || (event && event.pointerId !== joystickState.pointerId)) return;
    joystickState.active = false;
    joystickState.pointerId = null;
    joystickState.originX = 0;
    joystickState.originY = 0;
    joystickState.x = 0;
    joystickState.y = 0;
    joystick.classList.add("is-hidden");
    joystickKnob.style.transform = "translate(0, 0)";
  }

  function updateAimJoystick(point) {
    let dx = point.x - aimState.originX;
    let dy = point.y - aimState.originY;
    const maxDistance = 38;
    const distance = Math.hypot(dx, dy);
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    aimState.x = dx / maxDistance;
    aimState.y = dy / maxDistance;
    if (Math.hypot(aimState.x, aimState.y) >= 0.18) {
      player.facingAngle = Math.atan2(aimState.y, aimState.x);
    }
    aimJoystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function releaseAimJoystick(event, cancelShot = false) {
    if (!aimState.active || (event && event.pointerId !== aimState.pointerId)) return;
    const magnitude = Math.hypot(aimState.x, aimState.y);
    const direction = magnitude >= 0.18
      ? { x: aimState.x / magnitude, y: aimState.y / magnitude }
      : null;
    const shouldFireStake =
      !cancelShot &&
      (!event || event.type !== "pointercancel") &&
      running &&
      !paused &&
      getSelectedWeapon().fireMode === "release" &&
      direction;
    aimState.active = false;
    aimState.pointerId = null;
    aimState.x = 0;
    aimState.y = 0;
    aimJoystick.classList.add("is-hidden");
    aimJoystickKnob.style.transform = "translate(0, 0)";
    if (shouldFireStake) fireBullet(direction);
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (!running || paused || upgradeChoiceActive) return;
    const point = getPointerGamePoint(event);
    if (point.x < width * 0.5) {
      if (joystickState.active) return;
      event.preventDefault();
      joystickState.active = true;
      joystickState.pointerId = event.pointerId;
      joystickState.originX = point.x;
      joystickState.originY = point.y;
      joystickState.x = 0;
      joystickState.y = 0;
      joystick.style.left = `${point.x}px`;
      joystick.style.top = `${point.y}px`;
      joystick.classList.remove("is-hidden");
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {}
      return;
    }
    if (getSelectedWeapon().controlMode !== "manual" || aimState.active) return;
    event.preventDefault();
    aimState.active = true;
    aimState.pointerId = event.pointerId;
    aimState.originX = point.x;
    aimState.originY = point.y;
    aimState.x = 0;
    aimState.y = 0;
    aimJoystick.style.left = `${point.x}px`;
    aimJoystick.style.top = `${point.y}px`;
    aimJoystick.classList.remove("is-hidden");
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {}
  });
  canvas.addEventListener("pointermove", (event) => {
    const point = getPointerGamePoint(event);
    if (joystickState.active && event.pointerId === joystickState.pointerId) updateJoystick(point);
    if (aimState.active && event.pointerId === aimState.pointerId) updateAimJoystick(point);
  });
  canvas.addEventListener("pointerup", (event) => {
    releaseJoystick(event);
    releaseAimJoystick(event);
  });
  canvas.addEventListener("pointercancel", (event) => {
    releaseJoystick(event);
    releaseAimJoystick(event, true);
  });

  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (event.code === "Space" && !event.repeat) recallGroundedBullets();
    if (event.code === "Escape" && upgradeChoiceActive && !event.repeat) {
      event.preventDefault();
      if (!upgradeDetailScreen.hidden) {
        closeUpgradeDetail();
        playUiSfx("uiBack");
      }
      return;
    }
    if (event.code === "Escape" && running && !event.repeat) {
      event.preventDefault();
      if (!exitConfirmPanel.hidden) {
        closeExitConfirmation();
        playUiSfx("uiBack");
      } else if (paused) {
        setPaused(false);
        playUiSfx("uiContinue");
      } else {
        setPaused(true);
      }
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  window.addEventListener("blur", () => {
    keys.clear();
    releaseJoystick();
    releaseAimJoystick(null, true);
    if (running && !finished && !paused) setPaused(true);
  });
  window.addEventListener("resize", resize);
  window.visualViewport?.addEventListener("resize", resize);
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("pointerdown", unlockMusic, { capture: true });
  document.addEventListener("keydown", unlockMusic, { capture: true });
  document.addEventListener("visibilitychange", () => {
    musicSuspended = document.hidden;
    if (musicSuspended) {
      pauseAllMusic();
      stopAllSfx();
      upgradePreviewVideo.pause();
    }
    else if (!paused && !upgradeChoiceActive) {
      resumeCurrentMusic();
      if (!upgradeDetailScreen.hidden) upgradePreviewVideo.play().catch(() => {});
    }
  });

  recallButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    recallGroundedBullets();
  });
  startButton.addEventListener("click", () => {
    showWeaponSelection();
    playUiSfx("uiStart");
  });
  recordsButton.addEventListener("click", showRecords);
  sharePlaytestButton.addEventListener("click", sharePlaytestReport);
  recordsBack.addEventListener("click", () => {
    showStartPanel();
    playUiSfx("uiBack");
  });
  restartButton.addEventListener("click", () => {
    showWeaponSelection();
    playUiSfx("uiStart");
  });
  weaponSelectBack.addEventListener("click", () => {
    showStartPanel();
    playUiSfx("uiBack");
  });
  weaponDetailBack.addEventListener("click", () => {
    showWeaponSelection();
    playUiSfx("uiBack");
  });
  quickStartButton.addEventListener("click", () => {
    startWithWeapon(selectedWeaponId);
    playUiSfx("uiStart");
  });
  selectWeaponButton.addEventListener("click", () => {
    startWithWeapon(detailWeaponId);
    playUiSfx("uiStart");
  });
  pauseButton.addEventListener("click", () => setPaused(true));
  resumeButton.addEventListener("click", () => {
    const wasPaused = paused;
    setPaused(false);
    if (wasPaused && !paused) playUiSfx("uiContinue");
  });
  musicVolume.addEventListener("input", () => setMusicVolume(musicVolume.value));
  sfxVolume.addEventListener("input", () => setSfxVolume(sfxVolume.value));
  exitRunButton.addEventListener("click", showExitConfirmation);
  cancelExitButton.addEventListener("click", () => {
    const wasOpen = !exitConfirmPanel.hidden;
    closeExitConfirmation();
    if (wasOpen && exitConfirmPanel.hidden) playUiSfx("uiBack");
  });
  confirmExitButton.addEventListener("click", () => {
    const canExit = running && paused && !finished;
    exitCurrentRun();
    if (canExit && !running) playUiSfx("uiExit");
  });
  upgradeDetailBack.addEventListener("click", () => {
    const wasOpen = !upgradeDetailScreen.hidden;
    closeUpgradeDetail();
    if (wasOpen && upgradeDetailScreen.hidden) playUiSfx("uiBack");
  });
  upgradePreviewVideo.addEventListener("error", () => {
    if (upgradeDetailScreen.hidden) return;
    upgradePreviewVideo.hidden = true;
    upgradePreviewCanvas.hidden = false;
  });
  musicPlayers.victory.addEventListener("ended", () => {
    if (finished) playMusicState("results", true);
  });

  window.__grayboxDebug = Object.freeze({
    setElapsed(seconds) {
      const next = Number(seconds);
      if (Number.isFinite(next)) elapsed = clamp(next, 0, CONFIG.runSeconds);
      updateHud();
    },
    setUpgradePreviewTime(seconds) {
      const next = Number(seconds);
      if (!Number.isFinite(next)) return;
      previewCaptureTime = Math.max(0, next);
      if (!upgradeDetailScreen.hidden && detailUpgradeId) drawUpgradePreview(performance.now());
    },
    clearUpgradePreviewTime() {
      previewCaptureTime = null;
      upgradePreviewStartedAt = performance.now();
    },
    triggerUpgrade(milestone) {
      const requested = Number(milestone);
      if (UPGRADE_MILESTONES.includes(requested)) showUpgradeChoice(requested);
    },
    selectUpgrade(id) {
      chooseUpgrade(id);
    },
    grantUpgrade(id) {
      if (UPGRADES[id] && !acquiredUpgradeIds.includes(id)) acquiredUpgradeIds.push(id);
      renderUpgradeChips(pauseUpgradeList);
    },
    playUiAction(id) {
      return playUiSfx(id);
    },
    setMoveVector(x, y) {
      joystickState.x = clamp(Number(x) || 0, -1, 1);
      joystickState.y = clamp(Number(y) || 0, -1, 1);
    },
    fireDirection(angle) {
      const radians = Number(angle);
      if (!Number.isFinite(radians)) return false;
      return fireBullet({ x: Math.cos(radians), y: Math.sin(radians) });
    },
    stepSimulation(seconds, stepSeconds = 1 / 60) {
      let remaining = Math.max(0, Number(seconds) || 0);
      const fixedStep = clamp(Number(stepSeconds) || 1 / 60, 1 / 240, 0.05);
      while (remaining > 0 && running && !finished && !upgradeChoiceActive) {
        const dt = Math.min(fixedStep, remaining);
        update(dt);
        remaining -= dt;
      }
      return remaining;
    },
    render() {
      draw();
    },
    configureGroundedBullets(points, age = 3) {
      const positions = Array.isArray(points) ? points.slice(0, 6) : [];
      bullets.forEach((bullet, index) => {
        if (index < positions.length) {
          const point = positions[index];
          bullet.state = "grounded";
          bullet.x = clamp(Number(point.x), 14, width - 14);
          bullet.y = clamp(Number(point.y), 68, height - 14);
          bullet.landedAt = elapsed - clamp(Number(age) || 0, 0, 20);
          bullet.weaponId = selectedWeaponId;
          bullet.didBounce = Boolean(point.didBounce);
          bullet.chargeBonus = 0;
          bullet.returnHits.clear();
          bullet.outboundHits.clear();
        } else {
          bullet.state = "held";
          bullet.x = player.x;
          bullet.y = player.y;
        }
      });
      updateHud();
    },
    recall() {
      recallGroundedBullets();
    },
    setPlayerHp(hp) {
      player.hp = clamp(Number(hp) || 0, 0, player.maxHp);
      updateHud();
    },
    setLastFieldActivatedAt(value) {
      lastFieldActivatedAt = Number(value);
    },
    createField(options = {}) {
      const normalized = { ...options };
      if (Array.isArray(options.upgradeIds)) normalized.upgradeIds = new Set(options.upgradeIds);
      return createMagneticField(normalized).id;
    },
    setEnemyPosition(id, x, y) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      if (!enemy) return false;
      enemy.x = clamp(Number(x) || enemy.x, enemy.radius, width - enemy.radius);
      enemy.y = clamp(Number(y) || enemy.y, 66 + enemy.radius, height - enemy.radius);
      return true;
    },
    setEnemyHunterStage(id, stage, ready = true) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      if (!enemy) return false;
      const nextStage = clamp(Math.round(Number(stage) || 0), 0, 2);
      if (nextStage === 0) clearHunterState(enemy);
      else setHunterStage(enemy, nextStage, nextStage === 1 ? 5 : 3);
      if (ready) enemy.hunterNextAdvanceAt = elapsed;
      return true;
    },
    damageTestEnemy(id, amount, options = {}) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      if (!enemy) return false;
      damageEnemy(enemy, Math.max(0, Number(amount) || 0), false, {
        source: options.source || "test",
        sequence: Number(options.sequence) || 0,
        color: options.color || COLORS.accent,
        allowWeakpointBreak: options.allowWeakpointBreak !== false
      });
      return true;
    },
    damageTestPlayer(amount, sourceType = "test") {
      return damagePlayer(Math.max(0, Number(amount) || 0), player.x + 60, player.y, sourceType);
    },
    displaceTestEnemy(id, originX, originY, distance) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      if (!enemy) return false;
      knockbackEnemy(enemy, Number(originX) || 0, Number(originY) || 0, Number(distance) || 0);
      return true;
    },
    finalizeRecallBatch(sequence) {
      finalizeRecallBatch(Number(sequence) || 0);
    },
    applyMagnetizedHit(id, sequence) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      const batch = recallBatches.get(Number(sequence) || 0);
      if (!enemy || !batch) return false;
      applyMagnetizedHit(enemy, batch);
      return true;
    },
    processHunterHit(id, sequence) {
      const enemy = enemies.find((candidate) => candidate.id === Number(id));
      if (!enemy) return null;
      return processHunterHit(enemy, Number(sequence) || 0);
    },
    finishRun(victory = true) {
      finish(Boolean(victory));
    },
    playtestReport(victory = lastFinishedVictory) {
      return buildPlaytestReport(Boolean(victory));
    },
    records() {
      return readPersonalRecords();
    },
    testFieldQualification(bulletCount) {
      const count = clamp(Math.floor(Number(bulletCount) || 0), 0, 6);
      return getRecallFieldQualification(Array.from({ length: count }, () => ({})));
    },
    testAngleQualification() {
      return { ...getRecallFieldQualification([{}, {}, {}]), angleRequirementRemoved: true };
    },
    testFieldCooldown(delta) {
      return isFieldCooldownReady(Number(delta), 0);
    },
    clearThreats() {
      enemies = [];
      spawnWarnings = [];
      enemyAttacks = [];
      enemyProjectiles = [];
      spawnClock = 999;
      player.hp = player.maxHp;
      player.hitCooldown = 0;
      damageBySource = {};
      updateHud();
    },
    setPlayerPosition(x, y) {
      const nextX = Number(x);
      const nextY = Number(y);
      player.x = clamp(Number.isFinite(nextX) ? nextX : width / 2, 26, width - 26);
      player.y = clamp(Number.isFinite(nextY) ? nextY : height / 2, 66, height - 26);
    },
    spawnTestEnemy(enemyType, x, y, options = {}) {
      const spawnX = Number(x);
      const spawnY = Number(y);
      spawnEnemyAt(
        clamp(Number.isFinite(spawnX) ? spawnX : width - 48, 18, width - 18),
        clamp(Number.isFinite(spawnY) ? spawnY : 92, 82, height - 18),
        enemyType
      );
      const enemy = enemies[enemies.length - 1];
      if (!enemy) return null;
      enemy.attackCooldown = Number.isFinite(options.attackCooldown) ? options.attackCooldown : 0;
      if (Number.isFinite(options.health)) {
        enemy.hp = options.health;
        enemy.maxHp = options.health;
      }
      if (Number.isFinite(options.stunnedSeconds) && options.stunnedSeconds > 0) {
        enemy.mode = "stunned";
        enemy.stateTimer = options.stunnedSeconds;
      }
      return enemy.id;
    },
    snapshot() {
      const enemyCounts = { chaser: 0, interceptor: 0, bomber: 0 };
      const enemyModes = {};
      enemies.forEach((enemy) => {
        enemyCounts[enemy.type] = (enemyCounts[enemy.type] || 0) + 1;
        const key = `${enemy.type}:${enemy.mode}`;
        enemyModes[key] = (enemyModes[key] || 0) + 1;
      });
      return {
        elapsed,
        weaponId: selectedWeaponId,
        hp: player.hp,
        maxHp: player.maxHp,
        kills,
        recalls,
        runSeconds: CONFIG.runSeconds,
        playerPosition: { x: player.x, y: player.y },
        viewport: { width, height, virtualLandscape: virtualLandscapeActive },
        controls: {
          move: {
            active: joystickState.active,
            x: joystickState.x,
            y: joystickState.y
          },
          aim: {
            active: aimState.active,
            x: aimState.x,
            y: aimState.y
          }
        },
        running,
        finished,
        phaseIndex: PRESSURE_PHASES.indexOf(getPressurePhase()),
        enemyCounts,
        enemyModes,
        enemyStates: enemies.map((enemy) => ({
          id: enemy.id,
          type: enemy.type,
          mode: enemy.mode,
          x: enemy.x,
          y: enemy.y,
          aimX: enemy.aimX,
          aimY: enemy.aimY
        })),
        spawnWarnings: spawnWarnings.map((warning) => warning.enemyType),
        bombWarnings: enemyAttacks.length,
        enemyAttacks: enemyAttacks.map((attack) => ({
          type: attack.type,
          x: attack.x,
          y: attack.y,
          radius: attack.radius,
          remaining: attack.remaining
        })),
        enemyProjectiles: enemyProjectiles.length,
        projectileStates: enemyProjectiles.map((projectile) => ({
          x: projectile.x,
          y: projectile.y,
          vx: projectile.vx,
          vy: projectile.vy,
          radius: projectile.radius
        })),
        damageBySource: { ...damageBySource },
        outgoingDamageBySource: { ...outgoingDamageBySource },
        hitStopRemaining,
        hitStopTime,
        recallImpacts: recallImpacts.length,
        recallImpactCount,
        lastRecallImpact,
        bulletStates: bullets.map((bullet) => bullet.state),
        bullets: bullets.map((bullet) => ({
          id: bullet.id,
          state: bullet.state,
          didBounce: bullet.didBounce,
          magnetized: bullet.magnetized,
          fieldChargeGranted: bullet.fieldChargeGranted,
          chargeBonus: bullet.chargeBonus,
          returnHits: bullet.returnHits.size
        })),
        upgrades: acquiredUpgradeIds.slice(),
        activeFusionId: getActiveFusionId(),
        upgradeChoiceActive,
        upgradeChoiceMilestone,
        upgradeChoiceIds: upgradeChoiceIds.slice(),
        fieldCount: activeFields.filter((field) => elapsed < field.activeUntil).length,
        fields: activeFields.map((field) => ({
          id: field.id,
          x: field.x,
          y: field.y,
          radius: field.radius,
          createdAt: field.createdAt,
          activeUntil: field.activeUntil,
          fusionId: field.fusionId,
          sequence: field.sequence,
          huntLoopUsed: field.huntLoopUsed,
          huntMarkedIds: Array.from(field.huntMarkedIds || []),
          damagePerTick: field.damagePerTick,
          collapseAt: field.collapseAt || null,
          collapsePlayed: Boolean(field.collapsePlayed)
        })),
        lastFieldActivatedAt,
        radialWaves: radialWaves.length,
        particles: particles.length,
        damageLabels: damageLabels.length,
        pendingWaves: pendingWaves.length,
        pendingFusionPulses: pendingFusionPulses.length,
        recallBatches: Array.from(recallBatches.values()).map((batch) => ({
          id: batch.id,
          bulletCount: batch.bulletCount,
          hitCount: batch.hitCount,
          finalized: batch.finalized,
          hitSoundPlayed: batch.hitSoundPlayed,
          allSixFullyCharged: batch.allSixFullyCharged,
          fusionId: batch.fusionId,
          fieldQualified: batch.fieldQualified,
          fieldCreated: batch.fieldCreated,
          fieldId: batch.fieldId,
          remainingBulletIds: batch.bulletIds.size,
          upgradeIds: Array.from(batch.upgradeIds || [])
        })),
        fusionStats: { ...fusionStats },
        observations: {
          maxEnemies: maxEnemiesObserved,
          maxParticles: maxParticlesObserved,
          maxRadialWaves: maxRadialWavesObserved,
          maxDamageLabels: maxDamageLabelsObserved
        },
        playerEffects: {
          shield: player.shield,
          shieldUntil: player.shieldUntil,
          shieldCooldownUntil: player.shieldCooldownUntil,
          strideUntil: player.strideUntil,
          strideCooldownUntil: player.strideCooldownUntil
        },
        score: {
          total: getTotalScore(),
          threat: threatScore,
          technique: getTechniqueScore(),
          recallKills,
          fullChargeHits,
          highestRecallPierce
        },
        music: {
          state: musicState,
          unlocked: musicUnlocked,
          suspended: musicSuspended,
          baseGain: musicBaseGain,
          ducking: musicDuck ? {
            sequence: musicDuck.sequence,
            depthDb: musicDuck.depthDb
          } : null,
          volume: musicPlayers[musicState]?.volume ?? 0,
          playing: Object.entries(musicPlayers).filter(([, audio]) => !audio.paused).map(([id]) => id)
        },
        sfx: {
          gain: sfxGain,
          activeVoices: sfxVoices.filter((voice) => voice.busy).length,
          poolSize: sfxVoices.length,
          emptyArmed: emptySfxArmed
        },
        uiSfx: {
          activeVoices: uiSfxVoices.filter((voice) => voice.busy).length,
          poolSize: uiSfxVoices.length,
          mergeKeys: Array.from(uiSfxMergeUntil.keys())
        },
        enemies: enemies.map((enemy) => ({
          id: enemy.id,
          type: enemy.type,
          hp: enemy.hp,
          mode: enemy.mode,
          hunterStage: enemy.hunterStage,
          hunterMarkUntil: enemy.hunterMarkUntil,
          hunterStageChangedAt: enemy.hunterStageChangedAt,
          hunterNextAdvanceAt: enemy.hunterNextAdvanceAt,
          hunterPendingHits: enemy.hunterPendingHits.length,
          magnetTailPending: enemy.magnetTailPending,
          magnetSlowUntil: enemy.magnetSlowUntil,
          magneticFieldDamageTime: enemy.magneticFieldDamageTime
        }))
      };
    }
  });

  resetGame();
  setMusicVolume(readMusicVolume(), false);
  setSfxVolume(readSfxVolume(), false);
  renderWeaponList();
  resize();
  if (startUiDemoMode) {
    gameShell.classList.add("is-start-ui-demo");
    window.__startScreenDemo = Object.freeze({
      replay: replayStartScreenAnimation,
      getState: () => ({
        active: gameShell.classList.contains("is-start-screen") && !startPanel.hidden,
        reducedMotion: reducedMotionQuery.matches,
        bullets: startPanel.querySelectorAll(".start-bullet").length,
        trails: startPanel.querySelectorAll(".start-trail").length
      })
    });
    setStartScreenActive(true, true);
  }
  requestAnimationFrame(frame);
})();
