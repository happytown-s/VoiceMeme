import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <View key={label} style={styles.stepRow}>
            <View style={styles.stepInfo}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNum,
                      isCurrent && styles.stepNumCurrent,
                    ]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isCurrent && styles.labelCurrent,
                  isCompleted && styles.labelCompleted,
                ]}
              >
                {label}
              </Text>
            </View>
            {i < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.connectorCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

interface ActionButtonProps {
  title: string;
  icon?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function ActionButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        variant === 'primary' && styles.actionBtnPrimary,
        variant === 'secondary' && styles.actionBtnSecondary,
        variant === 'ghost' && styles.actionBtnGhost,
        disabled && styles.actionBtnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.actionIcon}>{icon}</Text>}
      <Text
        style={[
          styles.actionText,
          variant === 'ghost' && styles.actionTextGhost,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stepRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepInfo: {
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dfe6e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: '#00b894',
  },
  circleCurrent: {
    backgroundColor: '#6C5CE7',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNum: {
    color: '#b2bec3',
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumCurrent: {
    color: '#ffffff',
  },
  label: {
    fontSize: 10,
    color: '#b2bec3',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 60,
  },
  labelCurrent: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  labelCompleted: {
    color: '#00b894',
  },
  connector: {
    width: 32,
    height: 2,
    backgroundColor: '#dfe6e9',
    marginBottom: 20,
  },
  connectorCompleted: {
    backgroundColor: '#00b894',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionBtnPrimary: {
    backgroundColor: '#6C5CE7',
  },
  actionBtnSecondary: {
    backgroundColor: '#f0edff',
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  actionBtnGhost: {
    backgroundColor: 'transparent',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionTextGhost: {
    color: '#6C5CE7',
  },
});
