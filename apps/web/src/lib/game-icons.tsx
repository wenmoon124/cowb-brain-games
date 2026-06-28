import {
  Hash,
  Grid3x3,
  LayoutGrid,
  ArrowLeftRight,
  ListOrdered,
  Shapes,
  Search,
  Timer,
  Eye,
  Filter,
  Columns2,
  Zap,
  Target,
  Palette,
  Building2,
  Shuffle,
  Route,
  Grid2x2,
  Wind,
  Waves,
  HeartHandshake,
  Gamepad2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const gameIconMap: Record<string, LucideIcon> = {
  'digit-span': Hash,
  'spatial-memory': Grid3x3,
  'memory-matrix': LayoutGrid,
  'backward-digit-span': ArrowLeftRight,
  'spatial-sequence': ListOrdered,
  'pattern-match': Shapes,
  'visual-search': Search,
  'attention-span': Timer,
  'eagle-eye': Eye,
  'distraction-filter': Filter,
  'split-focus': Columns2,
  'reaction-training': Zap,
  'click-horizon': Target,
  'stroop-challenge': Palette,
  'tower-of-logic': Building2,
  'change-flex': Shuffle,
  'path-finder': Route,
  'matrix-reasoning': Grid2x2,
  'breathing-flow': Wind,
  'audio-alpha-diver': Waves,
  'stress-sandbox': HeartHandshake,
}

export function getGameIcon(slug: string): LucideIcon {
  return gameIconMap[slug] ?? Gamepad2
}
