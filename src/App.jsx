import { useState } from "react";
import { CHARACTERS, CharacterArt } from "./characters.jsx";

// 뽑기 모션 전체 길이(ms). CSS의 exc-hero-act / exc-bottle-pull duration과 같아야 한다.
const PULL_MS = 3200;
const FAIL_MS = 2600;
const LINE_MS = 1100;
const FAIL_LINE_MS = 900;
const GAP_MS = 800; // 실패 연출이 끝나고 다음 도전자로 넘어가기까지

const winLines = (name) => [
  `${name}, 돌 앞에 서다`,
  "온 힘을 다해 당긴다...",
  "뽑혔다!",
];

const failLines = (name) => [
  `${name}, 돌 앞에 서다`,
  "으으윽...!",
  "꿈쩍도 하지 않는다",
];

export default function ExculiburApp() {
  const [stage, setStage] = useState("setup");
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState([]);
  const [pickIndex, setPickIndex] = useState(0);
  const [assignments, setAssignments] = useState({});
  const [named, setNamed] = useState(true); // 이름을 직접 지었는지
  const [triedIds, setTriedIds] = useState([]); // 뽑기 실패한 캐릭터
  const [activeId, setActiveId] = useState(null); // 지금 돌 앞에 선 캐릭터
  const [fatedId, setFatedId] = useState(null); // 뽑는 데 성공할 캐릭터
  const [phase, setPhase] = useState("idle"); // idle | win | fail
  const [drawLine, setDrawLine] = useState("");
  const [winner, setWinner] = useState(null);

  // 돌 앞에 선 전원. 누가 먼저 뽑을지는 유저가 직접 고른다.
  const queue = Object.keys(assignments).map((cid) => {
    const character = CHARACTERS.find((c) => c.id === cid);
    const player = players.find((p) => p.id === assignments[cid]);
    // 이름을 지었으면 플레이어 이름, 아니면 직업으로 부른다.
    return { character, player, label: (named && player.name.trim()) || character.job };
  });

  const availableCharacters = CHARACTERS.filter(
    (c) => !Object.prototype.hasOwnProperty.call(assignments, c.id)
  );

  function goNaming(skipNaming) {
    const initial = Array.from({ length: playerCount }, (_, i) => ({
      id: `p${i}-${Date.now()}`,
      name: `플레이어 ${i + 1}`,
    }));
    setPlayers(initial);
    setNamed(!skipNaming);
    if (skipNaming) {
      setAssignments({});
      setPickIndex(0);
      setStage("pick");
    } else {
      setStage("naming");
    }
  }

  function updateName(index, value) {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name: value } : p))
    );
  }

  function startPicking() {
    setAssignments({});
    setPickIndex(0);
    setStage("pick");
  }

  function pickCharacter(characterId) {
    const player = players[pickIndex];
    const next = { ...assignments, [characterId]: player.id };
    setAssignments(next);
    if (pickIndex + 1 < players.length) {
      setPickIndex(pickIndex + 1);
      setStage("passing");
    } else {
      startDraw(next);
    }
  }

  // 성공할 캐릭터를 미리 정한다 — 나머지는 전부 실패 연출을 보여줘야 하므로.
  function startDraw(map) {
    const ids = Object.keys(map);
    setFatedId(ids[Math.floor(Math.random() * ids.length)]);
    setTriedIds([]);
    setActiveId(null);
    setPhase("idle");
    setDrawLine("");
    setWinner(null);
    setStage("draw");
  }

  function confirmPassing() {
    setStage("pick");
  }

  function attempt(characterId) {
    if (phase !== "idle" || triedIds.includes(characterId)) return;
    const entry = queue.find((e) => e.character.id === characterId);
    const isWin = characterId === fatedId;
    const lines = isWin
      ? winLines(entry.label)
      : failLines(entry.label);

    setActiveId(characterId);
    setPhase(isWin ? "win" : "fail");
    setDrawLine(lines[0]);
    let step = 0;
    const interval = setInterval(
      () => {
        step += 1;
        if (step < lines.length) setDrawLine(lines[step]);
      },
      isWin ? LINE_MS : FAIL_LINE_MS
    );

    setTimeout(
      () => {
        clearInterval(interval);
        if (isWin) {
          setWinner(entry);
          setStage("result");
          return;
        }
        // 실패 — 잠깐 여운을 두고 다시 고를 수 있게 돌려준다.
        setTimeout(() => {
          setTriedIds((prev) => [...prev, characterId]);
          setActiveId(null);
          setPhase("idle");
          setDrawLine("");
        }, GAP_MS);
      },
      isWin ? PULL_MS : FAIL_MS
    );
  }

  function newGame() {
    setStage("setup");
    setPlayers([]);
    setAssignments({});
    setPickIndex(0);
    setWinner(null);
    setTriedIds([]);
    setActiveId(null);
    setPhase("idle");
    setNamed(true);
  }

  return (
    <div className="exc-root">
      <style>{css}</style>
      <div className="exc-card">
        {stage === "setup" && (
          <SetupScreen
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            onNext={() => goNaming(false)}
            onSkip={() => goNaming(true)}
          />
        )}
        {stage === "naming" && (
          <NamingScreen
            players={players}
            updateName={updateName}
            onBack={() => setStage("setup")}
            onNext={startPicking}
          />
        )}
        {stage === "pick" && (
          <PickScreen
            player={players[pickIndex]}
            turnNumber={pickIndex + 1}
            total={players.length}
            characters={availableCharacters}
            onPick={pickCharacter}
          />
        )}
        {stage === "passing" && (
          <PassingScreen
            nextPlayer={players[pickIndex]}
            onConfirm={confirmPassing}
          />
        )}
        {stage === "draw" && (
          <DrawScreen
            queue={queue}
            triedIds={triedIds}
            activeId={activeId}
            phase={phase}
            drawLine={drawLine}
            onAttempt={attempt}
          />
        )}
        {stage === "result" && winner && (
          <ResultScreen winner={winner} onNewGame={newGame} />
        )}
      </div>
    </div>
  );
}

