import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Leaf, Users, Target, ExternalLink, Heart, Zap, Award, Globe, Brain, Activity } from 'lucide-react-native';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Leaf size={40} color="#059669" />
          </View>
          <Text style={styles.appName}>EcoScan</Text>
          <View style={styles.aiBadge}>
            <Brain size={14} color="white" />
            <Text style={styles.aiBadgeText}>AI + ML Powered</Text>
          </View>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: '#DCFCE7' }]}>
            <Target size={20} color="#059669" />
          </View>
          <Text style={styles.sectionTitle}>Mission</Text>
        </View>
        <Text style={styles.sectionContent}>
          EcoScan empowers individuals to make environmentally conscious choices by providing 
          instant sustainability insights about everyday objects. Through dual AI-powered analysis, 
          we help users understand the environmental impact of their purchases and discover 
          eco-friendly alternatives.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
            <Zap size={20} color="#3B82F6" />
          </View>
          <Text style={styles.sectionTitle}>How It Works</Text>
        </View>
        <Text style={styles.sectionContent}>
          Simply point your camera at any object and let our dual AI system analyze its sustainability. 
          We use both Google Gemini and our specialized ML model to evaluate:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Material composition and recyclability</Text>
          <Text style={styles.bulletPoint}>• Manufacturing process impact</Text>
          <Text style={styles.bulletPoint}>• Carbon footprint and energy usage</Text>
          <Text style={styles.bulletPoint}>• Durability and lifecycle assessment</Text>
          <Text style={styles.bulletPoint}>• Packaging and transportation impact</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Users size={20} color="#D97706" />
          </View>
          <Text style={styles.sectionTitle}>About This Project</Text>
        </View>
        <Text style={styles.sectionContent}>
          EcoScan was developed as a sustainability-focused mobile application, combining 
          computer vision technology with environmental awareness. This project demonstrates 
          the practical application of AI in promoting eco-conscious consumer behavior through 
          modern mobile development practices.
        </Text>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Key Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#EEF2FF' }]}>
              <Brain size={18} color="#3B82F6" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Dual AI Analysis</Text>
              <Text style={styles.featureText}>Google Gemini + Custom ML Model</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#DCFCE7' }]}>
              <Leaf size={18} color="#059669" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sustainability Scoring</Text>
              <Text style={styles.featureText}>1-10 scale environmental rating</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
              <Award size={18} color="#D97706" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Alternatives</Text>
              <Text style={styles.featureText}>Eco-friendly product suggestions</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#F0F9FF' }]}>
              <Globe size={18} color="#0891B2" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Collection Tracking</Text>
              <Text style={styles.featureText}>Personal sustainability journey</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: '#FEE2E2' }]}>
            <Heart size={20} color="#DC2626" />
          </View>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
        </View>
        <Text style={styles.sectionContent}>
          Every scan contributes to building awareness about sustainable consumption. 
          By making informed choices, we can collectively reduce our environmental footprint 
          and work towards a more sustainable future. Our dual AI approach ensures accurate 
          and comprehensive sustainability assessments.
        </Text>
      </View>

      <View style={styles.techStack}>
        <Text style={styles.techTitle}>Technology Stack</Text>
        <View style={styles.techGrid}>
          <View style={styles.techItem}>
            <Text style={styles.techName}>React Native</Text>
            <Text style={styles.techDesc}>Cross-platform mobile</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>Expo Router</Text>
            <Text style={styles.techDesc}>File-based navigation</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>Google Gemini</Text>
            <Text style={styles.techDesc}>AI image analysis</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>Custom ML Model</Text>
            <Text style={styles.techDesc}>Sustainability prediction</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>AsyncStorage</Text>
            <Text style={styles.techDesc}>Local data persistence</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>TypeScript</Text>
            <Text style={styles.techDesc}>Type-safe development</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with care for a sustainable future
        </Text>
        <Text style={styles.copyrightText}>
          2024 EcoScan. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
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
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  bulletPoints: {
    marginTop: 10,
  },
  bulletPoint: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  features: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  techStack: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  techTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  techItem: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '45%',
  },
  techName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  techDesc: {
    fontSize: 10,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 6,
  },
  copyrightText: {
    fontSize: 10,
    color: '#6B7280',
  },
});