/**
 * LOKOJA LIFE — NPC Chat Lines (Stage 5)
 * ---------------------------------------
 * What each NPC says when you chat with them, by familiarity tier.
 * The phone app and the 3D "talk" interaction both read from here —
 * the social SYSTEM decides WHICH line, this file only holds the words.
 *
 * Tiers: stranger → acquaintance → paddy → close-paddy
 * Voice rule: warm Nigerian pidgin, every line is safe, in-character,
 * and tied to the NPC's home location / hustle world.
 */

export type FamiliarityTier = 'stranger' | 'acquaintance' | 'paddy' | 'close-paddy'

export interface NpcChatLines {
  /** first-time talk (tier: stranger) */
  stranger: string[]
  /** you don pass "who be this?" stage */
  acquaintance: string[]
  /** real friendship — they greet you like somebody */
  paddy: string[]
  /** day-one paddy — open doors, open heart */
  'close-paddy': string[]
}

export const NPC_CHAT: Record<string, NpcChatLines> = {
  musa: {
    stranger: [
      'Ah, welcome! You wan buy cloth? Everything good fabric dey here.',
      'Kpata market na my home. Anywhere you wan go, ask me.',
    ],
    acquaintance: [
      'Ah na you! How the hustle dey go today?',
      'If you wan get fine fabric cheap, na me you go meet. No wahala.',
    ],
    paddy: [
      'My paddy! Come make we plan something — market dey pay people wey sabi look well.',
      'You don dey move up o. I dey always talk am — na so e go continue.',
    ],
    'close-paddy': [
      'See am! My guy for life. Anything wey you need for Kpata, na family price.',
      'One day we go open shop together. I get the fabric, you get the sense.',
    ],
  },
  'hajiya-amina': {
    stranger: [
      'You are welcome. Fresh pepper from the farm — look well before you price am.',
      'Market respect people wey get patience. Wetin you dey find?',
    ],
    acquaintance: [
      'Ah, my customer. Your eye don sharp well well since you dey come.',
      'I keep the best tomatoes for people wey no go waste my time.',
    ],
    paddy: [
      'My dear, come sit. Any good gist from the other side of market?',
      'You dey do well. God go continue to bless this your hustle.',
    ],
    'close-paddy': [
      'Come, come! I don cook extra — you must eat before you leave today.',
      'You be like pikin to me now. Anything wey you wan do, I dey support.',
    ],
  },
  'mama-ngozi': {
    stranger: [
      'Welcome! You look hungry — the pot is still hot, no worry.',
      'First time here? Order anything, you go come back tomorrow by yourself.',
    ],
    acquaintance: [
      'My regular! The usual, or you wan try today\'s special?',
      'Sit down, sit down. Somebody wey dey always smile like you no fit palava.',
    ],
    paddy: [
      'Ah my pikin! I don tell everybody for this food strip about you.',
      'Today your food na family treat — no talk am loud o!',
    ],
    'close-paddy': [
      'You don eat? You sure? I no go hear story o — sit, food dey come.',
      'When you go open your own place, na my recipe you go use o! I dey joke… partially.',
    ],
  },
  emeka: {
    stranger: [
      'Oboi! You wan learn okada work? E no easy but e dey pay small small.',
      'If e fit move, I fit carry am. Wetin be your own talent?',
    ],
    acquaintance: [
      'My guy! Road today dey free — no police wahala, no fuel wahala.',
      'You dey look sharper ah ah. Money dey your pocket small small, e dey show!',
    ],
    paddy: [
      'Oboi we go run delivery together one day. You bring customers, I bring wheel.',
      'Any route you wan sabi for this Lokoja, just ask. I don wear all the road like cloth.',
    ],
    'close-paddy': [
      'Na you be my manager for future o! When I buy second bike, na you go ride am.',
      'From Kpata to Ganaja, nobody sabi road like we two. Team no dey disappoint.',
    ],
  },
  'baba-t': {
    stranger: [
      'Welcome to Motor Park. Everything here na order — that\'s why we dey move.',
      'You wan join transport work? Come with patience, leave with sense.',
    ],
    acquaintance: [
      'Ah my friend. Your level don dey rise for this park, I dey watch you.',
      'Keke unit dey always need sharp people. Keep your record clean.',
    ],
    paddy: [
      'My guy, seat dey wait you. Even keke sef know your face now.',
      'We go talk business soon. Park get level, and you don almost reach.',
    ],
    'close-paddy': [
      'Chairman! Park dey respect you now. Anything you wan run, I go open door.',
      'You remember when you first come? Now even danfo drivers dey greet you first.',
    ],
  },
  chantel: {
    stranger: [
      'Hey! You look like you get sense. You dey do anything with the students here?',
      'Campus dey burst with small small opportunities. You just need eye.',
    ],
    acquaintance: [
      'Ah my personal person! I get one small plan — you go like am.',
      'Exams dey come o, but hustle no dey wait exam. Balance am well!',
    ],
    paddy: [
      'My guy! I don draft the whole plan — Monday morning, we go talk am.',
      'You dey move like person wey go far. I wan dey your circle when e happen.',
    ],
    'close-paddy': [
      'Day-one paddy! We go build something wey this campus go remember.',
      'Any gig wey you dey run, count me in. Paddy no dey watch paddy suffa.',
    ],
  },
  'alhaji-sule': {
    stranger: [
      'Good day. If your papers complete, the process is simple. If not… e go take time.',
      'Office na office — but I fit tell you the correct way to file anything.',
    ],
    acquaintance: [
      'Ah, my reliable friend. Your files dey always complete. I respect that.',
      'The secretariat get plenty opportunity for person wey sabi read the room.',
    ],
    paddy: [
      'My friend, come. I go show you the correct office for that your plan.',
      'You dey rise well. Government work like steady people like you.',
    ],
    'close-paddy': [
      'Chairman! I don arrange the file — you only need to sign, sign.',
      'One day we go laugh inside one correct office. Just keep your name clean.',
    ],
  },
  'uncle-ben': {
    stranger: [
      'Young man, do you know this town get the FIRST secondary school in Nigeria? Come, I go tell you.',
      'History dey everywhere for this Lokoja — na only eye we no dey open.',
    ],
    acquaintance: [
      'Ah my student! Today I go show you the other side of the old town.',
      'You dey listen well. Na so history dey enter person body.',
    ],
    paddy: [
      'My dear, the stories wey I no tell tourists, na you I dey tell them.',
      'One day you go carry this town story go far places. Mark my word.',
    ],
    'close-paddy': [
      'My pikin! Sit down. Today na the day I tell you about Lord Lugroad… e get why we dey call am so.',
      'When they write the new history of Lokoja, your name go dey inside. I don see am.',
    ],
  },
  idris: {
    stranger: [
      'The rivers dey generous today. You wan see the confluence? Na God work.',
      'Fishing na patience work. Anybody wey no fit wait no go sabi this water.',
    ],
    acquaintance: [
      'My friend! The fish dey bite better for evening — come with me one day.',
      'You dey grow o. Even the river dey notice people wey dey try.',
    ],
    paddy: [
      'Come make we sit for the bank. The water get way of answering questions.',
      'You be my people now. When catch plenty, na we two go share am.',
    ],
    'close-paddy': [
      'My brother from the land! Today the river go provide — I don already ask am.',
      'This confluence na our office now. Any big decision, come here first.',
    ],
  },
  'baba-danjuma': {
    stranger: [
      'Patti no be small hill o. You wan climb? Go slow, drink water, respect the rock.',
      'From up there you go see where two rivers become one. Na blessing to see am.',
    ],
    acquaintance: [
      'Ah, my climber! Your leg don dey strong. Next time we go reach the summit.',
      'The hill like you small small. E dey test person before e show am everything.',
    ],
    paddy: [
      'My friend, today we go the quiet path. Na there the real Patti dey hide.',
      'You don climb am many times now. The hill don accept you.',
    ],
    'close-paddy': [
      'Welcome, son of the hill! Come, the morning wind dey fresh for the top.',
      'I don climb Patti ten thousand times — but with you, e still dey sweet me.',
    ],
  },
  hauwa: {
    stranger: [
      'Ah-ah, visitor for our school! You wan see the chemistry lab or you dey find somebody?',
      'I no waste time o — break don nearly finish. Wetin you want?',
    ],
    acquaintance: [
      'Na you again! How market? I hope say you bring gist, no be only books.',
      'Our WAEC prep na fire these days. Sometimes I go just dey dream of formulas.',
    ],
    paddy: [
      'My friend! Come make we sit under the mango tree — the gist plenty today.',
      'You sabi say after WAEC, na university next. FUL or nothing!',
    ],
    'close-paddy': [
      'See my day-one paddy! When I turn scientist, no forget say na here we start.',
      'I even keep jollof for you from the social. You too no dey come school on time!',
    ],
  },
  chidi: {
    stranger: [
      'Welcome to the permanent site o. The sun no dey pity anybody here — carry water.',
      'You be fresh student? Abeg no miss LT B, that lecturer no dey forgive.',
    ],
    acquaintance: [
      'My guy! You don dey adapt to campus life. The shuttle wahala no easy sha.',
      'Exams dey come. Library go full this week — if you see seat, hold am tight.',
    ],
    paddy: [
      'Padi mi! Come make we hustle this school life together — notes, runs, everything.',
      'One day after NYSC, na big things we go do. Just dey watch.',
    ],
    'close-paddy': [
      'My brother from another mother! Anything for FUL, I get plug.',
      'Graduation go sweet — and you must sit front row that day. Na family matter.',
    ],
  },
  'miss-grace': {
    stranger: [
      'Good day. This is a place of learning — please keep your voice low and your manners high.',
      'Visitors sign at the office first. That is how we have run this college since 1956.',
    ],
    acquaintance: [
      'Ah, our friend again. The students behave better when you are around — interesting.',
      'Crowther built this college on discipline. I am only keeping the flame.',
    ],
    paddy: [
      'Come in, come in. You know you are always welcome in this compound.',
      'I have watched many children pass through these gates. Some of them now greet ME as colleagues.',
    ],
    'close-paddy': [
      'My dear! Sit. The kettle is on. Even principals need somebody to talk to.',
      'When they write the history of this school, your name will be in the kind part.',
    ],
  },
  abubakar: {
    stranger: [
      'You reach the poly? Mind the generators — the workshop boys dey weld.',
      'ND or HND? Everybody for this road na one family, no shy.',
    ],
    acquaintance: [
      'Ah my guy! See the engine wey we rebuild yesterday — she dey sound like new.',
      'Poly no be joke o, but the hands-on sense? Nobody fit beat am.',
    ],
    paddy: [
      'Come make we check this alternator — you go learn something wey go serve you for life.',
      'When my workshop open for real, na you be my first customer. I swear.',
    ],
    'close-paddy': [
      'My paddy for life! Any vehicle wahala, bring am — family work, family price.',
      'We go blow together — you with your sense, me with my hands. Watch us.',
    ],
  },
}
