# Pokemon Cards App

A React Native mobile application that allows users to browse Pokemon cards with smooth swipe animations, view details, and save favorites.

## Demo

https://github.com/user-attachments/assets/cacbbe9d-c038-41fa-b230-f67eea29d5da

## Features

- Browse Pokemon cards with smooth swipe animations
- Swipe right to add cards to favorites
- Swipe left to skip cards
- View animated experience progress for each Pokemon
- Browse your collection of favorite Pokemon
- Reactive feedback (green LIKE / red NOPE)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Bun](https://bun.sh/) for fast package installation and script running
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [iOS Simulator](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device) or [Android Emulator](https://developer.android.com/studio/run/emulator) (optional for mobile testing)
- Physical mobile device with [Expo Go](https://expo.dev/client) app (alternative for mobile testing)

## Setup and Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd pokemon-cards
   ```

2. Install dependencies using Bun
   ```
   bun install
   ```

3. Start the development server
   ```
   bun start
   ```

4. Run on specific platforms
   ```
   # For iOS
   bun run ios
   
   # For Android
   bun run android
   ```

- Make sure your simulator/emulator is running before launching the app with `bun run ios` or `bun run android`
