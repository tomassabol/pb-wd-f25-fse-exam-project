import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { ArrowLeft, Clock, MapPin, Download, Calendar, Check } from 'lucide-react-native';
import { mockWashHistory } from '@/data/mockWashHistory';
import { WashHistory } from '@/types/wash';

export default function WashDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [washDetail, setWashDetail] = useState<WashHistory | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundWash = mockWashHistory.find(wash => wash.id === id);
      if (foundWash) {
        setWashDetail(foundWash);
      }
    }
  }, [id]);

  if (!washDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.gray[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wash Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wash details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wash Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.washHeader}>
          <Image 
            source={{ uri: washDetail.washType.imageUrl }} 
            style={styles.washImage} 
          />
          <View style={styles.washTypeContainer}>
            <Text style={styles.washType}>{washDetail.washType.name}</Text>
            <View style={styles.washInfoRow}>
              <Calendar size={16} color={COLORS.gray[500]} />
              <Text style={styles.washDate}>{washDetail.date}</Text>
            </View>
            <View style={styles.washInfoRow}>
              <MapPin size={16} color={COLORS.gray[500]} />
              <Text style={styles.washLocation}>{washDetail.station.name}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wash Information</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wash Type</Text>
              <Text style={styles.infoValue}>{washDetail.washType.name}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{washDetail.date}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{washDetail.station.name}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{washDetail.duration} min</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License Plate</Text>
              <Text style={styles.infoValue}>{washDetail.licensePlate}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{washDetail.paymentMethod}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wash Services</Text>
          </View>
          
          <View style={styles.servicesCard}>
            {washDetail.services.map((service, index) => (
              <View key={index} style={styles.serviceRow}>
                <Check size={20} color={COLORS.success[500]} />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{washDetail.washType.name}</Text>
              <Text style={styles.paymentValue}>{washDetail.price} kr</Text>
            </View>
            
            {washDetail.extras && washDetail.extras.map((extra, index) => (
              <View key={index} style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{extra.name}</Text>
                <Text style={styles.paymentValue}>{extra.price} kr</Text>
              </View>
            ))}
            
            {washDetail.discount && (
              <View style={styles.paymentRow}>
                <Text style={styles.discountLabel}>{washDetail.discount.name}</Text>
                <Text style={styles.discountValue}>-{washDetail.discount.amount} kr</Text>
              </View>
            )}
            
            <View style={styles.totalDivider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{washDetail.price} kr</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.invoiceButton}
            onPress={() => router.push(`/invoice/${washDetail.id}`)}
          >
            <Download size={20} color="#FFF" />
            <Text style={styles.invoiceButtonText}>Download Invoice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.repeatButton}
            onPress={() => router.push(`/station/${washDetail.station.id}`)}
          >
            <Text style={styles.repeatButtonText}>Repeat Wash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.gray[600],
  },
  washHeader: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#FFF',
  },
  washImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  washTypeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  washType: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  washInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  washDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  washLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[600],
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
  },
  servicesCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  serviceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.gray[800],
    marginLeft: 12,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  paymentValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.gray[900],
  },
  discountLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.success[700],
  },
  discountValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.success[700],
  },
  totalDivider: {
    height: 1,
    backgroundColor: COLORS.gray[300],
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.primary[700],
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 8,
  },
  invoiceButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  invoiceButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  repeatButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  repeatButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.primary[600],
  },
});