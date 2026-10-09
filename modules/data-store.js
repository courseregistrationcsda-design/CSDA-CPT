/* CSDA defaults, catalogue migration, persistence, cache, and record lookup. */
var DEFAULTS = {
  catalogVersion: 'course-list-2026-10',
  cats: [
    {
        "id": "foundation",
        "name": "Regular Courses — Foundation",
        "page": "2026 Course List",
        "color": "#D98324"
    },
    {
        "id": "concept",
        "name": "Regular Courses — Concept Art",
        "page": "2026 Course List",
        "color": "#C2577E"
    },
    {
        "id": "animation",
        "name": "Regular Courses — Animation",
        "page": "2026 Course List",
        "color": "#5B8CC7"
    },
    {
        "id": "graphic",
        "name": "Regular Courses — Graphic Design",
        "page": "2026 Course List",
        "color": "#4FA3A6"
    },
    {
        "id": "hero",
        "name": "Hero Offerings",
        "page": "2026 Course List",
        "color": "#E0B341"
    },
    {
        "id": "masterclass",
        "name": "MasterClass",
        "page": "2026 Course List",
        "color": "#8C7BB8"
    },
    {
        "id": "tesda",
        "name": "TESDA",
        "page": "2026 Course List",
        "color": "#5B8CC7"
    },
    {
        "id": "weekend-concept",
        "name": "Weekend Workshops — Concept Art",
        "page": "2026 Course List",
        "color": "#C2577E"
    },
    {
        "id": "weekend-illustration",
        "name": "Weekend Workshops — Dynamic Illustration",
        "page": "2026 Course List",
        "color": "#D98324"
    },
    {
        "id": "weekend-animation",
        "name": "Weekend Workshops — Animation",
        "page": "2026 Course List",
        "color": "#5B8CC7"
    },
    {
        "id": "weekend-graphic",
        "name": "Weekend Workshops — Graphic Design",
        "page": "2026 Course List",
        "color": "#4FA3A6"
    },
    {
        "id": "weekend-pintura",
        "name": "Weekend Workshops — Pintura",
        "page": "2026 Course List",
        "color": "#B5651D"
    },
    {
        "id": "summer-kiddos",
        "name": "Summer Workshop 2026 — Creative Kiddos (8–12)",
        "page": "2026 Course List",
        "color": "#FCA311"
    },
    {
        "id": "summer-teens",
        "name": "Summer Workshop 2026 — Teens & Young Adults (13–21)",
        "page": "2026 Course List",
        "color": "#E0B341"
    },
    {
        "id": "ssf",
        "name": "Digital Entertainment Exchange",
        "page": "2026 Course List",
        "color": "#4FA3A6"
    }
],
  items: [
    {
        "id": "fnd101",
        "code": "FND101",
        "c": "foundation",
        "n": "Digital Painting Fundamentals",
        "price": 17900,
        "sess": 15,
        "hrs": 45,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "FND101 Digital Painting Fundamentals foundation Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "fnd102",
        "code": "FND102",
        "c": "foundation",
        "n": "Dynamic Figures: Anatomy for Artists",
        "price": 15050,
        "sess": 12,
        "hrs": 30,
        "dur": 2.5,
        "trainer": "tr_jofel_valencia",
        "kw": "FND102 Dynamic Figures: Anatomy for Artists foundation Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "fdn103",
        "code": "FDN103",
        "c": "foundation",
        "n": "Dynamic Illustration",
        "price": 0,
        "trainer": "",
        "kw": "FDN103 Dynamic Illustration foundation ",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "desc": "Free class via CSDA YouTube.",
        "unit": "free class via CSDA YouTube"
    },
    {
        "id": "pin101",
        "code": "PIN101",
        "c": "foundation",
        "n": "Watercolor",
        "price": 6525,
        "sess": 5,
        "hrs": 12.5,
        "dur": 2.5,
        "trainer": "",        "kw": "PIN101 Watercolor foundation Eli Ituriaga / Chelsea M.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "pin102",
        "code": "PIN102",
        "c": "foundation",
        "n": "Acrylic",
        "price": 7150,
        "sess": 5,
        "hrs": 12.5,
        "dur": 2.5,
        "trainer": "tr_eli_ituriaga_chelsea_m",
        "kw": "PIN102 Acrylic foundation Eli Ituriaga / Chelsea M.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "pin103",
        "code": "PIN103",
        "c": "foundation",
        "n": "Coffee",
        "price": 7150,
        "sess": 5,
        "hrs": 12.5,
        "dur": 2.5,
        "trainer": "",        "kw": "PIN103 Coffee foundation Eli Ituriaga / Chelsea M.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "pin104",
        "code": "PIN104",
        "c": "foundation",
        "n": "Oil",
        "price": 6525,
        "sess": 5,
        "hrs": 12.5,
        "dur": 2.5,
        "trainer": "tr_chelsea_m",
        "kw": "PIN104 Oil foundation Chelsea M.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "pin105",
        "code": "PIN105",
        "c": "foundation",
        "n": "Gouache",
        "price": 7775,
        "sess": 5,
        "hrs": 12.5,
        "dur": 2.5,
        "trainer": "",        "kw": "PIN105 Gouache foundation Chelsea M.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cac101",
        "code": "CAC101",
        "c": "concept",
        "n": "Character Design for Game and Animation",
        "price": 18050,
        "sess": 12,
        "hrs": 30,
        "dur": 2.5,
        "trainer": "tr_camille_jofel",
        "kw": "CAC101 Character Design for Game and Animation concept Camille / Jofel",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cac102",
        "code": "CAC102",
        "c": "concept",
        "n": "Storytelling with Backgrounds for Animation and Game",
        "price": 12050,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_charles_s_henryk_bisera",
        "kw": "CAC102 Storytelling with Backgrounds for Animation and Game concept Charles S. / Henryk Bisera",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cac103",
        "code": "CAC103",
        "c": "concept",
        "n": "Comics! From Traditional to Digital Ink and Layouts",
        "price": 17900,
        "sess": 15,
        "hrs": 45,
        "dur": 3.0,
        "trainer": "tr_louie_dacca_geraldine",
        "kw": "CAC103 Comics! From Traditional to Digital Ink and Layouts concept Louie Dacca / Geraldine",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "desc": "Includes storyboarding with Geraldine."
    },
    {
        "id": "anm101",
        "code": "ANM101",
        "c": "animation",
        "n": "Traditional Animation: FUN-damentals",
        "price": 7850,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_jofel_louie",
        "kw": "ANM101 Traditional Animation: FUN-damentals animation Jofel / Louie",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "anm102",
        "code": "ANM102",
        "c": "animation",
        "n": "Japanese Animation",
        "price": 10500,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_geraldine",
        "kw": "ANM102 Japanese Animation animation Geraldine",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "anm103",
        "code": "ANM103",
        "c": "animation",
        "n": "Desktop Animation with Adobe Animate",
        "price": 8450,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "ANM103 Desktop Animation with Adobe Animate animation Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "anm104",
        "code": "ANM104",
        "c": "animation",
        "n": "Animation-Ready: Character Design to Rigging",
        "price": 10500,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_dexter_f",
        "kw": "ANM104 Animation-Ready: Character Design to Rigging animation Dexter F.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cma101",
        "code": "CMA101",
        "c": "graphic",
        "n": "Mastering Graphic Design: Brand Identity",
        "price": 8550,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "CMA101 Mastering Graphic Design: Brand Identity graphic Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cma102",
        "code": "CMA102",
        "c": "graphic",
        "n": "Logo Design: Creating Icons with Impact",
        "price": 7550,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "CMA102 Logo Design: Creating Icons with Impact graphic Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cma103",
        "code": "CMA103",
        "c": "graphic",
        "n": "Graphic Design for Social Media — Beyond Photoshop",
        "price": 9750,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "CMA103 Graphic Design for Social Media — Beyond Photoshop graphic Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cma104",
        "code": "CMA104",
        "c": "graphic",
        "n": "Motion Graphics",
        "price": 8550,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "CMA104 Motion Graphics graphic Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "cma105",
        "code": "CMA105",
        "c": "graphic",
        "n": "Video Editing",
        "price": 7550,
        "sess": 5,
        "hrs": 15,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "CMA105 Video Editing graphic Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho101",
        "code": "HO101",
        "c": "hero",
        "n": "Mastering Graphic Design — From Logo to Market",
        "price": 25850,
        "sess": 15,
        "hrs": 45,
        "dur": 3.0,
        "trainer": "tr_zachary_nino",
        "kw": "HO101 Mastering Graphic Design — From Logo to Market hero Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho102",
        "code": "HO102",
        "c": "hero",
        "n": "Character Design for Game and Animation",
        "price": 18050,
        "sess": 12,
        "hrs": 30,
        "dur": 2.5,
        "trainer": "tr_camille_jofel",
        "kw": "HO102 Character Design for Game and Animation hero Camille / Jofel",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho103",
        "code": "HO103",
        "c": "hero",
        "n": "Art of Worldbuilding: Storytelling with Backgrounds for Animation and Concept Art",
        "price": 12050,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_charles_henry",
        "kw": "HO103 Art of Worldbuilding: Storytelling with Backgrounds for Animation and Concept Art hero Charles / Henry",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho104",
        "code": "HO104",
        "c": "hero",
        "n": "Comics! From Traditional to Digital Ink — Bookreative Special!",
        "price": 12050,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_louie_dacca",
        "kw": "HO104 Comics! From Traditional to Digital Ink — Bookreative Special! hero Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho105",
        "code": "HO105",
        "c": "hero",
        "n": "Animation-Ready! Character Design to Rigging for Animation",
        "price": 12000,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_dexter_f_jofel_v",
        "kw": "HO105 Animation-Ready! Character Design to Rigging for Animation hero Dexter F. / Jofel V.",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho106",
        "code": "HO106",
        "c": "hero",
        "n": "Japanese Animation",
        "price": 10500,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_geraldine",
        "kw": "HO106 Japanese Animation hero Geraldine",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "ho107",
        "code": "HO107",
        "c": "hero",
        "n": "Design for Splash Art and Trading Card Games",
        "price": 12050,
        "sess": 15,
        "hrs": 30,
        "dur": 2.0,
        "trainer": "tr_chelsea",
        "kw": "HO107 Design for Splash Art and Trading Card Games hero Chelsea",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "mc-content",
        "code": "MC-CONTENT",
        "c": "masterclass",
        "n": "Content Creation MasterClass",
        "price": 40000,
        "trainer": "tr_camille_jofel_charles_louie",
        "kw": "MC-CONTENT Content Creation MasterClass masterclass Camille / Jofel / Charles / Louie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "daterange": true,
        "tlab": "Component subjects",
        "titles": [
            "Character Design",
            "Worldbuilding",
            "Comics!",
            "P2P Entrepreneurship"
        ]
    },
    {
        "id": "mc-animation",
        "code": "MC-ANIMATION",
        "c": "masterclass",
        "n": "Japanese Animation / Cutout Animation MasterClass",
        "price": 40000,
        "trainer": "tr_camille_jofel_geraldine_dexter",
        "kw": "MC-ANIMATION Japanese Animation / Cutout Animation MasterClass masterclass Camille / Jofel / Geraldine / Dexter",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "daterange": true,
        "tlab": "Component subjects",
        "titles": [
            "Character Design",
            "Animation Concepts",
            "Studio Workflow",
            "Desktop Animation (for Cutout Animation)",
            "P2P Entrepreneurship"
        ]
    },
    {
        "id": "mc-brands",
        "code": "MC-BRANDS",
        "c": "masterclass",
        "n": "Brands by Collab MasterClass",
        "price": 40000,
        "trainer": "tr_zachary_nino",
        "kw": "MC-BRANDS Brands by Collab MasterClass masterclass Zachary / Nino",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "daterange": true,
        "tlab": "Component subjects",
        "titles": [
            "Logo Design",
            "Prototyping",
            "Brand Strategy",
            "Motion Graphics",
            "Promo Video",
            "P2P Entrepreneurship"
        ]
    },
    {
        "id": "ilu-ncii",
        "code": "ILU NCII",
        "c": "tesda",
        "n": "Illustration NC II",
        "price": 9856,
        "trainer": "",
        "kw": "ILU NCII Illustration NC II tesda ",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "anm-ncii",
        "code": "ANM NCII",
        "c": "tesda",
        "n": "Animation NC II",
        "price": 35545,
        "trainer": "",
        "kw": "ANM NCII Animation NC II tesda ",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "2da-nciii",
        "code": "2DA NCIII",
        "c": "tesda",
        "n": "2D Animation NC III",
        "price": 63797,
        "trainer": "",
        "kw": "2DA NCIII 2D Animation NC III tesda ",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "vgd-nciii",
        "code": "VGD NCIII",
        "c": "tesda",
        "n": "Visual Graphic Design NC III",
        "price": 28712,
        "trainer": "",
        "kw": "VGD NCIII Visual Graphic Design NC III tesda ",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "da-lvliii",
        "code": "DA LVLIII",
        "c": "tesda",
        "n": "Data Analytics Level III",
        "price": 41644,
        "trainer": "",
        "kw": "DA LVLIII Data Analytics Level III tesda ",
        "bundleable": true,
        "hidden": false,
        "modules": []
    },
    {
        "id": "wca01",
        "code": "WCA01",
        "c": "weekend-concept",
        "n": "Character Design",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "WCA01 Character Design weekend-concept Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wca02",
        "code": "WCA02",
        "c": "weekend-concept",
        "n": "Enchanted Beasts",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "WCA02 Enchanted Beasts weekend-concept Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wca03",
        "code": "WCA03",
        "c": "weekend-concept",
        "n": "World Building for Games and Animation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_charles_s",
        "kw": "WCA03 World Building for Games and Animation weekend-concept Charles S.",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wca04",
        "code": "WCA04",
        "c": "weekend-concept",
        "n": "Comics! Fundamentals on Ink and Panels",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "WCA04 Comics! Fundamentals on Ink and Panels weekend-concept Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wca05",
        "code": "WCA05",
        "c": "weekend-concept",
        "n": "Digital Painting for Environment",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_charles_s",
        "kw": "WCA05 Digital Painting for Environment weekend-concept Charles S.",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wca06",
        "code": "WCA06",
        "c": "weekend-concept",
        "n": "Background Design for Animation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_henryk",
        "kw": "WCA06 Background Design for Animation weekend-concept Henryk",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wdi01",
        "code": "WDI01",
        "c": "weekend-illustration",
        "n": "Dynamic Figures: Anatomy for Artists",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_camille",
        "kw": "WDI01 Dynamic Figures: Anatomy for Artists weekend-illustration Camille",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wdi02",
        "code": "WDI02",
        "c": "weekend-illustration",
        "n": "Illustrated Journaling",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_camille",
        "kw": "WDI02 Illustrated Journaling weekend-illustration Camille",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wdi03",
        "code": "WDI03",
        "c": "weekend-illustration",
        "n": "Wildlife Illustration",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_louie_camille_jofel",
        "kw": "WDI03 Wildlife Illustration weekend-illustration Louie / Camille / Jofel",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wa01",
        "code": "WA01",
        "c": "weekend-animation",
        "n": "Traditional Animation: FUNdamentals",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "WA01 Traditional Animation: FUNdamentals weekend-animation Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wa02",
        "code": "WA02",
        "c": "weekend-animation",
        "n": "Japanese Animation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_geraldine",
        "kw": "WA02 Japanese Animation weekend-animation Geraldine",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wa03",
        "code": "WA03",
        "c": "weekend-animation",
        "n": "Cutout Animation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_dexter_f",
        "kw": "WA03 Cutout Animation weekend-animation Dexter F.",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wgd01",
        "code": "WGD01",
        "c": "weekend-graphic",
        "n": "Vector Illustration",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary_louie",
        "kw": "WGD01 Vector Illustration weekend-graphic Zachary / Louie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wgd02",
        "code": "WGD02",
        "c": "weekend-graphic",
        "n": "Logo Design",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "WGD02 Logo Design weekend-graphic Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wgd03",
        "code": "WGD03",
        "c": "weekend-graphic",
        "n": "Photo Manipulation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "WGD03 Photo Manipulation weekend-graphic Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wgd04",
        "code": "WGD04",
        "c": "weekend-graphic",
        "n": "Motion Graphics",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "WGD04 Motion Graphics weekend-graphic Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wpin01",
        "code": "WPIN01",
        "c": "weekend-pintura",
        "n": "Watercolor",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_eli_chelsea_stacy",
        "kw": "WPIN01 Watercolor weekend-pintura Eli / Chelsea / Stacy",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wpin02",
        "code": "WPIN02",
        "c": "weekend-pintura",
        "n": "Gouache",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_eli_chelsea_stacy",
        "kw": "WPIN02 Gouache weekend-pintura Eli / Chelsea / Stacy",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wpin03",
        "code": "WPIN03",
        "c": "weekend-pintura",
        "n": "Acrylic",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_eli_chelsea_stacy",
        "kw": "WPIN03 Acrylic weekend-pintura Eli / Chelsea / Stacy",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wpin04",
        "code": "WPIN04",
        "c": "weekend-pintura",
        "n": "Oil",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_eli_chelsea_stacy",
        "kw": "WPIN04 Oil weekend-pintura Eli / Chelsea / Stacy",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "wpin05",
        "code": "WPIN05",
        "c": "weekend-pintura",
        "n": "Coffee",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_eli_chelsea_stacy",
        "kw": "WPIN05 Coffee weekend-pintura Eli / Chelsea / Stacy",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck01",
        "code": "SWCK01",
        "c": "summer-kiddos",
        "n": "Art FUN-damentals: Arts and Crafts",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_dodie",
        "kw": "SWCK01 Art FUN-damentals: Arts and Crafts summer-kiddos Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck02",
        "code": "SWCK02",
        "c": "summer-kiddos",
        "n": "Character Creation",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_camille",
        "kw": "SWCK02 Character Creation summer-kiddos Camille",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck03",
        "code": "SWCK03",
        "c": "summer-kiddos",
        "n": "Mobile Digital Painting",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWCK03 Mobile Digital Painting summer-kiddos Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck04",
        "code": "SWCK04",
        "c": "summer-kiddos",
        "n": "Mobile Digital Animation with FlipaClip",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWCK04 Mobile Digital Animation with FlipaClip summer-kiddos Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck05",
        "code": "SWCK05",
        "c": "summer-kiddos",
        "n": "PINTURA: Watercolor",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWCK05 PINTURA: Watercolor summer-kiddos Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck06",
        "code": "SWCK06",
        "c": "summer-kiddos",
        "n": "PINTURA: Acrylic",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWCK06 PINTURA: Acrylic summer-kiddos Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swck07",
        "code": "SWCK07",
        "c": "summer-kiddos",
        "n": "PINTURA: Gouache",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWCK07 PINTURA: Gouache summer-kiddos Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta01",
        "code": "SWTA01",
        "c": "summer-teens",
        "n": "Art FUN-damentals",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWTA01 Art FUN-damentals summer-teens Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta02",
        "code": "SWTA02",
        "c": "summer-teens",
        "n": "Character Creation: Basics of Character Design",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWTA02 Character Creation: Basics of Character Design summer-teens Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta03",
        "code": "SWTA03",
        "c": "summer-teens",
        "n": "Inking for Comics: From Traditional to Digital Ink",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "SWTA03 Inking for Comics: From Traditional to Digital Ink summer-teens Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta04",
        "code": "SWTA04",
        "c": "summer-teens",
        "n": "PINTURA: Watercolor",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWTA04 PINTURA: Watercolor summer-teens Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta05",
        "code": "SWTA05",
        "c": "summer-teens",
        "n": "PINTURA: Acrylic",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWTA05 PINTURA: Acrylic summer-teens Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta06",
        "code": "SWTA06",
        "c": "summer-teens",
        "n": "PINTURA: Gouache",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_chelsea_eli_dodie",
        "kw": "SWTA06 PINTURA: Gouache summer-teens Chelsea / Eli / Dodie",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta07",
        "code": "SWTA07",
        "c": "summer-teens",
        "n": "Mobile Digital Painting",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_louie_dacca",
        "kw": "SWTA07 Mobile Digital Painting summer-teens Louie Dacca",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta08",
        "code": "SWTA08",
        "c": "summer-teens",
        "n": "Mobile Digital Animation with FlipaClip",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWTA08 Mobile Digital Animation with FlipaClip summer-teens Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta09",
        "code": "SWTA09",
        "c": "summer-teens",
        "n": "Mobile Digital Animation with Clip Studio Paint",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_jofel_valencia",
        "kw": "SWTA09 Mobile Digital Animation with Clip Studio Paint summer-teens Jofel Valencia",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta10",
        "code": "SWTA10",
        "c": "summer-teens",
        "n": "CMA: Logo Design",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "SWTA10 CMA: Logo Design summer-teens Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta11",
        "code": "SWTA11",
        "c": "summer-teens",
        "n": "CMA: Motion Graphics",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "SWTA11 CMA: Motion Graphics summer-teens Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "swta12",
        "code": "SWTA12",
        "c": "summer-teens",
        "n": "CMA: Video Editing",
        "price": 1499,
        "sess": 1,
        "hrs": 3,
        "dur": 3.0,
        "trainer": "tr_zachary",
        "kw": "SWTA12 CMA: Video Editing summer-teens Zachary",
        "bundleable": true,
        "hidden": false,
        "modules": [],
        "nofull": true,
        "unit": "per workshop"
    },
    {
        "id": "ssf-block",
        "code": "SSF-BLOCK",
        "c": "ssf",
        "n": "Digital Entertainment Exchange — 8-Session Lab Block",
        "price": 4800,
        "sess": 8,
        "hrs": 24,
        "dur": 3.0,
        "trainer": "",
        "kw": "SSF-BLOCK Digital Entertainment Exchange — 8-Session Lab Block ssf ",
        "bundleable": false,
        "hidden": false,
        "modules": [],
        "facility": true,
        "unit": "per session · 8 sessions = ₱4,800",
        "desc": "Shared Service Facility lab block."
    },
    {
        "id": "ssf-hourly",
        "code": "SSF-HOURLY",
        "c": "ssf",
        "n": "Digital Entertainment Exchange — Facility Rental",
        "price": 80,
        "hrs": 3,
        "trainer": "",
        "kw": "SSF-HOURLY Digital Entertainment Exchange — Facility Rental ssf ",
        "bundleable": false,
        "hidden": false,
        "modules": [],
        "facility": true,
        "unit": "per hour, pro-rated by the minute",
        "desc": "DTI–CSDA Shared Service Facility workstation rental, charged by the hour and pro-rated by the minute."
    }
],
  promos: [
    { id:'p_full',   label:'Full Payment',        pct:10, kind:'fullpay', sub:'Settled in a single payment', page:'16' },
    { id:'p_bundle', label:'Bundle (3+ courses)', pct:10, kind:'bundle',  min:3, sub:'Auto-applies at 3+ courses', page:'16' },
    { id:'p_early',  label:'Early Bird',          pct:5,  kind:'manual',  sub:'Enrolled before the cut-off', page:'16' },
    { id:'p_group',  label:'Group of 3+ students',pct:5,  kind:'manual',  sub:'Applies to each student in the cluster', page:'16' }
  ],
  plans: [
    { id:'pl_full', name:'Full Payment', stages:[{ l:'On enrolment', p:100, w:'enrol' }],
      note:'The only plan that unlocks the Full Payment discount.' },
    { id:'pl_o2', name:'Option 2 — Two-Installment', stages:[{ l:'Down payment', p:50, w:'enrol' }, { l:'After 3rd session', p:50, w:'session3' }],
      note:'Full Payment discount is forfeited under any installment plan.' },
    { id:'pl_o3', name:'Option 3 — Three-Stage',
      stages:[{ l:'Down payment', p:50, w:'enrol' }, { l:'After 3rd session', p:30, w:'session3' }, { l:'Second-to-last class', p:20, w:'secondlast' }],
      note:'Full Payment discount is forfeited under any installment plan.' }
  ],
  records: [],
  trainers: [
    {
        "id": "tr_camille",
        "name": "Camille",
        "email": ""
    },
    {
        "id": "tr_camille_jofel",
        "name": "Camille / Jofel",
        "email": ""
    },
    {
        "id": "tr_camille_jofel_charles_louie",
        "name": "Camille / Jofel / Charles / Louie",
        "email": ""
    },
    {
        "id": "tr_camille_jofel_geraldine_dexter",
        "name": "Camille / Jofel / Geraldine / Dexter",
        "email": ""
    },
    {
        "id": "tr_charles_henry",
        "name": "Charles / Henry",
        "email": ""
    },
    {
        "id": "tr_charles_s",
        "name": "Charles S.",
        "email": ""
    },
    {
        "id": "tr_charles_s_henryk_bisera",
        "name": "Charles S. / Henryk Bisera",
        "email": ""
    },
    {
        "id": "tr_chelsea",
        "name": "Chelsea",
        "email": ""
    },
    {
        "id": "tr_chelsea_eli_dodie",
        "name": "Chelsea / Eli / Dodie",
        "email": ""
    },
    {
        "id": "tr_chelsea_m",
        "name": "Chelsea M.",
        "email": ""
    },
    {
        "id": "tr_dexter_f",
        "name": "Dexter F.",
        "email": ""
    },
    {
        "id": "tr_dexter_f_jofel_v",
        "name": "Dexter F. / Jofel V.",
        "email": ""
    },
    {
        "id": "tr_dodie",
        "name": "Dodie",
        "email": ""
    },
    {
        "id": "tr_eli_chelsea_stacy",
        "name": "Eli / Chelsea / Stacy",
        "email": ""
    },
    {
        "id": "tr_eli_ituriaga_chelsea_m",
        "name": "Eli Ituriaga / Chelsea M.",
        "email": ""
    },
    {
        "id": "tr_geraldine",
        "name": "Geraldine",
        "email": ""
    },
    {
        "id": "tr_henryk",
        "name": "Henryk",
        "email": ""
    },
    {
        "id": "tr_jofel_louie",
        "name": "Jofel / Louie",
        "email": ""
    },
    {
        "id": "tr_jofel_valencia",
        "name": "Jofel Valencia",
        "email": ""
    },
    {
        "id": "tr_louie_camille_jofel",
        "name": "Louie / Camille / Jofel",
        "email": ""
    },
    {
        "id": "tr_louie_dacca",
        "name": "Louie Dacca",
        "email": ""
    },
    {
        "id": "tr_louie_dacca_geraldine",
        "name": "Louie Dacca / Geraldine",
        "email": ""
    },
    {
        "id": "tr_zachary",
        "name": "Zachary",
        "email": ""
    },
    {
        "id": "tr_zachary_louie",
        "name": "Zachary / Louie",
        "email": ""
    },
    {
        "id": "tr_zachary_nino",
        "name": "Zachary / Nino",
        "email": ""
    }
],
  holidays: [],          // one-off closures: storms, suspensions, in-service days
  rentals: [],           // facility sessions, separate from enrollments
  audit: [],             // local action trail — convenience, not legal evidence
  units: (function(){ var a = [];
    for (var i = 1; i <= 20; i++) a.push({ id:'u'+i, name:'Unit ' + String(i).padStart(2,'0') });
    return a; })(),
  pay: { on:false, note:'',
         bank:{ name:'', acctName:'', acctNo:'', branch:'', swift:'' },
         gcash:{ name:'', number:'', qrText:'', qrImg:'' } },
  cfg: { late:3, combine:false, pwd:'csda2026', dur:3, tstart:'13:00',
    org:'Cordillera School of Digital Arts, Inc.',
    orgsub:'Baguio City, Benguet, Philippines',
    addr:'3rd Level, 237 Avenue by GAV Bldg., Upper Bonifacio St., Baguio City, Philippines, 2600',
    tel:'', mobile:'', email:'', skipHolidays:true, rseq:1,
    seq:1 }
};

