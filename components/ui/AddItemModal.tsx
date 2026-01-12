import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { tokens } from '@/design/tokens';
import { Goal } from '@/lib/goals';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, label?: string, goal?: Goal) => void;
  title: string;
  placeholder: string;
  showLabelInput?: boolean;
  labelPlaceholder?: string;
  goals?: Goal[];
};

export function AddItemModal({
  visible,
  onClose,
  onSubmit,
  title,
  placeholder,
  showLabelInput = false,
  labelPlaceholder = 'Label (optional)',
  goals,
}: Props) {
  const [itemTitle, setItemTitle] = useState('');
  const [itemLabel, setItemLabel] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  const handleSubmit = () => {
    if (!itemTitle.trim()) return;
    onSubmit(itemTitle.trim(), itemLabel.trim() || undefined, selectedGoal);
    setItemTitle('');
    setItemLabel('');
    setSelectedGoal(undefined);
    onClose();
  };

  const handleClose = () => {
    setItemTitle('');
    setItemLabel('');
    setSelectedGoal(undefined);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
            <Text style={styles.title}>{title}</Text>

            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={tokens.colors.muted}
              value={itemTitle}
              onChangeText={setItemTitle}
              autoFocus
            />

            {showLabelInput && (
              <TextInput
                style={styles.input}
                placeholder={labelPlaceholder}
                placeholderTextColor={tokens.colors.muted}
                value={itemLabel}
                onChangeText={setItemLabel}
              />
            )}

            {goals && goals.length > 0 && (
              <View style={styles.goalSection}>
                <Text style={styles.goalLabel}>Link to Goal</Text>
                <Pressable style={styles.goalSelector} onPress={() => setShowGoalPicker(!showGoalPicker)}>
                  <Text style={[styles.goalSelectorText, !selectedGoal && styles.goalPlaceholder]}>
                    {selectedGoal?.title || 'Select a goal (optional)'}
                  </Text>
                  <Text style={styles.chevron}>{showGoalPicker ? '▲' : '▼'}</Text>
                </Pressable>

                {showGoalPicker && (
                  <View style={styles.goalList}>
                    <Pressable style={styles.goalOption} onPress={() => { setSelectedGoal(undefined); setShowGoalPicker(false); }}>
                      <Text style={[styles.goalOptionText, styles.goalPlaceholder]}>No goal</Text>
                    </Pressable>
                    {goals.map(goal => (
                      <Pressable
                        key={goal.id}
                        style={[styles.goalOption, selectedGoal?.id === goal.id && styles.goalOptionSelected]}
                        onPress={() => { setSelectedGoal(goal); setShowGoalPicker(false); }}
                      >
                        <Text style={styles.goalOptionText}>{goal.title}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.buttons}>
              <Pressable style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.submitBtn, !itemTitle.trim() && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={!itemTitle.trim()}
              >
                <Text style={styles.submitText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  keyboardView: { width: '100%', alignItems: 'center' },
  modal: { width: '85%', backgroundColor: tokens.colors.card, borderRadius: tokens.radius.lg, padding: tokens.spacing.lg },
  title: { fontSize: 18, fontWeight: '800', color: tokens.colors.text, marginBottom: tokens.spacing.md },
  input: { height: 48, borderWidth: 1, borderColor: tokens.colors.border, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.spacing.md, fontSize: 16, color: tokens.colors.text, backgroundColor: tokens.colors.bg, marginBottom: tokens.spacing.sm },
  goalSection: { marginTop: tokens.spacing.xs, marginBottom: tokens.spacing.sm },
  goalLabel: { fontSize: 12, fontWeight: '700', color: tokens.colors.muted, marginBottom: tokens.spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  goalSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, borderWidth: 1, borderColor: tokens.colors.border, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.spacing.md, backgroundColor: tokens.colors.bg },
  goalSelectorText: { fontSize: 16, color: tokens.colors.text },
  goalPlaceholder: { color: tokens.colors.muted },
  chevron: { fontSize: 12, color: tokens.colors.muted },
  goalList: { marginTop: tokens.spacing.xs, borderWidth: 1, borderColor: tokens.colors.border, borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.card, maxHeight: 150 },
  goalOption: { paddingVertical: 12, paddingHorizontal: tokens.spacing.md, borderBottomWidth: 1, borderBottomColor: tokens.colors.border },
  goalOptionSelected: { backgroundColor: tokens.colors.bg },
  goalOptionText: { fontSize: 15, color: tokens.colors.text },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: tokens.spacing.md, gap: tokens.spacing.sm },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: tokens.spacing.lg, borderRadius: tokens.radius.sm },
  cancelText: { fontSize: 16, fontWeight: '600', color: tokens.colors.muted },
  submitBtn: { paddingVertical: 12, paddingHorizontal: tokens.spacing.lg, borderRadius: tokens.radius.sm, backgroundColor: tokens.colors.tint },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
