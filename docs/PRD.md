# Product Requirements Document: Filipino Recipes PWA UI Sample

## 1. Document Control
- **Version**: 1.0
- **Last Updated**: 5 October 2025
- **Owners**: Year 12 Software Engineering teaching team

## 2. Product Overview
- **Summary**: `Filipino Recipes - PWA UI Sample` is a responsive, accessible web experience for browsing, learning about, and adding Filipino recipes. It doubles as an instructional asset for students studying modern web development patterns.
- **Context**: The project currently ships as a static site (`index.html`, `recipe-detail.html`, `add-recipe.html`, `about-this.html`, `contact.html`) styled by `styles.css` and enhanced by `script.js`. A parallel `flask-example/` directory demonstrates the next step toward a dynamic PWA powered by Flask and SQLite (`flask-example/app.py`, `flask-example/templates/`, `flask-example/schema.sql`).
- **Strategic Fit**: Supports the Year 12 Software Engineering curriculum by showcasing best practices (semantic HTML, responsive layouts, accessibility, progressive enhancement) and by scaffolding a pathway from static front-end to full-stack application.

## 3. Goals & Objectives
- **Teach Modern Web Foundations**: Reinforce semantic HTML, responsive CSS (Flexbox/Grid), and accessible navigation patterns highlighted in `README.md`.
- **Demonstrate Progressive Enhancement**: Provide a base that works without JavaScript and gracefully adds interactivity via `script.js`.
- **Prepare for Backend Integration**: Align with `docs/FLASK_PATHWAY.md` to guide students through templating, database usage, and Flask best practices.
- **Encourage Project-Based Learning**: Offer authentic assets (images, audio, recipe data) to support hands-on exploration and assessment.

## 4. Target Users
- **Year 12 Students**: Learners practicing web development fundamentals and transitioning toward full-stack skills.
- **Teachers & Facilitators**: Educators needing a ready-to-use example, lesson material, and extension pathway.
- **Curriculum Designers**: Stakeholders ensuring alignment with educational standards and progression.

## 5. User Personas
- **Student Developer**: Has basic HTML/CSS knowledge, needs concrete examples, wants to modify and extend the site.
- **Lead Teacher**: Plans lessons, requires reference material (`docs/CSS_ORGANIZATION.md`, `docs/FLASK_PATHWAY.md`), and assesses student outcomes.
- **Curriculum Advisor**: Validates the project structure and roadmap against program objectives.

## 6. User Stories
- **As a Student**, I want to browse recipe cards on `index.html` so I can discover Filipino dishes and observe reusable UI patterns.
- **As a Student**, I want to open `recipe-detail.html` to study how detailed content is structured with semantic elements.
- **As a Student**, I want to experiment with `add-recipe.html` to understand form accessibility and input design.
- **As a Teacher**, I want supporting documents in `docs/` so I can assign extension work (e.g., converting to Flask).
- **As a Teacher**, I want an example Flask application (`flask-example/app.py`) so I can demonstrate server-rendered templates.

## 7. Scope
- **In Scope (Current Release)**: Static HTML site, responsive styling, accessible navigation, education-focused content, starter JavaScript for mobile navigation, curated assets, documentation for CSS and Flask pathways.
- **Out of Scope (Current Release)**: Production-ready backend, real form submissions, authentication, search, offline caching, API integrations.

## 8. Functional Requirements
- **Recipe Browsing**: Display featured recipes on `index.html` with category tags and summaries.
- **Recipe Detail View**: Provide full descriptions, ingredient lists, and preparation details in `recipe-detail.html`.
- **Add Recipe Form**: Present accessible fields in `add-recipe.html` ready for future backend submission.
- **Educational Content**: Supply instructional guidance on the `contact.html` page outlining project recreation steps.
- **Mobile Navigation**: Toggle navigation visibility via `script.js` while preserving keyboard accessibility.
- **Flask Reference Implementation**: Offer a working example in `flask-example/` that mirrors the static experience using templates and data from `schema.sql`.