var DB;
/* older saves predate trainers and the contact fields */
function trainerSlug(name){return 'tr_'+String(name||'trainer').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
function migrateIndividualTrainers(){
  var old=DB.trainers||[],byOld={},individuals={},ensure=function(name,source){name=String(name||'').trim();if(!name)return '';var key=name.toLowerCase(),id=trainerSlug(name),n=1;while(individuals[id]&&individuals[id].name.toLowerCase()!==key)id=trainerSlug(name)+'_'+(++n);if(!individuals[id])individuals[id]={id:id,name:name,email:(source&&source.email)||'',mobile:(source&&source.mobile)||'',title:(source&&source.title)||'',specialties:(source&&source.specialties)||'',bio:(source&&source.bio)||'',portfolios:(source&&source.portfolios)||[],active:source&&source.active===false?false:true,photo:(source&&source.photo)||''};return id;};
  old.forEach(function(t){var parts=String(t.name||'').split(/\s*\/\s*/).filter(Boolean);byOld[t.id]=parts.map(function(n){return ensure(n,parts.length===1?t:null);});});
  (DB.items||[]).forEach(function(it){var ids=(it.trainers||[]).slice();if(it.trainer&&byOld[it.trainer])ids=ids.concat(byOld[it.trainer]);ids=ids.filter(function(x,i,a){return x&&a.indexOf(x)===i;});it.trainers=ids;it.trainer=ids[0]||'';});
  DB.trainers=Object.keys(individuals).map(function(k){return individuals[k];}).sort(function(a,b){return a.name.localeCompare(b.name);});
}
function migrateDB(){
  if (!DB.trainers) DB.trainers = [];
  if (!DB.holidays) DB.holidays = [];
  if (!DB.rentals) DB.rentals = [];
  if (!DB.audit) DB.audit = [];
  if (!DB.units || !DB.units.length) DB.units = JSON.parse(JSON.stringify(DEFAULTS.units));
  /* the floor grew from a 4-PC pilot to 20 bays; carry old saves forward */
  if (DB.units.length === 4 && DB.units.every(function(u){ return /^PC-0\d$/.test(u.name); })) {
    DB.units = JSON.parse(JSON.stringify(DEFAULTS.units));
  }
  if (DB.cfg && !DB.cfg.rseq) DB.cfg.rseq = 1;
  if (!DB.pay) DB.pay = JSON.parse(JSON.stringify(DEFAULTS.pay));
  if (!DB.pay.bank) DB.pay.bank = { name:'', acctName:'', acctNo:'', branch:'', swift:'' };
  if (!DB.pay.gcash) DB.pay.gcash = { name:'', number:'', qrText:'', qrImg:'' };
  if (DB.cfg && DB.cfg.skipHolidays == null) DB.cfg.skipHolidays = true;
  if (!DB.cfg) DB.cfg = JSON.parse(JSON.stringify(DEFAULTS.cfg));
  ['tel','mobile','email'].forEach(function(k){if(DB.cfg[k]==null)DB.cfg[k]='';});
  migrateIndividualTrainers();
  (DB.records || []).forEach(function(r){
    if (!r.trainer) r.trainer = { id:'', name:'', email:'' };
    if (r.sched && r.sched.end == null) r.sched.end = '';
    if (r.sched && !r.sched.skips) r.sched.skips = [];
    if (!r.payments) r.payments = [];
    if (!r.consent) r.consent = { gName:'', gRel:'Parent', gMobile:'', call:false, dpa:false,
                                  money:false, signed:false, signedAt:'' };
    if (!r.agree) r.agree = { privacy:false, privacyAt:'', terms:false, termsAt:'' };
    if (r.baseline === undefined) r.baseline = null;
  });

  /* The approved Shared Service Facility individual workstation rate is fixed at
     ₱80 per hour. Existing closed/active rental sessions retain their recorded rate;
     this updates the catalogue rate used by all newly opened sessions. */
  var hourlyFacility=(DB.items||[]).filter(function(i){return i.id==='ssf-hourly';})[0];
  if(hourlyFacility)hourlyFacility.price=80;

  /* The uploaded 2026 course sheet is authoritative for active listings. Preserve only
     old courses referenced by saved enrollments, and hide those archival rows so record
     names remain readable without leaving obsolete courses in the sales catalogue. */
  if (DB.catalogVersion !== DEFAULTS.catalogVersion) {
    var used = {};
    (DB.records || []).forEach(function(r){ (r.courses || []).forEach(function(id){ used[id] = true; }); });
    var oldItems = DB.items || [], oldCats = DB.cats || [];
    var archivedItems = oldItems.filter(function(i){ return used[i.id]; }).map(function(i){
      i = JSON.parse(JSON.stringify(i)); i.hidden = true; i.archived = true; return i;
    });
    var archivedCatIds = {};
    archivedItems.forEach(function(i){ archivedCatIds[i.c] = true; });
    var newCatIds = {};
    DEFAULTS.cats.forEach(function(c){ newCatIds[c.id] = true; });
    var archivedCats = oldCats.filter(function(c){ return archivedCatIds[c.id] && !newCatIds[c.id]; })
      .map(function(c){ c = JSON.parse(JSON.stringify(c)); c.hidden = true; return c; });
    DB.items = archivedItems.concat(JSON.parse(JSON.stringify(DEFAULTS.items)));
    DB.cats = archivedCats.concat(JSON.parse(JSON.stringify(DEFAULTS.cats)));
    var oldTrainers = DB.trainers || [], trainerNames = {};
    DB.trainers = JSON.parse(JSON.stringify(DEFAULTS.trainers));
    DB.trainers.forEach(function(t){ trainerNames[(t.name||'').toLowerCase()] = true; });
    oldTrainers.forEach(function(t){
      if (t.name && !trainerNames[t.name.toLowerCase()]) DB.trainers.push(t);
    });
    DB.catalogVersion = DEFAULTS.catalogVersion;
    store.set('csda_db', JSON.stringify(DB));
  }
}
function load(){
  var raw = store.get('csda_db');
  if (raw) { try {
    DB = JSON.parse(raw);
    DB.items.forEach(function(i){ if (!i.modules) i.modules = []; if (i.hidden == null) i.hidden = false; });
    DB.cats.forEach(function(c){ if (c.hidden == null) c.hidden = false; });
    if (!DB.cfg.org) DB.cfg.org = DEFAULTS.cfg.org;
    if (!DB.cfg.orgsub) DB.cfg.orgsub = DEFAULTS.cfg.orgsub;
    if (!DB.cfg.addr) DB.cfg.addr = DEFAULTS.cfg.addr;
    if (!DB.cfg.seq) DB.cfg.seq = 1;
    if (!DB.records) DB.records = [];
    migrateDB();
    /* records saved when the field was "Grade level" keep their value under the new key */
    DB.records.forEach(function(rc){
      if (rc.student && rc.student.educ == null) {
        rc.student.educ = rc.student.grade || '';
        delete rc.student.grade;
      }
    });
    if (!DB.cfg.dur) DB.cfg.dur = 3;
    if (!DB.cfg.tstart) DB.cfg.tstart = '13:00';
    /* plans saved before due-date rules existed carry no `w`, which would make every
       stage fall due on the enrollment date — backfill from the matching default plan. */
    (DB.plans || []).forEach(function(pl){
      var dflt = DEFAULTS.plans.filter(function(x){ return x.id === pl.id; })[0];
      (pl.stages || []).forEach(function(s, ix){
        if (s.w) return;
        var ds = dflt && dflt.stages && dflt.stages[ix];
        if (ds && ds.w && ds.p === s.p) s.w = ds.w;
      });
    });
    DB.items.forEach(function(i){ if (i.dur == null) i.dur = 3; });
    return;
  } catch(e){} }
  DB = JSON.parse(JSON.stringify(DEFAULTS));
}
var clientCache={revision:0,visibleRevision:-1,visibleItems:[]};
function invalidateClientCache(){clientCache.revision++;clientCache.visibleRevision=-1;}
function save(){
  invalidateClientCache();
  store.set('csda_db', JSON.stringify(DB));
  var changes = parseInt(store.get('csda_backup_changes') || '0', 10) || 0;
  store.set('csda_backup_changes', String(changes + 1));
}
function backupStatus(){
  var at = store.get('csda_backup_at') || '';
  var changes = parseInt(store.get('csda_backup_changes') || '0', 10) || 0;
  var ageDays = at ? Math.floor((Date.now() - new Date(at).getTime()) / 86400000) : null;
  return { at:at, changes:changes, ageDays:ageDays,
    due: !at || changes >= 10 || (ageDays != null && ageDays >= 7) };
}
function catById(id){ for (var i=0;i<DB.cats.length;i++) if (DB.cats[i].id===id) return DB.cats[i]; return null; }
function itemById(id){ for (var i=0;i<DB.items.length;i++) if (DB.items[i].id===id) return DB.items[i]; return null; }
function planById(id){ for (var i=0;i<DB.plans.length;i++) if (DB.plans[i].id===id) return DB.plans[i]; return DB.plans[0]; }
function visItems(){if(clientCache.visibleRevision===clientCache.revision)return clientCache.visibleItems;clientCache.visibleItems=DB.items.filter(function(i){var c=catById(i.c);return !i.hidden&&c&&!c.hidden;});clientCache.visibleRevision=clientCache.revision;return clientCache.visibleItems;}
load();
