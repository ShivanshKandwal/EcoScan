import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Leaf, Lightbulb, ChartBar as BarChart3, Award, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Recycle, Factory, Zap, CircleAlert as AlertCircle, TrendingUp, TrendingDown, Brain, Activity } from 'lucide-react-native';
import { SustainabilityAnalysis } from '@/types/sustainability';

const { width } = Dimensions.get('window');

interface SustainabilityResultProps {
  result: SustainabilityAnalysis;
  sustainabilityPrediction?: 'sustainable' | 'unsustainable' | null;
  predictionConfidence?: number | null;
  apiError?: string | null;
}

export function SustainabilityResult({ 
  result, 
  sustainabilityPrediction, 
  predictionConfidence,
  apiError 
}: SustainabilityResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#059669';
    if (score >= 6) return '#D97706';
    if (score >= 4) return '#DC2626';
    return '#991B1B';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award size={20} color="white" />;
    if (score >= 6) return <CheckCircle size={20} color="white" />;
    if (score >= 4) return <AlertTriangle size={20} color="white" />;
    return <AlertCircle size={20} color="white" />;
  };

  const getPredictionColor = (prediction: string) => {
    return prediction === 'sustainable' ? '#059669' : '#DC2626';
  };

  const getPredictionIcon = (prediction: string) => {
    return prediction === 'sustainable' ? 
      <TrendingUp size={18} color="white" /> : 
      <TrendingDown size={18} color="white" />;
  };

  const renderMLModelCard = () => {
    return (
      <View style={styles.mlModelCard}>
        <View style={styles.mlModelHeader}>
          <View style={[styles.mlModelIcon, { backgroundColor: '#3B82F6' }]}>
            <Brain size={20} color="white" />
          </View>
          <View style={styles.mlModelTitleContainer}>
            <Text style={styles.mlModelTitle}>ML Model Prediction</Text>
            <Text style={styles.mlModelSubtitle}>Deep Learning Analysis</Text>
          </View>
        </View>
        
        {apiError ? (
          <View style={styles.mlErrorContainer}>
            <View style={styles.mlErrorHeader}>
              <AlertCircle size={16} color="#DC2626" />
              <Text style={styles.mlErrorTitle}>Model Unavailable</Text>
            </View>
            <Text style={styles.mlErrorText}>{apiError}</Text>
            <View style={styles.mlErrorDetails}>
              <Text style={styles.mlErrorDetailsText}>
                The ML model is currently offline. Analysis provided by Gemini AI.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.mlResultContainer}>
            <View style={[
              styles.mlPredictionBadge, 
              { backgroundColor: sustainabilityPrediction ? getPredictionColor(sustainabilityPrediction) : '#6B7280' }
            ]}>
              <View style={styles.mlPredictionContent}>
                {sustainabilityPrediction ? getPredictionIcon(sustainabilityPrediction) : <Activity size={18} color="white" />}
                <Text style={styles.mlPredictionText}>
                  {sustainabilityPrediction ? sustainabilityPrediction.toUpperCase() : 'ANALYZING'}
                </Text>
              </View>
              {predictionConfidence !== null && predictionConfidence > 0 && (
                <View style={styles.mlConfidenceContainer}>
                  <View style={[styles.mlConfidenceBar, { width: `${predictionConfidence * 100}%` }]} />
                  <Text style={styles.mlConfidenceText}>
                    {Math.round((predictionConfidence || 0) * 100)}% confidence
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderKeyPoints = () => {
    if (!result.keyPoints || result.keyPoints.length === 0) return null;

    return (
      <View style={styles.keyPointsCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
            <Zap size={18} color="#3B82F6" />
          </View>
          <Text style={styles.sectionTitle}>Key Insights</Text>
        </View>
        <View style={styles.keyPointsGrid}>
          {result.keyPoints.slice(0, 4).map((point, index) => (
            <View key={index} style={styles.keyPointItem}>
              <View style={styles.keyPointBullet}>
                <Text style={styles.keyPointNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMaterials = () => {
    if (!result.materials || result.materials.length === 0) return null;

    return (
      <View style={styles.materialsCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
            <Factory size={18} color="#D97706" />
          </View>
          <Text style={styles.sectionTitle}>Materials</Text>
        </View>
        <View style={styles.materialsGrid}>
          {result.materials.slice(0, 6).map((material, index) => (
            <View key={index} style={styles.materialChip}>
              <Text style={styles.materialText}>{material}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <View style={styles.headerCard}>
        <View style={styles.objectHeader}>
          <Text style={styles.objectName}>{result.objectName}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{result.category}</Text>
          </View>
        </View>
      </View>

      {/* ML Model Prediction Card */}
      {renderMLModelCard()}

      {/* Score Section */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <BarChart3 size={20} color="#1F2937" />
          <Text style={styles.sectionTitle}>Sustainability Score</Text>
        </View>
        
        <View style={styles.scoreMainContainer}>
          <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(result.sustainabilityScore) }]}>
            {getScoreIcon(result.sustainabilityScore)}
            <Text style={styles.scoreNumber}>{result.sustainabilityScore}</Text>
            <Text style={styles.scoreMax}>/ 10</Text>
          </View>
          
          <View style={styles.scoreDetails}>
            <Text style={[styles.scoreLabel, { color: getScoreColor(result.sustainabilityScore) }]}>
              {getScoreLabel(result.sustainabilityScore)}
            </Text>
            <Text style={styles.scoreDescription}>
              Environmental impact assessment
            </Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreBarFill, 
                  { 
                    width: `${result.sustainabilityScore * 10}%`,
                    backgroundColor: getScoreColor(result.sustainabilityScore)
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Key Points */}
      {renderKeyPoints()}

      {/* Materials */}
      {renderMaterials()}

      {/* Environmental Impact Section */}
      <View style={styles.impactCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
            <Leaf size={18} color="#059669" />
          </View>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
        </View>
        <View style={styles.impactContent}>
          <Text style={styles.impactText}>{result.environmentalImpact}</Text>
        </View>
      </View>

      {/* Additional Info Cards */}
      {result.carbonFootprint && (
        <View style={styles.carbonCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Factory size={18} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>Carbon Footprint</Text>
          </View>
          <View style={styles.carbonContent}>
            <Text style={styles.carbonText}>{result.carbonFootprint}</Text>
          </View>
        </View>
      )}

      {result.recyclability && (
        <View style={styles.recyclabilityCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Recycle size={18} color="#0891B2" />
            </View>
            <Text style={styles.sectionTitle}>Recyclability</Text>
          </View>
          <View style={styles.recyclabilityContent}>
            <Text style={styles.recyclabilityText}>{result.recyclability}</Text>
          </View>
        </View>
      )}

      {/* Eco-Friendly Alternatives Section */}
      {result.ecoFriendlyAlternatives.length > 0 && (
        <View style={styles.alternativesCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Lightbulb size={18} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>Eco-Friendly Alternatives</Text>
          </View>
          <View style={styles.alternativesGrid}>
            {result.ecoFriendlyAlternatives.slice(0, 3).map((alternative, index) => (
              <View key={index} style={styles.alternativeCard}>
                <View style={styles.alternativeNumber}>
                  <Text style={styles.alternativeNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.alternativeText}>{alternative}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Facts Section */}
      {result.facts.length > 0 && (
        <View style={styles.factsCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Lightbulb size={18} color="#059669" />
            </View>
            <Text style={styles.sectionTitle}>Did You Know?</Text>
          </View>
          <View style={styles.factsContainer}>
            {result.facts.slice(0, 2).map((fact, index) => (
              <View key={index} style={styles.factCard}>
                <View style={styles.factIcon}>
                  <Leaf size={16} color="#059669" />
                </View>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  objectHeader: {
    alignItems: 'center',
  },
  objectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mlModelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mlModelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mlModelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mlModelTitleContainer: {
    flex: 1,
  },
  mlModelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  mlModelSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  mlErrorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  mlErrorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mlErrorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 6,
  },
  mlErrorText: {
    fontSize: 13,
    color: '#991B1B',
    marginBottom: 8,
  },
  mlErrorDetails: {
    backgroundColor: '#FECACA',
    padding: 8,
    borderRadius: 8,
  },
  mlErrorDetailsText: {
    fontSize: 11,
    color: '#7F1D1D',
  },
  mlResultContainer: {
    alignItems: 'center',
  },
  mlPredictionBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  mlPredictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mlPredictionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mlConfidenceContainer: {
    width: '100%',
    position: 'relative',
  },
  mlConfidenceBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 4,
  },
  mlConfidenceText: {
    color: 'white',
    fontSize: 11,
    opacity: 0.9,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  scoreMax: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  keyPointsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  keyPointsGrid: {
    gap: 10,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  keyPointBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  keyPointNumber: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  materialsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  materialChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  materialText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '600',
  },
  impactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  impactContent: {
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  impactText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  carbonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  carbonContent: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  carbonText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  recyclabilityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recyclabilityContent: {
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0891B2',
  },
  recyclabilityText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  alternativesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  alternativesGrid: {
    gap: 10,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
  },
  alternativeNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  alternativeNumberText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  factsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  factsContainer: {
    gap: 10,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 10,
  },
  factIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
    fontWeight: '500',
  },
});