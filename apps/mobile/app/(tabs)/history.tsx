import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { mockWashHistory } from '@/data/mockWashHistory';
import { Calendar, Clock, CloudDownload as DownloadCloud, MapPin } from 'lucide-react-native';

export default function HistoryScreen() {
  const [washHistory, setWashHistory] = useState(mockWashHistory);
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  
  const periods = ['All', 'This Month', 'Last Month', 'Last 3 Months'];

  const filteredHistory = washHistory.filter(wash => {
    const washDate = new Date(wash.date);
    const now = new Date();
    
    if (selectedPeriod === 'This Month') {
      return washDate.getMonth() === now.getMonth() && 
             washDate.getFullYear() === now.getFullYear();
    } else if (selectedPeriod === 'Last Month') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return washDate.getMonth() === lastMonth && 
             washDate.getFullYear() === lastMonthYear;
    } else if (selectedPeriod === 'Last 3 Months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return washDate >= threeMonthsAgo;
    }
    
    return true;
  });

  const handleWashPress = (washId: string) => {
    router.push(`/wash-detail/${washId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wash History</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          data={periods}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedPeriod === item && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedPeriod(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      <FlatList
        data={filteredHistory}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.washCard}
            onPress={() => handleWashPress(item.id)}
          >
            <View style={styles.washCardHeader}>
              <View style={styles.washTypeContainer}>
                <Image
                  source={{ uri: item.washType.imageUrl }}
                  style={styles.washTypeImage}
                />
                <View>
                  <Text style={styles.washTypeName}>{item.washType.name}</Text>
                  <View style={styles.washInfoRow}>
                    <Calendar size={14} color={COLORS.gray[500]} />
                    <Text style={styles.washInfoText}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.washPrice}>{item.price} kr</Text>
            </View>
            
            <View style={styles.washDetailRow}>
              <View style={styles.washInfoDetail}>
                <MapPin size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>{item.station.name}</Text>
              </View>
              <View style={styles.washInfoDetail}>
                <Clock size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>{item.duration} min</Text>
              </View>
            </View>
            
            <View style={styles.washCardFooter}>
              <TouchableOpacity 
                style={styles.invoiceButton}
                onPress={() => router.push(`/invoice/${item.id}`)}
              >
                <DownloadCloud size={16} color={COLORS.primary[600]} />
                <Text style={styles.invoiceButtonText}>Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.washList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Calendar size={32} color={COLORS.primary[600]} />
            </View>
            <Text style={styles.emptyTitle}>No wash history</Text>
            <Text style={styles.emptyMessage}>
              Your wash history will appear here
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.gray[900],
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersList: {
    paddingHorizontal: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 40,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary[100],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray[700],
  },
  activeFilterText: {
    color: COLORS.primary[700],
  },
  washList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 8,
  },
  washCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  washCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  washTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  washTypeImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  washTypeName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  washInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  washInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  washPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: COLORS.primary[700],
  },
  washDetailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  washInfoDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  washInfoDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  washCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    backgroundColor: COLORS.primary[50],
  },
  invoiceButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary[700],
    marginLeft: 4,
  },
  detailsButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});