function SetupScreen({ playerCount, setPlayerCount, onNext, onSkip }) {
  return (
    <div className="exc-screen">
      <Emblem />
      <h1 className="exc-title">엑술칼리버</h1>
      <p className="exc-sub">돌에 꽂힌 소주병을 뽑는 자, 마셔라</p>

      <div className="exc-block">
        <span className="exc-label">인원 수</span>
        <div className="exc-stepper">
          <button
            className="exc-stepbtn"
            onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
            aria-label="인원 줄이기"
          >
            −
          </button>
          <span className="exc-stepvalue">{playerCount}</span>
          <button
            className="exc-stepbtn"
            onClick={() => setPlayerCount(Math.min(8, playerCount + 1))}
            aria-label="인원 늘리기"
          >
            +
          </button>
        </div>
      </div>

      <button className="exc-primary" onClick={onNext}>
        시작하기
      </button>
      <button className="exc-skip" onClick={onSkip}>
        이름 없이 바로 시작
      </button>
      <p className="exc-hint">폰 하나로 돌려가며 플레이해요 (2~8인)</p>
    </div>
  );
}

function NamingScreen({ players, updateName, onBack, onNext }) {
  return (
    <div className="exc-screen">
      <h2 className="exc-heading">누가 모였나</h2>
      <p className="exc-sub small">이름을 정해주세요</p>
      <div className="exc-namelist">
        {players.map((p, i) => (
          <input
            key={p.id}
            className="exc-input"
            value={p.name}
            maxLength={8}
            onChange={(e) => updateName(i, e.target.value)}
          />
        ))}
      </div>
      <div className="exc-row">
        <button className="exc-secondary" onClick={onBack}>
          뒤로
        </button>
        <button className="exc-primary" onClick={onNext}>
          캐릭터 고르러 가기
        </button>
      </div>
    </div>
  );
}

