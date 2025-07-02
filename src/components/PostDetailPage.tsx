"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 목업 게시글 데이터
const mockPostsData = {
  "1": [
    {
      id: 1,
      title: "빅 브라더의 감시 체계에 대한 현대적 해석",
      author: "문학평론가김",
      content:
        "오늘날 우리가 살고 있는 디지털 시대에서 조지 오웰의 '1984'는 더욱 현실적인 경고로 다가온다. 빅 브라더의 감시 체계는 단순한 독재의 상징이 아니라, 정보 기술을 통한 통제의 메커니즘을 예견한 것이다. 이 소설은 단순한 허구가 아니라, 미래 사회의 어두운 단면을 정확히 꿰뚫어 본 예언서와도 같다. 우리는 지금도 수많은 감시 카메라와 데이터 수집 시스템 속에서 살아가고 있으며, 우리의 모든 행동과 생각은 기록되고 분석될 수 있다. 이러한 현실은 '1984'가 제시한 디스토피아가 더 이상 먼 미래의 이야기가 아님을 보여준다. 개인의 자유와 프라이버시가 점점 더 침해받는 시대에, 우리는 빅 브라더의 존재를 끊임없이 경계하고 저항해야 할 것이다. 이 소설은 우리에게 끊임없이 질문을 던진다: 진정한 자유란 무엇이며, 어떻게 지켜낼 수 있는가?",
      createdAt: "2024-01-15",
      views: 1250,
      likes: 89,
      parentId: null,
      level: 0,
    },
    {
      id: 2,
      title: "언어의 파괴와 사고의 통제 - 신어(Newspeak)의 의미",
      author: "언어학도박",
      content:
        "오웰이 제시한 신어는 단순한 언어 정책이 아니다. 이는 사고 자체를 제한하는 도구로서, 언어의 다양성을 제거함으로써 비판적 사고의 가능성을 원천 차단하는 시스템이다. 언어가 사고를 형성한다는 사피어-워프 가설을 극단적으로 보여주는 예시라고 할 수 있다. 신어는 특정 개념을 표현할 수 있는 단어를 아예 없애버리거나, 그 의미를 축소시켜 사람들이 특정 생각을 할 수 없게 만든다. 이는 단순히 어휘를 줄이는 것을 넘어, 인간의 의식과 인지 능력 자체를 조작하려는 시도이다. 언어는 인간의 자유로운 사고와 표현의 핵심인데, 신어는 이러한 언어의 본질을 파괴함으로써 인간을 체제의 완벽한 노예로 만들고자 한다. 이러한 언어 통제는 오늘날에도 다양한 형태로 나타나고 있으며, 우리는 언어의 순수성과 다양성을 지키기 위해 노력해야 한다.",
      createdAt: "2024-01-20",
      views: 890,
      likes: 67,
      parentId: 1,
      level: 1,
    },
    {
      id: 3,
      title: "현대 SNS와 신어의 유사성",
      author: "디지털네이티브",
      content:
        "박님의 언어 통제에 대한 분석에 동감하면서, 현대 SNS에서 일어나는 언어 현상과의 연결점을 찾아보고 싶습니다. 제한된 글자 수, 해시태그 문화, 밈(meme)을 통한 의사소통은 어떤 면에서 신어와 유사한 기능을 하고 있는 것은 아닐까요? 짧고 자극적인 문구들이 넘쳐나고, 복잡한 사유를 담아내기 어려운 환경은 사고의 깊이를 저해할 수 있습니다. 또한, 특정 해시태그나 밈이 유행하면서 특정 관점이나 사고방식이 획일적으로 강요되는 경향도 있습니다. 이는 신어가 언어를 단순화하고 사고를 통제하려 했던 방식과 일맥상통하는 부분이 있습니다. 우리는 SNS를 통해 소통의 자유를 얻었다고 생각하지만, 역설적으로 특정 프레임에 갇히거나 사고의 폭이 좁아질 위험에 노출되어 있는지도 모릅니다. 이러한 디지털 환경 속에서 비판적 사고와 다양한 관점을 유지하는 것이 더욱 중요해지고 있습니다.",
      createdAt: "2024-01-22",
      views: 445,
      likes: 23,
      parentId: 2,
      level: 2,
    },
    {
      id: 4,
      title: "윈스턴의 저항과 좌절 - 개인과 체제의 대립",
      author: "철학과대학원생",
      content:
        "윈스턴 스미스의 여정은 개인의 자유의지와 전체주의 체제 간의 근본적인 갈등을 보여준다. 그의 저항은 단순한 반항이 아니라 인간 본성의 마지막 보루를 지키려는 시도였다. 그는 진실을 추구하고, 사랑을 갈구하며, 인간다운 감정을 느끼고자 한다. 그러나 당은 이러한 모든 것을 철저히 통제하고 파괴하려 한다. 윈스턴의 좌절은 개인의 의지가 거대한 체제 앞에서 얼마나 무력할 수 있는지를 보여주지만, 동시에 그 무력함 속에서도 인간 정신의 존엄성을 잃지 않으려는 노력이 얼마나 중요한지를 일깨워준다. 그의 비극적인 결말은 독자들에게 깊은 질문을 던진다: 과연 인간은 체제의 폭력 앞에서 자신의 정신을 지켜낼 수 있는가? 그리고 그 저항의 의미는 무엇인가?",
      createdAt: "2024-01-25",
      views: 678,
      likes: 45,
      parentId: null,
      level: 0,
    },
    {
      id: 5,
      title: "사랑의 의미와 체제의 통제",
      author: "로맨티스트",
      content:
        "윈스턴과 줄리아의 사랑이 체제에 대한 저항의 상징이라는 해석에 흥미를 느꼈습니다. 사랑이라는 가장 개인적인 감정조차 정치적 도구로 활용되는 모습에서 현대 사회의 모습을 엿볼 수 있습니다. 당은 성욕을 억압하고, 가족 관계를 해체하며, 개인 간의 진정한 유대감을 파괴하려 한다. 이는 사랑이 체제에 대한 가장 강력한 위협이 될 수 있기 때문이다. 윈스턴과 줄리아의 은밀한 사랑은 이러한 체제의 통제에 대한 작은 반항이자, 인간 본연의 욕구와 감정을 지키려는 몸부림이다. 비록 그들의 사랑이 결국 좌절되지만, 그들의 관계는 인간 정신의 불굴의 의지를 보여주는 상징으로 남는다. 사랑은 단순히 개인적인 감정을 넘어, 자유와 저항의 중요한 요소가 될 수 있음을 이 소설은 보여준다.",
      createdAt: "2024-01-28",
      views: 234,
      likes: 18,
      parentId: 4,
      level: 1,
    },
    {
      id: 6,
      title: "진리부의 역할과 정보 조작",
      author: "미디어연구자",
      content:
        "진리부(Ministry of Truth)는 단순히 과거의 기록을 바꾸는 기관이 아니다. 이는 현실 자체를 재정의하는 권력을 가진 기관으로, 현재의 팩트체킹 기관들과 언론사들의 역할과 비교해볼 때 매우 흥미로운 통찰을 제공한다. 진리부는 과거의 역사를 끊임없이 수정하고, 현재의 정보를 조작하며, 미래의 진실을 만들어낸다. 이러한 정보 통제는 대중의 인식을 조작하고, 체제에 대한 비판적 사고를 원천 봉쇄하는 데 사용된다. 오늘날에도 가짜 뉴스, 정보의 왜곡, 여론 조작 등 다양한 형태로 정보 조작이 이루어지고 있다. 진리부는 이러한 현대 사회의 정보 환경에 대한 강력한 경고이자, 우리가 진실을 분별하고 비판적으로 사고하는 능력을 키워야 할 필요성을 강조한다. 정보의 홍수 속에서 진실을 찾아내는 것은 더욱 어려워지고 있으며, 진리부의 존재는 우리에게 끊임없이 경각심을 일깨워준다.",
      createdAt: "2024-02-01",
      views: 523,
      likes: 41,
      parentId: null,
      level: 0,
    },
    {
      id: 7,
      title: "O'Brien의 양면성 - 구원자와 파괴자",
      author: "심리분석가",
      content:
        "오브라이언은 윈스턴에게 구원의 희망과 절망적 파괴를 동시에 안겨준다. 이러한 양면성은 권력의 본질과 피지배자의 심리를 깊이 있게 탐구한 오웰의 천재성을 보여준다. 그는 윈스턴을 고문하고 세뇌시키면서도, 동시에 그에게 당의 철학을 설파하고 '치료'하려 한다. 오브라이언은 단순한 악당이 아니라, 체제의 이념을 완벽하게 내면화한 인물로서, 윈스턴의 정신을 파괴함으로써 그를 체제의 일부로 만들고자 한다. 그의 행동은 권력이 어떻게 인간의 정신을 지배하고 파괴할 수 있는지를 극명하게 보여준다. 오브라이언은 윈스턴의 가장 깊은 두려움을 이용하고, 그의 모든 희망을 짓밟으며, 결국 그를 체제에 완전히 복종시킨다. 이러한 오브라이언의 복합적인 캐릭터는 독자들에게 권력의 잔혹성과 인간 정신의 취약성에 대한 깊은 성찰을 제공한다.",
      createdAt: "2024-02-03",
      views: 445,
      likes: 32,
      parentId: null,
      level: 0,
    },
    {
      id: 8,
      title: "도덕적 상대주의와 절대적 진리",
      author: "윤리학교수",
      content:
        "오브라이언의 철학은 도덕적 상대주의의 극단을 보여준다. '2+2=5'라는 명제는 단순한 수학적 오류가 아니라, 진리의 절대성에 대한 근본적 의문을 제기한다. 당은 진실을 자신들의 필요에 따라 조작하고, 객관적인 사실 자체를 부정한다. 이는 진리가 권력에 의해 만들어질 수 있다는 위험한 사상을 보여준다. 오브라이언은 윈스턴에게 고통을 통해 '2+2=5'를 믿게 만들려 하는데, 이는 물리적 폭력을 통해 정신을 지배하려는 시도이다. 이러한 장면은 진리의 상대성과 절대성에 대한 철학적 논쟁을 불러일으킨다. 과연 진리는 객관적으로 존재하는가, 아니면 권력에 의해 구성되는가? 이 소설은 우리가 믿고 있는 진실이 얼마나 쉽게 조작될 수 있는지를 경고하며, 진리의 중요성과 그것을 지키기 위한 노력이 얼마나 필요한지를 강조한다.",
      createdAt: "2024-02-05",
      views: 312,
      likes: 28,
      parentId: 7,
      level: 1,
    },
    {
      id: 9,
      title: "텔레스크린과 현대의 스마트 기기",
      author: "기술비평가",
      content:
        "텔레스크린은 단방향 감시 도구였지만, 현대의 스마트폰과 IoT 기기들은 양방향 감시를 가능하게 한다. 우리는 자발적으로 더 정교한 감시 체계 안에 들어가고 있는 것은 아닐까? 스마트폰은 우리의 위치, 검색 기록, 대화 내용 등 모든 개인 정보를 수집하고 분석한다. 인공지능 스피커는 우리의 음성을 항상 듣고 있으며, 스마트 홈 기기들은 우리의 생활 패턴을 기록한다. 이러한 기기들은 편리함을 제공하지만, 동시에 우리의 사생활을 끊임없이 감시하고 통제할 수 있는 잠재력을 가지고 있다. 텔레스크린이 강제적인 감시였다면, 현대의 스마트 기기들은 자발적인 감시를 유도한다. 우리는 편리함이라는 미명 아래 우리의 자유와 프라이버시를 스스로 포기하고 있는지도 모른다. 이 소설은 기술 발전이 가져올 수 있는 어두운 미래에 대한 강력한 경고를 던진다.",
      createdAt: "2024-02-07",
      views: 789,
      likes: 67,
      parentId: 1,
      level: 1,
    },
    {
      id: 10,
      title: "스마트시티와 사회 통제",
      author: "도시계획연구자",
      content:
        "현대의 스마트시티 프로젝트들은 효율성과 편의성을 추구하지만, 그 이면에는 시민 감시와 통제의 가능성이 내재되어 있다. 중국의 사회신용시스템이 그 예시가 될 수 있다. 스마트시티는 수많은 센서와 카메라, 데이터 분석 시스템을 통해 도시 전체를 실시간으로 모니터링한다. 이는 범죄 예방, 교통 효율성 증대 등 긍정적인 효과를 가져올 수 있지만, 동시에 시민들의 모든 행동을 감시하고 평가하는 도구로 악용될 수도 있다. 사회신용시스템은 시민들의 행동을 점수화하여 사회적 특권을 부여하거나 박탈하는데, 이는 '1984'의 감시 체제와 매우 유사하다. 스마트시티는 유토피아를 약속하지만, 자칫하면 완벽한 통제 사회로 변질될 수 있는 위험을 내포하고 있다. 우리는 기술 발전이 가져올 수 있는 긍정적인 측면과 부정적인 측면을 모두 고려하여 신중하게 접근해야 한다.",
      createdAt: "2024-02-10",
      views: 456,
      likes: 39,
      parentId: 9,
      level: 2,
    },
    {
      id: 11,
      title: "개인의 기억과 역사 조작",
      author: "역사학자",
      content:
        "윈스턴이 과거의 신문 기사를 수정하는 장면은 개인의 기억과 역사가 어떻게 조작될 수 있는지를 보여준다. 당은 과거를 통제함으로써 현재를 지배하고 미래를 결정하려 한다. 역사는 단순히 과거의 기록이 아니라, 현재를 이해하고 미래를 예측하는 중요한 기반이다. 그러나 진리부는 과거의 기록을 끊임없이 수정하고 삭제함으로써, 사람들의 기억을 조작하고 체제에 유리한 역사를 만들어낸다. 이는 개인이 자신의 과거를 기억하고 성찰할 권리를 박탈하는 행위이다. 오늘날에도 역사 왜곡, 정보의 은폐 등 다양한 형태로 역사 조작이 이루어지고 있다. '1984'는 우리가 역사를 비판적으로 바라보고, 진실을 탐구하는 노력을 게을리하지 않아야 함을 경고한다. 기억은 개인의 정체성을 형성하는 중요한 요소이며, 역사는 사회의 정체성을 형성하는 기반이다.",
      createdAt: "2024-02-12",
      views: 380,
      likes: 25,
      parentId: 6,
      level: 1,
    },
    {
      id: 12,
      title: "사상 경찰과 내부 감시",
      author: "사회학자",
      content:
        "사상 경찰은 외부의 물리적 감시뿐만 아니라, 개인의 내면까지 감시하고 통제하려는 시도를 보여준다. 이는 체제가 개인의 생각과 감정까지 지배하려 한다는 점에서 더욱 섬뜩하다. 사상 경찰은 단순히 범죄를 예방하는 것을 넘어, 잠재적인 반체제적 사고를 미리 차단하고 처벌한다. 사람들은 자신의 생각조차 자유롭게 할 수 없으며, 끊임없이 자기 검열을 해야 한다. 이러한 내부 감시는 개인의 자율성과 주체성을 파괴하고, 모든 사람을 체제의 순응적인 부품으로 만든다. 오늘날에도 사상 경찰과 유사한 형태의 내부 감시가 존재할 수 있으며, 우리는 개인의 사상과 표현의 자유를 지키기 위해 노력해야 한다. 생각의 자유는 모든 자유의 근원이며, 이를 억압하는 것은 인간의 존엄성을 침해하는 행위이다.",
      createdAt: "2024-02-15",
      views: 510,
      likes: 35,
      parentId: 1,
      level: 1,
    },
    {
      id: 13,
      title: "이중사고(Doublethink)의 심리학",
      author: "인지심리학자",
      content:
        "이중사고는 상반되는 두 가지 생각을 동시에 받아들이는 능력으로, 당이 대중을 통제하는 핵심적인 심리적 기제이다. 이는 인간의 인지 부조화를 극대화하여 체제에 대한 비판적 사고를 불가능하게 만든다. 이중사고는 사람들이 명백한 모순을 인식하면서도, 동시에 그것을 진실로 받아들이게 만든다. 예를 들어, '전쟁은 평화'라는 슬로건은 이중사고의 대표적인 예시이다. 이러한 사고방식은 개인의 논리적 사고 능력을 마비시키고, 체제가 제시하는 모든 것을 맹목적으로 수용하게 만든다. 오늘날에도 이중사고와 유사한 현상들이 나타나고 있으며, 우리는 비판적 사고와 논리적 판단력을 유지하는 것이 얼마나 중요한지를 깨달아야 한다. 이중사고는 단순히 소설 속의 개념이 아니라, 현실에서도 충분히 일어날 수 있는 위험한 심리적 현상이다.",
      createdAt: "2024-02-18",
      views: 420,
      likes: 30,
      parentId: 2,
      level: 2,
    },
    {
      id: 14,
      title: "프롤레타리아의 역할과 혁명의 가능성",
      author: "정치사회학자",
      content:
        "소설 속 프롤레타리아는 당의 통제에서 벗어나 자유롭게 살아가는 것처럼 보이지만, 동시에 정치적 의식이 결여되어 혁명의 주체가 되지 못한다. 이는 혁명의 가능성에 대한 오웰의 비관적인 시각을 보여준다. 프롤레타리아는 당의 감시와 통제에서 비교적 자유롭지만, 그들은 정치적 무관심과 오락에 몰두하여 체제에 대한 저항 의지를 상실한다. 윈스턴은 프롤레타리아에게서 혁명의 희망을 찾으려 하지만, 결국 그들의 무관심과 무지 앞에서 좌절한다. 이 소설은 혁명이 단순히 억압받는 자들의 봉기로 이루어지는 것이 아니라, 의식과 조직화된 노력이 필요함을 시사한다. 오늘날에도 대중의 정치적 무관심과 오락 중독은 체제 유지에 기여할 수 있으며, 우리는 사회 변화를 위한 대중의 역할과 의식화의 중요성을 다시 한번 생각해봐야 한다.",
      createdAt: "2024-02-20",
      views: 350,
      likes: 20,
      parentId: null,
      level: 0,
    },
    {
      id: 15,
      title: "고통과 인간성 파괴",
      author: "정신과전문의",
      content:
        "101호실에서의 고문은 인간의 가장 깊은 두려움을 이용하여 인간성을 파괴하는 과정을 극명하게 보여준다. 이는 체제가 개인의 정신을 어떻게 붕괴시키는지에 대한 충격적인 묘사이다. 윈스턴은 육체적 고통뿐만 아니라, 정신적 고통을 통해 자신의 모든 신념과 사랑을 포기하게 된다. 쥐에 대한 공포를 이용하여 그를 굴복시키는 장면은 인간의 가장 취약한 부분을 건드려 정신을 파괴하는 체제의 잔혹성을 보여준다. 이러한 고문은 단순히 정보를 얻기 위함이 아니라, 개인의 자아를 완전히 해체하고 체제에 완벽하게 복종시키기 위함이다. 이 소설은 고통이 인간의 정신과 존엄성을 어떻게 파괴할 수 있는지를 경고하며, 인간성을 지키기 위한 저항의 중요성을 강조한다. 고통은 단순히 육체적인 것이 아니라, 정신적인 영역까지 지배할 수 있는 강력한 도구이다.",
      createdAt: "2024-02-22",
      views: 600,
      likes: 40,
      parentId: 7,
      level: 1,
    },
    {
      id: 16,
      title: "빅 브라더의 실체와 상징성",
      author: "기호학자",
      content:
        "빅 브라더는 소설 속에서 실체가 불분명한 존재로 그려지지만, 그의 존재는 모든 당원에게 절대적인 공포와 숭배의 대상이 된다. 그는 체제의 완벽한 상징이자, 권력의 화신이다. 빅 브라더는 실제로 존재하는 인물인지, 아니면 체제가 만들어낸 허구의 존재인지 명확히 밝혀지지 않는다. 그러나 그의 얼굴은 모든 곳에 붙어 있고, 그의 목소리는 텔레스크린을 통해 끊임없이 들려온다. 이러한 모호성은 빅 브라더를 더욱 강력하고 전능한 존재로 만든다. 그는 개인의 모든 행동과 생각을 감시하고 통제하며, 그의 존재 자체가 체제의 정당성을 부여한다. 빅 브라더는 단순히 독재자를 넘어, 완벽한 통제 사회를 상징하는 기호이자, 대중의 무의식 속에 각인된 공포의 대상이다. 그의 존재는 오늘날에도 권력의 상징성과 대중 조작의 위험성을 경고한다.",
      createdAt: "2024-02-25",
      views: 720,
      likes: 55,
      parentId: 1,
      level: 1,
    },
    {
      id: 17,
      title: "전쟁은 평화, 자유는 예속, 무지는 힘",
      author: "정치철학자",
      content:
        "당의 슬로건 '전쟁은 평화, 자유는 예속, 무지는 힘'은 역설적인 표현을 통해 체제의 이념을 극명하게 보여준다. 이는 진실을 왜곡하고 대중을 세뇌하는 당의 전략을 함축하고 있다. '전쟁은 평화'는 끊임없는 전쟁을 통해 내부의 불만을 외부로 돌리고, 사회를 통제하는 당의 전략을 의미한다. '자유는 예속'은 개인이 자유를 추구할수록 체제에 더욱 예속된다는 역설적인 진실을 담고 있다. '무지는 힘'은 대중이 무지할수록 당의 통제력이 강해진다는 것을 보여준다. 이러한 슬로건은 단순한 문구가 아니라, 당의 전체주의적 이념을 압축적으로 보여주는 핵심적인 요소이다. 이 소설은 언어와 사상의 왜곡을 통해 어떻게 전체주의 체제가 유지되는지를 경고하며, 우리가 이러한 역설적인 논리에 현혹되지 않아야 함을 강조한다. 진실을 직시하고, 자유를 추구하며, 지식을 탐구하는 것이야말로 이러한 체제에 저항하는 길이다.",
      createdAt: "2024-02-28",
      views: 650,
      likes: 48,
      parentId: 8,
      level: 2,
    },
    {
      id: 18,
      title: "미래 사회의 디스토피아적 상상력",
      author: "SF문학평론가",
      content:
        "'1984'는 단순한 소설을 넘어, 미래 사회의 디스토피아적 가능성을 경고하는 중요한 작품이다. 오웰의 상상력은 오늘날의 현실과 놀랍도록 일치하는 부분이 많다. 이 소설은 기술 발전이 가져올 수 있는 어두운 측면, 즉 감시, 통제, 정보 조작, 사상 통제 등을 예견했다. 빅 브라더, 텔레스크린, 사상 경찰, 신어, 이중사고 등 소설 속의 개념들은 오늘날에도 여전히 유효한 경고로 다가온다. 우리는 이 소설을 통해 기술 발전이 항상 긍정적인 방향으로만 이루어지는 것이 아니며, 인간의 자유와 존엄성을 침해할 수 있는 위험을 내포하고 있음을 깨달아야 한다. '1984'는 미래 사회에 대한 비관적인 전망을 제시하지만, 동시에 우리가 이러한 디스토피아를 피하기 위해 무엇을 해야 하는지에 대한 질문을 던진다. 이 소설은 우리에게 끊임없이 경각심을 일깨우고, 자유와 진실을 지키기 위한 노력을 촉구한다.",
      createdAt: "2024-03-02",
      views: 900,
      likes: 70,
      parentId: null,
      level: 0,
    },
    {
      id: 19,
      title: "오웰의 경고와 현대 사회의 유사점",
      author: "사회비평가",
      content:
        "오웰이 '1984'에서 경고한 전체주의적 요소들이 현대 사회에서도 다양한 형태로 나타나고 있다는 점은 매우 우려스럽다. 우리는 이 소설을 통해 현재를 비판적으로 성찰할 수 있다. 정부의 감시, 기업의 데이터 수집, 언론의 통제, 여론 조작, 개인 정보 침해 등 '1984'에서 묘사된 많은 현상들이 오늘날에도 존재한다. 물론 소설만큼 극단적인 형태는 아니지만, 그 본질적인 메커니즘은 유사하다. 우리는 편리함이라는 미명 아래 우리의 자유와 프라이버시를 너무 쉽게 포기하고 있는 것은 아닌지 자문해야 한다. 이 소설은 우리에게 끊임없이 경각심을 일깨우고, 민주주의와 자유를 지키기 위한 노력을 촉구한다. 오웰의 경고는 시대를 초월하여 오늘날에도 강력한 메시지를 전달하고 있다.",
      createdAt: "2024-03-05",
      views: 850,
      likes: 65,
      parentId: 18,
      level: 1,
    },
    {
      id: 20,
      title: "저항의 불씨, 희망의 가능성",
      author: "인권운동가",
      content:
        "비록 윈스턴의 저항이 좌절되었지만, 소설 속에서 보여지는 작은 저항의 불씨들은 희망의 가능성을 완전히 배제하지 않는다. 인간 정신의 불굴의 의지는 여전히 존재한다. 윈스턴과 줄리아의 사랑, 오브라이언에게서 진실을 찾으려 했던 윈스턴의 노력, 그리고 프롤레타리아의 무의식적인 자유로움 등은 체제의 완벽한 통제 속에서도 인간성이 완전히 파괴되지 않았음을 보여준다. 비록 소설의 결말이 비극적이지만, 이는 독자들에게 체제에 대한 저항의 중요성을 더욱 강조하는 역할을 한다. 우리는 절망 속에서도 희망을 찾고, 작은 저항이라도 포기하지 않아야 한다. '1984'는 디스토피아를 경고하지만, 동시에 인간 정신의 강인함과 자유를 향한 열망이 결코 사라지지 않을 것임을 암시한다. 이 소설은 우리에게 끊임없이 저항하고, 진실을 추구하며, 인간성을 지키기 위한 노력을 촉구한다.",
      createdAt: "2024-03-08",
      views: 700,
      likes: 50,
      parentId: 4,
      level: 1,
    },
  ],
  "2": [
    {
      id: 1,
      title: "어른과 아이의 시선으로 본 세상",
      author: "동심지킴이",
      content:
        "생텍쥐페리가 그린 어린 왕자의 여행은 단순한 모험담이 아니다. 이는 어른이 되면서 잃어버린 순수함과 본질을 보는 눈에 대한 깊은 성찰이다. 어린 왕자는 어른들의 이해할 수 없는 행동과 가치관을 순수한 시선으로 바라보며, 진정한 가치가 무엇인지 질문한다. 어른들은 숫자에 집착하고, 겉모습에 현혹되며, 본질을 놓치는 경우가 많다. 반면 어린 왕자는 마음으로 보고, 관계의 소중함을 깨닫는다. 이 소설은 어른들에게 잃어버린 동심을 되찾고, 세상을 좀 더 순수하고 본질적인 시선으로 바라보도록 이끈다. 우리는 어린 왕자를 통해 진정한 행복과 의미가 어디에 있는지를 다시 한번 생각해볼 수 있다. 어른이 된다는 것은 무엇을 의미하며, 우리는 무엇을 잃고 무엇을 얻는가에 대한 깊은 질문을 던진다.",
      createdAt: "2024-02-01",
      views: 892,
      likes: 76,
      parentId: null,
      level: 0,
    },
    {
      id: 2,
      title: "장미와 여우 - 관계의 의미",
      author: "관계심리학자",
      content:
        "어린 왕자의 장미와 여우는 각각 다른 종류의 관계를 상징한다. 장미는 특별함을 위한 책임감을, 여우는 길들임을 통한 유대감을 보여준다. 장미는 어린 왕자에게 사랑과 책임감의 의미를 가르쳐주지만, 동시에 그녀의 허영심과 변덕스러움으로 인해 어린 왕자를 힘들게 한다. 반면 여우는 어린 왕자에게 '길들인다'는 것의 진정한 의미, 즉 시간을 들이고 마음을 나누며 특별한 존재가 되는 과정을 알려준다. 여우는 '네가 나를 길들이면, 우리는 서로에게 유일한 존재가 될 거야'라고 말하며 관계의 본질을 꿰뚫는다. 이 두 관계는 사랑, 우정, 책임감, 그리고 상호 존중의 중요성을 강조한다. 우리는 이들을 통해 진정한 관계가 무엇이며, 그것을 어떻게 가꾸어 나가야 하는지를 배울 수 있다. 관계는 단순히 소유하는 것이 아니라, 끊임없이 노력하고 보살펴야 하는 소중한 것이다.",
      createdAt: "2024-02-05",
      views: 567,
      likes: 42,
      parentId: null,
      level: 0,
    },
    {
      id: 3,
      title: "바오밥나무와 현대 사회의 문제들",
      author: "환경철학자",
      content:
        "바오밥나무는 작은 행성을 파괴할 수 있는 위험한 존재로 그려진다. 이는 현대 사회의 환경 파괴, 소비주의, 무분별한 성장주의에 대한 경고로 해석될 수 있다. 어린 왕자는 매일 아침 바오밥나무의 싹을 뽑아내지 않으면 행성이 파괴될 것이라고 말한다. 이는 작은 문제들을 방치하면 결국 돌이킬 수 없는 재앙으로 이어진다는 강력한 메시지를 담고 있다. 현대 사회는 무분별한 개발과 소비로 인해 환경을 파괴하고 있으며, 이는 지구 전체의 생존을 위협하고 있다. 바오밥나무는 이러한 인간의 탐욕과 무관심이 가져올 수 있는 파괴적인 결과를 상징한다. 이 소설은 우리에게 환경 문제에 대한 경각심을 일깨우고, 지속 가능한 삶의 방식과 책임감 있는 행동의 중요성을 강조한다. 작은 노력들이 모여 큰 변화를 만들 수 있음을 바오밥나무를 통해 배울 수 있다.",
      createdAt: "2024-02-08",
      views: 445,
      likes: 38,
      parentId: null,
      level: 0,
    },
    {
      id: 4,
      title: "기후변화와 바오밥나무의 은유",
      author: "기후과학자",
      content:
        "바오밥나무를 방치하면 행성 전체가 파괴된다는 설정은 기후변화의 위험성과 정확히 일치한다. 작은 방치가 돌이킬 수 없는 결과를 가져온다는 메시지가 담겨있다. 기후변화는 당장 눈에 보이지 않는 작은 변화들로부터 시작되지만, 이를 방치하면 지구 전체의 생태계와 인류의 삶을 위협하는 거대한 재앙으로 다가온다. 바오밥나무의 뿌리가 행성을 뚫고 들어가는 것처럼, 기후변화의 영향은 지구 시스템 전체에 깊숙이 침투하여 돌이킬 수 없는 피해를 입힌다. 이 소설은 우리에게 기후변화의 심각성을 인식하고, 지금 당장 행동해야 할 필요성을 강력하게 촉구한다. 작은 실천들이 모여 큰 변화를 만들 수 있으며, 미래 세대를 위해 지속 가능한 환경을 보존하는 것이 우리의 책임임을 바오밥나무를 통해 다시 한번 깨닫게 된다.",
      createdAt: "2024-02-10",
      views: 289,
      likes: 23,
      parentId: 3,
      level: 1,
    },
    {
      id: 5,
      title: "어린 왕자의 별들 - 고독과 관계의 중요성",
      author: "천문학자",
      content:
        "어린 왕자가 방문하는 여러 별들은 각기 다른 유형의 어른들을 상징하며, 동시에 고독과 관계의 중요성을 보여준다. 왕, 허영심 많은 사람, 술꾼, 사업가, 가로등 켜는 사람, 지리학자 등 각 별의 주민들은 자신만의 세계에 갇혀 타인과의 진정한 관계를 맺지 못한다. 이들은 모두 고독하며, 자신의 역할이나 욕망에만 몰두하여 삶의 본질적인 가치를 놓치고 있다. 어린 왕자는 이들을 통해 어른들의 어리석음과 고독을 목격하고, 진정한 관계의 소중함을 깨닫는다. 별들은 단순히 물리적인 공간이 아니라, 인간 내면의 고독과 타인과의 연결에 대한 갈망을 상징한다. 이 소설은 우리에게 타인과의 관계 속에서 진정한 의미와 행복을 찾을 수 있음을 일깨워준다. 고독은 피할 수 없지만, 관계를 통해 우리는 더욱 풍요로운 삶을 살 수 있다.",
      createdAt: "2024-02-12",
      views: 320,
      likes: 28,
      parentId: null,
      level: 0,
    },
    {
      id: 6,
      title: "뱀과 죽음의 의미",
      author: "철학자",
      content:
        "소설 속 뱀은 어린 왕자를 그의 별로 돌려보내는 매개체이자, 죽음과 영원한 순환의 상징으로 해석될 수 있다. 뱀의 독은 어린 왕자의 육체를 떠나게 하지만, 그의 영혼은 다시 별로 돌아가 장미와 재회하게 한다. 뱀은 어린 왕자에게 '네가 나를 만지면, 나는 너를 다른 곳으로 데려다줄 수 있다'고 말하며, 죽음이 끝이 아니라 새로운 시작일 수 있음을 암시한다. 이는 동양 철학의 윤회 사상과도 연결될 수 있으며, 삶과 죽음의 경계가 모호해지는 신비로운 경험을 나타낸다. 뱀은 두려움의 대상이면서 동시에 해방의 존재로 그려진다. 이 소설은 죽음을 단순히 비극적인 끝이 아니라, 영원한 사랑과 재회를 위한 통과의례로 바라보게 한다. 뱀의 존재는 삶의 유한성과 영원성에 대한 깊은 성찰을 제공한다.",
      createdAt: "2024-02-15",
      views: 250,
      likes: 15,
      parentId: null,
      level: 0,
    },
    {
      id: 7,
      title: "사막의 의미 - 고독과 깨달음의 공간",
      author: "지리학자",
      content:
        "어린 왕자와 조종사가 만나는 사막은 단순히 물리적인 공간이 아니라, 고독과 성찰, 그리고 깨달음의 공간을 상징한다. 사막은 아무것도 없는 황량한 곳이지만, 동시에 진정한 것을 발견할 수 있는 곳이다. 사막에서 조종사는 어린 왕자를 만나고, 그를 통해 잃어버렸던 순수함과 삶의 본질적인 가치를 되찾는다. 사막은 외부의 소음과 방해로부터 벗어나 내면의 목소리에 귀 기울일 수 있는 공간이다. 이곳에서 어린 왕자는 장미와 여우와의 관계를 되새기고, 조종사는 삶의 진정한 의미를 깨닫는다. 사막은 고통과 시련의 공간이기도 하지만, 동시에 영적인 성장과 깨달음을 얻을 수 있는 신성한 공간이다. 이 소설은 우리에게 삶의 진정한 의미를 찾기 위해서는 때로는 고독하고 황량한 사막과 같은 시간을 견뎌야 함을 알려준다.",
      createdAt: "2024-02-18",
      views: 380,
      likes: 30,
      parentId: 1,
      level: 1,
    },
    {
      id: 8,
      title: "우물과 생명의 의미",
      author: "생명과학자",
      content:
        "사막에서 발견하는 우물은 단순한 물의 공급원이 아니라, 생명과 희망, 그리고 진정한 가치의 상징이다. 우물은 목마름을 해소해주는 물리적인 물뿐만 아니라, 영혼의 갈증을 채워주는 정신적인 물을 의미한다. 어린 왕자와 조종사는 사막에서 우물을 찾아 헤매고, 마침내 우물을 발견했을 때 큰 기쁨을 느낀다. 이 우물은 단순히 물이 나오는 곳이 아니라, 그들이 함께 노력하고 고통을 감내한 끝에 얻은 소중한 결실이다. 우물은 삶의 어려움 속에서도 희망을 잃지 않고 노력하면 진정한 가치를 발견할 수 있음을 보여준다. 또한, 우물은 타인과의 관계 속에서 얻는 기쁨과 만족감을 상징하기도 한다. 이 소설은 우리에게 삶의 진정한 가치는 눈에 보이는 곳에 있는 것이 아니라, 마음으로 찾아야 함을 우물을 통해 알려준다.",
      createdAt: "2024-02-20",
      views: 300,
      likes: 25,
      parentId: 7,
      level: 2,
    },
    {
      id: 9,
      title: "어린 왕자의 순수함과 어른들의 현실",
      author: "교육학자",
      content:
        "어린 왕자의 순수함은 어른들의 복잡하고 현실적인 삶과 대비되며, 교육의 본질에 대한 질문을 던진다. 어른들은 숫자에 집착하고, 겉모습에 현혹되며, 본질을 놓치는 경우가 많다. 어린 왕자는 이러한 어른들의 모습을 순수한 시선으로 바라보며, 진정한 가치가 무엇인지 질문한다. 이 소설은 교육이 단순히 지식을 전달하는 것을 넘어, 아이들의 순수함과 상상력을 지켜주고, 삶의 본질적인 가치를 깨닫게 하는 것이 중요함을 강조한다. 어른들은 아이들에게 세상을 가르치려 하지만, 때로는 아이들로부터 세상을 배우는 것이 더 중요할 수 있다. 어린 왕자는 어른들에게 잃어버린 동심을 되찾고, 세상을 좀 더 순수하고 본질적인 시선으로 바라보도록 이끈다. 이 소설은 교육의 방향성과 인간 성장에 대한 깊은 성찰을 제공한다.",
      createdAt: "2024-02-22",
      views: 410,
      likes: 35,
      parentId: 1,
      level: 1,
    },
    {
      id: 10,
      title: "보이지 않는 것의 중요성",
      author: "예술철학자",
      content:
        "여우가 어린 왕자에게 말하는 '가장 중요한 것은 눈에 보이지 않는다'는 메시지는 이 소설의 핵심 주제 중 하나이다. 이는 물질적인 것보다 정신적, 본질적인 가치의 중요성을 강조한다. 우리는 종종 눈에 보이는 것에만 집착하여 진정으로 소중한 것을 놓치곤 한다. 사랑, 우정, 행복, 진실과 같은 가치들은 눈에 보이지 않지만, 우리의 삶을 풍요롭게 하고 의미를 부여한다. 어린 왕자는 장미와 여우와의 관계를 통해 이러한 보이지 않는 가치들의 소중함을 깨닫는다. 이 소설은 우리에게 겉모습에 현혹되지 않고, 마음으로 세상을 바라보며, 진정한 아름다움과 가치를 발견하도록 이끈다. 예술은 눈에 보이지 않는 것을 표현하고, 사람들에게 영감을 주는 역할을 한다. 이 소설은 예술의 본질과 삶의 진정한 의미에 대한 깊은 통찰을 제공한다.",
      createdAt: "2024-02-25",
      views: 500,
      likes: 40,
      parentId: 2,
      level: 1,
    },
    {
      id: 11,
      title: "어린 왕자의 귀환과 영원한 순수함",
      author: "문학평론가",
      content:
        "어린 왕자가 뱀의 도움으로 자신의 별로 돌아가는 것은 단순한 이별이 아니라, 순수함과 동심의 영원한 회귀를 상징한다. 그는 육체를 떠나지만, 그의 정신과 메시지는 영원히 남는다. 어린 왕자는 자신의 별에 있는 장미에게로 돌아가기 위해 육체를 버리는 선택을 한다. 이는 물질적인 삶의 한계를 초월하여 정신적인 가치와 사랑을 추구하는 그의 순수한 영혼을 보여준다. 그의 귀환은 독자들에게 슬픔과 동시에 희망을 안겨준다. 어린 왕자는 비록 우리 곁을 떠났지만, 그의 메시지와 순수함은 우리 마음속에 영원히 살아 숨 쉰다. 이 소설은 우리가 잃어버린 동심을 되찾고, 삶의 본질적인 가치를 끊임없이 추구하도록 이끈다. 어린 왕자는 단순한 동화 속 인물이 아니라, 우리 모두의 내면에 존재하는 순수함과 이상을 상징한다.",
      createdAt: "2024-02-28",
      views: 450,
      likes: 38,
      parentId: 6,
      level: 1,
    },
    {
      id: 12,
      title: "조종사의 성장과 깨달음",
      author: "심리학자",
      content:
        "어린 왕자를 만난 조종사는 단순한 이야기 전달자가 아니라, 어린 왕자를 통해 잃어버렸던 순수함과 삶의 본질적인 가치를 되찾는 인물이다. 그의 성장은 이 소설의 중요한 메시지 중 하나이다. 조종사는 어른이 되면서 잊고 지냈던 그림 그리기, 상상력, 그리고 순수한 마음을 어린 왕자를 통해 다시 발견한다. 그는 어린 왕자와의 만남을 통해 삶의 진정한 의미와 행복이 물질적인 성공이나 사회적 지위에 있는 것이 아니라, 관계와 사랑, 그리고 내면의 순수함에 있음을 깨닫는다. 조종사의 변화는 독자들에게 깊은 공감을 불러일으키며, 우리 모두가 잃어버린 동심을 되찾고 삶의 본질적인 가치를 추구해야 함을 일깨워준다. 이 소설은 조종사의 시선을 통해 어른들의 세계를 비판적으로 바라보고, 진정한 성장이 무엇인지를 질문한다.",
      createdAt: "2024-03-02",
      views: 520,
      likes: 45,
      parentId: 1,
      level: 1,
    },
    {
      id: 13,
      title: "어린 왕자의 질문들 - 삶의 본질을 묻다",
      author: "철학자",
      content:
        "어린 왕자가 던지는 순수하고 직설적인 질문들은 어른들의 복잡한 삶을 꿰뚫어 보며, 삶의 본질적인 의미를 다시 한번 생각하게 한다. '양을 그려줘', '장미를 사랑하니?', '길들인다는 게 뭐야?' 등 그의 질문들은 단순해 보이지만, 그 속에는 깊은 철학적 의미가 담겨 있다. 어린 왕자는 어른들이 당연하게 여기는 것들에 대해 끊임없이 질문하고, 그 본질을 파고든다. 이러한 질문들은 어른들에게 자신의 삶과 가치관을 되돌아보게 하고, 진정한 행복과 의미가 어디에 있는지를 고민하게 만든다. 이 소설은 우리에게 끊임없이 질문하고, 답을 찾아가는 과정 자체가 삶의 중요한 부분임을 알려준다. 어린 왕자의 질문들은 시대를 초월하여 모든 독자들에게 깊은 울림을 주며, 삶의 본질에 대한 탐구를 촉구한다.",
      createdAt: "2024-03-05",
      views: 480,
      likes: 40,
      parentId: 9,
      level: 2,
    },
    {
      id: 14,
      title: "별과 꿈 - 이상과 현실의 경계",
      author: "몽상가",
      content:
        "어린 왕자의 별은 그가 사랑하는 장미와 함께하는 이상적인 공간이자, 현실의 고통으로부터 벗어날 수 있는 꿈의 공간을 상징한다. 별은 동심과 순수함이 살아있는 곳이며, 어른들의 복잡한 세상과는 대비된다. 어린 왕자는 자신의 별을 떠나 여러 별들을 여행하며 어른들의 세계를 경험하지만, 결국 자신의 별로 돌아가기를 갈망한다. 이는 이상적인 세계에 대한 동경과 현실의 어려움 속에서도 꿈을 잃지 않으려는 인간의 본성을 보여준다. 별은 단순히 물리적인 공간이 아니라, 우리 모두의 마음속에 존재하는 순수하고 아름다운 이상향을 상징한다. 이 소설은 우리에게 현실의 어려움 속에서도 꿈과 이상을 잃지 않고, 그것을 지키기 위해 노력해야 함을 알려준다. 별은 희망과 영원한 순수함의 상징이다.",
      createdAt: "2024-03-08",
      views: 390,
      likes: 32,
      parentId: 5,
      level: 1,
    },
    {
      id: 15,
      title: "어린 왕자의 눈물 - 순수한 감정의 표현",
      author: "감성분석가",
      content:
        "어린 왕자가 장미와의 이별, 혹은 여우와의 헤어짐에서 흘리는 눈물은 그의 순수하고 진실된 감정을 보여준다. 그의 눈물은 어른들이 잃어버린 감정의 깊이를 상징한다. 어린 왕자는 자신의 감정을 숨기거나 억압하지 않고, 슬픔과 기쁨을 있는 그대로 표현한다. 그의 눈물은 관계의 소중함과 이별의 아픔을 순수하게 받아들이는 그의 모습을 보여준다. 어른들은 종종 자신의 감정을 억누르거나 숨기려 하지만, 어린 왕자는 자신의 감정에 솔직하다. 이 소설은 우리에게 감정을 솔직하게 표현하고, 타인과의 관계 속에서 진정한 감정을 나누는 것이 얼마나 중요한지를 일깨워준다. 어린 왕자의 눈물은 단순한 슬픔의 표현이 아니라, 순수한 영혼의 아름다움과 진실된 관계의 소중함을 상징한다.",
      createdAt: "2024-03-10",
      views: 330,
      likes: 27,
      parentId: 2,
      level: 1,
    },
  ],
};

