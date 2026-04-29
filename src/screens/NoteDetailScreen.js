import React, { useMemo } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const formatDate = (isoString) => {
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const d = new Date(isoString);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const CheckItem = ({ text, checked, onToggle, styles }) => (
  <TouchableOpacity style={styles.checkRow} onPress={onToggle} activeOpacity={0.7}>
    <View style={[styles.checkCircle, checked && styles.checkCircleChecked]}>
      {checked && <View style={styles.checkDot} />}
    </View>
    <Text style={[styles.checkText, checked && styles.checkTextDone]}>{text}</Text>
  </TouchableOpacity>
);

export default function NoteDetailScreen({ route, navigation, notes, setNotes }) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { noteId } = route.params;
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Not bulunamadı.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'< Notlar'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const lines = note.content ? note.content.split('\n').filter((l) => l.trim()) : [];
  const isList = lines.length > 1;
  const checkedItems = note.checkedItems ?? {};

  const toggleCheck = (idx) => {
    setNotes((prev) =>
      prev.map((n) => n.id === noteId
        ? { ...n, checkedItems: { ...n.checkedItems, [idx]: !n.checkedItems?.[idx] } }
        : n,
      ),
    );
  };

  const handleDelete = () => {
    Alert.alert('Notu Sil', 'Bu notu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => { setNotes((prev) => prev.filter((n) => n.id !== noteId)); navigation.goBack(); } },
    ]);
  };

  const getTagStyle = () => {
    if (note.tag === 'Market')  return { bg: colors.chipMarket,  text: colors.chipMarketText,  border: colors.chipMarketBorder };
    if (note.tag === 'Kişisel') return { bg: colors.chipKisisel, text: colors.chipKisiselText, border: colors.chipKisiselBorder };
    return null;
  };
  const tagStyle = getTagStyle();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backBtn}>{'< Notlar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditNote', { noteId })} activeOpacity={0.7}>
          <Text style={styles.editBtn}>Düzenle</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{formatDate(note.date)}</Text>
        <Text style={styles.title}>{note.title}</Text>
        <View style={styles.divider} />
        {isList ? (
          <View style={styles.checkList}>
            {lines.map((line, idx) => (
              <CheckItem key={idx} text={line} checked={!!checkedItems[idx]} onToggle={() => toggleCheck(idx)} styles={styles} />
            ))}
          </View>
        ) : note.content ? (
          <Text style={styles.contentText}>{note.content}</Text>
        ) : null}
        {tagStyle && (
          <>
            <View style={styles.divider} />
            <Text style={styles.tagLabel}>Etiket</Text>
            <View style={[styles.tagBadge, { backgroundColor: tagStyle.bg, borderColor: tagStyle.border }]}>
              <Text style={[styles.tagBadgeText, { color: tagStyle.text }]}>{note.tag}</Text>
            </View>
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.85}>
          <Text style={styles.deleteIcon}>🗑</Text>
          <Text style={styles.deleteBtnText}>Notu Sil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontSize: 16, color: colors.textSecondary },
  navBar: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  editBtn: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, flexGrow: 1 },
  date: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 16, lineHeight: 34 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  contentText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  checkList: { gap: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.5,
    borderColor: colors.circleBorder, alignItems: 'center', justifyContent: 'center',
  },
  checkCircleChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  checkDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  checkText: { fontSize: 15, color: colors.text, flex: 1 },
  checkTextDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  tagLabel: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 10 },
  tagBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  tagBadgeText: { fontSize: 13, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.background },
  deleteBtn: {
    backgroundColor: colors.danger, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  deleteIcon: { fontSize: 16 },
  deleteBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});