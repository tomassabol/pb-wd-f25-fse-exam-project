import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Heart, Star, MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { Station } from '@/types/station';

interface StationCardProps {
  station: Station;
  onPress: () => void;
  onFavoritePress?: () => void;
  showFavoriteButton?: boolean;
}

export function StationCard({ 
  station, 
  onPress, 
  onFavoritePress,
  showFavoriteButton = false
}: StationCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: station.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{station.name}</Text>
          {(station.isFavorite || showFavoriteButton) && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={onFavoritePress}
            >
              <Heart 
                size={20} 
                color={COLORS.primary[600]} 
                fill={station.isFavorite ? COLORS.primary[600] : 'transparent'} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.addressContainer}>
          <MapPin size={16} color={COLORS.gray[500]} />
          <Text style={styles.address}>{station.address}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.ratingContainer}>
            <Star size={16} color={COLORS.warning[500]} />
            <Text style={styles.rating}>{station.rating}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <Text style={styles.distance}>{station.distance} km</Text>
          
          <View style={styles.detailDivider} />
          
          <View style={[
            styles.statusBadge, 
            station.isOpen ? styles.openBadge : styles.closedBadge
          ]}>
            <Text style={[
              styles.statusText,
              station.isOpen ? styles.openText : styles.closedText
            ]}>
              {station.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
        
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {station.type === 'automatic' ? 'Automatic' : 'Manual'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray[800],
    marginLeft: 4,
  },
  detailDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 12,
  },
  distance: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray[800],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  openBadge: {
    backgroundColor: COLORS.success[100],
  },
  closedBadge: {
    backgroundColor: COLORS.error[100],
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  openText: {
    color: COLORS.success[700],
  },
  closedText: {
    color: COLORS.error[700],
  },
  typeBadge: {
    position: 'absolute',
    top: -142,
    right: 12,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
  },
});