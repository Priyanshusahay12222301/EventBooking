# Event Booking System — Flowchart

This file contains a Mermaid flowchart that visualizes the user, admin, frontend, backend, and database flows for the Event Booking System (React + Node.js + MongoDB).

Below is the Mermaid source. Use VS Code's Mermaid preview or a Mermaid renderer to view the diagram. To export an SVG, copy the Mermaid block into a `.mmd` file (provided as `flowchart.mmd`) and use `mmdc` (mermaid-cli).

```mermaid
flowchart TB
  subgraph User[User (Visitor)]
    U1(Browse Events)
    U2(View Event Details)
    U3(Book Tickets)
    U4(View Bookings)
  end

  subgraph Admin[Admin]
    A1(Admin Login)
    A2(Create/Edit Events)
    A3(View All Bookings)
  end

  subgraph Frontend[React Frontend]
    F1[Home (/)]
    F2[Event Details (/events/:id)]
    F3[My Bookings (/bookings)]
    F4[Admin Dashboard (/admin)]
  end

  subgraph Backend[Node/Express API]
    B1[/api/events]
    B2[/api/events/:id]
    B3[/api/bookings]
    B4[/api/auth]
  end

  subgraph DB[MongoDB]
    D1[(Users)]
    D2[(Events)]
    D3[(Bookings)]
  end

  U1 --> F1
  F1 -->|GET /api/events| B1
  B1 --> D2

  U2 --> F2
  F2 -->|GET /api/events/:id| B2
  B2 --> D2

  U3 --> F2
  F2 -->|POST /api/bookings (auth)| B3
  B3 --> D3
  B3 -->|decrement availableSeats| D2

  F3 -->|GET /api/bookings/user/:id (auth)| B3
  B3 --> D3

  A1 --> F4
  F4 -->|POST /api/auth/login| B4
  B4 --> D1

  F4 -->|POST /api/events (admin)| B1
  F4 -->|PUT/DELETE /api/events/:id (admin)| B2
  F4 -->|GET /api/bookings (admin)| B3

  classDef userFill fill:#f9f,stroke:#333,stroke-width:1px;
  class User userFill

  %% Notes (renderers may show notes differently)
  note over D1,D2,D3: Collections: Users, Events, Bookings\nKey fields:\nUsers: _id, name, email, password, role\nEvents: _id, title, description, date, time, location, price, totalSeats, availableSeats\nBookings: _id, userId, eventId, quantity, status, paymentStatus, createdAt
```

---

Legend

- Arrows show primary HTTP requests between layers.
- `(auth)` indicates requests that require JWT authentication.
- Admin routes require role-based authorization.

How to preview/export

1. In VS Code, install the "Markdown Preview Mermaid Support" or use the "Mermaid Preview" extension to preview `flowchart.md` directly.
2. To export an SVG from the Mermaid source file (`flowchart.mmd`) install mermaid-cli:

```powershell
npm install -g @mermaid-js/mermaid-cli
```

Then:

```powershell
mmdc -i docs\flowchart.mmd -o docs\flowchart.svg
```

(If `mmdc` rejects a fenced Markdown file, use the provided `flowchart.mmd` which contains only the mermaid source.)

---

Notes

- I saved a pure Mermaid source file `flowchart.mmd` next to this Markdown file to make exporting easier.
- Tell me if you want additional sequence diagrams (e.g., booking sequence with payment gateway) or a condensed one-page PNG for documentation.
