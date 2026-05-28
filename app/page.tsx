"use client";

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

const bbSettingsData = [
  { setting: 1, rate: 297.9 },
  { setting: 2, rate: 292.6 },
  { setting: 5, rate: 284.9 },
  { setting: 6, rate: 273.1 },
];

const rbSettingsData = [
  { setting: 1, rate: 394.8 },
  { setting: 2, rate: 358.1 },
  { setting: 5, rate: 313.6 },
  { setting: 6, rate: 282.5 },
];

function CounterInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">
        {label}
      </label>

      <div className="flex items-center gap-2">
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

        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          className="w-32 border rounded-lg p-3 text-center text-2xl font-bold"
          placeholder="0"
        />

        <button
          type="button"
          onClick={() =>
            setValue((prev) =>
              String(
                Number(prev || 0) + 1
              )
            )
          }
          className="w-12 h-12 rounded-lg bg-stone-950 text-white text-2xl font-bold"
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [games, setGames] = useState("");
  const [bbCount, setBbCount] =
    useState("");

  const [rbCount, setRbCount] =
    useState("");

  // BIG確率
  // BIG確率
  const bbRate =
    Number(games) > 0 &&
      bbCount !== ""
      ? Number(bbCount) === 0
        ? "∞"
        : (
          Number(games) /
          Number(bbCount)
        ).toFixed(1)
      : null;

  // REG確率
  // REG確率
  const rbRate =
    Number(games) > 0 &&
      rbCount !== ""
      ? Number(rbCount) === 0
        ? "∞"
        : (
          Number(games) /
          Number(rbCount)
        ).toFixed(1)
      : null;

  // BB比較
  const bbComparison = bbRate
    ? bbSettingsData.map((item) => {
      const actualRate =
        Number(bbRate);

      const difference =
        Math.abs(
          actualRate - item.rate
        );

      const score =
        1 / (difference + 0.0001);

      return {
        ...item,
        score,
      };
    })
    : [];

  // RB比較
  const rbComparison = rbRate
    ? rbSettingsData.map((item) => {
      const actualRate =
        Number(rbRate);

      const difference =
        Math.abs(
          actualRate - item.rate
        );

      const score =
        1 / (difference + 0.0001);

      return {
        ...item,
        score,
      };
    })
    : [];

  // 総合判定
  const combinedData =
    bbSettingsData.map((item) => {
      const bbItem =
        bbComparison.find(
          (b) =>
            b.setting === item.setting
        );

      const rbItem =
        rbComparison.find(
          (r) =>
            r.setting === item.setting
        );

      const totalScore =
        (bbItem?.score || 0) +
        (rbItem?.score || 0);

      return {
        setting: item.setting,
        totalScore,
      };
    });

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

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-neutral-800 font-bold mb-6 text-center">
          <span className="block text-3xl">
            スマスロ ハナビ
          </span>

          <span className="block text-cyan-700 text-2xl mt-1">
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
          label="BIG回数"
          value={bbCount}
          setValue={setBbCount}
        />

        <CounterInput
          label="REG回数"
          value={rbCount}
          setValue={setRbCount}
        />

        {(bbRate || rbRate) && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            {bbRate && (
              <p className="text-lg font-bold">
                BIG実測確率：
                1/{bbRate}
              </p>
            )}

            {rbRate && (
              <p className="text-lg font-bold mt-2">
                REG実測確率：
                1/{rbRate}
              </p>
            )}
          </div>
        )}

        {(bbRate || rbRate) && (
          <div className="mt-6">
            {closestSetting && (
              <p className="text-xl font-bold text-blue-600 mb-4">
                現在もっとも近いのは設定
                {closestSetting.setting}
              </p>
            )}
            <h2 className="font-bold mb-2">
              設定別確率
            </h2>

            <div className="space-y-2">
              {bbSettingsData.map(
                (bbItem) => {
                  const rbItem =
                    rbSettingsData.find(
                      (r) =>
                        r.setting ===
                        bbItem.setting
                    );

                  return (
                    <div
                      key={bbItem.setting}
                      className="border rounded-lg p-3"
                    >
                      <p>
                        設定
                        {bbItem.setting}
                      </p>

                      <p>
                        BIG：
                        1/{bbItem.rate}
                      </p>

                      <p>
                        REG：
                        1/{rbItem?.rate}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}