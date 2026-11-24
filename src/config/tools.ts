import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Screen } from '../store/useAppStore';

export type ToolId =
  | 'level'
  | 'compass'
  | 'calculator'
  | 'converter'
  | 'countdown'
  | 'tip'
  | 'stopwatch'
  | 'random'
  | 'ruler'
  | 'protractor'
  | 'magnifier'
  | 'flashlight'
  | 'qr'
  | 'altimeter'
  | 'pedometer'
  | 'speedometer'
  | 'sound';

export type Tier = 'free' | 'pro';
export type Status = 'ready' | 'soon';
export type Category = 'measure' | 'convert' | 'sensors' | 'everyday';

export const CATEGORIES: {
  id: Category;
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  { id: 'measure', label: 'Measure', icon: 'ruler' },
  { id: 'convert', label: 'Convert', icon: 'swap-horizontal' },
  { id: 'sensors', label: 'Sensors', icon: 'speedometer' },
  { id: 'everyday', label: 'Everyday', icon: 'apps' },
];

export interface Tool {
  id: ToolId;
  name: string;
  subtitle: string;
  description: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  tier: Tier;
  status: Status;
  category: Category;
  /** Screen a ready tool opens. Undefined for coming-soon tools. */
  screen?: Screen;
}

export const TOOLS: Tool[] = [
  // ---- Free (core) ----
  { id: 'level', name: 'Level', subtitle: 'Spirit level & bullseye', description: 'Check if a surface is level or plumb with a bullseye and dual-axis readout. Zero it to calibrate.', icon: 'bullseye', tier: 'free', status: 'ready', category: 'measure', screen: 'level' },
  { id: 'compass', name: 'Compass', subtitle: 'Find true north', description: 'A live magnetic compass showing your heading in degrees and cardinal direction.', icon: 'compass-outline', tier: 'free', status: 'ready', category: 'measure', screen: 'compass' },
  { id: 'calculator', name: 'Calculator', subtitle: 'Quick arithmetic', description: 'A simple four-function calculator with percent, sign and decimals.', icon: 'calculator', tier: 'free', status: 'ready', category: 'convert', screen: 'calculator' },
  { id: 'converter', name: 'Converter', subtitle: 'Length, weight, temp & more', description: 'Convert between length, weight, volume, temperature, area, speed and time.', icon: 'swap-horizontal', tier: 'free', status: 'ready', category: 'convert', screen: 'converter' },
  { id: 'countdown', name: 'Countdown', subtitle: 'Timer with presets', description: 'A countdown timer with quick presets and fine adjustment. It taps you when time is up.', icon: 'timer-sand', tier: 'free', status: 'ready', category: 'convert', screen: 'countdown' },
  { id: 'tip', name: 'Tip Split', subtitle: 'Tip, tax & split the bill', description: 'Calculate a tip and split the bill between any number of people.', icon: 'cash-multiple', tier: 'free', status: 'ready', category: 'convert', screen: 'tip' },
  { id: 'stopwatch', name: 'Stopwatch', subtitle: 'Timer with lap times', description: 'A lap timer that records split times as you go.', icon: 'timer-outline', tier: 'free', status: 'ready', category: 'everyday', screen: 'stopwatch' },
  { id: 'random', name: 'Random', subtitle: 'Dice, coin & wheel', description: 'Roll a die, flip a coin, or spin a decision wheel to settle any question.', icon: 'dice-multiple', tier: 'free', status: 'ready', category: 'everyday', screen: 'random' },

  // ---- Pro (locked) ----
  { id: 'ruler', name: 'Ruler', subtitle: 'Measure on screen', description: 'Measure in centimeters or inches, with credit-card calibration for accuracy.', icon: 'ruler', tier: 'pro', status: 'ready', category: 'measure', screen: 'ruler' },
  { id: 'protractor', name: 'Protractor', subtitle: 'Measure any angle', description: 'Measure an angle by dragging an arm around a protractor.', icon: 'angle-acute', tier: 'pro', status: 'ready', category: 'measure', screen: 'protractor' },
  { id: 'magnifier', name: 'Magnifier', subtitle: 'Zoom to read small text', description: 'Use the camera to zoom in and read fine print.', icon: 'magnify-plus', tier: 'pro', status: 'ready', category: 'measure', screen: 'magnifier' },
  { id: 'flashlight', name: 'Flashlight', subtitle: 'Torch & strobe', description: 'Turn your camera flash into a torch, with a strobe mode.', icon: 'flashlight', tier: 'pro', status: 'ready', category: 'everyday', screen: 'flashlight' },
  { id: 'qr', name: 'QR Scanner', subtitle: 'Scan QR codes', description: 'Scan a QR code and open or share the result instantly.', icon: 'qrcode-scan', tier: 'pro', status: 'ready', category: 'everyday', screen: 'qr' },
  { id: 'altimeter', name: 'Altimeter', subtitle: 'Altitude & pressure', description: 'Read air pressure and relative altitude with the barometer.', icon: 'image-filter-hdr', tier: 'pro', status: 'ready', category: 'measure', screen: 'altimeter' },
  { id: 'pedometer', name: 'Pedometer', subtitle: 'Count your steps', description: 'Count your steps and estimate distance and calories.', icon: 'shoe-print', tier: 'pro', status: 'ready', category: 'sensors', screen: 'pedometer' },
  { id: 'speedometer', name: 'Speedometer', subtitle: 'Live GPS speed', description: 'See your live speed from GPS, in km/h or mph.', icon: 'speedometer', tier: 'pro', status: 'ready', category: 'sensors', screen: 'speedometer' },
  { id: 'sound', name: 'Sound Meter', subtitle: 'Measure noise level', description: 'Measure the noise level around you in decibels.', icon: 'volume-high', tier: 'pro', status: 'ready', category: 'sensors', screen: 'sound' },
];
