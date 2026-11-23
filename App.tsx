import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import HomeScreen from './src/screens/HomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import CompassScreen from './src/screens/CompassScreen';
import UnitConverterScreen from './src/screens/UnitConverterScreen';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import StopwatchScreen from './src/screens/StopwatchScreen';
import RulerScreen from './src/screens/RulerScreen';
import ProScreen from './src/screens/ProScreen';

function Router() {
  const screen = useAppStore((s) => s.screen);

  switch (screen) {
    case 'level':
      return <LevelScreen />;
    case 'compass':
      return <CompassScreen />;
    case 'converter':
      return <UnitConverterScreen />;
    case 'tip':
      return <TipCalculatorScreen />;
    case 'stopwatch':
      return <StopwatchScreen />;
    case 'ruler':
      return <RulerScreen />;
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
