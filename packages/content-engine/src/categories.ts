// @brainverse/content-engine — article category catalog.
//
// The five top-level content categories. Each category has a stable id
// (persisted on `articles.category`), an i18n name key, and the planned
// article count for the MVP content batch (20 per category = 100 articles).

/**
 * A content category definition.
 */
export interface ContentCategory {
  id: string;
  nameKey: string;
  descriptionKey: string;
  /** Planned number of articles in this category for the MVP batch. */
  articleCount: number;
  /** lucide-react icon name used in the content hub. */
  icon: string;
}

/**
 * The five content categories. The order here is the display order in the
 * content hub. Do NOT change ids once shipped.
 */
export const categories: readonly ContentCategory[] = [
  {
    id: 'brain-age',
    nameKey: 'categories.brain-age.name',
    descriptionKey: 'categories.brain-age.description',
    articleCount: 20,
    icon: 'Brain',
  },
  {
    id: 'memory',
    nameKey: 'categories.memory.name',
    descriptionKey: 'categories.memory.description',
    articleCount: 20,
    icon: 'Database',
  },
  {
    id: 'attention',
    nameKey: 'categories.attention.name',
    descriptionKey: 'categories.attention.description',
    articleCount: 20,
    icon: 'Eye',
  },
  {
    id: 'focus',
    nameKey: 'categories.focus.name',
    descriptionKey: 'categories.focus.description',
    articleCount: 20,
    icon: 'Target',
  },
  {
    id: 'relaxation',
    nameKey: 'categories.relaxation.name',
    descriptionKey: 'categories.relaxation.description',
    articleCount: 20,
    icon: 'Wind',
  },
] as const;

/** Lookup a category by id. Returns `undefined` if not found. */
export function getCategory(id: string): ContentCategory | undefined {
  return categories.find((c) => c.id === id);
}

/** All category ids in display order. */
export const categoryIds: readonly string[] = categories.map((c) => c.id);
