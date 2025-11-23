# MODULES.md

## MVP Roadmap — Sprint-by-Sprint, Module-by-Module

Great — below is a practical, prioritized sprint plan you can follow one module at a time. Each sprint includes goals, deliverables, tech notes, API/DB contract, acceptance criteria, test ideas, and an estimated timebox. This plan produces a usable MVP that matches your constraints (mobile-first field agents, vernacular audio, low friction) while letting you code, test, and iterate module-by-module.

---

## Assumptions / Chosen Approach for MVP

- **Native Android app** (call capture + shift-end upload / dedicated-device toggle)
- **Web PWA** (React + Vite + TypeScript + Tailwind) for managers/admins/dashboard
- **Backend**: Node.js (Fastify/Express) or Python FastAPI + Postgres (Supabase optional) + S3 (or Supabase storage)
- **AI**: Gemini 2.5 Flash (ASR → LLM processing flow recommended for control)
- **Minimal billing initially** — free pilot. Add Stripe later

---

## Sprint 0 — Project Setup & Infra (1 week)

**Goal:** Create scaffolding so every subsequent sprint can plug in easily.

### Deliverables

- Monorepo or two repos (frontend-pwa, backend, android) scaffolded
- CI config (GitHub Actions): run lint, tests, build
- DB provisioned (Postgres / Supabase) and migrations tool ready
- S3 bucket (or Supabase storage) and KMS plan for encryption
- README, .gitignore, package-lock.json committed

### Tech Notes

- Use environment `.env.example`
- Create staging and dev environments

### Acceptance Criteria

- `npm run build` works for PWA; backend starts and connects to DB; Android skeleton builds
- Devs can push and run locally

### Tests

- Run unit tests (basic) and smoke start of backend and frontend

---

## Sprint 1 — Core Data Model + Auth + Basic API (1 week)

**Goal:** Implement user/org model, auth, and core call DB model and endpoints for uploads and retrieval.

### Deliverables

- DB schema (users, orgs, calls, call_audit_logs)
- Auth (JWT or Supabase Auth)
- API endpoints:
  - `POST /api/upload` — returns signed URL for file upload or accepts file stream
  - `GET /api/calls?userId=...` — list calls for user/org
  - `GET /api/calls/:id` — metadata + status
  - `POST /api/users/:id/settings` — dedicated_device_mode toggle
- Basic admin user creation

### DB Sample Schema (Postgres)

```sql
users(id, name, email, phone, role, org_id, dedicated_device_mode boolean);
calls(id, user_id, org_id, remote_number, duration, recorded_at, uploaded_at, status, storage_path, upload_mode, processed_result jsonb, created_at);
call_audit_logs(id, call_id, actor_id, action, note, timestamp);
```

### Acceptance Criteria

- Can create user, authenticate, create call record with pending status, and fetch call list

### Tests

- Auth flows, upload signed URL return, DB CRUD tests

---

## Sprint 2 — Upload Flow & Storage + Mobile Upload Stub (1 week)

**Goal:** Implement reliable upload: signed URL, encrypted storage reference, small mobile demo that uploads a sample audio file.

### Deliverables

- `POST /api/upload` returns signed URL + call id
- Worker queue (simple job queue stub using BullMQ or cloud tasks)
- Mobile Android stub: ability to pick local audio file and upload via signed URL, hitting `/api/upload` first
- Local record of status transitions and audit log entries

### Acceptance Criteria

- File successfully uploaded to S3 using signed URL; backend sees uploaded file and updates call status to `pending_review` (or `uploaded`)

### Tests

- Upload large files, resume on failure tests, signed URL expiry tests

---

## Sprint 3 — Manager PWA: Pending-Review Queue (1 week)

**Goal:** Managers can see pending calls, preview, approve/reject (end-of-shift flow).

### Deliverables

- PWA page: `/pending` list with play preview (streaming signed URL, 30s preview allowed), filters, bulk approve/reject
- API endpoints:
  - `GET /api/calls/pending?orgId=...`
  - `POST /api/calls/:id/approve`
  - `POST /api/calls/:id/reject` (reason required)
- Notification trigger (email/WhatsApp stub) when uploads occur (simple email via SMTP first)

### Acceptance Criteria

- Manager can preview, approve and reject calls. Rejected calls deleted or moved to trash; approved calls enter processing queue

### Tests