function PickScreen({ player, turnNumber, total, characters, onPick }) {
  return (
    <div className="exc-screen">
      <p className="exc-turn">
        {turnNumber} / {total}
      </p>
      <h2 className="exc-heading">
        <span className="exc-playername">{player.name}</span>님, 캐릭터를
        고르세요
      </h2>
      <div className="exc-grid">
        {characters.map((c) => (
          <button
            key={c.id}
            className="exc-charcard"
            onClick={() => onPick(c.id)}
          >
            <CharacterArt c={c} className="exc-art-card" />
            <span className="exc-charname">{c.job}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PassingScreen({ nextPlayer, onConfirm }) {
  return (
    <div className="exc-screen exc-center">
      <div className="exc-passicon">🤝</div>
      <h2 className="exc-heading">폰을 넘겨주세요</h2>
      <p className="exc-sub">
        다음 차례: <span className="exc-playername">{nextPlayer.name}</span>
      </p>
      <button className="exc-primary" onClick={onConfirm}>
        받았어요
      </button>
    </div>
  );
}

function DrawScreen({ queue, triedIds, activeId, phase, drawLine, onAttempt }) {
  const [selectedId, setSelectedId] = useState(null);
  const idle = phase === "idle";
  const active = queue.find((e) => e.character.id === activeId);
  const selected = queue.find((e) => e.character.id === selectedId);
  const left = queue.length - triedIds.length;
  return (
    <div className="exc-screen exc-center">
      <h2 className="exc-heading">
        {idle ? "누가 먼저 뽑아볼까" : "돌 앞의 승부"}
      </h2>
      <p className="exc-sub small">
        {idle ? `${left}명 남았다 · 뽑을 캐릭터를 누르세요` : " "}
      </p>

      <div
        className={`exc-scene ${phase === "win" ? "exc-pulling" : ""} ${
          phase === "fail" ? "exc-failing" : ""
        }`}
      >
        <div className={`exc-stone ${phase === "win" ? "exc-stone-active" : ""}`}>
          <div className="exc-bottlewrap">
            <div className="exc-bottle">🍶</div>
          </div>
          <div className="exc-glow" />
          <div className="exc-flash" />
        </div>
        {active && (
          <div className="exc-hero" key={activeId}>
            <div className="exc-hero-inner">
              <CharacterArt c={active.character} />
            </div>
          </div>
        )}
      </div>

      <div className="exc-queue">
        {queue.map((e) => {
          const done = triedIds.includes(e.character.id);
          return (
            <button
              key={e.character.id}
              className={`exc-qitem ${done ? "exc-qdone" : ""} ${
                e.character.id === selectedId ? "exc-qsel" : ""
              }`}
              disabled={done || !idle}
              onClick={() => setSelectedId(e.character.id)}
            >
              <CharacterArt c={e.character} className="exc-art-q" />
              <span className="exc-qname">{e.label}</span>
              {done && <span className="exc-qx">✕</span>}
            </button>
          );
        })}
      </div>

      {idle ? (
        <button
          className="exc-primary exc-drawbtn"
          disabled={!selected}
          onClick={() => {
            onAttempt(selectedId);
            setSelectedId(null);
          }}
        >
          {selected ? `${selected.label}, 뽑아라!` : "캐릭터를 고르세요"}
        </button>
      ) : (
        <p className="exc-drawline">{drawLine}</p>
      )}
    </div>
  );
}

function ResultScreen({ winner, onNewGame }) {
  return (
    <div className="exc-screen exc-center">
      <p className="exc-sub small">선택받은 자</p>
      <div className="exc-resultart">
        <CharacterArt c={winner.character} className="exc-art-win" />
        <span className="exc-wonbottle">🍶</span>
      </div>
      <h2 className="exc-resultname">{winner.character.job}</h2>
      <p className="exc-resultplayer">{winner.player.name}</p>
      <p className="exc-charline">“{winner.character.line}”</p>
      <p className="exc-drinkline">마셔라 🍶</p>
      <button className="exc-primary" onClick={onNewGame}>
        새 게임
      </button>
    </div>
  );
}

function Emblem() {
  return (
    <svg
      className="exc-emblem"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="96" rx="42" ry="12" fill="#2b2d3d" />
      <ellipse cx="60" cy="92" rx="38" ry="10" fill="#3a3d4d" />
      <rect x="55" y="30" width="10" height="55" rx="3" fill="#5b8c5a" />
      <rect x="50" y="24" width="20" height="10" rx="2" fill="#4a7348" />
      <circle cx="60" cy="22" r="6" fill="#d4af37" />
    </svg>
  );
}

const css = `
html, body, #root {
  height: 100%;
  margin: 0;
  background: #14151f;
}
.exc-root {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background:
    radial-gradient(ellipse at 50% -10%, #2a2d42 0%, #14151f 55%),
    #14151f;
  padding: 24px 14px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.exc-card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1d2030 0%, #181a27 100%);
  border: 1px solid #33364a;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  padding: 32px 24px;
  box-sizing: border-box;
}
/* safe center: 내용이 넘치면 위가 잘리지 않게 — 미지원 브라우저는 flex-start로 폴백 */
.exc-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: safe center;
}
/* 폰에서는 카드가 화면을 꽉 채운다 */
@media (max-width: 460px) {
  .exc-root { padding: 0; }
  .exc-card {
    max-width: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: calc(22px + env(safe-area-inset-top)) 20px
             calc(22px + env(safe-area-inset-bottom));
  }
}
.exc-center {
  align-items: center;
  text-align: center;
}
.exc-emblem {
  width: 72px;
  height: 72px;
  margin: 0 auto 8px;
  display: block;
  filter: drop-shadow(0 4px 10px rgba(212,175,55,0.25));
}
.exc-title {
  font-family: Georgia, "Nanum Myeongjo", serif;
  font-size: 34px;
  letter-spacing: 1px;
  color: #f1ece0;
  text-align: center;
  margin: 0 0 6px;
}
.exc-sub {
  color: #9a97a8;
  text-align: center;
  font-size: 15px;
  margin: 0 0 24px;
  line-height: 1.5;
}
.exc-sub.small { margin-bottom: 18px; }
.exc-heading {
  font-family: Georgia, "Nanum Myeongjo", serif;
  font-size: 21px;
  color: #f1ece0;
  text-align: center;
  margin: 4px 0 8px;
  line-height: 1.4;
}
.exc-playername { color: #d4af37; }
.exc-block { margin-bottom: 28px; }
.exc-label {
  display: block;
  color: #9a97a8;
  font-size: 13px;
  text-align: center;
  margin-bottom: 10px;
}
.exc-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.exc-stepbtn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #45485c;
  background: #23263a;
  color: #f1ece0;
  font-size: 20px;
  cursor: pointer;
}
.exc-stepbtn:active { background: #2c2f47; }
.exc-stepvalue {
  color: #f1ece0;
  font-size: 26px;
  font-family: Georgia, serif;
  min-width: 28px;
  text-align: center;
}
.exc-primary {
  background: linear-gradient(180deg, #e2c265 0%, #c99f2e 100%);
  color: #1c1c14;
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}
.exc-primary:active { transform: translateY(1px); }
.exc-primary:disabled { opacity: 0.4; cursor: default; }
.exc-secondary {
  background: transparent;
  color: #c8c5d6;
  border: 1px solid #45485c;
  border-radius: 12px;
  padding: 15px 20px;
  font-size: 15px;
  cursor: pointer;
  flex: 1;
}
.exc-skip {
  background: none;
  border: none;
  color: #9a97a8;
  font-size: 13.5px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  padding: 12px 0 0;
}
.exc-skip:active { color: #d4af37; }
.exc-hint {
  text-align: center;
  color: #6d6a7c;
  font-size: 12.5px;
  margin-top: 14px;
}
.exc-namelist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.exc-input {
  background: #23263a;
  border: 1px solid #3a3d52;
  border-radius: 10px;
  color: #f1ece0;
  padding: 12px 14px;
  font-size: 15px;
}
.exc-input:focus {
  outline: none;
  border-color: #d4af37;
}
.exc-row {
  display: flex;
  gap: 10px;
}
.exc-turn {
  text-align: center;
  color: #6d6a7c;
  font-size: 13px;
  letter-spacing: 1px;
  margin: 0 0 4px;
}
.exc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}
.exc-charcard {
  background: #23263a;
  border: 1px solid #3a3d52;
  border-radius: 14px;
  padding: 18px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.exc-charcard:active {
  border-color: #d4af37;
  background: #292c44;
}
.exc-art { width: 100%; display: block; }
.exc-art-card { width: 48px; margin-bottom: 2px; }
.exc-charname { color: #f1ece0; font-size: 13.5px; font-weight: 600; }
.exc-passicon { font-size: 44px; margin-bottom: 8px; }

/* --- 뽑기 씬 --- */
.exc-scene {
  position: relative;
  width: 100%;
  height: 214px;
  margin: 6px 0 14px;
}
.exc-stone {
  position: absolute;
  left: 50%;
  top: 36px;
  transform: translateX(-50%);
  width: 168px;
  height: 168px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #454863, #2a2c3d 70%);
  border: 1px solid #45485c;
  display: flex;
  align-items: center;
  justify-content: center;
}
.exc-bottlewrap { z-index: 4; }
.exc-bottle {
  font-size: 64px;
  filter: hue-rotate(70deg) saturate(1.3);
  display: block;
}
.exc-hero {
  position: absolute;
  left: 2px;
  bottom: 2px;
  width: 92px;
  z-index: 3;
  transform-origin: bottom center;
}
.exc-pulling .exc-hero { animation: exc-hero-act 3.2s ease-in-out both; }
.exc-pulling .exc-hero-inner {
  animation: exc-tremble 0.16s linear 0.64s 9 both;
}
.exc-pulling .exc-arm {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  animation: exc-armpull 3.2s ease-out both;
}
.exc-pulling .exc-bottlewrap { animation: exc-bottle-pull 3.2s ease-out both; }
.exc-pulling .exc-bottle { animation: exc-shake 0.18s linear 0.7s 8 both; }
.exc-flash {
  position: absolute;
  inset: -22px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,241,196,0.95), rgba(212,175,55,0) 62%);
  opacity: 0;
  pointer-events: none;
}
.exc-pulling .exc-flash { animation: exc-flash 3.2s ease-out both; }
@keyframes exc-hero-act {
  0%   { transform: translateX(-46px) rotate(0deg); opacity: 0; }
  14%  { transform: translateX(0) rotate(0deg); opacity: 1; }
  20%  { transform: translateX(4px) rotate(-5deg); }
  66%  { transform: translateX(4px) rotate(-6deg); }
  74%  { transform: translateX(-12px) rotate(-14deg); }
  86%  { transform: translateX(-2px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); opacity: 1; }
}
@keyframes exc-tremble {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(1.5px, -1px); }
}
@keyframes exc-armpull {
  0%, 12% { transform: rotate(0deg); }
  20%  { transform: rotate(-26deg); }
  32%  { transform: rotate(-19deg); }
  44%  { transform: rotate(-28deg); }
  66%  { transform: rotate(-22deg); }
  74%  { transform: rotate(-74deg); }
  86%  { transform: rotate(-56deg); }
  100% { transform: rotate(-62deg); }
}
@keyframes exc-bottle-pull {
  0%, 66% { transform: translateY(0) rotate(0deg); }
  74%  { transform: translateY(-66px) rotate(14deg) scale(1.06); }
  86%  { transform: translateY(-52px) rotate(8deg); }
  100% { transform: translateY(-56px) rotate(10deg); }
}
@keyframes exc-flash {
  0%, 68% { opacity: 0; transform: scale(0.6); }
  74%  { opacity: 1; transform: scale(1.15); }
  100% { opacity: 0; transform: scale(1.6); }
}
.exc-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(212,175,55,0);
  transition: box-shadow 0.4s ease;
}
.exc-stone-active .exc-glow {
  box-shadow: 0 0 40px 6px rgba(212,175,55,0.35);
}
@keyframes exc-shake {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(-3deg); }
  75% { transform: translateY(-3px) rotate(3deg); }
}
/* --- 실패 연출: 당기다 놓치고 엉덩방아, 옆으로 물러난다 --- */
.exc-failing .exc-hero { animation: exc-hero-fail 2.6s ease-in-out both; }
.exc-failing .exc-hero-inner {
  animation: exc-tremble 0.16s linear 0.5s 8 both;
}
.exc-failing .exc-arm {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  animation: exc-armfail 2.6s ease-out both;
}
.exc-failing .exc-bottle { animation: exc-shake 0.2s linear 0.55s 7 both; }
@keyframes exc-hero-fail {
  0%   { transform: translateX(-46px) rotate(0deg); opacity: 0; }
  14%  { transform: translateX(0) rotate(0deg); opacity: 1; }
  20%  { transform: translateX(4px) rotate(-5deg); }
  62%  { transform: translateX(4px) rotate(-9deg); }
  70%  { transform: translateX(-4px) rotate(-17deg); }
  76%  { transform: translateX(-20px) translateY(7px) rotate(26deg); }
  86%  { transform: translateX(-20px) translateY(7px) rotate(20deg); }
  100% { transform: translateX(-62px) translateY(0) rotate(0deg); opacity: 0; }
}
@keyframes exc-armfail {
  0%, 12% { transform: rotate(0deg); }
  20%  { transform: rotate(-26deg); }
  34%  { transform: rotate(-17deg); }
  48%  { transform: rotate(-30deg); }
  62%  { transform: rotate(-20deg); }
  70%  { transform: rotate(-36deg); }
  76%  { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}

/* --- 대기줄 --- */
.exc-queue {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 0 0 16px;
}
.exc-qitem {
  position: relative;
  width: 52px;
  padding: 8px 2px 6px;
  background: #23263a;
  border: 1px solid #3a3d52;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  transition: opacity 0.3s ease, border-color 0.2s ease;
}
.exc-qitem:active:not(:disabled) {
  border-color: #d4af37;
  background: #292c44;
}
.exc-qitem:disabled { cursor: default; }
.exc-art-q { width: 30px; }
.exc-qname { color: #c8c5d6; font-size: 10.5px; }
.exc-qdone { opacity: 0.3; }
.exc-qdone .exc-qname { color: #8b88a0; }
.exc-qsel {
  border-color: #d4af37;
  background: #33314a;
  box-shadow: 0 0 0 1px #d4af37, 0 0 14px rgba(212,175,55,0.3);
}
.exc-qsel .exc-qname { color: #d4af37; }
.exc-qx {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #e2685f;
  font-size: 22px;
  font-weight: 700;
}
.exc-drawline {
  color: #d4af37;
  font-size: 14.5px;
  min-height: 20px;
}
.exc-drawbtn { width: 100%; }
.exc-resultart {
  position: relative;
  width: 104px;
  margin: 2px auto 8px;
  animation: exc-bob 2s ease-in-out infinite;
}
.exc-art-win .exc-arm {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  transform: rotate(-62deg);
}
.exc-wonbottle {
  position: absolute;
  right: -4px;
  top: 0;
  font-size: 26px;
  filter: hue-rotate(70deg) saturate(1.3);
  transform: rotate(14deg);
}
@keyframes exc-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.exc-charline {
  color: #b8a97e;
  font-size: 13.5px;
  font-style: italic;
  margin: 0 0 16px;
}
@media (prefers-reduced-motion: reduce) {
  .exc-pulling *, .exc-failing *, .exc-resultart { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
.exc-resultname {
  font-family: Georgia, "Nanum Myeongjo", serif;
  color: #f1ece0;
  font-size: 26px;
  margin: 0 0 2px;
}
.exc-resultplayer {
  color: #9a97a8;
  font-size: 15px;
  margin: 0 0 18px;
}
.exc-drinkline {
  color: #e2685f;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 26px;
}
`;
