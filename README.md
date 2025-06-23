# EcoScan - Sustainability Scanner Mobile App

A React Native mobile application that uses AI-powered image recognition to analyze the sustainability of everyday objects and provide eco-friendly alternatives.

## 📱 Features

- **AI-Powered Object Recognition**: Uses Google's Gemini API to identify objects from camera or gallery images
- **Sustainability Scoring**: Rates objects on a 1-10 scale based on environmental impact factors
- **Eco-Friendly Alternatives**: Suggests sustainable alternatives for scanned items
- **Educational Facts**: Provides interesting environmental facts about scanned objects
- **Local Storage**: Saves scanned items locally for offline access
- **Collection Management**: View, search, and manage your scanning history
- **Environmental UI**: Earth-tone design with nature-inspired elements

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: React Hooks
- **Local Storage**: AsyncStorage
- **Camera**: Expo Camera
- **Icons**: Lucide React Native
- **AI Integration**: Google Gemini API
- **TypeScript**: Full type safety

## 📁 Project Structure

```
├── app/
│   ├── _layout.tsx              # Root layout with navigation setup
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigation configuration
│       ├── index.tsx            # Scanner screen (main functionality)
│       ├── collection.tsx       # Collection view with search
│       └── about.tsx            # About and app information
├── components/
│   └── SustainabilityResult.tsx # Results display component
├── types/
│   └── sustainability.ts       # TypeScript interfaces
├── utils/
│   ├── geminiApi.ts            # Gemini API integration
│   └── storage.ts              # AsyncStorage utilities
└── hooks/
    └── useFrameworkReady.ts    # Framework initialization hook
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Google Gemini API key (optional - app includes mock data)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Gemini API** (Optional):
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `utils/geminiApi.ts`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Test the app**:
   - Scan QR code with Expo Go app
   - Or press 'w' to open in web browser

## 📋 Core Functionality

### 1. Object Scanning
- **Camera Integration**: Real-time camera view with scanning frame
- **Image Capture**: Take photos or select from gallery
- **AI Analysis**: Automatic object recognition and sustainability analysis

### 2. Sustainability Analysis
The app evaluates objects based on:
- Material composition and recyclability
- Manufacturing process impact  
- Carbon footprint and energy usage
- Durability and lifecycle assessment
- Packaging and transportation impact

### 3. Data Management
- **Local Storage**: All data stored locally using AsyncStorage
- **Collection View**: Browse scanning history with search functionality
- **Item Management**: Delete individual items from collection

### 4. User Interface
- **Environmental Theme**: Green color palette (#2D5016, #4CAF50, #F1F8E9)
- **Intuitive Navigation**: Tab-based navigation with clear icons
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: Proper contrast ratios and readable fonts

## 🎯 Key Components

### Scanner Screen (`app/(tabs)/index.tsx`)
- Camera permissions handling
- Image capture and processing
- Real-time analysis with loading states
- Results display with sustainability metrics

### Collection Screen (`app/(tabs)/collection.tsx`)
- Grid/list view of scanned items
- Search and filter functionality
- Item deletion and management
- Pull-to-refresh capability

### Sustainability Result Component (`components/SustainabilityResult.tsx`)
- Score visualization with color coding
- Environmental impact details
- Alternative suggestions
- Educational facts display

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

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. The app works with mock data by default.

### Gemini API Setup (Optional)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `utils/geminiApi.ts`

## 🎨 Design Philosophy

The app follows a **sustainable design approach**:
- **Earth-tone color palette** reflecting environmental consciousness
- **Minimalist interface** reducing cognitive load
- **Intuitive navigation** with clear visual hierarchy
- **Educational focus** promoting environmental awareness

## 📱 Platform Support

- **iOS**: Full functionality including camera
- **Android**: Full functionality including camera  
- **Web**: Limited functionality (no camera access)

## 🔄 Future Enhancements

Potential improvements for expanded functionality:
- Cloud synchronization with user accounts
- Social sharing of sustainability insights
- Barcode scanning for product databases
- Carbon footprint tracking over time
- Community ratings and reviews
- Integration with shopping apps

## 🧪 Testing

### Mock Data
The app includes comprehensive mock data for testing:
- Various object categories (electronics, clothing, household items)
- Realistic sustainability scores and alternatives
- Educational facts about environmental impact

### Development Testing
1. Test camera permissions on physical device
2. Verify image capture and analysis flow
3. Test local storage persistence
4. Validate search and filter functionality

## 📄 License

This project is created for educational purposes as a college-level mobile application development project.

## 🤝 Contributing

This is an academic project. For educational use and learning purposes.

---

**Built with 💚 for a sustainable future**

*EcoScan helps users make environmentally conscious choices through AI-powered sustainability analysis.*