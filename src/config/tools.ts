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
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  tier: Tier;
  status: Status;
  category: Category;
  /** Screen a ready tool opens. Undefined for coming-soon tools. */
  screen?: Screen;
}

export const TOOLS: Tool[] = [
  // ---- Free (core) ----
  { id: 'level', name: 'Level', subtitle: 'Spirit level & bullseye', icon: 'bullseye', tier: 'free', status: 'ready', category: 'measure', screen: 'level' },
  { id: 'compass', name: 'Compass', subtitle: 'Find true north', icon: 'compass-outline', tier: 'free', status: 'ready', category: 'measure', screen: 'compass' },
  { id: 'calculator', name: 'Calculator', subtitle: 'Quick arithmetic', icon: 'calculator', tier: 'free', status: 'ready', category: 'convert', screen: 'calculator' },
  { id: 'converter', name: 'Converter', subtitle: 'Length, weight, temp & more', icon: 'swap-horizontal', tier: 'free', status: 'ready', category: 'convert', screen: 'converter' },
  { id: 'countdown', name: 'Countdown', subtitle: 'Timer with presets', icon: 'timer-sand', tier: 'free', status: 'ready', category: 'convert', screen: 'countdown' },
  { id: 'tip', name: 'Tip Split', subtitle: 'Tip, tax & split the bill', icon: 'cash-multiple', tier: 'free', status: 'ready', category: 'convert', screen: 'tip' },
  { id: 'stopwatch', name: 'Stopwatch', subtitle: 'Timer with lap times', icon: 'timer-outline', tier: 'free', status: 'ready', category: 'everyday', screen: 'stopwatch' },
  { id: 'random', name: 'Random', subtitle: 'Dice, coin & wheel', icon: 'dice-multiple', tier: 'free', status: 'ready', category: 'everyday', screen: 'random' },

  // ---- Pro (locked) ----
  { id: 'ruler', name: 'Ruler', subtitle: 'Measure on screen', icon: 'ruler', tier: 'pro', status: 'ready', category: 'measure', screen: 'ruler' },
  { id: 'protractor', name: 'Protractor', subtitle: 'Measure any angle', icon: 'angle-acute', tier: 'pro', status: 'ready', category: 'measure', screen: 'protractor' },
  { id: 'magnifier', name: 'Magnifier', subtitle: 'Zoom to read small text', icon: 'magnify-plus', tier: 'pro', status: 'ready', category: 'measure', screen: 'magnifier' },
  { id: 'flashlight', name: 'Flashlight', subtitle: 'Torch & strobe', icon: 'flashlight', tier: 'pro', status: 'ready', category: 'everyday', screen: 'flashlight' },
  { id: 'qr', name: 'QR Scanner', subtitle: 'Scan QR codes', icon: 'qrcode-scan', tier: 'pro', status: 'ready', category: 'everyday', screen: 'qr' },
  { id: 'altimeter', name: 'Altimeter', subtitle: 'Altitude & pressure', icon: 'image-filter-hdr', tier: 'pro', status: 'ready', category: 'measure', screen: 'altimeter' },
  { id: 'pedometer', name: 'Pedometer', subtitle: 'Count your steps', icon: 'shoe-print', tier: 'pro', status: 'ready', category: 'sensors', screen: 'pedometer' },
  { id: 'speedometer', name: 'Speedometer', subtitle: 'Live GPS speed', icon: 'speedometer', tier: 'pro', status: 'ready', category: 'sensors', screen: 'speedometer' },
  { id: 'sound', name: 'Sound Meter', subtitle: 'Measure noise level', icon: 'volume-high', tier: 'pro', status: 'ready', category: 'sensors', screen: 'sound' },
];
