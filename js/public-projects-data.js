// Public Projects Data
// Centralized source of truth for the IPS Public Projects Hub

const publicProjectsData = [
  // Existing 8 (Refined IDs)
  {
    title: "Urban Vertical Gardens",
    author: "Green City Collective",
    date: "2023-10-12",
    category: "Science",
    id: "ENV-23-001",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAhgJO0DqrZba7SdVBhKAmBaEOUGCm1_z9Z2TgVNUrhruhy3jSkyaf_6GCpk0QkWv7lmJBarVJcM0d3uGRv5hSUbJBeE7i4xGUjLFaWzpgVtz0glFPKn1AxQVABgAs9xZF8Ywr_JeR6IuSEAho2J67nkSb20GGFI0OvJDF3L-WP6fY1GSQyYbYii73nhEMWIAYTBOxcgvwN253MCKxrpnw3_WYVCgox04N_c2xnoPWvMLREqH43rWbv3tm1QKQE7480FkAcCsy91Q",
    desc: "A scalable proposal for integrating hydroponic systems into existing high-density housing structures to improve air quality and provide local food sources.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">As rapid urbanization reduces available arable land, cities face challenges regarding food security and air quality. The <strong>Urban Vertical Gardens</strong> initiative proposes a modular hydroponic system designed specifically for retrofitting onto the facades of high-rise residential buildings.</p>
        <p class="mb-4">Our pilot study demonstrates that a 100-square-meter installation can produce up to 500kg of leafy greens annually while filtering particulate matter from the surrounding air.</p>
        
        <h3 class="text-xl font-bold mb-4 mt-8">Methodology</h3>
        <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Modular Design:</strong> Lightweight, interlocking units that can be installed without structural modification.</li>
            <li><strong>Water Efficiency:</strong> Closed-loop irrigation system using gray water recycling.</li>
            <li><strong>Community Engagement:</strong> Residents are trained to maintain the gardens, fostering community ownership.</li>
        </ul>
      `
  },
  {
    title: "Decentralized Data Vaults",
    author: "Alex Chen",
    date: "2023-11-05",
    category: "Technology",
    id: "TEC-23-042",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK0QIPHy5ipmmAbFYsQo_8ClW53MjVs6DC_d4xonCXaccxKwMSc9TGRYJYdRNHEkHDsuIbGjV22UAVHQAdZMully-jAx4Z-3HCg38yBoyrOfDKAl2VANF7wZEH9LTNh2DeJBrDsgK-QorSpezwqH1385qYIkA0oKcuS-B9NNIeLMGRigNEJsqJeiA9vNagQCgIuNvrv8Y2cHRdS6Zbi3qTyKK4QVkb_ZNdM5W19q0lZLANFu1f_V2emo-2XCWETlaAgCmz2VuhqoE",
    desc: "Creating personal data sovereignty through a blockchain protocol that allows users to monetize their own browsing data.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Abstract</h3>
        <p class="mb-4">In the current digital economy, user data is often harvested without explicit consent or compensation. <strong>Decentralized Data Vaults (DDV)</strong> offer a paradigm shift, returning ownership to the individual.</p>
        <p class="mb-4">Using Zero-Knowledge Proofs (ZKPs), the DDV protocol allows users to prove eligibility for services (e.g., age, location) without revealing the underlying raw data.</p>
      `
  },
  {
    title: "Community Resource Exchange",
    author: "Neighborhood Watch 2.0",
    date: "2023-12-01",
    category: "Social",
    id: "SOC-23-055",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1fxKwLu5PdgW2WqLLbdVbdRAMAjKHJxqKDq-T8CuneWKlLlm-mykXfGPDMJymSifQYL1tODuAlaF4zAT_lzb8VQF1vpykBODEpLlzL6YmYsyPbHcsc97G85w8aNDz-o871peliJwhqhfB7VtWUyyiGGdnc23NEEMXVjCJg6GYguHCFvh_OO0tLvxzCr7OB1YFYTNiuCpBY6JNreS1St9JGIc77XRlT0KTU2n_UCWWzo5bNcytlnWog8TIOYsZif1JHnZc7Vwmhk",
    desc: "A hyper-local app designed to facilitate skill-sharing and tool lending within a 5-block radius, fostering stronger community bonds.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Community Resource Exchange is a digital platform that reconnects neighbors through a shared economy of goods and skills.</p>
      `
  },
  {
    title: "Low-Cost Diagnostics",
    author: "OpenMed Initiative",
    date: "2024-01-22",
    category: "Science",
    id: "SCI-24-010",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRCWyvg5P6YLTg0Ft84zBQ-NZFktcKYtyibxltH5TuIYaTA2moY-4lEUhELv6QQbts7Rj8MuVDlLeG13TDXWhptoNJkImKH08yxWzGQNZcFvFzNxaJ9CX096LsPE3t2eBNr0mTlJMP1YjzU3LMHHFsjPU4gSAlhWioUrsFy5LEVqJxNx63Fgu-RwjTMd-Hb4lS47foFR3coxYdBxr2VFwIm3kYxIxQIdq5jQD9_ItfzfhjNmKlk2Lh-EQ1cQRX_el4EQ7EkHIL5ic",
    desc: "Developing open-source 3D printable diagnostic tools for rural clinics to detect common waterborne pathogens rapidly.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Access to expensive lab equipment is a major bottleneck in rural healthcare. This project designs diagnostic tools that can be printed on standard FDM 3D printers.</p>
      `
  },
  {
    title: "Kinetic Public Sculptures",
    author: "Sarah & Tom Design",
    date: "2024-01-15",
    category: "Art",
    id: "ART-24-095",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuCoQ4UlKAJUljU5t71wwJ_R7rZhj4K44c1qfPu64Z92TuLB9BzJS2p4KGDeSXGf15rVQGvNCX6WgVDazSMcmNZtrAR1MCcos3UGb-3cGQeAYBcpzWKJ69gxPclu8M-4DU6PFUqdBHO7yh8OSk_IdlB-EH1Ttsplwwr3pkjuFiT8o4FwrzgEkb-0B4XYDD2tBrrQ25JCqqCJPiNUFRQVat8TgMsDBtX4zbCyu9Su_3QhGhTLOy8vWxpLmZUofAAIoX4tZdlKuakw",
    desc: "Wind-powered sculptures that generate low-voltage electricity to power street lighting while serving as dynamic art pieces.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Merging aesthetics with utility, these sculptures harness wind energy to light up public parks, serving as a beacon of sustainable art.</p>
      `
  },
  {
    title: "Immersive History",
    author: "Future Learn Lab",
    date: "2024-02-10",
    category: "Social", // Maps to Education
    id: "edu-24-015",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJt24bmEP7FPL4alSWa1CIuD45zu9cMe4Nj3slPPiaMhTGsVkQ04jw-jylpxvNjqd-sV2fzadE8aviR72U2tp54AoodhvYtjiiTfzrVccvZlNIkGwo86vN7AGOUm30UGmty8PJYEYI7izYMHohiRW-Awx3r0cv-l8RPPSC_mxv0NPVaO5eDvuw1P3KLyllNbsJNrjNEPl4aQXnDlAdN33tVFwnWTiNxyX0XXNJO0Autg6yezsfjWyeahJa0F_SzHU2zpFBYX9qi1g",
    desc: "Using Virtual Reality to recreate historical events for high school curriculums, allowing students to experience history firsthand.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Traditional history lessons can feel abstract. Immersive History uses VR to place students in the center of historical events, increasing engagement and retention.</p>
      `
  },
  {
    title: "Microgrid Energy Co-ops",
    author: "Civic Power Network",
    date: "2024-02-24",
    category: "Technology",
    id: "ENG-24-012",
    image: "https://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=1200&q=60",
    desc: "A community-owned microgrid model to increase local energy resilience and reduce operational costs for neighborhoods.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Decentralizing energy production allows communities to be resilient against grid failures. This project models the economic and technical feasibility of neighborhood microgrids.</p>
      `
  },
  {
    title: "River Plastic Interception",
    author: "CleanFlow Lab",
    date: "2024-03-02",
    category: "Science",
    id: "ENV-24-019",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=60",
    desc: "A modular, low-maintenance interception barrier concept designed for high-flow urban rivers to reduce plastic leakage into oceans.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Project Overview</h3>
        <p class="mb-4">Most ocean plastic originates from rivers. Our interception barrier uses fluid dynamics to guide waste to a collection point without disrupting marine life.</p>
      `
  },

  // New 12 Added Projects (with consistent details)
  {
    title: "AI Fairness in Judicial Systems",
    author: "Ethics in AI Group",
    date: "2024-01-15",
    category: "Social",
    id: "SOC-24-003",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200",
    desc: "Analyzing algorithmic bias in predictive policing software to propose regulatory frameworks.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Introduction</h3>
        <p class="mb-4">As AI systems are increasingly used in judicial decision-making, ensuring fairness is paramount. This research investigates the 'black box' nature of predictive policing algorithms.</p>
      `
  },
  {
    title: "Biodegradable Plastics from Algae",
    author: "BioMaterials Lab",
    date: "2024-01-20",
    category: "Science",
    id: "SCI-24-008",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f1f2?auto=format&fit=crop&w=1200",
    desc: "Synthesizing scalable bioplastics from marine algae species native to the Marmara Sea.",
    fullContent: `
        <h3 class="text-xl font-bold mb-4">Introduction</h3>
        <p class="mb-4">Traditional plastics persist for centuries. Our lab has isolated a strain of Marmara algae that yields high-strength biopolymers degradable within 6 months.</p>
      `
  },
  // ... Additional entries follow the same pattern (shortened for brevity in this file creation, 
  // but in a real app, you'd fill all 20. Just simulating the key ones for the Hub view).
  {
    title: "Quantum Cryptography Standards",
    author: "SecurNet Team",
    date: "2024-03-05",
    category: "Technology",
    id: "SEC-24-021",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200",
    desc: "Drafting post-quantum encryption protocols for small-scale IoT devices.",
    fullContent: "<p>Preparing IoT infrastructure for the post-quantum era.</p>"
  },
  {
    title: "Genomic Data Privacy",
    author: "BioInfo Shield",
    date: "2024-03-12",
    category: "Technology",
    id: "BIO-24-033",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200",
    desc: "Homomorphic encryption techniques for sharing genomic datasets without revealing identity.",
    fullContent: "<p> securing sensitive genetic data while enabling collaborative research.</p>"
  },
  {
    title: "Microplastic Filtration Nanobots",
    author: "NanoClean Initiative",
    date: "2024-03-28",
    category: "Science",
    id: "NAN-24-040",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200",
    desc: "Autonomous nanobots designed to aggregate microplastics in wastewater treatment plants.",
    fullContent: "<p>Deploying swarms of nanobots to identify and cluster microplastics.</p>"
  },
  {
    title: "AR for Surgical Training",
    author: "MedTech Pioneers",
    date: "2024-04-02",
    category: "Technology",
    id: "MED-24-055",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200",
    desc: "Augmented reality overlay systems for training medical students in complex vascular surgeries.",
    fullContent: "<p>Reducing surgical errors through immersive AR training simulations.</p>"
  },
  {
    title: "Sustainable Concrete Alternatives",
    author: "Civil Eng. Circle",
    date: "2024-04-10",
    category: "Science",
    id: "CIV-24-060",
    image: "https://images.unsplash.com/photo-1590674899505-1c5c4194943f?auto=format&fit=crop&w=1200",
    desc: "Testing ash-based geopolymer concrete for structural integrity and carbon footprint reduction.",
    fullContent: "<p>Concrete production is a major CO2 emitter. We optimize fly-ash geopolymers.</p>"
  },
  {
    title: "Psychology of Deepfakes",
    author: "Media Studies Dept.",
    date: "2024-04-18",
    category: "Social",
    id: "PSY-24-067",
    image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=1200",
    desc: "Investigating the impact of synthetic media on trust in public institutions.",
    fullContent: "<p>A longitudinal study on misinformation perception in the age of generative AI.</p>"
  },
  {
    title: "Blockchain Supply Chain",
    author: "Logistics 3.0",
    date: "2024-04-25",
    category: "Technology",
    id: "ECO-24-072",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200",
    desc: "End-to-end transparency platform for fair trade coffee supply chains.",
    fullContent: "<p>Tracking coffee beans from farm to cup to ensure fair wages.</p>"
  },
  {
    title: "Renewable Energy Storage",
    author: "Battery Tech Lab",
    date: "2024-05-01",
    category: "Science",
    id: "ENE-24-080",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200",
    desc: "Solid-state battery prototypes utilizing abundant sodium ions instead of lithium.",
    fullContent: "<p>Moving beyond lithium reliance with high-density sodium solid-state batteries.</p>"
  },
  {
    title: "Smart Prosthetics Feedback",
    author: "NeuroRobotics",
    date: "2024-05-15",
    category: "Technology",
    id: "ROB-24-088",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200",
    desc: "Implementing haptic feedback loops in upper-limb prosthetics to restore sense of touch.",
    fullContent: "<p>Bridging the sensory gap in prosthetics with non-invasive haptic interfaces.</p>"
  },
  {
    title: "Cultural Heritage 3D",
    author: "Digital History Archives",
    date: "2024-05-20",
    category: "Art",
    id: "ART-24-091",
    image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200",
    desc: "High-fidelity photogrammetry scans of endangered historical sites in Anatolia.",
    fullContent: "<p>Preserving history digitally before it is lost to time or disaster.</p>"
  },
  // New 5 Projects (Team Names)
  {
    title: "Autonomous Drone Swarms",
    author: "SkyHive Robotics",
    date: "2024-06-01",
    category: "Technology",
    id: "TEC-24-101",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1200",
    desc: "Distributed algorithms for coordinating search-and-rescue drone fleets in dense forests.",
    fullContent: "<h3 class='text-xl font-bold mb-4'>Swarm Intelligence</h3><p>Mimicking flocking behavior in birds to create resilient aerial networks.</p>"
  },
  {
    title: "Vertical Farming AI",
    author: "AgriTech Visionaries",
    date: "2024-06-08",
    category: "Science",
    id: "SCI-24-112",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200",
    desc: "Computer vision systems for monitoring plant health and optimizing nutrient delivery in vertical farms.",
    fullContent: "<h3 class='text-xl font-bold mb-4'>Precision Agriculture</h3><p>Reducing water usage by 95% while maximizing crop yields through AI-driven environmental control.</p>"
  },
  {
    title: "Haptic Suit for VR",
    author: "Sensory Immersion Team",
    date: "2024-06-15",
    category: "Technology",
    id: "TEC-24-124",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&w=1200",
    desc: "Full-body haptic feedback suits for remote training in hazardous industrial environments.",
    fullContent: "<h3 class='text-xl font-bold mb-4'>Feeling the Virtual</h3><p>Enabling workers to train for high-risk scenarios without physical danger.</p>"
  },
  {
    title: "Ocean Cleanup Gliders",
    author: "Blue Wave Engineering",
    date: "2024-06-22",
    category: "Science",
    id: "ENV-24-133",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1200",
    desc: "Solar-powered autonomous gliders that filter microplastics from surface waters indefinitely.",
    fullContent: "<h3 class='text-xl font-bold mb-4'>Autonomy for Clean Oceans</h3><p>A passive filtration system powered by wave energy and sun.</p>"
  },
  {
    title: "Smart Traffic Control",
    author: "Urban Flow Architects",
    date: "2024-07-01",
    category: "Technology",
    id: "URB-24-145",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200",
    desc: "Adaptive traffic light synchronization using real-time congestion data to reduce city-wide emissions.",
    fullContent: "<h3 class='text-xl font-bold mb-4'>Flow Optimization</h3><p>Reducing idle time by 30% through decentralized traffic signal logic.</p>"
  }
];
