import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { WashType } from '@/types/wash';

interface WashTypeCardProps {
  washType: WashType;
  onPress: () => void;
}

export function WashTypeCard({ washType, onPress }: WashTypeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: washType.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{washType.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {washType.description}
        </Text>
        
        <View style={styles.featuresContainer}>
          {washType.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <CheckCircle size={12} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          
          {washType.features.length > 3 && (
            <Text style={styles.moreFeatures}>
              +{washType.features.length - 3} more
            </Text>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{washType.price} kr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 12,
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.gray[700],
    marginLeft: 8,
  },
  moreFeatures: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.primary[600],
    marginTop: 4,
  },
  priceContainer: {
    position: 'absolute',
    top: -132,
    right: 12,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFF',
  },
});