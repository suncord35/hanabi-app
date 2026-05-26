"use client";

import { useState } from "react";

const settingsData = [
  { setting: 1, rate: 121.1 },
  { setting: 2, rate: 114.4 },
  { setting: 3, rate: 112.8 },
  { setting: 4, rate: 106.2 },
  { setting: 5, rate: 104.2 },
  { setting: 6, rate: 99.1 },
];

const stSettingsData = [
  { setting: 1, rate: 52 },
  { setting: 2, rate: 54 },
  { setting: 3, rate: 56 },
  { setting: 4, rate: 60 },
  { setting: 5, rate: 63 },
  { setting: 6, rate: 66 },
];

export default function Home() {
  const [games, setGames] = useState("");
  const [bells, setBells] = useState("");

  const [episodeBonus, setEpisodeBonus] =
    useState("");

  const [surugaBonus, setSurugaBonus] =
    useState("");

  const [surugaST, setSurugaST] =
    useState("");

  const [tetsugetaCount, setTetsugetaCount] =
    useState("");

  const [memberCount, setMemberCount] =
    useState("");

  const [mizugiCount, setMizugiCount] =
    useState("");

  // 下段ベル確率
  const bellRate =
    Number(games) > 0 &&
    Number(bells) > 0
      ? (
          Number(games) /
          Number(bells)
        ).toFixed(1)
      : null;

  // ボーナス合計
  const totalBonus =
    Number(episodeBonus) +
    Number(surugaBonus);

  // ST合計
  const totalST =
    Number(episodeBonus) +
    Number(surugaST);

  // ST突入率
  const stRate =
    totalBonus > 0
      ? (
          (totalST / totalBonus) *
          100
        ).toFixed(1)
      : null;

  // 下段ベル比較
  const comparison = bellRate
    ? settingsData.map((item) => {
        const difference = Math.abs(
          Number(bellRate) - item.rate
        );

        const score =
          1 / (difference + 1);

        return {
          ...item,
          difference,
          score,
        };
      })
    : [];

  // ST比較
  const stComparison = stRate
    ? stSettingsData.map((item) => {
        const difference = Math.abs(
          Number(stRate) - item.rate
        );

        const score =
          1 / (difference + 1);

        return {
          ...item,
          difference,
          score,
        };
      })
    : [];

  // 総合判定
  const combinedData = settingsData.map(
    (item) => {
      const bellItem = comparison.find(
        (c) =>
          c.setting === item.setting
      );

      const stItem = stComparison.find(
        (s) =>
          s.setting === item.setting
      );

      let totalScore =
        (bellItem?.score || 0) +
        (stItem?.score || 0);

      // 甲鉄城メンバー加点
      if (item.setting >= 4) {
        totalScore +=
          Number(memberCount) * 2;
      }

      // 水着加点
      if (item.setting === 6) {
        totalScore +=
          Number(mizugiCount) * 999;
      }

      return {
        setting: item.setting,
        rate: item.rate,
        totalScore,
      };
    }
  );

  const combinedTotal =
    combinedData.reduce(
      (sum, item) =>
        sum + item.totalScore,
      0
    );

  const finalProbability =
    combinedData.map((item) => ({
      ...item,
      probability:
        combinedTotal > 0
          ? (
              (item.totalScore /
                combinedTotal) *
              100
            ).toFixed(1)
          : "0.0",
    }));

  // 最も近い設定
  const closestSetting =
    finalProbability.length > 0
      ? finalProbability.reduce(
          (prev, current) =>
            Number(prev.probability) >
            Number(current.probability)
              ? prev
              : current
        )
      : null;

  // カウンター入力
  const CounterInput = ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: string;
    setValue: React.Dispatch<
      React.SetStateAction<string>
    >;
  }) => (
    <div className="mb-4">
      <label className="block mb-2 font-bold">
        {label}
      </label>

      <div className="flex items-center gap-2">
        {/* マイナス */}
        <button
          type="button"
          onClick={() =>
            setValue((prev) =>
              String(
                Math.max(
                  0,
                  Number(prev || 0) - 1
                )
              )
            )
          }
          className="w-12 h-12 rounded-lg border text-2xl font-bold bg-neutral-300"
        >
          −
        </button>

        {/* 入力欄 */}
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          className="w-32 border rounded-lg p-3 text-center text-2xl font-bold"
          placeholder="0"
        />

        {/* プラス */}
        <button
          type="button"
          onClick={() =>
            setValue((prev) =>
              String(
                Number(prev || 0) + 1
              )
            )
          }
          className="w-12 h-12 rounded-lg bg-emerald-500 text-white text-2xl font-bold"
        >
          ＋
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-neutral-800 font-bold mb-6 text-center">
          <span className="block text-3xl">
            スマスロ カバネリ
          </span>

          <span className="block text-blue-500 text-2xl mt-1">
            設定判別
          </span>
        </h1>

        {/* 総ゲーム数 */}
        <div className="mb-6">
          <label className="block mb-2 font-bold">
            総ゲーム数
          </label>

          <input
            type="number"
            value={games}
            onChange={(e) =>
              setGames(e.target.value)
            }
            className="w-full border rounded-lg p-3 text-2xl font-bold"
            placeholder="0"
          />
        </div>

        <CounterInput
          label="下段ベル回数"
          value={bells}
          setValue={setBells}
        />

        <CounterInput
          label="エピソードボーナス回数"
          value={episodeBonus}
          setValue={setEpisodeBonus}
        />

        <CounterInput
          label="駿城ボーナス回数"
          value={surugaBonus}
          setValue={setSurugaBonus}
        />

        <CounterInput
          label="駿城ボーナス成功回数"
          value={surugaST}
          setValue={setSurugaST}
        />

        <h2 className="text-xl font-bold mt-8 mb-4">
          終了画面
        </h2>

        <CounterInput
          label="鉄下駄(デフォルト)"
          value={tetsugetaCount}
          setValue={setTetsugetaCount}
        />

        <CounterInput
          label="甲鉄城メンバー"
          value={memberCount}
          setValue={setMemberCount}
        />

        <CounterInput
          label="水着"
          value={mizugiCount}
          setValue={setMizugiCount}
        />

        <button className="w-full bg-blue-500 text-white rounded-lg p-3 font-bold mb-6 mt-6">
          判別する
        </button>

        {bellRate && (
          <div className="bg-gray-100 rounded-lg p-4">
            {closestSetting && (
              <p className="text-xl font-bold text-blue-600 mb-2">
                現在もっとも近いのは設定
                {closestSetting.setting}
              </p>
            )}

            <p className="text-lg font-bold">
              下段ベル実測確率：
              1/{bellRate}
            </p>

            {stRate && (
              <p className="text-lg font-bold mt-2">
                ST突入率：
                {stRate}%
              </p>
            )}
          </div>
        )}

        {bellRate && (
          <div className="mt-4">
            <h2 className="font-bold mb-2">
              設定別比較
            </h2>

            <div className="space-y-2">
              {finalProbability.map(
                (item) => (
                  <div
                    key={item.setting}
                    className={`border rounded-lg p-3 ${
                      item.setting ===
                      closestSetting?.setting
                        ? "bg-blue-100 border-blue-500"
                        : ""
                    }`}
                  >
                    <p>
                      設定{item.setting}
                    </p>

                    <p>
                      設定別下段ベル確率：
                      1/{item.rate}
                    </p>

                    <p>
                      設定期待度：
                      {item.probability}%
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}