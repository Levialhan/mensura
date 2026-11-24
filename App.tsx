import { useEffect, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
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

export default function App() {
  useExitOnBack();

  return (
    <SafeAreaProvider>
      <Router />
    </SafeAreaProvider>
  );
}
