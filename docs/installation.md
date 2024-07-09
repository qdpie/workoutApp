---
title: Installation
layout: default
nav_order: 2
---

# Installation and Running the App

## Web Version

This app is created using React Native and run using Expo. This means that the app is very versatile and can run on most platforms.

For the simplest use case we are hosting the app directly on the web. This is intended as a mobile app. There are no plans to implement a desktop version so it is recommended to use on your phone's browser.

Scan the QR code:

<img src="assets/qrcode_shapeshiftapp.netlify.app.png">

or follow this [link](https://shapeshiftapp.netlify.app/).

## Run With Expo (developer experience recommended)

### System Requirements

The long term goal for the app is to deploy as a mobile application. We can simulate this by running on an emulator.
To run on an emulator you will need either a Mac or a Windows machine with the latest major versions installed.

#### Software dependencies

- NodeJS 18 or newer
- VS code or terminal to run Expo
- Download or clone: [Code Repo](https://github.com/jpe0824/workoutApp)
- Option 1 (Recommended) - Use your phone to emulate
  - Expo mobile app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US&pli=1), [Apple](https://apps.apple.com/us/app/expo-go/id982107779))
- Option 2 - Emulate using a simulator

  - A mobile device simulator for iOS or Android (See below)

    #### Mac

    - Xcode ([Latest Version](https://apps.apple.com/us/app/xcode/id497799835))
    - iOS Simulator ([How to add simulators to ios](https://developer.apple.com/documentation/safari-developer-tools/adding-additional-simulators))

    #### Windows

    - Android Studio ([Latest Version](https://developer.android.com/studio))
    - Android Simulator ([How to add virtual android device](https://developer.android.com/studio/run/managing-avds))

### Install and Launch

Install dependencies.
First ensure that you are in the frontend directory of the project.

```sh
root/workoutApp/frontend
```

Run in the terminal:

```sh
npm install
```

Option 1:
Run the app using expo.
Scan the QR code from the terminal.

```sh
npm run start
```

Option 2:
Run using expo and an emulator on your machine

```sh
npm run ios
```

```sh
npm run android
```
