// Verified Palworld 1.0 + Feybreak dataset. catchLevel = lowest wild free-roaming spawn
// (dungeons/caves & alpha/named bosses excluded; open-world field-boss level used when there is no plain wild spawn).
// techLevels = Technology-tree unlock (character level); ancient = also needs Ancient Technology Points.
// Work suitabilities verified against paldb.cc for 1.0/Feybreak (scale now goes to 8). ranchDrop = ranch production. nightOnly = night-only wild spawns.
window.PAL_DATA = {
  "pals": [
    {
      "name": "Foxparks",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 1
        }
      ],
      "catchLevel": 5,
      "location": "Windswept Hills",
      "tier": "starter",
      "condenseTarget": "4★ -> Kindling 5",
      "note": "Early fire kindler; equip its harness to wield it as a handheld flamethrower."
    },
    {
      "name": "Clovee",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        }
      ],
      "catchLevel": 3,
      "location": "Windswept Hills (Plateau of Beginnings)",
      "tier": "starter",
      "condenseTarget": "4★ -> Planting 5",
      "note": "Early planting/gathering helper for your first base."
    },
    {
      "name": "Sparkit",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Electricity",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 10,
      "location": "Windswept Hills",
      "tier": "starter",
      "condenseTarget": "4★ -> Electricity 5",
      "note": "Early electric pal for your first power generator; ranch it for passive Electric Organs.",
      "ranchDrop": "Electric Organ"
    },
    {
      "name": "Cattiva",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        },
        {
          "type": "Mining",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Windswept Hills",
      "tier": "starter",
      "condenseTarget": "",
      "note": "Starter all-rounder for handiwork, gathering, mining and transport."
    },
    {
      "name": "Lifmunk",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        },
        {
          "type": "Lumbering",
          "level": 1
        },
        {
          "type": "Medicine",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Windswept Hills",
      "tier": "starter",
      "condenseTarget": "",
      "note": "Common early handiwork/medicine pal for the workbench."
    },
    {
      "name": "Pengullet",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Cooling",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 2,
      "location": "Windswept Hills / Sea Breeze Archipelago",
      "tier": "starter",
      "condenseTarget": "",
      "note": "Early water/cooling pal; can also be fired from the Pengullet cannon."
    },
    {
      "name": "Jolthog",
      "suitabilities": [
        {
          "type": "Electricity",
          "level": 1
        }
      ],
      "catchLevel": 4,
      "location": "Windswept Hills",
      "tier": "early",
      "condenseTarget": "4★ -> Electricity 5",
      "note": "Early electricity generator."
    },
    {
      "name": "Tanzee",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        },
        {
          "type": "Lumbering",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 4,
      "location": "Bamboo Groves",
      "tier": "early",
      "condenseTarget": "",
      "note": "Early grass jack-of-all-trades for handiwork and planting."
    },
    {
      "name": "Amione",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 2
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 9,
      "location": "Early coasts / various",
      "tier": "early",
      "condenseTarget": "",
      "note": "Early watering/handiwork helper."
    },
    {
      "name": "Univolt",
      "suitabilities": [
        {
          "type": "Electricity",
          "level": 3
        },
        {
          "type": "Lumbering",
          "level": 1
        }
      ],
      "catchLevel": 20,
      "location": "Bamboo Groves",
      "tier": "early",
      "condenseTarget": "",
      "note": "Electricity generator and a fast early ground mount."
    },
    {
      "name": "Nitewing",
      "suitabilities": [
        {
          "type": "Gathering",
          "level": 2
        }
      ],
      "catchLevel": 12,
      "location": "Eastern Wild Island",
      "tier": "early",
      "condenseTarget": "",
      "note": "Reliable early flying mount; modest gathering at base."
    },
    {
      "name": "Eikthyrdeer",
      "suitabilities": [
        {
          "type": "Lumbering",
          "level": 2
        }
      ],
      "catchLevel": 9,
      "location": "Forest (Windswept Hills / Bamboo Groves)",
      "tier": "early",
      "condenseTarget": "",
      "note": "Lumbering worker and early ground mount with a double jump."
    },
    {
      "name": "Incineram",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 3
        },
        {
          "type": "Handiwork",
          "level": 2
        },
        {
          "type": "Mining",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 30,
      "location": "Twilight Dunes (desert)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Versatile fire/dark worker for mining, kindling and handiwork."
    },
    {
      "name": "Reptyro",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 5
        },
        {
          "type": "Mining",
          "level": 5
        }
      ],
      "catchLevel": 42,
      "location": "Mount Obsidian (volcano)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Heavy mining + kindling worker; rideable ground mount."
    },
    {
      "name": "Cinnamoth",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 2
        },
        {
          "type": "Gathering",
          "level": 2
        },
        {
          "type": "Medicine",
          "level": 2
        }
      ],
      "catchLevel": 16,
      "location": "Bamboo Groves",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Grass pal for planting and gathering."
    },
    {
      "name": "Broncherry",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 5
        }
      ],
      "catchLevel": 33,
      "location": "Deep Bamboo Thicket",
      "tier": "mid",
      "condenseTarget": "4★ -> Planting 6; Planting Handbooks to 10",
      "note": "Dedicated planting worker; doubles as a sturdy ground mount."
    },
    {
      "name": "Digtoise",
      "suitabilities": [
        {
          "type": "Mining",
          "level": 4
        }
      ],
      "catchLevel": 33,
      "location": "Dessicated Desert",
      "tier": "mid",
      "condenseTarget": "4★ -> Mining 5; its Drill Crusher skill also mines faster when ridden",
      "note": "Best early miner; spins like a drill through ore."
    },
    {
      "name": "Anubis",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 6
        },
        {
          "type": "Mining",
          "level": 6
        },
        {
          "type": "Transport",
          "level": 4
        }
      ],
      "catchLevel": 68,
      "location": "Dessicated Desert / field boss",
      "tier": "mid",
      "condenseTarget": "4★ -> Handiwork 7; Handiwork Handbooks to 10",
      "note": "Top-tier handiwork/mining worker and strong fighter; easiest via breeding."
    },
    {
      "name": "Vaelet",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 3
        },
        {
          "type": "Farming",
          "level": 2
        },
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Gathering",
          "level": 3
        },
        {
          "type": "Medicine",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 20,
      "location": "Forest (various)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Grass support for planting, gathering and medicine."
    },
    {
      "name": "Petallia",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 4
        },
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Gathering",
          "level": 3
        },
        {
          "type": "Medicine",
          "level": 4
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 28,
      "location": "Verdant Brook / field boss",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Grass worker for planting, medicine and handiwork."
    },
    {
      "name": "Katress",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Medicine",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 25,
      "location": "Moonless Shore (night)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Night-spawning worker for handiwork and medicine."
    },
    {
      "name": "Grizzbolt",
      "suitabilities": [
        {
          "type": "Electricity",
          "level": 5
        },
        {
          "type": "Handiwork",
          "level": 4
        },
        {
          "type": "Lumbering",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 5
        }
      ],
      "catchLevel": 70,
      "location": "No.3 Sanctuary / World Tree",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Powerful electricity generator and a minigun-wielding combat mount."
    },
    {
      "name": "Surfent",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 3
        },
        {
          "type": "Farming",
          "level": 2
        }
      ],
      "catchLevel": 12,
      "location": "Coasts (Dessicated Desert / various)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Fast early water mount for crossing oceans."
    },
    {
      "name": "Broncherry Aqua",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 5
        }
      ],
      "catchLevel": 51,
      "location": "Sakurajima",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Water variant — dedicated watering worker."
    },
    {
      "name": "Ghangler",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 5
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 30,
      "location": "Sakurajima / Phantom Isle (night)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Night-spawning watering worker."
    },
    {
      "name": "Foxcicle",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 3
        },
        {
          "type": "Cooling",
          "level": 4
        }
      ],
      "catchLevel": 30,
      "location": "Snow biome (Astral Mountains foothills)",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Ice pal for cooling the fridge and ranch drops."
    },
    {
      "name": "Warsect",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 3
        },
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Lumbering",
          "level": 4
        },
        {
          "type": "Transport",
          "level": 5
        }
      ],
      "catchLevel": 34,
      "location": "Bamboo Groves / various",
      "tier": "mid",
      "condenseTarget": "",
      "note": "Tanky grass/ground worker for lumbering, transport and handiwork."
    },
    {
      "name": "Suzaku",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 5
        }
      ],
      "catchLevel": 40,
      "location": "Dessicated Desert",
      "tier": "late",
      "condenseTarget": "4★ -> Kindling 6; Kindling Handbooks to 10",
      "note": "Fast fire flying mount and strong kindling worker."
    },
    {
      "name": "Blazamut",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 6
        },
        {
          "type": "Mining",
          "level": 7
        }
      ],
      "catchLevel": 46,
      "location": "Mount Obsidian (volcano)",
      "tier": "late",
      "condenseTarget": "4★ -> Mining 8",
      "note": "Hulking fire bruiser; elite miner and kindler."
    },
    {
      "name": "Astegon",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Mining",
          "level": 7
        }
      ],
      "catchLevel": 55,
      "location": "Astral Mountains / field boss",
      "tier": "late",
      "condenseTarget": "4★ -> Mining 8; Mining Handbooks to 10",
      "note": "Elite miner and a strong dragon/dark flying mount."
    },
    {
      "name": "Lyleen",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 7
        },
        {
          "type": "Handiwork",
          "level": 5
        },
        {
          "type": "Gathering",
          "level": 6
        },
        {
          "type": "Medicine",
          "level": 5
        }
      ],
      "catchLevel": 58,
      "location": "No.3 Sanctuary / field boss",
      "tier": "late",
      "condenseTarget": "",
      "note": "Top-tier medicine producer and planter."
    },
    {
      "name": "Suzaku Aqua",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 6
        }
      ],
      "catchLevel": 68,
      "location": "Sakurajima / sky islands",
      "tier": "late",
      "condenseTarget": "4★ -> Watering 7; Handbooks to 10",
      "note": "Water flying mount and strong watering worker."
    },
    {
      "name": "Jormuntide",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 7
        }
      ],
      "catchLevel": 55,
      "location": "Lakes (field boss)",
      "tier": "late",
      "condenseTarget": "4★ -> Watering 8; Handbooks to 10",
      "note": "Elite watering worker and water-dragon mount; often bred."
    },
    {
      "name": "Helzephyr",
      "suitabilities": [
        {
          "type": "Transport",
          "level": 4
        }
      ],
      "catchLevel": 24,
      "location": "Astral Mountains (night)",
      "tier": "late",
      "condenseTarget": "",
      "note": "Dark flying mount and strong transporter."
    },
    {
      "name": "Wumpo Botan",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 3
        },
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Lumbering",
          "level": 5
        },
        {
          "type": "Transport",
          "level": 6
        }
      ],
      "catchLevel": 53,
      "location": "Sakurajima / Eastern Wild Island",
      "tier": "late",
      "condenseTarget": "",
      "note": "Big tanky grass pal for transport and lumbering."
    },
    {
      "name": "Mammorest Cryst",
      "suitabilities": [
        {
          "type": "Lumbering",
          "level": 5
        },
        {
          "type": "Mining",
          "level": 4
        },
        {
          "type": "Cooling",
          "level": 5
        }
      ],
      "catchLevel": 36,
      "location": "Snow biome (Land of Absolute Zero)",
      "tier": "late",
      "condenseTarget": "",
      "note": "Ice variant; heavy lumbering/cooling base worker."
    },
    {
      "name": "Verdash",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 4
        },
        {
          "type": "Handiwork",
          "level": 5
        },
        {
          "type": "Gathering",
          "level": 5
        },
        {
          "type": "Lumbering",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 3
        }
      ],
      "catchLevel": 52,
      "location": "Deep Bamboo Thicket / sanctuary",
      "tier": "late",
      "condenseTarget": "",
      "note": "Fast agile grass ground mount; nimble gatherer and handiworker."
    },
    {
      "name": "Lyleen Noct",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 5
        },
        {
          "type": "Gathering",
          "level": 6
        },
        {
          "type": "Medicine",
          "level": 7
        }
      ],
      "catchLevel": 75,
      "location": "Sakurajima (night) / bred",
      "tier": "late",
      "condenseTarget": "4★ -> Medicine 8; Handbooks to 10",
      "note": "Dark variant excelling at medicine and gathering; usually bred."
    },
    {
      "name": "Renjishi",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 8
        },
        {
          "type": "Handiwork",
          "level": 6
        },
        {
          "type": "Gathering",
          "level": 5
        },
        {
          "type": "Transport",
          "level": 5
        }
      ],
      "catchLevel": 80,
      "location": "World Tree (Feybreak)",
      "tier": "late",
      "condenseTarget": "4★ -> Kindling 9; Kindling Handbooks to 10",
      "note": "Top kindling worker in the game; a fire lion field boss (not rideable)."
    },
    {
      "name": "Jormuntide Ignis",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 7
        }
      ],
      "catchLevel": 66,
      "location": "Mount Obsidian (volcano)",
      "tier": "endgame",
      "condenseTarget": "3★+Handbooks -> Kindling 10",
      "note": "Elite kindling worker and fire-dragon mount."
    },
    {
      "name": "Ophydia",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 5
        },
        {
          "type": "Planting",
          "level": 7
        }
      ],
      "catchLevel": 80,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Planting 8 / Watering 6; Handbooks to 10",
      "note": "Grass serpent strong at planting and watering."
    },
    {
      "name": "Dandilord",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 8
        },
        {
          "type": "Handiwork",
          "level": 6
        },
        {
          "type": "Gathering",
          "level": 5
        },
        {
          "type": "Medicine",
          "level": 6
        },
        {
          "type": "Transport",
          "level": 3
        }
      ],
      "catchLevel": 78,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Planting 9; Planting Handbooks to 10",
      "note": "Best planting worker in the game; a grass field boss."
    },
    {
      "name": "Orserk",
      "suitabilities": [
        {
          "type": "Electricity",
          "level": 8
        },
        {
          "type": "Handiwork",
          "level": 3
        },
        {
          "type": "Transport",
          "level": 4
        }
      ],
      "catchLevel": 74,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Electricity 5; Electricity Handbooks to 10",
      "note": "Best-in-class electricity generator; strong electric dragon (self-only breeding)."
    },
    {
      "name": "Aegidron",
      "suitabilities": [
        {
          "type": "Mining",
          "level": 8
        }
      ],
      "catchLevel": 79,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "2★+Handbooks -> Mining 10",
      "note": "Best mining worker in the game; a World Tree field boss."
    },
    {
      "name": "Silvance",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 6
        },
        {
          "type": "Handiwork",
          "level": 6
        },
        {
          "type": "Gathering",
          "level": 4
        },
        {
          "type": "Medicine",
          "level": 8
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 78,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Medicine 9; Handbooks to 10",
      "note": "Best medicine producer in the game; a grass field boss."
    },
    {
      "name": "Bellanoir Libero",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 6
        },
        {
          "type": "Medicine",
          "level": 7
        },
        {
          "type": "Transport",
          "level": 4
        }
      ],
      "catchLevel": 50,
      "location": "Raid boss (summon only)",
      "tier": "endgame",
      "condenseTarget": "",
      "note": "Powerful dark raid boss; summoned at the altar with a slab."
    },
    {
      "name": "Frostallion",
      "suitabilities": [
        {
          "type": "Cooling",
          "level": 7
        }
      ],
      "catchLevel": 60,
      "location": "Land of Absolute Zero (field boss)",
      "tier": "endgame",
      "condenseTarget": "3★+Handbooks -> Cooling 10",
      "note": "Ice legendary; premier cooling worker and flying mount."
    },
    {
      "name": "Frostallion Noct",
      "suitabilities": [
        {
          "type": "Gathering",
          "level": 7
        }
      ],
      "catchLevel": 65,
      "location": "Field boss / bred",
      "tier": "endgame",
      "condenseTarget": "4★ -> Gathering 8; Gathering Handbooks to 10",
      "note": "Dark legendary flyer; top gatherer. Bred from Frostallion + Helzephyr."
    },
    {
      "name": "Bastigor",
      "suitabilities": [
        {
          "type": "Lumbering",
          "level": 6
        },
        {
          "type": "Mining",
          "level": 5
        },
        {
          "type": "Cooling",
          "level": 8
        }
      ],
      "catchLevel": 75,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Cooling 9; Handbooks to 10",
      "note": "Best cooling worker in the game; sturdy ice tank."
    },
    {
      "name": "Knocklem",
      "suitabilities": [
        {
          "type": "Gathering",
          "level": 4
        },
        {
          "type": "Mining",
          "level": 7
        },
        {
          "type": "Transport",
          "level": 7
        }
      ],
      "catchLevel": 55,
      "location": "Feybreak desert",
      "tier": "endgame",
      "condenseTarget": "4★ -> Transporting 8; Handbooks to 10",
      "note": "Best transporter in the game; also a strong miner."
    },
    {
      "name": "Neptilius",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 7
        }
      ],
      "catchLevel": 60,
      "location": "Field encounter (frozen islet)",
      "tier": "endgame",
      "condenseTarget": "3★+Handbooks -> Watering 10",
      "note": "Water legendary; elite watering worker and combat swimmer."
    },
    {
      "name": "Celesdir",
      "suitabilities": [
        {
          "type": "Gathering",
          "level": 4
        },
        {
          "type": "Lumbering",
          "level": 7
        }
      ],
      "catchLevel": 54,
      "location": "Yamijima / Feybreak",
      "tier": "endgame",
      "condenseTarget": "4★ -> Lumbering 8; Handbooks to 10",
      "note": "Elite lumbering worker; noble Feybreak stag."
    },
    {
      "name": "Celesdir Noct",
      "suitabilities": [
        {
          "type": "Gathering",
          "level": 4
        },
        {
          "type": "Lumbering",
          "level": 8
        }
      ],
      "catchLevel": 79,
      "location": "World Tree / bred",
      "tier": "endgame",
      "condenseTarget": "4★ -> Lumbering 9; Handbooks to 10",
      "note": "Best lumbering worker in the game; dark variant, usually bred."
    },
    {
      "name": "Solenne",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 8
        },
        {
          "type": "Gathering",
          "level": 4
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 76,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Handiwork 9; Handiwork Handbooks to 10",
      "note": "Best handiwork worker in the game."
    },
    {
      "name": "Shaolong",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 8
        },
        {
          "type": "Gathering",
          "level": 5
        }
      ],
      "catchLevel": 76,
      "location": "World Tree (Feybreak)",
      "tier": "endgame",
      "condenseTarget": "4★ -> Watering 9; Watering Handbooks to 10",
      "note": "Best watering worker in the game and an S-tier flying mount."
    },
    {
      "name": "Chikipi",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Starter grassy fields",
      "tier": "starter",
      "note": "The only egg producer (cake ingredient); partner skill Egg Layer.",
      "ranchDrop": "Egg"
    },
    {
      "name": "Mozzarina",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 2
        }
      ],
      "catchLevel": 9,
      "location": "Grassy plains",
      "tier": "early",
      "note": "Ranch-only; the only milk producer (cake ingredient).",
      "ranchDrop": "Milk"
    },
    {
      "name": "Beegarde",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 2
        },
        {
          "type": "Farming",
          "level": 3
        },
        {
          "type": "Handiwork",
          "level": 2
        },
        {
          "type": "Gathering",
          "level": 3
        },
        {
          "type": "Lumbering",
          "level": 2
        },
        {
          "type": "Medicine",
          "level": 2
        },
        {
          "type": "Transport",
          "level": 2
        }
      ],
      "catchLevel": 28,
      "location": "Forests",
      "tier": "mid",
      "note": "Ranch honey (cake ingredient); explodes when defeated.",
      "ranchDrop": "Honey"
    },
    {
      "name": "Lamball",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Starter fields",
      "tier": "starter",
      "note": "Wool + early handiwork/hauling.",
      "ranchDrop": "Wool"
    },
    {
      "name": "Cremis",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 2
        },
        {
          "type": "Gathering",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Starter fields",
      "tier": "starter",
      "note": "Wool producer.",
      "ranchDrop": "Wool"
    },
    {
      "name": "Melpaca",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 2
        }
      ],
      "catchLevel": 5,
      "location": "Open fields",
      "tier": "starter",
      "note": "Wool producer.",
      "ranchDrop": "Wool"
    },
    {
      "name": "Vixy",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Starter fields",
      "tier": "starter",
      "note": "'Dig Here!' — a great early Pal Sphere / income source.",
      "ranchDrop": "Digs up items (mostly Pal Spheres, gold, arrows)"
    },
    {
      "name": "Woolipop",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        }
      ],
      "catchLevel": 9,
      "location": "Fields",
      "tier": "early",
      "note": "Ranch-only specialty drop.",
      "ranchDrop": "Cotton Candy"
    },
    {
      "name": "Sibelyx",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 3
        },
        {
          "type": "Medicine",
          "level": 3
        },
        {
          "type": "Cooling",
          "level": 3
        }
      ],
      "catchLevel": 36,
      "location": "Snow fields",
      "tier": "late",
      "note": "Ranch high-quality cloth.",
      "ranchDrop": "High Quality Cloth"
    },
    {
      "name": "Mau",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        }
      ],
      "catchLevel": 64,
      "location": "Caves (early) / field",
      "tier": "endgame",
      "note": "Ranch gold ('Gold Digger'). Easy early from caves; wild field spawn only at Lv 64.",
      "ranchDrop": "Gold Coin"
    },
    {
      "name": "Flambelle",
      "suitabilities": [
        {
          "type": "Kindling",
          "level": 1
        },
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 4,
      "location": "Early fields",
      "tier": "starter",
      "note": "Ranch flame organs.",
      "ranchDrop": "Flame Organ"
    },
    {
      "name": "Caprity",
      "suitabilities": [
        {
          "type": "Planting",
          "level": 2
        },
        {
          "type": "Farming",
          "level": 1
        }
      ],
      "catchLevel": 14,
      "location": "Grassy fields",
      "tier": "early",
      "note": "Ranch red berries (cake ingredient).",
      "ranchDrop": "Red Berries"
    },
    {
      "name": "Dumud",
      "suitabilities": [
        {
          "type": "Watering",
          "level": 2
        },
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Mining",
          "level": 2
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 20,
      "location": "Desert/volcanic fields",
      "tier": "mid",
      "note": "Ranch high-quality pal oil.",
      "ranchDrop": "High Quality Pal Oil"
    },
    {
      "name": "Depresso",
      "suitabilities": [
        {
          "type": "Farming",
          "level": 1
        },
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Mining",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 4,
      "location": "Early fields",
      "tier": "starter",
      "note": "Ranch venom gland.",
      "ranchDrop": "Venom Gland"
    },
    {
      "name": "Ribbuny",
      "suitabilities": [
        {
          "type": "Handiwork",
          "level": 1
        },
        {
          "type": "Gathering",
          "level": 1
        },
        {
          "type": "Transport",
          "level": 1
        }
      ],
      "catchLevel": 1,
      "location": "Starter fields",
      "tier": "starter",
      "note": "Weapon-crafting helper (Skilled Fingers); not a ranch pal."
    }
  ],
  "baseCapacity": {
    "defaultWorkersPerBase": 15,
    "maxWorkersPerBase": 50,
    "maxBases": 10,
    "howToIncrease": "Workers per base are set by the world/server value 'Maximum number of work Pals at the base' (BaseCampWorkerMaxNum), default 15. In single-player/co-op raise it with the World Settings slider up to the vanilla cap of 50; on dedicated servers edit BaseCampWorkerMaxNum in PalWorldSettings.ini (or the host panel) and restart. Going above 50 requires mods and causes lag. The number of BASES is separate: 'Maximum number of bases for each guild' defaults to 4 (was 3 pre-1.0) and is raisable to 10 via World Settings, but each extra base slot beyond the first must still be unlocked by raising your base level, so the slider only sets the ceiling.",
    "condenserNotes": "The Pal Essence Condenser ranks a pal through 4 star tiers, consuming same-species pals: 1★=4, 2★=16, 3★=32, 4★=64 (cumulative 116 to max). Condensing raises HP/Attack/Defense and the Partner Skill (up to +5). At 4★ EVERY work suitability the pal has gains exactly +1 level. To reach the Lv10 cap you must additionally feed that job's Work Suitability Handbooks (and stack the relevant base passive/aura) - the condenser alone only gives +1. In Palworld 1.0 no pal is born above Lv8, and eight jobs have a single Lv-8 'king' (Kindling=Renjishi, Watering=Shaolong, Planting=Dandilord, Mining=Aegidron, Medicine=Silvance, Cooling=Bastigor, Lumbering=Celesdir Noct, Handiwork=Solenne); Generating Electricity tops out at Lv4 (Orserk) and Gathering/Transporting at Lv7 (Frostallion Noct / Knocklem)."
  },
  "suitabilityLadders": {
    "Kindling": [
      {
        "name": "Foxparks",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Incineram",
        "workLevel": 3,
        "catchLevel": 20
      },
      {
        "name": "Suzaku",
        "workLevel": 5,
        "catchLevel": 40
      },
      {
        "name": "Blazamut",
        "workLevel": 6,
        "catchLevel": 46
      },
      {
        "name": "Jormuntide Ignis",
        "workLevel": 7,
        "catchLevel": 55
      },
      {
        "name": "Renjishi",
        "workLevel": 8,
        "catchLevel": 50
      }
    ],
    "Watering": [
      {
        "name": "Pengullet",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Surfent",
        "workLevel": 3,
        "catchLevel": 20
      },
      {
        "name": "Broncherry Aqua",
        "workLevel": 5,
        "catchLevel": 33
      },
      {
        "name": "Suzaku Aqua",
        "workLevel": 6,
        "catchLevel": 45
      },
      {
        "name": "Jormuntide",
        "workLevel": 7,
        "catchLevel": 42
      },
      {
        "name": "Shaolong",
        "workLevel": 8,
        "catchLevel": 78
      }
    ],
    "Planting": [
      {
        "name": "Clowve",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Cinnamoth",
        "workLevel": 2,
        "catchLevel": 16
      },
      {
        "name": "Broncherry",
        "workLevel": 5,
        "catchLevel": 23
      },
      {
        "name": "Ophydia",
        "workLevel": 7,
        "catchLevel": 69
      },
      {
        "name": "Dandilord",
        "workLevel": 8,
        "catchLevel": 78
      }
    ],
    "Electricity": [
      {
        "name": "Sparkit",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Jolthog",
        "workLevel": 1,
        "catchLevel": 5
      },
      {
        "name": "Univolt",
        "workLevel": 3,
        "catchLevel": 12
      },
      {
        "name": "Grizzbolt",
        "workLevel": 3,
        "catchLevel": 30
      },
      {
        "name": "Orserk",
        "workLevel": 4,
        "catchLevel": 52
      }
    ],
    "Handiwork": [
      {
        "name": "Lifmunk",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Tanzee",
        "workLevel": 2,
        "catchLevel": 3
      },
      {
        "name": "Katress",
        "workLevel": 3,
        "catchLevel": 25
      },
      {
        "name": "Anubis",
        "workLevel": 6,
        "catchLevel": 30
      },
      {
        "name": "Solenne",
        "workLevel": 8,
        "catchLevel": 78
      }
    ],
    "Gathering": [
      {
        "name": "Tanzee",
        "workLevel": 1,
        "catchLevel": 3
      },
      {
        "name": "Cinnamoth",
        "workLevel": 2,
        "catchLevel": 16
      },
      {
        "name": "Verdash",
        "workLevel": 3,
        "catchLevel": 40
      },
      {
        "name": "Frostallion Noct",
        "workLevel": 7,
        "catchLevel": 50
      }
    ],
    "Lumbering": [
      {
        "name": "Eikthyrdeer",
        "workLevel": 2,
        "catchLevel": 8
      },
      {
        "name": "Warsect",
        "workLevel": 4,
        "catchLevel": 34
      },
      {
        "name": "Mammorest Cryst",
        "workLevel": 5,
        "catchLevel": 40
      },
      {
        "name": "Celesdir",
        "workLevel": 7,
        "catchLevel": 50
      },
      {
        "name": "Celesdir Noct",
        "workLevel": 8,
        "catchLevel": 79
      }
    ],
    "Mining": [
      {
        "name": "Cattiva",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Digtoise",
        "workLevel": 4,
        "catchLevel": 19
      },
      {
        "name": "Reptyro",
        "workLevel": 5,
        "catchLevel": 32
      },
      {
        "name": "Astegon",
        "workLevel": 7,
        "catchLevel": 45
      },
      {
        "name": "Aegidron",
        "workLevel": 8,
        "catchLevel": 79
      }
    ],
    "Medicine": [
      {
        "name": "Lifmunk",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Vaelet",
        "workLevel": 3,
        "catchLevel": 20
      },
      {
        "name": "Petallia",
        "workLevel": 4,
        "catchLevel": 21
      },
      {
        "name": "Lyleen Noct",
        "workLevel": 7,
        "catchLevel": 48
      },
      {
        "name": "Silvance",
        "workLevel": 8,
        "catchLevel": 78
      }
    ],
    "Cooling": [
      {
        "name": "Pengullet",
        "workLevel": 1,
        "catchLevel": null
      },
      {
        "name": "Foxcicle",
        "workLevel": 4,
        "catchLevel": 30
      },
      {
        "name": "Frostallion",
        "workLevel": 7,
        "catchLevel": 50
      },
      {
        "name": "Bastigor",
        "workLevel": 8,
        "catchLevel": 55
      }
    ],
    "Transport": [
      {
        "name": "Tanzee",
        "workLevel": 1,
        "catchLevel": 3
      },
      {
        "name": "Nitewing",
        "workLevel": 3,
        "catchLevel": 15
      },
      {
        "name": "Helzephyr",
        "workLevel": 3,
        "catchLevel": 40
      },
      {
        "name": "Wumpo Botan",
        "workLevel": 4,
        "catchLevel": 42
      },
      {
        "name": "Knocklem",
        "workLevel": 7,
        "catchLevel": 52
      }
    ]
  },
  "mounts": [
    {
      "name": "Necromus",
      "category": "Ground",
      "speed": 1900,
      "speedKind": "sprint",
      "catchLevel": 60,
      "note": "Legendary. Tied-fastest ground mount; dashes on its Active Skill. Big 350 stamina. Saddle Tech 61."
    },
    {
      "name": "Hartalis",
      "category": "Ground",
      "speed": 1900,
      "speedKind": "sprint",
      "catchLevel": 70,
      "note": "Feybreak legendary. Ties Necromus, huge 400 stamina, triple-jump. Saddle Tech 70."
    },
    {
      "name": "Paladius",
      "category": "Ground",
      "speed": 1800,
      "speedKind": "sprint",
      "catchLevel": 60,
      "note": "Legendary (Necromus's counterpart). 400 stamina. Saddle Tech 61."
    },
    {
      "name": "Azurmane",
      "category": "Ground",
      "speed": 1260,
      "speedKind": "sprint",
      "catchLevel": 63,
      "note": "Has an Air Dash while mounted. Stamina 220. Saddle Tech 58."
    },
    {
      "name": "Blazamut Ryu",
      "category": "Ground",
      "speed": 1200,
      "speedKind": "sprint",
      "catchLevel": 55,
      "note": "1.0 dragon ground mount. Stamina 190. Saddle Tech 55."
    },
    {
      "name": "Fenglope",
      "category": "Ground",
      "speed": 1050,
      "speedKind": "sprint",
      "catchLevel": 25,
      "note": "Ties Direhowl on speed but far more stamina (140) + double-jump. Saddle Tech 26."
    },
    {
      "name": "Direhowl",
      "category": "Ground",
      "speed": 1050,
      "speedKind": "sprint",
      "catchLevel": 10,
      "note": "Best EARLY ground mount — minimal tech (Saddle Tech 9). Low stamina (70)."
    },
    {
      "name": "Jetragon",
      "category": "Flying",
      "speed": 3300,
      "speedKind": "sprint",
      "catchLevel": 60,
      "note": "Fastest mount in the game by a wide margin (land/air/sea). Low stamina (110) so it drains fast. Saddle Tech 79 (near level cap)."
    },
    {
      "name": "Panthalus",
      "category": "Flying",
      "speed": 3000,
      "speedKind": "sprint",
      "catchLevel": 70,
      "note": "Story-progression whale (no wild spawn); also travels on water. ⚠ Speed unverified — paldb readout looked glitched, treat with caution."
    },
    {
      "name": "Shaolong",
      "category": "Flying",
      "speed": 2800,
      "speedKind": "sprint",
      "catchLevel": 76,
      "note": "Feybreak (World Tree). Second-fastest verified flyer. Stamina 100. Saddle Tech 77."
    },
    {
      "name": "Eidrolon Ignis",
      "category": "Flying",
      "speed": 2750,
      "speedKind": "sprint",
      "catchLevel": 75,
      "note": "Feybreak (World Tree). Stamina 130. Saddle Tech 76."
    },
    {
      "name": "Xenolord",
      "category": "Flying",
      "speed": 2700,
      "speedKind": "sprint",
      "catchLevel": 70,
      "note": "Feybreak final-boss legendary. Best stamina of the top flyers (300) — great for long hauls. Saddle Tech 66."
    },
    {
      "name": "Frostallion",
      "category": "Flying",
      "speed": 1800,
      "speedKind": "sprint",
      "catchLevel": 60,
      "note": "Legendary. Stamina 300. Big gap below the Feybreak flyers. Saddle Tech 62."
    },
    {
      "name": "Shadowbeak",
      "category": "Flying",
      "speed": 1600,
      "speedKind": "sprint",
      "catchLevel": 50,
      "note": "Legendary; speeds up further while flying. Stamina 250. Saddle Tech 47."
    },
    {
      "name": "Faleris",
      "category": "Flying",
      "speed": 1400,
      "speedKind": "sprint",
      "catchLevel": 54,
      "note": "Solid late-game flyer. Stamina 230. Saddle Tech 60."
    },
    {
      "name": "Ragnahawk",
      "category": "Flying",
      "speed": 1300,
      "speedKind": "sprint",
      "catchLevel": 32,
      "note": "Best MID-game flyer — available early with good stamina (150). Saddle Tech 33."
    },
    {
      "name": "Suzaku Aqua",
      "category": "Flying",
      "speed": 1100,
      "speedKind": "sprint",
      "catchLevel": 68,
      "note": "Flying (not a water mount). +5–25% movement per Water Pal in your party. Stamina 350. Saddle Tech 44."
    },
    {
      "name": "Nitewing",
      "category": "Flying",
      "speed": 750,
      "speedKind": "sprint",
      "catchLevel": 12,
      "note": "Classic cheap first flyer — get airborne early. Saddle Tech 15."
    },
    {
      "name": "Neptilius",
      "category": "Water",
      "speed": 2000,
      "speedKind": "swim",
      "catchLevel": 60,
      "note": "Feybreak legendary — fastest swimmer in the game; leaps high over water. Stamina 410. Saddle Tech 64."
    },
    {
      "name": "Jormuntide",
      "category": "Water",
      "speed": 1800,
      "speedKind": "swim",
      "catchLevel": 55,
      "note": "The classic best water mount. Stamina 150. Saddle Tech 40."
    },
    {
      "name": "Surfent",
      "category": "Water",
      "speed": 1440,
      "speedKind": "swim",
      "catchLevel": 12,
      "note": "Excellent EARLY water mount — very low tech gate (Saddle Tech 16). Stamina 100."
    },
    {
      "name": "Penking",
      "category": "Water",
      "speed": 1080,
      "speedKind": "swim",
      "catchLevel": 20,
      "note": "Early/cheap swimmer. Stamina 100."
    },
    {
      "name": "Whalaska",
      "category": "Water",
      "speed": 950,
      "speedKind": "swim",
      "catchLevel": 42,
      "note": "Sturdy mid swimmer. Stamina 200. Saddle Tech 42."
    }
  ],
  "baseTypes": [
    {
      "id": "mining",
      "name": "Mining",
      "icon": "⛏️",
      "goal": "Build on dense ore/coal/sulfur/quartz nodes to mass-produce mining resources and smelt ingots.",
      "works": [
        "Mining",
        "Transport",
        "Kindling"
      ],
      "pals": [
        {
          "name": "Digtoise",
          "why": "Best dedicated miner (Mining 3); its rolling attack shreds ore/stone nodes."
        },
        {
          "name": "Anubis",
          "why": "Handiwork 4 + Mining 3 — mines and builds/crafts; great backbone worker."
        },
        {
          "name": "Menasting",
          "why": "Mining 3, sturdy reliable ore harvester."
        },
        {
          "name": "Astegon",
          "why": "Mining 4 — one of the few that can work top-tier Pal Metal nodes."
        },
        {
          "name": "Blazamut",
          "why": "Mining 4 alternative for the highest-tier nodes."
        },
        {
          "name": "Reptyro",
          "why": "Mining 3 and passively cools nearby stations."
        }
      ],
      "structures": [
        "Build directly ON ore + coal (+ sulfur/quartz) deposits",
        { "item": "Furnace (→ Improved / Electric)", "count": "2–3", "note": "ingots; more furnaces = more parallel smelting" },
        { "item": "Crusher", "count": "1–2", "note": "stone → other materials" },
        { "item": "Production Assembly Line", "count": "1–2", "note": "refining / mass crafting" },
        { "item": "Chests + Feed Box", "count": "several + 1", "note": "beside the nodes" },
        "A Kindling pal (e.g. Jormuntide Ignis) to run furnaces"
      ],
      "tips": [
        "Best combined ore+coal spot: the peak by the Sealed Realm of the Guardian, Verdant Brook (~180,-39) — ~8 ore + ~6 coal in one build radius.",
        "Sulfur: Mount Obsidian near the Tower of the Brothers of the Eternal Pyre (~-594,-525); head there around Lv 20.",
        "Pure Quartz: Astral Mountain (~-212,249, needs cold-resist armor); Feybreak Hexolite ~(-1340,-1285) is endgame.",
        "Run 2–3 high-Mining specialists + 1 hauler; nodes respawn, so quality beats quantity."
      ],
      "roadmap": [
        {
          "level": 1,
          "stage": "Early (base Lv 1–5)",
          "text": "Claim a spot touching ore + a few stone nodes; basic Furnace + chests; slot Digtoise plus filler haulers (Cattiva/Tombat)."
        },
        {
          "level": 6,
          "stage": "Mid (base Lv 6–12)",
          "text": "Move onto the Verdant Brook ore+coal peak; add Anubis + Menasting, an Improved/Electric Furnace, a Kindling smelter + a Transport pal."
        },
        {
          "level": 14,
          "stage": "Late / Maxed (Lv 14+)",
          "text": "Add dedicated sulfur & quartz outposts; slot Astegon/Blazamut for Pal Metal; Reptyro for cooling; fill slots with Mining 3–4 pals only."
        }
      ],
      "techNeeds": [
        "Primitive Furnace",
        "Crusher",
        "Improved Furnace",
        "Electric Furnace",
        "Production Assembly Line"
      ]
    },
    {
      "id": "breeding",
      "name": "Breeding",
      "icon": "🥚",
      "goal": "A Breeding Farm fed by a self-sufficient Cake supply chain — realistically a player ~19+ project (everything unlocks late).",
      "works": [
        "Farming",
        "Kindling",
        "Handiwork",
        "Planting"
      ],
      "pals": [
        {
          "name": "Mozzarina",
          "why": "The ONLY ranch pal that produces Milk (cake ingredient)."
        },
        {
          "name": "Chikipi",
          "why": "The ONLY ranch pal that produces Eggs (cake ingredient)."
        },
        {
          "name": "Beegarde",
          "why": "Produces Honey on a ranch (cake ingredient)."
        },
        {
          "name": "Jormuntide Ignis",
          "why": "Kindling 4 — speeds up Cake cooking at the Cooking Pot."
        },
        {
          "name": "Anubis",
          "why": "Handiwork 4 — keeps the Mill, plantations and crafting running."
        },
        {
          "name": "Lyleen / Petallia / Dandilord",
          "why": "Planting pal to tend the Wheat + Berry plots."
        }
      ],
      "structures": [
        { "item": "Breeding Farm (+ Feed Box)", "count": "1–2", "note": "more farms = more eggs laid in parallel" },
        { "item": "Egg Incubator", "count": "4–8", "note": "hatch many eggs at once — the real bottleneck" },
        { "item": "Ranch", "count": "1–2", "note": "Mozzarina + Chikipi + Beegarde for Cake ingredients" },
        { "item": "Wheat Plantation + Mill", "count": "2 + 1", "note": "flour for Cake (3 wheat → 1 flour)" },
        { "item": "Berry Plantation", "count": "2", "note": "Red Berries for Cake" },
        { "item": "Cooking Pot", "count": "1", "note": "bake Cake (kicks off breeding); + chests" }
      ],
      "tips": [
        "One Cake = one egg cycle. A cake bottleneck is the #1 pitfall — build 2–3 ranches of ingredient pals + several berry/wheat plots.",
        "Cake recipe: Flour ×5, Red Berries ×8, Milk ×7, Egg ×8, Honey ×2 (Cooking Pot).",
        "Unlock order: Ranch Lv 5, Egg Incubator Lv 7, Mill Lv 15, Cooking Pot Lv 17, Breeding Farm Lv 19.",
        "Cakes spoil — cook in batches near use / keep them in cold storage."
      ],
      "roadmap": [
        {
          "level": 1,
          "stage": "Prep (player ~5–15)",
          "text": "Not viable yet — on your main base build a Ranch (Lv 5) and stockpile Mozzarina/Chikipi/Beegarde; unlock the Egg Incubator (Lv 7)."
        },
        {
          "level": 6,
          "stage": "Build chain (player ~15–18)",
          "text": "Unlock Wheat Plantation + Mill (Lv 15) and Cooking Pot (Lv 17); set up the full cake chain; slot Jormuntide Ignis + a planter."
        },
        {
          "level": 12,
          "stage": "Dedicate (player 19+)",
          "text": "Unlock the Breeding Farm (Lv 19); 1 farm + several incubators, multiple ranches, Anubis on Handiwork; scale up as slots allow."
        }
      ],
      "techNeeds": [
        "Ranch",
        "Egg Incubator",
        "Wheat Plantation",
        "Mill",
        "Cooking Pot",
        "Breeding Farm"
      ]
    },
    {
      "id": "farming",
      "name": "Farming / Ranch",
      "icon": "🌾",
      "goal": "Crop plantations + passive ranch products (milk, eggs, wool, honey, flame organs, coins) for food and crafting supply.",
      "works": [
        "Planting",
        "Watering",
        "Gathering",
        "Farming"
      ],
      "pals": [
        {
          "name": "Mozzarina",
          "why": "Milk on a ranch."
        },
        {
          "name": "Chikipi",
          "why": "Eggs on a ranch."
        },
        {
          "name": "Lamball / Cremis / Melpaca",
          "why": "Wool on a ranch."
        },
        {
          "name": "Beegarde",
          "why": "Honey on a ranch."
        },
        {
          "name": "Vixy",
          "why": "'Dig Here!' digs up gold, arrows, even Pal Spheres — strong early income."
        },
        {
          "name": "Flambelle / Kelpsea Ignis",
          "why": "Flame Organs on a ranch."
        },
        {
          "name": "Depresso",
          "why": "Venom Glands on a ranch (Caprity Noct also works). Cheap early source for arrows/potions."
        },
        {
          "name": "Sparkit",
          "why": "Electric Organs on a ranch (Partner Skill) — passive supply without hunting Electric pals."
        },
        {
          "name": "Lyleen/Petallia + Jormuntide/Pengullet",
          "why": "Planting + Watering pals to auto-run crop plots."
        }
      ],
      "structures": [
        { "item": "Ranch", "count": "4–6", "note": "one product-type per ranch; each holds ~4 pals" },
        { "item": "Berry Plantation", "count": "2–3", "note": "core early food + Cake ingredient" },
        { "item": "Wheat Plantation", "count": "2", "note": "feeds the Mill" },
        { "item": "Tomato / Lettuce Plantation", "count": "1–2 each", "note": "for salads / recipes" },
        { "item": "Mill", "count": "1–2", "note": "wheat → flour" },
        { "item": "Watering + Planting stations", "count": "enough to cover every plot" },
        { "item": "Cooking Pot", "count": "1–2", "note": "+ dedicated food chests" },
        { "item": "Specialty ranches", "count": "as needed", "note": "Woolipop (cotton candy), Mau (gold), Sibelyx (HQ cloth)" }
      ],
      "tips": [
        "Ranch capacity is limited — run several ranches, one product-type each, for clean sorting.",
        "⚡ Ranch a Sparkit for passive Electric Organs (its Partner Skill) — no need to hunt Electric pals for them.",
        "Pick a flat, mild-climate spot (Plateau of Beginnings early, or the flatlands near Fort Ruins) so crops/pals aren't hit by heat or cold.",
        "Pair Planting + Watering + Gathering so crops auto-plant, water and harvest.",
        "A Vixy ranch is a great early income / Pal Sphere source."
      ],
      "roadmap": [
        {
          "level": 1,
          "stage": "Early (player ~5–10)",
          "text": "Unlock the Ranch (Lv 5); start with Lamball (wool) + Chikipi (eggs) + Vixy (dig); plant Berry plots."
        },
        {
          "level": 6,
          "stage": "Mid (player ~10–15)",
          "text": "Add Mozzarina, Beegarde and Flambelle ranches; unlock Wheat Plantation + Mill (Lv 15); add planter + waterer pals."
        },
        {
          "level": 12,
          "stage": "Late (player 15+)",
          "text": "Multiple ranches per product, specialty pals (Sibelyx, Mau, Woolipop); a full auto crop line feeding a Cooking Pot."
        }
      ],
      "techNeeds": [
        "Ranch",
        "Berry Plantation",
        "Wheat Plantation",
        "Mill",
        "Tomato Plantation",
        "Lettuce Plantation",
        "Cooking Pot"
      ]
    },
    {
      "id": "allinone",
      "name": "All-in-one",
      "icon": "🏭",
      "goal": "A balanced main base covering every work suitability so it self-runs the full chain: gather → refine → craft → cook → power.",
      "works": [
        "*"
      ],
      "pals": [
        {
          "name": "Anubis",
          "why": "Handiwork 4 + Mining 3 — the best all-round worker."
        },
        {
          "name": "Jormuntide Ignis",
          "why": "Kindling 4 (furnaces, cooking)."
        },
        {
          "name": "Jormuntide",
          "why": "Watering 4 (crops, cooling)."
        },
        {
          "name": "Digtoise",
          "why": "Mining 3 (ore/stone)."
        },
        {
          "name": "Orserk",
          "why": "Generating Electricity 4 (power)."
        },
        {
          "name": "Lyleen",
          "why": "Planting + Medicine production."
        },
        {
          "name": "Beakon / Vanwyrm / Penking",
          "why": "Electricity alternative; Transport + secondary jobs."
        }
      ],
      "structures": [
        { "item": "Chests + Feed Box (+ Palbox)", "count": "several", "note": "sorted storage near stations" },
        { "item": "Furnace (→ Electric)", "count": "2", "note": "ingots" },
        { "item": "Production Assembly Line", "count": "1–2" },
        { "item": "Cooking Pot / Electric Kitchen", "count": "1" },
        { "item": "Berry + Wheat Plantation + Mill", "count": "2 + 2 + 1" },
        { "item": "Power Generator", "count": "1–2", "note": "needs an Electricity pal" },
        { "item": "Ranch / Crusher / HQ Workbench", "count": "1 each" },
        { "item": "Pal Bed + Hot Spring", "count": "cover all workers", "note": "keeps pals rested & sane" }
      ],
      "tips": [
        "1.0 meta: one high-level specialist per job beats many low-level generalists (a Handiwork 4 pal > three Handiwork 2s).",
        "Cover every suitability: Kindling, Watering, Planting, Handiwork, Mining, Gathering, Lumbering, Electricity, Transport + a Cooler.",
        "Put a cooling pal (Reptyro/Frostallion-type) by the fridge/berry storage; keep a hauler so items reach chests.",
        "Central flat spot with wood + stone + a little ore (classic: near the Plateau of Beginnings) keeps basics flowing.",
        "Feybreak Lv 8 specialists to aim for: Renjishi (Kindling), Shaolong (Watering), Dandilord (Planting), Solenne (Handiwork), Aegidron (Mining), Bastigor (Cooling), Celesdir Noct (Lumbering)."
      ],
      "roadmap": [
        {
          "level": 1,
          "stage": "Early (base Lv 1–5)",
          "text": "Palbox, wood/stone plots, basic Furnace, cooking; slot flexible generalists (Lamball, Cattiva, Tombat, Vixy, Penking, Foxparks)."
        },
        {
          "level": 6,
          "stage": "Mid (base Lv 6–13)",
          "text": "Add a Ranch (Lv 5), Electric Furnace, Assembly Line, Mill (Lv 15); slot Anubis, Digtoise, Jormuntide Ignis + a waterer; add a Power Generator once you have an electric pal."
        },
        {
          "level": 14,
          "stage": "Maxed (base Lv 14+)",
          "text": "Fill all 15 slots with Lv 4 (or Feybreak Lv 8) specialists — one per suitability; Orserk on power, full cake/food line, Hot Spring; then branch into dedicated mining/breeding/ranch bases."
        }
      ],
      "techNeeds": [
        "Pal Bed",
        "Feed Box",
        "Primitive Furnace",
        "Crusher",
        "High Quality Workbench",
        "Ranch",
        "Power Generator",
        "Production Assembly Line",
        "Electric Furnace",
        "Cooking Pot"
      ]
    }
  ],
  "breeding": {
    "formula": "Same species → same species. A few unique combos override everything (see below). Otherwise the child is the pal whose breed-power is closest to (parentA + parentB + 1) ÷ 2 — ignoring legendaries & variants — and ties go to the more common pal.",
    "ranks": {
      "Panthalus": 20,
      "Aegidron": 30,
      "Shaolong": 40,
      "Bastigor": 50,
      "Dandilord": 60,
      "Jetragon": 70,
      "Silvance": 80,
      "Hartalis": 90,
      "Blazamut Ryu": 100,
      "Frostallion Noct": 110,
      "Orserk": 120,
      "Bellanoir Libero": 130,
      "Eidrolon Ignis": 140,
      "Frostallion": 150,
      "Neptilius": 160,
      "Jormuntide Ignis": 170,
      "Paladius": 180,
      "Necromus": 190,
      "Tetroise Primo": 200,
      "Knocklem Ignis": 210,
      "Lyleen Noct": 220,
      "Ophydia": 230,
      "Lyleen": 240,
      "Dualith Noct": 250,
      "Knocklem": 260,
      "Celesdir Noct": 270,
      "Solenne": 280,
      "Renjishi": 290,
      "Eidrolon": 300,
      "Selyne": 360,
      "Whalaska Ignis": 370,
      "Moldron Cryst": 380,
      "Flaracle": 390,
      "Xenolord": 400,
      "Blazamut": 410,
      "Azurmane": 420,
      "Starryon Primo": 430,
      "Elgrove Cryst": 440,
      "Faleris Aqua": 450,
      "Pierdon Cryst": 460,
      "Cryolinx Terra": 470,
      "Anubis": 480,
      "Astegon": 490,
      "Faleris": 500,
      "Dualith": 510,
      "Dupin": 520,
      "Roujay": 530,
      "Univolt Cryst": 540,
      "Shadowbeak": 550,
      "Silvegis": 560,
      "Celesdir": 570,
      "Beakon Cryst": 580,
      "Jormuntide": 590,
      "Reptyro Cryst": 600,
      "Wumpo Botan": 610,
      "Bellanoir": 620,
      "Warsect Terra": 630,
      "Menasting Terra": 640,
      "Sibelyx Primo": 650,
      "Whalaska": 710,
      "Ghangler Ignis": 720,
      "Gildane": 730,
      "Suzaku Aqua": 740,
      "Moldron": 750,
      "Mycora": 760,
      "Relaxaurus Lux": 770,
      "Splatterina": 780,
      "Tetroise": 790,
      "Kitsun Noct": 800,
      "Lapure": 810,
      "Petallia Ignis": 820,
      "Wumpo": 830,
      "Bushi Noct": 840,
      "Prixter Lux": 850,
      "Frostplume": 860,
      "Sekhmet": 870,
      "Ghangler": 880,
      "Loomen": 890,
      "Fenglope Lux": 900,
      "Helzephyr Lux": 960,
      "Venusa": 970,
      "Sootseer": 980,
      "Xenogard": 990,
      "Solmora Lux": 1000,
      "Majex": 1010,
      "Grizzbolt": 1020,
      "Braloha": 1030,
      "Cryolinx": 1040,
      "Ragnahawk": 1050,
      "Reptyro": 1060,
      "Mammorest Cryst": 1070,
      "Broncherry Aqua": 1080,
      "Relaxaurus": 1090,
      "Polapup Terra": 1100,
      "Pierdon": 1110,
      "Menasting": 1120,
      "Helzephyr": 1130,
      "Omascul": 1140,
      "Starryon": 1150,
      "Verdash": 1160,
      "Gildra": 1170,
      "Wistella": 1180,
      "Bulldosu": 1190,
      "Suzaku": 1200,
      "Quivern": 1210,
      "Azurobe Cryst": 1220,
      "Nitemary": 1230,
      "Palumba": 1240,
      "Nyafia": 1250,
      "Icelyn": 1260,
      "Blazehowl Noct": 1270,
      "Warsect": 1280,
      "Loupmoon Cryst": 1290,
      "Quivern Botan": 1300,
      "Incineram Noct": 1310,
      "Nitemary Botan": 1320,
      "Turtacle Terra": 1330,
      "Mammorest": 1340,
      "Tropicaw": 1350,
      "Blazehowl": 1360,
      "Solmora": 1370,
      "Broncherry": 1380,
      "Prunelia": 1390,
      "Dynamoff": 1400,
      "Leafan": 1410,
      "Skutlass": 1420,
      "Vanwyrm Cryst": 1430,
      "Mossanda Lux": 1440,
      "Shroomer Noct": 1450,
      "Dogen": 1460,
      "Incineram": 1470,
      "Vaelet": 1480,
      "Wixen Noct": 1490,
      "Snock Lux": 1500,
      "Prixter": 1510,
      "Shroomer": 1520,
      "Kingpaca Cryst": 1530,
      "Bakemi": 1540,
      "Digtoise": 1550,
      "Bushi": 1560,
      "Felbat": 1570,
      "Needoll Noct": 1580,
      "Skutlass Ignis": 1590,
      "Rayhound Cryst": 1600,
      "Smokie Cryst": 1610,
      "Dumud Gild": 1620,
      "Gloopie Primo": 1630,
      "Elphidran Aqua": 1640,
      "Vanwyrm": 1650,
      "Polapup": 1660,
      "Kitsun": 1670,
      "Lapiron": 1680,
      "Beakon": 1690,
      "Carnibora": 1700,
      "Maraith": 1710,
      "Petallia": 1720,
      "Tarantriss": 1730,
      "Mimog": 1740,
      "Slowatt": 1750,
      "Smokie": 1760,
      "Hoodle": 1770,
      "Snock": 1780,
      "Elizabee": 1790,
      "Katress Ignis": 1800,
      "Sibelyx": 1810,
      "Xenovader": 1820,
      "Azurobe": 1830,
      "Surfent Terra": 1840,
      "Penking Lux": 1850,
      "Croajiro Noct": 1860,
      "Pyrin Noct": 1870,
      "Gorirat Terra": 1880,
      "Dinossom Lux": 1890,
      "Valentail": 1900,
      "Dazzi Noct": 1910,
      "Rayhound": 1920,
      "Reindrix": 1930,
      "Caprity Noct": 1940,
      "Chillet Ignis": 1950,
      "Fenglope": 1960,
      "Foxcicle": 1970,
      "Pyrin": 1980,
      "Lullu": 1990,
      "Souffline": 2000,
      "Lunaris": 2010,
      "Elgrove": 2020,
      "Woolipop Terra": 2030,
      "Katress": 2040,
      "Robinquill Terra": 2050,
      "Mossanda": 2060,
      "Penking": 2070,
      "Wixen": 2080,
      "Lovander": 2090,
      "Dinossom": 2100,
      "Loupmoon": 2110,
      "Grintale": 2120,
      "Munchill": 2130,
      "Gorirat": 2140,
      "Sweepa": 2150,
      "Dazemu": 2210,
      "Kingpaca": 2220,
      "Yakumo": 2230,
      "Finsider Ignis": 2240,
      "Wispaw": 2250,
      "Robinquill": 2260,
      "Univolt": 2270,
      "Elphidran": 2280,
      "Dumud": 2290,
      "Fuack Ignis": 2300,
      "Kikit": 2310,
      "Arsox": 2320,
      "Chillet": 2330,
      "Tombat": 2340,
      "Beegarde": 2350,
      "Puffolt": 2360,
      "Cawgnito": 2370,
      "Celaray Lux": 2380,
      "Snugloo": 2390,
      "Dazzi": 2400,
      "Turtacle": 2410,
      "Needoll": 2420,
      "Gobfin Ignis": 2430,
      "Surfent": 2440,
      "Finsider": 2450,
      "Ribbuny Botan": 2460,
      "Kelpsea Ignis": 2470,
      "Muffly": 2480,
      "Pengullet Lux": 2490,
      "Foxparks Cryst": 2500,
      "Hangyu Cryst": 2510,
      "Amione": 2520,
      "Gloopie": 2530,
      "Killamari Primo": 2540,
      "Gobfin": 2550,
      "Nitewing": 2560,
      "Galeclaw": 2570,
      "Eikthyrdeer Terra": 2580,
      "Jellroy": 2590,
      "Croajiro": 2600,
      "Caprity": 2610,
      "Cinnamoth": 2620,
      "Herbil": 2630,
      "Leezpunk Ignis": 2640,
      "Jelliette": 2650,
      "Flopie": 2660,
      "Leezpunk": 2670,
      "Direhowl": 2680,
      "Bristla": 2690,
      "Flambelle": 2700,
      "Eikthyrdeer": 2710,
      "Melpaca": 2720,
      "Tocotoco": 2730,
      "Celaray": 2740,
      "Mau Cryst": 2750,
      "Cattiva": 2760,
      "Killamari": 2770,
      "Hangyu": 2780,
      "Fuddler": 2790,
      "Mozzarina": 2800,
      "Kelpsea": 2810,
      "Woolipop": 2820,
      "Tanzee Ignis": 2830,
      "Swee": 2840,
      "Jolthog Cryst": 2850,
      "Ribbuny": 2860,
      "Rooby": 2870,
      "Rushoar": 2880,
      "Cremis": 2890,
      "Tanzee": 2900,
      "Daedream": 2910,
      "Nox": 2920,
      "Pupperai": 2930,
      "Hoocrates": 2940,
      "Gumoss": 2950,
      "Pengullet": 2960,
      "Clovee": 2970,
      "Fuack": 2980,
      "Foxparks": 2990,
      "Depresso": 3000,
      "Sparkit": 3010,
      "Lifmunk": 3020,
      "Jolthog": 3030,
      "Mau": 3040,
      "Lamball": 3050,
      "Vixy": 3060,
      "Teafant": 3070,
      "Chikipi": 3080,
      "Blue Slime": 3100,
      "Cave Bat": 3100,
      "Demon Eye": 3100,
      "Enchanted Sword": 3100,
      "Eye of Cthulhu": 3100,
      "Green Slime": 3100,
      "Illuminant Bat": 3100,
      "Illuminant Slime": 3100,
      "Purple Slime": 3100,
      "Rainbow Slime": 3100,
      "Red Slime": 3100
    },
    "excluded": [
      "Turtacle Terra",
      "Incineram Noct",
      "Mau Cryst",
      "Eikthyrdeer Terra",
      "Grizzbolt",
      "Gorirat Terra",
      "Jolthog Cryst",
      "Univolt Cryst",
      "Pengullet Lux",
      "Gobfin Ignis",
      "Jormuntide Ignis",
      "Hangyu Cryst",
      "Suzaku Aqua",
      "Pyrin Noct",
      "Elphidran Aqua",
      "Woolipop Terra",
      "Surfent Terra",
      "Azurobe Cryst",
      "Reptyro Cryst",
      "Robinquill Terra",
      "Relaxaurus Lux",
      "Leezpunk Ignis",
      "Fuack Ignis",
      "Vanwyrm Cryst",
      "Dinossom Lux",
      "Frostallion",
      "Frostallion Noct",
      "Mammorest Cryst",
      "Broncherry Aqua",
      "Faleris",
      "Blazamut Ryu",
      "Shadowbeak",
      "Sibelyx Primo",
      "Wixen Noct",
      "Killamari Primo",
      "Lyleen",
      "Lyleen Noct",
      "Mossanda Lux",
      "Rayhound Cryst",
      "Jetragon",
      "Tanzee Ignis",
      "Blazehowl Noct",
      "Kingpaca Cryst",
      "Katress Ignis",
      "Beakon Cryst",
      "Warsect Terra",
      "Paladius",
      "Penking Lux",
      "Chillet Ignis",
      "Quivern Botan",
      "Helzephyr Lux",
      "Bushi Noct",
      "Celaray Lux",
      "Necromus",
      "Petallia Ignis",
      "Menasting Terra",
      "Orserk",
      "Dumud Gild",
      "Bellanoir",
      "Bellanoir Libero",
      "Selyne",
      "Croajiro Noct",
      "Prixter Lux",
      "Knocklem Ignis",
      "Mimog",
      "Xenovader",
      "Xenogard",
      "Moldron Cryst",
      "Xenolord",
      "Nitemary Botan",
      "Starryon Primo",
      "Smokie Cryst",
      "Celesdir",
      "Celesdir Noct",
      "Panthalus",
      "Pierdon Cryst",
      "Gloopie Primo",
      "Whalaska Ignis",
      "Foxparks Cryst",
      "Caprity Noct",
      "Ribbuny Botan",
      "Loupmoon Cryst",
      "Kitsun Noct",
      "Dazzi Noct",
      "Cryolinx Terra",
      "Fenglope Lux",
      "Faleris Aqua",
      "Bastigor",
      "Ghangler Ignis",
      "Hartalis",
      "Needoll Noct",
      "Finsider Ignis",
      "Polapup Terra",
      "Dualith Noct",
      "Tetroise Primo",
      "Neptilius",
      "Skutlass Ignis",
      "Green Slime",
      "Blue Slime",
      "Red Slime",
      "Purple Slime",
      "Illuminant Slime",
      "Rainbow Slime",
      "Enchanted Sword",
      "Cave Bat",
      "Illuminant Bat",
      "Eye of Cthulhu",
      "Demon Eye",
      "Solmora Lux",
      "Snock Lux",
      "Shaolong",
      "Elgrove Cryst",
      "Silvance",
      "Eidrolon Ignis",
      "Dandilord"
    ],
    "special": [
      {
        "parentA": "Nyafia",
        "parentB": "Kitsun",
        "child": "Kitsun Noct"
      },
      {
        "parentA": "Maraith",
        "parentB": "Incineram",
        "child": "Incineram Noct"
      },
      {
        "parentA": "Mau",
        "parentB": "Pengullet",
        "child": "Mau Cryst"
      },
      {
        "parentA": "Tarantriss",
        "parentB": "Caprity",
        "child": "Caprity Noct"
      },
      {
        "parentA": "Foxcicle",
        "parentB": "Vanwyrm",
        "child": "Vanwyrm Cryst"
      },
      {
        "parentA": "Smokie",
        "parentB": "Munchill",
        "child": "Smokie Cryst"
      },
      {
        "parentA": "Frostplume",
        "parentB": "Azurobe",
        "child": "Azurobe Cryst"
      },
      {
        "parentA": "Flambelle",
        "parentB": "Fuack",
        "child": "Fuack Ignis"
      },
      {
        "parentA": "Prunelia",
        "parentB": "Needoll",
        "child": "Needoll Noct"
      },
      {
        "parentA": "Rayhound",
        "parentB": "Penking",
        "child": "Penking Lux"
      },
      {
        "parentA": "Katress",
        "parentB": "Wixen",
        "child": "Katress Ignis"
      },
      {
        "parentA": "Celesdir",
        "parentB": "Tetroise",
        "child": "Tetroise Primo"
      },
      {
        "parentA": "Knocklem",
        "parentB": "Menasting",
        "child": "Menasting Terra"
      },
      {
        "parentA": "Hangyu",
        "parentB": "Eikthyrdeer",
        "child": "Eikthyrdeer Terra"
      },
      {
        "parentA": "Snock",
        "parentB": "Turtacle Terra",
        "child": "Snock Lux"
      },
      {
        "parentA": "Surfent",
        "parentB": "Elphidran",
        "child": "Elphidran Aqua"
      },
      {
        "parentA": "Azurmane",
        "parentB": "Fenglope",
        "child": "Fenglope Lux"
      },
      {
        "parentA": "Pyrin",
        "parentB": "Katress",
        "child": "Pyrin Noct"
      },
      {
        "parentA": "Rayhound",
        "parentB": "Dinossom",
        "child": "Dinossom Lux"
      },
      {
        "parentA": "Petallia",
        "parentB": "Bushi",
        "child": "Petallia Ignis"
      },
      {
        "parentA": "Univolt",
        "parentB": "Celaray",
        "child": "Celaray Lux"
      },
      {
        "parentA": "Sootseer",
        "parentB": "Ghangler",
        "child": "Ghangler Ignis"
      },
      {
        "parentA": "Eidrolon",
        "parentB": "Suzaku",
        "child": "Eidrolon Ignis"
      },
      {
        "parentA": "Nitemary",
        "parentB": "Petallia",
        "child": "Nitemary Botan"
      },
      {
        "parentA": "Kikit",
        "parentB": "Gorirat",
        "child": "Gorirat Terra"
      },
      {
        "parentA": "Dualith",
        "parentB": "Sootseer",
        "child": "Dualith Noct"
      },
      {
        "parentA": "Wumpo",
        "parentB": "Mammorest",
        "child": "Mammorest Cryst"
      },
      {
        "parentA": "Elgrove",
        "parentB": "Pierdon Cryst",
        "child": "Elgrove Cryst"
      },
      {
        "parentA": "Grizzbolt",
        "parentB": "Mossanda",
        "child": "Mossanda Lux"
      },
      {
        "parentA": "Beakon",
        "parentB": "Helzephyr",
        "child": "Helzephyr Lux"
      },
      {
        "parentA": "Pengullet",
        "parentB": "Jolthog",
        "child": "Jolthog Cryst"
      },
      {
        "parentA": "Warsect",
        "parentB": "Digtoise",
        "child": "Warsect Terra"
      },
      {
        "parentA": "Faleris",
        "parentB": "Jormuntide",
        "child": "Faleris Aqua"
      },
      {
        "parentA": "Frostallion",
        "parentB": "Helzephyr",
        "child": "Frostallion Noct"
      },
      {
        "parentA": "Whalaska",
        "parentB": "Chillet Ignis",
        "child": "Whalaska Ignis"
      },
      {
        "parentA": "Polapup",
        "parentB": "Surfent Terra",
        "child": "Polapup Terra"
      },
      {
        "parentA": "Croajiro",
        "parentB": "Bushi Noct",
        "child": "Croajiro Noct"
      },
      {
        "parentA": "Reindrix",
        "parentB": "Kingpaca",
        "child": "Kingpaca Cryst"
      },
      {
        "parentA": "Solmora",
        "parentB": "Slowatt",
        "child": "Solmora Lux"
      },
      {
        "parentA": "Frostplume",
        "parentB": "Univolt",
        "child": "Univolt Cryst"
      },
      {
        "parentA": "Foxcicle",
        "parentB": "Foxparks",
        "child": "Foxparks Cryst"
      },
      {
        "parentA": "Dumud",
        "parentB": "Eikthyrdeer Terra",
        "child": "Dumud Gild"
      },
      {
        "parentA": "Relaxaurus",
        "parentB": "Sparkit",
        "child": "Relaxaurus Lux"
      },
      {
        "parentA": "Lyleen",
        "parentB": "Menasting",
        "child": "Lyleen Noct"
      },
      {
        "parentA": "Leezpunk",
        "parentB": "Flambelle",
        "child": "Leezpunk Ignis"
      },
      {
        "parentA": "Blazehowl",
        "parentB": "Felbat",
        "child": "Blazehowl Noct"
      },
      {
        "parentA": "Flambelle",
        "parentB": "Tanzee",
        "child": "Tanzee Ignis"
      },
      {
        "parentA": "Ribbuny",
        "parentB": "Killamari",
        "child": "Killamari Primo"
      },
      {
        "parentA": "Celesdir",
        "parentB": "Starryon",
        "child": "Starryon Primo"
      },
      {
        "parentA": "Bellanoir",
        "parentB": "Bellanoir Libero",
        "child": "Bellanoir"
      },
      {
        "parentA": "Valentail",
        "parentB": "Gloopie",
        "child": "Gloopie Primo"
      },
      {
        "parentA": "Sparkit",
        "parentB": "Pengullet",
        "child": "Pengullet Lux"
      },
      {
        "parentA": "Bristla",
        "parentB": "Ribbuny",
        "child": "Ribbuny Botan"
      },
      {
        "parentA": "Omascul",
        "parentB": "Dazzi",
        "child": "Dazzi Noct"
      },
      {
        "parentA": "Robinquill",
        "parentB": "Fuddler",
        "child": "Robinquill Terra"
      },
      {
        "parentA": "Wumpo",
        "parentB": "Pierdon",
        "child": "Pierdon Cryst"
      },
      {
        "parentA": "Sootseer",
        "parentB": "Bushi",
        "child": "Bushi Noct"
      },
      {
        "parentA": "Broncherry",
        "parentB": "Fuack",
        "child": "Broncherry Aqua"
      },
      {
        "parentA": "Prixter",
        "parentB": "Helzephyr Lux",
        "child": "Prixter Lux"
      },
      {
        "parentA": "Dumud",
        "parentB": "Surfent",
        "child": "Surfent Terra"
      },
      {
        "parentA": "Gobfin",
        "parentB": "Rooby",
        "child": "Gobfin Ignis"
      },
      {
        "parentA": "Lullu",
        "parentB": "Quivern",
        "child": "Quivern Botan"
      },
      {
        "parentA": "Finsider",
        "parentB": "Gobfin Ignis",
        "child": "Finsider Ignis"
      },
      {
        "parentA": "Suzaku",
        "parentB": "Jormuntide",
        "child": "Suzaku Aqua"
      },
      {
        "parentA": "Kikit",
        "parentB": "Woolipop",
        "child": "Woolipop Terra"
      },
      {
        "parentA": "Skutlass",
        "parentB": "Gobfin Ignis",
        "child": "Skutlass Ignis"
      },
      {
        "parentA": "Digtoise",
        "parentB": "Turtacle",
        "child": "Turtacle Terra"
      },
      {
        "parentA": "Frostplume",
        "parentB": "Beakon",
        "child": "Beakon Cryst"
      },
      {
        "parentA": "Rayhound",
        "parentB": "Foxcicle",
        "child": "Rayhound Cryst"
      },
      {
        "parentA": "Jormuntide",
        "parentB": "Blazehowl",
        "child": "Jormuntide Ignis"
      },
      {
        "parentA": "Reptyro",
        "parentB": "Foxcicle",
        "child": "Reptyro Cryst"
      },
      {
        "parentA": "Moldron",
        "parentB": "Reptyro Cryst",
        "child": "Moldron Cryst"
      },
      {
        "parentA": "Chillet",
        "parentB": "Arsox",
        "child": "Chillet Ignis"
      },
      {
        "parentA": "Loupmoon",
        "parentB": "Sweepa",
        "child": "Loupmoon Cryst"
      },
      {
        "parentA": "Gildane",
        "parentB": "Eikthyrdeer Terra",
        "child": "Celesdir"
      },
      {
        "parentA": "Celesdir",
        "parentB": "Kitsun Noct",
        "child": "Celesdir Noct"
      },
      {
        "parentA": "Lapure",
        "parentB": "Sibelyx",
        "child": "Sibelyx Primo"
      },
      {
        "parentA": "Cryolinx",
        "parentB": "Dazemu",
        "child": "Cryolinx Terra"
      },
      {
        "parentA": "Hangyu",
        "parentB": "Swee",
        "child": "Hangyu Cryst"
      },
      {
        "parentA": "Knocklem",
        "parentB": "Ragnahawk",
        "child": "Knocklem Ignis"
      },
      {
        "parentA": "Demon Eye",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Green Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Blue Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Illuminant Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Purple Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Eye of Cthulhu",
        "child": "Eye of Cthulhu"
      },
      {
        "parentA": "Green Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Blue Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Illuminant Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Purple Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Demon Eye",
        "child": "Demon Eye"
      },
      {
        "parentA": "Blue Slime",
        "parentB": "Green Slime",
        "child": "Blue Slime"
      },
      {
        "parentA": "Illuminant Slime",
        "parentB": "Green Slime",
        "child": "Illuminant Slime"
      },
      {
        "parentA": "Illuminant Slime",
        "parentB": "Blue Slime",
        "child": "Illuminant Slime"
      },
      {
        "parentA": "Purple Slime",
        "parentB": "Illuminant Slime",
        "child": "Illuminant Slime"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Illuminant Slime",
        "child": "Illuminant Slime"
      },
      {
        "parentA": "Purple Slime",
        "parentB": "Green Slime",
        "child": "Purple Slime"
      },
      {
        "parentA": "Purple Slime",
        "parentB": "Blue Slime",
        "child": "Purple Slime"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Blue Slime",
        "child": "Purple Slime"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Purple Slime",
        "child": "Purple Slime"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Green Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Blue Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Illuminant Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Rainbow Slime",
        "parentB": "Purple Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Rainbow Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Rainbow Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Green Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Blue Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Illuminant Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Rainbow Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Red Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Green Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Blue Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Illuminant Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Rainbow Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Red Slime",
        "child": "Rainbow Slime"
      },
      {
        "parentA": "Red Slime",
        "parentB": "Green Slime",
        "child": "Red Slime"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Green Slime",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Blue Slime",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Illuminant Slime",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Purple Slime",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Enchanted Sword",
        "parentB": "Red Slime",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Enchanted Sword",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Enchanted Sword",
        "child": "Enchanted Sword"
      },
      {
        "parentA": "Cave Bat",
        "parentB": "Purple Slime",
        "child": "Illuminant Bat"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Purple Slime",
        "child": "Illuminant Bat"
      },
      {
        "parentA": "Illuminant Bat",
        "parentB": "Cave Bat",
        "child": "Illuminant Bat"
      }
    ],
    "curated": [
      {
        "child": "Jetragon",
        "parentA": "Jetragon",
        "parentB": "Jetragon",
        "why": "Fastest flying mount. No cross-combo exists — breed two Jetragon."
      },
      {
        "child": "Frostallion",
        "parentA": "Frostallion",
        "parentB": "Frostallion",
        "why": "Ice legendary mount. Self-only."
      },
      {
        "child": "Necromus",
        "parentA": "Necromus",
        "parentB": "Necromus",
        "why": "Dark legendary mount (pairs with Paladius). Self-only."
      },
      {
        "child": "Paladius",
        "parentA": "Paladius",
        "parentB": "Paladius",
        "why": "Neutral legendary mount. Self-only."
      },
      {
        "child": "Orserk",
        "parentA": "Orserk",
        "parentB": "Orserk",
        "why": "Top electric attacker. The old Grizzbolt+Relaxaurus recipe was REMOVED in 1.0 — now self-only."
      },
      {
        "child": "Grizzbolt",
        "parentA": "Grizzbolt",
        "parentB": "Grizzbolt",
        "why": "Electric mount with minigun partner skill. Self-only."
      },
      {
        "child": "Faleris",
        "parentA": "Faleris",
        "parentB": "Faleris",
        "why": "Fire flyer. Self-only in 1.0."
      },
      {
        "child": "Shadowbeak",
        "parentA": "Shadowbeak",
        "parentB": "Shadowbeak",
        "why": "Strong dark flyer. Self-only."
      },
      {
        "child": "Blazamut Ryu",
        "parentA": "Blazamut Ryu",
        "parentB": "Blazamut Ryu",
        "why": "Feybreak fire legendary. Self-only."
      },
      {
        "child": "Neptilius",
        "parentA": "Neptilius",
        "parentB": "Neptilius",
        "why": "Feybreak water legendary (fastest swimmer). Self-only."
      },
      {
        "child": "Xenolord",
        "parentA": "Xenolord",
        "parentB": "Xenolord",
        "why": "Feybreak final-boss dragon. Self-only."
      },
      {
        "child": "Lyleen",
        "parentA": "Lyleen",
        "parentB": "Lyleen",
        "why": "Top Medicine + Planting worker (boss). Self-only."
      },
      {
        "child": "Frostallion Noct",
        "parentA": "Frostallion",
        "parentB": "Helzephyr",
        "why": "Dark variant of Frostallion — strong dark flyer, cheaper than farming two."
      },
      {
        "child": "Anubis",
        "parentA": "Astegon",
        "parentB": "Blazamut",
        "why": "THE best base worker (Handiwork 4, Mining 3). Both parents are wild-catchable — cleanest averaging pair."
      },
      {
        "child": "Anubis",
        "parentA": "Anubis",
        "parentB": "Azurmane",
        "why": "If you already own one Anubis, pairing with Azurmane re-rolls Anubis for passive-trait breeding."
      },
      {
        "child": "Lyleen Noct",
        "parentA": "Lyleen",
        "parentB": "Menasting",
        "why": "Dark Lyleen — strong Medicine/Planting worker + combat."
      },
      {
        "child": "Beakon",
        "parentA": "Menasting",
        "parentB": "Robinquill",
        "why": "Electric generation + attacker (also Menasting+Wispaw, Digtoise+Azurobe)."
      },
      {
        "child": "Jormuntide",
        "parentA": "Warsect",
        "parentB": "Braloha",
        "why": "Best Watering worker + water mount."
      },
      {
        "child": "Suzaku",
        "parentA": "Warsect",
        "parentB": "Menasting",
        "why": "Fast fire flyer / kindler (also Blazehowl+Braloha, Ragnahawk+Mammorest)."
      },
      {
        "child": "Ragnahawk",
        "parentA": "Moldron",
        "parentB": "Mammorest",
        "why": "Fire flyer mount, strong Kindling worker."
      },
      {
        "child": "Warsect",
        "parentA": "Incineram",
        "parentB": "Helzephyr",
        "why": "Grass/ground tank, good Handiwork/Lumbering."
      },
      {
        "child": "Relaxaurus",
        "parentA": "Braloha",
        "parentB": "Menasting",
        "why": "Rocket-launcher mount; easy path to Relaxaurus Lux via +Sparkit."
      },
      {
        "child": "Nitewing",
        "parentA": "Penking",
        "parentB": "Lamball",
        "why": "Classic cheap early flying mount from two starter-tier pals."
      },
      {
        "child": "Digtoise",
        "parentA": "Fenglope",
        "parentB": "Helzephyr",
        "why": "Best early Mining drill worker (also Menasting+Pyrin)."
      },
      {
        "child": "Mozzarina",
        "parentA": "Caprity",
        "parentB": "Foxparks",
        "why": "Milk farming ranch pal."
      },
      {
        "child": "Sibelyx",
        "parentA": "Penking",
        "parentB": "Bushi",
        "why": "Penking+Bushi now gives Sibelyx (silk/cloth), NOT Anubis — trips up players using old guides."
      },
      {
        "child": "Mau Cryst",
        "parentA": "Mau",
        "parentB": "Pengullet",
        "why": "Ice Mau — farmable gold/utility variant, cheap parents."
      },
      {
        "child": "Relaxaurus Lux",
        "parentA": "Relaxaurus",
        "parentB": "Sparkit",
        "why": "Electric Relaxaurus variant (old Orserk slot)."
      }
    ]
  },
  "techLevels": {
    "Palbox": {
      "lvl": 2
    },
    "Wooden Chest": {
      "lvl": 2
    },
    "Feed Box": {
      "lvl": 4
    },
    "Campfire": {
      "lvl": 2
    },
    "Pal Bed": {
      "lvl": 3
    },
    "Primitive Furnace": {
      "lvl": 10
    },
    "Improved Furnace": {
      "lvl": 34
    },
    "Electric Furnace": {
      "lvl": 44
    },
    "Stone Pit": {
      "lvl": 7
    },
    "Crusher": {
      "lvl": 8
    },
    "Production Assembly Line": {
      "lvl": 29
    },
    "High Quality Workbench": {
      "lvl": 11
    },
    "Ranch": {
      "lvl": 5
    },
    "Egg Incubator": {
      "lvl": 10,
      "ancient": true
    },
    "Wheat Plantation": {
      "lvl": 15
    },
    "Mill": {
      "lvl": 15
    },
    "Berry Plantation": {
      "lvl": 5
    },
    "Tomato Plantation": {
      "lvl": 21
    },
    "Lettuce Plantation": {
      "lvl": 25
    },
    "Cooking Pot": {
      "lvl": 17
    },
    "Electric Kitchen": {
      "lvl": 41
    },
    "Power Generator": {
      "lvl": 26
    },
    "Breeding Farm": {
      "lvl": 19,
      "ancient": true
    },
    "Hot Spring": {
      "lvl": 9
    },
    "Sphere Assembly Line": {
      "lvl": 14
    }
  },
  "basePlan": [
    {
      "n": 1,
      "base": "All-in-one",
      "baseType": "allinone",
      "icon": "🏭",
      "when": "From the start · char Lv 1+",
      "unlock": "Your first base",
      "focus": "Home base covering every job. Palbox, pal beds, chests, campfire → cooking, wood/stone. Slot flexible generalists and cover Kindling/Watering/Planting/Handiwork/Mining/Gathering/Lumbering. Raise its base level via Palbox base missions — that is what unlocks more bases."
    },
    {
      "n": 2,
      "base": "Mining",
      "baseType": "mining",
      "icon": "⛏️",
      "when": "~char Lv 15–20",
      "unlock": "2nd base slot at base Lv 7",
      "focus": "Place directly on the Verdant Brook ore+coal peak. Add furnaces (Primitive Lv10 → Improved Lv34 → Electric Lv44), a Kindling pal to smelt, a Crusher (Lv8) and haulers. Fill with Mining 3–4 specialists."
    },
    {
      "n": 3,
      "base": "Farming / Ranch",
      "baseType": "farming",
      "icon": "🌾",
      "when": "~char Lv 15–25",
      "unlock": "3rd base slot at base Lv 14",
      "focus": "Ranch (Lv5) with Mozzarina/Chikipi/Lamball/Beegarde + crop plantations and a Mill (Lv15). Supplies food and cake ingredients for the breeding base."
    },
    {
      "n": 4,
      "base": "Breeding",
      "baseType": "breeding",
      "icon": "🥚",
      "when": "char Lv 19+",
      "unlock": "4th base slot at base Lv 24",
      "focus": "Needs the Breeding Farm (Lv19, Ancient). Pair it with several Egg Incubators (Lv10, Ancient) and a self-sufficient Cake chain (Ranch + Mill + Cooking Pot Lv17). Realistically your last major base."
    },
    {
      "n": 5,
      "base": "Endgame outposts",
      "baseType": null,
      "icon": "⭐",
      "when": "char Lv 30+",
      "unlock": "Up to 10 bases via World Settings",
      "focus": "Dedicated sulfur (Mount Obsidian) and quartz (Astral Mountain / Feybreak) outposts, plus a condensing base (Pal Essence Condenser) to max your best workers and mounts."
    }
  ],
  "passives": {
    "categories": {
      "Combat": [
        {
          "name": "Legend",
          "effect": "Attack +20%, Defense +20%, Move +15%",
          "good": true
        },
        {
          "name": "Musclehead",
          "effect": "Attack +30%, Work Speed -50%",
          "good": true
        },
        {
          "name": "Ferocious",
          "effect": "Attack +20%",
          "good": true
        },
        {
          "name": "Brave",
          "effect": "Attack +10%",
          "good": true
        },
        {
          "name": "Vanguard",
          "effect": "Player Attack +10% (buffs you, not the pal)",
          "good": true
        },
        {
          "name": "Flame Emperor",
          "effect": "Fire attack damage +30%",
          "good": true
        },
        {
          "name": "Lord of the Sea",
          "effect": "Water attack damage +30%",
          "good": true
        },
        {
          "name": "Lord of Lightning",
          "effect": "Electric attack damage +30%",
          "good": true
        },
        {
          "name": "Spirit Emperor",
          "effect": "Grass attack damage +30%",
          "good": true
        },
        {
          "name": "Ice Emperor",
          "effect": "Ice attack damage +30%",
          "good": true
        },
        {
          "name": "Earth Emperor",
          "effect": "Ground attack damage +30%",
          "good": true
        },
        {
          "name": "Lord of the Underworld",
          "effect": "Dark attack damage +30%",
          "good": true
        },
        {
          "name": "Divine Dragon",
          "effect": "Dragon attack damage +30%",
          "good": true
        },
        {
          "name": "Celestial Emperor",
          "effect": "Neutral attack damage +30%",
          "good": true
        }
      ],
      "Movement": [
        {
          "name": "Swift",
          "effect": "Move Speed +30%",
          "good": true
        },
        {
          "name": "Runner",
          "effect": "Move Speed +20%",
          "good": true
        },
        {
          "name": "Nimble",
          "effect": "Move Speed +10%",
          "good": true
        },
        {
          "name": "Legend",
          "effect": "Move Speed +15% (plus Attack/Defense +20%)",
          "good": true
        }
      ],
      "Work": [
        {
          "name": "Artisan",
          "effect": "Work Speed +50%",
          "good": true
        },
        {
          "name": "Work Slave",
          "effect": "Work Speed +30%, Attack -30%",
          "good": true
        },
        {
          "name": "Serious",
          "effect": "Work Speed +20%",
          "good": true
        },
        {
          "name": "Lucky",
          "effect": "Work Speed +15%, Attack +15%",
          "good": true
        },
        {
          "name": "Conceited",
          "effect": "Work Speed +10%, Defense -10%",
          "good": true
        }
      ],
      "Defense": [
        {
          "name": "Diamond Body",
          "effect": "Defense +30%, immune to flinch & knockback",
          "good": true
        },
        {
          "name": "Burly Body",
          "effect": "Defense +20%, immune to flinch",
          "good": true
        },
        {
          "name": "Hard Skin",
          "effect": "Defense +10%",
          "good": true
        },
        {
          "name": "Lucky",
          "effect": "Attack +15%, Work Speed +15% (all-round)",
          "good": true
        }
      ],
      "Negative": [
        {
          "name": "Brittle",
          "effect": "Defense -20%",
          "good": false
        },
        {
          "name": "Slacker",
          "effect": "Work Speed -30%",
          "good": false
        },
        {
          "name": "Clumsy",
          "effect": "Work Speed -10%",
          "good": false
        },
        {
          "name": "Coward",
          "effect": "Attack -10%",
          "good": false
        },
        {
          "name": "Downer",
          "effect": "Sanity drops +15% faster",
          "good": false
        }
      ]
    },
    "bestBuilds": {
      "battle": [
        "Legend",
        "Musclehead",
        "Ferocious",
        "matching element (e.g. Flame Emperor)"
      ],
      "mount": [
        "Legend",
        "Swift",
        "Runner",
        "Nimble"
      ],
      "worker": [
        "Artisan",
        "Serious",
        "Lucky",
        "Work Slave"
      ]
    },
    "breedingMechanics": "A pal holds max 4 passives. Breeding merges BOTH parents' passives into one pool and the child randomly draws up to 4 from it (parent order/species doesn't matter); empty slots may roll a random passive. A specific target passes ~40-46% of the time, so it takes many hatches. Trick: keep parents 'lean' — a parent carrying only the 1-2 traits you want passes them far more reliably. Breed toward intermediate pals holding only your target traits, then pair two of them so the pool is exactly your 4 targets."
  },
  "nightOnly": [
    "Depresso",
    "Katress",
    "Ghangler",
    "Helzephyr",
    "Lyleen Noct"
  ],
  "bosses": {
    "towers": [
      { "name": "Zoe & Grizzbolt", "faction": "Rayne Syndicate Tower", "level": 10, "location": "Windswept Hills — Rayne Syndicate Tower", "element": "Electric", "weakness": "Ground", "note": "First tower. Bring a Ground pal (Rushoar/Digtoise); Grizzbolt is a slow, big target." },
      { "name": "Lily & Lyleen", "faction": "Free Pal Alliance Tower", "level": 20, "location": "Bamboo Groves — Free Pal Alliance Tower", "element": "Grass", "weakness": "Fire", "note": "Bring Fire pals (Arsox); Lyleen self-heals, so burst it down fast." },
      { "name": "Axel & Orserk", "faction": "Brothers of the Eternal Pyre", "level": 30, "location": "Mount Obsidian volcano region", "element": "Electric/Dragon", "weakness": "Ground", "note": "Ground beats the Electric side; Ice helps against the Dragon typing." },
      { "name": "Marcus & Faleris", "faction": "PIDF Tower", "level": 40, "location": "Dessicated Desert", "element": "Fire", "weakness": "Water", "note": "Bring Water pals (Jormuntide, Penking) to hard-counter the Fire phoenix." },
      { "name": "Victor & Shadowbeak", "faction": "PAL Genetic Research Unit", "level": 50, "location": "Astral Mountains (snow region)", "element": "Dark", "weakness": "Dragon", "note": "Dragon pals (Jetragon, Orserk) counter the Dark boss; final base-game tower." },
      { "name": "Saya & Selyne", "faction": "Moonflower Tower", "level": 55, "location": "Sakurajima Island", "element": "Dark", "weakness": "Dragon", "note": "Sakurajima tower. Bring Dragon pals and strong burst — high HP." },
      { "name": "Bjorn & Bastigar", "faction": "Feybreak Tower", "level": 60, "location": "Feybreak Island", "element": "Ice", "weakness": "Fire", "note": "Feybreak tower. Bastigar is pure Ice — melts to a strong Fire pal with a damage passive." }
    ],
    "alphas": [
      { "name": "Nitewing", "level": 15, "location": "Ice Wind Island / Windswept Hills", "element": "Neutral", "weakness": "Dark", "note": "One of the earliest flying mounts; easy to obtain." },
      { "name": "Chillet", "level": 18, "location": "Bamboo Groves", "element": "Ice/Dragon", "weakness": "Dragon", "note": "Great early mount; fast dash-and-glide traversal." },
      { "name": "Dumud", "level": 20, "location": "Ice Wind Island / Bamboo Groves", "element": "Ground", "weakness": "Grass", "note": "Mining worker that also drops Gold Coins when worked." },
      { "name": "Felbat", "level": 22, "location": "Forgotten Island", "element": "Dark", "weakness": "Dragon", "note": "Early flying mount with Gathering/Transporting utility." },
      { "name": "Broncherry", "level": 25, "location": "Bamboo Groves", "element": "Grass", "weakness": "Fire", "note": "Good Watering + Planting worker; rideable food-farm helper." },
      { "name": "Univolt", "level": 28, "location": "Sea Breeze Archipelago / Bamboo Groves", "element": "Electric", "weakness": "Ground", "note": "Fast electric ride and a Generating Electricity worker." },
      { "name": "Beakon", "level": 30, "location": "Bamboo Groves", "element": "Electric", "weakness": "Ground", "note": "Fast flying mount plus Generating Electricity work." },
      { "name": "Warsect", "level": 30, "location": "Verdant Brook / Astral foothills", "element": "Grass/Ground", "weakness": "Fire", "note": "Tanky mount; strong Handiwork and Planting worker." },
      { "name": "Elphidran", "level": 30, "location": "Moonless Shore / Astral Mountains", "element": "Dragon", "weakness": "Dragon", "note": "Reliable mid-game flying mount, easier than legendaries." },
      { "name": "Quivern", "level": 30, "location": "Twilight Dunes", "element": "Dragon", "weakness": "Dragon", "note": "Flying mount with Transporting work; solid all-rounder." },
      { "name": "Relaxaurus", "level": 30, "location": "Bamboo Groves", "element": "Dragon/Water", "weakness": "Dragon", "note": "Missile-launcher mount; strong ranged combat platform." },
      { "name": "Bushi", "level": 30, "location": "Bamboo Groves", "element": "Fire", "weakness": "Water", "note": "Kindling worker and decent melee combat pal." },
      { "name": "Menasting", "level": 30, "location": "Dessicated Desert", "element": "Ground/Dark", "weakness": "Grass", "note": "Tanky scorpion mount; decent Mining worker." },
      { "name": "Verdash", "level": 35, "location": "Twilight Dunes", "element": "Grass", "weakness": "Fire", "note": "Fast agile ground mount; good Planting worker." },
      { "name": "Sibelyx", "level": 40, "location": "Twilight Dunes", "element": "Ice", "weakness": "Fire", "note": "Key Cloth-producing worker (Cooling)." },
      { "name": "Fenglope", "level": 40, "location": "Bamboo Groves", "element": "Grass", "weakness": "Fire", "note": "Fast mount with a double-jump; excellent for exploration." },
      { "name": "Jormuntide", "level": 45, "location": "Bamboo Groves", "element": "Water/Dragon", "weakness": "Electric", "note": "Top Watering worker and a strong water mount." },
      { "name": "Anubis", "level": 47, "location": "Twilight Dunes / Dessicated Desert", "element": "Ground", "weakness": "Grass", "note": "Best-in-slot Handiwork worker and a strong combat mount." },
      { "name": "Blazamut", "level": 49, "location": "Mount Obsidian", "element": "Fire", "weakness": "Water", "note": "Powerful late-game Fire combat mount; heavy hitter." },
      { "name": "Jetragon", "level": 50, "location": "Deep Sand Dunes (Dessicated Desert)", "element": "Dragon", "weakness": "Dragon", "note": "Legendary. Fastest flying mount in the game." },
      { "name": "Frostallion", "level": 50, "location": "Land of Absolute Zero", "element": "Ice", "weakness": "Fire", "note": "Legendary. Best Ice flying mount; buffs Ice pals as a base worker." },
      { "name": "Paladius", "level": 50, "location": "Dessicated Desert", "element": "Neutral", "weakness": "Dark", "note": "Legendary. Fast armored ground mount; pairs with Necromus." },
      { "name": "Necromus", "level": 50, "location": "Dessicated Desert", "element": "Dark", "weakness": "Dragon", "note": "Legendary. High-damage combat mount; strong PvE burst." },
      { "name": "Knocklem", "level": 55, "location": "Sakurajima Canyon", "element": "Ground", "weakness": "Grass", "note": "Sakurajima alpha; heavy-hitting Ground mount and Mining worker." },
      { "name": "Frostallion Noct", "level": 60, "location": "Feybreak Island", "element": "Dark/Ice", "weakness": "Dragon", "note": "Feybreak legendary variant; powerful Dark/Ice flying combat mount." }
    ]
  }
};
