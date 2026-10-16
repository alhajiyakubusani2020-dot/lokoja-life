/**
 * LOKOJA LIFE — G2 SPACES: rotating scene lines
 * ----------------------------------------------
 * One honest line per visit, rotated by the world day (world.day % len).
 * Original writing in the game's established voice — Nigerian English with
 * light pidgin, concrete street detail. Nothing copied from anywhere; the
 * competitor's lines were never read, only beaten.
 */

export const LOC_VIBES: Record<string, string[]> = {
  /* ------------------------------ the launch ten ------------------------------ */
  home: [
    'Your fan clicks overhead like it is counting your rest for you.',
    'Somewhere down the street, a neighbour\u2019s radio argues with the news.',
    'The wall clock and your stomach agree: it is later than you think.',
    'Rain taps the roof — the whole room suddenly feels like a hug.',
  ],
  'kpata-market': [
    'Kpata noise enters your ears and arranges itself into a plan.',
    'A trader slaps two basins together just to hear her own price echo.',
    'Pepper dust finds your eyes from three stalls away. Standard.',
    'Somebody\u2019s goat is winning an argument with a tomato seller.',
    'Keke horns dey argue with the market drums — nobody is backing down.',
  ],
  'ganaja-junction': [
    'Four roads, forty opinions, one junction. Ganaja never whispers.',
    'The suya smoke drifts past like it is also waiting for a ride.',
    'A keke blows past with a fridge strapped where passengers should be.',
    'Every arriving bus drops somebody\u2019s cousin and somebody\u2019s gist.',
  ],
  confluence: [
    'The Niger and the Benue carry on their old, slow conversation.',
    'River wind lifts the heat right off your shoulders. Free AC.',
    'A canoe slides past, low and loaded, waving with one paddle.',
    'The water holds two colours and refuses to explain itself.',
  ],
  'mount-patti': [
    'The hill looks back at you like it knows your plans.',
    'Halfway up, the city sounds switch to a smaller, humbler volume.',
    'Grass whispers along the trail — even the wind climbs quietly here.',
    'From the shoulder, Lokoja lies below like a map drawn by hand.',
  ],
  'historic-lokoja': [
    'Old walls lean together, trading the same stories since 1860.',
    'A colonial-era arch shades a man selling sim cards. History, meeting data.',
    'The cemetery gate creaks a greeting older than the state itself.',
    'Lugard\u2019s shadow still stretches across the afternoon here.',
  ],
  'government-area': [
    'GRA quiet is a special quiet — fences, flowers and paperwork power.',
    'A generator hums behind a wall, keeping one office official.',
    'Somebody\u2019s official car crawls past at the speed of procedure.',
    'The potholes here are smoother than the approval process.',
  ],
  'university-area': [
    'Campus energy leaks onto the street — books, banter and big plans.',
    'A photocopier downstairs is doing the work of ten scholars.',
    'Hostel pots bang out a menu with no written recipe.',
    'Two students walk past, already arguing about a business plan.',
  ],
  'food-area': [
    'The aroma hits first — pepper soup signature, travelling ahead of the menu.',
    'Mama\u2019s ladle hits the pot like a drummer keeping city time.',
    'Suya smoke writes calligraphy across the evening.',
    'Cold drinks sweat on the counter, waiting for honest throats.',
  ],
  'transport-area': [
    'The last bus to Abuja is leaving. It has been leaving since morning.',
    'Taxi drivers price your journey with their whole face before speaking.',
    'A conductor hangs half out of a moving keke, calling destinations like hymns.',
    'Tyre pressure arguments are the park\u2019s oldest sport.',
  ],

  /* -------------------------------- the schools ------------------------------- */
  'ful-felele': [
    'Lecture-theatre doors swallow students in hungry batches.',
    'The Felele road dust settles on every bag like school chalk.',
    'LT A and LT B trade crowds while the Twin Theatre keeps its own time.',
    'Somebody is selling handouts older than the faculty block.',
  ],
  'ful-adankolo': [
    'The old campus wears its years like a badge, not a burden.',
    'A lecturer\u2019s bicycle is parked with more authority than any car.',
    'Notes change hands under the tree faster than naira in a shop.',
    'Adankolo pigeons audit the compound from the wire above.',
  ],
  'ksp-felele': [
    'Workshop metal taps out a rhythm only poly students dance to.',
    'Drafting boards lean in the corridor like tired athletes.',
    'Somebody\u2019s practical project is welding the afternoon together.',
    'Poly gist travels at the speed of a keke with no brakes.',
  ],
  'salem-university': [
    'The compound is so quiet you can hear the hymn in the wind.',
    'Chapel voices fold neatly into the Felele afternoon.',
    'Even the grass here looks like it obeys rules.',
    'A lawn mower hums the only official soundtrack of the day.',
  ],
  'college-nursing': [
    'White uniforms move between blocks like calm, purposeful clouds.',
    'The demo room smells of soap, iron and seriousness.',
    'The matron\u2019s gate-time is the truest clock in Lokoja.',
    'Notes pass hand to hand, folded like prescriptions.',
  ],
  'crowther-memorial': [
    'Assembly-ground dust rises in one straight, disciplined line.',
    'The college bell still speaks with a missionary accent.',
    'Small boys march past with the confidence of a whole battalion.',
    'A history teacher\u2019s voice carries from 1860 to this very yard.',
  ],
  'gyb-model-adankolo': [
    'Science-lab windows catch the sun like well-kept spectacles.',
    'Model-school corridors run loud with small physics.',
    'The compound doubles as a football academy every closing hour.',
    'A shy silence means a test is on. Run.',
  ],
  'faithview-academy': [
    'Faithview Avenue takes its name seriously and keeps things tidy.',
    'Pickup time turns the street into a polite, honking river.',
    'The academy compound glows after rain, washed and willing.',
    'Children\u2019s songs escape the fence in uneven, happy bursts.',
  ],
  'al-azhar-college': [
    'Prayer call and prep bell take turns owning the air here.',
    'The college courtyard holds its students like cupped hands.',
    'Homework chatter survives the gate by exactly three metres.',
    'Afternoon light lies gently on the study hall\u2019s windows.',
  ],
  'baptist-high': [
    'Inter-house sports season makes the whole street a stadium.',
    'Chapel and chemistry share the timetable without quarrelling.',
    'The field remembers every goal argued into history.',
    'Old students greet the gate like a grandmother.',
  ],
  'julitola-intl': [
    'The pickup queue runs on two fuels: patience and small talk.',
    'Tiny uniforms, enormous school bags, fearless questions.',
    'The compound pond gathers more opinion than the staff room.',
    'A tiny boy explains a business idea to his even tinier friend.',
  ],
  'christfield-school': [
    'Small school, big stories — all of them leave through the gate.',
    'The choir practises with one key and total commitment.',
    'Chalk dust floats in the classroom light like slow snow.',
    'The compound pine tree keeps the school\u2019s oldest secrets.',
  ],

  /* ------------------------------ the G2 spaces ------------------------------- */
  adankolo: [
    'Adankolo evening smells of wood smoke, cooking oil and big plans.',
    'An okada man quotes you a fare with a lecturer\u2019s confidence.',
    'Lodges blink awake — one bulb per window, one dream per bulb.',
    'A tenant is negotiating rent using only proverbs.',
  ],
  emiwoziri: [
    'The river talks in its sleep and Emiwoziri listens.',
    'Nets dry on the sand like long letters left open.',
    'Sand boats settle in with a tired, honest groan.',
    'A fisherman whistles at the water; the water keeps its side of the deal.',
  ],
  filele: [
    'Cassava rows stand at attention all the way to the ridge.',
    'The village radio debates rainfall like a national matter.',
    'Wood smoke and turned earth — the original perfume of patience.',
    'A goat walks past with the confidence of a landowner.',
  ],
  numai: [
    'Front-yard football has its own league table here. Ask anybody.',
    'Somebody\u2019s goat is eating the news before it reaches you.',
    'Compound gates swing, radios lean low, evening arrives politely.',
    'The whole settlement runs on one shared borehole gossip network.',
  ],
  kpatakpoli: [
    'The well queue doubles as parliament — motions raised by bucket.',
    'Evening air carries roasted maize and unhurried arguments.',
    'Compound benches fill up faster than the market at festival.',
    'The sky out here is bigger; the silence is well-fed.',
  ],
  kpato: [
    'The Otukpo road throws dust like it is being paid for it.',
    'Timber lorries grunt past with their whole family on board.',
    'Roadside coals smoke sweetly, patient for plantain.',
    'Junction boys wave down kekes with presidential authority.',
  ],
  'township-stadium': [
    'The floodlights stand tall, dreaming of a full house.',
    'One boy practises free kicks against forty empty seats.',
    'The oval stands hold yesterday\u2019s roar in their concrete throat.',
    'Matchday dust and stall-cold minerals — the city\u2019s proper religion.',
  ],
  'maigari-palace': [
    'The compound breathes protocol — even the wind knocks first.',
    'Turbaned elders cross the courtyard like moving history.',
    'A palace drum tests its voice, low and older than the state.',
    'Greeting here is an art; you are a visitor with an exam.',
  ],
  'pati-ridge-hill': [
    'Wind walks across the grass like it pays rent here.',
    'The city below looks like somebody\u2019s careful beadwork.',
    'One bird owns the whole ridge and knows it.',
    'Up here, even your thoughts arrive without hustling.',
  ],
  'sokamms-motel': [
    'The generator hums the motel\u2019s one faithful lullaby.',
    'The night guard greets you with tomorrow\u2019s headline already.',
    'Curtains, cold minerals and a ceiling fan with steady morals.',
    'A traveller pays cash at the counter like a man closing a chapter.',
  ],
}
