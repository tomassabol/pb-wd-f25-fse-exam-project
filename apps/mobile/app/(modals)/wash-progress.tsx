import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useWash } from "@/hooks/useWash";
import {
  Check,
  Clock,
  X,
  TriangleAlert as AlertTriangle,
  MailOpen,
  Droplets,
  Waves,
  Wind,
  Shield,
  Sparkles,
  ArrowLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  useAnimatedProps,
  withRepeat,
} from "react-native-reanimated";
const { width: screenWidth } = Dimensions.get("window");

interface IconProps {
  size: number;
  color: string;
}

const StepIcon = ({
  iconName,
  size = 24,
  color = "#FFF",
}: {
  iconName: string;
  size?: number;
  color?: string;
}) => {
  const iconProps = { size, color };

  switch (iconName) {
    case "droplets":
      return <Droplets {...iconProps} />;
    case "spray":
      return <Droplets {...iconProps} />; // Use droplets as fallback
    case "waves":
      return <Waves {...iconProps} />;
    case "wind":
      return <Wind {...iconProps} />;
    case "shield":
      return <Shield {...iconProps} />;
    case "sparkles":
      return <Sparkles {...iconProps} />;
    case "brush":
      return <Droplets {...iconProps} />; // Use droplets as fallback
    default:
      return <Droplets {...iconProps} />;
  }
};

const ProgressBar = ({ progress }: { progress: number }) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress / 100, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
};

