/* ==========================================================================
   OBEYBOTS — Application Orchestrator & Logic Engine
   MattyJacks Ecosystem AI Skills Interviewer
   ========================================================================== */

// --- Global Application State ---
const interviewState = {
    currentIndex: 0,
    answers: {},
    selectedDomains: [],
    calculatedSkills: {},
    roleMatches: [],
    serviceMatches: [],
    overallScore: 0,
    isCompleted: false,
    updatedAt: null
};

// --- Complete Question Database & Adaptive Taxonomy ---
const baseQuestions = [
    // --- STAGE 1: BASIC INFORMATION ---
    {
        id: "name",
        stage: "Basic Information",
        title: "What is your full name?",
        description: "Please enter your full legal or professional name as it appears on your portfolio.",
        type: "text",
        placeholder: "e.g., Alex Vance",
        required: true
    },
    {
        id: "preferredName",
        stage: "Basic Information",
        title: "What is your preferred name?",
        description: "How would you like clients and team members to address you?",
        type: "text",
        placeholder: "e.g., Alex",
        required: false
    },
    {
        id: "location",
        stage: "Basic Information",
        title: "Where are you located?",
        description: "City and Country for work authorization and client match alignment.",
        type: "text",
        placeholder: "e.g., Toronto, Canada or Dhaka, Bangladesh",
        required: true
    },
    {
        id: "timezone",
        stage: "Basic Information",
        title: "What is your primary timezone?",
        description: "Used to determine overlap with client teams across North America & Europe.",
        type: "select",
        options: [
            "UTC-8 (PST / Pacific Time)",
            "UTC-5 (EST / Eastern Time)",
            "UTC+0 (GMT / London)",
            "UTC+1 (CET / Berlin)",
            "UTC+5:30 (IST / India)",
            "UTC+6 (BST / Bangladesh)",
            "UTC+8 (SGT / Singapore)",
            "UTC+10 (AEST / Sydney)"
        ],
        required: true
    },
    {
        id: "email",
        stage: "Basic Information",
        title: "What is your primary email address?",
        description: "Used to associate your worker profile in the MattyJacks talent directory.",
        type: "text",
        placeholder: "alex@example.com",
        required: true
    },
    {
        id: "yearsExperience",
        stage: "Basic Information",
        title: "How many years of professional experience do you have?",
        description: "Total years working in digital services, tech, or freelancing.",
        type: "select",
        options: [
            "Less than 1 year (Beginner / Entry Level)",
            "1 – 2 years (Junior / Associate)",
            "3 – 5 years (Intermediate / Mid-level)",
            "5 – 8 years (Senior Specialist)",
            "8+ years (Lead / Veteran)"
        ],
        required: true
    },
    {
        id: "currentRole",
        stage: "Basic Information",
        title: "What is your current or most recent job title?",
        description: "Your primary professional designation.",
        type: "text",
        placeholder: "e.g., Frontend Web Developer or Virtual Assistant",
        required: true
    },
    {
        id: "portfolioLinks",
        stage: "Basic Information",
        title: "Share your professional links & portfolio",
        description: "Provide URLs for Upwork, LinkedIn, GitHub, or personal portfolio site.",
        type: "multi-input",
        fields: [
            { id: "upwork", label: "Upwork Profile URL", placeholder: "https://upwork.com/freelancers/..." },
            { id: "linkedin", label: "LinkedIn Profile URL", placeholder: "https://linkedin.com/in/..." },
            { id: "github", label: "GitHub Profile URL", placeholder: "https://github.com/..." },
            { id: "portfolio", label: "Portfolio / Website URL", placeholder: "https://myportfolio.com" }
        ],
        required: false
    },

    // --- STAGE 2: DOMAIN FOCUS SELECTION (Adaptive Trigger) ---
    {
        id: "domainFocus",
        stage: "Focus Areas",
        title: "Which core service areas are you skilled in?",
        description: "Select all domains where you have active hands-on experience. ObeyBots will adapt follow-up questions based on your selection.",
        type: "multi-card",
        options: [
            { id: "webdev", label: "Web Development", icon: "🌐", desc: "HTML, CSS, JS, React, Frontend" },
            { id: "shopify", label: "Shopify & E-Commerce", icon: "🛍️", desc: "Liquid, Store Setup, Theme Customization" },
            { id: "ai", label: "AI & Prompt Engineering", icon: "🤖", desc: "ChatGPT, Claude, Gemini, AI Coding, Automations" },
            { id: "research", label: "Research & Data Entry", icon: "📊", desc: "Web Research, Lead Gen, Excel, Google Sheets" },
            { id: "marketing", label: "Digital Marketing", icon: "📈", desc: "SEO, Social Media, Paid Ads, Cold Outreach" },
            { id: "creative", label: "Creative & Design", icon: "🎨", desc: "Canva, Figma, Photoshop, Video Editing" },
            { id: "operations", label: "Operations & Support", icon: "🎧", desc: "Virtual Assistance, Customer Support, Admin" }
        ],
        required: true
    },

    // --- STAGE 3: EXPERIENCE & TRACK RECORD ---
    {
        id: "trackRecord",
        stage: "Experience",
        title: "Describe your past projects & responsibilities",
        description: "What major problems have you solved for clients or previous employers?",
        type: "textarea",
        placeholder: "Briefly mention 2-3 key achievements, client projects, or responsibilities...",
        required: true
    },
    {
        id: "dailyTools",
        stage: "Experience",
        title: "What tools & software do you use daily?",
        description: "List software, IDEs, platforms, or apps you master.",
        type: "text",
        placeholder: "e.g., VS Code, Shopify Admin, ChatGPT, Figma, Notion, Slack",
        required: true
    }
];

