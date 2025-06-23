import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Search, Leaf, Calendar, Trash2, TrendingUp, Award, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, X, Brain, Activity } from 'lucide-react-native';
import { getScannedItems, deleteScannedItem } from '@/utils/storage';
import { ScannedItem } from '@/types/sustainability';
import { SustainabilityResult } from '@/components/SustainabilityResult';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function CollectionScreen() {
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ScannedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all');
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, items, selectedFilter]);

  const loadItems = async () => {
    try {
      const savedItems = await getScannedItems();
      setItems(savedItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply score filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => {
        const score = item.sustainabilityScore;
        switch (selectedFilter) {
          case 'excellent': return score >= 8;
          case 'good': return score >= 6 && score < 8;
          case 'fair': return score >= 4 && score < 6;
          case 'poor': return score < 4;
          default: return true;
        }
      });
    }

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to remove "${itemName}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScannedItem(itemId);
              await loadItems();
            } catch (error) {
              console.error('Failed to delete item:', error);
            }
          }
        }
      ]
    );
  };

  const openItemDetails = (item: ScannedItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#059669';
    if (score >= 6) return '#D97706';
    if (score >= 4) return '#DC2626';
    return '#991B1B';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award size={14} color="white" />;
    if (score >= 6) return <CheckCircle size={14} color="white" />;
    if (score >= 4) return <AlertTriangle size={14} color="white" />;
    return <AlertCircle size={14} color="white" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getAverageScore = () => {
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.sustainabilityScore, 0);
    return (total / items.length).toFixed(1);
  };

  const getSustainableCount = () => {
    return items.filter(item => item.sustainabilityPrediction === 'sustainable').length;
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
      <View style={[
        styles.filterBadge,
        selectedFilter === filter && styles.filterBadgeActive
      ]}>
        <Text style={[
          styles.filterBadgeText,
          selectedFilter === filter && styles.filterBadgeTextActive
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMLPredictionBadge = (item: ScannedItem) => {
    if (item.apiError) {
      return (
        <View style={[styles.mlBadge, { backgroundColor: '#6B7280' }]}>
          <Activity size={12} color="white" />
          <Text style={styles.mlBadgeText}>ML Offline</Text>
        </View>
      );
    }

    if (!item.sustainabilityPrediction) return null;

    const color = item.sustainabilityPrediction === 'sustainable' ? '#059669' : '#DC2626';
    const icon = item.sustainabilityPrediction === 'sustainable' ? 
      <TrendingUp size={12} color="white" /> : 
      <AlertCircle size={12} color="white" />;

    return (
      <View style={[styles.mlBadge, { backgroundColor: color }]}>
        <Brain size={12} color="white" />
        <Text style={styles.mlBadgeText}>
          {item.sustainabilityPrediction === 'sustainable' ? 'SUSTAINABLE' : 'UNSUSTAINABLE'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ScannedItem }) => (
    <TouchableOpacity 
      style={styles.itemCard} 
      activeOpacity={0.8}
      onPress={() => openItemDetails(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        <View style={[styles.scoreOverlay, { backgroundColor: getScoreColor(item.sustainabilityScore) }]}>
          {getScoreIcon(item.sustainabilityScore)}
          <Text style={styles.scoreOverlayText}>{item.sustainabilityScore}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteItem(item.id, item.objectName);
          }}
        >
          <Trash2 size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={2}>{item.objectName}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        
        {renderMLPredictionBadge(item)}
        
        <View style={styles.scoreRow}>
          <View style={styles.scoreIndicator}>
            <View style={[styles.scoreDot, { backgroundColor: getScoreColor(item.sustainabilityScore) }]} />
            <Text style={styles.scoreText}>{getScoreLabel(item.sustainabilityScore)}</Text>
          </View>
        </View>
        
        <View style={styles.dateRow}>
          <Calendar size={10} color="#6B7280" />
          <Text style={styles.dateText}>{formatDate(item.scannedAt)}</Text>
        </View>
        
        {item.ecoFriendlyAlternatives.length > 0 && (
          <View style={styles.alternativesPreview}>
            <Text style={styles.alternativesCount}>
              {item.ecoFriendlyAlternatives.length} alternatives
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#EEF2FF' }]}>
          <Leaf size={18} color="#3B82F6" />
        </View>
        <Text style={styles.statNumber}>{items.length}</Text>
        <Text style={styles.statLabel}>Items Scanned</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
          <TrendingUp size={18} color="#059669" />
        </View>
        <Text style={styles.statNumber}>{getAverageScore()}</Text>
        <Text style={styles.statLabel}>Avg. Score</Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
          <Award size={18} color="#D97706" />
        </View>
        <Text style={styles.statNumber}>{getSustainableCount()}</Text>
        <Text style={styles.statLabel}>Sustainable</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Leaf size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No Items Yet</Text>
      <Text style={styles.emptyMessage}>
        Start scanning objects to build your sustainability collection and track your environmental impact!
      </Text>
    </View>
  );

  const filterCounts = {
    all: items.length,
    excellent: items.filter(item => item.sustainabilityScore >= 8).length,
    good: items.filter(item => item.sustainabilityScore >= 6 && item.sustainabilityScore < 8).length,
    fair: items.filter(item => item.sustainabilityScore >= 4 && item.sustainabilityScore < 6).length,
    poor: items.filter(item => item.sustainabilityScore < 4).length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Collection</Text>
        <Text style={styles.headerSubtitle}>
          Track your sustainability journey
        </Text>
      </View>

      {items.length > 0 && renderStats()}

      <View style={styles.searchContainer}>
        <Search size={18} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your collection..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {renderFilterButton('all', 'All', filterCounts.all)}
        {renderFilterButton('excellent', 'Excellent', filterCounts.excellent)}
        {renderFilterButton('good', 'Good', filterCounts.good)}
        {renderFilterButton('fair', 'Fair', filterCounts.fair)}
        {renderFilterButton('poor', 'Poor', filterCounts.poor)}
      </ScrollView>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        ListEmptyComponent={renderEmpty}
      />

      {/* Item Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Item Details</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedItem && (
            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedItem.imageUri }} style={styles.modalImage} />
              <SustainabilityResult 
                result={selectedItem} 
                sustainabilityPrediction={selectedItem.sustainabilityPrediction}
                predictionConfidence={selectedItem.predictionConfidence}
                apiError={selectedItem.apiError}
              />
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filtersContent: {
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginRight: 6,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  filterBadgeTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
  },
  scoreOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  scoreOverlayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
    lineHeight: 18,
  },
  itemCategory: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  mlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  mlBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  scoreRow: {
    marginBottom: 6,
  },
  scoreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 9,
    color: '#6B7280',
    marginLeft: 3,
  },
  alternativesPreview: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alternativesCount: {
    fontSize: 8,
    color: '#3B82F6',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
});