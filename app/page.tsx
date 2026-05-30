"use client";

import {
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// --- 各設定ごとの確率データ ---
const bbSettingsData = [{ setting: 1, rate: 297.9 }, { setting: 2, rate: 292.6 }, { setting: 5, rate: 284.9 }, { setting: 6, rate: 273.1 }];
const rbSettingsData = [{ setting: 1, rate: 394.8 }, { setting: 2, rate: 358.1 }, { setting: 5, rate: 313.6 }, { setting: 6, rate: 282.5 }];
const bellASettingsData = [{ setting: 1, rate: 15.3 }, { setting: 2, rate: 14.9 }, { setting: 5, rate: 14.5 }, { setting: 6, rate: 14.1 }];
const bellBSettingsData = [{ setting: 1, rate: 15.3 }, { setting: 2, rate: 15.6 }, { setting: 5, rate: 15.3 }, { setting: 6, rate: 15.1 }];
const iceASettingsData = [{ setting: 1, rate: 52.9 }, { setting: 2, rate: 53.5 }, { setting: 5, rate: 49.6 }, { setting: 6, rate: 50.8 }];
const cherryA1SettingsData = [{ setting: 1, rate: 99.4 }, { setting: 2, rate: 99.4 }, { setting: 5, rate: 99.3 }, { setting: 6, rate: 99.3 }];
const cherryA2SettingsData = [{ setting: 1, rate: 21.0 }, { setting: 2, rate: 19.3 }, { setting: 5, rate: 20.6 }, { setting: 6, rate: 19.9 }];
const cherryBSettingsData = [{ setting: 1, rate: 282.5 }, { setting: 2, rate: 281.3 }, { setting: 5, rate: 276.5 }, { setting: 6, rate: 274.2 }];
const hgMissSettingsData = [{ setting: 1, rate: 13.4 }, { setting: 2, rate: 12.4 }, { setting: 5, rate: 10.1 }, { setting: 6, rate: 9.5 }];

// BIG中の小役確率データ
const bbBellASettingsData = [{ setting: 1, rate: 1.10 }, { setting: 2, rate: 1.13 }, { setting: 5, rate: 1.10 }, { setting: 6, rate: 1.13 }];
const bbBellBSettingsData = [{ setting: 1, rate: 11.0 }, { setting: 2, rate: 9.0 }, { setting: 5, rate: 11.0 }, { setting: 6, rate: 9.0 }];
const bbChanceSettingsData = [{ setting: 1, rate: 16384.0 }, { setting: 2, rate: 16384.0 }, { setting: 5, rate: 16384.0 }, { setting: 6, rate: 655.4 }];

// --- 共通カウンターコンポーネント ---
function CounterInput({
  label,
  value,
  setValue,
  labelClassName = "text-neutral-700",
}: {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  labelClassName?: string;
}) {
  return (
    <div className="mb-4">
      <label className={`block mb-2 font-bold ${labelClassName}`}>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setValue((prev) => String(Math.max(0, Number(prev || 0) - 1)))}
          className="w-12 h-12 rounded-lg border border-[#FF6F00] text-2xl font-bold bg-white text-[#FF6F00] active:bg-neutral-100"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32 border rounded-lg p-3 text-center text-2xl font-bold"
          placeholder="0"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => String(Number(prev || 0) + 1))}
          className="w-12 h-12 rounded-lg bg-[#FF6F00] text-white text-2xl font-bold active:bg-[#E56500]"
        >
          ＋
        </button>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `panel-${title.replace(/\s/g, "-")}`;

  return (
    <section className="border-t pt-4 mt-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-2 text-left font-bold text-lg text-white hover:bg-white/10 active:bg-white/15"
      >
        <span>{title}</span>
        <span
          className={`text-sm text-[#FF6F00] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div id={panelId} className="pt-2 space-y-2">
          {children}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  // --- 各種State ---
  const [games, setGames] = useState("");
  const [bbCount, setBbCount] = useState("");
  const [rbCount, setRbCount] = useState("");
  const [bellACount, setBellACount] = useState("");
  const [bellBCount, setBellBCount] = useState("");
  const [iceACount, setIceACount] = useState("");
  const [cherryA1Count, setCherryA1Count] = useState("");
  const [cherryA2Count, setCherryA2Count] = useState("");
  const [cherryBCount, setCherryBCount] = useState("");
  const [hgMissCount, setHgMissCount] = useState("");

  // 【新設】BIG中用のState
  const [bbGames, setBbGames] = useState(""); // BB中の総ゲーム数
  const [bbBellACount, setBbBellACount] = useState("");
  const [bbBellBCount, setBbBellBCount] = useState("");
  const [bbChanceCount, setBbChanceCount] = useState("");

  // 【仕様変更】カウンターではなく、True/Falseの確定フラグスイッチにする
  const [hasRbMiss, setHasRbMiss] = useState(false);
  const [rbMissAnimating, setRbMissAnimating] = useState(false);
  // --- 【重要】BIG回数が増えたら、BB中総ゲーム数を自動で初期化・更新する（ノーミス時: 1回あたり29G） ---
  useEffect(() => {
    if (Number(bbCount) > 0) {
      setBbGames(String(Number(bbCount) * 29));
    } else {
      setBbGames("");
    }
  }, [bbCount]);

  // --- 花火GAMEのゲーム数を自動計算（1回あたり20G） ---
  const calculatedHgGames = Number(bbCount) > 0 ? Number(bbCount) * 20 : 0;

  // --- 実測確率の計算関数 ---
  const calculateRate = (totalGames: number, count: string) => {
    return totalGames > 0 && count !== ""
      ? Number(count) === 0
        ? "∞"
        : (totalGames / Number(count)).toFixed(1)
      : null;
  };

  // 通常時・ボーナスの実測確率
  const totalGamesNum = Number(games);
  const bbRate = calculateRate(totalGamesNum, bbCount);
  const rbRate = calculateRate(totalGamesNum, rbCount);
  const bellARate = calculateRate(totalGamesNum, bellACount);
  const bellBRate = calculateRate(totalGamesNum, bellBCount);
  const iceARate = calculateRate(totalGamesNum, iceACount);
  const cherryA1Rate = calculateRate(totalGamesNum, cherryA1Count);
  const cherryA2Rate = calculateRate(totalGamesNum, cherryA2Count);
  const cherryBRate = calculateRate(totalGamesNum, cherryBCount);

  // 花火GAMEのハズレ実測確率
  const hgMissRate = calculateRate(calculatedHgGames, hgMissCount);

  // 【新設】BIG中の実測確率
  const bbGamesNum = Number(bbGames);
  const bbBellARate = calculateRate(bbGamesNum, bbBellACount);
  const bbBellBRate = calculateRate(bbGamesNum, bbBellBCount);
  const bbChanceRate = calculateRate(bbGamesNum, bbChanceCount);

  // --- スコア判定関数 ---
  const calculateComparison = (actualRate: string | null, settingsData: typeof bbSettingsData) => {
    if (!actualRate || actualRate === "∞") return [];
    return settingsData.map((item) => {
      const difference = Math.abs(Number(actualRate) - item.rate);
      const score = 1 / (difference + 0.0001);
      return { ...item, score };
    });
  };

  const bbComparison = calculateComparison(bbRate, bbSettingsData);
  const rbComparison = calculateComparison(rbRate, rbSettingsData);
  const bellAComparison = calculateComparison(bellARate, bellASettingsData);
  const bellBComparison = calculateComparison(bellBRate, bellBSettingsData);
  const iceAComparison = calculateComparison(iceARate, iceASettingsData);
  const cherryA1Comparison = calculateComparison(cherryA1Rate, cherryA1SettingsData);
  const cherryA2Comparison = calculateComparison(cherryA2Rate, cherryA2SettingsData);
  const cherryBComparison = calculateComparison(cherryBRate, cherryBSettingsData);
  const hgMissComparison = calculateComparison(hgMissRate, hgMissSettingsData);

  // 【新設】BIG中のスコア判定
  const bbBellAComparison = calculateComparison(bbBellARate, bbBellASettingsData);
  const bbBellBComparison = calculateComparison(bbBellBRate, bbBellBSettingsData);
  const bbChanceComparison = calculateComparison(bbChanceRate, bbChanceSettingsData);

  // --- 総合判定 ---
  const settingsList = [1, 2, 5, 6];
  const combinedData = settingsList.map((setting) => {
    // もしREGハズレを引いていたら、設定1と2のスコアを強制的に0にする
    if (hasRbMiss && (setting === 1 || setting === 2)) {
      return { setting, totalScore: 0 };
    }

    const scoreBb = bbComparison.find((b) => b.setting === setting)?.score || 0;
    const scoreRb = rbComparison.find((r) => r.setting === setting)?.score || 0;
    const scoreBellA = bellAComparison.find((b) => b.setting === setting)?.score || 0;
    const scoreBellB = bellBComparison.find((b) => b.setting === setting)?.score || 0;
    const scoreIceA = iceAComparison.find((i) => i.setting === setting)?.score || 0;
    const scoreCherryA1 = cherryA1Comparison.find((c) => c.setting === setting)?.score || 0;
    const scoreCherryA2 = cherryA2Comparison.find((c) => c.setting === setting)?.score || 0;
    const scoreCherryB = cherryBComparison.find((c) => c.setting === setting)?.score || 0;
    const scoreHgMiss = hgMissComparison.find((h) => h.setting === setting)?.score || 0;
    const scoreBbBellA = bbBellAComparison.find((b) => b.setting === setting)?.score || 0;
    const scoreBbBellB = bbBellBComparison.find((b) => b.setting === setting)?.score || 0;
    const scoreBbChance = bbChanceComparison.find((c) => c.setting === setting)?.score || 0;

    const totalScore =
      scoreBb + scoreRb + scoreBellA + scoreBellB + scoreIceA + scoreCherryA1 + scoreCherryA2 + scoreCherryB + scoreHgMiss +
      scoreBbBellA + scoreBbBellB + scoreBbChance;

    return { setting, totalScore };
  });

  const combinedTotal = combinedData.reduce((sum, item) => sum + item.totalScore, 0);

  const finalProbability = combinedData.map((item) => ({
    ...item,
    probability: combinedTotal > 0 ? ((item.totalScore / combinedTotal) * 100).toFixed(1) : "0.0",
  }));

  const closestSetting =
    finalProbability.length > 0
      ? finalProbability.reduce((prev, current) => (Number(prev.probability) > Number(current.probability) ? prev : current))
      : null;

  const hasAnyInput =
    bbRate || rbRate || bellARate || bellBRate || iceARate || cherryA1Rate || cherryA2Rate || cherryBRate || hgMissRate ||
    bbBellARate || bbBellBRate || bbChanceRate;

  const handle_rb_miss_change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setHasRbMiss(checked);
    if (checked) {
      setRbMissAnimating(true);
      window.setTimeout(() => setRbMissAnimating(false), 600);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-md mx-auto bg-blue-950 text-white rounded-xl shadow p-6">
        <h1 className="text-white font-bold mb-6 text-center">
          <span className="block text-3xl">スマスロ ハナビ</span>
          <span className="block text-2xl mt-1 text-[#FFD700]">設定判別ツール</span>
        </h1>

        {/* 総ゲーム数入力 */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-white">総ゲーム数</label>
          <input
            type="number"
            value={games}
            onChange={(e) => setGames(e.target.value)}
            className="w-full border rounded-lg p-3 text-2xl font-bold"
            placeholder="0"
          />
        </div>

        {/* ▼ ボーナス回数 */}
        <div className="space-y-2 border-t pt-4">
          <h2 className="font-bold text-lg text-white mb-2">▼ ボーナス回数</h2>
          <CounterInput label="BIG回数" value={bbCount} setValue={setBbCount} labelClassName="text-white" />
          <CounterInput label="REG回数" value={rbCount} setValue={setRbCount} labelClassName="text-white" />
        </div>

        {/* ▼ 通常時 小役回数 */}
        <CollapsibleSection title="通常時 小役回数">
          <CounterInput label="風鈴A" value={bellACount} setValue={setBellACount} labelClassName="text-white" />
          <CounterInput label="風鈴B" value={bellBCount} setValue={setBellBCount} labelClassName="text-white" />
          <CounterInput label="氷A" value={iceACount} setValue={setIceACount} labelClassName="text-white" />
          <CounterInput label="チェリーA1" value={cherryA1Count} setValue={setCherryA1Count} labelClassName="text-white" />
          <CounterInput label="チェリーA2" value={cherryA2Count} setValue={setCherryA2Count} labelClassName="text-white" />
          <CounterInput label="チェリーB" value={cherryBCount} setValue={setCherryBCount} labelClassName="text-white" />
        </CollapsibleSection>

        {/* ▼ BIG中 小役回数 */}
        <CollapsibleSection title="BIG中 小役回数">
          <div className="bg-slate-950/40 p-4 rounded-lg border border-white/10">
            <div className="mb-3">
              <label className="block text-sm font-bold text-white mb-1">BB中 総ゲーム数</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setBbGames((prev) =>
                      String(Math.max(0, Number(prev || 0) - 1))
                    )
                  }
                  className="w-12 h-12 shrink-0 rounded-lg border border-[#FF6F00] text-2xl font-bold bg-white text-[#FF6F00] active:bg-neutral-100"
                  aria-label="BB中 総ゲーム数を1減らす"
                >
                  −
                </button>
                <input
                  type="number"
                  value={bbGames}
                  onChange={(e) => setBbGames(e.target.value)}
                  className="min-w-0 flex-1 border rounded-lg p-2 text-center text-xl font-bold"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() =>
                    setBbGames((prev) =>
                      String(Number(prev || 0) + 1)
                    )
                  }
                  className="w-12 h-12 shrink-0 rounded-lg bg-[#FF6F00] text-white text-2xl font-bold active:bg-[#E56500]"
                  aria-label="BB中 総ゲーム数を1増やす"
                >
                  ＋
                </button>
              </div>
              <p className="text-[11px] text-taupe-50 mt-1">※BIG回数から自動で「×29G」を入れています。目押しをミスしてゲーム数が増えた場合のみ直接書き換えてください。</p>
            </div>
            <CounterInput label="斜め風鈴 (風鈴B)" value={bbBellBCount} setValue={setBbBellBCount} labelClassName="text-white" />
            <CounterInput label="平行風鈴 (風鈴A)" value={bbBellACount} setValue={setBbBellACount} labelClassName="text-white" />
            <CounterInput label="バラケ目" value={bbChanceCount} setValue={setBbChanceCount} labelClassName="text-white" />
          </div>
        </CollapsibleSection>

        {/* REG中のハズレ */}
        <CollapsibleSection title="REG中のハズレ">
          <label
            className={`reg-miss-box flex items-center gap-3 border p-4 rounded-lg cursor-pointer select-none bg-slate-950/40 border-white/10 ${hasRbMiss ? "reg-miss-box--checked" : ""} ${rbMissAnimating ? "reg-miss-box--animate-in" : ""}`}
          >
            <input
              type="checkbox"
              checked={hasRbMiss}
              onChange={handle_rb_miss_change}
              className="w-6 h-6 rounded accent-[#E53935]"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">REG中にハズレを引いた</span>
              <span className="text-[11px] text-taupe-50 font-medium">※1回でも出現すれば設定5・6が確定します</span>
            </div>
          </label>
        </CollapsibleSection>
        {/* RT（花火GAME） */}
        <CollapsibleSection title="RT（花火GAME）">
          <div className="bg-slate-950/40 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3 text-sm text-white font-semibold">
              <span>花火GAME算出手数：</span>
              <span className="text-base text-white font-bold">{calculatedHgGames} ゲーム</span>
            </div>
            <p className="text-xs text-taupe-50 mb-3">※BIG回数から自動的に「×20G」で計算しています</p>
            <CounterInput label="ハズレ回数" value={hgMissCount} setValue={setHgMissCount} labelClassName="text-white" />
          </div>
        </CollapsibleSection>

        {/* 判定結果の表示 */}
        {hasAnyInput && (
          <div className="mt-6 border-t pt-4">
            {closestSetting && Number(combinedTotal) > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm text-blue-900 font-medium">現在もっとも近いのは</p>
                <p className="text-3xl font-black text-blue-900 mt-1">設定 {closestSetting.setting}</p>
              </div>
            )}

            {/* 各設定の期待度（％） */}
            <h3 className="font-bold mb-2 text-white">設定推測配分</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {finalProbability.map((item) => (
                <div key={item.setting} className="bg-neutral-50 border rounded-lg p-3 text-center">
                  <span className="block text-xs text-neutral-500 font-bold">設定 {item.setting}</span>
                  <span className="text-xl font-bold text-neutral-800">{item.probability}%</span>
                </div>
              ))}
            </div>

            {/* 実測確率の一覧表示 */}
            <h3 className="font-bold mb-2 text-white">現在の実測確率</h3>
            <div className="bg-gray-100 rounded-lg p-4 space-y-1 text-sm font-semibold text-neutral-700">
              {bbRate && <p>BIG：1/{bbRate}</p>}
              {rbRate && <p>REG：1/{rbRate}</p>}
              {bellARate && <p>風鈴A：1/{bellARate}</p>}
              {bellBRate && <p>風鈴B：1/{bellBRate}</p>}
              {iceARate && <p>氷A：1/{iceARate}</p>}
              {cherryA1Rate && <p>チェリーA1：1/{cherryA1Rate}</p>}
              {cherryA2Rate && <p>チェリーA2：1/{cherryA2Rate}</p>}
              {cherryBRate && <p>チェリーB：1/{cherryBRate}</p>}
              {hgMissRate && <p>HGハズレ：1/{hgMissRate} ({calculatedHgGames}G)</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}