import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { colors } from '../theme';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
}

interface Props {
  markers: MapMarker[];
  center?: { latitude: number; longitude: number };
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  interactive?: boolean;
  onMarkerPress?: (id: string) => void;
  onReady?: () => void;
  style?: object;
}

/**
 * Mapa con OpenStreetMap + Leaflet renderizado dentro de un WebView.
 * Gratis, sin API key y funciona en Expo Go. Requiere conexion a internet para
 * bajar los tiles y la libreria de unpkg.
 */
function buildHtml(props: Props): string {
  const {
    markers,
    center,
    zoom = 12,
    userLocation,
    interactive = true,
  } = props;

  const fallbackCenter = center ??
    (markers[0]
      ? { latitude: markers[0].latitude, longitude: markers[0].longitude }
      : { latitude: -34.6037, longitude: -58.3816 });

  const markerData = JSON.stringify(markers);
  const userData = JSON.stringify(userLocation ?? null);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e8eef0; }
    .house-pin {
      background: ${colors.primary};
      width: 32px; height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    }
    .house-pin span { transform: rotate(45deg); font-size: 15px; }
    .me-dot {
      width: 16px; height: 16px; border-radius: 50%;
      background: #2E7DF2; border: 3px solid #fff;
      box-shadow: 0 0 0 4px rgba(46,125,242,0.3);
    }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var post = function (obj) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(obj));
      }
    };
    try {
      var map = L.map('map', {
        zoomControl: ${interactive ? 'true' : 'false'},
        dragging: ${interactive ? 'true' : 'false'},
        scrollWheelZoom: false,
        doubleClickZoom: ${interactive ? 'true' : 'false'},
        tap: ${interactive ? 'true' : 'false'}
      }).setView([${fallbackCenter.latitude}, ${fallbackCenter.longitude}], ${zoom});

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      var houseIcon = L.divIcon({
        className: '',
        html: '<div class="house-pin"><span>&#127968;</span></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      var markers = ${markerData};
      var bounds = [];
      markers.forEach(function (m) {
        var marker = L.marker([m.latitude, m.longitude], { icon: houseIcon }).addTo(map);
        marker.bindPopup('<b>' + m.title + '</b>' + (m.subtitle ? '<br/>' + m.subtitle : ''));
        marker.on('click', function () { post({ type: 'marker', id: m.id }); });
        bounds.push([m.latitude, m.longitude]);
      });

      var me = ${userData};
      if (me) {
        var meIcon = L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
        L.marker([me.latitude, me.longitude], { icon: meIcon }).addTo(map);
        bounds.push([me.latitude, me.longitude]);
      }

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

      window.recenter = function (lat, lng) { map.setView([lat, lng], 14); };
      post({ type: 'ready' });
    } catch (e) {
      post({ type: 'error', message: String(e) });
    }
    true;
  </script>
</body>
</html>`;
}

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
