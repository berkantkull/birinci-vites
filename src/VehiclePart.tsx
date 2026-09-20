import { useId } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

// Automotive pictograms are paths rather than font glyphs, so they render alike on phones.
function Oil({ color = '#F2675F' }: { color?: string }) {
 return <G fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"><Path d="M17 27 H43 L58 20 L63 26 L47 40 H19 Z M25 26 V19 H38 M17 29 H10 V37 H19"/><Path d="M65 34 Q57 45 65 47 Q73 45 65 34" fill={color}/></G>;
}
function Lamp({ dipped = false }: { dipped?: boolean }) {
 return <G fill="none" stroke="#F0F3F3" strokeWidth="2" strokeLinecap="round"><Path d="M44 18 Q65 30 44 42 Z"/>{[20,27,34,41].map(y=><Path key={y} d={`M23 ${y+(dipped?5:0)} L38 ${y}`}/>)}</G>;
}
export function VehiclePart({ id }: { id: string }) {
 const uid=useId().replace(/:/g,'');
 const metal=`url(#${uid}metal)`, plastic=`url(#${uid}plastic)`;
 return <Svg width="100%" height="100%" viewBox="0 0 80 60" accessible={false}>
 <Defs><LinearGradient id={`${uid}plastic`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#596169"/><Stop offset="0.45" stopColor="#2B3035"/><Stop offset="1" stopColor="#11161B"/></LinearGradient><LinearGradient id={`${uid}metal`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#E7ECEF"/><Stop offset="0.5" stopColor="#8E9BA3"/><Stop offset="1" stopColor="#D2DADD"/></LinearGradient></Defs>
 {['lights','signal','wiper'].includes(id) && <>
  <Path d={id==='wiper'?'M3 37 H27 L41 30':'M77 37 H54 L40 30'} stroke="#11161B" strokeWidth="12" strokeLinecap="round"/>
  <Rect x={id==='wiper'?25:4} y="12" width="51" height="32" rx="9" fill={plastic} stroke="#929CA1" strokeWidth="1"/>
  <Path d={id==='wiper'?'M64 15 V41 M68 16 V40':'M14 15 V41 M18 15 V41'} stroke="#7B858B" strokeWidth="1"/>
  {id==='lights' && <G transform="translate(17 4) scale(.43)"><Lamp/><G transform="translate(0 30)"><Lamp dipped/></G></G>}
  {id==='signal' && <Path d="M24 24 H45 M24 24 L30 18 M24 24 L30 30 M45 35 H24 M45 35 L39 29 M45 35 L39 41" stroke="#F1F3F2" strokeWidth="2" fill="none" strokeLinejoin="round"/>}
  {id==='wiper' && <G stroke="#EFF3F5" strokeWidth="1.8" fill="none"><Path d="M34 22 Q47 13 59 22 L55 34 H38 Z M46 33 L54 22 M40 38 H52"/><Path d="M40 18 L38 14 M47 16 V11 M54 18 L57 14"/></G>}
 </>}
 {id==='oil' && <><Circle cx="40" cy="30" r="27" fill={plastic} stroke="#80888B" strokeWidth="2"/><Path d="M17 12 L12 20 M63 12 L68 20 M13 43 L20 50 M61 49 L68 42" stroke="#1A2024" strokeWidth="5"/><G transform="translate(8 7) scale(.8)"><Oil color="#EAD17B"/></G></>}
 {id==='oilLamp' && <Oil/>}
 {id==='battery' && <><Rect x="8" y="16" width="64" height="39" rx="4" fill={plastic} stroke="#7E898F"/><Rect x="10" y="12" width="60" height="9" rx="2" fill="#161D22"/><Rect x="15" y="6" width="13" height="11" rx="2" fill="#CF534A"/><Rect x="53" y="6" width="11" height="11" rx="2" fill={metal}/><Path d="M18 11 H25 M21.5 8 V14 M55 10 H62 M26 24 V30 H54 V24" stroke="#DFE5E5" strokeWidth="2" fill="none"/><Rect x="23" y="36" width="35" height="11" rx="2" fill="#D1C5A1"/><Text x="40" y="44" fontSize="7" textAnchor="middle" fill="#252D32">12 V</Text></>}
 {id==='charge' && <G stroke="#F2675F" strokeWidth="3" fill="none"><Path d="M12 18 H68 V48 H12 Z M22 18 V12 H30 V18 M51 18 V12 H59 V18 M21 31 H32 M49 31 H60 M54.5 25.5 V36.5"/></G>}
 {['coolant','washer','fluid'].includes(id) && <>
  <Path d={id==='washer'?'M21 22 L31 15 H48 L59 27 L64 53 H18 Z':id==='fluid'?'M16 20 H64 L60 51 H21 Z':'M13 29 Q13 19 27 19 H53 Q68 19 68 33 L64 53 H17 Z'} fill="#DEE0CE" stroke="#9AA79E" strokeWidth="1.5"/>
  <Path d="M21 41 H60 V49 H22 Z" fill={id==='coolant'?'#D7A39D':id==='washer'?'#82BFD0':'#C5AD70'}/>
  <Rect x="25" y="7" width="31" height="20" rx="5" fill={id==='washer'?'#318CC2':plastic} stroke={id==='washer'?'#8FD7EE':'#8F989C'}/>
  {id==='washer'?<G fill="none" stroke="white" strokeWidth="1.5"><Path d="M29 17 Q40 11 51 17 L48 23 H32 Z M40 16 V10 M34 14 L31 10 M46 14 L49 10"/></G>:id==='fluid'?<G fill="none" stroke="#F0DA8C" strokeWidth="1.5"><Circle cx="40" cy="17" r="6"/><Path d="M31 11 Q26 17 31 23 M49 11 Q54 17 49 23 M40 13 V18 M40 20 V22"/></G>:<Path d="M34 22 L40 11 L47 22 Z M40 15 V18 M40 20 V21" stroke="#F0DA8C" strokeWidth="1.5" fill="none"/>}
  <Path d="M57 32 H64 M57 38 H64" stroke="#64756E" strokeWidth="1.5"/>
 </>}
 {id==='sideMirror' && <><Rect x="15" y="3" width="50" height="54" rx="10" fill={plastic} stroke="#7A858A"/><Text x="25" y="15" fontSize="8" fill="white">L</Text><Text x="52" y="15" fontSize="8" fill="white">R</Text><Circle cx="40" cy="35" r="16" fill="#262D32" stroke="#859398"/><Path d="M40 22 L37 27 H43 Z M40 48 L37 43 H43 Z M27 35 L32 32 V38 Z M53 35 L48 32 V38 Z" fill="#EEF1EF"/></>}
 {id==='climate' && <><Rect x="2" y="6" width="76" height="48" rx="8" fill={plastic} stroke="#77868B"/><Circle cx="21" cy="29" r="12" fill="#161E24" stroke="#9BA9AF" strokeWidth="2"/><Path d="M12 22 A11 11 0 0 1 20 18" stroke="#69BFE8" strokeWidth="3" fill="none"/><Path d="M23 18 A11 11 0 0 1 31 26" stroke="#EB786C" strokeWidth="3" fill="none"/><Path d="M21 29 V22" stroke="white" strokeWidth="2"/><Text x="53" y="23" fontSize="10" fill="white" textAnchor="middle">A/C</Text><Path d="M40 36 Q53 28 67 36 L64 46 H43 Z M47 42 V35 M54 41 V33 M61 42 V35 M45 37 L47 34 L49 37 M52 35 L54 32 L56 35 M59 37 L61 34 L63 37" fill="none" stroke="#F2D195" strokeWidth="1.2"/></>}
 {id==='cabinLight' && <><Rect x="7" y="8" width="66" height="44" rx="10" fill={metal}/><Rect x="13" y="13" width="54" height="22" rx="5" fill="#FFF1C7"/>{[19,27,35,43,51,59].map(x=><Path key={x} d={`M${x} 15 V33`} stroke="#DBCCA4"/>)}<Rect x="29" y="39" width="22" height="8" rx="3" fill="#353E44"/></>}
 {['speed','rpm'].includes(id) && <><Circle cx="40" cy="30" r="28" fill="#10191F" stroke={metal} strokeWidth="2"/>{Array.from({length:21},(_,i)=>{const a=(140+i*13)*Math.PI/180;return <Path key={i} d={`M${40+23*Math.cos(a)} ${30+23*Math.sin(a)} L${40+ (i%5===0?18:21)*Math.cos(a)} ${30+(i%5===0?18:21)*Math.sin(a)}`} stroke={id==='rpm'&&i>16?'#EF695E':'#DBE5E8'} strokeWidth={i%5===0?1.5:1}/>;})}{[0,1,2,3,4].map((v)=>{const a=(140+v*65)*Math.PI/180;return <Text key={v} x={40+16*Math.cos(a)} y={32+16*Math.sin(a)} fontSize="5" fill="#F1F4F5" textAnchor="middle">{id==='speed'?v*50:v*2}</Text>;})}<Path d="M40 30 L28 14" stroke="#EF705E" strokeWidth="2"/><Circle cx="40" cy="30" r="3" fill={metal}/><Text x="40" y="44" fontSize="6" fill="#EDF2F3" textAnchor="middle">{id==='speed'?'km/h':'×1000 rpm'}</Text></>}
 {['fuel','heat'].includes(id) && <><Rect x="5" y="7" width="70" height="48" rx="10" fill="#121C22"/><Path d="M15 24 Q40 4 65 24" stroke="#A8B9BE" strokeWidth="2" fill="none"/><Path d="M40 30 L49 18" stroke="#F07360" strokeWidth="2"/><Text x="13" y="33" fontSize="7" fill="white">{id==='fuel'?'E':'C'}</Text><Text x="61" y="33" fontSize="7" fill={id==='heat'?'#FF8375':'white'}>{id==='fuel'?'F':'H'}</Text>{id==='fuel'?<Path d="M31 48 V34 H44 V48 M29 48 H46 M34 36 H41 V41 H34 Z M44 38 H48 V46 Q53 49 53 43 V35 L49 31 M50 32 L53 35" stroke="#E7ECEC" strokeWidth="1.5" fill="none"/>:<G stroke="#E7ECEC" strokeWidth="1.5" fill="none"><Path d="M37 44 V33 Q40 29 42 33 V44 M43 35 H47 M43 39 H47 M27 49 Q31 46 35 49 T43 49 T51 49"/><Circle cx="40" cy="44" r="3"/></G>}</>}
 {id==='hood' && <>
  <Path d="M9 14 H71 L67 49 H13 Z" fill={metal} stroke="#66747C"/>
  <Rect x="29" y="9" width="22" height="30" rx="6" fill="#141C22"/>
  <Path d="M35 7 V23 Q35 31 43 31 H49" fill="none" stroke="#AFBCC2" strokeWidth="5"/>
  <Path d="M42 32 L64 24 Q71 23 72 29 V35 L47 43 Z" fill={plastic} stroke="#9CA9AD"/>
  <Circle cx="39" cy="37" r="4" fill={metal}/>
  {[20,60].map(x=><G key={x}><Circle cx={x} cy="43" r="3" fill="#53636C"/><Path d={`M${x-2} 43 H${x+2}`} stroke="#C4CFD2"/></G>)}
 </>}
 {id==='latch' && <><Rect x="4" y="11" width="72" height="39" rx="12" fill={metal}/><Rect x="10" y="17" width="60" height="27" rx="8" fill="#121A20"/><Rect x="19" y="21" width="42" height="18" rx="5" fill={plastic} stroke="#65727A"/><Path d="M29 33 V29 L35 25 H45 L51 29 V33 Z M45 25 L51 20 M28 34 H52" stroke="#E2E9EB" strokeWidth="1.5" fill="none"/></>}
 {id==='brake' && <>
  <Path d="M6 48 Q15 38 35 42 L49 53 H9 Z" fill="#131C22" stroke="#718087"/>
  <Path d="M19 47 L31 30 L46 22" stroke={metal} strokeWidth="9" strokeLinejoin="round"/>
  <Path d="M32 28 L60 9 Q65 6 69 12 L72 18 Q73 22 68 25 L42 40 Q36 41 32 35 Z" fill={plastic} stroke="#87959B"/>
  <Path d="M39 29 L63 13" stroke="#8D969B" strokeWidth="1.5"/>
  <Path d="M38 36 L65 21" stroke="#68777E" strokeWidth="1" strokeDasharray="2 2"/>
  <Path d="M67 9 L72 6 Q75 5 77 9 L78 13 L72 17" fill={metal} stroke="#9BA8AE"/>
  <Circle cx="22" cy="46" r="4" fill="#7D8B93"/><Circle cx="22" cy="46" r="2" fill="#242E35"/>
 </>}
 {id==='gear' && <><Path d="M16 57 L22 43 L36 35 H47 L62 57 Z" fill={plastic} stroke="#69767E"/><Path d="M27 54 L37 39 M40 54 V39 M53 54 L45 39" stroke="#68747A" fill="none"/><Path d="M40 28 V42" stroke={metal} strokeWidth="8"/><Rect x="19" y="2" width="42" height="35" rx="17" fill={plastic} stroke="#A9B6BB" strokeWidth="2"/><Path d="M28 13 V26 M40 13 V26 M52 13 V26 M28 19 H52" stroke="#EFF3F4" strokeWidth="1.5"/><Text x="40" y="11" fontSize="7" fill="white" textAnchor="middle">1 3 5</Text><Text x="40" y="33" fontSize="7" fill="white" textAnchor="middle">2 4 R</Text></>}
 {id==='dipstick' && <><Path d="M40 24 V54" stroke={metal} strokeWidth="4"/><Path d="M37 45 H43 M37 49 H43 M37 53 H43" stroke="#596972"/><Rect x="25" y="3" width="30" height="24" rx="11" fill="#E9BA42" stroke="#FFE295" strokeWidth="2"/><Rect x="32" y="9" width="16" height="12" rx="5" fill="#293A36"/><Path d="M35 28 H45" stroke="#A88B39" strokeWidth="4"/></>}
 {['gas','footBrake','clutch'].includes(id) && <><Path d={id==='gas'?'M44 0 L39 22':'M48 0 L40 23'} stroke={metal} strokeWidth="7"/><Rect x={id==='gas'?28:15} y="17" width={id==='gas'?25:50} height="40" rx="5" fill={plastic} stroke="#8B989F" strokeWidth="2"/>{[24,31,38,45,52].map(y=><Path key={y} d={id==='gas'?`M33 ${y} H48`:`M21 ${y} H59`} stroke="#0B1319" strokeWidth="3"/>)}<Path d={id==='gas'?'M30 22 V51':'M18 22 V51'} stroke="#B0BABD" strokeWidth="1"/></>}
 {id==='spare' && <><Circle cx="40" cy="30" r="29" fill="#10181D" stroke="#69747A"/><Circle cx="40" cy="30" r="25" fill="none" stroke="#344047" strokeWidth="2"/>{Array.from({length:20},(_,i)=><Path key={i} d="M38 2 L41 6" stroke="#788187" strokeWidth="1" transform={`rotate(${i*18} 40 30)`}/>)}<Circle cx="40" cy="30" r="19" fill={metal}/>{Array.from({length:8},(_,i)=><Rect key={i} x="37" y="14" width="6" height="8" rx="3" fill="#26333B" transform={`rotate(${i*45} 40 30)`}/>)}<Circle cx="40" cy="30" r="6" fill="#414E56"/>{Array.from({length:5},(_,i)=><Circle key={i} cx="40" cy="26" r="1" fill="#D5DEE0" transform={`rotate(${i*72} 40 30)`}/>)}</>}
 {id==='jack' && <><Path d="M23 53 H58 L62 57 H18 Z M30 4 H50 V10 H30 Z" fill={metal}/><Path d="M40 11 L65 31 L40 51 L15 31 Z" fill="none" stroke="#131C22" strokeWidth="8"/><Path d="M40 11 L65 31 L40 51 L15 31 Z" fill="none" stroke={metal} strokeWidth="4"/><Path d="M10 31 H69" stroke="#D4DDE0" strokeWidth="3"/><Path d="M68 31 H73 V44 H77" fill="none" stroke="#8A9BA4" strokeWidth="3"/>{[15,40,65].map(x=><Circle key={x} cx={x} cy={x===40?11:31} r="3" fill="#899BA3" stroke="#202D35"/>)}</>}
 {id==='wrench' && <><Path d="M16 52 L49 19 Q51 17 55 20 L64 29" stroke="#25313A" strokeWidth="9" fill="none" strokeLinejoin="round"/><Path d="M16 52 L49 19 Q51 17 55 20 L64 29" stroke={metal} strokeWidth="6" fill="none" strokeLinejoin="round"/><Path d="M58 30 L66 22 L74 30 L66 38 Z" fill={metal} stroke="#8D9BA4"/><Path d="M64 29 L67 27 L71 30 L67 34 Z" fill="#293740"/></>}
 {id==='reflector' && <><Path d="M9 55 H71 M25 50 L18 57 M55 50 L62 57" stroke={metal} strokeWidth="3"/><Path d="M40 5 L70 50 H10 Z" fill="none" stroke="#8E292A" strokeWidth="8" strokeLinejoin="round"/><Path d="M40 5 L70 50 H10 Z" fill="none" stroke="#F06554" strokeWidth="4" strokeLinejoin="round"/><Path d="M40 13 L62 46 H18 Z" fill="none" stroke="#FFC19B" strokeWidth="1" strokeDasharray="2 2"/></>}
 {id==='aid' && <><Path d="M28 15 V6 H52 V15" fill="none" stroke="#C8D2D5" strokeWidth="5"/><Rect x="7" y="14" width="66" height="41" rx="8" fill="#ECEEE7" stroke="#ABB6B7" strokeWidth="2"/><Path d="M10 24 H70 M15 17 V22 M65 17 V22" stroke="#B6C1C2" strokeWidth="2"/><Rect x="18" y="20" width="6" height="8" rx="1" fill={metal}/><Rect x="56" y="20" width="6" height="8" rx="1" fill={metal}/><Path d="M40 31 V48 M31.5 39.5 H48.5" stroke="#CB5955" strokeWidth="6"/></>}
 </Svg>;
}

export const detailedParts = new Set(['lights','signal','wiper','oil','oilLamp','battery','charge','coolant','washer','fluid','sideMirror','climate','cabinLight','speed','rpm','fuel','heat','hood','latch','brake','gear','dipstick','gas','footBrake','clutch','spare','jack','wrench','reflector','aid']);