## 9. Non-Functional Requirements
- **Responsiveness**: Maintain readable layouts across mobile, tablet, and desktop using Flexbox and Grid.
- **Accessibility**: Meet WCAG-informed practices (semantic landmarks, aria attributes, focus management) showcased in the existing HTML/CSS.
- **Performance**: Load quickly as a static site, keeping asset sizes optimized for classroom environments with limited bandwidth.
- **Maintainability**: Preserve consistent component structures and centralized styles (`styles.css`), enabling students to understand reuse.
- **Educational Clarity**: Keep code well-commented and organized to support self-guided learning.

## 10. Content Requirements
- **Recipe Data**: Include culturally authentic Filipino recipes (Adobo, Kare-Kare, Lumpia) with short and long descriptions, ingredient and direction text, and media references as seeded in `flask-example/schema.sql`.
- **Media Assets**: Offer representative images (`images/`) and optional audio files (`audio/`) for enrichment activities.
- **Documentation**: Maintain supporting guides in `docs/` to scaffold CSS organization and Flask conversion journeys.

## 11. Information Architecture & Navigation
- **Primary Pages**: `index.html`, `recipe-detail.html`, `add-recipe.html`, `about-this.html`, `contact.html` linked through a consistent header/footer.
- **Navigation Pattern**: Responsive top navigation with hamburger menu for small screens managed by `script.js`.
- **Template Parity**: Flask templates (`flask-example/templates/`) should mirror structure to ease the transition from static to dynamic rendering.

## 12. Technical Architecture
- **Front-End Stack**: Static HTML, shared CSS (`styles.css`), vanilla JavaScript (`script.js`).
- **Progressive Enhancement**: Base functionality accessible without JavaScript; enhancements provide improved usability.
- **Future Back-End**: Flask application (`flask-example/app.py`) consuming SQLite data (`instance/recipes.db`, seeded by `flask-example/schema.sql`).
- **Asset Organization**: Consolidated directories for `images/`, `audio/`, and `docs/`; PWA upgrade will relocate assets to `flask-example/static/`.

## 13. Roadmap
- **Phase 0 – Static Experience (Complete)**: Deliver accessible static site with documentation.
- **Phase 1 – Template Migration**: Move pages into `flask-example/templates/` and adopt Jinja templating per `docs/FLASK_PATHWAY.md` Week 1 guidance.
- **Phase 2 – Data Layer**: Introduce SQLite database access and dynamic recipe rendering (Weeks 2–3).
- **Phase 3 – Interactivity Enhancements**: Handle form submissions, validations, and user sessions (Weeks 3–4).
- **Phase 4 – Advanced Features**: Implement search, filtering, API endpoints, and offline capabilities (Week 5+).

## 14. Success Metrics
- **Curriculum Adoption**: Percentage of classes integrating the project into coursework.
- **Student Engagement**: Number of student-led modifications or extensions submitted.
- **Learning Outcomes**: Assessment scores on units covering responsive design, accessibility, and Flask basics.
- **Technical Completion**: Completion rate of roadmap phases within academic term.

## 15. Dependencies & Constraints
- **Tooling**: Requires browser-based development environment; optional Python/Flask setup for advanced modules.
- **Dataset Maintenance**: Needs periodic review of recipe content and media for accuracy and cultural sensitivity.
- **Classroom Time**: Roadmap phases aligned with a five-week module; adjustments may be required for differing schedules.

## 16. Risks & Mitigations
- **Student Overload**: Progressive reveal of complexity via `docs/FLASK_PATHWAY.md` to prevent cognitive overload.
- **Technical Setup Challenges**: Provide detailed Flask setup steps and preconfigured examples to reduce friction.
- **Accessibility Drift**: Include automated or checklist-based reviews when students modify components.
- **Content Expansion**: Establish guidelines before allowing user-generated recipes to ensure quality and safety.

## 17. Open Questions
- **Assessment Strategy**: How will student progress be evaluated across static and Flask phases?
- **PWA Requirements**: What offline and installable capabilities are mandatory for certification?
- **Collaboration Features**: Should future iterations support multi-user contributions or commenting?
- **Localization**: Is translation or multilingual support required for broader adoption?
