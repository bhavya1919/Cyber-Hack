# AI Shadow Internet — Database Architecture Report

## 1. Current Project Analysis
Based on a thorough read-only audit of the existing `src/` directory, the following core features are currently implemented and their data flow analyzed:

### 1.1 Threat Feed & Threat Map
- **Files Involved**: `src/core/store/dashboardStore.ts`, `src/services/threatService.ts`, `src/components/ThreatFeed/`, `src/components/ThreatMap/`
- **Current Data Source**: Zustand (`dashboardStore.ts` -> `threat` domain), seeded/simulated via `threatService.ts`.
- **Current State Management**: Zustand (`useDashboardStore`).
- **Persistent Data**: The core `Threat` objects (source, target, severity, category, sector, etc.).
- **UI-Only State**: `selectedThreatId`, `hoveredThreatId`, `undoStack`.

### 1.2 AI Copilot
- **Files Involved**: `src/core/store/copilotStore.ts`, `src/components/dashboard/CopilotTab.tsx`, `src/core/copilot/`
- **Current Data Source**: Zustand (`INITIAL_MESSAGES`), dynamic in-memory generation.
- **Current State Management**: Zustand (`useCopilotStore`).
- **Persistent Data**: Chat history (`messages`), reasoning logs (optional, for audit).
- **UI-Only State**: `isTyping`, `pipelineSteps`, memory timestamp.

### 1.3 AI Situation Report
- **Files Involved**: `src/core/store/dashboardStore.ts` (`ai` domain), `src/components/dashboard/AISituationReport.tsx`
- **Current Data Source**: Generated dynamically via `triggerAIAnalysis` in Zustand based on current threats.
- **Current State Management**: Zustand (`useDashboardStore`).
- **Persistent Data**: While mostly derived, we could store historical `SituationReports` for auditing. However, for now, it's mostly derived from active threats.
- **UI-Only State**: `status` ('idle' | 'generating' | 'ready'), `aiEngineRunning`, `confidence`.

### 1.4 Notification Center
- **Files Involved**: `src/core/store/notificationStore.ts`, `src/components/NotificationCenter/`
- **Current Data Source**: `SEED_NOTIFICATIONS` and a live stream simulator.
- **Current State Management**: Zustand (`useNotificationStore`).
- **Persistent Data**: Notifications (title, message, severity, category, timestamp, isRead, source).
- **UI-Only State**: `isPanelOpen`.

### 1.5 Reports
- **Files Involved**: `src/services/reportService.ts`, `src/components/dashboard/ReportsTab.tsx`
- **Current Data Source**: Supabase stub/simulated backend.
- **Current State Management**: Local component state / React Query.
- **Persistent Data**: Report metadata (title, type, classification, summary).
- **UI-Only State**: Selected report for viewing, search filters.

### 1.6 Presentation Mode & Boot Sequence
- **Files Involved**: `src/components/BootSequence/`, `src/core/store/dashboardStore.ts` (`presentation` domain)
- **Current Data Source**: Local configuration / hardcoded timeouts.
- **Current State Management**: Zustand / Local state.
- **Persistent Data**: None.
- **UI-Only State**: Completely UI-driven (`enabled`, `scenario`, `speed`, `autoplay`).

### 1.7 Analytics, Overview Cards, Risk Score
- **Files Involved**: `src/components/dashboard/AnalyticsTab.tsx`, `src/components/dashboard/OverviewCards/`, `src/components/dashboard/RiskScoreTab.tsx`
- **Current Data Source**: Derived metrics from `dashboardStore.ts` -> `metrics`.
- **Persistent Data**: None (derived from Threat data).
- **UI-Only State**: Time range selections, hovered charts.

---

## 2. Data Flow Analysis

### 2.1 Threat Data Flow
- **Origin**: Initially simulated or fetched via `threatService.ts`.
- **Processing**: Ingested into `dashboardStore.ts`, which updates metrics (`calculateMetrics`).
- **Consumers**: `ThreatFeed`, `ThreatMap`, `OverviewCards`, `AnalyticsTab`, `RiskScoreTab`.
- **Store Ownership**: Database (`threats` table) -> `threatService.ts` -> `dashboardStore.ts`.

