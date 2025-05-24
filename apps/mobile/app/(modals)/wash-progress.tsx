import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useWash } from '@/hooks/useWash';
import { Check, Clock, X, TriangleAlert as AlertTriangle, MailOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withRepeat,
  withSequence,
  cancelAnimation
} from 'react-native-reanimated';

const WASH_DURATION = 300; // 5 minutes in seconds
const STEPS = [
  { id: 1, name: 'Pre-Wash', duration: 60, description: 'Initial spray to remove loose dirt and debris', icon: 'droplets' },
  { id: 2, name: 'Soap Application', duration: 60, description: 'Applying special cleaning solution to break down dirt', icon: 'spray' },
  { id: 3, name: 'High-Pressure Wash', duration: 90, description: 'Powerful jets to clean the vehicle surface', icon: 'waves' },
  { id: 4, name: 'Rinse', duration: 60, description: 'Final rinse to remove all cleaning solution', icon: 'droplet' },
  { id: 5, name: 'Drying', duration: 30, description: 'Gentle air to dry the vehicle surface', icon: 'wind' },
];

export default function WashProgressScreen() {
  const { activeWash, completeWash } = useWash();
  const [currentStep, setCurrentStep] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(WASH_DURATION);
  const [isComplete, setIsComplete] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const progress = useSharedValue(0);
  const stepProgress = useSharedValue(0);
  const cancelButtonScale = useSharedValue(1);
  const timerRef = useRef(null);
  
  useEffect(() => {
    startWashSimulation();
    
    return () => {
      clearInterval(timerRef.current);
      cancelAnimation(cancelButtonScale);
    };
  }, []);
  
  const startWashSimulation = () => {
    // Start overall progress animation
    progress.value = withTiming(1, {
      duration: WASH_DURATION * 1000,
      easing: Easing.linear,
    });
    
    // Animate current step progress
    animateStepProgress();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleWashComplete();
          return 0;
        }
        return prev - 1;
      });
      
      // Update current step based on time remaining
      const elapsedTime = WASH_DURATION - timeRemaining;
      let timeSum = 0;
      for (let i = 0; i < STEPS.length; i++) {
        timeSum += STEPS[i].duration;
        if (elapsedTime < timeSum) {
          if (currentStep !== i + 1) {
            setCurrentStep(i + 1);
            animateStepProgress();
          }
          break;
        }
      }
    }, 1000);
    
    // Animate cancel button
    cancelButtonScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite repeat
      true // reverse
    );
  };
  
  const animateStepProgress = () => {
    stepProgress.value = 0;
    stepProgress.value = withTiming(1, {
      duration: getStepDuration() * 1000,
      easing: Easing.linear,
    });
  };
  
  const getStepDuration = () => {
    return STEPS[currentStep - 1]?.duration || 60;
  };
  
  const getStepIcon = (iconName) => {
    // This would be replaced with actual icons in a real implementation
    switch(iconName) {
      case 'droplets': return <Droplets size={24} color="#FFF" />;
      case 'spray': return <Spray size={24} color="#FFF" />;
      case 'waves': return <Waves size={24} color="#FFF" />;
      case 'droplet': return <Droplet size={24} color="#FFF" />;
      case 'wind': return <Wind size={24} color="#FFF" />;
      default: return <Droplets size={24} color="#FFF" />;
    }
  };
  
  const handleWashComplete = () => {
    setIsComplete(true);
    completeWash();
  };
  
  const handleCancelPress = () => {
    setShowCancelConfirm(true);
  };
  
  const handleCancelConfirm = () => {
    clearInterval(timerRef.current);
    router.back();
  };
  
  const handleSendInvoice = () => {
    setShowEmailSent(true);
    
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  };
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  const stepProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${stepProgress.value * 100}%`,
    };
  });
  
  const cancelButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cancelButtonScale.value }],
    };
  });
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Temporary components for missing icons
  const Droplets = ({ size, color }) => (
    <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
  );
  
  const Spray = ({ size, color }) => (
    <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
  );
  
  const Waves = ({ size, color }) => (
    <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
  );
  
  const Droplet = ({ size, color }) => (
    <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
  );
  
  const Wind = ({ size, color }) => (
    <View style={[styles.iconPlaceholder, { width: size, height: size, backgroundColor: color }]} />
  );
  
  if (!activeWash) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noWashContainer}>
          <Text style={styles.noWashText}>No active wash found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.backButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isComplete ? (
        <View style={styles.completeContainer}>
          <View style={styles.completeIconContainer}>
            <Check size={64} color={COLORS.success[500]} />
          </View>
          <Text style={styles.completeTitle}>Wash Complete!</Text>
          <Text style={styles.completeMessage}>
            Your {activeWash.washType.name} wash has been completed successfully.
          </Text>
          
          <View style={styles.washSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Wash Type</Text>
              <Text style={styles.summaryValue}>{activeWash.washType.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Location</Text>
              <Text style={styles.summaryValue}>{activeWash.station.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{WASH_DURATION / 60} minutes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Price</Text>
              <Text style={styles.summaryValue}>{activeWash.washType.price} kr</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.invoiceButton}
            onPress={handleSendInvoice}
          >
            <MailOpen size={20} color="#FFF" />
            <Text style={styles.invoiceButtonText}>
              Send Receipt to Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.washType}>{activeWash.washType.name}</Text>
            <Text style={styles.stationName}>{activeWash.station.name}</Text>
          </View>
          
          <View style={styles.timerContainer}>
            <View style={styles.timerContent}>
              <Clock size={24} color={COLORS.primary[600]} />
              <Text style={styles.timeRemaining}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.timeLabel}>remaining</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
          </View>
          
          <View style={styles.currentStepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.currentStepLabel}>Current Step</Text>
              <Text style={styles.stepCount}>{currentStep} of {STEPS.length}</Text>
            </View>
            
            <View style={styles.stepCard}>
              <LinearGradient
                colors={[COLORS.primary[700], COLORS.primary[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.stepIconContainer}
              >
                {getStepIcon(STEPS[currentStep - 1]?.icon)}
              </LinearGradient>
              
              <View style={styles.stepInfo}>
                <Text style={styles.stepName}>{STEPS[currentStep - 1]?.name}</Text>
                <Text style={styles.stepDescription}>
                  {STEPS[currentStep - 1]?.description}
                </Text>
                <View style={styles.stepProgressTrack}>
                  <Animated.View style={[styles.stepProgressFill, stepProgressStyle]} />
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.stepsListContainer}>
            <Text style={styles.stepsListTitle}>All Steps</Text>
            {STEPS.map((step, index) => (
              <View 
                key={step.id} 
                style={[
                  styles.stepListItem,
                  currentStep === step.id && styles.activeStepListItem,
                  currentStep > step.id && styles.completedStepListItem
                ]}
              >
                <View style={[
                  styles.stepNumberContainer,
                  currentStep === step.id && styles.activeStepNumber,
                  currentStep > step.id && styles.completedStepNumber
                ]}>
                  {currentStep > step.id ? (
                    <Check size={16} color="#FFF" />
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      (currentStep === step.id || currentStep > step.id) && styles.activeStepNumberText
                    ]}>
                      {step.id}
                    </Text>
                  )}
                </View>
                <View style={styles.stepListContent}>
                  <Text style={[
                    styles.stepListName,
                    currentStep === step.id && styles.activeStepListName,
                    currentStep > step.id && styles.completedStepListName
                  ]}>
                    {step.name}
                  </Text>
                  <Text style={styles.stepDuration}>{step.duration} sec</Text>
                </View>
              </View>
            ))}
          </View>
          
          <Animated.View style={[styles.cancelContainer, cancelButtonStyle]}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelPress}
            >
              <X size={20} color={COLORS.error[600]} />
              <Text style={styles.cancelText}>Cancel Wash</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {showCancelConfirm && (
            <View style={styles.cancelConfirmOverlay}>
              <View style={styles.cancelConfirmDialog}>
                <View style={styles.cancelIconContainer}>
                  <AlertTriangle size={32} color={COLORS.error[600]} />
                </View>
                <Text style={styles.cancelConfirmTitle}>Cancel Wash?</Text>
                <Text style={styles.cancelConfirmMessage}>
                  Are you sure you want to cancel your wash? You may still be charged for the service.
                </Text>
                <View style={styles.cancelConfirmButtons}>
                  <TouchableOpacity
                    style={styles.cancelConfirmNoButton}
                    onPress={() => setShowCancelConfirm(false)}
                  >
                    <Text style={styles.cancelConfirmNoText}>No, Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelConfirmYesButton}
                    onPress={handleCancelConfirm}
                  >
                    <Text style={styles.cancelConfirmYesText}>Yes, Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          
          {showEmailSent && (
            <View style={styles.emailSentOverlay}>
              <View style={styles.emailSentContainer}>
                <MailOpen size={32} color={COLORS.success[600]} />
                <Text style={styles.emailSentText}>Receipt sent to your email!</Text>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  washType: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  stationName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[600],
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  timerContent: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingVertical: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeRemaining: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: COLORS.gray[900],
    marginVertical: 8,
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 4,
  },
  currentStepContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentStepLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
  },
  stepCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray[600],
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconPlaceholder: {
    borderRadius: 4,
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 12,
  },
  stepProgressTrack: {
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
  stepsListContainer: {
    paddingHorizontal: 24,
  },
  stepsListTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  stepListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  activeStepListItem: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
    borderBottomWidth: 0,
    padding: 12,
    marginBottom: 12,
  },
  completedStepListItem: {
    opacity: 0.7,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeStepNumber: {
    backgroundColor: COLORS.primary[600],
  },
  completedStepNumber: {
    backgroundColor: COLORS.success[500],
  },
  stepNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.gray[700],
  },
  activeStepNumberText: {
    color: '#FFF',
  },
  stepListContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepListName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.gray[800],
  },
  activeStepListName: {
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[700],
  },
  completedStepListName: {
    color: COLORS.success[700],
  },
  stepDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
  },
  cancelContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error[50],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  cancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.error[700],
    marginLeft: 8,
  },
  cancelConfirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cancelConfirmDialog: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  cancelIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.error[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelConfirmTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  cancelConfirmMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[700],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  cancelConfirmButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelConfirmNoButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelConfirmYesButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.error[600],
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelConfirmNoText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  cancelConfirmYesText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  completeIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.success[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  completeMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[700],
    textAlign: 'center',
    marginBottom: 32,
  },
  washSummary: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.gray[600],
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  invoiceButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  homeButton: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.primary[600],
  },
  noWashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noWashText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.gray[700],
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  emailSentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailSentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emailSentText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
});