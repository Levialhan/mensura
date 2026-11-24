import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Platform, ToastAndroid } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import { useTheme } from './src/hooks/useTheme';
import HomeScreen from './src/screens/HomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import CompassScreen from './src/screens/CompassScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import UnitConverterScreen from './src/screens/UnitConverterScreen';
import CountdownTimerScreen from './src/screens/CountdownTimerScreen';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import StopwatchScreen from './src/screens/StopwatchScreen';
import RandomPickerScreen from './src/screens/RandomPickerScreen';
import RulerScreen from './src/screens/RulerScreen';
import ProtractorScreen from './src/screens/ProtractorScreen';
import MagnifierScreen from './src/screens/MagnifierScreen';
import FlashlightScreen from './src/screens/FlashlightScreen';
import QrScannerScreen from './src/screens/QrScannerScreen';
import AltimeterScreen from './src/screens/AltimeterScreen';
import PedometerScreen from './src/screens/PedometerScreen';
import SpeedometerScreen from './src/screens/SpeedometerScreen';
import SoundLevelMeterScreen from './src/screens/SoundLevelMeterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProScreen from './src/screens/ProScreen';

function Router() {
  const screen = useAppStore((s) => s.screen);

  switch (screen) {
    case 'level':
      return <LevelScreen />;
    case 'compass':
      return <CompassScreen />;
    case 'calculator':
      return <CalculatorScreen />;
    case 'converter':
      return <UnitConverterScreen />;
    case 'countdown':
      return <CountdownTimerScreen />;
    case 'tip':
      return <TipCalculatorScreen />;
    case 'stopwatch':
      return <StopwatchScreen />;
    case 'random':
      return <RandomPickerScreen />;
    case 'ruler':
      return <RulerScreen />;
    case 'protractor':
      return <ProtractorScreen />;
    case 'magnifier':
      return <MagnifierScreen />;
    case 'flashlight':
      return <FlashlightScreen />;
    case 'qr':
      return <QrScannerScreen />;
    case 'altimeter':
      return <AltimeterScreen />;
    case 'pedometer':
      return <PedometerScreen />;
    case 'speedometer':
      return <SpeedometerScreen />;
    case 'sound':
      return <SoundLevelMeterScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'pro':
      return <ProScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

function useExitOnBack() {
  const lastPress = useRef(0);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const { screen, goHome } = useAppStore.getState();
      // From any tool screen, go back to the home grid.
      if (screen !== 'home') {
        goHome();
        return true;
      }
      // On the home screen: require a second tap within 2s to actually exit.
      const now = Date.now();
      if (now - lastPress.current < 2000) {
        return false; // allow the app to exit
      }
      lastPress.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Tap again to exit', ToastAndroid.SHORT);
      }
      return true;
    });
    return () => sub.remove();
  }, []);
}

function AnimatedRouter() {
  const { colors } = useTheme();
  const screen = useAppStore((s) => s.screen);
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [screen, opacity, translateY]);

  return (
    <Animated.View
      style={{ flex: 1, backgroundColor: colors.bg, opacity, transform: [{ translateY }] }}
    >
      <Router />
    </Animated.View>
  );
}

// Keep the native splash screen visible until preferences are rehydrated, so
// a saved dark theme doesn't flash white on launch.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useExitOnBack();
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AnimatedRouter />
    </SafeAreaProvider>
  );
}
