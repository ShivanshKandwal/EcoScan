import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, RotateCcw, Sparkles, Zap, Brain } from 'lucide-react-native';
import { analyzeImageWithGemini } from '@/utils/geminiApi';
import { analyzeSustainabilityWithAPI } from '@/utils/sustainabilityApi';
import { saveScannedItem } from '@/utils/storage';
import { SustainabilityResult } from '@/components/SustainabilityResult';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [sustainabilityPrediction, setSustainabilityPrediction] = useState<'sustainable' | 'unsustainable' | null>(null);
  const [predictionConfidence, setPredictionConfidence] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <Camera size={48} color="#3B82F6" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need camera access to scan objects and analyze their sustainability impact.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (Platform.OS === 'web') {
      // Web fallback - use image picker
      pickImageFromGallery();
      return;
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        setCapturedImage(photo.uri);
        setAnalysisError(null);
        setApiError(null);
        analyzeImage(photo.base64!);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setAnalysisError(null);
      setApiError(null);
      analyzeImage(result.assets[0].base64!);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSustainabilityPrediction(null);
    setPredictionConfidence(null);
    setApiError(null);
    
    try {
      // Run both APIs in parallel
      const [geminiResult, sustainabilityResult] = await Promise.allSettled([
        analyzeImageWithGemini(base64Image),
        analyzeSustainabilityWithAPI(base64Image)
      ]);

      let finalResult = null;
      let prediction = null;
      let confidence = null;
      let apiErrorMessage = null;

      // Handle Gemini API result
      if (geminiResult.status === 'fulfilled') {
        finalResult = geminiResult.value;
      } else {
        console.error('Gemini API failed:', geminiResult.reason);
        setAnalysisError(`Analysis failed: ${geminiResult.reason.message}`);
        return;
      }

      // Handle Sustainability API result
      if (sustainabilityResult.status === 'fulfilled' && sustainabilityResult.value) {
        const result = sustainabilityResult.value;
        if (result.error) {
          apiErrorMessage = result.error;
        } else {
          prediction = result.prediction;
          confidence = result.confidence;
        }
      } else {
        console.error('Sustainability API failed:', sustainabilityResult.reason);
        apiErrorMessage = 'ML model temporarily unavailable';
      }

      setAnalysisResult(finalResult);
      setSustainabilityPrediction(prediction);
      setPredictionConfidence(confidence);
      setApiError(apiErrorMessage);
      
      // Save to local storage
      await saveScannedItem({
        id: Date.now().toString(),
        imageUri: capturedImage!,
        ...finalResult,
        sustainabilityPrediction: prediction,
        predictionConfidence: confidence,
        apiError: apiErrorMessage,
        scannedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAnalysisError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSustainabilityPrediction(null);
    setPredictionConfidence(null);
    setApiError(null);
  };

  const retryAnalysis = () => {
    if (capturedImage) {
      // Re-analyze the same image
      const base64Match = capturedImage.match(/data:image\/[^;]+;base64,(.+)/);
      if (base64Match) {
        analyzeImage(base64Match[1]);
      } else {
        // If it's a file URI, we need to convert it to base64
        setAnalysisError('Unable to retry analysis. Please take a new photo.');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (capturedImage && analysisResult) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <SustainabilityResult 
            result={analysisResult} 
            sustainabilityPrediction={sustainabilityPrediction}
            predictionConfidence={predictionConfidence}
            apiError={apiError}
          />
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
            <RotateCcw size={18} color="white" />
            <Text style={styles.scanAgainText}>Scan Another Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (capturedImage && analysisError) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorMessage}>{analysisError}</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={retryAnalysis}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newScanButton} onPress={resetScan}>
              <Text style={styles.newScanButtonText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (capturedImage && isAnalyzing) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        <View style={styles.analyzingContainer}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Brain size={28} color="#059669" style={styles.sparkleIcon} />
          </View>
          <Text style={styles.analyzingText}>Analyzing Sustainability...</Text>
          <View style={styles.analyzingSubContainer}>
            <Sparkles size={14} color="#059669" />
            <Text style={styles.analyzingSubText}>AI & ML models working together</Text>
          </View>
          <View style={styles.loadingSteps}>
            <Text style={styles.loadingStep}>Identifying object...</Text>
            <Text style={styles.loadingStep}>Running ML prediction...</Text>
            <Text style={styles.loadingStep}>Analyzing sustainability...</Text>
            <Text style={styles.loadingStep}>Finding alternatives...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>EcoScan</Text>
          <View style={styles.headerBadge}>
            <Brain size={12} color="white" />
            <Text style={styles.headerBadgeText}>AI + ML</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Discover the environmental impact of everyday objects</Text>
      </View>

      <View style={styles.cameraContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.webCameraPlaceholder}>
            <Camera size={64} color="#9CA3AF" />
            <Text style={styles.webCameraText}>Camera not available on web</Text>
            <Text style={styles.webCameraSubtext}>Use the gallery button to select an image</Text>
          </View>
        ) : (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame}>
                <View style={styles.scanCorner} />
                <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
              </View>
              <Text style={styles.scanInstruction}>Point camera at an object to scan</Text>
            </View>
          </CameraView>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
          <ImageIcon size={20} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner}>
            <View style={styles.captureButtonCore} />
          </View>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <RotateCcw size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
        {Platform.OS === 'web' && <View style={styles.flipButton} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxWidth: 300,
  },
  permissionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 10,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  webCameraText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
  },
  webCameraSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  scanFrame: {
    width: width * 0.65,
    height: width * 0.65,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#059669',
    top: 0,
    left: 0,
  },
  scanCornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  scanCornerBottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  scanCornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanInstruction: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCore: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  capturedImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  analyzingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  analyzingSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  analyzingSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  loadingSteps: {
    alignItems: 'center',
    gap: 6,
  },
  loadingStep: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  newScanButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  newScanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});