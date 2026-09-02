// 캐릭터 아트: viewBox 64x88, 바닥 y=88 기준.
// back(무기·뒷머리) → 몸/머리 → front(투구·앞머리) → 왼팔(고정) → 오른팔(.exc-arm, 뽑는 팔)

export const CHARACTERS = [
  {
    id: "c1",
    job: "광전사",
    line: "병뚜껑? 도끼로 딴다.",
    art: { skin: "#e8b083", robe: "#8c4433", trim: "#c9803f", hair: "#c2492e" },
    back: (a) => (
      <>
        <path d="M6 78 L20 40" stroke="#8a6440" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M14 46 L26 38 L27 48 L16 54 Z" fill="#b9c0cc" />
        <ellipse cx="32" cy="30" rx="15" ry="14" fill={a.hair} />
      </>
    ),
    front: (a) => (
      <>
        <path d="M19 26 Q32 14 45 26 L44 30 Q32 20 20 30 Z" fill={a.hair} />
        <rect x="19" y="28" width="26" height="4" rx="2" fill="#6d4a2f" />
        <path d="M38 38 L41 44" stroke="#c07a6a" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "c2",
    job: "마법사",
    line: "이 술, 성분 분석부터 하죠.",
    art: { skin: "#f0c9a8", robe: "#3f4a99", trim: "#8f7ddb", hair: "#5b4a86" },
    back: (a) => (
      <>
        <path d="M8 82 L16 34" stroke="#6b5a3f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M16 34 l3 -6 l3 6 l-3 6 Z" fill="#ffd873" />
        <ellipse cx="32" cy="32" rx="15" ry="14" fill={a.hair} />
      </>
    ),
    front: (a) => (
      <>
        <path d="M15 26 Q32 24 49 26 L32 0 Z" fill={a.robe} />
        <path d="M15 26 Q32 30 49 26 L49 23 Q32 27 15 23 Z" fill={a.trim} />
        <circle cx="32" cy="10" r="2.4" fill="#ffd873" />
        <path d="M20 28 Q24 40 22 46" stroke={a.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M44 28 Q40 40 42 46" stroke={a.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "c3",
    job: "궁수",
    line: "한 발이면 충분한데, 한 잔은 왜 안 되지?",
    art: { skin: "#e3b48f", robe: "#4a6b45", trim: "#8fa86a", hair: "#7a5a35" },
    back: () => (
      <>
        <path d="M12 40 Q2 62 12 84" stroke="#8a6440" strokeWidth="3" fill="none" />
        <path d="M12 40 L12 84" stroke="#d8d3c2" strokeWidth="1.2" />
        <path d="M46 46 L54 34" stroke="#c9c2ae" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    front: (a) => (
      <>
        <path d="M17 34 Q18 16 32 16 Q46 16 47 34 Q40 24 32 24 Q24 24 17 34 Z" fill={a.robe} />
        <path d="M17 34 Q32 40 47 34 L47 30 Q32 36 17 30 Z" fill={a.trim} />
        <path d="M44 20 l8 -8 l1 5 l-6 5 Z" fill="#d8c46a" />
      </>
    ),
  },
  {
    id: "c4",
    job: "성기사",
    line: "맹세컨대, 이 잔은 제가 받겠습니다.",
    art: { skin: "#eebd97", robe: "#c9ccd6", trim: "#d4af37", hair: "#d9c27a" },
    back: () => (
      <>
        <path d="M4 52 Q16 46 20 56 L18 74 Q10 78 6 72 Z" fill="#b9bfcc" />
        <path d="M12 52 L12 74 M6 62 L19 62" stroke="#d4af37" strokeWidth="2" />
      </>
    ),
    front: (a) => (
      <>
        <path d="M18 30 Q18 14 32 14 Q46 14 46 30 L46 36 L40 36 L40 28 L24 28 L24 36 L18 36 Z" fill={a.robe} />
        <rect x="30" y="14" width="4" height="24" fill={a.trim} />
        <path d="M20 52 Q32 46 44 52 L44 58 Q32 52 20 58 Z" fill={a.trim} />
      </>
    ),
  },
  {
    id: "c5",
    job: "도적",
    line: "이미 반 병 없어졌는데?",
    art: { skin: "#dda884", robe: "#2f3450", trim: "#6b7399", hair: "#22242f" },
    back: (a) => (
      <>
        <path d="M10 56 L16 46 L20 50 L14 60 Z" fill="#c9c2ae" />
        <path d="M14 60 L10 66" stroke="#5a4a35" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="32" cy="30" rx="15" ry="13" fill={a.hair} />
      </>
    ),
    front: (a) => (
      <>
        <path d="M18 26 Q32 16 46 26 L46 32 Q32 24 18 32 Z" fill={a.hair} />
        <path d="M20 38 Q32 34 44 38 L44 46 Q32 50 20 46 Z" fill={a.robe} />
        <path d="M18 54 Q32 48 46 54" stroke={a.trim} strokeWidth="2.5" fill="none" />
      </>
    ),
  },
  {
    id: "c6",
    job: "음유시인",
    line: "오늘의 노래는 네 잔에 대하여.",
    art: { skin: "#f0c39c", robe: "#7a3f6b", trim: "#e0a94f", hair: "#a8703a" },
    back: (a) => (
      <>
        <ellipse cx="12" cy="66" rx="9" ry="11" fill="#a9713c" />
        <path d="M12 56 L18 36" stroke="#7a4f26" strokeWidth="3" strokeLinecap="round" />
        <circle cx="12" cy="66" r="3" fill="#5e3c1e" />
        <ellipse cx="32" cy="30" rx="15" ry="14" fill={a.hair} />
      </>
    ),
    front: (a) => (
      <>
        <path d="M14 28 Q32 18 50 28 Q32 32 14 28 Z" fill={a.robe} />
        <path d="M38 22 Q48 10 52 14 Q46 18 42 26 Z" fill={a.trim} />
        <path d="M20 30 Q22 40 20 46" stroke={a.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M22 54 L42 54" stroke={a.trim} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "c7",
    job: "연금술사",
    line: "섞으면 더 세지지 않을까?",
    art: { skin: "#eec3a0", robe: "#3f6b6b", trim: "#8fd6c4", hair: "#c96a4a" },
    back: (a) => (
      <>
        <path d="M8 62 l10 0 l-3 8 l6 10 l-16 0 l6 -10 Z" fill="#7fd6c0" opacity="0.9" />
        <ellipse cx="32" cy="31" rx="15" ry="14" fill={a.hair} />
      </>
    ),
    front: (a) => (
      <>
        <path d="M17 24 Q32 16 47 24 L47 28 Q32 22 17 28 Z" fill={a.hair} />
        <rect x="17" y="27" width="30" height="7" rx="3.5" fill="#4a4f5e" />
        <circle cx="26" cy="30.5" r="4.4" fill="#9fdcea" stroke="#2f3440" strokeWidth="1.4" />
        <circle cx="38" cy="30.5" r="4.4" fill="#9fdcea" stroke="#2f3440" strokeWidth="1.4" />
        <path d="M22 56 Q32 52 42 56" stroke={a.trim} strokeWidth="2.5" fill="none" />
      </>
    ),
  },
  {
    id: "c8",
    job: "어둠기사",
    line: "…잔을 채워라.",
    art: { skin: "#b9a3b0", robe: "#26243a", trim: "#7a3f5e", hair: "#12121c" },
    back: () => (
      <>
        <path d="M10 84 L20 40" stroke="#4a4a5e" strokeWidth="5" strokeLinecap="round" />
        <path d="M20 40 l-5 -4 l5 -8 l5 8 Z" fill="#8c8ca0" />
        <ellipse cx="32" cy="46" rx="22" ry="24" fill="#5b2f6b" opacity="0.18" />
      </>
    ),
    front: (a) => (
      <>
        <path d="M18 30 Q18 14 32 14 Q46 14 46 30 L46 38 L38 38 L38 30 L26 30 L26 38 L18 38 Z" fill={a.hair} />
        <path d="M18 22 L10 10 L20 16 Z" fill={a.hair} />
        <path d="M46 22 L54 10 L44 16 Z" fill={a.hair} />
        <path d="M26 32 L30 34 M38 32 L34 34" stroke={a.trim} strokeWidth="2" strokeLinecap="round" />
        <path d="M20 52 Q32 46 44 52 L44 58 Q32 52 20 58 Z" fill={a.trim} />
      </>
    ),
  },
];

export function CharacterArt({ c, className = "" }) {
  const a = c.art;
  return (
    <svg
      className={`exc-art ${className}`}
      viewBox="0 0 64 88"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {c.back(a)}
      {/* 몸통 */}
      <path d="M17 88 L21 56 Q32 50 43 56 L47 88 Z" fill={a.robe} />
      <path d="M21 57 Q32 51 43 57 L42 63 Q32 57 22 63 Z" fill={a.trim} opacity="0.85" />
      {/* 목 · 머리 · 눈 */}
      <rect x="29" y="43" width="6" height="9" rx="2" fill={a.skin} />
      <ellipse cx="32" cy="33" rx="12.5" ry="13.5" fill={a.skin} />
      <ellipse cx="27" cy="35" rx="1.5" ry="2.1" fill="#2a2230" />
      <ellipse cx="37" cy="35" rx="1.5" ry="2.1" fill="#2a2230" />
      {c.front(a)}
      {/* 왼팔(고정) */}
      <path d="M22 60 L14 70" stroke={a.skin} strokeWidth="5.5" strokeLinecap="round" />
      {/* 오른팔(병을 뽑는 팔) */}
      <g className="exc-arm">
        <path d="M42 60 L54 56" stroke={a.skin} strokeWidth="5.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
