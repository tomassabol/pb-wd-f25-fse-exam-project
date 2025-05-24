import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Station } from '@/types/station';
import { COLORS } from '@/constants/colors';

interface StationMapProps {
  stations: Station[];
  onStationPress: (stationId: string) => void;
  initialRegion?: Region;
}

export function StationMap({ 
  stations, 
  onStationPress, 
  initialRegion
}: StationMapProps) {
  // Default to Copenhagen if no initialRegion provided
  const defaultRegion = {
    latitude: 55.6761,
    longitude: 12.5683,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion || defaultRegion}
    >
      {stations.map(station => (
        <Marker
          key={station.id}
          coordinate={station.coordinate}
          title={station.name}
          description={station.address}
          pinColor={station.isPremium ? COLORS.primary[600] : COLORS.gray[500]}
          onPress={() => onStationPress(station.id)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});