export default function WashProgressScreen() {
  const { activeWash, completeWash, cancelWash, updateWashProgress } =
    useWash();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const fadeAnimation = useSharedValue(0);

  useEffect(() => {
    if (!activeWash) return;

    // Start fade in animation
    fadeAnimation.value = withTiming(1, { duration: 800 });

    // Start progress timer
    if (activeWash.status === "in_progress") {
      timerRef.current = setInterval(() => {
        updateWashProgress();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeWash?.status, updateWashProgress]);

  // Auto-complete when progress reaches 100%
  useEffect(() => {
    if (activeWash?.status === "completed") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeout(() => {
        completeWash();
      }, 3000);
    }
  }, [activeWash?.status, completeWash]);

  const handleCancelPress = useCallback(() => {
    setShowCancelConfirm(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cancelWash();
    setShowCancelConfirm(false);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 1000);
  }, [cancelWash]);

  const handleSendInvoice = useCallback(() => {
    setShowEmailSent(true);
    setTimeout(() => {
      setShowEmailSent(false);
      router.replace("/(tabs)");
    }, 2000);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value,
      transform: [{ translateY: (1 - fadeAnimation.value) * 50 }],
    };
  });

  const activeStepStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }],
    };
  });

  if (!activeWash) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noWashContainer}>
          <Text style={styles.noWashText}>No active wash found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.backButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (activeWash.status === "completed") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.completeContainer}>
            <Animated.View
              style={[styles.completeIconContainer, activeStepStyle]}
            >
              <Check size={64} color={COLORS.success[500]} />
            </Animated.View>

            <Text style={styles.completeTitle}>Wash Complete! 🎉</Text>
            <Text style={styles.completeMessage}>
              Your {activeWash.washType.name} wash has been completed
              successfully. Your vehicle is now sparkling clean!
            </Text>

            <View style={styles.washSummary}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Wash Summary</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Wash Type</Text>
                <Text style={styles.summaryValue}>
                  {activeWash.washType.name}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>
                  {activeWash.station.name}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>
                  {Math.ceil(activeWash.totalDuration / 60)} minutes
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Price</Text>
                <Text style={styles.summaryValue}>
                  {activeWash.washType.price} kr
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.servicesCompleted}>
                <Text style={styles.servicesTitle}>Services Completed:</Text>
                {activeWash.steps.map((step) => (
                  <View key={step.id} style={styles.serviceItem}>
                    <Check size={16} color={COLORS.success[500]} />
                    <Text style={styles.serviceName}>{step.name}</Text>
                  </View>
                ))}
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
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.homeButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentStep = activeWash.steps[activeWash.currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.gray[800]} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Wash in Progress</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Banner */}
          {activeWash.status === "starting" && (
            <View style={styles.statusBanner}>
              <Text style={styles.statusText}>🚗 Preparing your wash...</Text>
            </View>
          )}

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressContent}>
              <Text style={styles.progressPercentage}>
                {Math.round(activeWash.progress)}%
              </Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>

            <ProgressBar progress={activeWash.progress} />

            <View style={styles.timeContainer}>
              <Text style={styles.timeRemaining}>
                {formatTime(activeWash.timeRemaining)}
              </Text>
              <Text style={styles.timeLabel}>remaining</Text>
            </View>
          </View>

          {/* Current Step */}
          <View style={styles.currentStepSection}>
            <Text style={styles.sectionTitle}>Current Step</Text>

            <Animated.View style={[styles.currentStepCard, activeStepStyle]}>
              <LinearGradient
                colors={[COLORS.primary[700], COLORS.primary[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.stepIconContainer}
              >
                <StepIcon iconName={currentStep?.icon} size={28} />
              </LinearGradient>

              <View style={styles.stepInfo}>
                <Text style={styles.stepName}>{currentStep?.name}</Text>
                <Text style={styles.stepDescription}>
                  {currentStep?.description}
                </Text>

                {/* Step progress bar */}
                <View style={styles.stepProgressContainer}>
                  <View style={styles.stepProgressTrack}>
                    <View
                      style={[
                        styles.stepProgressFill,
                        {
                          width: `${(((activeWash.totalDuration - activeWash.timeRemaining) % currentStep?.duration || 1) / (currentStep?.duration || 1)) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.stepProgressText}>
                    {Math.round(
                      (((activeWash.totalDuration - activeWash.timeRemaining) %
                        (currentStep?.duration || 1)) /
                        (currentStep?.duration || 1)) *
                        100
                    )}
                    %
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* All Steps */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Wash Steps</Text>

            {activeWash.steps.map((step, index) => (
              <View
                key={step.id}
                style={[
                  styles.stepItem,
                  step.status === "active" && styles.activeStepItem,
                  step.status === "completed" && styles.completedStepItem,
                ]}
              >
                <View
                  style={[
                    styles.stepIndicator,
                    step.status === "active" && styles.activeStepIndicator,
                    step.status === "completed" &&
                      styles.completedStepIndicator,
                  ]}
                >
                  {step.status === "completed" ? (
                    <Check size={16} color="#FFF" />
                  ) : step.status === "active" ? (
                    <StepIcon iconName={step.icon} size={16} />
                  ) : (
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.status === "active" && styles.activeStepTitle,
                      step.status === "completed" && styles.completedStepTitle,
                    ]}
                  >
                    {step.name}
                  </Text>
                  <Text style={styles.stepDuration}>{step.duration}s</Text>
                </View>

                {step.status === "active" && (
                  <View style={styles.activeStepBadge}>
                    <Text style={styles.activeStepBadgeText}>Active</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Cancel Button */}
        <View style={styles.cancelContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <X size={20} color={COLORS.error[600]} />
            <Text style={styles.cancelText}>Cancel Wash</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.cancelConfirmDialog}>
            <View style={styles.cancelIconContainer}>
              <AlertTriangle size={32} color={COLORS.error[600]} />
            </View>
            <Text style={styles.cancelConfirmTitle}>Cancel Wash?</Text>
            <Text style={styles.cancelConfirmMessage}>
              Are you sure you want to cancel your wash? You may still be
              charged for the service.
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

      {/* Email Sent Notification */}
      {showEmailSent && (
        <View style={styles.emailSentOverlay}>
          <View style={styles.emailSentContainer}>
            <MailOpen size={32} color={COLORS.success[600]} />
            <Text style={styles.emailSentText}>
              Receipt sent to your email!
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for cancel button
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  washType: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    color: COLORS.gray[900],
    marginBottom: 4,
    textAlign: "center",
  },
  stationName: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  timerContent: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  timeRemaining: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  timeLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[600],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  currentStepContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  currentStepLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  stepCount: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconPlaceholder: {
    borderRadius: 4,
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 12,
    lineHeight: 20,
  },

  stepsListContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepsListTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  stepListItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeStepNumber: {
    backgroundColor: COLORS.primary[600],
  },
  completedStepNumber: {
    backgroundColor: COLORS.success[500],
  },
  stepNumber: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: COLORS.gray[700],
  },
  activeStepNumberText: {
    color: "#FFF",
  },
  stepListContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepListName: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[800],
  },
  activeStepListName: {
    fontFamily: "Inter-SemiBold",
    color: COLORS.primary[700],
  },
  completedStepListName: {
    color: COLORS.success[700],
  },
  stepDuration: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  cancelContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error[50],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  cancelText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.error[700],
    marginLeft: 8,
  },
  cancelConfirmOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  cancelConfirmDialog: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  cancelIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.error[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cancelConfirmTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  cancelConfirmMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  cancelConfirmButtons: {
    flexDirection: "row",
    width: "100%",
  },
  cancelConfirmNoButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  cancelConfirmYesButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.error[600],
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelConfirmNoText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.gray[700],
  },
  cancelConfirmYesText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
  completeContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  completeIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.success[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  completeTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  completeMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    textAlign: "center",
    marginBottom: 32,
  },
  washSummary: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
  },
  summaryValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 24,
  },
  servicesCompleted: {
    marginBottom: 24,
  },
  servicesTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[800],
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    marginBottom: 16,
  },
  invoiceButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 8,
  },
  homeButton: {
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  homeButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.primary[600],
  },
  noWashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noWashText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[700],
    marginBottom: 24,
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
  emailSentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  emailSentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emailSentText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  statusBanner: {
    padding: 16,
    backgroundColor: "#FFF",
    marginBottom: 24,
  },
  statusText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    textAlign: "center",
  },
  progressSection: {
    padding: 24,
    marginBottom: 16,
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary[600],
    borderRadius: 4,
  },
  progressContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  progressPercentage: {
    fontFamily: "Poppins-Bold",
    fontSize: 36,
    color: COLORS.gray[900],
  },
  progressLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  timeContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  currentStepSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    marginBottom: 24,
  },
  currentStepCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  stepProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  stepProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  stepProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
  stepProgressText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  stepsSection: {
    padding: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  activeStepItem: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
    borderBottomWidth: 0,
    padding: 12,
    marginBottom: 12,
  },
  completedStepItem: {
    opacity: 0.7,
  },
  stepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray[200],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeStepIndicator: {
    backgroundColor: COLORS.primary[600],
  },
  completedStepIndicator: {
    backgroundColor: COLORS.success[500],
  },
  stepContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[800],
  },
  activeStepTitle: {
    fontFamily: "Inter-SemiBold",
    color: COLORS.primary[700],
  },
  completedStepTitle: {
    color: COLORS.success[700],
  },
  activeStepBadge: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  activeStepBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: COLORS.primary[700],
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
