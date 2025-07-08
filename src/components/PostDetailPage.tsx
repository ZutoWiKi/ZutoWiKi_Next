"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AnimatedList from "./AnimatedList";
import { useCallback } from "react";

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
      id: 8,
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
      id: 9,
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
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
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
      id: 16,
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
}

export default function PostDetailPage({ workId, type }: PostDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [workInfo, setWorkInfo] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"time" | "views" | "likes">("time");
  const [mounted, setMounted] = useState(false);
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

  const goToWirte = useCallback(() => {
    router.push(`${pathname}/write`);
  }, [router, pathname]);

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

  // AnimatedList를 위한 아이템 문자열 배열 생성
  const listItems = sortedPosts.map((post) => {
    return post.title;
  });

  const handlePostSelect = (item: string, index: number) => {
    setSelectedPost(sortedPosts[index]);
  };

  if (!mounted || !workInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const selectedIndex = selectedPost
    ? sortedPosts.findIndex((p) => p.id === selectedPost.id)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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

      <div className="max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-140px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* 왼쪽: 선택된 해석 상세 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            {selectedPost ? (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
                    {selectedPost.title}
                  </h3>
                  <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                    <span>{selectedPost.author}</span>
                    <span>{selectedPost.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {selectedPost.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {selectedPost.likes}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedPost.content}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      좋아요
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300">
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      공유
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg">
                    해석을 선택해서 읽어보세요
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    왼쪽 목록에서 관심있는 해석을 클릭하세요
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 해석 목록 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 flex flex-col h-[calc(100vh-200px)]">
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

            <AnimatedList
              items={listItems}
              onItemSelect={handlePostSelect}
              showGradients={true}
              enableArrowNavigation={true}
              className="w-full"
              itemClassName="hover:bg-blue-50 transition-all duration-300"
              displayScrollbar={false}
              initialSelectedIndex={selectedIndex}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={goToWirte}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                새 해석 작성
              </button>
              {selectedPost && (
                <button // 파생 해석 작성임
                  onClick={goToWirte}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200 font-medium transition-all duration-300 transform hover:-translate-y-1"
                >
                  파생 해석
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 플로팅 네비게이션 */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button
          onClick={goToWirte}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
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
      </div>
    </div>
  );
}