- UI manual test: preview & approve; audit log contains approval entry

---

## Sprint 4 — AI Pipeline MVP (ASR + Gemini Prompt) (2 weeks)

**Goal:** Build the processing worker that takes an approved audio file, runs ASR, and synthesizes the structured JSON using Gemini 2.5 Flash.

### Deliverables

- Worker process that:
  - Downloads audio from storage (or uses URL)
  - Optional lightweight pre-processing (normalize, denoise)
  - Calls ASR (Google Speech-to-Text or Gemini speech if supported) → transcript + timestamps
  - Calls Gemini 2.5 Flash (LLM) with a defined prompt and schema to produce `AnalysisResult` JSON
  - Saves `processed_result` in DB, sets `status = done`
- Prompt template + schema (see below)
- Costs estimator: compute cost per minute

### Suggested Prompt (Structured)

**System:** You are SalesIQ, an expert sales-call analyst.

**Task:** Given the transcript with speaker labels and timestamps, produce a JSON with fields:
- `transcript`: [{speaker, start, end, text}]
- `sentimentGraph`: [{timeOffsetSec, score}]...
- `coaching`: {strengths[], weaknesses[], summary}
- `competitors`: [{name, context, timestamp}]
- `objections`: [{text, timestamp, repResponse}]
- `callScore`: 0-100

Return only valid JSON per schema.

**User:** [TRANSCRIPT HERE]

### Acceptance Criteria

- Worker produces valid `processed_result` JSON for sample calls (English + some vernacular)
- Stored in DB; PWA can fetch and render sample JSON

### Tests

- Use 3 sample recordings (short, mid, noisy vernacular) and check outputs for schema conformance. Manual QA for hallucination rate

---

## Sprint 5 — Call Report Page + Visualizations (PWA) (1 week)

**Goal:** Show the analysis output in a polished report (transcript viewer with color-coded speakers, sentiment chart, coaching cards, call score).

### Deliverables

- `AnalysisDashboard.tsx` that renders:
  - Executive summary & call score (`CallScore.tsx`)
  - `TranscriptView.tsx` with timestamp anchors
  - `SentimentChart.tsx` area chart (Recharts)
  - `CoachingCard.tsx`, `ObjectionsCard.tsx`, `CompetitorAnalysis.tsx`, `NextStepsCard.tsx`
- API: `GET /api/calls/:id/report` returns `processed_result`

### Acceptance Criteria

- Manager can open any processed call and see a readable, attractive report with all sections
- Timestamps link between transcript and sentiment chart

### Tests

- Manual UX test across desktop & mobile web; check timestamp navigation

---

## Sprint 6 — Android App Core: In-App Dialing / Local Recording + Shift-End Upload (2 weeks)

**Goal:** Deliver the Android app that records calls into a local pending folder and uploads at shift end.

### Deliverables

Android app features:
- Auth & user setup
- In-app VoIP dialer (recommended minimal) OR system call recording enabled per permissions
- Local encrypted storage of call audio files
- Shift-end trigger (manual button + scheduled time) that calls `/api/upload` and uploads files to signed URL
- Dedicated-device toggle in settings
- "Pause processing" button
- Local audit logs and status indicators in app

### Acceptance Criteria

- App records calls, shows local pending list, uploads at shift end; backend receives and lists pending calls in manager PWA

### Tests

- Field test with 1–2 reps: record multiple in-shift calls and verify upload & manager pending queue

---

## Sprint 7 — Privacy, Consent, and Retention (1 week)

**Goal:** Implement consent, audit logs, retention policy, and deletion flows.

### Deliverables

- Consent screens in Android app (store consent record)
- Per-call approval/rejection logging
- Auto-delete policy: raw audio auto-delete after N days; transcripts retention configurable
- API for data deletion / export

### Acceptance Criteria

- Consent records are stored and displayed; deletion works and is audited

### Tests

- GDPR/PDPA style data deletion request flow simulation

---

## Sprint 8 — Notifications, Reporting & Light Analytics (1 week)

**Goal:** Add manager notifications and basic dashboard metrics.

### Deliverables

- Email/WhatsApp notification on pending uploads and analysis complete (WhatsApp via Twilio/WhatsApp Business later; start with email)
- Dashboard metrics: calls/day, avg call score per rep, most common objections
- Weekly summary email for managers

### Acceptance Criteria

- Notifications sent and dashboard shows metrics & trends

