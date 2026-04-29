# QuickNote

Pratech Stajyer Case Çalışması kapsamında geliştirilmiş, React Native CLI ile yazılmış hızlı not alma uygulaması.

---

## Özellikler

### Temel
- Not ekleme, görüntüleme ve silme
- Market / Kişisel etiketleme sistemi
- Çok satırlı notlarda otomatik checklist modu
- Başlık ve içerikte arama
- Etikete göre filtreleme (Tümü / Market / Kişisel)
- Boş state ekranı

### Bonus
- Not düzenleme (Edit ekranı)
- Swipe-to-delete ile kaydırarak silme
- Dark mode desteği (sistem temasını takip eder)

---

## Ekranlar

| Ekran | Açıklama |
|-------|----------|
| Home | Not listesi, arama, filtreleme, boş state |
| Add Note | Başlık, içerik, etiket seçimi |
| Note Detail | Notun tam görünümü, checklist, silme |
| Edit Note | Mevcut notu düzenleme |

---

## Kurulum

### Gereksinimler
- Node.js 18+
- React Native CLI
- Xcode 14+ (iOS için)
- CocoaPods

### Adımlar

1. Repoyu klonla:

git clone https://github.com/osmanbabayigit/QuickNote.git
cd QuickNote

2. Bağımlılıkları yükle:

npm install

3. iOS için pod'ları yükle:

cd ios && pod install && cd ..

4. Metro'yu başlat:

npm start

5. Uygulamayı çalıştır:

npm run ios

---

## Proje Yapısı

```
src/
├── screens/
│   ├── HomeScreen.js
│   ├── AddNoteScreen.js
│   ├── NoteDetailScreen.js
│   └── EditNoteScreen.js
└── theme/
    ├── colors.js
    └── ThemeContext.js
```
---

## Kullanılan Teknolojiler

- React Native CLI
- React Navigation (Native Stack)
- React Native Gesture Handler (Swipe)
- React Native Safe Area Context
- Context API (Dark mode)

---

## Geliştirici

- Ad Soyad: Osman Babayigit
- E-posta: Osmanbabayigi1@icloud.com
- Universite / Bolum: Sivas Cumhuriyet Universitesi / Bilgisayar Muhendisligi
