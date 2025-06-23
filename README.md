# EcoScan - Sustainability Scanner Mobile App


A React Native mobile application that uses AI-powered image recognition to analyze the sustainability of everyday objects and provide eco-friendly alternatives.

## 📱 Features

- **Custom AI-Powered Object Recognition**: Utilizes a custom-trained API built with **scikit-learn** and **TensorFlow** to identify objects from camera or gallery images
- **Trained on Kaggle Dataset**: The AI model was trained on a Kaggle dataset containing over **15,000 labeled images** of common household, fashion, and consumer items
- **Hosted API Integration**: The trained model has been deployed as a live API to process images and return sustainability-related insights
- **Sustainability Scoring**: Rates objects on a 1–10 scale based on environmental impact factors
- **Eco-Friendly Alternatives**: Recommends more sustainable alternatives tailored to the scanned object
- **Educational Facts**: Displays environmental facts and sustainability knowledge based on the identified item
- **Local Data Storage**: All scanned item data is stored locally using **AsyncStorage**, ensuring fast retrieval and offline access
- **Collection Management**: Allows users to view, search, refresh, and delete previously scanned items
- **Environmental UI**: Earth-tone design inspired by nature, with soft greens and browns
- **Cross-Platform Support**: Fully functional on Android and iOS; web support with limited features
- **Modular AI Backends**: Includes both Google Gemini and the custom API (`sustainabilityApi.ts`) for flexible integration

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: React Hooks
- **Local Storage**: AsyncStorage for persistence and offline use
- **Camera**: Expo Camera
- **Icons**: Lucide React Native
- **AI Integration**: Custom API (TensorFlow + scikit-learn) hosted from trained model
- **TypeScript**: Full type safety

## 📁 Project Structure

```
├── app/
│   ├── _layout.tsx              
│   ├── +not-found.tsx
│   └── (tabs)/
│       ├── _layout.tsx          
│       ├── index.tsx            # Scanner screen
│       ├── collection.tsx       # View and manage scans
│       └── about.tsx            # About and info screen
├── assets/
│   └── images/
├── components/
│   └── SustainabilityResult.tsx
├── hooks/
│   └── useFrameworkReady.ts
├── types/
│   └── sustainability.ts
├── utils/
│   ├── geminiApi.ts
│   ├── sustainabilityApi.ts     # Custom trained API integration
│   └── storage.ts               # AsyncStorage helper functions
├── README.md
├── app.json
├── tsconfig.json
├── package.json
└── config files...
```

## 📊 Data Models

### ScannedItem Interface
```typescript
interface ScannedItem {
  id: string;
  imageUri: string;
  objectName: string;
  category: string;
  sustainabilityScore: number;
  environmentalImpact: string;
  ecoFriendlyAlternatives: string[];
  facts: string[];
  scannedAt: string;
}
```

## 🗄️ Data Storage

- Scanned items are saved locally using **AsyncStorage**
- Offline access to scan history and analysis
- Efficient read/write utilities defined in `utils/storage.ts`
- Each scanned object includes metadata, analysis results, and timestamp

## 🎨 Design Philosophy

The app follows a **sustainable design approach**:
- **Modern color palette**
- **Minimalist and clear layout** to reduce cognitive load
- **Education-first design** that promotes environmental awareness through engaging feedback

## User Interface
EcoScan embraces a modern, card-based UI that balances usability with environmental awareness:

🎨 Modern Card-Based Layout: Each section (Mission, Features, Impact, etc.) is displayed in clean, shadowed cards for better readability and visual flow.

🌈 Thematic Icons & Color Coding: Each feature and section is paired with a meaningful icon and color to enhance clarity and emotional engagement.

🌿 Eco-Conscious Aesthetic: Inspired by sustainability, the color scheme uses soft backgrounds, pastel highlights, and natural tones.

📱 Responsive and Mobile-First: Designed for mobile screens using React Native’s flexible styling to ensure smooth rendering across devices.

♿ Accessible by Design: Clear typography, proper contrast, and spacing make the app easy to navigate for all users.

The UI not only reflects EcoScan’s environmental mission but also ensures a delightful and intuitive user experience.

## 📱 Platform Support

- **iOS**: Full functionality including camera
- **Android**: Full functionality including camera
- **Web**: Limited support (no camera access, mock scanning only)

## 🔄 Future Enhancements

- Cloud sync for user collections
- Barcode scanning support
- Carbon footprint tracker
- Social sharing and community challenges
- Integration with eco-conscious product APIs

---

**Built with love for a sustainable future**  
*EcoScan empowers users to make informed, eco-friendly choices using custom AI and real-time sustainability insights.*
