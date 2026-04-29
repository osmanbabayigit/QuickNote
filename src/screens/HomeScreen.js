import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, useColorScheme,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getTagStyle = (tag, colors) => {
  if (tag === 'Market')  return { bg: colors.chipMarket,  text: colors.chipMarketText,  border: colors.chipMarketBorder };
  if (tag === 'Kişisel') return { bg: colors.chipKisisel, text: colors.chipKisiselText, border: colors.chipKisiselBorder };
  return null;
};

// ─── Note Card ────────────────────────────────────────────────────────────────

const NoteCard = ({ note, onPress, onDelete, colors, styles }) => {
  const swipeRef = useRef(null);
  const tagStyle = getTagStyle(note.tag, colors);
  const lines = note.content ? note.content.split('\n').filter((l) => l.trim()) : [];
  const isList = lines.length > 1;
  const checkedItems = note.checkedItems ?? {};

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.swipeAction}
          onPress={() => { swipeRef.current?.close(); onDelete(note.id); }}
          activeOpacity={0.8}
        >
          <Text style={styles.swipeActionIcon}>🗑</Text>
          <Text style={styles.swipeActionText}>Sil</Text>
        </TouchableOpacity>
      )}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
        <Text style={styles.cardTitle} numberOfLines={2}>{note.title}</Text>
        {isList ? (
          <View style={styles.listPreview}>
            {lines.slice(0, 3).map((line, idx) => {
              const checked = !!checkedItems[idx];
              return (
                <View key={idx} style={styles.listItem}>
                  <View style={[styles.circle, checked && styles.circleChecked]}>
                    {checked && <View style={styles.circleDot} />}
                  </View>
                  <Text style={[styles.listItemText, checked && styles.listItemDone]} numberOfLines={1}>
                    {line}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : note.content ? (
          <Text style={styles.cardContent} numberOfLines={2}>{note.content}</Text>
        ) : null}
        {tagStyle && (
          <View style={[styles.tagBadge, { backgroundColor: tagStyle.bg, borderColor: tagStyle.border }]}>
            <Text style={[styles.tagBadgeText, { color: tagStyle.text }]}>{note.tag}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

// ─── Filter Chip ──────────────────────────────────────────────────────────────

const FilterChip = ({ label, active, onPress, styles, colors }) => {
  const getActiveStyle = () => {
    if (label === 'Market')  return { bg: colors.chipMarket,  border: colors.chipMarketBorder,  text: colors.chipMarketText };
    if (label === 'Kişisel') return { bg: colors.chipKisisel, border: colors.chipKisiselBorder, text: colors.chipKisiselText };
    return { bg: colors.primary, border: colors.primary, text: colors.white };
  };
  const a = getActiveStyle();
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        active && { backgroundColor: a.bg, borderColor: a.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, active && { color: a.text, fontWeight: '600' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ styles }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <Text style={styles.emptyIcon}>🗒</Text>
    </View>
    <Text style={styles.emptyTitle}>Henüz not yok</Text>
    <Text style={styles.emptySubtitle}>{'İlk notunu eklemek için aşağıdaki\nbutona tıkla'}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

const FILTERS = ['Tümü', 'Market', 'Kişisel'];

export default function HomeScreen({ navigation, notes, setNotes }) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const filtered = useMemo(() => {
    let result = notes;
    if (activeFilter !== 'Tümü') result = result.filter((n) => n.tag === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [notes, activeFilter, search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Notlar</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Notlarda ara..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
              styles={styles}
              colors={colors}
            />
          ))}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={filtered.length === 0 ? styles.flatEmpty : styles.flatContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState styles={styles} />}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              colors={colors}
              styles={styles}
              onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
              onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
            />
          )}
        />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddNote')}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>+ Yeni Not Ekle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Dynamic Styles ───────────────────────────────────────────────────────────

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  screenTitle: { fontSize: 32, fontWeight: '700', color: colors.text, marginBottom: 16 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, padding: 0 },
  clearIcon: { fontSize: 14, color: colors.textSecondary, paddingLeft: 8 },

  filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  filterChipText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },

  flatContent: { paddingBottom: 20, gap: 12 },
  flatEmpty: { flexGrow: 1 },

  swipeAction: {
    backgroundColor: colors.danger, justifyContent: 'center', alignItems: 'center',
    width: 80, borderRadius: 14, marginLeft: 8, gap: 4,
  },
  swipeActionIcon: { fontSize: 18 },
  swipeActionText: { color: colors.white, fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  cardContent: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  listPreview: { gap: 6, marginBottom: 10 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  circle: {
    width: 14, height: 14, borderRadius: 7, borderWidth: 1.5,
    borderColor: colors.circleBorder, alignItems: 'center', justifyContent: 'center',
  },
  circleChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  circleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  listItemText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  listItemDone: { textDecorationLine: 'line-through', color: colors.placeholder },
  tagBadge: {
    alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, marginTop: 4,
  },
  tagBadgeText: { fontSize: 12, fontWeight: '600' },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  emptyIcon: { fontSize: 34 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.background },
  addBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  addBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});