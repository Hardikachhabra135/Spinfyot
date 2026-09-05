import {
  Home,
  Compass,
  GraduationCap,
  FileCheck,
  Plane,
  MapPin,
  Briefcase,
  Heart,
  Scale,
  BookOpen
} from 'lucide-react';

const services = [
  {
    slug: 'career-counselling',
    title: 'Career Counselling',
    shortDescription: 'One-on-one guidance to help you choose the right course, country, and career path abroad.',
    subtitle: 'Expert guidance to navigate your global education and career trajectory.',
    about: 'Making the decision to study abroad is life-changing, but choosing the right path can be overwhelming. Our Career Counselling service is designed to demystify the process. We take a holistic approach, analyzing your academic strengths, personal interests, and long-term career aspirations to build a personalized roadmap for your international education.',
    whatWeProvide: [
      { title: 'Profile Evaluation', desc: 'A thorough analysis of your academic records, test scores, and extracurricular achievements.' },
      { title: 'Course Alignment', desc: 'Mapping your interests to specific global degrees and specializations with high employability.' },
      { title: 'Country Selection', desc: 'Objective comparisons of destinations based on education quality, costs, and post-study work rights.' },
      { title: 'Career Mapping', desc: 'Long-term planning to ensure your chosen degree aligns with global industry demands.' }
    ],
    howItWorks: [
      { step: '01', title: 'Initial Consultation', desc: 'A deep-dive conversation to understand your dreams, constraints, and preferences.' },
      { step: '02', title: 'Psychometric Assessment', desc: 'Optional standardized testing to objectively identify your core strengths.' },
      { step: '03', title: 'Roadmap Creation', desc: 'We present a tailored strategy detailing the best courses and countries for you.' },
      { step: '04', title: 'Action Plan', desc: 'Clear next steps on test prep (IELTS/TOEFL) and profile building.' }
    ],
    whoItsFor: 'High school students exploring early options, undergraduates considering a master\'s degree, or working professionals looking to upskill and pivot their careers internationally.',
    faqs: [
      { q: 'When should I start career counselling?', a: 'Ideally, 12 to 18 months before you plan to enroll. This gives ample time for profile building, test preparation, and application deadlines.' },
      { q: 'Do you guarantee admission?', a: 'While no ethical consultancy can guarantee admission, our data-driven approach significantly maximizes your chances of acceptance into top-tier institutions.' },
      { q: 'Is counselling available online?', a: 'Yes, we offer fully remote, one-on-one video counselling sessions for students globally.' }
    ],
    icon: Compass,
  },
  {
    slug: 'university-selection',
    title: 'University Selection',
    shortDescription: 'Curated shortlists of universities that match your profile, budget, and goals.',
    subtitle: 'Finding the perfect academic home for your international studies.',
    about: 'With thousands of universities worldwide, finding the one that perfectly aligns with your academic profile, budget, and cultural preferences is a complex task. Our University Selection service leverages extensive institutional knowledge to create a curated, strategic shortlist of universities where you will not only be accepted, but where you will thrive.',
    whatWeProvide: [
      { title: 'Strategic Shortlisting', desc: 'Categorizing universities into "Ambitious", "Target", and "Safe" tiers based on your specific profile.' },
      { title: 'Curriculum Analysis', desc: 'Deep dives into module structures, faculty expertise, and research facilities of chosen programs.' },
      { title: 'Budget Optimization', desc: 'Balancing tuition fees, living expenses, and available scholarships to match your financial plan.' },
      { title: 'Alumni Network Review', desc: 'Assessing the strength of university career services and global alumni connections.' }
    ],
    howItWorks: [
      { step: '01', title: 'Profile Benchmarking', desc: 'We compare your academic standing against historical admission data.' },
      { step: '02', title: 'Preference Mapping', desc: 'We factor in your preferences for climate, campus size, and urban vs. rural settings.' },
      { step: '03', title: 'Shortlist Presentation', desc: 'We provide a detailed matrix comparing 8-12 recommended institutions.' },
      { step: '04', title: 'Final Selection', desc: 'Collaborative narrowing down to the final 4-6 universities you will apply to.' }
    ],
    whoItsFor: 'Students who have decided on their course of study but are overwhelmed by the sheer volume of university options and need expert help identifying the best fit.',
    faqs: [
      { q: 'How many universities should I apply to?', a: 'We typically recommend applying to 4 to 6 carefully selected universities to balance risk and application costs.' },
      { q: 'Do you help with scholarship identification?', a: 'Yes, during the selection process, we prioritize universities that offer scholarships and financial aid aligned with your profile.' },
      { q: 'Are you partnered with specific universities?', a: 'We maintain a vast global network, but our recommendations are strictly unbiased and tailored to what is genuinely best for your specific career goals.' }
    ],
    icon: GraduationCap,
  },
  {
    slug: 'visa-assistance',
    title: 'Visa Assistance',
    shortDescription: 'End-to-end support with documentation, applications, and interview prep.',
    subtitle: 'Navigating complex immigration procedures with confidence and precision.',
    about: 'Securing an admission offer is only half the battle; navigating the student visa process can be the most stressful part of studying abroad. Our Visa Assistance team stays up-to-date with the latest immigration policies across major study destinations to ensure your application is flawless, compliant, and submitted on time.',
    whatWeProvide: [
      { title: 'Document Checklists', desc: 'Country-specific, exhaustive lists of required financial, academic, and identity documents.' },
      { title: 'Form Filing Support', desc: 'Meticulous assistance in filling out complex government visa application portals.' },
      { title: 'Financial Strategy', desc: 'Guidance on structuring education loans, bank statements, and sponsor affidavits.' },
      { title: 'Mock Interviews', desc: 'Rigorous preparation for consulate interviews to build your confidence and articulation.' }
    ],
    howItWorks: [
      { step: '01', title: 'Visa Strategy Session', desc: 'Understanding the specific requirements of your destination country and your financial setup.' },
      { step: '02', title: 'Document Compilation', desc: 'Gathering, reviewing, and organizing all necessary paperwork.' },
      { step: '03', title: 'Application Submission', desc: 'Filing the application and scheduling biometrics or interview appointments.' },
      { step: '04', title: 'Interview Prep', desc: 'Conducting multiple mock interviews (if required by the destination country).' }
    ],
    whoItsFor: 'Students who have received unconditional offers from their universities and need expert guidance to secure their student visa without delays or rejections.',
    faqs: [
      { q: 'What happens if my visa gets rejected?', a: 'While our success rate is exceptional, if a rejection occurs, our Appeals team will analyze the refusal reasons and guide you through a reapplication or appeal process.' },
      { q: 'How much funds do I need to show?', a: 'This varies heavily by country and program. Generally, you must demonstrate enough liquid funds to cover your first year of tuition and living expenses.' },
      { q: 'Do you handle the actual visa fee payments?', a: 'Visa fees are paid directly to the respective embassy or high commission. We guide you through the secure payment process.' }
    ],
    icon: FileCheck,
  },
  {
    slug: 'pre-departure-support',
    title: 'Pre-Departure Support',
    shortDescription: 'Briefings on travel, accommodation, and culture before you fly.',
    subtitle: 'Ensuring you are fully prepared before you step onto the plane.',
    about: 'The transition from receiving your visa to arriving in a new country involves countless logistical details. Our Pre-Departure Support is designed to eliminate last-minute panic. We prepare you for the cultural, practical, and academic shifts you are about to experience, ensuring you fly with peace of mind.',
    whatWeProvide: [
      { title: 'Travel & Packing Advice', desc: 'Comprehensive guides on what to pack, baggage allowances, and essential electronics.' },
      { title: 'Accommodation Assistance', desc: 'Guidance on securing on-campus housing or finding safe, affordable private rentals.' },
      { title: 'Health & Insurance', desc: 'Assistance in understanding and securing mandatory overseas student health coverage.' },
      { title: 'Cultural Briefings', desc: 'Insights into the local culture, academic etiquette, and social norms of your destination.' }
    ],
    howItWorks: [
      { step: '01', title: 'Housing Strategy', desc: 'We help you evaluate housing options immediately after visa approval.' },
      { step: '02', title: 'Pre-Departure Briefing', desc: 'An intensive session covering travel logistics, banking, and emergency contacts.' },
      { step: '03', title: 'Network Connection', desc: 'Connecting you with other students traveling to the same city or university.' },
      { step: '04', title: 'Final Checklist Review', desc: 'A final run-through of all original documents required at immigration.' }
    ],
    whoItsFor: 'Students with approved visas who are in the final stages of preparing for their international relocation.',
    faqs: [
      { q: 'Do you book flights?', a: 'While we do not act as travel agents, we advise on the best routes, student baggage allowances, and optimal times to book.' },
      { q: 'When should I start looking for accommodation?', a: 'We recommend starting the search as soon as you receive your unconditional offer, as student housing fills up rapidly.' },
      { q: 'What original documents must I carry?', a: 'During our briefing, we provide a definitive checklist including your passport, visa, CAS/I-20, financial proof, and academic transcripts.' }
    ],
    icon: Plane,
  },
  {
    slug: 'post-arrival-support',
    title: 'Post-Arrival Support',
    shortDescription: 'Settling-in help once you land — local registration to campus orientation.',
    subtitle: 'Seamless settling-in assistance for your crucial first weeks abroad.',
    about: 'Arriving in a foreign country can be a culture shock. We believe our responsibility doesn\'t end when you board your flight. Our Post-Arrival Support bridges the gap between landing at the airport and feeling at home, ensuring your first few weeks are focused on settling in and starting your classes comfortably.',
    whatWeProvide: [
      { title: 'Airport Transfers', desc: 'Coordination of safe and reliable transport from the airport to your accommodation.' },
      { title: 'Local Registration', desc: 'Guidance on registering with local police or municipal authorities, if required.' },
      { title: 'Banking & Mobile', desc: 'Assistance in setting up a local bank account and obtaining a local SIM card.' },
      { title: 'Campus Navigation', desc: 'Tips on participating in orientation week and utilizing university support services.' }
    ],
    howItWorks: [
      { step: '01', title: 'Arrival Confirmation', desc: 'We track your journey and confirm your safe arrival at your accommodation.' },
      { step: '02', title: 'Immediate Setup', desc: 'Step-by-step guides for acquiring local communication and banking essentials.' },
      { step: '03', title: 'Compliance Check', desc: 'Ensuring you complete all mandatory university enrollment and local registrations.' },
      { step: '04', title: 'Check-in Call', desc: 'A follow-up consultation after your first two weeks to ensure you are settling well.' }
    ],
    whoItsFor: 'Newly arrived international students facing the logistical challenges of establishing themselves in a brand new city and culture.',
    faqs: [
      { q: 'How do I open a bank account without a local address?', a: 'We guide you through specific student-friendly banks that accept university letters as proof of address.' },
      { q: 'Who do I contact in an emergency?', a: 'We provide a localized list of emergency contacts, embassy details, and university support hotlines before you travel.' },
      { q: 'Is this service available in all countries?', a: 'Yes, we provide standardized post-arrival guidance applicable to all major study destinations.' }
    ],
    icon: MapPin,
  },
  {
    slug: 'work-visa-assistance',
    title: 'Work Visa Assistance',
    shortDescription: 'Guidance on part-time work rights and post-study work visa pathways.',
    subtitle: 'Transitioning from international student to global professional.',
    about: 'Gaining international work experience is a primary goal for many students. Navigating the legalities of working abroad requires careful planning. We provide clarity on your part-time working rights during your studies and help you strategize your transition onto a post-study work visa after graduation.',
    whatWeProvide: [
      { title: 'Work Rights Briefing', desc: 'Clear guidelines on allowable part-time working hours and vacation work rights.' },
      { title: 'PSW Pathway Planning', desc: 'Detailed explanations of Post-Study Work (PSW) visa eligibility and timelines.' },
      { title: 'Application Support', desc: 'Assistance in gathering documents and filing for your graduate work route visa.' },
      { title: 'Sponsorship Advice', desc: 'Guidance on navigating employer sponsorships (e.g., H1-B, Tier 2) for long-term settlement.' }
    ],
    howItWorks: [
      { step: '01', title: 'Eligibility Assessment', desc: 'Reviewing your current student visa conditions and graduation timeline.' },
      { step: '02', title: 'Pathway Strategy', desc: 'Identifying the most suitable post-study work route for your specific degree and country.' },
      { step: '03', title: 'Document Preparation', desc: 'Ensuring you have the correct completion letters and financial evidence.' },
      { step: '04', title: 'Visa Filing', desc: 'Executing the application before your student visa expires.' }
    ],
    whoItsFor: 'Current international students nearing graduation who wish to extend their stay to gain international work experience.',
    faqs: [
      { q: 'Can I work full-time while studying?', a: 'Generally, no. Most countries restrict international students to 20 hours per week during term time, though full-time work is often permitted during official university holidays.' },
      { q: 'Do I need a job offer to get a post-study work visa?', a: 'It depends on the country. Destinations like the UK (Graduate Route) and Australia (485 visa) do not require a job offer, whereas the US (OPT) has specific employment requirements.' },
      { q: 'When should I apply for my post-study work visa?', a: 'You must typically apply after you have officially completed your course, but before your current student visa expires. Timing is critical.' }
    ],
    icon: Briefcase,
  },
  {
    slug: 'spouse-services',
    title: 'Spouse Services',
    shortDescription: 'Dependent visa support so your partner can join and settle with you.',
    subtitle: 'Keeping families together during your international education journey.',
    about: 'Pursuing higher education abroad shouldn\'t mean prolonged separation from your family. If you are married or in a recognized partnership, many countries allow your dependent to accompany you. We specialize in navigating the complex dependent visa process, ensuring your partner can join you with the right permissions.',
    whatWeProvide: [
      { title: 'Eligibility Checks', desc: 'Determining if your specific course and country permit dependent visas.' },
      { title: 'Relationship Evidence', desc: 'Guidance on compiling robust proof of a genuine and subsisting relationship.' },
      { title: 'Financial Strategy', desc: 'Calculating and demonstrating the additional funds required to sponsor a dependent.' },
      { title: 'Work Rights Advice', desc: 'Clarity on whether your spouse will be permitted to work full-time in the destination country.' }
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', desc: 'Reviewing your main applicant status and dependent eligibility.' },
      { step: '02', title: 'Evidence Gathering', desc: 'Compiling marriage certificates, financial proofs, and cohabitation evidence.' },
      { step: '03', title: 'Application Synchronization', desc: 'Filing the dependent visa either concurrently with your application or subsequently.' },
      { step: '04', title: 'Settlement Advice', desc: 'Providing guidance on housing and healthcare for couples.' }
    ],
    whoItsFor: 'Married students or those in recognized civil partnerships who are applying for Master\'s or PhD programs and wish to bring their partner abroad.',
    faqs: [
      { q: 'Can my spouse work full-time?', a: 'In many countries (like the UK, Canada, and Australia), spouses of Master\'s or PhD students are granted full working rights, but regulations change frequently. We provide the latest guidance.' },
      { q: 'Can we apply for our visas at the same time?', a: 'Yes, in most cases, concurrent applications are possible and often recommended to ensure you can travel together.' },
      { q: 'What if we are recently married?', a: 'Recent marriages require carefully prepared documentation to prove the genuineness of the relationship to immigration officers. We guide you through this sensitive process.' }
    ],
    icon: Heart,
  },
  {
    slug: 'appeals-legal-support',
    title: 'Appeals & Legal Support',
    shortDescription: 'Expert help if a visa is refused — appeals, reapplications, legal guidance.',
    subtitle: 'Turning setbacks into success with expert immigration advocacy.',
    about: 'Receiving a visa refusal is devastating, but it is rarely the end of the road. Refusals often happen due to minor technical errors, insufficient financial documentation, or misunderstood intent. Our Appeals & Legal Support team specializes in forensically analyzing refusal letters, rectifying the underlying issues, and mounting a strong case for reapplication or administrative review.',
    whatWeProvide: [
      { title: 'Refusal Analysis', desc: 'In-depth review of your refusal letter to identify the exact legal or factual grounds for rejection.' },
      { title: 'Strategy Formulation', desc: 'Determining whether an administrative review, appeal, or fresh reapplication is the best route.' },
      { title: 'Evidence Strengthening', desc: 'Identifying and sourcing the exact missing documents that led to the initial refusal.' },
      { title: 'Drafting Representations', desc: 'Preparing strong cover letters and legal representations to address the visa officer\'s previous concerns.' }
    ],
    howItWorks: [
      { step: '01', title: 'Case Review', desc: 'You provide us with your refusal letter and original application file for assessment.' },
      { step: '02', title: 'Viability Check', desc: 'We honestly assess the probability of overturning the decision before proceeding.' },
      { step: '03', title: 'Document Rectification', desc: 'We work closely with you to fix the flaws identified by the immigration officer.' },
      { step: '04', title: 'Submission', desc: 'We file the new application or appeal with robust supporting arguments.' }
    ],
    whoItsFor: 'Students who have applied for a visa (either independently or through another agency) and have received an official refusal letter.',
    faqs: [
      { q: 'Does a previous refusal mean I will never get a visa?', a: 'No. If the reasons for the previous refusal are adequately addressed in a new application (and no deception was involved), you can successfully obtain a visa.' },
      { q: 'Is it better to appeal or reapply?', a: 'Appeals can take months. If the refusal was due to a missing document or simple error, a fresh reapplication is usually faster and more effective. We will advise you on the best strategy.' },
      { q: 'Can you guarantee success after a refusal?', a: 'No professional can guarantee a visa approval, especially after a refusal. However, we guarantee that your new application will comprehensively address every concern raised by the immigration officer.' }
    ],
    icon: Scale,
  }
,
  {
    slug: 'accommodation-assistance',
    title: 'Accommodation Assistance',
    shortDescription: 'Securing safe, comfortable, and budget-friendly housing before you fly.',
    subtitle: 'Your home away from home, sorted before you even pack.',
    about: 'Finding the right place to live is crucial for a successful study abroad experience. Navigating foreign rental markets, understanding lease agreements, and avoiding scams can be stressful. We help you secure safe, convenient, and affordable student accommodation, whether on-campus or off-campus, giving you peace of mind before you travel.',
    whatWeProvide: [
      { title: 'Housing Options', desc: 'Curated lists of university dormitories, private student halls, and shared apartments.' },
      { title: 'Budget Planning', desc: 'Guidance on rent, utilities, deposits, and hidden costs to ensure housing fits your budget.' },
      { title: 'Lease Review', desc: 'Expert assistance in understanding tenancy agreements and your rights as a tenant.' },
      { title: 'Location Strategy', desc: 'Advice on neighborhoods balancing safety, proximity to campus, and access to public transport.' }
    ],
    howItWorks: [
      { step: '01', title: 'Needs Assessment', desc: 'We discuss your preferences regarding budget, room type, and distance to campus.' },
      { step: '02', title: 'Option Shortlisting', desc: 'Providing you with verified, trusted housing options that match your criteria.' },
      { step: '03', title: 'Booking Assistance', desc: 'Helping you navigate the application, deposit payment, and booking process.' },
      { step: '04', title: 'Move-in Prep', desc: 'Ensuring you know exactly what to expect on arrival day.' }
    ],
    whoItsFor: 'Any international student looking for secure housing arrangements prior to arriving in their destination country.',
    faqs: [
      { q: 'Should I live on-campus or off-campus?', a: 'On-campus is great for first-year students wanting community, while off-campus offers more independence. We help you weigh the pros and cons.' },
      { q: 'When should I book my accommodation?', a: 'As soon as your university offer is unconditional! Student housing fills up very quickly, especially in major cities.' },
      { q: 'Do you help with airport pickups?', a: 'Yes, as part of our broader pre-departure services, we can coordinate your transit from the airport directly to your new accommodation.' }
    ],
    icon: Home,
  },
  {
    slug: 'ielts',
    title: 'IELTS',
    shortDescription: 'Personalized IELTS guidance to help you achieve your target score.',
    subtitle: 'Achieve your target score with personalized guidance.',
    about: 'Our IELTS preparation program provides personalized coaching to help you master all four sections of the test: Reading, Writing, Listening, and Speaking.',
    whatWeProvide: [
      { title: 'Mock Tests', desc: 'Full-length practice tests to simulate the real exam environment.' },
      { title: 'Personalized Feedback', desc: 'Detailed analysis of your performance to identify areas for improvement.' },
      { title: 'Speaking Practice', desc: 'One-on-one speaking sessions to boost your fluency and confidence.' },
      { title: 'Writing Reviews', desc: 'Expert feedback on your writing tasks to enhance coherence and vocabulary.' }
    ],
    howItWorks: [
      { step: '01', title: 'Diagnostic Test', desc: 'Assess your current English proficiency level.' },
      { step: '02', title: 'Study Plan', desc: 'Create a customized study schedule based on your target score.' },
      { step: '03', title: 'Intensive Coaching', desc: 'Focus on specific skills and strategies for each test section.' },
      { step: '04', title: 'Final Review', desc: 'Complete full mock exams before test day.' }
    ],
    whoItsFor: 'Students planning to study in English-speaking countries who need to demonstrate their English proficiency.',
    faqs: [
      { q: 'How long does the IELTS preparation course take?', a: 'The duration depends on your current proficiency and target score, typically ranging from 4 to 8 weeks.' },
      { q: 'Do you provide study materials?', a: 'Yes, we provide comprehensive study guides, practice tests, and access to online resources.' },
      { q: 'Can I take the classes online?', a: 'Yes, we offer both in-person and online coaching options.' }
    ],
    icon: BookOpen,
  }
];

export default services;
