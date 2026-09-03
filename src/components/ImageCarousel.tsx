import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  images: string[];
  height?: number;
  borderRadius?: number;
}

/** Carrusel horizontal con paginado y puntos indicadores. Sin dependencias extra. */
export default function ImageCarousel({ images, height = 210, borderRadius = 0 }: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<string>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View
      style={[styles.container, { height, borderRadius }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(item, i) => `${item}-${i}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          renderItem={({ item }) => (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item }}
                style={{ width, height }}
                resizeMode="cover"
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={[styles.placeholder, { width, height }]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          }
        />
      )}

      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    height: 7,
    borderRadius: radius.pill,
    marginHorizontal: 3,
  },
  dotActive: { width: 20, backgroundColor: colors.textInverse },
  dotInactive: { width: 7, backgroundColor: 'rgba(255,255,255,0.55)' },
});
