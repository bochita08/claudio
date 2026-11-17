import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { buildHtml, Props } from './leafletHtml';

export type { MapMarker } from './leafletHtml';

/**
 * Version web (react-native-webview no existe en el navegador): el mismo HTML de
 * Leaflet dentro de un iframe; los mensajes llegan por window.postMessage.
 */
export default function LeafletMap(props: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => buildHtml(props), [
    JSON.stringify(props.markers),
    JSON.stringify(props.center),
    props.zoom,
    JSON.stringify(props.userLocation),
    props.interactive,
  ]);

  const { onMarkerPress, onReady } = props;
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      try {
        const data = JSON.parse(String(event.data));
        if (data.type === 'marker' && onMarkerPress) onMarkerPress(data.id);
        if (data.type === 'ready' && onReady) onReady();
      } catch {
        // mensaje no reconocido: ignorar
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMarkerPress, onReady]);

  return (
    <View style={[styles.container, props.style]}>
      <iframe
        ref={frameRef}
        srcDoc={html}
        title="Mapa"
        style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#e8eef0' },
});
