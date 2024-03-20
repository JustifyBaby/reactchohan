import { useRef, useState } from "react";
import "./App.css";
import { Money } from "./types";
import { intRandom, randomChoice } from "./rand";
import { chohan, isInclude, npcNames } from "./global";

function App() {
  // 財布とBET額の状態
  const [money, setMoney] = useState<Money>({ wallet: 1500, bet: 0 });
  // いくらかけたか
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const betRef = useRef<HTMLInputElement | null>(null);
  // サイコロの状態
  const [dices, setDices] = useState<number[]>([]);
  // playerの役
  const [role, serRole] = useState<string>("???");
  // playerが選んだ役
  const [userSelect, setSelect] = useState("何も選ばれていません。");
  // npcが選んだ役。
  const [npcSelect, setNpc] = useState("");
  // 報酬が得られるか
  const [canReward, setReward] = useState(false);

  const bet = (): void => {
    const current = betRef.current!;
    if (current == undefined) {
      alert(`Warning: current is ${current}!!
      This is the developer's trouble. If you see,
      please tell me.`);
      return;
    } else {
      if (current.value === "") {
        alert("BETしないと参加資格はありませんよ");
        return;
      }
      const betNum = parseInt(current.value);
      setMoney({
        wallet: money.wallet - betNum,
        bet: money.bet + betNum
      });
      current.value = "";
    }
  };

  const reset = (): void => {
    setMoney({
      wallet: money.wallet + money.bet,
      bet: 0
    });
  };

  const diceRoll = (): number[] | "ションベン" => {
    const isShonben = intRandom(0, 100);
    if (isInclude(0, isShonben, 5)) return "ションベン";
    const dices: number[] = [
      intRandom(1, 6), intRandom(1, 6)
    ];
    return dices;
  };

  const displayResult = (select: 0 | 1): void => {
    setSelect(chohan[select]);
    const rollResult = diceRoll();
    if (rollResult === "ションベン") {
      setDices([0, 0]);
      return;
    }
    setDices(rollResult);

    // サイコロの目の和
    const rollSum = rollResult[0] + rollResult[1];
    // rollSumが奇数か偶数か
    if (rollSum % 2 === select) {
      serRole(chohan[select]);
    } else {
      setMoney({
        wallet: money.wallet,
        bet: 0
      });
    }

    // npcとplayerの役が同じなら、ｘ１違ったら、ｘ２
    setNpc(randomChoice(chohan));
    if (role === npcSelect) {
      setReward(false);
    } else {
      setReward(true);
    }

    // 報酬が得られるか得られないか。
    canReward ?
      setMoney({
        wallet: money.wallet + (money.bet * 2),
        bet: 0
      }) :
      setMoney({
        wallet: money.wallet + money.bet,
        bet: 0
      });
  };

  const npcName = randomChoice(npcNames);

  return (
    <div>
      <div className="flex">
        <h1 style={{ position: "absolute", top: "20px", padding: "10px" }}>
          丁半博打"NPC有"
        </h1>
        <div className="wallet" style={{ textAlign: "center" }}>
          <h2>あなたの財布：{money.wallet}</h2>
          <div>
            <label>BET額:</label>
            <input type="number" ref={betRef} />
          </div>
          <div className="btns">
            <button onClick={bet}>BET</button>
            <button onClick={reset}>RESET</button>
          </div>
          <div className="bet">
            {money.bet}
          </div>
        </div>
        <div className="npc" style={{ textAlign: "center" }}>
          {npcName} selects {npcSelect}!!
        </div>
        <div className="judge" style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <div>
            <button id="chou" onClick={() => displayResult(0)}>
              丁
            </button>
            <button id="han" onClick={() => displayResult(1)}>
              半
            </button>
            <div className="user-select">{userSelect}</div>
          </div>
          <div className="result" style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column"
          }}>
            <div className="dice">
              {
                dices[0] ?
                  <div>{dices[0]} & {dices[1]}</div> :
                  <div>???</div>
              }
            </div>
            <div className="role">
              {role}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default App;