### 2.2 Notification Data Flow
- **Origin**: System events or simulated live stream.
- **Processing**: Appended to `notificationStore.ts`.
- **Consumers**: `NotificationCenter`, top nav bell icon, voice system.
- **Store Ownership**: Database (`notifications` table) -> `notificationService.ts` -> `notificationStore.ts`.

### 2.3 AI Copilot Data Flow
- **Origin**: Analyst text input.
- **Processing**: Run through pipeline (Context Builder -> Intent Detection -> Generation) in `copilotStore.ts`.
- **Consumers**: `CopilotTab`.
- **Store Ownership**: Database (`copilot_messages` table) -> `copilotService.ts` -> `copilotStore.ts`.

---

## 3. Database Design

### 3.1 `threats`
- **Purpose**: Stores all intercepted anomalies and threats.
- **Columns**: `id` (UUID), `severity` (enum), `status` (varchar), `category` (varchar), `target_country` (varchar), `source_country` (varchar), `target_industry` (varchar), `attacker_actor` (varchar), `summary` (text), `attack_vector` (varchar), `affected_assets` (jsonb), `confidence` (int), `created_at` (timestamp), `updated_at` (timestamp).
- **Primary Key**: `id`
- **Indexes**: `severity`, `status`, `created_at`
- **Relationships**: None directly.

### 3.2 `reports`
- **Purpose**: Stores generated intelligence reports.
- **Columns**: `id` (UUID), `title` (varchar), `type` (varchar), `classification` (varchar), `summary` (text), `generated_at` (timestamp).
- **Primary Key**: `id`
- **Indexes**: `generated_at`, `classification`

### 3.3 `notifications`
- **Purpose**: Stores system alerts and notifications.
- **Columns**: `id` (UUID), `title` (varchar), `message` (text), `severity` (enum), `category` (varchar), `source` (varchar), `is_read` (boolean), `created_at` (timestamp).
- **Primary Key**: `id`
- **Indexes**: `is_read`, `created_at`

### 3.4 `copilot_sessions` & `copilot_messages`
- **Purpose**: Persists chat history for the AI Copilot.
- **`copilot_sessions`**: `id` (UUID), `title` (varchar), `created_at` (timestamp).
- **`copilot_messages`**: `id` (UUID), `session_id` (FK), `sender` (varchar: analyst | copilot), `text` (text), `intent_type` (varchar), `created_at` (timestamp).
- **Indexes**: `session_id`, `created_at`.

---

## 4. Supabase Design

- **UUID Strategy**: Use `uuid_generate_v4()` for all `id` primary keys.
- **Timestamp Strategy**: Use `now()` for `created_at`. Let client or trigger update `updated_at`.
- **RLS Recommendation**: Enable RLS on all tables. Since there is currently no authentication store analyzed, we will assume an authenticated role requirement or allow anon for this demo (defaulting to allow authenticated).
- **Cascade Rules**: Deleting a `copilot_session` cascades to `copilot_messages`.

---

## 5. SQL Scripts

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE threat_severity AS ENUM ('crit', 'high', 'medium', 'low', 'info');
CREATE TYPE notif_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');

-- 1. THREATS TABLE
CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    severity threat_severity NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    category VARCHAR(100) NOT NULL,
    target_country VARCHAR(100),
    source_country VARCHAR(100),
    target_industry VARCHAR(100),
    attacker_actor VARCHAR(100),
    summary TEXT,
    attack_vector VARCHAR(100),
    affected_assets JSONB DEFAULT '[]'::jsonb,
    confidence INT CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_threats_status ON threats(status);
CREATE INDEX idx_threats_severity ON threats(severity);
CREATE INDEX idx_threats_created_at ON threats(created_at DESC);

-- 2. REPORTS TABLE
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    classification VARCHAR(50) NOT NULL,
    summary TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_generated_at ON reports(generated_at DESC);

-- 3. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity notif_severity NOT NULL,
    category VARCHAR(100) NOT NULL,
    source VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 4. COPILOT TABLES
CREATE TABLE copilot_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE copilot_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES copilot_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'analyst' or 'copilot'
    text TEXT NOT NULL,
    intent_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_messages_session ON copilot_messages(session_id);