// --- ADAPTIVE DOMAIN SKILL EVALUATION CARDS ---
const domainSkillQuestions = {
    webdev: {
        id: "skills_webdev",
        domainKey: "webdev",
        stage: "Web Dev Deep-Dive",
        title: "Rate your Web Development capabilities",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "html", name: "HTML5 & Semantic Markup", desc: "Clean DOM structure & accessibility" },
            { id: "css", name: "CSS3 / Flexbox / Grid", desc: "Responsive layouts & custom styling" },
            { id: "js", name: "Vanilla JavaScript (ES6+)", desc: "DOM manipulation, async, logic" },
            { id: "react", name: "React / Modern Frameworks", desc: "Components, hooks, state management" },
            { id: "responsive", name: "Responsive Mobile-First Design", desc: "Cross-device layout optimization" }
        ]
    },
    shopify: {
        id: "skills_shopify",
        domainKey: "shopify",
        stage: "Shopify Deep-Dive",
        title: "Rate your Shopify & E-commerce skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "shopify_admin", name: "Shopify Admin & Product Management", desc: "Catalog setup, collections, settings" },
            { id: "liquid", name: "Shopify Liquid Templating", desc: "Custom theme code, snippets & schemas" },
            { id: "theme_custom", name: "Theme Customization & Section Build", desc: "Modifying OS 2.0 themes" },
            { id: "ecommerce_strategy", name: "E-commerce Store Setup & Apps", desc: "Payment gateways, app integration" }
        ]
    },
    ai: {
        id: "skills_ai",
        domainKey: "ai",
        stage: "AI Deep-Dive",
        title: "Rate your AI & Prompt Engineering skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "prompt_eng", name: "Prompt Engineering", desc: "Structured system prompts & chain of thought" },
            { id: "ai_coding", name: "AI-Assisted Coding", desc: "Using AI assistants for rapid web development" },
            { id: "ai_content", name: "AI Content & Copywriting", desc: "Generating high-converting text & blogs" },
            { id: "ai_tools", name: "LLM Mastery (ChatGPT / Claude / Gemini)", desc: "Deep knowledge of model capabilities" }
        ]
    },
    research: {
        id: "skills_research",
        domainKey: "research",
        stage: "Research & Data Deep-Dive",
        title: "Rate your Research & Data skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "web_research", name: "Web Research & Verification", desc: "Deep searching & data sourcing" },
            { id: "lead_research", name: "Lead Research & Prospecting", desc: "Finding business contacts & emails" },
            { id: "data_entry", name: "Data Entry & Spreadsheet Mastery", desc: "Excel & Google Sheets formulas/formatting" }
        ]
    },
    marketing: {
        id: "skills_marketing",
        domainKey: "marketing",
        stage: "Marketing Deep-Dive",
        title: "Rate your Digital Marketing skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "seo", name: "Search Engine Optimization (SEO)", desc: "On-page SEO & keyword optimization" },
            { id: "social_media", name: "Social Media Management", desc: "Scheduling, engagement, strategy" },
            { id: "lead_gen", name: "Lead Generation & Cold Email", desc: "Outreach campaigns & pipelines" }
        ]
    },
    creative: {
        id: "skills_creative",
        domainKey: "creative",
        stage: "Creative & Design Deep-Dive",
        title: "Rate your Graphic Design & Creative skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "graphic_design", name: "Graphic Design Fundamentals", desc: "Layout, typography, color theory" },
            { id: "canva_figma", name: "Canva & Figma Design", desc: "Creating banners, UI & social assets" },
            { id: "copywriting", name: "Copywriting & Content Creation", desc: "Writing persuasive marketing copy" }
        ]
    },
    operations: {
        id: "skills_operations",
        domainKey: "operations",
        stage: "Operations Deep-Dive",
        title: "Rate your Virtual Assistance & Operations skills",
        description: "Rate your proficiency on a scale of 1 (Beginner) to 5 (Expert).",
        type: "skill-rating",
        skills: [
            { id: "virtual_assistance", name: "Virtual Assistance & Admin Support", desc: "Email management, scheduling, organization" },
            { id: "customer_support", name: "Customer Support & Communication", desc: "Ticket handling, live chat, client care" },
            { id: "project_coord", name: "Project Coordination", desc: "Managing task boards, deadlines & workflows" }
        ]
    }
};

// Final Work Preference Question
const finalPreferenceQuestion = {
    id: "workStyle",
    stage: "Work Style",
    title: "What is your preferred work style & availability?",
    description: "Helps match you with suitable project structures in the MattyJacks ecosystem.",
    type: "select",
    options: [
        "Full-Time Direct Contribution (40 hrs/week)",
        "Part-Time Dedicated Project (20 hrs/week)",
        "Flexible Hourly / Freelance Gig Basis",
        "Autonomous Task Execution (Asynchronous)"
    ],
    required: true
};

