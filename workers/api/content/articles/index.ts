// workers/api/content/articles — article data barrel.
//
// Imports every article data file and re-exports them as a single sorted
// array. The seed script (`workers/api/scripts/seed-articles.ts`) consumes
// `allArticles` to run quality checks and generate D1 INSERT statements.

import type { ArticleData } from '../types';

// Brain Age (20 articles)
import { article01 } from './article-001-what-is-brain-age';
import { article02 } from './article-002-brain-age-vs-biological-age';
import { article03 } from './article-003-how-to-test-brain-age';
import { article04 } from './article-004-brain-age-myths-debunked';
import { article05 } from './article-005-factors-affecting-brain-age';
import { article06 } from './article-006-brain-age-and-sleep-quality';
import { article07 } from './article-007-exercise-and-brain-age';
import { article08 } from './article-008-diet-and-cognitive-decline';
import { article09 } from './article-009-brain-age-and-stress';
import { article10 } from './article-010-social-engagement-brain-health';
import { article11 } from './article-011-brain-age-numbers-by-decade';
import { article12 } from './article-012-neuroplasticity-and-brain-age';
import { article13 } from './article-013-brain-age-and-education';
import { article14 } from './article-014-meditation-brain-age';
import { article15 } from './article-015-brain-age-and-hearing-loss';
import { article16 } from './article-016-brain-age-gender-differences';
import { article17 } from './article-017-brain-age-and-gut-microbiome';
import { article18 } from './article-018-brain-age-tracking-frequency';
import { article19 } from './article-019-brain-age-and-chronic-disease';
import { article20 } from './article-020-lowering-brain-age-naturally';

// Memory (20 articles)
import { article21 } from './article-021-types-of-memory-explained';
import { article22 } from './article-022-how-working-memory-works';
import { article23 } from './article-023-memory-consolidation-sleep';
import { article24 } from './article-024-forgetting-curve-ebbinghaus';
import { article25 } from './article-025-spatial-memory-navigation';
import { article26 } from './article-026-memory-and-emotion';
import { article27 } from './article-027-chunking-memory-strategy';
import { article28 } from './article-028-memory-palace-technique';
import { article29 } from './article-029-false-memories-formation';
import { article30 } from './article-030-memory-and-aging-normal';
import { article31 } from './article-031-improve-working-memory';
import { article32 } from './article-032-memory-and-nutrition';
import { article33 } from './article-033-prospective-memory';
import { article34 } from './article-034-memory-reconsolidation';
import { article35 } from './article-035-visual-memory-vs-verbal';
import { article36 } from './article-036-memory-and-exercise-mechanism';
import { article37 } from './article-037-memory-supplements-evidence';
import { article38 } from './article-038-childhood-memory-development';
import { article39 } from './article-039-memory-and-music';
import { article40 } from './article-040-memory-decline-prevention';

// Attention (20 articles)
import { article41 } from './article-041-types-of-attention';
import { article42 } from './article-042-selective-attention-mechanism';
import { article43 } from './article-043-sustained-attention-vigilance';
import { article44 } from './article-044-attention-deficit-myths';
import { article45 } from './article-045-multitasking-brain-cost';
import { article46 } from './article-046-stroop-effect-explained';
import { article47 } from './article-047-attention-and-meditation';
import { article48 } from './article-048-visual-search-efficiency';
import { article49 } from './article-049-attention-blink-phenomenon';
import { article50 } from './article-050-distractibility-causes';
import { article51 } from './article-051-attention-training-games';
import { article52 } from './article-052-adhd-and-attention-games';
import { article53 } from './article-053-attention-and-caffeine';
import { article54 } from './article-054-attention-in-digital-age';
import { article55 } from './article-055-inattentional-blindness';
import { article56 } from './article-056-attention-and-emotion';
import { article57 } from './article-057-attention-development-children';
import { article58 } from './article-058-attention-and-aging';
import { article59 } from './article-059-flow-state-attention';
import { article60 } from './article-060-improving-focus-naturally';

// Focus (20 articles)
import { article61 } from './article-061-focus-vs-attention-difference';
import { article62 } from './article-062-deep-work-brain-science';
import { article63 } from './article-063-pomodoro-technique-science';
import { article64 } from './article-064-focus-and-procrastination';
import { article65 } from './article-065-flow-triggers-and-blockers';
import { article66 } from './article-066-focus-and-dopamine';
import { article67 } from './article-067-music-and-focus';
import { article68 } from './article-068-focus-environment-design';
import { article69 } from './article-069-digital-minimalism-focus';
import { article70 } from './article-070-focus-and-breakfast';
import { article71 } from './article-071-focus-morning-vs-evening';
import { article72 } from './article-072-focus-and-anxiety';
import { article73 } from './article-073-focus-and-temperature';
import { article74 } from './article-074-focus-tracking-tools';
import { article75 } from './article-075-focus-and-boredom';
import { article76 } from './article-076-intermittent-focus-bursts';
import { article77 } from './article-077-focus-and-body-posture';
import { article78 } from './article-078-focus-and-nature-walks';
import { article79 } from './article-079-focus-and-hydration';
import { article80 } from './article-080-building-focus-habit';

// Relaxation (20 articles)
import { article81 } from './article-081-relaxation-response-science';
import { article82 } from './article-082-breathing-techniques-comparison';
import { article83 } from './article-083-vagus-nerve-stimulation';
import { article84 } from './article-084-cortisol-and-relaxation';
import { article85 } from './article-085-meditation-types-guide';
import { article86 } from './article-086-progressive-muscle-relaxation';
import { article87 } from './article-087-guided-imagery-relaxation';
import { article88 } from './article-088-yoga-and-brain-relaxation';
import { article89 } from './article-089-stress-inoculation-training';
import { article90 } from './article-090-relaxation-and-immunity';
import { article91 } from './article-091-sleep-relaxation-protocol';
import { article92 } from './article-092-nature-sounds-relaxation';
import { article93 } from './article-093-biofeedback-relaxation-guide';
import { article94 } from './article-094-relaxation-and-creativity';
import { article95 } from './article-095-workplace-micro-relaxation';
import { article96 } from './article-096-relaxation-for-children';
import { article97 } from './article-097-yoga-nidra-deep-relaxation';
import { article98 } from './article-098-relaxation-and-pain-management';
import { article99 } from './article-099-seasonal-relaxation-strategies';
import { article100 } from './article-100-daily-relaxation-routine';

/**
 * All 100 seed articles in display order (sorted by sortOrder).
 * The seed script expects this array to be the complete set.
 */
export const allArticles: ArticleData[] = [
  // Brain Age (1-20)
  article01, article02, article03, article04, article05,
  article06, article07, article08, article09, article10,
  article11, article12, article13, article14, article15,
  article16, article17, article18, article19, article20,
  // Memory (21-40)
  article21, article22, article23, article24, article25,
  article26, article27, article28, article29, article30,
  article31, article32, article33, article34, article35,
  article36, article37, article38, article39, article40,
  // Attention (41-60)
  article41, article42, article43, article44, article45,
  article46, article47, article48, article49, article50,
  article51, article52, article53, article54, article55,
  article56, article57, article58, article59, article60,
  // Focus (61-80)
  article61, article62, article63, article64, article65,
  article66, article67, article68, article69, article70,
  article71, article72, article73, article74, article75,
  article76, article77, article78, article79, article80,
  // Relaxation (81-100)
  article81, article82, article83, article84, article85,
  article86, article87, article88, article89, article90,
  article91, article92, article93, article94, article95,
  article96, article97, article98, article99, article100,
];
