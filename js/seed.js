// === Seed data: example PhD programs ===
const SeedData = {
  seed(state) {
    state.programs = this.getPrograms();
    state.recommenders = this.getRecommenders();
    state.documents = this.getDocuments();
    state.materials = {};
    state.programs.forEach(p => state.ensureMaterials(p.id));
  },

  getPrograms() {
    // 2027入学季的截止日期大部分还未公布，以下为往年参考
    const programs = [
      // ==================== 丹麦 ====================
      {
        country: 'Denmark', institution: 'University of Copenhagen — DAWN (Cosmic Dawn Center)',
        researchDirection: 'Cosmic Dawn, First Galaxies, Early Universe Evolution (JWST/ALMA)',
        matchingNotes: '全球顶尖。每年约4个PhD Fellowship。PRIMORDIAL (Heintz)、RISES (Mason)、COSMOS-3D (Kakiichi)、HEAVYMETAL (Watson)。JWST/ALMA 数据分析、高红移星系 SMF/SFRF 测量。',
        websiteURL: 'https://cosmicdawn.ku.dk/',
        deadline: '2025-12-14', location: 'Copenhagen', funding: 'DFF + Villum + ERC 全额资助', tier: '冲刺', status: 'active'
      },
      {
        country: 'Denmark', institution: 'University of Copenhagen — DARK (Dark Cosmology Centre)',
        researchDirection: 'Dark Matter, Supernovae, Galaxy Formation at Cosmological Scales',
        matchingNotes: '结合暗物质晕模型研究星系质量积累。DARK 与 DAWN 密切合作，部分资源可共享。',
        websiteURL: 'https://dark.nbi.ku.dk/', deadline: '', location: 'Copenhagen', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Denmark', institution: 'Technical University of Denmark (DTU Space)',
        researchDirection: 'Galaxy Formation, Early Universe, ISM/CGM (JWST/ALMA)',
        matchingNotes: 'PhD Scholarship in Galaxy Formation (Kasper Heintz)。利用 Euclid 等巡天项目进行大数据处理。Supervisor: kasper.heintz@space.dtu.dk。',
        websiteURL: 'https://www.space.dtu.dk/', deadline: '2026-03-20', location: 'Lyngby (Copenhagen)', funding: '全额资助（DFF）', tier: '核心', status: 'active'
      },
      {
        country: 'Denmark', institution: 'Aarhus University — Dept. of Physics and Astronomy',
        researchDirection: 'Stellar Astrophysics (Asteroseismology), Exoplanets',
        matchingNotes: '侧重于星系内部的恒星族群性质。如有星震学与星系演化交叉方向可考虑。',
        websiteURL: 'https://phys.au.dk/', deadline: '', location: 'Aarhus', funding: '', tier: '', status: 'active'
      },
      // ==================== 瑞典 ====================
      {
        country: 'Sweden', institution: 'Stockholm University — Oskar Klein Centre / Dept of Astronomy',
        researchDirection: 'Particle Astrophysics, Galaxy Dynamics, Dark Matter, Cosmology',
        matchingNotes: '2026年开放PhD: Theoretical Cosmology (3月2日截止) + Neutrino Astroparticle (4月19日)。适合将星系演化统计与宇宙学模型对比。',
        websiteURL: 'https://www.okc.albanova.se/', deadline: '2026-03-02', location: 'Stockholm', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Sweden', institution: 'Lund University — Lund Observatory',
        researchDirection: 'Galaxy Formation Simulations, Milky Way Dynamics, ARRAKIHS Mission',
        matchingNotes: 'PhD in Galaxy Formation & ARRAKIHS (PA2026/1031)。数值模拟（如 VINTERGATAN）与观测数据的交叉验证。Python/Fortran 编程。',
        websiteURL: 'https://www.astro.lu.se/', deadline: '2026-07-09', location: 'Lund', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Sweden', institution: 'Chalmers University of Technology — Onsala Space Observatory',
        researchDirection: 'Radio Astronomy, ISM, Star Formation',
        matchingNotes: '利用 ALMA 研究星系冷气体如何影响 SFRF。北欧最大的射电天文中心。',
        websiteURL: 'https://www.chalmers.se/en/departments/rss/', deadline: '', location: 'Gothenburg', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Sweden', institution: 'Uppsala University',
        researchDirection: 'Stellar Evolution, Galactic Chemical Evolution, Early Universe',
        matchingNotes: '深度 SED Fitting 以及恒星族群合成（SSP）研究。',
        websiteURL: 'https://www.physics.uu.se/', deadline: '', location: 'Uppsala', funding: '', tier: '', status: 'active'
      },
      // ==================== 挪威 ====================
      {
        country: 'Norway', institution: 'University of Oslo — ITA (Institute of Theoretical Astrophysics)',
        researchDirection: 'Cosmological Simulations, Extragalactic Astrophysics, CMB',
        matchingNotes: '2026年开放: Extragalactic Astrophysics (Sijing Shen, ARRAKIHS) + Cosmology (Cosmoglobe/Euclid)。适合大尺度宇宙学模拟（IllustrisTNG/EAGLE）分析。薪资: NOK 550k-595k/年。',
        websiteURL: 'https://www.mn.uio.no/astro/english/', deadline: '2026-03-01', location: 'Oslo', funding: 'NOK 550,800 - 595,000/年', tier: '核心', status: 'active'
      },
      {
        country: 'Norway', institution: 'University of Bergen',
        researchDirection: 'High-Energy Astrophysics, Space Science',
        matchingNotes: '侧重于极端环境下的物理过程。',
        websiteURL: 'https://www.uib.no/en/physics', deadline: '', location: 'Bergen', funding: '', tier: '', status: 'active'
      },
      // ==================== 芬兰 ====================
      {
        country: 'Finland', institution: 'University of Helsinki — PAPU Doctoral Programme',
        researchDirection: 'Galaxy Formation Computing, Cosmology, Dark Matter',
        matchingNotes: '使用 Python/Slurm 进行大规模流体动力学模拟分析。Doctoral Programme in Particle Physics and Universe Sciences (PAPU)。申请季约4月截止。',
        websiteURL: 'https://www.helsinki.fi/en/admissions-and-education/apply-doctoral-programmes/doctoral-programme-particle-physics-and-universe-sciences', deadline: '', location: 'Helsinki', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Finland', institution: 'University of Turku — Tuorla Observatory',
        researchDirection: 'AGN, High-Energy Astrophysics',
        matchingNotes: '研究 AGN 反馈（Feedback）如何影响星系的 SFR。',
        websiteURL: 'https://www.utu.fi/en/university/faculty-of-science/physics-and-astronomy', deadline: '', location: 'Turku', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Finland', institution: 'Aalto University — Metsähovi Radio Observatory',
        researchDirection: 'Radio Astronomy, AGN, Multi-wavelength',
        matchingNotes: '多波段观测数据统计处理。Aalto Doctoral Programme in Science，申请滚动制（每月初审核）。建议先直接联系意向导师。',
        websiteURL: 'https://www.aalto.fi/en/aalto-university/metsahovi-radio-observatory', deadline: '', location: 'Espoo', funding: '', tier: '', status: 'active'
      },
      // ==================== 荷兰 ====================
      {
        country: 'Netherlands', institution: 'Leiden University — Leiden Observatory',
        researchDirection: 'Galaxy Formation, SED Fitting, High-Redshift Galaxies',
        matchingNotes: '欧洲天文"麦加"，SED Fitting 重镇。General Call约11-12月截止 + 独立职位全年滚动。年薪约 €37k-47k（含福利）。NOVA 天文学校资源。',
        websiteURL: 'https://www.universiteitleiden.nl/en/science/astronomy', deadline: '2025-12-01', location: 'Leiden', funding: '€37,000 - 47,000/年 (gross)', tier: '冲刺', status: 'active'
      },
      {
        country: 'Netherlands', institution: 'University of Groningen — Kapteyn Astronomical Institute',
        researchDirection: 'Survey Science, Galaxy Statistics, Data Analysis, KiDS',
        matchingNotes: 'KiDS 巡天数据核心处理地，非常适合星系统计分析。2025年招7个PhD，4年制（1+3合同）。',
        websiteURL: 'https://www.rug.nl/research/kapteyn/', deadline: '2025-11-28', location: 'Groningen', funding: '全额资助', tier: '核心', status: 'active'
      },
      {
        country: 'Netherlands', institution: 'University of Amsterdam (UvA) — API',
        researchDirection: 'High-Energy Astrophysics, AGN Feedback, Instrumentation',
        matchingNotes: '适合研究星系中心黑洞与星系演化的反馈（Feedback）关系。API 研究所多个PhD项目可选。',
        websiteURL: 'https://api.uva.nl/', deadline: '', location: 'Amsterdam', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Netherlands', institution: 'Radboud University (Nijmegen) — IMAPP',
        researchDirection: 'Radio Astronomy, Compact Objects, LOFAR',
        matchingNotes: '适合将星系演化与射电观测（LOFAR）结合。Institute for Mathematics, Astrophysics and Particle Physics。',
        websiteURL: 'https://www.ru.nl/imapp/', deadline: '', location: 'Nijmegen', funding: '', tier: '', status: 'active'
      },
      // ==================== 意大利 ====================
      {
        country: 'Italy', institution: 'INAF — OAS Bologna (Traina)',
        researchDirection: 'Astrophysics, Galaxy Evolution',
        matchingNotes: '意大利国家天体物理学研究所，博洛尼亚天体物理与科学观察站。联系人：Traina。建议直接联系导师了解2027入学计划。',
        websiteURL: 'https://www.oas.inaf.it/', deadline: '', location: 'Bologna', funding: '', tier: '', status: 'active'
      },
      {
        country: 'Italy', institution: 'INAF — OAS Bologna (Gruppioni)',
        researchDirection: 'Astrophysics, Galaxy Evolution, Infrared Astronomy',
        matchingNotes: '意大利国家天体物理学研究所。联系人：Gruppioni。2013 cited by Ilbert。建议直接联系导师。',
        websiteURL: 'https://www.oas.inaf.it/', deadline: '', location: 'Bologna', funding: '', tier: '', status: 'active'
      },
      // ==================== 法国 ====================
      {
        country: 'France', institution: 'Université Paris-Saclay / Université Paris Cité (Magnelli)',
        researchDirection: 'Galaxy Evolution, Infrared/Sub-mm Astronomy',
        matchingNotes: '巴黎地区。联系人：Magnelli。可能涉及 IAP (Institut d\'Astrophysique de Paris) 或 CEA Saclay。建议直接联系。',
        websiteURL: 'https://www.iap.fr/', deadline: '', location: 'Paris', funding: '', tier: '', status: 'active'
      },
      {
        country: 'France', institution: 'Aix-Marseille University — CNRS, LAM (Ilbert)',
        researchDirection: 'Galaxy Evolution, Multi-wavelength Surveys, Photometric Redshifts',
        matchingNotes: '马赛天体物理实验室（LAM），2026年约8个PhD职位。联系人：Ilbert，2013 年引用 Gruppioni。薪资约 €1800-1850/月。',
        websiteURL: 'https://www.lam.fr/', deadline: '2026-03-13', location: 'Marseille', funding: '€1,800 - 1,850/月', tier: '核心', status: 'active'
      },
      {
        country: 'France', institution: 'Aix-Marseille University — CNRS/CNES, LAM (Picouet)',
        researchDirection: 'Galaxy Evolution, Dust/ISM',
        matchingNotes: '马赛天体物理实验室。联系人：Picouet。2023 年引用 Gruppioni 的工作。Euclid 相关课题可能。',
        websiteURL: 'https://www.lam.fr/', deadline: '2026-03-13', location: 'Marseille', funding: '€1,800 - 1,850/月', tier: '', status: 'active'
      },
      {
        country: 'France', institution: 'Aix-Marseille University — CNRS/CNES, LAM (Moutard)',
        researchDirection: 'Galaxy Evolution, Photometry, SED Fitting',
        matchingNotes: '马赛天体物理实验室。联系人：Moutard。SED fitting 方向与你当前工作高度契合。',
        websiteURL: 'https://www.lam.fr/', deadline: '2026-03-13', location: 'Marseille', funding: '€1,800 - 1,850/月', tier: '核心', status: 'active'
      },
      // ==================== 比利时 ====================
      {
        country: 'Belgium', institution: 'Hasselt University (UHasselt) — Faculty of Sciences',
        researchDirection: 'PhD in Sciences: Physics; research topic depends on promoter/research group',
        matchingNotes: '比利时导师制/岗位制：先确定研究主题并找到 promoter，再通过 assistant mandate、博士奖学金或项目经费获得资助；也可申请 joint PhD。学制 4–6 年（视身份），需相关硕士学位；Physics/Astronomy 背景可申请 Sciences: Physics，跨学科由学院做 eligibility 评估。无统一截止日，主要在 vacancy 页面滚动招聘；建议先联系物理相关研究组确认 2027 名额及是否有星系/天体物理方向。首次注册与答辩学年需缴学费。步骤：定课题 → 找 promoter → 找 funding → 办理入学。',
        websiteURL: 'https://www.uhasselt.be/en/research/phd/future-phd-students#anch-steps-to-be-taken-before-starting-a-phd',
        deadline: '', location: 'Hasselt', funding: 'Assistant mandate / 博士奖学金 / 项目经费（岗位制）', tier: '', status: 'active',
        contacts: [
          { id: generateId(), professor: 'UHasselt Doctoral Office', email: '', date: '', method: 'Email', replyStatus: '未回复', notes: '先通过研究组/ vacancies 页面确认 promoter 与 funding；博士流程与入学步骤见官网。' }
        ]
      },
      // ==================== 中国 ====================
      {
        country: 'China', institution: 'Westlake University — Department of Astronomy (School of Science)',
        researchDirection: 'Galaxy Cosmology, Computational Astrophysics & Astronomical AI, Exoplanets & Astrobiology, Time-Domain Astronomy, Theoretical Astrophysics',
        matchingNotes: '西湖大学天文系 2025 年成立，在物理学下自主设置"多尺度天体物理"二级学科。2027 年第二轮普博申请：2027-01-04 10:00 开放，2027-03-31 10:00 截止，面试在 4 月中旬；硕士学历学制 4 年。个人陈述须用官网模板、全英文约 3000 词；至少 2 封推荐信（须含硕士导师，且不能是意向导师）；英语 CET-6 ≥460 / TOEFL ≥90 / IELTS ≥6.0。学费 ¥10,000/年，奖助体系完善。星系宇宙学与计算天体物理方向与 SFRF/SMF 工作直接契合。',
        websiteURL: 'https://astro.westlake.edu.cn/',
        deadline: '2027-03-31', location: 'Hangzhou', funding: '学费 ¥10,000/年；西湖大学奖助学金 + 国家/学业奖学金', tier: '核心', status: 'active',
        contacts: [
          { id: generateId(), professor: '天文系招生办', email: 'admission_science@westlake.edu.cn', date: '', method: 'Email', replyStatus: '未回复', notes: '电话 0571-88112051 / 88111202；申请系统 https://gradadmission.westlake.edu.cn/；招生简章见 https://science.westlake.edu.cn/news/detail/b7875ca329ba484f9992761c7cfede0a' }
        ]
      },
      // ==================== 澳大利亚 ====================
      {
        country: 'Australia', institution: 'Australian National University — Research School of Astronomy & Astrophysics (RSAA)',
        researchDirection: 'Galaxy Formation & Evolution, ISM & Star Formation, Stellar Populations, Cosmology, Exoplanets, Astronomical Instrumentation',
        matchingNotes: '2027 入学 4 年制 PhD。RSAA 国际生奖学金轮次截止 2026-11-15（首选通道；ANU 全校国际生轮次为每年 8-31，已过）。材料：CV、2 页 personal statement、成绩单、毕业论文/发表论文、3 封推荐信（用 RSAA Referee Report Form，截止后 1 周内送达 rsaa.international@anu.edu.au）。要求 H1 等效、GPA >80%、有显著研究经历；全额奖学金 + RSAA top-up + 学费豁免，2027 base stipend A$40,475/年；2 月面试，随后发 offer。申请前建议先联系导师，学术联系人 Christoph Federrath。RSAA 国际生说明：https://rsaa.anu.edu.au/study/phd/information-international-students',
        websiteURL: 'https://programsandcourses.anu.edu.au/program/9670XPHD',
        deadline: '2026-11-15', location: 'Canberra', funding: '全额奖学金 + RSAA top-up + 学费豁免（2027 stipend A$40,475/年）', tier: '冲刺', status: 'active',
        contacts: [
          { id: generateId(), professor: 'Christoph Federrath', email: 'rsaa.sa@anu.edu.au', date: '', method: 'Email', replyStatus: '未回复', notes: 'RSAA 学术联系人（program academic contact）' },
          { id: generateId(), professor: 'RSAA International', email: 'rsaa.international@anu.edu.au', date: '', method: 'Email', replyStatus: '未回复', notes: '申请材料与推荐信统一寄送此邮箱' }
        ]
      },
      // ==================== 阿联酋 ====================
      {
        country: 'United Arab Emirates', institution: 'New York University Abu Dhabi (NYUAD) — Center for Astrophysics and Space Science (CASS)',
        researchDirection: 'Astrophysics & Space Systems: Cosmology/Dark Matter, Galaxy Formation Simulations, AGN, Compact Objects, Exoplanets, Space Instrumentation',
        matchingNotes: '2025 年首届招生的 5 年制 PhD（70 credits：40 课程 + 30 论文），分 Astrophysics 与 Space Systems 两个 track；前两年完成课程 + comprehensive exam，第 5 学期末 thesis proposal，第 5 年答辩；可选到纽约 NYU 交流。2027 Fall 截止 2027-01-04。材料：成绩单、CV、research interest letter、3 封推荐信；英语 IELTS ≥6.0 / TOEFL iBT ≥79 / EmSAT ≥1400（或符合豁免条件）。全额资助：学费+杂费+医保、RA/stipend、免费校内住宿、年度回国机票、end-of-service benefit，需维持 GPA ≥3.0。项目负责人 Andrea Macciò；星系形成模拟/暗物质方向契合。',
        websiteURL: 'https://nyuad.nyu.edu/en/academics/graduate-and-phd/phd-programs/phd-in-astrophysics-and-space-systems.html',
        deadline: '2027-01-04', location: 'Abu Dhabi', funding: '全额：学费+医保+stipend+免费校内住宿+年度回国机票', tier: '核心', status: 'active',
        contacts: [
          { id: generateId(), professor: 'Graduate Admissions', email: 'nyuad.graduateadmissions@nyu.edu', date: '', method: 'Email', replyStatus: '未回复', notes: '申请与材料问题统一联系招生办' },
          { id: generateId(), professor: 'Andrea V. Macciò', email: '', date: '', method: 'Email', replyStatus: '未回复', notes: '项目负责人、CASS 主任；星系形成模拟/暗物质方向' }
        ]
      },
    ];

    return programs.map(p => ({ ...p, id: generateId() }));
  },

  getRecommenders() {
    return [
      { id: generateId(), name: '', title: '', institution: '', email: '', phone: '', notes: '', assignedProgramIds: [] },
      { id: generateId(), name: '', title: '', institution: '', email: '', phone: '', notes: '', assignedProgramIds: [] },
      { id: generateId(), name: '', title: '', institution: '', email: '', phone: '', notes: '', assignedProgramIds: [] },
    ];
  },

  getDocuments() {
    const docs = [
      {
        title: '自我介绍 (Self-Introduction)',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `I got my undergraduate degree certificate and graduation certificate in physics in Your Undergraduate University. Then I started my graduate study in Your University at the September of 2024. This year is my second year and I'm supposed to graduate at June in the next year.`,
        status: '草稿',
        requirements: '教育背景、研究经历概述。2-3分钟口头自我介绍。',
        versions: [],
      },
      {
        title: '硕士毕业时间及论文情况',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `I'm at the second year as graduate student and about to get my degree certificate and graduation certificate at the end of June next year. I'm now working on the paper of SFRF in KiDS DR4 and about to submit to Science China Physics, Mechanics and Astronomy after some preparations.

Currently I'm with my supervisor Your Supervisor. His recent research focuses on the Gamma Analytical modelling evolution on the stellar mass function and star formation rate function and modeling mass accretion histories of dark matter halos. He's in the EAGLE and COLIBRE project which are one of the most up-to-date hydrodynamical simulations in the community.`,
        status: '草稿',
        requirements: '硕士导师研究方向、项目、Funding情况。论文发表计划。',
        versions: [],
      },
      {
        title: 'Why PhD? Why this topic?',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `First of all, for me, the biggest motivation is the interest. I'd like to understand things by the way of doing research instead of just hearing and accepting. Even though I don't exactly know how this work will do to me, you just have to go through it before figuring out what this experience exactly means to you.

Secondly, my first project is actually from my supervisor who's very nice and excellent. I found it was interesting and has some problem at the same time, so I think it would be great if I can continue to work on this and let's see if I can find some a little bit useful things out.`,
        status: '草稿',
        requirements: '读博动机、选择研究方向的原因。',
        versions: [],
      },
      {
        title: '为什么到外国而不在中国？',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `Ok, so the reason I made my first choice to be abroad is I think it would be more challenging and more interesting to do that.

I've never been abroad and as the saying goes, language is the way people think and the culture people build. So I think using my second language to live and work in another country will encounter me lots of new things and new people.

I also want to clarify that I still love the life, the work and the people around me in China.`,
        status: '草稿',
        requirements: '解释出国动机，保持积极正面的表述。',
        versions: [],
      },
      {
        title: '未来职业规划',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `I think I'm gonna deep in the research and analysing work either in academic or in business. If I have done enough work and I still want to do it then I will definitely work in uni or institution. If someday I found other thing attracting me more than the uni by then, I may probably switch to it and I won't criticizing myself.`,
        status: '草稿',
        requirements: '学术或工业界两条路径的开放态度。',
        versions: [],
      },
      {
        title: 'Why this supervisor?',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `I came across your paper and used your observational data. And then I read the series of your paper and found they were interesting.

One of the ideas I came up with suddenly is that the gap between ...`,
        status: '草稿',
        requirements: '阅读导师论文，找到研究契合点。',
        versions: [],
      },
      {
        title: '导师与同事如何评价你',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `My supervisor always says that I'm a neat person who makes the plots beautiful and a deliver person that I can make clear talk or presentation with fluency.

I'm so lucky to have my supervisor to be my first guiding person in academic research. He's so thoughtful and patient and supportive. He's open enough to discuss with me every thought I came up with and offer me help when I'm confused again and again. He never made me feel guilty about the work I've done and just gave me confidence again and again.

My colleagues would say that I'm a quite organized person. Every time when we have to go through some procedures, I'm always the one providing clear and accurate information about that. They're nice and we help each other in both research and life.`,
        status: '草稿',
        requirements: '展示与导师的良好关系和组织能力。',
        versions: [],
      },
      {
        title: 'RP — 研究计划 (Research Proposal)',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: '',
        status: '草稿',
        requirements: '如何开展项目、创新性、填补什么研究gap、可能遇到的问题。SFRF in KiDS DR4 相关的长期研究计划。',
        versions: [],
      },
      {
        title: '如何申请成功 & 何时能开始工作',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `I will graduate at the end of June next year, so I think I can start to work after that.`,
        status: '草稿',
        requirements: '明确毕业时间和可入职时间。',
        versions: [],
      },
      {
        title: 'Questions to Ask Professors',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `1. What's the core virtue you think to be a qualified PhD student?
2. Could you introduce the organization of your group and your collaborations?`,
        status: '草稿',
        requirements: '准备有深度的问题向教授提问。',
        versions: [],
      },
      {
        title: 'Presentation — Project 讲解练习',
        category: 'Informal Meeting',
        direction: 'Interview Prep',
        content: `My research work involves three aspects — two relatively small and one big — and they're highly connected with my supervisor.

The first small work is the CSFRD.
The second small work is JiuTian hydrodynamic simulation led by the group in Shanghai Jiao Tong University.
The third — which is the main work — is the SFRF of KiDS since z=2 and EB, together with a colleague who finished publishing the paper of GSMF of KiDS last month.

As to my future work after KiDS in the last graduate year, I'm actually quite interested in the work of SSP's modification considering the AGN effect, so I think I'm gonna do a little bit work about that with other collaborators. Also of course I'm very willing to start my PhD work if I'm qualified.`,
        status: '草稿',
        requirements: '从详细版本逐渐简化成不同长度的版本（5分钟/3分钟/1分钟）。',
        versions: [],
      },
    ];

    return docs.map(d => ({ ...d, id: generateId() }));
  },
};