### Tests

- Simulate multiple processed calls and check summary calculations

---

## Sprint 9 — Bulk Improvements, QA, and Pilot Onboarding (1–2 weeks)

**Goal:** Stabilize product, fix issues from pilot, and onboard first paying pilot customers.

### Deliverables

- Polished UX, fix bugs, better error handling
- Onboarding flow & admin tools to add reps
- Simple help/FAQ pages and privacy policy
- Metrics instrumentation (Sentry, Prometheus, simple analytics)

### Acceptance Criteria

- Stable demo with 3 pilot teams; fewer than X critical bugs (define X)
- Collect feedback and list of prioritized improvements

### Tests

- Pilot user testing, crash/error analysis, retention measurement

---

## Optional Sprint 10 — CRM Integration + Chrome Extension (2–3 weeks)

**Goal:** Add integrations that reduce friction further: Zoom/Twilio webhook ingest, Chrome extension for web calls, CRM sync.

### Deliverables

- Zoom webhook connector to auto-ingest meeting recordings (webhook handler)
- Basic HubSpot/Zoho connector to push call summaries into CRM
- Chrome extension MVP to auto-capture web meeting audio (if relevant)

### Acceptance Criteria

- One working dialer integration (Zoom or Twilio). Push call summaries to CRM contact record

---

## Final Sprint — Pilot to Early Paying Customers & Pricing (2 weeks)

**Goal:** Convert pilot users to initial paying customers, test pricing plan.

### Deliverables

- Billing stub or Stripe integration (plans, coupons)
- SLA / Terms & Privacy for pilot
- Sales playbook & demo script
- Onboarding & training docs

### Acceptance Criteria

- 1–3 paying customers onboarded; feedback logged for iterative roadmap

---

### Total Estimated MVP Time: 9–14 weeks

(Single full-stack dev + 1 Android dev can speed up). You can compress the schedule by parallelizing Android + backend work.

---

## Cross-Sprint Priorities & Non-Functional Items

**Do these early and maintain:**

- **Cost monitoring** (ASR + Gemini usage) — very important. Show estimated $/min
- **Throttling & quota** in worker to avoid surprise bills
- **Security**: HTTPS everywhere, encryption at rest, signed URLs
- **Observability**: logs, error tracking, job retry metrics
- **Testing**: unit tests for backend and PWA; integration tests for worker pipeline
- **Data model evolution**: `processed_result` stored as JSONB for flexibility

---

## API Contract Quick Reference (Core Endpoints)

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | User authentication |
| `POST /api/upload` | Returns `{callId, uploadUrl}` |
| `GET /api/calls/pending?orgId=` | List pending calls for org |
| `POST /api/calls/:id/approve` | Approve a call |
| `POST /api/calls/:id/reject` | Reject a call (reason required) |
| `GET /api/calls/:id/report` | Get processed report |
| `GET /api/calls?userId=` | List calls for user/org |
| `POST /api/users/:id/settings` | Set `{dedicated_device_mode: true\|false}` |

---

## Example AnalysisResult JSON Schema

**(To enforce with LLM)**

```json
{
  "transcript": [{"speaker": "Rep", "start": 0.0, "end": 5.2, "text": "..."}],
  "sentimentGraph": [{"timeOffsetSec": 0, "score": 50}],
  "coaching": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "summary": "..."
  },
  "competitors": [{"name": "XCorp", "context": "...", "timestamp": 123}],
  "callScore": 72,
  "objections": [{"text": "...", "timestamp": 98, "repResponse": "..."}],
  "redFlags": [{"flag": "Budget", "level": "high"}],
  "nextSteps": ["..."]
}
```

**Use model schema validation (or JSON schema validate) on the returned LLM output.**

---

## Testing & QA Plan

- **Unit tests** for backend logic and workers
- **Integration tests** for upload → worker → DB flow (use small audio fixtures)
- **End-to-end**: Android upload → pending queue → approve → processing → report
- **Pilot QA**: deploy to 3 reps in the field, gather feedback in first 2 weeks

---

## Next Immediate Step (What to Code First)

**Sprint 0 + Sprint 1** — repo + DB + auth + call model + upload endpoint.

Then do **Sprint 2** (upload + storage) and **Sprint 3** (pending queue) — this gives you a functional loop: upload → pending → approve (but not yet AI). This is perfect for early demos and pilot signups.
