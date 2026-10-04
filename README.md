# EcoBuild (Phase 2: The Collaborative Maker Network)

**EcoBuild** helps people turn unused, salvaged, and spare electronic components into useful, working projects.

In **Phase 2**, EcoBuild expands from single-user workbench inventory matching into a **Collaborative Maker Network**, answering the question:
> *“Who can help me finish this project?”*

---

## 🚀 What's New in Phase 2

1. **Explainable Project-Partner Suggestions**:
   - Project-specific candidate discovery comparing exact catalog components.
   - Evaluates active user's baseline coverage and candidate's shareable free working inventory.
   - Computes potential combined coverage and coverage improvement boost (e.g., `+50%`).
   - Identifies complementary skills (e.g. Mechanical assembly, Sensor testing) and shared project interests.
   - Plain-language explanations (e.g., *"Elena offers 2× TT DC Motor and 1× L298N Driver, boosting coverage by +50%"*).

2. **Role Switching with 6 Demo Maker Profiles**:
   - Compact demo user switcher in top bar with active identity and pending request notifications.
   - **Adithya** (Primary user; Arduino Uno, ultrasonic sensors, servos, breadboard, resistors).
   - **Elena Rostova** (Actuator & Motor specialist; TT gear motors, L298N H-Bridge driver).
   - **Marcus Chen** (Telemetry & environmental builder; DHT11 sensor, I2C OLED display, soil moisture probe, ESP32).
   - **Priya Patel** (Beginner enthusiast; Piezo buzzers, tactile push buttons, LEDs).
   - **Dr. Robert Vance** (Opted-in Mentor; Senior lab advisor for circuit debugging and brownout isolation).
   - **Amina Diallo** (Opted-in Mentor; Embedded firmware specialist for non-blocking timers and I2C protocols).
   - Switching demo profiles preserves partitioned inventories, distinct proposal inboxes, and workspace permissions.

3. **Collaboration Proposals & Inventory Reservations**:
   - Send structured proposals detailing proposed sender contributions, receiver contributions, remaining deficits, and member responsibilities.
   - **Non-destructive sending**: Sending a proposal does **not** reserve stock prematurely.
   - **Pre-acceptance rechecking**: Accepting re-verifies live free stock, conditions, and collaboration sharing for both parties.
   - **Reservation integration**: Upon acceptance, agreed parts are actively reserved, decrementing free stock for other projects while the active workspace retains full requirement coverage.
   - **Cancellation & Release**: Cancelling releases all reserved parts back to free usable stock.

4. **Dedicated Project Workspaces (`/workspaces/:id`)**:
   - Virtual project collaboration rooms for accepted teams.
   - **Overview**: Combined coverage bar counting workspace reservations, member roles, high-level build steps.
   - **Components**: Transparent hardware contribution table with reservation status and component passport previews.
   - **Tasks**: Interactive Kanban task board (To Do, In Progress, Done) with assignee and status advancement.
   - **Discussion**: Safe team message feed with authorship and timestamps.
   - **Mentorship**: Linked mentorship questions directly accessible from the workspace.
   - **Permissions guard**: Non-members view the room in observer mode; only team members can add tasks or post messages.
   - **3D Build Simulator**: Clearly tagged as Phase 3 architecture preview.

5. **Opted-In Mentor Discovery & Structured Requests**:
   - Directory of verified mentors with declared skills, supported help topics, and availability preferences.
   - Structured help tickets covering circuit understanding, troubleshooting, programming, component testing, and assembly.
   - Mentors can reply with diagnostic advice; requesters can mark tickets resolved.

6. **Sharing & Privacy Controls**:
   - Explicit `Available for Maker Network Collaboration` toggle on every inventory item.
   - Private, reserved, installed, faulty, unsafe, or untested components are strictly excluded from candidate offers.

7. **Versioned Storage Migration (v1 → v2)**:
   - Preserves existing Phase 1 user inventory, profile preferences, and saved projects.
   - Automatically migrates Adithya's existing components to `maker-adithya` with `ownerId` and sharing flags.

---

## 🗺️ Application Routes

- `/`: **Discover** — Personalized feed, inventory summary, pending collaboration alerts, network opportunities, and recommended builds.
- `/components`: **My Components** — Hardware inventory CRUD, sharing toggles, search, filters, and Component Passports.
- `/projects`: **Project Library** — Searchable recipe directory with live availability calculations.
- `/projects/:id`: **Project Details** — Detailed requirement allocation table, sustainability reuse mass, and direct **Find a Partner** & **Ask a Mentor** buttons.
- `/network`: **Maker Network** — Partner matching, mentor directory, and active proposal/workspace inbox.
- `/workspaces/:id`: **Project Workspace** — Working collaborative room with task board, reserved hardware table, and team discussion.
- `/saved`: **Saved Projects** — Bookmarked build recipes with live recalculated coverage.
- `/profile`: **Profile & Settings** — Customize maker identity, experience, and interests.

---

## 🛠️ Data Architecture

