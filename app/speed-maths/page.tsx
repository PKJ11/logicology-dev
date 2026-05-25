"use client";

import NavBar from "@/components/NavBar";
import { useState, useEffect, useCallback, useRef } from "react";

type Challenge = "Addition" | "Subtraction" | "Multiplication" | "Half" | "Squares" | "Friends";
type AnswerMode = "Choose Option" | "Type Answer";
type TimeMode = "timed" | "fixed-questions";
type GameState = "splash" | "menu" | "mode-select" | "settings" | "playing" | "result" | "half-table" | "half-3step" | "square-step" | "friends-practice" | "mult-table-select" | "mult-table";

interface Question {
  num1: number; num2?: number; answer: number; options?: number[]; display: string;
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function tableHalf(d: number): number { return Math.floor(d / 2); }

function generateQuestion(challenge: Challenge): Question {
  switch (challenge) {
    case "Addition": {
      const a = rand(1,50), b = rand(1,50), ans = a+b;
      const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
      const wrongs = shuffle([ans + 10, ans - 10, nineOff]).slice(0, 3);
      return { num1:a, num2:b, answer:ans, display:`${a} + ${b}`, options:shuffle([ans,...wrongs]) };
    }
    case "Subtraction": {
      const a = rand(10,99), b = rand(1,a), ans = a-b;
      const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
      const wrongs = shuffle([ans + 10, ans - 10, nineOff]).slice(0, 3);
      return { num1:a, num2:b, answer:ans, display:`${a} − ${b}`, options:shuffle([ans,...wrongs]) };
    }
    case "Multiplication": {
      const a = rand(2,12), b = rand(2,12), ans = a*b;
      const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
      const wrongs = shuffle([ans + 10, ans - 10, nineOff]).slice(0, 3);
      return { num1:a, num2:b, answer:ans, display:`${a} × ${b}`, options:shuffle([ans,...wrongs]) };
    }
    case "Half": {
      const a = rand(1,999), ans = a/2;
      const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
      const wrongs = shuffle([ans + 10, ans - 10, nineOff]).filter(x => x > 0 && x !== ans).slice(0, 3);
      return { num1:a, answer:ans, display:`½ of ${a}`, options:shuffle([ans,...wrongs.slice(0,3)]) };
    }
    case "Squares": {
      const a = rand(11,59), ans = a*a;
      const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
      const wrongs = shuffle([ans + 10, ans - 10, nineOff]).filter(x => x > 0 && x !== ans).slice(0, 3);
      return { num1:a, answer:ans, display:`${a}²`, options:shuffle([ans,...wrongs]) };
    }
    case "Friends": {
      const base = shuffle([9, 10, 100])[0] as 9 | 10 | 100;
      const a = base === 100 ? rand(11, 89) : rand(1, base - 1);
      const ans = base - a;
      const offsets = base === 100
        ? shuffle([ans + 10, ans - 10, ans + 1, ans - 1, ans + 9, ans - 9])
        : shuffle([ans + 1, ans - 1, ans + 2, ans - 2]);
      const wrongs = offsets.filter(v => v > 0 && v !== ans && v < base).slice(0, 3);
      return { num1:a, answer:ans, display:`${a} + ? = ${base}`, options:shuffle([ans,...wrongs]) };
    }
  }
}

function generateHalfPracticeNum() { return rand(100,999); }



function generateMultiplicationRangeQuestion(minVal: number, maxVal: number): Question {
  const mid = Math.floor((minVal + maxVal) / 2);
  const a = rand(minVal, mid);
  const b = rand(mid, maxVal);
  const ans = a * b;
  const nineOff = Math.random() > 0.5 ? ans + 9 : ans - 9;
  const wrongs = shuffle([ans + 10, ans - 10, nineOff]).filter(x => x > 0 && x !== ans).slice(0, 3);
  return { num1: a, num2: b, answer: ans, display: `${a} × ${b}`, options: shuffle([ans, ...wrongs]) };
}

function computeHalfSteps(n: number) {
  const digits = String(n).split("").map(Number);
  const step1 = digits.map(d=>tableHalf(d));
  const oddPositions = digits.map(d=>d%2!==0);
  const step3 = [...step1];
  let carry = 0;
  for (let i=step3.length-1; i>=0; i--) {
    let val=step3[i]+carry; carry=0;
    if (oddPositions[i]) val+=5;
    if (val>=10) { carry=1; val-=10; }
    step3[i]=val;
  }
  const finalDigits = carry>0 ? [carry,...step3] : step3;
  return { digits, step1, oddPositions, step3:finalDigits, answer:n/2 };
}

const BRAND_TEAL    = "#0A8A80";
const BRAND_TEAL_DK = "#0B3F44";
const RACING = "'Racing Sans One', cursive";
const OUTFIT = "'Outfit', sans-serif";

const CHALLENGE_COLORS: Record<Challenge,{bg:string;light:string;dark:string}> = {
  Addition:       { bg:"#26a9e0", light:"#eff9fd", dark:"#0e6a94" },
  Subtraction:    { bg:"#d93b60", light:"#fcf1f4", dark:"#8a1535" },
  Multiplication: { bg:"#84c341", light:"#f6fbf1", dark:"#3d6b10" },
  Squares:        { bg:"#c74498", light:"#fbf2f8", dark:"#7a1a5e" },
  Half:           { bg:"#7784c1", light:"#ecedf6", dark:"#2e3875" },
  Friends:        { bg:"#F5A623", light:"#FFF8EC", dark:"#7A4F00" },
};

const CHALLENGE_IMAGES: Record<Challenge,string> = {
  Addition:       "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
  Subtraction:    "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SUBTRACTION@2x.png",
  Multiplication: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/MULTIPLICATION@2x.png",
  Half:           "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/FRACTION@2x.png",
  Squares:        "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/DIVISION@2x.png",
  Friends:        "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
};

const ROCKET_IMG        = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ROCKET@2x.png";
const CLOUDS_IMG        = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CLOUDS.png";
const CLOUDS_MOBILE_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/cloud_mobile.png";
const CORRECT_IMG       = "https://ik.imagekit.io/pratik11/corrreect.png";
const WRONG_IMG         = "https://ik.imagekit.io/pratik11/ohno.png";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Outfit:wght@400;600;700;900&display=swap');
  @keyframes rocketBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rocketFlyUp {
    0%{opacity:0;transform:translateY(100vh) scale(0.6);}
    40%{opacity:1;transform:translateY(35vh) scale(1.1);}
    100%{opacity:1;transform:translateY(0) scale(1);}
  }
  @keyframes rocketHover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
`;

// ─── MenuChallengeCard ────────────────────────────────────────────────────────
function MenuChallengeCard({ ch, index, visible, onClick, compact=false }:
  { ch:Challenge; index:number; visible:boolean; onClick:()=>void; compact?:boolean }) {
  const { bg, light } = CHALLENGE_COLORS[ch];
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="focus:outline-none w-full"
      style={{
        ...(compact ? { maxWidth: 136, width: "100%", margin: "0 auto" } : {}),
        opacity: visible?1:0,
        transform: visible?(hov?"translateY(-8px) scale(1.04)":"translateY(0) scale(1)"):"translateY(60px) scale(0.9)",
        transition:`opacity 0.55s cubic-bezier(.22,1,.36,1) ${index*0.1+0.3}s,
                   transform ${hov?"0.22s":"0.55s"} cubic-bezier(.22,1,.36,1) ${hov?"0s":index*0.1+0.3+"s"},
                   box-shadow 0.22s ease`,
        boxShadow: hov?`0 22px 44px ${bg}55`:"0 4px 20px rgba(0,0,0,0.13)",
        borderRadius: 20,
      }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{background:light, border:`3px solid ${bg}`}}>
        <div className="w-full flex items-center justify-center overflow-hidden"
          style={{background:light, minHeight:compact?120:200, padding:compact?"8px 4px 0":"16px 8px 0"}}>
          <img src={CHALLENGE_IMAGES[ch]} alt={ch}
            style={{width:"100%", height:compact?115:190, objectFit:"contain", objectPosition:"bottom center", display:"block",
              transform:hov?"scale(1.06)":"scale(1)", transition:"transform 0.3s ease"}} />
        </div>
        <div style={{padding:compact?"6px 6px 8px":"12px 12px 14px"}}>
          <div className="w-full rounded-2xl text-center text-white shadow"
            style={{background:bg, fontFamily:RACING, fontSize:compact?"0.85rem":"1.2rem",
              letterSpacing:"0.04em", padding:compact?"8px 4px":"16px 4px",
              transform:hov?"scale(1.02)":"scale(1)", transition:"transform 0.2s"}}>
            {ch}
          </div>
        </div>
      </div>
    </button>
  );
}

function Stars({ count=6 }: { count?:number }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({length:count}).map((_,i) => (
        <div key={i} className="absolute rounded-full" style={{
          width:`${rand(4,10)}px`, height:`${rand(4,10)}px`,
          background:[BRAND_TEAL,"#E45C48","#D8AE4F","#2EC4B6","#6ABF4B"][i%5],
          top:`${rand(5,90)}%`, left:`${rand(5,90)}%`, opacity:0.4,
        }} />
      ))}
    </div>
  );
}

function ScoreBar({ score, streak, dark }:{score:number;streak:number;dark:string}) {
  return (
    <div className="flex gap-3 justify-center flex-wrap mb-4">
      {[{label:"Score",value:score,emoji:"⭐",color:"#D8AE4F"},{label:"Streak",value:streak,emoji:"🔥",color:"#E45C48"}]
        .map(({label,value,emoji,color})=>(
          <div key={label} className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow"
            style={{background:"#fff",border:`2.5px solid ${color}`,color,fontFamily:OUTFIT,fontWeight:700}}>
            <span className="text-xl">{emoji}</span>
            <span className="text-base">{label}:</span>
            <span style={{fontFamily:RACING,fontSize:"1.1rem"}}>{value}</span>
          </div>
        ))}
    </div>
  );
}

function NumPad({ onDigit, onEnter, onErase, value }:
  { onDigit:(d:string)=>void; onEnter:()=>void; onErase:()=>void; value:string }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="rounded-2xl border-4 bg-white px-4 py-2 text-center mb-3 min-h-[52px]"
        style={{borderColor:BRAND_TEAL, color:BRAND_TEAL_DK, fontFamily:RACING, fontSize:"1.8rem"}}>
        {value||<span style={{color:"#d1d5db",fontFamily:OUTFIT}}>?</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["1","2","3","4","5","6","7","8","9","0.5","0","E"].map(d=>(
          <button key={d} onClick={()=>d==="E"?onErase():onDigit(d)}
            className="rounded-2xl py-3 shadow transition active:scale-95"
            style={{background:d==="E"?"#E45C48":"#e8f9f8", color:d==="E"?"#fff":BRAND_TEAL_DK,
              border:`2px solid ${BRAND_TEAL}44`, fontFamily:RACING, fontSize:"1.2rem"}}>
            {d==="E"?"⌫":d}
          </button>
        ))}
      </div>
      <button onClick={onEnter} className="mt-3 w-full rounded-2xl py-3 shadow-lg transition active:scale-95"
        style={{background:BRAND_TEAL, color:"#fff", fontFamily:RACING, fontSize:"1.2rem"}}>✓ Enter</button>
    </div>
  );
}

// ─── Half Table Quiz ──────────────────────────────────────────────────────────
function HalfTableQuiz({ bg, light, dark, onNext }:{bg:string;light:string;dark:string;onNext:()=>void}) {
  const DIGITS=[0,1,2,3,4,5,6,7,8,9], TOTAL=20;
  const [queue] = useState<number[]>(()=>{ const q:number[]=[]; for(let i=0;i<2;i++) q.push(...shuffle(DIGITS)); return q; });
  const [attempted,setAttempted]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [inputVal,setInputVal]=useState("");
  const [feedback,setFeedback]=useState<"correct"|"wrong"|null>(null);
  const [done,setDone]=useState(false);
  const [showRef,setShowRef]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const currentDigit=queue[attempted]??0;
  const expectedAnswer=Math.floor(currentDigit/2);

  useEffect(()=>{ if(!done) inputRef.current?.focus(); },[attempted,done]);

  const checkAnswer=()=>{
    if(inputVal===""||feedback) return;
    const ok=parseInt(inputVal)===expectedAnswer;
    setFeedback(ok?"correct":"wrong");
    if(ok) setCorrect(c=>c+1);
  };
  const next=()=>{ const n=attempted+1; setAttempted(n); setInputVal(""); setFeedback(null); if(n>=TOTAL) setDone(true); };
  const handleKey=(e:React.KeyboardEvent)=>{ if(e.key==="Enter"){if(feedback)next();else checkAnswer();} };
  const restart=()=>{ setAttempted(0); setCorrect(0); setInputVal(""); setFeedback(null); setDone(false); };
  const refTable=[[0,0],[1,0],[2,1],[3,1],[4,2],[5,2],[6,3],[7,3],[8,4],[9,4]];

  if(done) {
    const pct=Math.round((correct/TOTAL)*100);
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 text-center" style={{borderColor:bg}}>
        <div className="text-6xl mb-3">{pct>=90?"🌟":pct>=70?"👍":"💪"}</div>
        <h3 className="text-2xl mb-1" style={{color:bg,fontFamily:RACING}}>Quiz Complete!</h3>
        <p className="mb-2 font-semibold" style={{color:dark,fontFamily:OUTFIT}}>{correct}/{TOTAL} correct — {pct}%</p>
        <div className="flex gap-3 mt-6">
          <button onClick={restart} className="flex-1 rounded-2xl py-3 text-white active:scale-95" style={{background:bg,fontFamily:RACING,fontSize:"1rem"}}>🔄 Retry</button>
          <button onClick={onNext} className="flex-1 rounded-2xl py-3 active:scale-95 border-2" style={{borderColor:bg,color:bg,background:light,fontFamily:RACING,fontSize:"1rem"}}>🪜 3-Step</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{background:"#e0f2f1"}}>
          <div className="h-full rounded-full transition-all duration-300" style={{width:`${(attempted/TOTAL)*100}%`,background:bg}} />
        </div>
        <span className="text-sm min-w-[48px] text-right" style={{color:bg,fontFamily:RACING}}>{attempted}/{TOTAL}</span>
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow text-sm" style={{background:"#fff",border:`2.5px solid ${bg}`,color:bg,fontFamily:OUTFIT,fontWeight:700}}>✅ Correct: <span style={{fontFamily:RACING}}>{correct}</span></div>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow text-sm" style={{background:"#fff",border:"2.5px solid #e0f2f1",color:dark,fontFamily:OUTFIT,fontWeight:700}}>📝 Left: <span style={{fontFamily:RACING}}>{TOTAL-attempted}</span></div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 border-2 text-center"
        style={{borderColor:feedback==="correct"?"#22c55e":feedback==="wrong"?"#ef4444":bg}}>
        <p className="font-semibold mb-1 text-sm" style={{color:bg,fontFamily:OUTFIT}}>Table half of</p>
        <div className="text-8xl my-3" style={{color:bg,fontFamily:RACING}}>{currentDigit}</div>
        <input ref={inputRef} type="text" inputMode="numeric" maxLength={2} pattern="[0-9]*" value={inputVal}
          onChange={e=>{if(!feedback) setInputVal(e.target.value);}}
          onKeyDown={handleKey} disabled={!!feedback} placeholder="?"
          className="w-32 text-center rounded-2xl py-3 outline-none transition-all mb-3"
          style={{border:`4px solid ${feedback==="correct"?"#22c55e":feedback==="wrong"?"#ef4444":bg}`,
            background:feedback==="correct"?"#f0fdf4":feedback==="wrong"?"#fef2f2":light,
            color:feedback==="correct"?"#15803d":feedback==="wrong"?"#dc2626":bg,fontFamily:RACING,fontSize:"2rem"}} />
        {feedback&&(
          <div className="mb-3">
            <img src={feedback==="correct"?CORRECT_IMG:WRONG_IMG} alt={feedback} style={{width:"100%",maxWidth:"200px",margin:"0 auto",display:"block"}} />
          </div>
        )}
        {feedback==="correct" && <p className="text-green-500 text-lg mb-2" style={{fontFamily:OUTFIT,fontWeight:800}}>✅ Correct!</p>}
        {feedback==="wrong" && <p className="text-red-400 text-base mb-2" style={{fontFamily:OUTFIT,fontWeight:800}}>❌ Table half of {currentDigit} is <span style={{color:"#dc2626",fontFamily:RACING}}>{expectedAnswer}</span></p>}
        {!feedback
          ? <button onClick={checkAnswer} disabled={inputVal===""} className="w-full rounded-2xl py-3 text-lg text-white active:scale-95" style={{background:inputVal!==""?bg:"#ccc",cursor:inputVal!==""?"pointer":"not-allowed",fontFamily:RACING}}>Check ✓</button>
          : <button onClick={next} className="w-full rounded-2xl py-3 text-lg text-white active:scale-95" style={{background:bg,fontFamily:RACING}}>Next →</button>
        }
      </div>
      <div className="bg-white rounded-3xl p-4 border-2" style={{borderColor:`${bg}33`}}>
        <button onClick={()=>setShowRef(v=>!v)} className="w-full text-left text-sm flex justify-between items-center" style={{color:bg,fontFamily:OUTFIT,fontWeight:700}}>
          <span>📖 Reference Table</span><span>{showRef?"▲":"▼"}</span>
        </button>
        {showRef && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {refTable.map(([d,h])=>(
              <div key={d} className="rounded-xl py-2 text-center" style={{background:light}}>
                <div style={{fontFamily:RACING,color:bg,fontSize:"1rem"}}>{d}</div>
                <div style={{fontFamily:OUTFIT,fontSize:"0.75rem",fontWeight:600,color:dark}}>→ {h}</div>
              </div>
            ))}
          </div>
        )}
        {!showRef && <p className="text-xs mt-1" style={{color:`${bg}99`,fontFamily:OUTFIT}}>0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4</p>}
      </div>
    </div>
  );
}

// ─── Half 3-Step Interactive ──────────────────────────────────────────────────
type Half3StepPhase = "step1" | "step2" | "step3" | "done";

function Half3StepInteractive({ practiceNum, onComplete, onNewNumber, bg, light, dark }:
  { practiceNum:number; onComplete:()=>void; onNewNumber:()=>void; bg:string; light:string; dark:string }) {
  const { digits, step1, oddPositions, answer } = computeHalfSteps(practiceNum);
  const [phase, setPhase] = useState<Half3StepPhase>("step1");

  const [userStep1, setUserStep1] = useState<(string|null)[]>(digits.map(()=>null));
  const [step1Feedback, setStep1Feedback] = useState<(boolean|null)[]>(digits.map(()=>null));

  const lastIsOdd = oddPositions[digits.length - 1];
  const totalCells = digits.length + (lastIsOdd ? 1 : 0);

  const isRightHighlight = (i: number): boolean => {
    if (i === 0) return false;
    if (i < digits.length) return oddPositions[i - 1];
    return lastIsOdd;
  };

  const [userOddSel, setUserOddSel] = useState<boolean[]>(Array(totalCells).fill(false));
  const [step2Feedback, setStep2Feedback] = useState<string | null>(null);

  const [step3Vals, setStep3Vals] = useState<Record<number, string>>({});
  const [step3Feedback, setStep3Feedback] = useState<Record<number, boolean | null>>({});
  const [step3DecimalVal, setStep3DecimalVal] = useState("");
  const [step3DecimalFb, setStep3DecimalFb] = useState<boolean | null>(null);
  const [step3AnyWrong, setStep3AnyWrong] = useState(false);

  const getFinalVal = (i: number): number => {
    let v = step1[i];
    if (isRightHighlight(i)) v += 5;
    if (v >= 10) v -= 10;
    return v;
  };

  const step2Cells: (number | null)[] = lastIsOdd ? [...step1, null] : [...step1];

  const baseCell = (bc: string, bgc: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width: 52, height: 52, borderRadius: 14, border: `3px solid ${bc}`, background: bgc,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: RACING, fontSize: 22, color: BRAND_TEAL_DK, flexShrink: 0, ...extra,
  });

  const decDot: React.CSSProperties = {
    fontFamily: RACING, fontSize: 28, color: bg,
    alignSelf: "flex-end", marginBottom: 8, flexShrink: 0,
  };

  const upS1 = (idx: number, val: string) => {
    if (phase !== "step1") return;
    const n = [...userStep1]; n[idx] = val === "" ? null : val; setUserStep1(n);
  };

  const chkS1 = () => {
    const fb = userStep1.map((v, i) => v !== null && parseInt(v) === step1[i]);
    setStep1Feedback(fb);
    if (fb.every(Boolean)) setTimeout(() => setPhase("step2"), 600);
  };

  const toggleHighlight = (idx: number) => {
    if (phase !== "step2") return;
    const ns = [...userOddSel]; ns[idx] = !ns[idx]; setUserOddSel(ns);
  };

  const checkStep2 = () => {
    const allCorrect = Array.from({ length: totalCells }, (_, i) => i)
      .every(i => userOddSel[i] === isRightHighlight(i));
    if (allCorrect) {
      setStep2Feedback("correct");
      setTimeout(() => setPhase("step3"), 800);
    } else {
      setStep2Feedback("wrong");
      setTimeout(() => {
        setStep2Feedback(null);
        setUserOddSel(Array(totalCells).fill(false));
      }, 1200);
    }
  };

  const upS3 = (idx: number, val: string) => {
    setStep3Vals(p => ({ ...p, [idx]: val }));
  };

  const getExpectedS3 = (i: number): number => getFinalVal(i);

  const allS3Filled = (() => {
    const highlightedDigitIdxs = digits.map((_, i) => i).filter(i => isRightHighlight(i));
    const digitsOk = highlightedDigitIdxs.every(i => (step3Vals[i] ?? "") !== "");
    const decOk = !lastIsOdd || step3DecimalVal !== "";
    return digitsOk && decOk;
  })();

  const chkS3 = () => {
    const fb: Record<number, boolean> = {};
    let allOk = true;
    digits.forEach((_, i) => {
      if (isRightHighlight(i)) {
        const exp = getExpectedS3(i);
        const uv = parseInt(step3Vals[i] ?? "");
        const ok = uv === exp;
        fb[i] = ok;
        if (!ok) allOk = false;
      }
    });
    let decOk = true;
    if (lastIsOdd) {
      decOk = parseInt(step3DecimalVal) === 5;
      setStep3DecimalFb(decOk);
      if (!decOk) allOk = false;
    }
    setStep3Feedback(fb);
    setStep3AnyWrong(!allOk);
    if (allOk) { setTimeout(() => setPhase("done"), 600); }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="flex gap-2">
        {(["step1", "step2", "step3", "done"] as Half3StepPhase[]).map((p, i) => {
          const order = ["step1", "step2", "step3", "done"];
          const phaseIdx = order.indexOf(phase);
          const pIdx = order.indexOf(p);
          return (
            <div key={p} className="flex-1 h-2 rounded-full transition-all duration-500"
              style={{ background: phaseIdx > pIdx ? bg : phase === p ? `${bg}99` : "#e0f2f1" }} />
          );
        })}
      </div>

      <div className="text-center">
        <span style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "1rem", color: dark }}>Find half of</span>
        <div style={{ fontFamily: RACING, fontSize: "3rem", color: bg, marginTop: 4 }}>{practiceNum}</div>
      </div>

      <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: `${bg}44` }}>
        <div className="px-3 py-1.5 text-center text-xs font-bold" style={{ background: bg, color: "#fff", fontFamily: OUTFIT }}>
          📖 Table Half Reference
        </div>
        <div className="grid grid-cols-10" style={{ borderBottom: `2px solid ${bg}44` }}>
          {[0,1,2,3,4,5,6,7,8,9].map(d => (
            <div key={d} className="flex items-center justify-center py-2"
              style={{ fontFamily: RACING, fontSize: 15, color: bg, background: `${bg}10` }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-10">
          {[0,0,1,1,2,2,3,3,4,4].map((h, d) => (
            <div key={d} className="flex items-center justify-center py-2"
              style={{ fontFamily: RACING, fontSize: 15, color: BRAND_TEAL_DK, background: "#fff" }}>{h}</div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border-2 shadow-lg"
        style={{ borderColor: phase === "step1" ? bg : "#e0f2f1" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
            style={{ background: phase === "step1" ? bg : "#22c55e", fontFamily: RACING }}>
            {phase === "step1" ? "1" : "✓"}
          </div>
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
            Write table half of each digit
          </span>
        </div>

        <div className="flex gap-2 justify-center mb-1">
          {digits.map((d, i) => (
            <div key={i} style={{ ...baseCell(bg, light), color: bg }}>{d}</div>
          ))}
        </div>
        <div className="text-center text-xs mb-1" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>↓ half ↓</div>

        <div className="flex gap-2 justify-center">
          {digits.map((_, i) =>
            phase === "step1" ? (
              <input key={i} type="text" inputMode="numeric" maxLength={2} pattern="[0-9]*"
                value={userStep1[i] ?? ""}
                onChange={e => upS1(i, e.target.value)}
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  border: `3px solid ${step1Feedback[i] === null ? bg : step1Feedback[i] ? "#22c55e" : "#ef4444"}`,
                  background: step1Feedback[i] === true ? "#f0fdf4" : step1Feedback[i] === false ? "#fef2f2" : "#fff",
                  textAlign: "center", fontFamily: RACING, fontSize: 22,
                  color: BRAND_TEAL_DK, outline: "none", flexShrink: 0,
                }}
                placeholder="?"
              />
            ) : (
              <div key={i} style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>{step1[i]}</div>
            )
          )}
        </div>

        {phase === "step1" && (
          <button onClick={chkS1} disabled={!userStep1.every(v => v !== null)}
            className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
            style={{ background: userStep1.every(v => v !== null) ? bg : "#ccc", fontFamily: RACING, fontSize: "1rem" }}>
            Check ✓
          </button>
        )}
        {phase === "step1" && step1Feedback.some(f => f === false) && (
          <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
            Some wrong! (0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4)
          </div>
        )}
      </div>

      {(phase === "step2" || phase === "step3" || phase === "done") && (
        <div className="bg-white rounded-3xl p-5 border-2 shadow-lg"
          style={{ borderColor: phase === "done" ? "#22c55e" : bg }}>

          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
              style={{ background: phase === "done" ? "#22c55e" : bg, fontFamily: RACING }}>
              {phase === "done" ? "✓" : "2"}
            </div>
            <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
              {phase === "step2" ? "Tap cells that need +5" : "Add +5 to highlighted cells"}
            </span>
          </div>

          <p className="text-xs mb-3" style={{ color: dark, fontFamily: OUTFIT }}>
            {phase === "step2"
              ? "Tap the cell to the RIGHT of each odd digit. If the last digit is odd, also tap the extra decimal cell."
              : "🟡 cells get +5 added — type the result for each highlighted cell."}
          </p>

          <div className="text-center text-xs mb-1" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
            Original number
          </div>
          <div className="flex gap-2 justify-center items-center mb-3">
            {step2Cells.map((_, i) => {
              const isExtra = i === digits.length;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {isExtra && <div style={decDot}>.</div>}
                  <div style={{
                    ...baseCell(`${bg}44`, light),
                    color: BRAND_TEAL_DK,
                    fontSize: isExtra ? 18 : 22,
                    borderStyle: isExtra ? "dashed" : "solid",
                    opacity: 0.65,
                  }}>
                    {isExtra ? "·" : digits[i]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs mb-1" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
            {phase === "step2" ? "Tap to highlight (cells that need +5)" : "Highlighted cells (step 1 values)"}
          </div>
          <div className="flex gap-2 justify-center items-center">
            {step2Cells.map((v, i) => {
              const isExtra = i === digits.length;
              const shouldHighlight = isRightHighlight(i);
              const isHighlighted = phase === "step2" ? userOddSel[i] : shouldHighlight;
              const borderCol = isHighlighted ? "#f59e0b" : phase === "step2" ? `${bg}66` : `${bg}44`;
              const bgCol = isHighlighted ? "#fef3c7" : isExtra ? `${bg}08` : light;
              const txtCol = isHighlighted ? "#b45309" : BRAND_TEAL_DK;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {isExtra && <div style={decDot}>.</div>}
                  <div
                    onClick={() => phase === "step2" && toggleHighlight(i)}
                    style={{
                      width: 52, height: 52, borderRadius: 14,
                      border: `3px ${isExtra ? "dashed" : "solid"} ${borderCol}`,
                      background: bgCol,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: RACING, fontSize: isExtra ? 18 : 22,
                      color: txtCol,
                      cursor: phase === "step2" ? "pointer" : "default",
                      transition: "all 0.2s",
                      boxShadow: isHighlighted ? "0 0 0 3px #fbbf2444" : "none",
                      flexShrink: 0,
                    }}>
                    {isExtra ? "·" : step1[i]}
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "step2" && (
            <>
              <button onClick={checkStep2}
                className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
                style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>
                Confirm ✓
              </button>
              {step2Feedback === "wrong" && (
                <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
                  ❌ Not quite — tap the cells to the RIGHT of odd digits!
                </div>
              )}
              {step2Feedback === "correct" && (
                <div className="text-green-500 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
                  ✅ Correct!
                </div>
              )}
            </>
          )}

          {(phase === "step3" || phase === "done") && (
            <>
              <div className="mt-4 pt-4" style={{ borderTop: `2px dashed ${bg}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
                    style={{ background: phase === "done" ? "#22c55e" : bg, fontFamily: RACING }}>
                    {phase === "done" ? "✓" : "3"}
                  </div>
                  <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
                    Add +5 to each 🟡 cell — type the result
                  </span>
                </div>

