# LeadScout US Leads CRM (Node.js + MySQL + React 19 + Tailwind v4)

A high-performance CRM platform tracking **100 curated US businesses** (Hotels/Motels, Shops/Retail, and Contractors/Companies) without active websites.

---

## 🛠️ Tech Stack

- **Database:** MySQL 8.4 (`leadscout_db` database, indexed InnoDB tables with JSON support)
- **Backend:** Node.js (v24), Express 5, `mysql2/promise` connection pool
- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **UI Theme:** 3D Water Glass on White Canvas (zero GPU lag, 60 FPS)

---

## 🚀 Quick Start Guide

### 1. Database Setup (MySQL)
The backend automatically connects to MySQL, creates the database `leadscout_db`, sets up the `leads` table, and seeds all 100 default US leads if empty!

Database configuration in [`.env`](file:///d:/Project/.env):
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=leadscout_db
```

To manually run or re-seed the MySQL database:
```powershell
npm run db:init
```

### 2. Start the Node.js Backend Server
```powershell
npm run server
```
* Server runs on **`http://localhost:5000`**
* Live API health check: `http://localhost:5000/api/health`

### 3. Start the React Vite Frontend
In a separate terminal:
```powershell
npm run dev
```
* Frontend runs on **`http://localhost:5173`**
* Requests to `/api/*` are automatically proxied to the Node.js backend (`http://localhost:5000`).

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | MySQL connection status and server health |
| `GET` | `/api/stats` | Aggregated metrics (category breakdown, opportunity count, pipeline stages) |
| `GET` | `/api/leads` | List all leads (supports `?category=`, `?status=`, `?state=`, `?search=`, `?sortBy=`) |
| `GET` | `/api/leads/:id` | Get details of a single lead |
| `POST` | `/api/leads` | Create a new lead |
| `PUT` | `/api/leads/:id` | Update lead status, follow-up date, or details |
| `DELETE` | `/api/leads/:id` | Delete a lead from MySQL |
| `POST` | `/api/leads/batch` | Batch insert scraped leads from the 3D Radar Simulator |
| `POST` | `/api/leads/:id/notes` | Append outreach note to a lead |
| `POST` | `/api/leads/reset` | Truncate and restore default 100 curated US businesses |

---

## 🗄️ Database Schema ([`server/schema.sql`](file:///d:/Project/server/schema.sql))

```sql
CREATE DATABASE IF NOT EXISTS leadscout_db;
USE leadscout_db;

CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  sub_category VARCHAR(128) NULL,
  city VARCHAR(128) NULL,
  state VARCHAR(32) NULL,
  address VARCHAR(255) NULL,
  phone VARCHAR(64) NULL,
  owner_name VARCHAR(128) NULL,
  rating DECIMAL(3, 1) DEFAULT 0.0,
  reviews_count INT DEFAULT 0,
  website_status VARCHAR(128) DEFAULT 'No Website Found',
  opportunity_score INT DEFAULT 90,
  estimated_revenue VARCHAR(64) NULL,
  pitch_angle TEXT NULL,
  status VARCHAR(64) DEFAULT 'new',
  followup_date VARCHAR(64) NULL,
  tags JSON NULL,
  notes JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_state (state),
  INDEX idx_opp_score (opportunity_score)
);
```