### Maker Profile (`MakerProfile`)
```typescript
interface MakerProfile {
  id: string;
  displayName: string;
  isDemo: boolean;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  interests: string[];
  collaborationPreference: 'Open to team builds' | 'Mentoring only' | 'Project-specific' | 'Solo maker';
  locationLabel?: string;
  bio?: string;
  mentorProfile?: {
    isAvailable: boolean;
    topics: MentorshipHelpCategory[];
    preferredLanguage?: string;
    availabilityNotes: string;
  };
}
```

### Collaboration Proposal (`CollaborationProposal`)
```typescript
interface CollaborationProposal {
  id: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  proposedSenderContributions: ContributionItem[];
  proposedReceiverContributions: ContributionItem[];
  remainingDeficits: { catalogId: string; name: string; quantity: number }[];
  suggestedResponsibilities: { memberId: string; roleDescription: string }[];
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';
  createdAt: string;
  workspaceId?: string;
}
```

### Component Reservation (`ComponentReservation`)
```typescript
interface ComponentReservation {
  id: string;
  workspaceId: string;
  proposalId?: string;
  inventoryItemId: string;
  ownerId: string;
  catalogId: string;
  name: string;
  quantity: number;
  reservedAt: string;
  status: 'active' | 'released';
}
```

---

## 🧪 Acceptance Checks Performed

| Check | Description | Status |
| :--- | :--- | :--- |
| **Check 1** | Existing Phase 1 profile, inventory, and saved projects survive v2 migration | Verified |
| **Check 2** | Switching demo users strictly partitions inventory, proposals, and permissions | Verified |
| **Check 3** | Only opted-in, free, working stock improves candidate partner coverage | Verified |
| **Check 4** | Candidate suggestions recalculate dynamically when inventory quantities change | Verified |
| **Check 5** | Sending a proposal does **not** reserve stock prematurely | Verified |
| **Check 6** | Accepting a proposal rechecks live stock, creates workspace, and reserves agreed parts | Verified |
| **Check 7** | Accepted reservations reduce free stock for other recipes and proposals | Verified |
| **Check 8** | Workspace retains full requirement coverage from its own active reservations | Verified |
| **Check 9** | Cancelling collaboration releases reservations back to owners' free stock | Verified |
| **Check 10** | Stale proposals cannot reserve depleted or unshared quantities | Verified |
| **Check 11** | Mentor requests can be created, accepted, replied to, and resolved | Verified |
| **Check 12** | Tasks, chat messages, and tickets persist across browser reloads | Verified |
| **Check 13** | Non-members see restricted observer view on workspaces | Verified |
| **Check 14** | Phase 1 deterministic matching, 75% coverage example, and reuse mass pass all tests | Verified |
| **Check 15** | Collaboration actions do not fabricate completed reuse or carbon diversion claims | Verified |

---

## 📖 Walkthrough: Complete Collaboration Lifecycle

Here is how to test the end-to-end collaborative flow in the prototype:

1. **Step 1 (Discover & Select Project)**:
   - Start as **Adithya** (active demo user in top bar).
   - Go to **Project Library** or **Discover** and open the **Autonomous Obstacle-Avoidance Rover** (`/projects/proj-obstacle-robot`).
   - Notice individual coverage is 50% (missing 2× DC gear motors and 1× L298N driver).

2. **Step 2 (Find a Partner)**:
   - Click **Find a Partner for this Build** at the bottom of the page (or open **Maker Network** → **Project Partners**).
   - Notice **Elena Rostova** is suggested with a **+50% coverage boost** (100% combined coverage!), offering 2× TT DC Motors and 1× L298N Driver.
   - Click **Propose Collaboration**, review contributions, and click **Send Proposal**.

3. **Step 3 (Role Switch & Acceptance)**:
   - Open the **Demo User Switcher** in the top bar and select **Elena Rostova**.
   - Notice the pending badge indicates a new incoming proposal.
   - Go to **Maker Network** → **My Activity**.
   - Inspect Adithya's proposal for the Obstacle Rover and click **Accept & Reserve Parts**.
   - The workspace `ws-rover-...` is created, and Elena's motors and Adithya's board are safely reserved.

4. **Step 4 (Workspace Tasks & Discussion)**:
   - Click **Go to Project Workspace** (or access it from **My Activity**).
   - Review the **100% Reserved Coverage** bar.
   - Go to **Tasks**, click **Add Task**, assign a task to Adithya, and advance Elena's motor test task to **Done**.
   - Go to **Discussion** and post an update as Elena.

5. **Step 5 (Ask a Mentor & Answer)**:
   - In the workspace (or on the Obstacle Rover page), click **Ask a Mentor**.
   - Select **Dr. Robert Vance**, ask about motor electrical noise decoupling, and submit.
   - Switch demo role to **Dr. Robert Vance** in the top bar.
   - Go to **Maker Network** → **My Activity** → **Mentorship Tickets**, type advice, and click **Reply**.
   - Switch back to **Adithya** to see Dr. Vance's guidance and click **Mark Question as Resolved**.
