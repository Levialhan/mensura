import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import HomeScreen from './src/screens/HomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import UnitConverterScreen from './src/screens/UnitConverterScreen';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import StopwatchScreen from './src/screens/StopwatchScreen';
import ProScreen from './src/screens/ProScreen';

function Router() {
  const screen = useAppStore((s) => s.screen);

  switch (screen) {
    case 'level':
      return <LevelScreen />;
    case 'converter':
      return <UnitConverterScreen />;
    case 'tip':
      return <TipCalculatorScreen />;
    case 'stopwatch':
      return <StopwatchScreen />;
    case 'pro':
      return <ProScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Router />
    </SafeAreaProvider>
  );
}
