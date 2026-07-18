(() => {
  const characters = [
    {
      id: "baekseolgi",
      name: "백설기",
      series: "seolgi",
      motif: "백설기",
      image: "assets/images/characters/remastered-cards/baekseolgi-card.png",
      mood: "조용한 관찰자",
      short: "폭신한 흰 결처럼 조용히 주변을 살피는 친구.",
      summary: "담백한 흰 결, 조용한 눈빛, 폭신한 실루엣.",
      lines: ["오늘은 서두르지 않고 주변을 천천히 살피는 날입니다.", "작은 변화에도 부드럽게 반응하면 좋은 하루입니다.", "잠깐 멈추고 편안한 리듬으로 돌아가도 괜찮습니다."]
    },
    {
      id: "ssukseolgi",
      name: "쑥설기",
      series: "seolgi",
      motif: "쑥설기",
      image: "assets/images/characters/remastered-cards/ssukseolgi-card.png",
      mood: "차분한 조율자",
      short: "은은한 쑥빛으로 다과회의 온도를 맞추는 친구.",
      summary: "은은한 쑥빛, 차분한 표정, 포근한 향.",
      lines: ["오늘은 말보다 온도를 맞추는 감각이 더 중요한 날입니다.", "조용하지만 선명한 선택이 오래 남습니다.", "깊고 고요한 쪽으로 마음을 내려놓기 좋습니다."]
    },
    {
      id: "hobakseolgi",
      name: "호박설기",
      series: "seolgi",
      motif: "호박설기",
      image: "assets/images/characters/remastered-cards/hobakseolgi-card.png",
      mood: "따뜻한 점등",
      short: "달큰한 노란빛으로 자리를 환하게 밝히는 친구.",
      summary: "따뜻한 노란빛, 달큰한 결, 환한 인상.",
      lines: ["오늘은 작은 친절 하나가 공간을 환하게 바꾸는 날입니다.", "밝은 쪽으로 먼저 움직이면 흐름이 열립니다.", "달큰한 온기를 오래 남기는 선택이 잘 맞습니다."]
    },
    {
      id: "heugimja-dasik",
      name: "흑임자다식",
      series: "dasik",
      motif: "흑임자다식",
      image: "assets/images/characters/remastered-cards/heugimja-dasik-card.png",
      mood: "깊은 무게",
      short: "고소하고 단단한 여운으로 분위기를 잡아주는 친구.",
      summary: "깊은 검은색, 고소한 밀도, 단단한 분위기.",
      lines: ["오늘은 속도를 낮추고 중심을 잡기 좋은 날입니다.", "조용한 선택 하나가 전체 분위기를 단단하게 만듭니다.", "깊게 남는 여운을 믿어도 괜찮습니다."]
    },
    {
      id: "cheongtae-dasik",
      name: "청태다식",
      series: "dasik",
      motif: "청태다식",
      image: "assets/images/characters/remastered-cards/cheongtae-dasik-card.png",
      mood: "정돈된 선",
      short: "맑은 초록빛으로 작은 장면을 정리하는 친구.",
      summary: "맑은 청태빛, 정돈된 선, 깨끗한 인상.",
      lines: ["오늘은 복잡한 일을 차분히 정리하기 좋은 날입니다.", "작은 선을 곧게 맞추면 전체 분위기가 맑아집니다.", "조용한 선택이 더 오래 기억됩니다."]
    },
    {
      id: "omija-dasik",
      name: "오미자다식",
      series: "dasik",
      motif: "오미자다식",
      image: "assets/images/characters/remastered-cards/omija-dasik-card.png",
      mood: "붉은 꽃선",
      short: "또렷한 붉은빛으로 다과회에 생기를 더하는 친구.",
      summary: "붉은 꽃선, 겹친 장식, 또렷한 시선.",
      lines: ["오늘은 선명한 색을 숨기지 않아도 좋은 날입니다.", "우아하게 정리한 한마디가 오래 남습니다.", "붉은 여운을 작게 남기는 선택이 잘 어울립니다."]
    },
    {
      id: "omija-tea",
      name: "오미자차",
      series: "tea",
      motif: "오미자차",
      image: "assets/images/characters/remastered-cards/omija-tea-card.png",
      mood: "선명한 감각",
      short: "산뜻한 붉은 향으로 감정을 또렷하게 깨우는 친구.",
      summary: "선명한 붉은빛, 투명한 잔, 산뜻한 여운.",
      lines: ["오늘은 감정을 흐리지 말고 선명하게 바라보기 좋습니다.", "작은 포인트 하나가 전체 장면을 살립니다.", "달콤함과 날카로움 사이의 균형이 잘 맞는 날입니다."]
    },
    {
      id: "yuja-tea",
      name: "유자차",
      series: "tea",
      motif: "유자차",
      image: "assets/images/characters/remastered-cards/yuja-tea-card.png",
      mood: "상큼한 점화",
      short: "노란 향기처럼 가볍고 밝게 먼저 말을 거는 친구.",
      summary: "밝은 노란빛, 상큼한 향, 가벼운 리듬.",
      lines: ["오늘은 첫 움직임을 가볍게 시작하면 흐름이 좋아집니다.", "상큼한 말 한마디가 공간을 밝게 만듭니다.", "노란 향기처럼 산뜻하게 마무리하기 좋은 날입니다."]
    },
    {
      id: "yulmu-tea",
      name: "율무차",
      series: "tea",
      motif: "율무차",
      image: "assets/images/characters/remastered-cards/yulmu-tea-card.png",
      mood: "잔잔한 향",
      short: "따뜻한 침묵으로 곁을 편안하게 만들어주는 친구.",
      summary: "부드러운 아이보리, 따뜻한 잔, 잔잔한 향.",
      lines: ["오늘은 조용한 온기가 필요한 사람에게 먼저 다가가기 좋습니다.", "말을 줄이면 향이 더 선명하게 남습니다.", "따뜻한 침묵 안에서 답이 천천히 올라옵니다."]
    }
  ];

  const content = {
    locale: "ko",
    availableLocales: ["ko"],
    brand: {
      name: "MOONLITREATS",
      tagline: "달빛 아래 작은 다과회에서 만나는 간식 친구들",
      description: "귀엽고 따뜻한 간식 캐릭터들이 매일 밤 작은 다과회를 여는 브랜드입니다.",
      principle: "캐릭터 > 경험 > 분위기"
    },
    hero: {
      eyebrow: "Character First Brand",
      title: "MOONLITREATS",
      subtitle: "달빛 아래 작은 다과회에서 만나는 간식 친구들",
      stage: "다과회는 캐릭터들이 함께 시간을 보내는 작은 무대입니다.",
      image: "assets/images/home/moonlitreats-group-poster-posed-v2-02.png",
      imageAlt: "달빛 아래 다과회에 모인 MOONLITREATS 캐릭터들",
      primaryCta: { label: "캐릭터 만나기", href: "characters.html" },
      secondaryCta: { label: "오늘의 에피소드", href: "episode.html" },
      tags: ["캐릭터", "짧은 에피소드", "따뜻한 다과회"]
    },
    about: {
      eyebrow: "About",
      title: "작은 간식 친구들이 모이는 브랜드",
      paragraphs: [
        "MOONLITREATS는 한국 간식의 색, 질감, 온도를 캐릭터로 풀어내는 오리지널 IP입니다.",
        "긴 세계관을 설명하기보다 캐릭터의 표정, 짧은 장면, 계절의 분위기로 브랜드를 전달합니다.",
        "달빛 아래 다과회는 이야기를 설명하는 배경이 아니라 캐릭터들이 편안하게 함께 시간을 보내는 무대입니다."
      ],
      values: [
        { title: "Character First", text: "모든 페이지에서 캐릭터가 가장 먼저 보이도록 구성합니다." },
        { title: "Tea Party as Stage", text: "다과회는 배경이 아니라 캐릭터의 온도를 보여주는 자리입니다." },
        { title: "Warm Simplicity", text: "단순하고 직관적인 화면 안에 포근함과 친근함을 남깁니다." }
      ]
    },
    series: [
      { id: "seolgi", name: "설기 시리즈", description: "폭신한 떡의 결에서 시작한 포근한 친구들." },
      { id: "dasik", name: "다식 시리즈", description: "작은 문양과 고소한 밀도를 가진 단단한 친구들." },
      { id: "tea", name: "차 시리즈", description: "잔 안의 향과 온도로 장면을 열어주는 친구들." }
    ],
    episodes: [
      {
        id: "tonight-tea-party",
        title: "오늘의 다과회",
        label: "Episode 01",
        image: "assets/images/home/moonlitreats-group-poster-posed-v2-02.png",
        imageAlt: "오늘의 다과회에 모인 MOONLITREATS 캐릭터들",
        description: "달이 올라오면 친구들은 가장 편한 자리에 앉아 오늘 있었던 작은 일을 나눕니다."
      },
      {
        id: "new-friend",
        title: "새로운 친구",
        label: "Episode 02",
        image: "assets/images/home/moonlitreats-group-poster-posed-v2-01.png",
        imageAlt: "다과회 테이블 주변의 MOONLITREATS 캐릭터들",
        description: "처음 온 친구도 낯설지 않도록, 가장 따뜻한 차와 가장 작은 접시가 먼저 놓입니다."
      },
      {
        id: "rainy-night",
        title: "비 오는 날",
        label: "Episode 03",
        image: "assets/images/home/moonlitreats-group-poster-posed-v2-03.png",
        imageAlt: "비 오는 밤의 다과회 분위기를 담은 MOONLITREATS 장면",
        description: "창밖 소리가 조용히 내려앉는 밤, 친구들은 말보다 향으로 서로를 안심시킵니다."
      }
    ],
    gallery: [
      { title: "캐릭터 카드", label: "Character", image: "assets/images/characters/remastered-cards/baekseolgi-card.png", imageAlt: "백설기 캐릭터 카드" },
      { title: "다과회 포스터", label: "Poster", image: "assets/images/home/moonlitreats-group-poster-posed-v2-02.png", imageAlt: "MOONLITREATS 단체 포스터" },
      { title: "계절의 장면", label: "Season", image: "assets/images/home/moonlitreats-group-poster-posed-v2-03.png", imageAlt: "계절 분위기의 MOONLITREATS 이미지" },
      { title: "쑥설기", label: "Character", image: "assets/images/characters/remastered-cards/ssukseolgi-card.png", imageAlt: "쑥설기 캐릭터 카드" },
      { title: "오미자다식", label: "Character", image: "assets/images/characters/remastered-cards/omija-dasik-card.png", imageAlt: "오미자다식 캐릭터 카드" },
      { title: "유자차", label: "Character", image: "assets/images/characters/remastered-cards/yuja-tea-card.png", imageAlt: "유자차 캐릭터 카드" }
    ],
    goods: [
      { code: "G-01", name: "Character Card", text: "캐릭터를 가장 먼저 소개하는 카드형 굿즈.", status: "Coming Soon" },
      { code: "G-02", name: "Sticker Set", text: "표정과 작은 장면을 모은 스티커 세트.", status: "Coming Soon" },
      { code: "G-03", name: "Postcard", text: "계절 일러스트를 담은 포스터형 엽서.", status: "Coming Soon" },
      { code: "G-04", name: "Keyring", text: "간식 친구를 작게 지니는 소프트 키링.", status: "Coming Soon" }
    ],
    news: [
      { date: "2026-07-18", title: "공식 브랜드 허브 리뉴얼 구조 적용" },
      { date: "2026-07-13", title: "캐릭터 카드 중심의 사이트 구조 정리" },
      { date: "2026-07-09", title: "MOONLITREATS 대표 비주얼 적용" }
    ]
  };

  const characterDetails = Object.fromEntries(characters.map((character) => [character.id, character]));

  window.MoonlitreatsContent = content;
  window.MoonlitreatsCharacters = characters;
  window.MoonlitreatsCharacterDetails = characterDetails;
})();
