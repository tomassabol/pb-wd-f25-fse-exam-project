import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Car,
  Clock,
  Droplets,
  MapPin,
  Navigation,
  Search,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useWash } from '@/hooks/useWash';
import { StationCard } from '@/components/stations/StationCard';
import { WashTypeCard } from '@/components/wash/WashTypeCard';
import { mockStations } from '@/data/mockStations';
import { mockWashTypes } from '@/data/mockWashTypes';

const ActiveWashBar = () => {
  const { activeWash } = useWash();

  if (!activeWash) return null;

  return (
    <TouchableOpacity
      style={styles.activeWashBar}
      onPress={() => router.push('/(modals)/wash-progress')}
    >
      <View style={styles.pulseDot} />
      <Text style={styles.activeWashText}>Wash in Progress</Text>
      <Text style={styles.viewText}>View</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { activeWash, detectLicensePlate } = useWash();
  const [nearbyStations, setNearbyStations] = useState(
    mockStations.slice(0, 3),
  );
  const [isDetecting, setIsDetecting] = useState(false);

  const handleStationPress = (stationId: string) => {
    router.push(`/station/${stationId}`);
  };

  const handleScanPress = () => {
    setIsDetecting(true);

    // Simulate license plate detection
    setTimeout(() => {
      setIsDetecting(false);
      detectLicensePlate(user?.licensePlate || '');
      router.push('/(modals)/wash-selector');
    }, 2000);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary[700], COLORS.primary[600]]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.name?.split(' ')[0] || 'Guest'}
              </Text>
              <Text style={styles.subGreeting}>Welcome to WashWorld</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {activeWash ? (
          <TouchableOpacity
            style={styles.activeWashCard}
            onPress={() => router.push('/(modals)/wash-progress')}
          >
            <View style={styles.activeWashHeader}>
              <View style={styles.pulseDot} />
              <Text style={styles.activeWashLabel}>Wash in Progress</Text>
            </View>
            <View style={styles.activeWashDetails}>
              <View style={styles.activeWashInfo}>
                <Text style={styles.activeWashType}>
                  {activeWash.washType.name}
                </Text>
                <Text style={styles.activeWashLocation}>
                  {activeWash.station.name}
                </Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanPress}
              disabled={isDetecting}
            >
              <View style={styles.scanIconContainer}>
                <Car size={24} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.scanText}>
                {isDetecting ? 'Detecting...' : "I'm at a WashWorld station"}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/stations')}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: COLORS.teal[100] },
                  ]}
                >
                  <MapPin size={20} color={COLORS.teal[600]} />
                </View>
                <Text style={styles.actionText}>Find Stations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/membership')}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: COLORS.accent[100] },
                  ]}
                >
                  <Droplets size={20} color={COLORS.accent[600]} />
                </View>
                <Text style={styles.actionText}>Membership</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wash Packages</Text>
            <TouchableOpacity onPress={() => router.push('/wash-packages')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockWashTypes}
            renderItem={({ item }) => (
              <WashTypeCard
                washType={item}
                onPress={() => router.push(`/wash-package/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.washTypesContainer}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Stations</Text>
            <TouchableOpacity onPress={() => router.push('/stations')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {nearbyStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPress={() => handleStationPress(station.id)}
            />
          ))}
        </View>

        {user?.recentWashes && user.recentWashes.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Washes</Text>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {user.recentWashes.slice(0, 2).map((wash) => (
              <TouchableOpacity
                key={wash.id}
                style={styles.recentWashCard}
                onPress={() => router.push(`/wash-detail/${wash.id}`)}
              >
                <View style={styles.recentWashInfo}>
                  <Text style={styles.recentWashType}>
                    {wash.washType.name}
                  </Text>
                  <View style={styles.recentWashDetails}>
                    <Clock size={14} color={COLORS.gray[500]} />
                    <Text style={styles.recentWashDate}>{wash.date}</Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={14} color={COLORS.gray[500]} />
                      <Text style={styles.recentWashLocation} numberOfLines={1}>
                        {wash.station.name}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.recentWashPrice}>{wash.price} kr</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary[700],
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFF',
  },
  subGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.primary[100],
    opacity: 0.9,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  quickActions: {
    margin: 24,
    marginTop: -24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.primary[700],
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray[800],
  },
  activeWashCard: {
    margin: 24,
    marginTop: -24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeWashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success[500],
    marginRight: 8,
  },
  activeWashLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.success[700],
  },
  activeWashDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeWashInfo: {
    flex: 1,
  },
  activeWashType: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  activeWashLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
  },
  viewButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  lastSection: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
  },
  washTypesContainer: {
    paddingRight: 16,
  },
  recentWashCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  recentWashInfo: {
    flex: 1,
  },
  recentWashType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  recentWashDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentWashDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentWashLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
    maxWidth: 120,
  },
  recentWashPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.primary[700],
  },
  activeWashBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeWashText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  viewText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
});
