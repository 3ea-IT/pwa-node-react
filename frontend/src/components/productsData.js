import p1 from "./assets/p1.jpeg";
import p2 from "./assets/p2.jpeg";
import p3 from "./assets/p3.jpeg";
import p4 from "./assets/p4.jpeg";
import p5 from "./assets/p5.jpeg";
import p6 from "./assets/p6.jpeg";

const productsData = [
  {
    name: "Digesto",
    image: p1,
    tagline: "Can Digest Anything.",
    dosage: "1-2 Tsp after meal.",
    price: "₹110 - ₹260",
    description:
      "Unveil the power of nature with Digesto, a meticulously crafted homeopathic formulation designed to restore harmony to your digestive system. Carefully blended using potent ingredients known for their therapeutic properties, Digesto addresses a myriad of digestive woes effectively and gently.",
    sections: [
      {
        title: "Ingredients for Holistic Relief:",
        content: [
          "Nux Vomica 1x: Eases indigestion and flatulence.",
          "Cinchona officinalis 1x: Alleviates acidity and sour eructations.",
          "Hydrastis Can 1x: Supports healthy stomach function.",
          "Carbo vegetabilis 3x: Reduces bloating and gas.",
          "Zingiber Officinale 1x: Soothes burning sensations in chest and stomach.",
          "Natrum Carb 1x: Helps with constipation and digestive discomfort.",
          "Ocimum Sanctum 1x: Aids in restoring digestive balance.",
          "Lycopodium 1x: Addresses chronic irregular bowel movements.",
          "Allium Sativum 1x: Assists in reducing bloating and discomfort.",
          "Mentha Piperita 1x: Relieves symptoms of indigestion and acidity.",
        ],
      },
      {
        title: "Dosage:",
        content: [
          "Enjoy the convenience of Digesto with a dosage of 1 to 2 tablespoonfuls after meals, recommended twice or thrice daily. This gentle regimen ensures continuous support for your digestive health throughout the day.",
        ],
      },
      {
        title: "Ideal for:",
        content: [
          "Digesto is your companion against indigestion, stomach disorders, sour eructations, flatulence, acidity, constipation, and the burning sensations in your chest and stomach. Its natural formulation offers relief from:",
          "Chronic irregular bowel movements",
          "Abdominal distension after eating",
          "Loss of appetite with disinterest in food",
          "Loud-rumbling belching with acidic water in the mouth",
        ],
      },
      {
        title: "Why Choose Digesto?",
        content: [
          "Natural Ingredients: Made from pure homeopathic ingredients known for their efficacy.",
          "Gentle Yet Effective: Provides relief without harsh side effects.",
          "Convenient Dosage: Easy to integrate into your daily routine.",
        ],
      },
    ],
  },
  {
    name: "Jaboran5",
    image: p2,
    tagline: "Your Solution for Strong, Healthy Hair",
    dosage: "10 to 20 drops with a little water twice daily",
    price: "₹120 - ₹280",
    description:
      "Say goodbye to hair fall and embrace revitalized hair with HASLAB's Jaboran Drops. This unique formulation is crafted to strengthen hair, rejuvenate the scalp, and stimulate hair follicles, promoting robust growth and combating dandruff effectively.",
    sections: [
      {
        title: "Key Benefits:",
        content: [
          "Strengthens Hair: Prevents hair fall and protects against damage.",
          "Revitalizes Scalp: Rejuvenates the scalp for healthier hair follicles.",
          "Controls Dandruff: Combats dandruff and dry scalp conditions.",
          "Promotes Hair Growth: Stimulates hair follicles to encourage natural growth.",
          "Relieves Scalp Itching: Soothes itching and eczema of the scalp.",
        ],
      },
      {
        title: "Potent Composition:",
        content: [
          "Acid Phosphoricum 3x: Prevents premature greying and thinning of hair.",
          "Arnica Montana 3x: Rejuvenates scalp and promotes healthy hair follicles.",
          "Arsenicum Album 3x: Treats itchy, rough scalp with dandruff issues.",
          "Graphites 3x: Addresses dandruff accompanied by eczema or eruptions.",
          "Jaborandi 3x: Strengthens hair follicles and prevents hair fall.",
          "Lycopodium 3x: Tackles hair loss due to hormonal changes.",
          "Phosphorous 3x: Relieves scalp itching and dandruff.",
          "Sulphur 3x: Calms dry, itchy scalp with powdery dandruff.",
        ],
      },
      {
        title: "Why Choose Jaboran Drops?",
        content: [
          "Effective Natural Formula: Harnesses the power of homeopathic ingredients.",
          "Comprehensive Hair Care: Addresses multiple hair concerns in one formulation.",
          "Clinically Proven: Developed by HASLAB, trusted for quality and efficacy.",
        ],
      },
    ],
  },
  {
    name: "Drox-24",
    image: p3,
    tagline: "Relief for Sciatic Nerve Pain",
    dosage:
      "Take 5 to 10 drops in water every half to one hour during acute episodes",
    price: "₹170",
    description:
      "Find relief from sciatic nerve pain with DROX 24 Sciatica Drops, a specialized homeopathic formulation designed to alleviate symptoms associated with sciatica. Whether caused by a prolapsed disc or pressure on the sciatic nerve, DROX 24 targets paresthesias, cramps, and pain in the calves effectively.",
    sections: [
      {
        title: "Powerful Composition:",
        content: [
          "Colocynth 3x: Relieves cramp-like pain, particularly in the sciatic nerve.",
          "Aconite 3x: Eases acute pain and inflammation.",
          "Gnaphallium 3x: Addresses sciatic nerve pain with shooting pains.",
          "Magnum Acet. 3x: Helps in cases of nerve pain and neuralgia.",
          "Rhus Tox 3x: Reduces pain and stiffness worsened by movement.",
        ],
      },
      {
        title: "Effective Relief Protocol:",
        content: [
          "Dosage: Take 5 to 10 drops in water every half to one hour during acute episodes. Once symptoms improve, take 3-4 times daily.",
          "Targeted Symptoms: Provides relief from paresthesias, cramp-like or dragging pain from hip to ankles worsened by movement, and pain in calves.",
        ],
      },
      {
        title: "Why Choose DROX 24 Sciatica Drops?",
        content: [
          "Holistic Approach: Addresses the root cause of sciatica symptoms.",
          "Natural Ingredients: Formulated with potent homeopathic remedies.",
          "Ease of Use: Simple dosage regimen for acute and ongoing relief.",
        ],
      },
    ],
  },
  {
    name: "Aidoaller",
    image: p4,
    tagline: "Your Solution to Allergies",
    dosage: "1 caplet daily for maintenance, twice daily during acute episodes",
    price: "₹105",
    description:
      "Embrace freedom from allergies with Aidoaller Anti Allergic, a potent homeopathic blend crafted to alleviate a range of allergic symptoms effectively. From nasal congestion to skin reactions caused by environmental triggers, Aidoaller offers comprehensive relief to help you reclaim your comfort.",
    sections: [
      {
        title: "Powerful Composition:",
        content: [
          "Echinacea 1x: Boosts immunity and reduces allergic reactions.",
          "Allium Cepa: Relieves symptoms of hay fever and allergic rhinitis.",
          "Thuja 3x: Treats skin conditions aggravated by allergens.",
          "Pulsatilla 3x: Soothes nasal congestion and watery eyes.",
          "Pothos Foetida 3x: Controls sneezing and allergic respiratory symptoms.",
          "Histamine Hyd 3x: Counteracts histamine response reducing allergy symptoms.",
          "Ambrosia A 3x: Addresses allergic rhinitis and hay fever symptoms.",
          "Ferrum Phos 3x: Reduces inflammation and redness due to allergies.",
          "Sabadilla 3x: Relieves itching, sneezing, and watery eyes.",
        ],
      },
      {
        title: "Effective Relief Protocol:",
        content: [
          "Dosage: Take 1 caplet daily for maintenance. During acute allergy episodes, take twice daily or as prescribed by your physician.",
          "Benefits: Controls hypersecretion from nasal mucosa, allergic rhinitis, sneezing, watery eyes, redness, frontal headache, and skin eruptions triggered by sun exposure and dust pollution.",
        ],
      },
      {
        title: "Why Choose Aidoaller Anti Allergic?",
        content: [
          "Natural Relief: Harnesses the power of homeopathic ingredients.",
          "Comprehensive Solution: Targets multiple allergy symptoms in one formulation.",
          "Clinically Proven: Developed to provide effective relief without side effects.",
        ],
      },
    ],
  },
  {
    name: "Goparty",
    image: p5,
    tagline: "Your Solution to Hangover Symptoms",
    dosage: "2 caplets before first drink, 1 more caplet after 2-3 drinks",
    price: "₹65",
    description:
      "Embrace the freedom to enjoy your night out without worrying about the aftermath. GoParty is a potent homeopathic blend designed to alleviate a range of hangover symptoms effectively. From headaches to nausea caused by alcohol consumption, GoParty offers comprehensive relief to help you reclaim your comfort and enjoy your day after a night of celebration.",
    sections: [
      {
        title: "Powerful Composition:",
        content: [
          "Cinchona 3x: Alleviates symptoms of fatigue and minor dizziness.",
          "Lobelia inf 3x: Helps reduce nausea and vomiting.",
          "Nux Vomica 3x: Eases headaches and sensitivity to noise and light.",
          "Quercus gland spic 2x: Supports liver function and reduces hangover effects.",
          "Ranunculus bulbosus 3x: Relieves muscle pain and stiffness.",
          "Zincum Metallicum 3x: Soothes nervous tension and fatigue.",
          "Excipients Q.S.: Ensures proper formulation and effectiveness of the ingredients.",
        ],
      },
      {
        title: "Effective Relief Protocol:",
        content: [
          "Dosage: Adults: Take 2 caplets before your first drink. After consuming 2-3 drinks, take 1 more caplet.",
          "Benefits: Relieves headache, nausea, sensitivity to noise or light, minor dizziness, fatigue, dry mouth, and throat due to a hangover.",
        ],
      },
      {
        title: "Why Choose GoParty?",
        content: [
          "Natural Relief: Utilizes the power of homeopathic ingredients.",
          "Comprehensive Solution: Targets multiple hangover symptoms in one formulation.",
          "Clinically Proven: Developed to provide effective relief without side effects.",
          "Caution: GoParty will not prevent intoxication and is not intended to treat or prevent the consequences of excessive alcohol consumption.",
        ],
      },
    ],
  },
  {
    name: "HC-24",
    image: p6,
    tagline: "Your Solution to Amenorrhea and Menopause Symptoms",
    dosage: "Take 2 tablets 3-4 times daily",
    price: "₹75 - ₹950",
    description:
      "Experience relief from the challenges of amenorrhea and menopause with HC-24 Rosemarinus Complex, a potent homeopathic blend crafted to address various menstrual and menopausal symptoms. Whether dealing with irregular cycles or the discomforts of premenopausal syndrome, HC-24 Rosemarinus Complex offers comprehensive support to help you maintain your well-being.",
    sections: [
      {
        title: "Powerful Composition:",
        content: [
          "Ledum P. 3x: Reduces swelling and alleviates joint pain.",
          "Caulophyllum 2x: Regulates menstrual cycles and relieves uterine discomfort.",
          "Pulsatilla 2x: Balances hormones and eases emotional distress associated with menstrual and menopausal changes.",
        ],
      },
      {
        title: "Effective Relief Protocol:",
        content: [
          "Dosage: Take 2 tablets 3-4 times daily.",
          "Benefits: Addresses stopped or scanty menses. Alleviates symptoms appearing before menopause. Supports premenopausal syndrome management. Regulates delayed menopause. Balances irregular bleeding whether too early or with a gap of 2 to 3 months. Eases depression and swelling of the whole body.",
        ],
      },
      {
        title: "Why Choose HC-24 Rosemarinus Complex?",
        content: [
          "Natural Relief: Harnesses the power of homeopathic ingredients.",
          "Comprehensive Solution: Targets multiple symptoms related to amenorrhea and menopause.",
          "Clinically Proven: Developed to provide effective relief without side effects.",
        ],
      },
    ],
  },
];

export default productsData;
