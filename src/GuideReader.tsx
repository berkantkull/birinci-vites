import { useEffect, useRef, useState } from 'react';
import { Image, Modal, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, colors, s } from './ui';
import { guidePages } from './guidePages';

export function GuideReader({ onClose }: { onClose: () => void }) {
  const [page,setPage] = useState(0);
  const [zoom,setZoom] = useState(1);
  const [textMode,setTextMode] = useState(false);
  const [imageError,setImageError] = useState(false);
  const {width} = useWindowDimensions();
  const vertical = useRef<ScrollView>(null);
  const horizontal = useRef<ScrollView>(null);
  const current = guidePages[page];
  const pageWidth = Math.min(width,900)*zoom;
  useEffect(()=>{
    vertical.current?.scrollTo({y:0,animated:false});
    horizontal.current?.scrollTo({x:0,animated:false});
    setImageError(false);
  },[page,textMode]);
  return <Modal visible animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
    <SafeAreaView style={{flex:1,backgroundColor:colors.bg}}>
      <View style={{padding:12,gap:8,borderBottomWidth:1,borderColor:colors.border}}>
        <View style={s.row}><View style={{flex:1}}><Text style={[s.h2,{fontSize:18}]}>MEB 2026 kılavuzu</Text><Text style={s.small}>17 sayfa · Çevrimdışı okunabilir</Text></View><Button title="Kapat" secondary onPress={onClose} /></View>
        <View style={s.row}><Button title="A−" secondary disabled={zoom<=1 || textMode} onPress={()=>setZoom(Math.max(1,zoom-.5))} /><Text style={s.small}>{textMode ? 'Metin görünümü' : `%${Math.round(zoom*100)}`}</Text><Button title="A+" secondary disabled={zoom>=3 || textMode} onPress={()=>setZoom(Math.min(3,zoom+.5))} /><Button title={textMode ? 'Sayfayı göster' : 'Metni oku'} secondary onPress={()=>setTextMode(!textMode)} /></View>
      </View>
      <ScrollView ref={vertical} style={{flex:1}} contentContainerStyle={{flexGrow:1}}>
        {textMode || imageError ? <View style={{padding:22,gap:15}}>{imageError && <Text accessibilityRole="alert" style={s.notice}>Sayfa görseli yüklenemedi. Belgenin metnini aşağıdan okuyabilirsin.</Text>}<Text selectable style={[s.body,{color:colors.ink}]}>{current.text.trim() || 'Bu sayfa yalnızca görsel içeriyor.'}</Text></View> : <ScrollView ref={horizontal} horizontal contentContainerStyle={{minWidth:'100%',justifyContent:'center',alignItems:'flex-start'}}>
          <Image key={page} source={current.image} resizeMode="contain" accessibilityLabel={`MEB 2026 kılavuzu, sayfa ${page+1}. Erişilebilir metin için Metni oku düğmesini kullan.`} onError={()=>setImageError(true)} style={{width:pageWidth,height:pageWidth*current.ratio,backgroundColor:'white'}} />
        </ScrollView>}
      </ScrollView>
      <View style={[s.row,{padding:12,borderTopWidth:1,borderColor:colors.border}]}><Button title="← Önceki" secondary disabled={page===0} onPress={()=>setPage(page-1)} /><Text accessibilityLiveRegion="polite" style={s.letter}>{page+1} / {guidePages.length}</Text><Button title="Sonraki →" secondary disabled={page===guidePages.length-1} onPress={()=>setPage(page+1)} /></View>
    </SafeAreaView>
  </Modal>;
}