-- RLS Setup (Example for Threats)
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON threats FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON threats FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON threats FOR UPDATE USING (true);

-- (Repeat RLS for other tables based on auth requirements)
```

---

## 6. Services Layer Design

### `src/services/threatService.ts`
- **Responsibilities**: Interface with `threats` table.
- **Methods**: `fetchThreats(limit, status, filters)`, `saveThreat(threat)`, `updateThreatStatus(id, status)`.
- **Caching**: Local caching handled by Zustand. No separate React Query caching needed if relying on Zustand sync.

### `src/services/reportService.ts`
- **Responsibilities**: Interface with `reports` table.
- **Methods**: `fetchReports()`, `saveReport(report)`, `deleteReport(id)`.

### `src/services/notificationService.ts` (New)
- **Responsibilities**: Persist and fetch alerts.
- **Methods**: `fetchNotifications(limit)`, `markAsRead(id)`, `markAllAsRead()`, `createNotification(notif)`.

### `src/services/copilotService.ts` (New)
- **Responsibilities**: Sync chat history.
- **Methods**: `fetchSessions()`, `fetchMessages(sessionId)`, `saveMessage(sessionId, message)`.

---

## 7. Integration Plan

### File Modifications
1. **`src/core/store/dashboardStore.ts`**
   - *Current*: `addThreat` pushes to local state and calls `threatService`.
   - *New*: Hydrate initial threats from `threatService.fetchThreats()` on app mount.
   - *Risk*: Low. Seamless transition since `threatService` is already partially mocked.

2. **`src/core/store/notificationStore.ts`**
   - *Current*: Uses `SEED_NOTIFICATIONS`.
   - *New*: Replace seeds with `notificationService.fetchNotifications()`. Map `addNotification` to sync to DB asynchronously.
   - *Risk*: Low to Medium. Ensure live simulator generates records in the DB to sync across multiple clients (via Supabase Realtime).

3. **`src/core/store/copilotStore.ts`**
   - *Current*: Local history array.
   - *New*: Fetch active session messages on load. Sync `sendMessage` to database.
   - *Risk*: Medium. Ensure optimistic UI updates are handled properly during network latency.

4. **`src/components/BootSequence/BootSequence.tsx` or similar Root Component**
   - *Action*: Introduce an initializer hook (`useHydrateStores`) that loads data from services into Zustand stores when the app starts.

---

## 8. What Should NOT Go Into Database

The following state should strictly remain in Zustand/React Context and NOT be stored in the database:
- `selectedThreatId` / `hoveredThreatId`
- `undoStack` (Threat selection history)
- `isTyping` / `pipelineSteps` (Copilot UI state)
- `isPanelOpen` (Notification Center)
- Presentation Mode settings (`enabled`, `scenario`, `speed`, `autoplay`)
- Application theme (unless tied to a specific user profile later)
- Toast Queue (`ui.toastQueue`)
- Boot sequence steps
- Any hover/tooltip state
- Active tab / routing state

---

## 9. Final Database Architecture

### ER Diagram
```text
[threats]
  |-- id (PK)
  |-- severity
  |-- ...
  
[reports]
  |-- id (PK)
  |-- title
  |-- ...

[notifications]
  |-- id (PK)
  |-- severity
  |-- is_read
  |-- ...

[copilot_sessions]
  |-- id (PK)
  |-- title
  |
  |---< [copilot_messages]
          |-- id (PK)
          |-- session_id (FK)
          |-- text
          |-- sender
```

### Best Practices & Future Scalability
- **Realtime Integration**: Use Supabase Realtime for `threats` and `notifications` to power the dashboard across multiple analyst terminals simultaneously.
- **Archiving**: Set up a CRON job or pg_cron to archive resolved threats older than 90 days to cold storage to maintain high query performance on the dashboard.
- **Repository Pattern**: Abstract Supabase calls into the `services/` folder strictly. Do not import `supabase` directly into React components.
- **Types**: Sync Supabase generated types (`Database` schema) with the frontend TypeScript interfaces (`DashboardTypes.ts`) using the Supabase CLI.