                <div className="text-center text-xs mb-3" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
                  ↓ type result after +5 for each 🟡 cell ↓
                </div>

                <div className="flex gap-2 justify-center items-center">
                  {digits.map((_, i) => {
                    const shouldHighlight = isRightHighlight(i);
                    const exp = getExpectedS3(i);
                    const fb = step3Feedback[i] ?? null;

                    if (phase === "done") {
                      return (
                        <div key={i} style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>
                          {exp}
                        </div>
                      );
                    }

                    if (!shouldHighlight) {
                      return (
                        <div key={i} style={{ ...baseCell(`${bg}44`, light), color: BRAND_TEAL_DK, opacity: 0.7 }}>
                          {step1[i]}
                        </div>
                      );
                    }

                    return (
                      <input key={i} type="number"
                        value={step3Vals[i] ?? ""}
                        onChange={e => upS3(i, e.target.value)}
                        style={{
                          width: 52, height: 52, borderRadius: 14,
                          border: `3px solid ${fb === null ? "#f59e0b" : fb ? "#22c55e" : "#ef4444"}`,
                          background: fb === true ? "#f0fdf4" : fb === false ? "#fef2f2" : "#fef3c7",
                          textAlign: "center", fontFamily: RACING, fontSize: 22,
                          color: fb === true ? "#15803d" : fb === false ? "#dc2626" : "#b45309",
                          outline: "none", flexShrink: 0,
                        }}
                        placeholder="?"
                      />
                    );
                  })}

