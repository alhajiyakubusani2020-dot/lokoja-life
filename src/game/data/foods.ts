/**
 * LOKOJA LIFE — Food data (Stage 4 consumes this)
 * ------------------------------------------------
 * Data-driven food items for shops and restaurants.
 * Hunger 100 = completely full. Restoring hunger raises the value.
 */

export interface FoodItem {
  id: string
  name: string
  emoji: string
  price: number
  /** how much hunger it restores */
  hungerRestore: number
  /** mood effect (can be negative for sad cafeteria food) */
  moodEffect: number
  /** optional small energy boost */
  energyEffect?: number
  /** optional small health effect */
  healthEffect?: number
  description: string
}

export const FOODS: FoodItem[] = [
  {
    id: 'rice-and-stew',
    name: 'Rice & Stew',
    emoji: '🍛',
    price: 350,
    hungerRestore: 30,
    moodEffect: 2,
    description: 'The dependable classic. White rice, red stew.',
  },
  {
    id: 'beans',
    name: 'Beans & Bread',
    emoji: '🫘',
    price: 300,
    hungerRestore: 28,
    moodEffect: 1,
    energyEffect: 4,
    description: 'Ewa agoyin style. Slow energy for a long hustle.',
  },
  {
    id: 'agege-bread',
    name: 'Agege Bread',
    emoji: '🍞',
    price: 150,
    hungerRestore: 14,
    moodEffect: 1,
    description: 'Soft, big, and everywhere.',
  },
  {
    id: 'akara',
    name: 'Akara',
    emoji: '🧆',
    price: 200,
    hungerRestore: 16,
    moodEffect: 3,
    description: 'Hot bean cakes straight from the oil. Morning sweetness.',
  },
  {
    id: 'yam-and-egg',
    name: 'Yam & Egg Sauce',
    emoji: '🍠',
    price: 500,
    hungerRestore: 38,
    moodEffect: 4,
    description: 'Sunday-morning energy any day of the week.',
  },
  {
    id: 'suya',
    name: 'Suya',
    emoji: '🍢',
    price: 600,
    hungerRestore: 24,
    moodEffect: 8,
    description: 'Spicy grilled beef with yaji pepper. Pure joy.',
  },
  {
    id: 'egusi-and-pounded-yam',
    name: 'Egusi & Pounded Yam',
    emoji: '🍲',
    price: 900,
    hungerRestore: 48,
    moodEffect: 7,
    healthEffect: 3,
    description: 'A proper swallow. After this, you can face anything.',
  },
  {
    id: 'pepper-soup',
    name: 'Fish Pepper Soup',
    emoji: '🍥',
    price: 800,
    hungerRestore: 30,
    moodEffect: 6,
    healthEffect: 5,
    description: 'River fish, hot spice. Clears every catarrh.',
  },
  {
    id: 'zobo',
    name: 'Zobo',
    emoji: '🥤',
    price: 150,
    hungerRestore: 4,
    moodEffect: 4,
    healthEffect: 2,
    description: 'Chilled hibiscus drink with ginger kick.',
  },
  {
    id: 'fura-de-nunu',
    name: 'Fura da Nunu',
    emoji: '🥛',
    price: 250,
    hungerRestore: 10,
    moodEffect: 3,
    healthEffect: 3,
    description: 'Millet and fresh milk. The North’s gift to the road.',
  },
]

export const FOOD_BY_ID = Object.fromEntries(FOODS.map((f) => [f.id, f])) as Record<string, FoodItem>
