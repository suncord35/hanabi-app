"use client";

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

const settingsData = [
  { setting: 1, rate: 121.1 },
  { setting: 2, rate: 114.4 },
  { setting: 3, rate: 112.8 },
  { setting: 4, rate: 106.2 },
  { setting: 5, rate: 104.2 },
  { setting: 6, rate: 99.1 },
];

const stSettingsData = [
  { setting: 1, rate: 60.2 },
  { setting: 2, rate: 59.7 },
  { setting: 3, rate: 60.1 },
  { setting: 4, rate: 60.0 },
  { setting: 5, rate: 61.1 },
  { setting: 6, rate: 61.3 },
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

  const [maleVoiceCount, setMaleVoiceCount] =
    useState("");

  const [femaleVoiceCount, setFemaleVoiceCount] =
    useState("");

  const [keishiWeakCount, setKeishiWeakCount] =
    useState("");

  const [keishiMiddleCount, setKeishiMiddleCount] =
    useState("");

  const [keishiStrongCount, setKeishiStrongCount] =
    useState("");

  const [mumeiSpecialCount, setMumeiSpecialCount] =
    useState("");

  const [noVoiceCount, setNoVoiceCount] =
    useState("");

  const [tsuranukiCount, setTsuranukiCount] =
    useState("");

  const [tanjuCount, setTanjuCount] =
    useState("");

  const [jiketsuCount, setJiketsuCount] =
    useState("");

  const [kendamaCount, setKendamaCount] =
    useState("");

  const [katanaCount, setKatanaCount] =
    useState("");

  const [yumiCount, setYumiCount] =
    useState("");

  const [agehaCount, setAgehaCount] =
    useState("");

  const [shokichiCount, setShokichiCount] =
    useState("");

  const [chukichiCount, setChukichiCount] =
    useState("");

  const [daikichiCount, setDaikichiCount] =
    useState("");

  const [showEndingScreen, setShowEndingScreen] =
    useState(false);

  const [showVoice, setShowVoice] =
    useState(false);

  const [showOmikuji, setShowOmikuji] =
    useState(false);

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

      // 男性キャラ（奇数示唆）
      if (
        item.setting === 1 ||
        item.setting === 3 ||
        item.setting === 5
      ) {
        totalScore +=
          Number(maleVoiceCount) * 2;
      }

      // 女性キャラ（偶数示唆）
      if (
        item.setting === 2 ||
        item.setting === 4 ||
        item.setting === 6
      ) {
        totalScore +=
          Number(femaleVoiceCount) * 2;
      }

      // 景之ボイス弱
      if (item.setting >= 4) {
        totalScore +=
          Number(keishiWeakCount) * 3;
      }

      // 景之ボイス中
      if (item.setting >= 4) {
        totalScore +=
          Number(keishiMiddleCount) * 6;
      }

      // 景之ボイス強
      if (item.setting >= 4) {
        totalScore +=
          Number(keishiStrongCount) * 10;
      }

      // 無名特殊ボイス（設定2以上濃厚）
      if (Number(mumeiSpecialCount) > 0) {
        if (item.setting === 1) {
          totalScore += 0.1;
        } else {
          totalScore += 200;
        }
      }

      // ボイス非発生（設定5以上濃厚）
      if (Number(noVoiceCount) > 0) {
        if (
          item.setting === 5 ||
          item.setting === 6
        ) {
          totalScore += 500;
        } else {
          totalScore += 0.1;
        }
      }

      // ツラヌキ筒（設定4弱化）
      if (Number(tsuranukiCount) > 0) {
        if (item.setting === 4) {
          totalScore += 0.5;
        }
      }

      // 無名の短銃（設定3弱化）
      if (Number(tanjuCount) > 0) {
        if (item.setting === 3) {
          totalScore += 0.5;
        }
      }

      // 自決袋（設定1弱化）
      if (Number(jiketsuCount) > 0) {
        if (item.setting === 1) {
          totalScore += 0.5;
        }
      }

      // 無名のけん玉（設定1否定）
      if (Number(kendamaCount) > 0) {
        if (item.setting === 1) {
          totalScore += 0.1;
        }
      }

      // 来栖の刀（設定2否定）
      if (Number(katanaCount) > 0) {
        if (item.setting === 2) {
          totalScore += 0.1;
        }
      }

      // 菖蒲の弓（高設定示唆）
      if (item.setting >= 4) {
        totalScore +=
          Number(yumiCount) * 5;
      }

      // ミヤマカラスアゲハ（高設定示唆強）
      if (item.setting >= 4) {
        totalScore +=
          Number(agehaCount) * 10;
      }

      // 小吉（設定2以上濃厚）
      if (Number(shokichiCount) > 0) {
        if (item.setting === 1) {
          totalScore += 0.1;
        } else {
          totalScore += 200;
        }
      }

      // 中吉（設定4以上濃厚）
      if (Number(chukichiCount) > 0) {
        if (
          item.setting === 1 ||
          item.setting === 2 ||
          item.setting === 3
        ) {
          totalScore += 0.1;
        } else {
          totalScore += 300;
        }
      }

      // 大吉（設定6濃厚）
      if (Number(daikichiCount) > 0) {
        if (item.setting === 6) {
          totalScore += 999;
        } else {
          totalScore += 0.1;
        }
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

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-neutral-800 font-bold mb-6 text-center">
          <span className="block text-3xl">
            スマスロ カバネリ
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

        <button
          type="button"
          onClick={() =>
            setShowVoice(!showVoice)
          }
          className="w-full flex justify-between items-center text-lg text-cyan-600 font-bold mt-8 mb-4 border-b pb-2"
        >
          <span>
            サンド目停止ボイス
          </span>

          <span>
            {showVoice ? "−" : "＋"}
          </span>
        </button>
        {showVoice && (
          <>
            <CounterInput
              label="男性キャラ"
              value={maleVoiceCount}
              setValue={setMaleVoiceCount}
            />

            <CounterInput
              label="女性キャラ"
              value={femaleVoiceCount}
              setValue={setFemaleVoiceCount}
            />

            <CounterInput
              label="景之ボイス（弱）「なぜ言わなかった……私をヒトだと！」"
              value={keishiWeakCount}
              setValue={setKeishiWeakCount}
            />

            <CounterInput
              label="景之ボイス（中）「私は……ヒトか、カバネか！？」"
              value={keishiMiddleCount}
              setValue={setKeishiMiddleCount}
            />

            <CounterInput
              label="景之ボイス（強）「今年は最後かな」"
              value={keishiStrongCount}
              setValue={setKeishiStrongCount}
            />

            <CounterInput
              label="無名特殊ボイス「やっぱりこの台……普通じゃないね」"
              value={mumeiSpecialCount}
              setValue={setMumeiSpecialCount}
            />

            <CounterInput
              label="ボイス非発生"
              value={noVoiceCount}
              setValue={setNoVoiceCount}
            />
          </>
        )}

        <button
          type="button"
          onClick={() =>
            setShowOmikuji(
              !showOmikuji
            )
          }
          className="w-full flex justify-between items-center text-lg text-cyan-600 font-bold mt-8 mb-4 border-b pb-2"
        >
          <span>アイテムくじ</span>

          <span>
            {showOmikuji ? "−" : "＋"}
          </span>
        </button>

        {showOmikuji && (
          <>
            <CounterInput
              label="ツラヌキ筒"
              value={tsuranukiCount}
              setValue={setTsuranukiCount}
            />

            <CounterInput
              label="無名の短銃"
              value={tanjuCount}
              setValue={setTanjuCount}
            />

            <CounterInput
              label="自決袋"
              value={jiketsuCount}
              setValue={setJiketsuCount}
            />

            <CounterInput
              label="無名のけん玉"
              value={kendamaCount}
              setValue={setKendamaCount}
            />

            <CounterInput
              label="来栖の刀"
              value={katanaCount}
              setValue={setKatanaCount}
            />

            <CounterInput
              label="菖蒲の弓"
              value={yumiCount}
              setValue={setYumiCount}
            />

            <CounterInput
              label="ミヤマカラスアゲハ"
              value={agehaCount}
              setValue={setAgehaCount}
            />

            <CounterInput
              label="小吉"
              value={shokichiCount}
              setValue={setShokichiCount}
            />

            <CounterInput
              label="中吉"
              value={chukichiCount}
              setValue={setChukichiCount}
            />

            <CounterInput
              label="大吉"
              value={daikichiCount}
              setValue={setDaikichiCount}
            />
          </>
        )}



        <button
          type="button"
          onClick={() =>
            setShowEndingScreen(
              !showEndingScreen
            )
          }
          className="w-full flex justify-between items-center text-lg text-cyan-600 font-bold mt-8 mb-4 border-b pb-2"
        >
          <span>終了画面</span>

          <span>
            {showEndingScreen ? "−" : "＋"}
          </span>
        </button>

        {showEndingScreen && (
          <>
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
          </>
        )}

        <button className="w-full bg-cyan-700 text-white rounded-lg p-3 font-bold mb-6 mt-6">
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
                    className={`border rounded-lg p-3 ${item.setting ===
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