                  {lastIsOdd && (
                    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      <div style={decDot}>.</div>
                      {phase === "done" ? (
                        <div style={{ ...baseCell("#22c55e", "#f0fdf4"), width: 40, fontSize: 18, color: "#15803d" }}>5</div>
                      ) : (
                        <input type="text" inputMode="numeric" maxLength={1} pattern="[0-9]*"
                          value={step3DecimalVal}
                          onChange={e => setStep3DecimalVal(e.target.value)}
                          style={{
                            width: 44, height: 52, borderRadius: 14,
                            border: `3px dashed ${step3DecimalFb === null ? "#f59e0b" : step3DecimalFb ? "#22c55e" : "#ef4444"}`,
                            background: step3DecimalFb === true ? "#f0fdf4" : step3DecimalFb === false ? "#fef2f2" : "#fef3c7",
                            textAlign: "center", fontFamily: RACING, fontSize: 20,
                            color: step3DecimalFb === true ? "#15803d" : step3DecimalFb === false ? "#dc2626" : "#b45309",
                            outline: "none", flexShrink: 0,
                          }}
                          placeholder="?"
                        />
                      )}
                    </div>
                  )}
                </div>

                {phase === "step3" && (
                  <>
                    <button onClick={chkS3} disabled={!allS3Filled}
                      className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
                      style={{
                        background: allS3Filled ? bg : "#ccc",
                        cursor: allS3Filled ? "pointer" : "not-allowed",
                        fontFamily: RACING, fontSize: "1rem",
                      }}>
                      Check ✓
                    </button>
                    {step3AnyWrong && (
                      <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
                        ❌ Not right — each 🟡 cell = its value + 5 (drop tens if ≥10)
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="bg-white rounded-3xl p-6 border-2 shadow-xl text-center" style={{ borderColor: "#22c55e" }}>
          <div className="text-5xl mb-2">🎉</div>
          <div className="text-2xl text-green-600 mb-1" style={{ fontFamily: RACING }}>
            ½ of {practiceNum} = <span style={{ color: bg }}>{answer}</span>
          </div>
          <div className="mb-4" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
            {Number.isInteger(answer) ? "Great work!" : "Notice the .5 — last digit was odd!"}
          </div>
          <div className="flex gap-3">
            <button onClick={onNewNumber} className="flex-1 rounded-2xl py-3 text-white active:scale-95"
              style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>
              🔄 New Number
            </button>
            <button onClick={onComplete} className="flex-1 rounded-2xl py-3 active:scale-95 border-2"
              style={{ borderColor: bg, color: bg, background: light, fontFamily: RACING, fontSize: "1rem" }}>
              ⚡ Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Square Step Row ──────────────────────────────────────────────────────────
function SquareStepRow({ label, sublabel, placeholder, value, onChange, onSubmit, feedback, locked, confirmed, confirmedValue, wide=false, bg, dark }:
  { label:string; sublabel?:string; placeholder:string; value:string; onChange:(v:string)=>void; onSubmit:()=>void;
    feedback:"correct"|"wrong"|null; locked:boolean; confirmed:boolean; confirmedValue?:string|number; wide?:boolean; bg:string; dark:string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(()=>{ if(!locked&&!confirmed) ref.current?.focus(); },[locked,confirmed]);
  const bc=feedback==="correct"?"#22c55e":feedback==="wrong"?"#ef4444":locked?"#d1d5db":bg;
  const bgc=feedback==="correct"?"#f0fdf4":feedback==="wrong"?"#fef2f2":locked?"#f9fafb":"#fff";
  const tc=feedback==="correct"?"#15803d":feedback==="wrong"?"#dc2626":locked?"#9ca3af":bg;
  const btnBg=locked?"#aaa":bg;
  return (
    <div className="flex items-center gap-3 w-full">
      <button className="flex-1 rounded-2xl py-4 px-4 text-left text-white shadow-md"
        style={{background:btnBg,opacity:locked?0.5:1,cursor:"default",minHeight:64}}>
        <div style={{fontFamily:RACING,fontSize:"0.95rem",lineHeight:1.2}}>{label}</div>
        {sublabel&&<div style={{fontFamily:OUTFIT,fontSize:"0.75rem",fontWeight:600,opacity:0.8,marginTop:2}}>{sublabel}</div>}
      </button>
      <div className={`${wide?"min-w-[90px]":"w-16"} flex-shrink-0`}>
        {confirmed
          ? <div className="rounded-2xl flex items-center justify-center h-14"
            style={{border:`3px solid ${bg}`,background:"#f0fdf4",color:"#15803d",minWidth:wide?90:64,fontFamily:RACING,fontSize:"1.3rem"}}>
            {confirmedValue}
          </div>
          : <input ref={ref} type="text" inputMode="numeric"  pattern="[0-9]*" value={value} onChange={e=>!locked&&onChange(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!locked&&onSubmit()} disabled={locked} placeholder={placeholder}
            className="rounded-2xl h-14 text-center outline-none transition-all w-full"
            style={{border:`3px solid ${bc}`,background:bgc,color:tc,minWidth:wide?90:64,fontFamily:RACING,fontSize:"1.3rem"}} />
        }
      </div>
    </div>
  );
}

// ─── Square Step View ─────────────────────────────────────────────────────────
function SquareStepView({ squareNum, onTryAnother, onRangeSelect, onGoSettings, bg, light, dark }:
  { squareNum:number; onTryAnother:()=>void; onRangeSelect:(r:string)=>void; onGoSettings:()=>void; bg:string; light:string; dark:string }) {

  type RangeKey = "26-50"|"51-75"|"76-100"|"101-125";

  const getRange=(n:number):RangeKey=>{
    if(n>=26&&n<=50)  return "26-50";
    if(n>=51&&n<=75)  return "51-75";
    if(n>=76&&n<=100) return "76-100";
    return "101-125";
  };
  const range=getRange(squareNum);

  const computeValues=(n:number,r:RangeKey)=>{
    if(r === "26-50") {
      const x = 50 - n;
      const AB = 25 - x;
      const CD = x * x;
      return { x, AB, CD, base: 50, dir: "below" as const, method: "50-x" };
    }
    if(r === "51-75") {
      const x = n - 50;
      const AB = 25 + x;
      const CD = x * x;
      return { x, AB, CD, base: 50, dir: "above" as const, method: "50+x" };
    }
    if(r === "76-100") {
      const x = 100 - n;
      const AB = 100 - (2 * x);
      const CD = x * x;
      return { x, AB, CD, base: 100, dir: "below" as const, method: "100-2x" };
    }
    if(r === "101-125") {
      const x = n - 100;
      const AB = 100 + (2 * x);
      const CD = x * x;
      return { x, AB, CD, base: 100, dir: "above" as const, method: "100+2x" };
    }
    return { x: 0, AB: 0, CD: 0, base: 50, dir: "below" as const, method: "50-x" };
  };

  const { x, AB, CD, base, dir, method } = computeValues(squareNum, range);
  const hasMultiDigitCD = String(CD).length >= 3;
  const cdCarry = hasMultiDigitCD ? Math.floor(CD / 100) : 0;
  const newCD = hasMultiDigitCD ? CD % 100 : CD;
  const newAB = AB + cdCarry;
  const finalAnswer = newAB * 100 + newCD;
  const formattedCD = String(newCD).padStart(2, "0");

  const step1Label = dir === "below" ? `${base} − ${squareNum}` : `${squareNum} − ${base}`;
  
  const step2Label = (() => {
    if (method === "50-x") return `25 − ${x}`;
    if (method === "50+x") return `25 + ${x}`;
    if (method === "100-2x") return `100 − (2×${x}) = ${AB}`;
    if (method === "100+2x") return `100 + (2×${x}) = ${AB}`;
    return "";
  })();

  const getSteps = () => {
    const base_ = [
      { id: "step1", label: "Step 1", sublabel: `${squareNum} is ${dir} ${base} by (${step1Label})`, placeholder: "x", wide: false, displayVal: x },
      { id: "step2", label: "Step 2", sublabel: `${step2Label} = AB`, placeholder: "AB", wide: false, displayVal: AB },
      { id: "step3", label: "Step 3", sublabel: `${x}² = CD`, placeholder: "CD", wide: false, displayVal: CD },
    ];
    
    if (hasMultiDigitCD) {
      return [
        ...base_,
        { id: "step3_1", label: "Step 3.1", sublabel: `Split CD (${CD}) → keep last 2 digits = ${formattedCD}, carry ${cdCarry}`, placeholder: "newCD", wide: false, displayVal: newCD },
        { id: "step3_2", label: "Step 3.2", sublabel: `AB + carry = ${AB} + ${cdCarry} = ${newAB}`, placeholder: "newAB", wide: false, displayVal: newAB },
        { id: "answer", label: "Answer", sublabel: `${newAB} × 100 + ${formattedCD} = ${finalAnswer}`, placeholder: "Ans", wide: true, displayVal: finalAnswer },
      ];
    }
    return [
      ...base_,
      { id: "answer", label: "Answer", sublabel: `AB × 100 + CD = ${AB} × 100 + ${CD} = ${finalAnswer}`, placeholder: "Ans", wide: true, displayVal: finalAnswer },
    ];
  };

  const steps = getSteps();
  const correctAnswers = steps.map(s => s.displayVal);

  const [currentStep, setCurrentStep] = useState(0);
  const [vals, setVals] = useState<string[]>(steps.map(() => ""));
  const [feedbacks, setFeedbacks] = useState<("correct" | "wrong" | null)[]>(steps.map(() => null));
  const [confirmed, setConfirmed] = useState<boolean[]>(steps.map(() => false));

  const handleChange = (i: number, v: string) => { const n = [...vals]; n[i] = v; setVals(n); };
  const handleSubmit = (i: number) => {
    const uv = parseFloat(vals[i]), exp = correctAnswers[i];
    if (Math.abs(uv - exp) < 0.01) {
      const nf = [...feedbacks]; nf[i] = "correct"; setFeedbacks(nf);
      setTimeout(() => { const nc = [...confirmed]; nc[i] = true; setConfirmed([...nc]); if (i < steps.length - 1) setCurrentStep(i + 1); else setCurrentStep(steps.length); }, 600);
    } else {
      const nf = [...feedbacks]; nf[i] = "wrong"; setFeedbacks(nf);
      setTimeout(() => { const nf2 = [...feedbacks]; nf2[i] = null; setFeedbacks(nf2); }, 1000);
    }
  };

  const isDone = currentStep === steps.length;
  const rangeBadge: Record<RangeKey, string> = { "26-50": "#26a9e0", "51-75": "#84c341", "76-100": "#d93b60", "101-125": "#7784c1" };
  const fmtVal = (val: number, id: string) => id === "step3_1" && hasMultiDigitCD ? String(val).padStart(2, "0") : val;

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="grid grid-cols-4 gap-1 bg-white rounded-2xl p-1 shadow border-2" style={{ borderColor: `${bg}33` }}>
        {(["26-50", "51-75", "76-100", "101-125"] as RangeKey[]).map(r => (
          <button key={r} onClick={() => onRangeSelect(r)} className="rounded-xl py-2 transition-all active:scale-95"
            style={{ background: range === r ? bg : "transparent", color: range === r ? "#fff" : bg, fontFamily: RACING, fontSize: "0.7rem", opacity: range === r ? 1 : 0.55, cursor: "pointer" }}
            title={`Practice ${r} range`}>{r}</button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-500"
            style={{ background: i < currentStep ? bg : i === currentStep ? `${bg}88` : "#e0f2f1" }} />
        ))}
      </div>
      <div className="text-center">
        <div className="inline-block rounded-full px-3 py-1 text-xs text-white mb-2"
          style={{ background: rangeBadge[range], fontFamily: OUTFIT, fontWeight: 700 }}>
          {range} range · {method === "50-x" ? "50−x" : method === "50+x" ? "50+x" : method === "100-2x" ? "100−2x" : "100+2x"} method
        </div>
        <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.85rem", color: dark }}>Find Square of</div>
        <div style={{ fontFamily: RACING, fontSize: "3.5rem", color: bg }}>{squareNum}</div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border-2 p-5 space-y-3" style={{ borderColor: isDone ? "#22c55e" : bg }}>
        {steps.map((s, i) => (
          <div key={s.id} className="space-y-2">
            <SquareStepRow label={s.label} sublabel={s.sublabel} placeholder={s.placeholder} value={vals[i]}
              onChange={v => handleChange(i, v)} onSubmit={() => handleSubmit(i)} feedback={feedbacks[i]}
              locked={currentStep < i} confirmed={confirmed[i]}
              confirmedValue={confirmed[i] ? fmtVal(s.displayVal as number, s.id) : undefined}
              wide={s.wide} bg={bg} dark={dark} />
            {currentStep === i && !confirmed[i] && !isDone && (
              <button onClick={() => handleSubmit(i)} disabled={!vals[i]} className="w-full rounded-2xl py-2.5 text-white active:scale-95 transition-all"
                style={{ background: vals[i] ? bg : "#ccc", cursor: vals[i] ? "pointer" : "not-allowed", fontFamily: RACING, fontSize: "1rem" }}>
                Check ✓
              </button>
            )}
            {feedbacks[i] === "wrong" && !confirmed[i] && (
              <div className="text-red-400 text-center text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>❌ Not quite — try again!</div>
            )}
          </div>
        ))}
        {isDone && (
          <div className="text-center pt-2">
            <div className="text-3xl mb-1">🎉</div>
            <div style={{ fontFamily: RACING, fontSize: "1.4rem", color: bg }}>{squareNum}² = {finalAnswer}</div>
            <div className="mt-1 mb-4" style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.85rem", color: dark }}>
              {hasMultiDigitCD ? `CD=${CD} → carry ${cdCarry} → newAB=${newAB}, newCD=${formattedCD} → ${newAB}×100+${formattedCD}=${finalAnswer}` : `AB=${AB} | CD=${CD} → ${AB}×100+${CD}=${finalAnswer}`}
            </div>
            <div className="flex gap-3">
              <button onClick={onTryAnother} className="flex-1 rounded-2xl py-3 text-white active:scale-95"
                style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>🔄 Try Another</button>
              <button onClick={onGoSettings} className="flex-1 rounded-2xl py-3 active:scale-95 border-2"
                style={{ borderColor: bg, color: bg, background: light, fontFamily: RACING, fontSize: "1rem" }}>⚡ Challenge</button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl p-4 border-2" style={{ borderColor: `${bg}33` }}>
        <p className="mb-2 text-sm text-center" style={{ color: bg, fontFamily: RACING }}>📐 Formula Reference</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ["26–50", "x=50−n, AB=25−x, CD=x²"],
            ["51–75", "x=n−50, AB=25+x, CD=x²"],
            ["76–100", "x=100−n, AB=100−2x, CD=x²"],
            ["101–125", "x=n−100, AB=100+2x, CD=x²"]
          ].map(([t, d]) => {
            const active = range === t.replace("–", "-");
            return (
              <div key={t} className="rounded-xl p-2 text-center" style={{ background: active ? `${bg}18` : light, border: active ? `1.5px solid ${bg}` : "none" }}>
                <div style={{ fontFamily: RACING, color: BRAND_TEAL_DK, fontSize: "0.85rem" }}>{t}</div>
                <div style={{ fontFamily: OUTFIT, color: dark, fontWeight: 600 }}>{d}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl p-2 text-center text-xs" style={{ background: `${bg}10`, border: `1px dashed ${bg}` }}>
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: dark }}>Always: Answer = (AB + carry) × 100 + (CD % 100)</span>
        </div>
        {hasMultiDigitCD && (
          <div className="mt-2 rounded-xl p-2 text-center text-xs" style={{ background: `${bg}10`, border: `1px solid ${bg}` }}>
            <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: dark }}>💡 When CD ≥ 100: carry = floor(CD/100), newCD = CD % 100</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Friends Practice (Tabbed) ────────────────────────────────────────
type FriendBase = 9 | 10 | 100;

interface FriendPair { a: number; b: number; }
interface TabScore { score: number; total: number; }

function generateFriendPair(base: FriendBase): FriendPair {
  if (base === 9)  { const a = rand(1, 8);  return { a, b: 9   - a }; }
  if (base === 10) { const a = rand(1, 9);  return { a, b: 10  - a }; }
  const a = rand(11, 89); return { a, b: 100 - a };
}

// ─── FriendPanel — compact single-screen layout ───────────────────────────────
function FriendPanel({
  base, score, total, onScore, bg, light, dark,
}: {
  base: FriendBase; score: number; total: number;
  onScore: (correct: boolean) => void;
  bg: string; light: string; dark: string;
}) {
  const [pair, setPair] = useState<FriendPair>(() => generateFriendPair(base));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // For base 100 - separate inputs for tens and units
  const [tensFriend, setTensFriend] = useState("");
  const [unitsFriend, setUnitsFriend] = useState("");
  const unitsInputRef = useRef<HTMLInputElement>(null);

  // For other bases - single input
  const [singleAnswer, setSingleAnswer] = useState("");

  const next = useCallback(() => {
    setPair(generateFriendPair(base));
    setFeedback(null);
    setTensFriend("");
    setUnitsFriend("");
    setSingleAnswer("");
  }, [base]);

  const handleSubmitFor100 = () => {
    if (feedback) return;
    const tens = parseInt(tensFriend);
    const units = parseInt(unitsFriend);
    const combined = parseInt(`${tens}${units}`);
    const correct = combined === pair.b;
    setFeedback(correct ? "correct" : "wrong");
    onScore(correct);
    setTimeout(next, 1500);
  };

  const handleSubmitForOthers = () => {
    if (feedback) return;
    const correct = parseInt(singleAnswer) === pair.b;
    setFeedback(correct ? "correct" : "wrong");
    onScore(correct);
    setTimeout(next, 1500);
  };

  const borderCol =
    feedback === "correct" ? "#22c55e" :
    feedback === "wrong"   ? "#ef4444" : bg;

  // ── Base 100: two-input layout ──────────────────────────────────────────────
  if (base === 100) {
    const tensDigit = Math.floor(pair.a / 10);
    const unitsDigit = pair.a % 10;
    const expectedTensFriend = 9 - tensDigit;
    const expectedUnitsFriend = 10 - unitsDigit;
    const expectedCombined = expectedTensFriend * 10 + expectedUnitsFriend;

    return (
      <div style={{
        background: "#fff",
        border: `3px solid ${borderCol}`,
        borderRadius: 20,
        padding: "14px 16px 12px",
        transition: "border-color 0.25s ease",
        width: "100%",
      }}>
        {/* Question row */}
        <div style={{
          background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
          borderRadius: 14, padding: "12px 10px 10px", textAlign: "center",
          transition: "background 0.3s ease", marginBottom: 12,
        }}>
          <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.78rem", color: dark, margin: "0 0 2px" }}>
            Friend of
          </p>
          <div style={{ fontFamily: RACING, fontSize: "2.8rem", color: bg, lineHeight: 1 }}>{pair.a}</div>
          <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.72rem", color: `${bg}99`, marginTop: 2 }}>
            {pair.a} + ? = {base}
          </div>
        </div>

        {/* Hint row */}
        <div style={{
          display: "flex", gap: 6, justifyContent: "center", marginBottom: 10,
          fontFamily: OUTFIT, fontSize: "0.7rem", fontWeight: 600, color: dark,
        }}>
          <span style={{ background: `${bg}15`, borderRadius: 8, padding: "3px 8px" }}>
            Tens {tensDigit} → 9's friend
          </span>
          <span style={{ background: `${bg}15`, borderRadius: 8, padding: "3px 8px" }}>
            Units {unitsDigit} → 10's friend
          </span>
        </div>

        {/* Two inputs */}
        {!feedback ? (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
            <input
              type="text" inputMode="numeric" maxLength={1} pattern="[0-9]*"
              value={tensFriend} onChange={e => setTensFriend(e.target.value)} placeholder="?"
              onKeyDown={e => { if (e.key === "Enter" && tensFriend) unitsInputRef.current?.focus(); }}
              style={{
                width: 60, height: 60, textAlign: "center", fontSize: "1.8rem",
                fontFamily: RACING, border: `3px solid ${bg}`, borderRadius: 14,
                outline: "none", color: bg, background: "#fff",
              }}
            />
            <span style={{ fontSize: "1.6rem", fontFamily: RACING, color: bg }}>&</span>
            <input
              ref={unitsInputRef}
              type="text" inputMode="numeric" maxLength={1} pattern="[0-9]*"
              value={unitsFriend} onChange={e => setUnitsFriend(e.target.value)} placeholder="?"
              onKeyDown={e => { if (e.key === "Enter" && unitsFriend) handleSubmitFor100(); }}
              style={{
                width: 60, height: 60, textAlign: "center", fontSize: "1.8rem",
                fontFamily: RACING, border: `3px solid ${bg}`, borderRadius: 14,
                outline: "none", color: bg, background: "#fff",
              }}
            />
          </div>
        ) : (
          <div style={{
            padding: "8px 10px", borderRadius: 12, marginBottom: 12, textAlign: "center",
            background: feedback === "correct" ? "#f0fdf4" : "#fef2f2",
            fontFamily: OUTFIT, fontWeight: 800, fontSize: "0.85rem",
            color: feedback === "correct" ? "#16a34a" : "#dc2626",
          }}>
            {feedback === "correct"
              ? `✅ ${pair.a} + ${expectedCombined} = ${base}`
              : `❌ It's ${expectedCombined}! (${tensDigit}→${expectedTensFriend}, ${unitsDigit}→${expectedUnitsFriend})`}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {!feedback && (
            <>
              <button
                onClick={handleSubmitFor100}
                disabled={!tensFriend || !unitsFriend}
                style={{
                  flex: 1, background: (tensFriend && unitsFriend) ? bg : "#ccc",
                  border: "none", borderRadius: 12, padding: "11px",
                  fontFamily: RACING, fontSize: "1rem", color: "#fff",
                  cursor: (tensFriend && unitsFriend) ? "pointer" : "not-allowed",
                }}>
                Check ✓
              </button>
              <button onClick={next} style={{
                background: "transparent", border: `1.5px dashed ${bg}55`,
                borderRadius: 12, padding: "11px 14px",
                fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.78rem",
                color: `${bg}99`, cursor: "pointer",
              }}>Skip →</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Base 9 / 10: single-input layout ───────────────────────────────────────
  return (
    <div style={{
      background: "#fff",
      border: `3px solid ${borderCol}`,
      borderRadius: 20,
      padding: "14px 16px 12px",
      transition: "border-color 0.25s ease",
      width: "100%",
    }}>
      {/* Question */}
      <div style={{
        background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
        borderRadius: 14, padding: "12px 10px 10px", textAlign: "center",
        transition: "background 0.3s ease", marginBottom: 12,
      }}>
        <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.78rem", color: dark, margin: "0 0 2px" }}>
          Friend of
        </p>
        <div style={{ fontFamily: RACING, fontSize: "2.8rem", color: bg, lineHeight: 1 }}>{pair.a}</div>
        <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.72rem", color: `${bg}99`, marginTop: 2 }}>
          {pair.a} + ? = {base}
        </div>
      </div>

      {/* Input or feedback */}
      {!feedback ? (
        <input
          type="text" inputMode="numeric" maxLength={3} pattern="[0-9]*"
          value={singleAnswer}
          onChange={e => setSingleAnswer(e.target.value)}
          onKeyPress={e => e.key === "Enter" && singleAnswer && handleSubmitForOthers()}
          placeholder="?"
          style={{
            display: "block", width: "100%", maxWidth: 120, margin: "0 auto 12px",
            padding: "10px", textAlign: "center", fontSize: "1.8rem",
            fontFamily: RACING, border: `3px solid ${bg}`, borderRadius: 14,
            outline: "none", color: bg,
          }}
        />
      ) : (
        <div style={{
          padding: "8px 10px", borderRadius: 12, marginBottom: 12, textAlign: "center",
          background: feedback === "correct" ? "#f0fdf4" : "#fef2f2",
          fontFamily: OUTFIT, fontWeight: 800, fontSize: "0.85rem",
          color: feedback === "correct" ? "#16a34a" : "#dc2626",
        }}>
          {feedback === "correct"
            ? `✅ ${pair.a} + ${pair.b} = ${base}`
            : `❌ It's ${pair.b}! (${pair.a} + ${pair.b} = ${base})`}
        </div>
      )}

      {/* Buttons */}
      {!feedback && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmitForOthers}
            disabled={!singleAnswer}
            style={{
              flex: 1, background: singleAnswer ? bg : "#ccc",
              border: "none", borderRadius: 12, padding: "11px",
              fontFamily: RACING, fontSize: "1rem", color: "#fff",
              cursor: singleAnswer ? "pointer" : "not-allowed",
            }}>
            Check ✓
          </button>
          <button onClick={next} style={{
            background: "transparent", border: `1.5px dashed ${bg}55`,
            borderRadius: 12, padding: "11px 14px",
            fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.78rem",
            color: `${bg}99`, cursor: "pointer",
          }}>Skip →</button>
        </div>
      )}
    </div>
  );
}

// ─── FriendsPractice — full single-screen layout ──────────────────────────────
function FriendsPractice({ bg, light, dark, onStartChallenge }: {
  bg: string; light: string; dark: string; onStartChallenge: () => void;
}) {
  const bases: FriendBase[] = [9, 10, 100];

  const [activeTab, setActiveTab] = useState<FriendBase>(9);
  const [tabScores, setTabScores] = useState<Record<FriendBase, TabScore>>({
    9:   { score: 0, total: 0 },
    10:  { score: 0, total: 0 },
    100: { score: 0, total: 0 },
  });

  const handleScore = (base: FriendBase, correct: boolean) => {
    setTabScores(prev => ({
      ...prev,
      [base]: {
        score: prev[base].score + (correct ? 1 : 0),
        total: prev[base].total + 1,
      },
    }));
  };

  return (
    // Use flex-col with height:100% so children can fill the available space
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 420, margin: "0 auto" }}>

      {/* Reference strip — compact single-line */}
      <div style={{
        background: "#fff", borderRadius: 14, overflow: "hidden",
        border: `2px solid ${bg}33`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}>
        <div style={{ background: bg, padding: "5px 12px", textAlign: "center", fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.72rem", color: "#fff" }}>
          📖 Friends Reference
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${bg}22` }}>
          {[
            { base: 9,   pairs: "1+8, 2+7, 3+6, 4+5" },
            { base: 10,  pairs: "1+9, 2+8, 3+7, 4+6, 5+5" },
            { base: 100, pairs: "e.g. 37+63, 45+55" },
          ].map(({ base, pairs }) => (
            <div key={base} style={{ padding: "6px 4px", textAlign: "center", borderRight: `1px solid ${bg}11` }}>
              <div style={{ fontFamily: RACING, color: bg, fontSize: "0.9rem" }}>of {base}</div>
              <div style={{ fontFamily: OUTFIT, fontSize: "0.6rem", fontWeight: 600, color: dark, marginTop: 1, lineHeight: 1.3 }}>{pairs}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab pill bar */}
      <div style={{
        display: "flex", gap: 5,
        background: light, borderRadius: 99, padding: 4,
        boxShadow: `0 2px 8px ${bg}22`, flexShrink: 0,
      }}>
        {bases.map(base => {
          const sc = tabScores[base];
          const isActive = activeTab === base;
          return (
            <button
              key={base}
              onClick={() => setActiveTab(base)}
              style={{
                flex: 1, border: "none", cursor: "pointer",
                fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.82rem",
                padding: "8px 4px 5px", borderRadius: 99,
                transition: "all 0.22s ease",
                background: isActive ? bg : "transparent",
                color: isActive ? "#fff" : dark,
                boxShadow: isActive ? `0 4px 14px ${bg}44` : "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              }}
            >
              <span>of {base}</span>
              <span style={{ fontFamily: RACING, fontSize: "0.65rem", color: isActive ? "#fff99c" : `${dark}88`, lineHeight: 1 }}>
                {sc.score}/{sc.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel — flex-1 so it takes remaining height */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <FriendPanel
          key={activeTab}
          base={activeTab}
          score={tabScores[activeTab].score}
          total={tabScores[activeTab].total}
          onScore={(correct) => handleScore(activeTab, correct)}
          bg={bg} light={light} dark={dark}
        />
      </div>

      {/* CTA */}
      <button
        onClick={onStartChallenge}
        style={{
          width: "100%", borderRadius: 20, padding: "13px",
          background: bg, color: "#fff",
          fontFamily: RACING, fontSize: "1.15rem",
          border: "none", cursor: "pointer",
          boxShadow: `0 6px 20px ${bg}44`,
          flexShrink: 0,
        }}>
        ⚡ Start Timed Challenge
      </button>
    </div>
  );
}

function useCloudImage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check(); window.addEventListener('resize',check);
    return ()=>window.removeEventListener('resize',check);
  },[]);
  return isMobile?CLOUDS_MOBILE_IMG:CLOUDS_IMG;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpeedMathsPage() {
  const [gameState,       setGameState]       = useState<GameState>("splash");
  const [challenge,       setChallenge]       = useState<Challenge>("Addition");
  const [answerMode,      setAnswerMode]      = useState<AnswerMode>("Choose Option");
  const [timeMode,        setTimeMode]        = useState<TimeMode>("timed");
  const [secondsPerQ,     setSecondsPerQ]     = useState(10);
  const [question,        setQuestion]        = useState<Question|null>(null);
  const [score,           setScore]           = useState(0);
  const [streak,          setStreak]          = useState(0);
  const [feedback,        setFeedback]        = useState<"correct"|"incorrect"|null>(null);
  const [typedAnswer,     setTypedAnswer]     = useState("");
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [questionsLeft,   setQuestionsLeft]   = useState(10);
  const [totalTime,       setTotalTime]       = useState(0);
  const [halfPracticeNum, setHalfPracticeNum] = useState(()=>generateHalfPracticeNum());
  const [half3StepKey,    setHalf3StepKey]    = useState(0);
  const [squareNum,       setSquareNum]       = useState(()=>rand(11,59));
  const [squareViewKey,   setSquareViewKey]   = useState(0);
  const [minA,            setMinA]            = useState(0);
  const [maxA,            setMaxA]            = useState(10);
  const [heroVisible,     setHeroVisible]     = useState(false);
  const [cardsVisible,    setCardsVisible]    = useState(false);
  const [decoVisible,     setDecoVisible]     = useState(false);
  const [cloudsVisible,   setCloudsVisible]   = useState(false);
  const [rocketVisible,   setRocketVisible]   = useState(false);

  const timerRef      = useRef<ReturnType<typeof setInterval>|null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const isTransitioning = useRef(false);
  
  const stopTimers = useCallback(() => {
    if(timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if(totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
  }, []);

  const cloudImage = useCloudImage();

  useEffect(()=>{ const t=setTimeout(()=>setGameState("menu"),2200); return ()=>clearTimeout(t); },[]);

  useEffect(()=>{
    if(gameState==="menu"){
      setHeroVisible(false);setCardsVisible(false);setDecoVisible(false);setCloudsVisible(false);setRocketVisible(false);
      const t1=setTimeout(()=>setHeroVisible(true),100);
      const t2=setTimeout(()=>setRocketVisible(true),200);
      const t3=setTimeout(()=>setCardsVisible(true),320);
      const t4=setTimeout(()=>setDecoVisible(true),560);
      const t5=setTimeout(()=>setCloudsVisible(true),700);
      return ()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5);};
    }
  },[gameState]);

  const beginGame = useCallback(() => {
    stopTimers();
    isTransitioning.current = false;
    setFeedback(null);
    
    const q = challenge === "Multiplication" && maxA > 0
      ? generateMultiplicationRangeQuestion(minA, maxA)
      : generateQuestion(challenge);
    setQuestion(q);
    setScore(0);
    setStreak(0);
    setTypedAnswer("");
    setQuestionsLeft(10);
    setTotalTime(0);
    setGameState("playing");
    
    if(timeMode === "timed") {
      setTimeLeft(secondsPerQ);
      
      const startNewTimer = (remainingSeconds: number) => {
        if(timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        let remaining = remainingSeconds;
        timerRef.current = setInterval(() => {
          if(isTransitioning.current) return;
          
          remaining--;
          setTimeLeft(remaining);
          
          if(remaining <= 0) {
            if(timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            if(!isTransitioning.current && !feedback) {
              isTransitioning.current = true;
              setFeedback("incorrect");
              setStreak(0);
              
              setTimeout(() => {
                isTransitioning.current = false;
                setFeedback(null);
                const nextQuestion = challenge === "Multiplication" && maxA > 0
                  ? generateMultiplicationRangeQuestion(minA, maxA)
                  : generateQuestion(challenge);
                setQuestion(nextQuestion);
                setTypedAnswer("");
                setTimeLeft(secondsPerQ);
                startNewTimer(secondsPerQ);
              }, 1400);
            }
          }
        }, 1000);
      };
      
      startNewTimer(secondsPerQ);
    } else {
      totalTimerRef.current = setInterval(() => {
        setTotalTime(t => t + 1);
      }, 1000);
    }
  }, [challenge, timeMode, secondsPerQ, stopTimers, feedback, minA, maxA]);

  const handleAnswer = useCallback((chosen: number | string) => {
    if (!question || feedback || isTransitioning.current) return;
    
    const userAns = typeof chosen === "string" ? parseFloat(chosen) : chosen;
    const correct = Math.abs(userAns - question.answer) < 0.01;
    
    setFeedback(correct ? "correct" : "incorrect");
    isTransitioning.current = true;
    
    if(correct) {
      setScore(s => s + 10 + streak * 2);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    
    if(timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const startNextQuestionTimer = (remainingSeconds: number) => {
      if(timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      let remaining = remainingSeconds;
      timerRef.current = setInterval(() => {
        if(isTransitioning.current) return;
        
        remaining--;
        setTimeLeft(remaining);
        
        if(remaining <= 0) {
          if(timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          if(!isTransitioning.current && !feedback) {
            isTransitioning.current = true;
            setFeedback("incorrect");
            setStreak(0);
            
            setTimeout(() => {
              isTransitioning.current = false;
              setFeedback(null);
              const nextQuestion = challenge === "Multiplication" && maxA > 0
                ? generateMultiplicationRangeQuestion(minA, maxA)
                : generateQuestion(challenge);
              setQuestion(nextQuestion);
              setTypedAnswer("");
              setTimeLeft(secondsPerQ);
              startNextQuestionTimer(secondsPerQ);
            }, 1400);
          }
        }
      }, 1000);
    };
    
    setTimeout(() => {
      if(timeMode === "fixed-questions") {
        const next = questionsLeft - 1;
        if(next <= 0) {
          stopTimers();
          setGameState("result");
          return;
        }
        setQuestionsLeft(next);
        const nextQuestion = challenge === "Multiplication" && maxA > 0
          ? generateMultiplicationRangeQuestion(minA, maxA)
          : generateQuestion(challenge);
        setQuestion(nextQuestion);
        setFeedback(null);
        setTypedAnswer("");
        isTransitioning.current = false;
      } else {
        const nextQuestion = challenge === "Multiplication" && maxA > 0
          ? generateMultiplicationRangeQuestion(minA, maxA)
          : generateQuestion(challenge);
        setQuestion(nextQuestion);
        setFeedback(null);
        setTypedAnswer("");
        isTransitioning.current = false;
        setTimeLeft(secondsPerQ);
        startNextQuestionTimer(secondsPerQ);
      }
    }, 1200);
  }, [question, feedback, streak, timeMode, questionsLeft, challenge, secondsPerQ, stopTimers, minA, maxA]);

  useEffect(() => {
    return () => stopTimers();
  }, [stopTimers]);

  const gameBg="linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)";
  const CHALLENGES=Object.keys(CHALLENGE_COLORS) as Challenge[];

  // ─── SPLASH ───────────────────────────────────────────────────────────────
  if(gameState==="splash") return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{background:`linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 60%,${BRAND_TEAL_DK} 100%)`}}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{animation:"rocketBob 2s ease-in-out infinite",width:120}}>
        <img src={ROCKET_IMG} alt="Rocket" style={{width:"100%",height:"auto",filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.35))"}} />
      </div>
      <h1 className="text-white mt-5" style={{fontFamily:RACING,fontSize:"clamp(2.5rem,8vw,4rem)",textShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"fadeUp 0.7s ease 0.3s both"}}>Logicology</h1>
      <p className="text-white/75 text-xl mt-1" style={{fontFamily:RACING,animation:"fadeUp 0.7s ease 0.5s both"}}>Speed Maths ⚡</p>
      <p className="text-white/45 mt-4 text-sm" style={{fontFamily:OUTFIT,animation:"fadeUp 0.7s ease 0.7s both"}}>Loading your brain workout…</p>
    </div>
  );

  // ─── MENU ─────────────────────────────────────────────────────────────────
  if(gameState==="menu") return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col overflow-hidden" style={{fontFamily:OUTFIT}}>
        <style>{GLOBAL_STYLES}</style>

        {/* ── DESKTOP ── */}
        <section className="relative overflow-hidden md:flex hidden flex-col items-center bg-[#1b4552]"
          style={{minHeight:"88vh",backgroundImage:`linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)`,backgroundSize:`80px 80px,80px 80px,20px 20px,20px 20px`,backgroundPosition:`-1px -1px,-1px -1px,-1px -1px,-1px -1px`}}>
          {([{t:"4²",s:{top:"9%",left:"5%",fontSize:30}},{t:"√",s:{top:"19%",left:"11%",fontSize:38}},{t:"1",s:{top:"53%",left:"4%",fontSize:52}},{t:"Z",s:{top:"69%",left:"8%",fontSize:26}},{t:"α²",s:{top:"8%",right:"7%",fontSize:28}},{t:"4²",s:{top:"23%",right:"4%",fontSize:34}},{t:"⬡",s:{top:"40%",left:"2%",fontSize:26}},{t:"⬡",s:{top:"14%",right:"19%",fontSize:20}},{t:"≈",s:{top:"59%",right:"5%",fontSize:30}}] as {t:string;s:React.CSSProperties}[]).map((sym,i)=>(
            <span key={i} aria-hidden className="absolute select-none pointer-events-none font-bold text-white" style={{...sym.s,opacity:0.18}}>{sym.t}</span>
          ))}
          <div className="absolute right-4 md:right-10 pointer-events-none z-20"
            style={{top:"clamp(80px,15vh,120px)",opacity:rocketVisible?1:0,animation:rocketVisible?"rocketFlyUp 1.2s cubic-bezier(0.34,1.2,0.55,1) forwards, rocketHover 3s ease-in-out 1.2s infinite":"none",width:"clamp(130px,18vw,240px)"}}>
            <img src={ROCKET_IMG} alt="Rocket" style={{width:"100%",height:"auto",filter:"drop-shadow(0 12px 28px rgba(0,0,0,0.38))"}} />
          </div>
          <div className="relative z-10 text-center pt-14 md:pt-16 px-6"
            style={{opacity:heroVisible?1:0,transform:heroVisible?"translateY(0)":"translateY(-28px)",transition:"opacity 0.75s ease 0.1s,transform 0.75s ease 0.1s"}}>
            <h1 className="text-white leading-none mb-2" style={{fontFamily:RACING,fontSize:"clamp(2.8rem,7.5vw,5.2rem)",textShadow:"0 4px 18px rgba(0,0,0,0.28)"}}>Speed Maths</h1>
            <p className="text-white/80 text-lg md:text-xl" style={{fontFamily:OUTFIT,fontWeight:600}}>Choose your Challenge!</p>
          </div>
          <div className="relative z-30 w-full max-w-6xl mx-auto px-4 md:px-8 pb-6 mt-10 md:mt-12">
            <div className="grid grid-cols-6 gap-5">
              {CHALLENGES.map((ch,i)=>(<MenuChallengeCard key={ch} ch={ch} index={i} visible={cardsVisible} onClick={()=>{setChallenge(ch);setGameState("mode-select");}} />))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-10"
            style={{height:"90vh",maxHeight:"90%",opacity:cloudsVisible?1:0,transform:cloudsVisible?"translateY(0)":"translateY(80px)",transition:"opacity 0.9s ease 0.7s,transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s"}}>
            <img src={CLOUDS_IMG} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center bottom",display:"block"}} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none select-none flex items-end justify-between px-6 md:px-16 pb-4">
            {[{src:"PENCIL@2x.png",h:100,rot:"rotate(-20deg)"},{src:"SCALE@2x.png",h:80,rot:"rotate(-8deg)"},{src:"BOOKS@2x.png",h:100,rot:""},{src:"CALCULATOR@2x.png",h:90,rot:""}].map(({src,h,rot},idx)=>(
              <div key={src} style={{opacity:decoVisible?1:0,transform:decoVisible?rot||"translateY(0)":`${rot} translateY(60px)`,transition:`opacity 0.6s ease ${0.9+idx*0.1}s,transform 0.6s ease ${0.9+idx*0.1}s`}}>
                <img src={`/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/${src}`} alt="" style={{width:"auto",height:`${h}px`,objectFit:"contain",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}} />
              </div>
            ))}
          </div>
        </section>

        {/* ── MOBILE ── */}
        <section className="relative md:hidden flex flex-col bg-[#1b4552] overflow-hidden"
          style={{height:"100svh",minHeight:"100vh",backgroundImage:`linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px)`,backgroundSize:`60px 60px,60px 60px`}}>
          {([{t:"4²",s:{top:"6%",left:"4%",fontSize:22}},{t:"√",s:{top:"15%",left:"9%",fontSize:28}},{t:"α²",s:{top:"5%",right:"22%",fontSize:20}},{t:"≈",s:{top:"45%",right:"3%",fontSize:22}}] as {t:string;s:React.CSSProperties}[]).map((sym,i)=>(
            <span key={i} aria-hidden className="absolute select-none pointer-events-none font-bold text-white" style={{...sym.s,opacity:0.18}}>{sym.t}</span>
          ))}
          <div className="absolute pointer-events-none z-20"
            style={{top:"8%",right:"4%",opacity:rocketVisible?1:0,animation:rocketVisible?"rocketFlyUp 1.2s cubic-bezier(0.34,1.2,0.55,1) forwards, rocketHover 3s ease-in-out 1.2s infinite":"none",width:"18vw",maxWidth:80}}>
            <img src={ROCKET_IMG} alt="Rocket" style={{width:"100%",height:"auto",filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.38))"}} />
          </div>
          <div className="relative z-10 text-center pt-6 px-4 flex-shrink-0"
            style={{opacity:heroVisible?1:0,transform:heroVisible?"translateY(0)":"translateY(-20px)",transition:"opacity 0.75s ease 0.1s,transform 0.75s ease 0.1s"}}>
            <h1 className="text-white leading-none mb-0.5" style={{fontFamily:RACING,fontSize:"clamp(1.9rem,7vw,2.6rem)",textShadow:"0 4px 18px rgba(0,0,0,0.28)"}}>Speed Maths</h1>
            <p className="text-white/75 text-sm" style={{fontFamily:OUTFIT,fontWeight:600}}>Choose your Challenge!</p>
          </div>
          <div className="relative z-30 flex-1 flex items-start justify-center px-3 pt-2 pb-0">
            <div className="flex flex-col gap-2 w-[44%]" style={{marginTop:"2%"}}>
              {([CHALLENGES[0],CHALLENGES[2],CHALLENGES[3]] as Challenge[]).map((ch,i)=>(
                <MenuChallengeCard key={ch} ch={ch} index={i} visible={cardsVisible} compact onClick={()=>{setChallenge(ch);setGameState("mode-select");}} />
              ))}
            </div>
            <div className="w-[4%]" />
            <div className="flex flex-col gap-2 w-[44%]" style={{marginTop:"12%"}}>
              {([CHALLENGES[1],CHALLENGES[4],CHALLENGES[5]] as Challenge[]).map((ch,i)=>(
                <MenuChallengeCard key={ch} ch={ch} index={i+3} visible={cardsVisible} compact onClick={()=>{setChallenge(ch);setGameState("mode-select");}} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-10"
            style={{height:"90%",opacity:cloudsVisible?1:0,transform:cloudsVisible?"translateY(0)":"translateY(60px)",transition:"opacity 0.9s ease 0.7s,transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s"}}>
            <img src={CLOUDS_MOBILE_IMG} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center bottom",display:"block"}} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none select-none flex items-end justify-between px-2 pb-1">
            <div style={{opacity:decoVisible?1:0,transform:decoVisible?"rotate(-20deg) translateY(0)":"rotate(-20deg) translateY(40px)",transition:"opacity 0.6s ease 1.0s,transform 0.6s ease 1.0s",transformOrigin:"bottom left"}}>
              <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/PENCIL@2x.png" alt="Pencil" style={{height:"80px",width:"auto",objectFit:"contain",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}} />
            </div>
            <div className="flex flex-col items-end">
              <div style={{opacity:decoVisible?1:0,transform:decoVisible?"translateY(0)":"translateY(30px)",transition:"opacity 0.6s ease 1.1s,transform 0.6s ease 1.1s",fontFamily:RACING,fontSize:"clamp(1.4rem,6vw,2rem)",color:"#ffffff",textShadow:"0 2px 8px rgba(0,0,0,0.4)",marginBottom:"2px",paddingRight:"6px"}}>96×7</div>
              <div style={{opacity:decoVisible?1:0,transform:decoVisible?"translateY(0)":"translateY(40px)",transition:"opacity 0.6s ease 1.2s,transform 0.6s ease 1.2s"}}>
                <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CALCULATOR@2x.png" alt="Calculator" style={{height:"80px",width:"auto",objectFit:"contain",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  // ─── MODE-SELECT ──────────────────────────────────────────────────────────
  if(gameState==="mode-select"){
    const{bg,light,dark}=CHALLENGE_COLORS[challenge];
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{background:gameBg,fontFamily:OUTFIT}}>
        <style>{GLOBAL_STYLES}</style><Stars count={6}/>
        <h2 className="text-3xl mb-6" style={{color:bg,fontFamily:RACING}}>{challenge}</h2>
        {challenge==="Half"&&(<>
          <p className="mb-4 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={()=>setGameState("half-table")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:light,border:`3px solid ${bg}`,color:bg,fontFamily:RACING}}>📋 Table Practice</button>
            <button onClick={()=>{setHalfPracticeNum(generateHalfPracticeNum());setHalf3StepKey(k=>k+1);setGameState("half-3step");}} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:light,border:`3px solid ${bg}`,color:bg,fontFamily:RACING}}>🪜 3-Step Practice</button>
            <button onClick={()=>setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:bg,color:"#fff",fontFamily:RACING}}>⚡ Challenge</button>
          </div>
        </>)}
        {challenge==="Squares"&&(<>
          <p className="mb-4 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={()=>{setSquareNum(rand(11,59));setSquareViewKey(k=>k+1);setGameState("square-step");}} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:light,border:`3px solid ${bg}`,color:bg,fontFamily:RACING}}>🪜 Step Practice</button>
            <button onClick={()=>setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:bg,color:"#fff",fontFamily:RACING}}>⚡ Challenge</button>
          </div>
        </>)}
        {challenge==="Friends"&&(<>
          <p className="mb-4 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={()=>setGameState("friends-practice")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:light,border:`3px solid ${bg}`,color:bg,fontFamily:RACING}}>🤝 Friends Practice</button>
            <button onClick={()=>setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:bg,color:"#fff",fontFamily:RACING}}>⚡ Challenge</button>
          </div>
        </>)}
        {challenge==="Multiplication"&&(<>
          <p className="mb-4 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={()=>setGameState("mult-table-select")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:light,border:`3px solid ${bg}`,color:bg,fontFamily:RACING}}>📊 Table Challenge</button>
            <button onClick={()=>setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:bg,color:"#fff",fontFamily:RACING}}>⚡ Quick Mix</button>
          </div>
        </>)}
        {challenge!=="Half"&&challenge!=="Squares"&&challenge!=="Friends"&&challenge!=="Multiplication"&&(<>
          <p className="mb-4 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>How do you want to answer?</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={()=>{setAnswerMode("Choose Option");setGameState("settings");}} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:answerMode==="Choose Option"?bg:light,border:`3px solid ${bg}`,color:answerMode==="Choose Option"?"#fff":bg,fontFamily:RACING}}>🎯 Choose Option</button>
            <button onClick={()=>{setAnswerMode("Type Answer");setGameState("settings");}} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95" style={{background:answerMode==="Type Answer"?bg:light,border:`3px solid ${bg}`,color:answerMode==="Type Answer"?"#fff":bg,fontFamily:RACING}}>⌨️ Type Answer</button>
          </div>
        </>)}
      </div>
    );
  }

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  if(gameState==="settings"){
    const{bg,light,dark}=CHALLENGE_COLORS[challenge];
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{background:gameBg,fontFamily:OUTFIT}}>
        <style>{GLOBAL_STYLES}</style><Stars count={5}/>
        <h2 className="text-3xl mb-1" style={{color:bg,fontFamily:RACING}}>{challenge}</h2>
        <p className="mb-6" style={{color:dark,fontFamily:OUTFIT,fontWeight:600}}>{answerMode}</p>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6 border-2" style={{borderColor:bg}}>
          <p className="text-lg mb-4" style={{color:BRAND_TEAL_DK,fontFamily:RACING}}>⏱ Choose Time Mode</p>
          <div className="flex gap-3 mb-4">
            <button onClick={()=>setTimeMode("timed")} className="flex-1 rounded-2xl py-3 transition" style={{background:timeMode==="timed"?bg:light,color:timeMode==="timed"?"#fff":bg,border:`2px solid ${bg}`,fontFamily:RACING}}>Per Question</button>
            <button onClick={()=>setTimeMode("fixed-questions")} className="flex-1 rounded-2xl py-3 transition" style={{background:timeMode==="fixed-questions"?bg:light,color:timeMode==="fixed-questions"?"#fff":bg,border:`2px solid ${bg}`,fontFamily:RACING}}>10 Questions</button>
          </div>
          {timeMode==="timed"&&(<>
            <p className="mb-2" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Seconds per Question</p>
            <input type="range" min={2} max={30} value={secondsPerQ} onChange={e=>setSecondsPerQ(Number(e.target.value))} className="w-full mb-1" style={{accentColor:bg}}/>
            <div className="flex justify-between text-sm mb-2" style={{color:`${bg}99`,fontFamily:OUTFIT}}><span>2s</span><span>30s</span></div>
            <div className="text-center" style={{color:bg,fontFamily:RACING,fontSize:"1.6rem"}}>{secondsPerQ} seconds per question</div>
          </>)}
          {timeMode==="fixed-questions"&&<p className="text-center" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>Solve 10 questions as fast as you can! ⚡</p>}
        </div>
        <button onClick={beginGame} className="w-full max-w-sm rounded-3xl py-5 shadow-xl active:scale-95 hover:scale-105" style={{background:bg,color:"#fff",fontFamily:RACING,fontSize:"1.6rem"}}>🚀 Start!</button>
      </div>
    );
  }

  // ─── HALF TABLE ───────────────────────────────────────────────────────────
  if(gameState==="half-table"){
    const{bg,light,dark}=CHALLENGE_COLORS["Half"];
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{background:gameBg}}>
  <style>{GLOBAL_STYLES}</style><Stars count={6}/>
  <div className="w-full max-w-sm flex justify-start mb-2">
    <button onClick={()=>setGameState("mode-select")} style={{color:dark,fontFamily:RACING,fontSize:"1.1rem",background:"none",border:"none",cursor:"pointer"}}>✕ Exit</button>
  </div>
  <div style={{fontFamily:RACING,fontSize:"2.5rem",color:bg}}>½</div>
  <h2 className="text-3xl mb-1" style={{color:bg,fontFamily:RACING}}>Half Table</h2>
        <p className="mb-6" style={{color:dark,fontFamily:OUTFIT,fontWeight:600}}>What is half of each digit?</p>
        <HalfTableQuiz bg={bg} light={light} dark={dark} onNext={()=>{setHalfPracticeNum(generateHalfPracticeNum());setHalf3StepKey(k=>k+1);setGameState("half-3step");}} />
      </div>
    );
  }

  // ─── HALF 3-STEP ──────────────────────────────────────────────────────────
  if(gameState==="half-3step"){
    const{bg,light,dark}=CHALLENGE_COLORS["Half"];
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10 overflow-y-auto" style={{background:gameBg}}>
  <style>{GLOBAL_STYLES}</style><Stars count={5}/>
  <div className="w-full max-w-sm flex justify-start mb-2">
    <button onClick={()=>setGameState("mode-select")} style={{color:dark,fontFamily:RACING,fontSize:"1.1rem",background:"none",border:"none",cursor:"pointer"}}>✕ Exit</button>
  </div>
        <h2 className="text-3xl mb-1" style={{color:bg,fontFamily:RACING}}>Half 3-Step Method</h2>
        <p className="mb-6 text-sm text-center" style={{color:dark,fontFamily:OUTFIT,fontWeight:600}}>Follow the steps to find half of the number below!</p>
        <Half3StepInteractive key={half3StepKey} practiceNum={halfPracticeNum} bg={bg} light={light} dark={dark}
          onComplete={()=>setGameState("settings")}
          onNewNumber={()=>{setHalfPracticeNum(generateHalfPracticeNum());setHalf3StepKey(k=>k+1);}} />
        <div className="w-full max-w-sm bg-white rounded-3xl p-4 border-2 mt-5" style={{borderColor:`${bg}33`}}>
          <p className="mb-2 text-sm text-center" style={{color:bg,fontFamily:RACING}}>📖 Table Half Reference</p>
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            {[0,1,2,3,4,5,6,7,8,9].map(d=>(
              <div key={d} className="rounded-lg py-1" style={{background:light,color:dark,fontFamily:RACING}}>{d}→{Math.floor(d/2)}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SQUARE STEP ──────────────────────────────────────────────────────────
  if(gameState==="square-step"){
    const{bg,light,dark}=CHALLENGE_COLORS["Squares"];
    const randInRange=(r:string)=>{
      if(r==="26-50")  return rand(26,50);
      if(r==="51-75")  return rand(51,75);
      if(r==="76-100") return rand(76,100);
      return rand(101,125);
    };
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10 overflow-y-auto" style={{background:gameBg}}>
  <style>{GLOBAL_STYLES}</style><Stars count={5}/>
  <div className="w-full max-w-sm flex justify-start mb-2">
    <button onClick={()=>setGameState("mode-select")} style={{color:dark,fontFamily:RACING,fontSize:"1.1rem",background:"none",border:"none",cursor:"pointer"}}>✕ Exit</button>
  </div>
  <div style={{fontFamily:RACING,fontSize:"2.5rem",color:bg}}>²</div>
        <h2 className="text-3xl mb-4" style={{color:bg,fontFamily:RACING}}>Square Steps</h2>
        <SquareStepView key={squareViewKey} squareNum={squareNum} bg={bg} light={light} dark={dark}
          onTryAnother={()=>{setSquareNum(rand(26,125));setSquareViewKey(k=>k+1);}}
          onRangeSelect={r=>{setSquareNum(randInRange(r));setSquareViewKey(k=>k+1);}}
          onGoSettings={()=>setGameState("settings")} />
      </div>
    );
  }

  // ─── FRIENDS PRACTICE — single-screen, no scroll ──────────────────────────
  if(gameState==="friends-practice"){
    const{bg,light,dark}=CHALLENGE_COLORS["Friends"];
    return(
      // Fixed viewport height, no overflow — everything must fit
      <div style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: gameBg,
        overflow: "hidden",
      }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={6}/>

        {/* Compact header */}
<div style={{
  display: "flex", flexDirection: "column", alignItems: "center",
  paddingTop: 16, paddingBottom: 8, flexShrink: 0, position: "relative", width: "100%",
}}>
  <button onClick={()=>setGameState("mode-select")}
    style={{position:"absolute",left:16,top:16,color:dark,fontFamily:RACING,fontSize:"1.1rem",background:"none",border:"none",cursor:"pointer"}}>
    ✕ Exit
  </button>
  <div style={{ fontFamily: RACING, fontSize: "1.8rem", color: bg, lineHeight: 1 }}>🤝</div>
          <h2 style={{ color: bg, fontFamily: RACING, fontSize: "1.6rem", margin: "2px 0 0" }}>Friends</h2>
          <p style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.75rem", margin: 0 }}>
            Pairs that add up to 9, 10, or 100!
          </p>
        </div>

        {/* Content area — fills remaining height, no scroll */}
        <div style={{
          flex: 1, minHeight: 0,
          display: "flex", flexDirection: "column",
          padding: "0 16px 16px",
          overflow: "hidden",
        }}>
          <FriendsPractice bg={bg} light={light} dark={dark} onStartChallenge={()=>setGameState("settings")} />
        </div>
      </div>
    );
  }

  // ─── MULTIPLICATION TABLE SELECT ───────────────────────────────────────────
  if(gameState==="mult-table-select"){
    const{bg,light,dark}=CHALLENGE_COLORS["Multiplication"];
    const mid = Math.floor((minA + maxA) / 2);
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{background:gameBg,fontFamily:OUTFIT}}>
        <style>{GLOBAL_STYLES}</style><Stars count={6}/>
        <h2 className="text-3xl mb-2" style={{color:bg,fontFamily:RACING}}>Multiplication Challenge</h2>
        <p className="mb-6 text-lg" style={{color:dark,fontFamily:OUTFIT,fontWeight:600}}>Set your number range</p>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 mb-6 border-2" style={{borderColor:bg}}>
          <p style={{color:bg,fontFamily:RACING,fontSize:"1.2rem",marginBottom:"8px"}}>Range (0 – 29)</p>
          <div className="flex gap-2 mb-3">
            <input type="number" min={0} max={29} value={minA}
              onChange={e=>setMinA(Math.min(maxA - 1, Math.max(0, Number(e.target.value))))}
              className="flex-1 px-3 py-2 rounded-lg border-2 text-center"
              style={{borderColor:bg, fontFamily:RACING, fontSize:"1.2rem", color:bg}} />
            <span style={{fontFamily:RACING,fontSize:"1.4rem",color:bg,display:"flex",alignItems:"center"}}>–</span>
            <input type="number" min={0} max={29} value={maxA}
              onChange={e=>setMaxA(Math.max(minA + 1, Math.min(29, Number(e.target.value))))}
              className="flex-1 px-3 py-2 rounded-lg border-2 text-center"
              style={{borderColor:bg, fontFamily:RACING, fontSize:"1.2rem", color:bg}} />
          </div>
          <input type="range" min={0} max={29} value={minA}
            onChange={e=>setMinA(Math.min(maxA - 1, Number(e.target.value)))}
            className="w-full mb-2" style={{accentColor:bg}}/>
          <input type="range" min={0} max={29} value={maxA}
            onChange={e=>setMaxA(Math.max(minA + 1, Number(e.target.value)))}
            className="w-full mb-4" style={{accentColor:bg}}/>

          {/* Visual split preview */}
          <div className="rounded-2xl p-4 text-center" style={{background:light, border:`2px dashed ${bg}55`}}>
            <p style={{fontFamily:OUTFIT, fontWeight:700, color:dark, fontSize:"0.85rem", marginBottom:6}}>
              How A × B will be picked:
            </p>
            <div className="flex gap-3 justify-center items-center">
              <div className="rounded-xl px-4 py-2" style={{background:bg, color:"#fff"}}>
                <div style={{fontFamily:OUTFIT, fontSize:"0.7rem", fontWeight:600, opacity:0.85}}>A (lower half)</div>
                <div style={{fontFamily:RACING, fontSize:"1.1rem"}}>{minA} – {mid}</div>
              </div>
              <span style={{fontFamily:RACING, fontSize:"1.4rem", color:bg}}>×</span>
              <div className="rounded-xl px-4 py-2" style={{background:bg, color:"#fff"}}>
                <div style={{fontFamily:OUTFIT, fontSize:"0.7rem", fontWeight:600, opacity:0.85}}>B (upper half)</div>
                <div style={{fontFamily:RACING, fontSize:"1.1rem"}}>{mid} – {maxA}</div>
              </div>
            </div>
          </div>

          <p style={{color:dark,fontFamily:OUTFIT,fontSize:"0.85rem",marginTop:"12px",textAlign:"center"}}>
            ✓ 10 questions with A from the lower half, B from the upper half
          </p>
        </div>
        <button onClick={()=>setGameState("settings")}
          className="w-full max-w-sm rounded-3xl py-5 shadow-xl active:scale-95 hover:scale-105"
          style={{background:bg,color:"#fff",fontFamily:RACING,fontSize:"1.6rem"}}>
          🚀 Start Challenge!
        </button>
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if(gameState==="result"){
    const{bg,dark}=CHALLENGE_COLORS[challenge];
    return(
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background:gameBg}}>
        <style>{GLOBAL_STYLES}</style><Stars count={12}/>
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-4xl mb-2" style={{color:bg,fontFamily:RACING}}>Well Done!</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border-2 mb-6" style={{borderColor:bg}}>
          {[{emoji:"⭐",label:"Score",value:score},{emoji:"🔥",label:"Best Streak",value:streak},
            ...(timeMode==="fixed-questions"?[{emoji:"⏱",label:"Total Time",value:`${totalTime}s`}]:[])].map(({emoji,label,value})=>(
            <div key={label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <span className="text-2xl">{emoji}</span>
              <span style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>{label}</span>
              <span style={{color:bg,fontFamily:RACING,fontSize:"1.4rem"}}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <button onClick={beginGame} className="flex-1 rounded-3xl py-4 shadow-lg active:scale-95" style={{background:bg,color:"#fff",fontFamily:RACING,fontSize:"1.2rem"}}>🔄 Again</button>
          <button onClick={()=>setGameState("menu")} className="flex-1 rounded-3xl py-4 shadow-lg active:scale-95 border-2" style={{borderColor:bg,color:bg,background:"#fff",fontFamily:RACING,fontSize:"1.2rem"}}>🏠 Menu</button>
        </div>
      </div>
    );
  }

  // ─── PLAYING ──────────────────────────────────────────────────────────────
  if(gameState==="playing"&&question){
    const{bg,light,dark}=CHALLENGE_COLORS[challenge];
    const timerPct=timeMode==="timed"?(timeLeft/secondsPerQ)*100:100;
    const feedbackBg=feedback==="correct"?"#22c55e":feedback==="incorrect"?"#ef4444":bg;
    return(
      <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8 transition-all"
        style={{background:feedback?(feedback==="correct"?"#f0fdf4":"#fef2f2"):gameBg}}>
        <style>{GLOBAL_STYLES}</style>
        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <button onClick={()=>{stopTimers();setGameState("menu");}} className="text-lg" style={{color:dark,fontFamily:RACING}}>✕</button>
          <h3 style={{color:bg,fontFamily:RACING,fontSize:"1.3rem"}}>{challenge}</h3>
          <div className="flex gap-4">
            {timeMode==="fixed-questions"&&<span style={{color:dark,fontFamily:RACING}}>⏱ {totalTime}s</span>}
            {timeMode==="timed"?<span style={{color:dark,fontFamily:RACING}}>⏱ {timeLeft}s</span>:<span style={{color:dark,fontFamily:RACING}}>{questionsLeft} left</span>}
          </div>
        </div>
        {timeMode==="timed"&&(
          <div className="w-full max-w-md h-3 rounded-full mb-4 overflow-hidden" style={{background:"#e0f2f1"}}>
            <div className="h-full rounded-full transition-all duration-1000" style={{width:`${timerPct}%`,background:timerPct>50?bg:timerPct>25?"#D8AE4F":"#E45C48"}} />
          </div>
        )}
        <ScoreBar score={score} streak={streak} dark={dark}/>
        <div className="w-full max-w-md rounded-3xl shadow-2xl p-8 mb-6 text-center relative overflow-hidden"
          style={{background:feedback?feedbackBg:light,border:`4px solid ${feedback?feedbackBg:bg}`}}>
          {feedback&&(
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={feedback==="correct"?CORRECT_IMG:WRONG_IMG} alt={feedback} style={{width:"80%",maxWidth:"300px",height:"auto",objectFit:"contain"}} />
            </div>
          )}
          <div style={{opacity:feedback?0.18:1}}>
            <p className="mb-2 text-base" style={{color:dark,fontFamily:OUTFIT,fontWeight:700}}>What is</p>
            <div style={{color:bg,fontFamily:RACING,fontSize:"clamp(3rem,12vw,5rem)",lineHeight:1.1}}>{question.display}</div>
            {feedback==="incorrect"&&<div className="mt-2 text-lg text-white" style={{fontFamily:RACING}}>Answer: {question.answer}</div>}
          </div>
        </div>
        {!feedback&&answerMode==="Choose Option"&&question.options&&(
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {question.options.map(opt=>(
              <button key={opt} onClick={()=>handleAnswer(opt)} className="rounded-3xl py-5 shadow-lg active:scale-95 hover:scale-105"
                style={{background:"#fff",border:`3px solid ${bg}`,color:bg,fontFamily:RACING,fontSize:"1.8rem"}}>{opt}</button>
            ))}
          </div>
        )}
        {!feedback&&answerMode==="Type Answer"&&(
          <div className="w-full max-w-md">
            <NumPad value={typedAnswer}
              onDigit={d=>setTypedAnswer(v=>v==="0"?d:v.includes(".")&&d==="0.5"?v:v+d)}
              onErase={()=>setTypedAnswer(v=>v.slice(0,-1))}
              onEnter={()=>handleAnswer(typedAnswer)}/>
          </div>
        )}
      </div>
    );
  }

  return null;
}