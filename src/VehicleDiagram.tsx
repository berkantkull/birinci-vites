import { Pressable, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { VehiclePart, detailedParts } from './VehiclePart';
import type { CarSection } from './carLesson';
const layouts: Record<CarSection, [string,string,number,number,number,number][]> = {
 'Kaput altı': [['battery','Akü',7,14,25,23],['fluid','Fren hidroliği deposu',64,7,25,23],['oil','Motor yağı kapağı',34,31,23,21],['dipstick','Yağ ölçüm çubuğu',43,55,18,22],['coolant','Soğutma suyu deposu',70,41,25,23],['washer','Cam suyu deposu',6,53,25,23],['hood','Kaput mandalı',34,79,28,18]],
 'Bagaj': [['latch','Bagaj açma düğmesi',35,2,28,18],['spare','Stepne',8,24,42,42],['jack','Kriko',60,26,28,23],['wrench','Bijon anahtarı',63,52,25,23],['reflector','Reflektör',10,72,26,23],['aid','İlk yardım çantası',38,73,26,23]],
 'Kokpit': [['mirror','İç dikiz aynası',36,2,26,16],['cabinLight','İç aydınlatma',70,2,22,16],['sideMirror','Dış ayna ayarı',2,27,20,17],['lights','Uzun / kısa far kolu',24,25,21,16],['signal','Sinyal kolu',4,49,21,16],['wiper','Silecek kolu',44,48,22,16],['horn','Korna',23,47,21,21],['hazard','Dörtlü ikaz',70,26,24,18],['climate','Klima ve buğu çözme düğmeleri',70,49,24,18],['gear','Vites kolu',55,76,20,22],['brake','Park freni',78,77,18,21]],
 'Göstergeler': [['speed','Hız göstergesi',5,15,42,37],['rpm','Devir göstergesi',53,15,42,37],['heat','Hararet göstergesi',4,66,24,24],['fuel','Yakıt göstergesi',29,66,24,24],['oilLamp','Yağ basıncı uyarısı',54,66,22,24],['charge','Akü şarj uyarısı',77,66,22,24]],
 'Pedallar': [['clutch','Debriyaj',8,26,25,52],['footBrake','Ayak freni',38,26,25,52],['gas','Gaz',68,26,25,52]],
 'Lastikler': []
};
function ControlSymbol({ id }: { id: string }) {
  if (detailedParts.has(id)) return <VehiclePart id={id}/>;
  return <Svg width="100%" height="100%" viewBox="0 0 80 60" accessible={false}>
    {id==='mirror' && <><Rect x="3" y="8" width="74" height="38" rx="12" fill="#ADC9D0" stroke="#26343C" strokeWidth="5" /><Path d="M8 29 H72 M25 43 L35 29 M55 43 L45 29 M40 34 V39" stroke="#D8E6E0" strokeWidth="3" fill="none" /></>}
    {id==='horn' && <><Rect x="6" y="9" width="68" height="43" rx="18" fill="#425C51" /><Path d="M24 28 H33 L44 20 V43 L33 35 H24 Z M50 25 Q58 31 50 38" fill="none" stroke="#E2E9DA" strokeWidth="3" /></>}
    {id==='hazard' && <><Rect x="10" y="5" width="60" height="50" rx="13" fill="#462F2D" /><Path d="M40 13 L60 46 H20 Z M40 25 L49 40 H31 Z" stroke="#F18B79" strokeWidth="2.5" fill="none" /></>}
  </Svg>;
}

export function VehicleDiagram({section,target,selected,reveal,onSelect}:{section:CarSection;target:string;selected?:string;reveal:boolean;onSelect:(id:string)=>void}) {
 return <View style={{width:'100%',aspectRatio:1,backgroundColor:'#DDE7DA',borderRadius:26,overflow:'hidden'}}>
  <Svg width="100%" height="100%" viewBox="0 0 360 360" accessible={false}>
   <Rect x="5" y="5" width="350" height="350" rx="40" fill="#344E43"/>
   {section==='Kaput altı' && <><Path d="M20 65 Q180 15 340 65 M20 305 H340" stroke="#819C83" strokeWidth="9" fill="none"/><Rect x="112" y="95" width="125" height="157" rx="20" fill="#63786A"/><Path d="M129 128 H219 M129 150 H219 M129 172 H219 M110 235 L78 252 M235 175 L288 176" stroke="#273D33" strokeWidth="10"/><Path d="M37 328 H322" stroke="#142C25" strokeWidth="20"/></>}
   {section==='Bagaj' && <><Path d="M20 63 H340 V320 Q180 350 20 320 Z" fill="#263C33" stroke="#789079" strokeWidth="7"/><Path d="M35 190 H325 M180 70 V322" stroke="#344E43" strokeWidth="2"/></>}
   {section==='Kokpit' && <><Path d="M0 0 H360 V81 Q180 46 0 81 Z" fill="#B8D1C1"/><Path d="M0 83 Q180 45 360 83" stroke="#839D7C" strokeWidth="5" fill="none"/><Circle cx="119" cy="219" r="67" stroke="#152C25" strokeWidth="17" fill="none"/><Path d="M53 213 H183 M119 220 V284" stroke="#152C25" strokeWidth="12"/><Rect x="244" y="85" width="100" height="160" rx="18" fill="#233C30"/></>}
   {section==='Göstergeler' && <><Rect x="9" y="36" width="342" height="303" rx="66" fill="#192E28" stroke="#7C9476" strokeWidth="6"/><Path d="M27 216 H331" stroke="#4F6955" strokeWidth="3"/></>}
   {section==='Pedallar' && <><Path d="M15 59 H345 V342 H15 Z" fill="#23382F"/><Path d="M30 315 H330 M30 333 H330" stroke="#789078" strokeWidth="3"/></>}
   {section==='Lastikler' && <><Circle cx="180" cy="180" r="125" fill="#1A2D27"/><Circle cx="180" cy="180" r="75" fill="#B6C5AC"/><Circle cx="180" cy="180" r="22" fill="#3D5546"/><Path d="M180 106 V254 M106 180 H254 M126 126 L234 234 M126 234 L234 126" stroke="#506B54" strokeWidth="12"/></>}
  </Svg>
  {layouts[section].map(([id,label,x,y,w,h])=><Pressable key={id} accessibilityRole="button" accessibilityLabel={label} disabled={selected!==undefined} accessibilityState={{disabled:selected!==undefined}} onPress={()=>onSelect(id)} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`,minHeight:44,minWidth:44,borderRadius:12,borderWidth:reveal && (id===target||id===selected)?3:0,borderColor:id===target?'#DDECAC':'#F18B79',backgroundColor:reveal&&id===target?'#DDECAC22':'transparent'}}><ControlSymbol id={id}/></Pressable>)}
 </View>;
}
