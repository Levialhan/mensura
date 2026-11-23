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

export interface Tool {
  id: ToolId;
  name: string;
  subtitle: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  tier: Tier;
  status: Status;
  /** Screen a ready tool opens. Undefined for coming-soon tools. */
  screen?: Screen;
}

export const TOOLS: Tool[] = [
  // ---- Free (core) ----
  { id: 'level', name: 'Level', subtitle: 'Spirit level & bullseye', icon: 'bullseye', tier: 'free', status: 'ready', screen: 'level' },
  { id: 'compass', name: 'Compass', subtitle: 'Find true north', icon: 'compass-outline', tier: 'free', status: 'ready', screen: 'compass' },
  { id: 'calculator', name: 'Calculator', subtitle: 'Quick arithmetic', icon: 'calculator', tier: 'free', status: 'ready', screen: 'calculator' },
  { id: 'converter', name: 'Converter', subtitle: 'Length, weight, temp & more', icon: 'swap-horizontal', tier: 'free', status: 'ready', screen: 'converter' },
  { id: 'countdown', name: 'Countdown', subtitle: 'Timer with presets', icon: 'timer-sand', tier: 'free', status: 'ready', screen: 'countdown' },
  { id: 'tip', name: 'Tip Split', subtitle: 'Tip, tax & split the bill', icon: 'cash-multiple', tier: 'free', status: 'ready', screen: 'tip' },
  { id: 'stopwatch', name: 'Stopwatch', subtitle: 'Timer with lap times', icon: 'timer-outline', tier: 'free', status: 'ready', screen: 'stopwatch' },
  { id: 'random', name: 'Random', subtitle: 'Dice, coin & wheel', icon: 'dice-multiple', tier: 'free', status: 'ready', screen: 'random' },

  // ---- Pro (locked) ----
  { id: 'ruler', name: 'Ruler', subtitle: 'Measure on screen', icon: 'ruler', tier: 'pro', status: 'ready', screen: 'ruler' },
  { id: 'protractor', name: 'Protractor', subtitle: 'Measure any angle', icon: 'angle-acute', tier: 'pro', status: 'ready', screen: 'protractor' },
  { id: 'magnifier', name: 'Magnifier', subtitle: 'Zoom to read small text', icon: 'magnify-plus', tier: 'pro', status: 'ready', screen: 'magnifier' },
  { id: 'flashlight', name: 'Flashlight', subtitle: 'Torch & strobe', icon: 'flashlight', tier: 'pro', status: 'ready', screen: 'flashlight' },
  { id: 'qr', name: 'QR Scanner', subtitle: 'Scan QR codes', icon: 'qrcode-scan', tier: 'pro', status: 'ready', screen: 'qr' },
  { id: 'altimeter', name: 'Altimeter', subtitle: 'Altitude & pressure', icon: 'image-filter-hdr', tier: 'pro', status: 'ready', screen: 'altimeter' },
  { id: 'pedometer', name: 'Pedometer', subtitle: 'Count your steps', icon: 'shoe-print', tier: 'pro', status: 'ready', screen: 'pedometer' },
  { id: 'speedometer', name: 'Speedometer', subtitle: 'Live GPS speed', icon: 'speedometer', tier: 'pro', status: 'ready', screen: 'speedometer' },
  { id: 'sound', name: 'Sound Meter', subtitle: 'Measure noise level', icon: 'volume-high', tier: 'pro', status: 'ready', screen: 'sound' },
];
