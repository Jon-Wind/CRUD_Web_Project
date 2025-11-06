CREATE TABLE IF NOT EXISTS dnd_characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    alignment TEXT,
    race TEXT,
    character_class TEXT,
    level INTEGER,
    background TEXT,
    short_description TEXT,
    backstory TEXT,
    personality TEXT,
    abilities_skills TEXT,
    image_path TEXT,
    image_alt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample D&D Characters
INSERT INTO dnd_characters (name, alignment, race, character_class, level, background, short_description, backstory, personality, abilities_skills, image_path, image_alt) VALUES
    ('Aelar Brightblade', 'Chaotic Good', 'High Elf', 'Paladin', 5, 'Folk Hero', 'A noble elf paladin fighting for justice', 'Born into a noble elven family, Aelar abandoned his privileged life to fight for the common folk after witnessing their suffering.', 'Idealistic and courageous, always standing up for the weak', 'Divine Smite, Lay on Hands, Aura of Protection', 'images/elf-paladin.jpg', 'Elf paladin in shining armor with a glowing sword'),
    
    ('Grimm Ironhide', 'Neutral Good', 'Mountain Dwarf', 'Cleric', 4, 'Acolyte', 'A devoted healer and warrior of Moradin', 'Trained in the sacred halls of the Dwarven temple, Grimm now wanders the land healing the sick and smiting the wicked.', 'Stoic but kind, with a dry sense of humor', 'Divine Domain: Life, Turn Undead, Dwarven Resilience', 'images/dwarf-cleric.jpg', 'Dwarf cleric in chainmail with a holy symbol'),
    
    ('Zephyra Swiftwind', 'Chaotic Neutral', 'Wood Elf', 'Ranger', 6, 'Outlander', 'A mysterious archer who appears when least expected', 'Raised by wolves in the deep forest, Zephyra has an uncanny connection to nature and its creatures.', 'Wild and free-spirited, distrustful of cities', 'Favored Enemy: Undead, Natural Explorer, Archery Fighting Style', 'images/elf-ranger.jpg', 'Wood elf ranger with a longbow and forest camouflage'),
    
    ('Thaddeus the Wise', 'Lawful Neutral', 'Human', 'Wizard', 7, 'Sage', 'An elderly scholar seeking forbidden knowledge', 'Once a respected professor at the Arcane University, Thaddeus was exiled for his controversial research into necromancy.', 'Eccentric and absent-minded, but brilliant', 'Arcane Recovery, Spell Mastery, Ritual Casting', 'images/human-wizard.jpg', 'Elderly human wizard with a long beard and spellbook'),
    
    ('Lilith Shadowdance', 'Neutral Evil', 'Tiefling', 'Warlock', 5, 'Charlatan', 'A charming trickster with infernal powers', 'Struck a bargain with a fiend as a child, Lilith now struggles with the dark powers growing within her.', 'Sarcastic and manipulative, but with a hidden heart of gold', 'Pact Magic, Eldritch Invocations, Hellish Rebuke', 'images/tiefling-warlock.jpg', 'Tiefling warlock with glowing red eyes and arcane sigils');
