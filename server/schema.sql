-- =======================================================
-- LeadScout MySQL Database Schema
-- US Businesses (Hotels, Shops, Companies) Without Websites
-- =======================================================

CREATE DATABASE IF NOT EXISTS leadscout_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

