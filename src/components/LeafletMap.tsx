import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { buildHtml, Props } from './leafletHtml';

export type { MapMarker } from './leafletHtml';

export default function LeafletMap(props: Props) {
  const webRef = useRef<WebView>(null);
  const html = useMemo(() => buildHtml(props), [
    JSON.stringify(props.markers),
    JSON.stringify(props.center),
    props.zoom,
    JSON.stringify(props.userLocation),
    props.interactive,
  ]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'marker' && props.onMarkerPress) props.onMarkerPress(data.id);
      if (data.type === 'ready' && props.onReady) props.onReady();
    } catch {
      // mensaje no reconocido: ignorar
    }
  };

  return (
    <View style={[styles.container, props.style]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        style={styles.web}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        androidLayerType="hardware"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#e8eef0' },
  web: { flex: 1, backgroundColor: 'transparent' },
});
