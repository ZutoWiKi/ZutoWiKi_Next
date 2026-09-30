import type { AllWrite } from "@/components/API/GetAllWrites";
import { categoryPath } from "@/lib/writeLink";

/** 글 아래 "함께 읽을 만한 해석" 한 줄에 필요한 것만 담는다. */
export interface RelatedWrite {
  id: number;
  title: string;
  work_id: number;
  work_title: string;
  type_index: string;
}

/** 한 글에 거는 다른 글 수. */
export const RELATED_LIMIT = 4;

interface Target {
  id: number;
  work_id: number;
  type_index: string;
  tags?: string[];
}

/**
 * 글 한 편 아래에 걸 다른 작품의 글을 고른다.
 *
 * 같은 작품의 글은 오른쪽 해석 목록에 이미 있으므로 뺀다. 겹치는 태그가 많을수록, 같은
 * 갈래일수록 앞에 두고, 점수가 같으면 최근 글부터 둔다. 모자라면 최근 글로 채운다 —
 * 어느 글이든 다른 글 몇 편으로 이어지게 하는 게 목적이다(검색엔진이 따라갈 사이트 안 링크).
 */
export function pickRelated(
  target: Target,
  index: AllWrite[],
  limit = RELATED_LIMIT,
): RelatedWrite[] {
  const tags = new Set(target.tags ?? []);
  // 수필은 "esay" 와 "essay" 두 이름이 섞여 오므로 갈래 목록 주소로 맞춰 비교한다.
  const category = categoryPath(target.type_index);

  return index
    .filter((write) => write.work_id !== target.work_id)
    .map((write) => ({
      write,
      score:
        (write.tags ?? []).filter((tag) => tags.has(tag)).length * 2 +
        (categoryPath(write.type_index) === category ? 1 : 0),
      time: new Date(write.created_at).getTime() || 0,
    }))
    .sort(
      (a, b) => b.score - a.score || b.time - a.time || b.write.id - a.write.id,
    )
    .slice(0, limit)
    .map(({ write }) => ({
      id: write.id,
      title: write.title,
      work_id: write.work_id,
      work_title: write.work_title,
      type_index: write.type_index,
    }));
}

/**
 * 한 작품에 달린 글마다 함께 읽을 글을 미리 골라 둔다. 작품 페이지에서 목록으로 글을
 * 바꿔 펼쳐도 그 글에 맞는 목록이 바로 보이도록 글 번호별로 준다.
 */
export function relatedForWork(
  writes: { id: number; tags?: string[] }[],
  workId: number,
  type: string,
  index: AllWrite[],
): Record<number, RelatedWrite[]> {
  return Object.fromEntries(
    writes.map((write) => [
      write.id,
      pickRelated(
        { id: write.id, work_id: workId, type_index: type, tags: write.tags },
        index,
      ),
    ]),
  );
}
