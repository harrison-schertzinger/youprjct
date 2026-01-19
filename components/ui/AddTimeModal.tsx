// AddTimeModal: Quick modal to manually add time to an active session
// Preset buttons for common durations + custom input

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { tokens } from '@/design/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (seconds: number) => void;
};

// Preset time options in minutes
const PRESETS = [5, 10, 15, 30];

export function AddTimeModal({ visible, onClose, onAdd }: Props) {
  const [customMinutes, setCustomMinutes] = useState('');

  const handlePreset = (minutes: number) => {
    onAdd(minutes * 60);
    onClose();
  };

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onAdd(mins * 60);
      setCustomMinutes('');
      onClose();
    }
  };

  const handleClose = () => {
    setCustomMinutes('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>Add Time</Text>
            <Text style={styles.subtitle}>
              Add time you spent before starting the timer
            </Text>

            {/* Preset buttons */}
            <View style={styles.presetRow}>
              {PRESETS.map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={styles.presetButton}
                  onPress={() => handlePreset(mins)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.presetText}>+{mins}m</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom input */}
            <View style={styles.customRow}>
              <TextInput
                style={styles.input}
                placeholder="Custom minutes"
                placeholderTextColor={tokens.colors.muted}
                keyboardType="number-pad"
                value={customMinutes}
                onChangeText={setCustomMinutes}
                returnKeyType="done"
                onSubmitEditing={handleCustomSubmit}
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !customMinutes && styles.addButtonDisabled,
                ]}
                onPress={handleCustomSubmit}
                disabled={!customMinutes}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    !customMinutes && styles.addButtonTextDisabled,
                  ]}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    ...tokens.typography.h3,
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  presetButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  customRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.sm,
    fontSize: 15,
    color: tokens.colors.text,
  },
  addButton: {
    paddingHorizontal: tokens.spacing.md,
    height: 44,
    backgroundColor: tokens.colors.tint,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: tokens.colors.border,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  addButtonTextDisabled: {
    color: tokens.colors.muted,
  },
  cancelButton: {
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.colors.muted,
  },
});