// --- Dynamic Active Questions Resolver ---
function getActiveQuestions() {
    const list = [...baseQuestions];
    
    // Check selected domains from answers
    const domains = interviewState.answers["domainFocus"] || [];
    
    // Inject active domain skill rating cards dynamically
    domains.forEach(dKey => {
        if (domainSkillQuestions[dKey]) {
            list.push(domainSkillQuestions[dKey]);
        }
    });

    // Append final preference question
    list.push(finalPreferenceQuestion);
    return list;
}

// --- DOM Navigation & View Switching ---
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetSection = document.getElementById(`${viewId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const navBtn = document.querySelector(`.nav-btn[data-target="${viewId}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Start & Resume Interview Flow ---
function startInterview() {
    switchView('interview');
    if (!interviewState.answers || Object.keys(interviewState.answers).length === 0) {
        interviewState.currentIndex = 0;
    }
    renderQuestion();
}

function resumeInterview() {
    loadSavedProgress();
    switchView('interview');
    renderQuestion();
}

// --- Render Active Question ---
function renderQuestion() {
    const questions = getActiveQuestions();
    
    // Safety check index bounds
    if (interviewState.currentIndex >= questions.length) {
        finishInterview();
        return;
    }
    if (interviewState.currentIndex < 0) {
        interviewState.currentIndex = 0;
    }

    const q = questions[interviewState.currentIndex];
    
    // Update Header Metadata & Progress Bar
    document.getElementById('stage-badge').innerText = `Category: ${q.stage}`;
    document.getElementById('question-counter').innerText = `Question ${interviewState.currentIndex + 1} of ${questions.length}`;
    
    const progressPct = Math.round(((interviewState.currentIndex) / questions.length) * 100);
    document.getElementById('progress-bar').style.width = `${progressPct}%`;
    document.getElementById('progress-text').innerText = `${progressPct}% Complete`;

    // Render Question Body HTML
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <h2 class="q-title">${q.title}</h2>
        <p class="q-description">${q.description}</p>
        <div class="q-input-area">${renderInputControl(q)}</div>
    `;

    // Update Navigation Buttons State
    document.getElementById('btn-back').disabled = (interviewState.currentIndex === 0);
    
    // Check if resume button on hero should show
    updateResumeButtonVisibility();
}

// --- Render Specific Field Types ---
function renderInputControl(q) {
    const currentVal = interviewState.answers[q.id];

    switch (q.type) {
        case "text":
            return `
                <div class="form-group">
                    <input type="text" id="input-${q.id}" class="form-input" 
                           placeholder="${q.placeholder || ''}" 
                           value="${currentVal || ''}" 
                           oninput="onInputChange('${q.id}', this.value)">
                </div>
            `;

        case "textarea":
            return `
                <div class="form-group">
                    <textarea id="input-${q.id}" class="form-textarea" 
                              placeholder="${q.placeholder || ''}" 
                              oninput="onInputChange('${q.id}', this.value)">${currentVal || ''}</textarea>
                </div>
            `;

        case "select":
            const optionsHTML = q.options.map(opt => `
                <option value="${opt}" ${currentVal === opt ? 'selected' : ''}>${opt}</option>
            `).join('');
            return `
                <div class="form-group">
                    <select id="input-${q.id}" class="form-select" onchange="onInputChange('${q.id}', this.value)">
                        <option value="" disabled ${!currentVal ? 'selected' : ''}>-- Select an option --</option>
                        ${optionsHTML}
                    </select>
                </div>
            `;

        case "multi-input":
            const savedMulti = currentVal || {};
            return q.fields.map(f => `
                <div class="form-group">
                    <label class="form-label">${f.label}</label>
                    <input type="text" class="form-input" placeholder="${f.placeholder}" 
                           value="${savedMulti[f.id] || ''}" 
                           oninput="onMultiInputChange('${q.id}', '${f.id}', this.value)">
                </div>
            `).join('');

        case "multi-card":
            const selectedList = currentVal || [];
            return `
                <div class="card-options-grid">
                    ${q.options.map(opt => {
                        const isChecked = selectedList.includes(opt.id);
                        return `
                            <div class="option-card ${isChecked ? 'selected' : ''}" onclick="toggleCardOption('${q.id}', '${opt.id}')">
                                <input type="checkbox" id="chk-${opt.id}" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation()">
                                <div>
                                    <div class="option-label">${opt.icon} ${opt.label}</div>
                                    <div class="skill-desc">${opt.desc}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

        case "skill-rating":
            const savedRatings = currentVal || {};
            return `
                <div class="skill-rating-rows">
                    ${q.skills.map(skill => {
                        const score = savedRatings[skill.id] || 0;
                        return `
                            <div class="skill-rating-item">
                                <div class="skill-item-header">
                                    <div>
                                        <div class="skill-name">${skill.name}</div>
                                        <div class="skill-desc">${skill.desc}</div>
                                    </div>
                                    <div class="badge-accent">${score > 0 ? `Rating: ${score}/5` : 'Unrated'}</div>
                                </div>
                                <div class="rating-buttons-group">
                                    ${[1, 2, 3, 4, 5].map(val => `
                                        <button class="rating-btn ${score === val ? 'active' : ''}" 
                                                onclick="setSkillRating('${q.id}', '${skill.id}', ${val})">
                                            ${val} — ${val === 1 ? 'Beginner' : val === 2 ? 'Basic' : val === 3 ? 'Mid' : val === 4 ? 'Adv' : 'Expert'}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

        default:
            return '';
    }
}

// --- Input Event Handlers ---
function onInputChange(qId, val) {
    interviewState.answers[qId] = val;
    autoSaveState();
}

function onMultiInputChange(qId, fieldId, val) {
    if (!interviewState.answers[qId]) {
        interviewState.answers[qId] = {};
    }
    interviewState.answers[qId][fieldId] = val;
    autoSaveState();
}

function toggleCardOption(qId, optionId) {
    let current = interviewState.answers[qId] || [];
    if (current.includes(optionId)) {
        current = current.filter(item => item !== optionId);
    } else {
        current.push(optionId);
    }
    interviewState.answers[qId] = current;
    autoSaveState();
    renderQuestion(); // Re-render to reflect checked visual state
}

function setSkillRating(qId, skillId, ratingVal) {
    if (!interviewState.answers[qId]) {
        interviewState.answers[qId] = {};
    }
    interviewState.answers[qId][skillId] = ratingVal;
    autoSaveState();
    renderQuestion();
}

// --- Navigation Actions ---
function nextQuestion() {
    const questions = getActiveQuestions();
    const currentQ = questions[interviewState.currentIndex];

    // Simple validation for required fields
    if (currentQ.required) {
        const val = interviewState.answers[currentQ.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'object' && Object.keys(val).length === 0 && currentQ.type !== 'multi-input')) {
            showToast("Please provide an answer before continuing.");
            return;
        }
    }

    interviewState.currentIndex++;
    
    if (interviewState.currentIndex >= questions.length) {
        finishInterview();
    } else {
        renderQuestion();
    }
}

function previousQuestion() {
    if (interviewState.currentIndex > 0) {
        interviewState.currentIndex--;
        renderQuestion();
    }
}

function saveProgress() {
    autoSaveState();
    showToast("Progress saved to browser localStorage!");
}

function exitInterview() {
    switchView('landing');
}

function finishInterview() {
    interviewState.isCompleted = true;
    interviewState.updatedAt = new Date().toISOString();
    
    calculateSkills();
    calculateRoleMatches();
    calculateServiceMatches();
    generateProfileUI();
    generateLiquid();
    
    autoSaveState();
    switchView('results');
    showToast("Interview finished! Your AI profile and role matches are ready.");
}

// --- SKILL SCORING & WEIGHTED MATRIX ---
function calculateSkills() {
    const questions = getActiveQuestions();
    const rawSkills = {};

    // Collect ratings from skill-rating questions
    questions.forEach(q => {
        if (q.type === 'skill-rating' && interviewState.answers[q.id]) {
            const ratings = interviewState.answers[q.id];
            q.skills.forEach(s => {
                if (ratings[s.id]) {
                    rawSkills[s.id] = {
                        id: s.id,
                        name: s.name,
                        rating: ratings[s.id]
                    };
                }
            });
        }
    });

    // Apply Experience Modifier
    const expAnswer = interviewState.answers['yearsExperience'] || '';
    let expWeight = 1.0;
    if (expAnswer.includes("1 – 2")) expWeight = 1.05;
    if (expAnswer.includes("3 – 5")) expWeight = 1.15;
    if (expAnswer.includes("5 – 8")) expWeight = 1.25;
    if (expAnswer.includes("8+")) expWeight = 1.35;

    const finalSkills = [];
    Object.values(rawSkills).forEach(s => {
        // Calculated Score (Normalized 0 to 100%)
        const calculatedScore = Math.min(100, Math.round((s.rating / 5) * 75 * expWeight));
        finalSkills.push({
            id: s.id,
            name: s.name,
            selfRating: s.rating,
            scorePct: calculatedScore
        });
    });

    // Sort by calculated score descending
    finalSkills.sort((a, b) => b.scorePct - a.scorePct);

    const primary = finalSkills.filter(s => s.scorePct >= 65);
    const secondary = finalSkills.filter(s => s.scorePct < 65);

    interviewState.calculatedSkills = {
        all: finalSkills,
        primary: primary,
        secondary: secondary
    };
}

// --- DETERMINISTIC ROLE MATCHING ENGINE (15 Roles) ---
const roleTaxonomy = [
    {
        title: "Frontend Developer",
        requiredSkills: ["html", "css", "js", "react", "responsive"],
        domain: "webdev",
        reasonTemplate: "Strong proficiency in HTML, CSS, JavaScript and responsive layout engineering."
    },
    {
        title: "Website Developer",
        requiredSkills: ["html", "css", "js", "responsive"],
        domain: "webdev",
        reasonTemplate: "Demonstrates core web design and client-side site construction skills."
    },
    {
        title: "Shopify Developer",
        requiredSkills: ["liquid", "shopify_admin", "theme_custom", "html", "css"],
        domain: "shopify",
        reasonTemplate: "Direct experience with Shopify Liquid templates and storefront customization."
    },
    {
        title: "AI Workflow Specialist",
        requiredSkills: ["prompt_eng", "ai_coding", "ai_tools"],
        domain: "ai",
        reasonTemplate: "Capable of building automated AI prompts and integrating LLM workflows."
    },
    {
        title: "AI Prompt Specialist",
        requiredSkills: ["prompt_eng", "ai_content", "ai_tools"],
        domain: "ai",
        reasonTemplate: "Exhibits structured system prompt design and LLM response optimization."
    },
    {
        title: "Research Specialist",
        requiredSkills: ["web_research", "data_entry"],
        domain: "research",
        reasonTemplate: "Proficient in web data extraction, verification, and research synthesis."
    },
    {
        title: "Lead Generation Specialist",
        requiredSkills: ["lead_research", "lead_gen", "web_research"],
        domain: "research",
        reasonTemplate: "High accuracy in prospect sourcing, contact discovery, and pipeline building."
    },
    {
        title: "Social Media Specialist",
        requiredSkills: ["social_media", "canva_figma", "copywriting"],
        domain: "marketing",
        reasonTemplate: "Combines social content creation, scheduling, and visual graphics."
    },
    {
        title: "Graphic Designer",
        requiredSkills: ["graphic_design", "canva_figma"],
        domain: "creative",
        reasonTemplate: "Strong graphic design principles and design software mastery."
    },
    {
        title: "Content Creator",
        requiredSkills: ["copywriting", "ai_content", "canva_figma"],
        domain: "creative",
        reasonTemplate: "Skilled in producing high-engagement copy and brand content assets."
    },
    {
        title: "Virtual Assistant",
        requiredSkills: ["virtual_assistance", "data_entry", "web_research"],
        domain: "operations",
        reasonTemplate: "Reliable administrative support, calendar management, and organization."
    },
    {
        title: "Customer Support Specialist",
        requiredSkills: ["customer_support", "virtual_assistance"],
        domain: "operations",
        reasonTemplate: "Excellent client communication, inquiry resolution, and ticket care."
    },
    {
        title: "Data Entry Specialist",
        requiredSkills: ["data_entry", "web_research"],
        domain: "research",
        reasonTemplate: "Speed and precision in spreadsheet formatting and dataset compilation."
    },
    {
        title: "Digital Marketing Specialist",
        requiredSkills: ["seo", "lead_gen", "social_media"],
        domain: "marketing",
        reasonTemplate: "Holistic marketing execution across SEO, social channels, and leads."
    },
    {
        title: "Administrative Assistant",
        requiredSkills: ["virtual_assistance", "project_coord", "data_entry"],
        domain: "operations",
        reasonTemplate: "Solid project coordination, document preparation, and team ops."
    }
];

function calculateRoleMatches() {
    const userDomains = interviewState.answers['domainFocus'] || [];
    const skillsList = interviewState.calculatedSkills.all || [];

    const skillScoreMap = {};
    skillsList.forEach(s => {
        skillScoreMap[s.id] = s.scorePct;
    });

    const matches = [];

    roleTaxonomy.forEach(role => {
        let totalSkillScore = 0;
        let matchedCount = 0;

        role.requiredSkills.forEach(sId => {
            if (skillScoreMap[sId]) {
                totalSkillScore += skillScoreMap[sId];
                matchedCount++;
            }
        });

        // Domain affinity bonus
        const domainBonus = userDomains.includes(role.domain) ? 15 : 0;
        
        let matchPct = 0;
        if (role.requiredSkills.length > 0) {
            const baseAvg = (totalSkillScore / (role.requiredSkills.length * 100)) * 85;
            matchPct = Math.min(98, Math.round(baseAvg + domainBonus));
        }

        // Only include reasonable matches (> 35%)
        if (matchPct >= 35) {
            let tier = "Good Match";
            if (matchPct >= 85) tier = "Excellent Match";
            else if (matchPct >= 65) tier = "Strong Match";

            matches.push({
                title: role.title,
                matchPct: matchPct,
                tier: tier,
                reason: `${role.reasonTemplate} Match calculated strictly from verified answers.`
            });
        }
    });

    matches.sort((a, b) => b.matchPct - a.matchPct);
    interviewState.roleMatches = matches;

    // Calculate Overall Candidate Score
    if (matches.length > 0) {
        const top3Avg = matches.slice(0, 3).reduce((acc, m) => acc + m.matchPct, 0) / Math.min(3, matches.length);
        interviewState.overallScore = Math.round(top3Avg);
    } else {
        interviewState.overallScore = 50;
    }
}

// --- ACTIONABLE SERVICE RECOMMENDATION ENGINE ---
function calculateServiceMatches() {
    const skills = interviewState.calculatedSkills.all || [];
    const skillIds = skills.map(s => s.id);
    const services = [];

    if (skillIds.includes('html') || skillIds.includes('css')) {
        services.push("Landing Page Development & UI Design");
    }
    if (skillIds.includes('js') || skillIds.includes('react')) {
        services.push("Interactive Web Application Build");
    }
    if (skillIds.includes('liquid') || skillIds.includes('shopify_admin')) {
        services.push("Shopify Store Setup & Liquid Customization");
        services.push("Shopify Product Catalog Migration");
    }
    if (skillIds.includes('prompt_eng') || skillIds.includes('ai_coding')) {
        services.push("AI Workflow Setup & Custom Prompting");
        services.push("AI-Assisted Web Code Generation");
    }
    if (skillIds.includes('lead_research') || skillIds.includes('web_research')) {
        services.push("B2B Prospect Lead Research & Data Mining");
    }
    if (skillIds.includes('data_entry')) {
        services.push("Spreadsheet Cleaning & Data Entry");
    }
    if (skillIds.includes('canva_figma') || skillIds.includes('graphic_design')) {
        services.push("Social Media Graphics & Banner Design");
    }
    if (skillIds.includes('virtual_assistance') || skillIds.includes('customer_support')) {
        services.push("Virtual Assistance & Client Support Operations");
    }

    if (services.length === 0) {
        services.push("General Digital Project Support");
    }

    interviewState.serviceMatches = services;
}

// --- RESULTS DASHBOARD UI GENERATOR ---
function generateProfileUI() {
    const name = interviewState.answers['name'] || "Candidate";
    const headline = interviewState.answers['currentRole'] || "Digital Specialist";
    const location = interviewState.answers['location'] || "Remote";
    const timezone = interviewState.answers['timezone'] || "Flexible Timezone";
    const experience = interviewState.answers['yearsExperience'] || "1+ Years";
    const trackRecord = interviewState.answers['trackRecord'] || "No track record provided.";
    const dailyTools = interviewState.answers['dailyTools'] || "Standard software suite";

    // Candidate Header
    document.getElementById('res-candidate-name').innerText = name;
    document.getElementById('res-headline').innerText = headline;
    document.getElementById('res-location-tag').innerText = `📍 ${location}`;
    document.getElementById('res-timezone-tag').innerText = `🕒 ${timezone}`;
    document.getElementById('res-experience-tag').innerText = `💼 ${experience}`;
    
    // Avatar Initials
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || "OB";
    document.getElementById('res-avatar-initials').innerText = initials;

    // Overall Score & Tier
    const overall = interviewState.overallScore || 0;
    document.getElementById('res-overall-score').innerText = `${overall}%`;
    
    let tierText = "Developing Talent";
    if (overall >= 85) tierText = "Top Tier Contributor";
    else if (overall >= 70) tierText = "Strong Specialist";
    else if (overall >= 55) tierText = "Qualified Contributor";
    document.getElementById('res-tier-badge').innerText = tierText;

    // Executive Summary
    const summary = `${name} is a ${headline} based in ${location} with ${experience} of experience. Daily tools include ${dailyTools}. Verified track record: "${trackRecord}"`;
    document.getElementById('res-summary').innerText = summary;

    // Primary & Secondary Skills List
    const primarySkills = interviewState.calculatedSkills.primary || [];
    const secondarySkills = interviewState.calculatedSkills.secondary || [];

    document.getElementById('res-primary-badge').innerText = `Primary: ${primarySkills.length} Verified`;

    document.getElementById('res-primary-skills-list').innerHTML = primarySkills.length > 0 
        ? primarySkills.map(s => renderSkillMeterRow(s)).join('')
        : '<p class="text-muted">No primary skills scored above threshold.</p>';

    document.getElementById('res-secondary-skills-list').innerHTML = secondarySkills.length > 0
        ? secondarySkills.map(s => renderSkillMeterRow(s)).join('')
        : '<p class="text-muted">No secondary skills listed.</p>';

    // Strengths & Development Areas
    const strengths = primarySkills.slice(0, 3).map(s => `High proficiency in ${s.name} (${s.scorePct}% score)`);
    if (strengths.length === 0) strengths.push("Strong adaptability across general digital tasks");

    const development = secondarySkills.slice(0, 3).map(s => `Opportunity to enhance ${s.name}`);
    if (development.length === 0) development.push("Maintain continuous learning on emerging AI tools");

    document.getElementById('res-strengths-list').innerHTML = strengths.map(s => `<li>${s}</li>`).join('');
    document.getElementById('res-development-list').innerHTML = development.map(d => `<li>${d}</li>`).join('');

    // Workstyle
    const workstyle = interviewState.answers['workStyle'] || "Flexible work arrangement";
    document.getElementById('res-workstyle').innerText = `Preferred engagement: ${workstyle}. Demonstrates self-direction and tool proficiency.`;

    // Role Matches Render
    const roles = interviewState.roleMatches || [];
    document.getElementById('res-roles-list').innerHTML = roles.map(r => `
        <div class="role-card">
            <div class="role-card-top">
                <span class="role-title">${r.title}</span>
                <span class="role-match-badge">${r.matchPct}% Match</span>
            </div>
            <span class="role-tier-tag ${r.tier === 'Excellent Match' ? 'tier-excellent' : r.tier === 'Strong Match' ? 'tier-strong' : 'tier-good'}">${r.tier}</span>
            <p class="role-reason">${r.reason}</p>
        </div>
    `).join('');

    // Services Render
    const services = interviewState.serviceMatches || [];
    document.getElementById('res-services-list').innerHTML = services.map(s => `
        <div class="service-card">
            <div class="service-title">✓ ${s}</div>
        </div>
    `).join('');
}

function renderSkillMeterRow(s) {
    return `
        <div class="skill-row">
            <div class="skill-row-top">
                <span>${s.name}</span>
                <span class="text-success">${s.scorePct}% Score</span>
            </div>
            <div class="skill-meter-bg">
                <div class="skill-meter-fill" style="width: ${s.scorePct}%;"></div>
            </div>
        </div>
    `;
}

// --- SHOPIFY LIQUID SECTION CODE GENERATOR ---
function generateLiquid() {
    const name = interviewState.answers['name'] || "Candidate Name";
    const headline = interviewState.answers['currentRole'] || "Digital Specialist";
    const location = interviewState.answers['location'] || "Remote";
    const summary = document.getElementById('res-summary') ? document.getElementById('res-summary').innerText : "Worker profile summary.";
    const topSkills = (interviewState.calculatedSkills.primary || []).map(s => s.name).join(', ') || "Web Development, AI Solutions";

    const liquidCode = `{% comment %}
  ObeyBots Worker Profile Section — MattyJacks Ecosystem
  Generated automatically from structured interview data
{% endcomment %}

<section class="obeybots-worker-profile-section" id="ObeyBotsProfile-{{ section.id }}">
  <div class="obeybots-profile-card">
    <div class="obeybots-header">
      <div class="obeybots-avatar">
        <span>{{ section.settings.candidate_name | slice: 0, 2 | upcase }}</span>
      </div>
      <div class="obeybots-title-group">
        <h2 class="obeybots-name">{{ section.settings.candidate_name | default: "${name}" }}</h2>
        <p class="obeybots-headline">{{ section.settings.candidate_headline | default: "${headline}" }}</p>
        <span class="obeybots-location">📍 {{ section.settings.candidate_location | default: "${location}" }}</span>
      </div>
    </div>
    
    <div class="obeybots-body">
      <h4>Executive Summary</h4>
      <p class="obeybots-summary">{{ section.settings.candidate_bio | default: "${summary}" }}</p>

      <h4>Core Verified Skillsets</h4>
      <div class="obeybots-skills-pills">
        {% assign skills_list = section.settings.candidate_skills | split: "," %}
        {% for skill in skills_list %}
          <span class="obeybots-skill-pill">{{ skill | strip }}</span>
        {% endfor %}
      </div>
    </div>

    <div class="obeybots-footer">
      <a href="{{ section.settings.cta_link | default: "https://mattyjacks.com/upwork" }}" class="obeybots-cta-btn">
        {{ section.settings.cta_label | default: "Hire Candidate via MattyJacks" }}
      </a>
    </div>
  </div>
</section>

<style>
  .obeybots-worker-profile-section {
    padding: 2.5rem 1rem;
    background: #090d16;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .obeybots-profile-card {
    max-width: 720px;
    margin: 0 auto;
    background: #182238;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
  }
  .obeybots-header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .obeybots-avatar {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #06b6d4, #6366f1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.4rem;
    color: #090d16;
  }
  .obeybots-name { margin: 0; font-size: 1.5rem; color: #ffffff; }
  .obeybots-headline { margin: 0.2rem 0; color: #06b6d4; font-weight: 600; }
  .obeybots-location { font-size: 0.85rem; color: #94a3b8; }
  .obeybots-body h4 { font-size: 0.95rem; color: #94a3b8; margin-top: 1rem; margin-bottom: 0.4rem; }
  .obeybots-summary { font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; }
  .obeybots-skills-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .obeybots-skill-pill { background: rgba(6, 182, 212, 0.12); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.25); padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.85rem; }
  .obeybots-footer { margin-top: 2rem; text-align: right; }
  .obeybots-cta-btn { display: inline-block; background: #06b6d4; color: #090d16; font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; }
</style>

{% schema %}
{
  "name": "ObeyBots Worker Profile",
  "settings": [
    { "type": "text", "id": "candidate_name", "label": "Candidate Name", "default": "${name}" },
    { "type": "text", "id": "candidate_headline", "label": "Headline", "default": "${headline}" },
    { "type": "text", "id": "candidate_location", "label": "Location", "default": "${location}" },
    { "type": "textarea", "id": "candidate_bio", "label": "Executive Bio", "default": "${summary}" },
    { "type": "text", "id": "candidate_skills", "label": "Skills (Comma separated)", "default": "${topSkills}" },
    { "type": "url", "id": "cta_link", "label": "Hire CTA Link" },
    { "type": "text", "id": "cta_label", "label": "CTA Button Label", "default": "Work with Candidate" }
  ],
  "presets": [
    { "name": "ObeyBots Worker Profile" }
  ]
}
{% endschema %}`;

    document.getElementById('liquid-code-display').innerText = liquidCode;
}

function copyLiquid() {
    const code = document.getElementById('liquid-code-display').innerText;
    navigator.clipboard.writeText(code).then(() => {
        showToast("Shopify Liquid code copied to clipboard!");
    }).catch(err => {
        showToast("Failed to copy liquid code.");
    });
}

function downloadLiquid() {
    const code = document.getElementById('liquid-code-display').innerText;
    const name = (interviewState.answers['name'] || 'candidate').toLowerCase().replace(/\s+/g, '_');
    downloadFile(`obeybots_profile_${name}.liquid`, code, 'text/plain');
    showToast("Shopify .liquid file downloaded!");
}

// --- FILE EXPORT & IMPORT ENGINE ---
function exportTXT() {
    const name = interviewState.answers['name'] || "Candidate";
    const headline = interviewState.answers['currentRole'] || "Specialist";
    const location = interviewState.answers['location'] || "Remote";
    const email = interviewState.answers['email'] || "N/A";
    const summary = document.getElementById('res-summary') ? document.getElementById('res-summary').innerText : "";
    const liquidCode = document.getElementById('liquid-code-display') ? document.getElementById('liquid-code-display').innerText : "";

    let txt = `=================================================================\n`;
    txt += `              OBEYBOTS TALENT INTERVIEW PROFILE\n`;
    txt += `               MattyJacks Ecosystem Intelligence\n`;
    txt += `=================================================================\n\n`;

    txt += `CANDIDATE INFORMATION:\n`;
    txt += `----------------------\n`;
    txt += `Name:               ${name}\n`;
    txt += `Headline:           ${headline}\n`;
    txt += `Location:           ${location}\n`;
    txt += `Email:              ${email}\n`;
    txt += `Overall Score:      ${interviewState.overallScore}%\n\n`;

    txt += `EXECUTIVE SUMMARY:\n`;
    txt += `------------------\n`;
    txt += `${summary}\n\n`;

    txt += `VERIFIED SKILL SCORES:\n`;
    txt += `----------------------\n`;
    (interviewState.calculatedSkills.all || []).forEach(s => {
        txt += `- ${s.name.padEnd(35)} Self-Rating: ${s.selfRating}/5 | Calculated: ${s.scorePct}%\n`;
    });
    txt += `\n`;

    txt += `RECOMMENDED MATTYJACKS ROLES:\n`;
    txt += `------------------------------\n`;
    (interviewState.roleMatches || []).forEach(r => {
        txt += `- [${r.matchPct}% - ${r.tier}] ${r.title}\n  Reason: ${r.reason}\n`;
    });
    txt += `\n`;

    txt += `ACTIONABLE SERVICES:\n`;
    txt += `--------------------\n`;
    (interviewState.serviceMatches || []).forEach(s => {
        txt += `- ${s}\n`;
    });
    txt += `\n`;

    txt += `RAW INTERVIEW ANSWERS (JSON):\n`;
    txt += `-----------------------------\n`;
    txt += `${JSON.stringify(interviewState.answers, null, 2)}\n\n`;

    txt += `GENERATED SHOPIFY LIQUID CODE:\n`;
    txt += `------------------------------\n`;
    txt += `${liquidCode}\n`;

    const fileName = `obeybots_${name.toLowerCase().replace(/\s+/g, '_')}.txt`;
    downloadFile(fileName, txt, 'text/plain');
    showToast("TXT Profile exported successfully!");
}

function triggerImportTXT() {
    document.getElementById('txt-file-input').click();
}

function importTXT(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            // Locate JSON block in exported text file
            const jsonStart = content.indexOf('RAW INTERVIEW ANSWERS (JSON):');
            const jsonEnd = content.indexOf('GENERATED SHOPIFY LIQUID CODE:');
            
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonText = content.substring(jsonStart + 'RAW INTERVIEW ANSWERS (JSON):'.length, jsonEnd).trim();
                const parsedAnswers = JSON.parse(jsonText.replace(/---+/g, '').trim());
                
                interviewState.answers = parsedAnswers;
                interviewState.isCompleted = true;
                finishInterview();
                showToast("TXT Profile imported successfully!");
            } else {
                showToast("Could not find raw JSON answers block in text file.");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to parse imported TXT file.");
        }
    };
    reader.readAsText(file);
}

function exportJSON() {
    const name = (interviewState.answers['name'] || 'candidate').toLowerCase().replace(/\s+/g, '_');
    const jsonStr = JSON.stringify(interviewState, null, 2);
    downloadFile(`obeybots_data_${name}.json`, jsonStr, 'application/json');
    showToast("JSON payload exported!");
}

function printProfile() {
    switchView('results');
    window.print();
}

function resetInterview() {
    if (confirm("Are you sure you want to reset the interview? All unexported data will be cleared.")) {
        localStorage.removeItem('obeybots_state');
        interviewState.currentIndex = 0;
        interviewState.answers = {};
        interviewState.selectedDomains = [];
        interviewState.calculatedSkills = {};
        interviewState.roleMatches = [];
        interviewState.serviceMatches = [];
        interviewState.overallScore = 0;
        interviewState.isCompleted = false;
        
        switchView('landing');
        updateResumeButtonVisibility();
        showToast("Interview reset to initial state.");
    }
}

// --- UTILITIES & STORAGE ---
function downloadFile(filename, text, mimeType) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};charset=utf-8,` + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function autoSaveState() {
    localStorage.setItem('obeybots_state', JSON.stringify(interviewState));
    updateResumeButtonVisibility();
}

function loadSavedProgress() {
    const saved = localStorage.getItem('obeybots_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(interviewState, parsed);
        } catch(e) {
            console.error("Failed to load state", e);
        }
    }
    updateResumeButtonVisibility();
}

function updateResumeButtonVisibility() {
    const btn = document.getElementById('hero-resume-btn');
    if (btn) {
        const hasSaved = localStorage.getItem('obeybots_state');
        if (hasSaved && Object.keys(interviewState.answers || {}).length > 0) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadSavedProgress();
    if (interviewState.isCompleted) {
        generateProfileUI();
        generateLiquid();
    }
});
