import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const TAG_OPTIONS = ['Market', 'Kişisel'];

const TagChip = ({ label, selected, onPress, colors }) => {
  const getScheme = () => {
    if (label === 'Market') return selected
      ? { bg: colors.chipMarket, text: colors.chipMarketText, border: colors.chipMarketBorder }
      : { bg: colors.card, text: colors.textSecondary, border: colors.border };
    if (label === 'Kişisel') return selected
      ? { bg: colors.chipKisisel, text: colors.chipKisiselText, border: colors.chipKisiselBorder }
      : { bg: colors.card, text: colors.textSecondary, border: colors.border };
    return { bg: colors.card, text: colors.textSecondary, border: colors.border };
  };
  const s = getScheme();
  return (
    <TouchableOpacity
      style={[{ paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, borderWidth: 1.5, backgroundColor: s.bg, borderColor: s.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[{ fontSize: 14, fontWeight: '600', color: s.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function AddNoteScreen({ navigation, setNotes }) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const dynStyles = useMemo(() => createStyles(colors), [colors]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const handleSave = () => {
    if (!title.trim()) { Alert.alert('Uyarı', 'Lütfen bir başlık girin.'); return; }
    setNotes((prev) => [
      { id: Date.now().toString(), title: title.trim(), content: content.trim(), tag: selectedTag, date: new Date().toISOString(), checkedItems: {} },
      ...prev,
    ]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={dynStyles.safe} edges={['top']}>
      <View style={dynStyles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={dynStyles.backBtn}>{'< Geri'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={dynStyles.scroll} contentContainerStyle={dynStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={dynStyles.screenTitle}>Yeni Not</Text>
        <Text style={dynStyles.label}>Başlık</Text>
        <View style={dynStyles.inputCard}>
          <TextInput style={dynStyles.titleInput} placeholder="Not başlığı girin..." placeholderTextColor={colors.placeholder} value={title} onChangeText={setTitle} maxLength={80} />
        </View>
        <Text style={dynStyles.label}>İçerik</Text>
        <View style={dynStyles.inputCard}>
          <TextInput style={dynStyles.contentInput} placeholder="Notunuzu buraya yazın..." placeholderTextColor={colors.placeholder} value={content} onChangeText={setContent} multiline textAlignVertical="top" />
        </View>
        <Text style={dynStyles.label}>Etiket Seç</Text>
        <View style={dynStyles.tagRow}>
          {TAG_OPTIONS.map((tag) => (
            <TagChip key={tag} label={tag} selected={selectedTag === tag} colors={colors} onPress={() => setSelectedTag((prev) => (prev === tag ? null : tag))} />
          ))}
        </View>
      </ScrollView>
      <View style={[dynStyles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={dynStyles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={dynStyles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  navBar: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  backBtn: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  screenTitle: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 8, marginLeft: 2 },
  inputCard: {
    backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  titleInput: { fontSize: 15, color: colors.text, paddingVertical: 14 },
  contentInput: { fontSize: 15, color: colors.text, minHeight: 130, paddingVertical: 14, lineHeight: 22 },
  tagRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  tagChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, borderWidth: 1.5 },
  tagChipText: { fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.background },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});