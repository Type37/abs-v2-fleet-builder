// Faction flavour text, transcribed verbatim from the A Billion Suns 2E
// rulebook's Factions chapter (pp.141-171). Each faction has three parts:
//   - tagline:   the short epigraph that heads the entry (may be absent)
//   - briefing:  the in-universe fiction paragraph (shown in italic serif)
//   - playstyle: Mike Hutchinson's out-of-universe note on strengths and
//                intended playstyle (shown as plain prose)
// Kept out of the src/ rules data so the engine stays flavour-free; looked up
// by faction id at render time.

export interface FactionLore {
  tagline?: string;
  briefing: string;
  playstyle: string;
}

export const FACTION_LORE: Record<string, FactionLore> = {
  "heavy-industries": {
    tagline: "We use penal labour because mining is really dangerous.",
    briefing:
      "Every new star system represents vast natural wealth for those with the machinery to exploit it. The heavy industries corporations survey, claim, and strip-mine asteroid belts, moons, and entire planets for fuels, metals, minerals and organic materials. They also invest in terraforming, orbital infrastructure, and colonisation: a ready source of hard labour. The fleets of Ceres Pure Water, Oxius Inc, Titan Interstellar and the Atlas Terraforming Group focus around immense, slow-moving industrial vehicles: industrial rigs, planet-crackers and automated foundries.",
    playstyle:
      "Heavy Industries units are tough but slow, and without access to a great deal of protective passive firepower. Success requires thought about your initial placement. Once seated on the mission objectives, they are very hard to shift, but you'll need to create defence in depth, using longer-ranged ships and lighter squadrons to protect your objective holders. In Hypergrowth games, the fact that almost every ship carries a Utility Bay provides tremendous flexibility (and additional objective holding capability thanks to Resupply).",
  },
  megamart: {
    tagline: "If you can imagine it, we can deliver it (before you reconsider it).",
    briefing:
      "Around a billion suns live a hundred trillion mouths. Hungry, sick, vain, bored, their endless appetites are served by interstellar logistics and commodities corporations like MegaMart, VitaCore Health, Horizon Line, and Mercury Express. Hauling food and clothing, essentials and luxuries alike through the galaxy, their fleets are vast armadas of modular freighters, rapid dropships and orbital distribution hubs, crowned with palaces to consumerism: the mobile Titan Mallships, with their surreal hologrammatic retail decks. Whether moving critical supplies, luxury goods, or disposable tat, it's all just another line item.",
    playstyle:
      "Megamart units are on a tight schedule, and don't hang about. You can zip around the play area at high speed, using a range of movement tricks to be exactly where the enemy doesn't want you. Megamart ships are mostly quite fragile, however, with weak shields and slight silhouettes. You will need to rely on your tactical flexibility in place of raw power.",
  },
  "news-inc": {
    tagline: "Tonight, on This Is Your Galaxy...",
    briefing:
      "You flip another channel and find a story of heroism, kindness and generosity. You skip that channel but pause on the next: a story of betrayal, greed and murder. Another world trapped in corporate vice. Another rich and powerful person misuses their position. Another plague. Another terrorist attack. Another war. You flip again: garish colours and attractive people. There is laughter. You laugh. Space! It feels good to laugh. The scene freezes and pixelates. Cursing, you tap the green button and pay the microtransaction to restore the visuals. You are glad you did, that new starlet you like so much is appearing after the adverts.",
    playstyle:
      "News Inc. are a tricky customer. Reasonably fast units, with strong ranged weapons, your real power comes from being able to mess with both the CMD token economy and your enemy's own capabilities. You'll need to stay close to your enemy, keeping the pressure on them with your control tricks, and letting their futile attempts to defend themselves fuel your next assault.",
  },
  "galactic-credit": {
    tagline: "We succeed when you succeed. Take out a Galactic Credit loan today.",
    briefing:
      "Money built the stars. Every colony ship, every orbital foundry, every terraformed world began with one simple act: credit approved. At Galactic Credit, we are proud to stand at the beating heart of humanity's engine of progress. We empower bold investment, and we temper it with care, ensuring that ambition never outruns accountability. I'm proud to look our corporate partners in the eye, place a steady hand on their shoulder, and ask: son, are you sure about that? For adventurous investment must be balanced by paternal care, firm boundaries, and iron-clad legal protections.",
    playstyle:
      "Galactic Credit have some of the nastiest personnel in the galaxy. Ironically, for a fleet that can carry a Senior Lawyer, you can break the rules left, right and centre. Your ships are expensive, but you have multiple other ways to put your thumb on the scales, outside of just outgunning the enemy.",
  },
  "the-unity": {
    tagline: "In Unity, there is strength. Join the Peacekeepers today and keep the galaxy great!",
    briefing:
      "Dedicated and highly trained, the uniformed staff of the Unity's Peacekeeping divisions work tirelessly to keep the galaxy moving to the beat of the Registrar's great plan. Where the algorithm identifies need, the Peacekeepers are deployed. Where it detects suffering, the Peacekeepers deliver aid. Where it calculates a reasonable probability of dissent, the Peacekeepers crush it swiftly to protect the whole. The Peacekeepers are the military arm of the Unity government: keeping watch over the galaxy with a vigilant eye, a strong arm, and a colossal fleet.",
    playstyle:
      "The Unity fleet is built on a backbone of devastating capital ships, supported by endless waves of starfighters. Make sure to field enough wings to take full advantage of your faction ability and overwhelm the enemy with both small-arms fire and artillery.",
  },
  "the-ordinate": {
    tagline: "Your actions have been anticipated by the Registrar. Our victory is pre-ordained.",
    briefing:
      "The Ordinate plays church to the Unity's state. Its priests interpret the will of the Registrar, enforce its directives through influence, manipulation, and quiet coercion. The Registry guides the Ordinate, and the Ordinate guides the Unity. Everywhere their clandestine agents nudge fate, an accident here, a promotion there, until reality aligns with the algorithm's designs. Their deacons may be found advising admirals and system administrators alike, and they maintain military fleets of their own. They often come into direct conflict with local governments, system defence forces, Unity peacekeeping divisions, and even, on occasion, other dioceses of the Ordinate itself. All that is required for open conflict is a difference of opinion on the correct interpretation of the Registrar's great plan, and a willingness to back up that opinion with force.",
    playstyle:
      "The Ordinate are devilish at close range, with unparalleled passive fire, but weaker at range. Abilities such as Predictive Algorithms and others ensure that no matter where your enemy moves it will feel like you are already there to counter them. Take care to plan ahead, as several of your HVPs reward activating units early, but you don't want to be left outmanoeuvred and unable to bring the full power of your passive fire to bear.",
  },
  "the-discord": {
    tagline: "To ignore advice. To be wasteful. To err. This is our right. And we will die for it.",
    briefing:
      "Join the Discord and free the galaxy from the tyranny of The Unity! The algorithm may serve the needs of the many, but at what cost? Where does it leave space for the folly, failure and fantasies of the free individual? The Registry's rational plan is an oppression of the human spirit. The Unity is corrupt, The Ordinate thricely so. Even if you believe the Registry's power for good, it has been debased and corrupted by the greed of the grand secretaries of the Unity and the hubris of the archdeacons of the Ordinate. The Discord believes in a human future. Our arc of ascension may take longer, but we would rather strive for galactic nirvana without a boot on our neck.",
    playstyle:
      "The Discord are an elite faction with strong squadrons and powerful personnel. They lack hard-hitting ranged firepower, outside of their Command Ship, but the squadrons can provide much of the damage output. You are likely to take the initiative and have a bunch of tools to control the flow of the battle, then strike hard where needed.",
  },
  "golem-mega-systems": {
    tagline: "> Construction fleet delta 8 approaching target. Initialising drone swarms.",
    briefing:
      "United under the logo of Golem Mega-Systems, the six biggest construction firms in the galaxy conglomerated, fully embraced automation, and turned into something altogether stranger. Mechanisation and automation of dangerous mining and colony construction jobs was hailed as a triumph of progress: safer, faster, more reliable. But trillions of jobs were lost, and whole systems fell into poverty. Tracing the lines of credit and communication that led to the merger is near impossible, but Discord data-miners have begun to suspect that Golem Mega-Systems is no longer a self-interested commercial entity but a puppet of the Registrar, perhaps engineered to reduce the great plan's dependency on vain and capricious humans. Golem is incomprehensibly large and complex, distributed across a million foundry ships, a trillion drones, and more microscopic nano-agents than there are hydrogen atoms in a star. A vast distributed intelligence of drones, foundries, and nanites, carrying out construction and war alike as a mechanical ballet of perfectly orchestrated interlocking dancers.",
    playstyle:
      "Golem Mega-Systems is a living machine, evolving as the battle unfolds, and able to adapt to counter the strengths or exploit the weakness of the enemy. Damage to your ships spawns ever more drones, the utility of which vary depending on the HVP you pick (representing various machine minds or specialist facilities on board your ships). You can build aggressively with Assimilation Cluster, Forge-Overseer and Targeting Matrix, construct a defensive aegis with Auto-Repair Relay and Fabrication Cycler, or make a more tactically flexible hive-machine with Adaptive Configuration Processor and a Resource Allocation Algorithm.",
  },
  vyke: {
    briefing:
      "We should have listened to the Pyxian refugees. Driven from the far Galaxy North by some brutal race of conquerors, they spoke of a terrible empire: precise, proud, and unrelenting in their appetites. We smiled in sympathy and gave them shelter and jobs in our Fringe colonies. When the Vyke arrived in the Earendel cluster, all hell broke loose. They were in every way our technological, strategic and military superior. War was a way of life to them. Expansion was a sacred duty, conquest and subjugation a moral obligation. One by one, the rimward systems fell to the invaders. They swept a flaming gouge into human space, everywhere sacrificing entire planetary populations to their bio-plants and strip-mining worlds to fuel their constructor fleets. Through the broken newsfeeds of slaughtered vid-crews, we saw the jagged silhouettes of our enemy: hulking, crustacean-like forms, landing only in high-pressure atmospheres or in deep oceans. It was clear that there was no negotiation with the Vyke. Brutal and untroubled by self-doubt, they were utterly disdainful of diplomacy, and every attempt to establish contact was rebutted with warships and planetary bombing. We would either destroy them utterly... or be annihilated.",
    playstyle:
      "The Vyke are fast and aggressive brawlers, able to field many ships. Take full advantage of your ability to switch off enemy passive attacks by engaging the enemy with maximum prejudice. As long as you are holding the enemy close, you'll overwhelm them. Chase down the enemy's long-ranged ships and keep your powerful HVP safely aboard your largest units.",
  },
  aegis: {
    tagline: "> Situational analysis... Updating capability matrix... Sorting by threat index... Acquiring targets...",
    briefing:
      "The Autonomous Engagement and General Intervention System (AEGIS) was commissioned by The Unity, built by a host of defence contractors, and then given unprecedented operational latitude to defend humanity against the Vyke invasion. In battle, it acts as a single coordinated entity, a ruthlessly efficient combatant, distributed across a network of minute drones and colossal warships.",
    playstyle:
      "AEGIS are an elite force that can field some of the most powerful ships in the game. Their unique ability to share protocol shards across units poses a question: do you form a handful of mixed-arms task forces, consisting of a single heavy ship and an escort, or do you combine your capital ships into an unstoppable hammer, but one that can only strike in one place?",
  },
  "gen-omega": {
    tagline:
      "Ghosts, mirrormen, zeros... our vile offspring are our end. There's nothing on the other side of this war. Not for the last generation.",
    briefing:
      "A violent youthful guerrilla movement formed to oppose and disrupt the AEGIS in what they see as a desperate last stand for human freedom. Poorly supplied, but extremely violent, they favour destructive hit and run attacks. An apocalyptic terror cult to their distractors; noble pro-human activists to their supporters.",
    playstyle:
      "Gen Ω are dangerous guerrilla fighters, appearing unexpectedly and attacking ferociously without fear of death. Your enemy will struggle to pin you down, and when they do they will find that you fight even harder as you take damage. You have the option to build more into stealth and movement trickery, striking unexpectedly from the void, or focus more on raw damage output, even if you have to lose a few ships to maximise it.",
  },
  alliance: {
    tagline: "Your Unity is built on forced labour, stolen lives and broken worlds. It is brittle, and we will smash it.",
    briefing:
      "The Alliance of Non-Human Worlds is a disparate and decentralised rebellion of the non-human workers and wage-slaves against the oppression of The Unity. Their fleets are ramshackle collections of mismatched ships. Their tactics are driven by rage and resentment. The hulking Gorgronti see the galaxy as raw material to be reforged. The predatory Rannari hunt with ritual precision. The Yynnx wield invisible weapons of data and gene-code. Mutual distrust makes co-ordination difficult, but when they find common ground, they are a storm of vengeance.",
    playstyle:
      "The Alliance of Non-Human Worlds is a fractious, chaotic faction that cannot be relied on. They can field a lot of ships, but their capabilities are never certain. When you can bring them to bear, they are extremely powerful, but if you cannot find common ground, you will be weak and divided.",
  },
};
