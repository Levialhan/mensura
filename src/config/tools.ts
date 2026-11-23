import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Screen } from '../store/useAppStore';

export type ToolId =
  | 'level'
  | 'compass'
  | 'converter'
  | 'tip'
  | 'stopwatch'
  | 'ruler'
  | 'protractor'
  | 'flashlight'
  | 'qr'
  | 'altimeter';

export type Tier = 'free' | 'pro';
export type Status = 'ready' | 'soon';

export interface Tool {
  id: ToolId;
  name: string;
  subtitle: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  tier: Tier;
  status: Status;
  /** Screen a ready free tool opens. Undefined for pro / coming-soon tools. */
  screen?: Screen;
}

export const TOOLS: Tool[] = [
  // ---- Free (core) ----
  { id: 'level', name: 'Level', subtitle: 'Spirit level & bullseye', icon: 'bullseye', tier: 'free', status: 'ready', screen: 'level' },
  { id: 'compass', name: 'Compass', subtitle: 'Find true north', icon: 'compass-outline', tier: 'free', status: 'ready', screen: 'compass' },
  { id: 'converter', name: 'Converter', subtitle: 'Length, weight, temp & more', icon: 'swap-horizontal', tier: 'free', status: 'ready', screen: 'converter' },
  { id: 'tip', name: 'Tip Split', subtitle: 'Tip, tax & split the bill', icon: 'cash-multiple', tier: 'free', status: 'ready', screen: 'tip' },
  { id: 'stopwatch', name: 'Stopwatch', subtitle: 'Timer with lap times', icon: 'timer-outline', tier: 'free', status: 'ready', screen: 'stopwatch' },

  // ---- Pro (locked) ----
  { id: 'ruler', name: 'Ruler', subtitle: 'Measure on screen', icon: 'ruler', tier: 'pro', status: 'ready', screen: 'ruler' },
  { id: 'protractor', name: 'Protractor', subtitle: 'Measure any angle', icon: 'angle-acute', tier: 'pro', status: 'soon' },
  { id: 'flashlight', name: 'Flashlight', subtitle: 'Torch, strobe & SOS', icon: 'flashlight', tier: 'pro', status: 'soon' },
  { id: 'qr', name: 'QR Scanner', subtitle: 'Scan QR & barcodes', icon: 'qrcode-scan', tier: 'pro', status: 'soon' },
  { id: 'altimeter', name: 'Altimeter', subtitle: 'Altitude & pressure', icon: 'image-filter-hdr', tier: 'pro', status: 'soon' },
];