// 작품 정보 목업 데이터
const mockWorkInfo = {
  "1": {
    title: "1984",
    author: "조지 오웰",
    type: "novel",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: "디스토피아 사회를 그린 고전 소설",
  },
  "2": {
    title: "어린 왕자",
    author: "생텍쥐페리",
    type: "novel",
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    description: "사랑과 우정에 대한 철학적 동화",
  },
};

interface PostDetailPageProps {
  workId: string;
  type: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  views: number;
  likes: number;
  parentId: number | null;
  level: number;
}

interface GraphNode extends Post {
  x: number;
  y: number;
}

export default function PostDetailPage({ workId, type }: PostDetailPageProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [workInfo, setWorkInfo] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"time" | "views" | "likes">("time");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeModalParent, setWriteModalParent] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "익명의사용자",
  });

  useEffect(() => {
    setMounted(true);
    const workPosts = mockPostsData[workId as keyof typeof mockPostsData] || [];
    const work = mockWorkInfo[workId as keyof typeof mockWorkInfo];

    setPosts(workPosts);
    setWorkInfo(work);
    if (workPosts.length > 0) {
      setSelectedPost(workPosts[0]);
    }
  }, [workId]);

  // 그래프 노드 위치 계산
  const calculateGraphPosition = (): GraphNode[] => {
    const rootPosts = posts.filter((post) => post.parentId === null);
    const allNodes: GraphNode[] = [];
    let currentY = 80; // This will be the starting Y for root nodes, and increments for each root branch

    const processNode = (
      post: Post,
      level: number,
      parentY?: number, // This will be the equivalent of parentX
      branchIndex?: number,
    ): void => {
      let x: number, y: number;

      if (level === 0) {
        y = currentY; // Root nodes get their Y from currentY
        x = 100; // Root nodes are at a fixed X (leftmost)
        currentY += 150; // Increment currentY for the next root branch (vertical spacing between root branches)
      } else {
        y = parentY!; // Children align with parent's Y initially
        const childrenOfParent = posts.filter(
          (p) => p.parentId === post.parentId,
        );
        // Sort children to ensure consistent layout for centerOffset calculation
        childrenOfParent.sort((a, b) => a.id - b.id);

        // Calculate offset for Y based on number of siblings
        const centerOffset = (branchIndex! - (childrenOfParent.length - 1) / 2) * 60; // Vertical offset for siblings
        y = parentY! + centerOffset; // Apply offset to Y

        x = 100 + level * 180; // X increases with level (horizontal spacing between levels)
      }

      allNodes.push({
        ...post,
        x,
        y,
      });

      const children = posts.filter((p) => p.parentId === post.id);
      // Sort children to ensure consistent layout
      children.sort((a, b) => a.id - b.id);

      children.forEach((child, index) => {
        processNode(child, level + 1, y, index);
      });
    };

    // Sort root posts to ensure consistent layout
    rootPosts.sort((a, b) => a.id - b.id);

    rootPosts.forEach((post) => {
      processNode(post, 0);
    });

    return allNodes;
  };

  const graphNodes = calculateGraphPosition();

  // Calculate max X and Y for graph dimensions
  const maxGraphX = Math.max(...graphNodes.map((node) => node.x + 100), 0); // Add some padding
  const maxGraphY = Math.max(...graphNodes.map((node) => node.y + 100), 0); // Add some padding

  // 연결선 계산
  const connections = graphNodes.flatMap((node) =>
    graphNodes
      .filter((child) => child.parentId === node.id)
      .map((child) => ({ from: node, to: child })),
  );

  // 정렬된 게시글 목록
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "time":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const handleMouseEnter = (post: GraphNode, event: React.MouseEvent) => {
    setHoveredPost(post.id);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredPost(null);
  };

  const handleWritePost = () => {
    const newPostData = {
      id: posts.length + 1,
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      parentId: writeModalParent,
      level: writeModalParent
        ? (posts.find((p) => p.id === writeModalParent)?.level || 0) + 1
        : 0,
    };

    console.log("새 게시글 작성:", newPostData);
    setShowWriteModal(false);
    setWriteModalParent(null);
    setNewPost({ title: "", content: "", author: "익명의사용자" });
  };

  if (!mounted || !workInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 작품 정보 헤더 */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <img
                src={workInfo.coverImage}
                alt={workInfo.title}
                className="w-16 h-20 object-cover rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {workInfo.title}
                </h1>
                <p className="text-gray-600">작가: {workInfo.author}</p>
                <p className="text-sm text-gray-500">
                  {posts.length}개의 해석이 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 해석 관계도 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">해석 관계도</h2>
            <button
              onClick={() => {
                setWriteModalParent(null);
                setShowWriteModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 text-sm"
            >
              새 해석 작성
            </button>
          </div>

          <div
            className="relative bg-white/50 rounded-xl p-8 overflow-x-auto"
            style={{ minHeight: "280px" }}
          >
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>아직 작성된 해석이 없습니다</p>
                <p className="text-sm">첫 번째 해석을 작성해보세요!</p>
              </div>
            ) : (
              <div
                className="relative"
                style={{
                  minWidth: `${maxGraphX}px`,
                  minHeight: `${maxGraphY}px`,
                }}
              >
                {/* 연결선 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((conn, index) => (
                    <line
                      key={index}
                      x1={conn.from.x + 20}
                      y1={conn.from.y + 20}
                      x2={conn.to.x + 20}
                      y2={conn.to.y + 20}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                  ))}
                </svg>

                {/* 노드들 */}
                {graphNodes.map((node) => {
                  const isSelected = selectedPost?.id === node.id;
                  const isHovered = hoveredPost === node.id;

                  return (
                    <div
                      key={node.id}
                      className="absolute"
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      <div className="relative group">
                        {/* 메인 노드 버튼 */}
                        <button
                          onClick={() => setSelectedPost(node)}
                          onMouseEnter={(e) => handleMouseEnter(node, e)}
                          onMouseLeave={handleMouseLeave}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                              : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                          {isHovered ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          ) : (
                            node.id
                          )}
                        </button>

                        {/* 파생 글 작성 버튼 */}
                        <div
                          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                            isHovered
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}
                          onMouseEnter={() => setHoveredPost(node.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWriteModalParent(node.id);
                              setShowWriteModal(true);
                              setHoveredPost(null);
                            }}
                            className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                            title="이 글에서 파생된 새 글 작성"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* 제목 표시 */}
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap max-w-40 truncate text-center">
                          {node.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 중앙 컨텐츠 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          {/* 정렬 옵션 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">해석 목록</h2>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "time" | "views" | "likes")
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="time">최신순</option>
              <option value="views">조회수순</option>
              <option value="likes">좋아요순</option>
            </select>
          </div>

          {/* 선택된 게시글 내용 */}
          {selectedPost ? (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-xl text-blue-900 mb-3">
                {selectedPost.title}
              </h3>
              <div className="text-sm text-blue-700 mb-4">
                {selectedPost.author} • {selectedPost.createdAt} • 조회수{" "}
                {selectedPost.views} • 좋아요 {selectedPost.likes}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {selectedPost.content}
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  좋아요
                </button>
                <button
                  onClick={() => {
                    setWriteModalParent(selectedPost.id);
                    setShowWriteModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  이 글에서 파생하기
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-8 text-center text-gray-500">
              게시글을 선택해주세요
            </div>
          )}

          {/* 게시글 목록 */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPost?.id === post.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-25"
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-1">
                  {post.title}
                </h4>
                <div className="text-sm text-gray-600 mb-2">
                  {post.author} • {post.createdAt}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>조회수 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                  {post.parentId && (
                    <span className="text-green-600">↳ 파생글</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 호버 팝업 */}
      {hoveredPost && (
        <div
          className="fixed z-50 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/30 p-4 max-w-sm pointer-events-none"
          style={{
            left: `${hoverPosition.x + 10}px`,
            top: `${hoverPosition.y - 80}px`,
          }}
        >
          {(() => {
            const post = posts.find((p) => p.id === hoveredPost);
            return post ? (
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">
                  {post.title}
                </h4>
                <div className="text-xs text-gray-600 mb-2">
                  {post.author} • {post.createdAt}
                </div>
                <p className="text-xs text-gray-700 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>조회수 {post.views}</span>
                  <span>좋아요 {post.likes}</span>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* 플로팅 추가 버튼 */}
      <button
        onClick={() => {
          setWriteModalParent(null);
          setShowWriteModal(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-40"
      >
        <svg
          className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* 글 작성 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWriteModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {writeModalParent ? "파생 해석 작성" : "새 해석 작성"}
                </h2>
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {writeModalParent && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>
                      "{posts.find((p) => p.id === writeModalParent)?.title}"
                    </strong>{" "}
                    글에서 파생된 해석을 작성합니다.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해석 제목
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                    placeholder="해석의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    해석 내용
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="작품에 대한 해석을 자유롭게 작성해주세요..."
                  />
                </div>

                <button
                  onClick={handleWritePost}
                  disabled={!newPost.title || !newPost.content}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {writeModalParent ? "파생 해석 발행" : "해석 발행"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
