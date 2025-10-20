-- =========================================================
-- DATABASE: Rescue Emergency Management System (REMS)
-- PostgreSQL version
-- =========================================================

-- ===============================
-- 1. USERS & ROLES
-- ===============================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role_id INT REFERENCES roles(role_id),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, banned
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 2. CITIZEN REPORTS (SOS)
-- ===============================
CREATE TABLE incidents (
    incident_id SERIAL PRIMARY KEY,
    reporter_id INT REFERENCES users(user_id),
    incident_type VARCHAR(50) NOT NULL,  -- fire, flood, health, etc.
    description TEXT,
    media_url TEXT, -- link ảnh/video
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    severity INT DEFAULT 1,  -- mức độ nghiêm trọng (AI/Rules)
    status VARCHAR(30) DEFAULT 'pending',  -- pending, assigned, completed
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incident_feedback (
    feedback_id SERIAL PRIMARY KEY,
    incident_id INT REFERENCES incidents(incident_id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 3. DISPATCH & TASKS
-- ===============================
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    incident_id INT REFERENCES incidents(incident_id),
    assigned_team_id INT,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high
    status VARCHAR(20) DEFAULT 'assigned', -- assigned, on_route, completed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dispatch_rules (
    rule_id SERIAL PRIMARY KEY,
    region VARCHAR(100),
    incident_type VARCHAR(50),
    priority_weight INT,
    auto_assign BOOLEAN DEFAULT TRUE
);

-- ===============================
-- 4. RESCUE TEAMS
-- ===============================
CREATE TABLE rescue_teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    team_type VARCHAR(50), -- ambulance, firefighter, police
    status VARCHAR(20) DEFAULT 'available', -- available, busy, offline
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION
);

CREATE TABLE team_members (
    team_member_id SERIAL PRIMARY KEY,
    team_id INT REFERENCES rescue_teams(team_id),
    user_id INT REFERENCES users(user_id),
    role_in_team VARCHAR(50)
);

CREATE TABLE medical_records (
    record_id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(task_id),
    vitals JSONB, -- ví dụ: {"pulse":90,"bp":"120/80"}
    notes TEXT,
    media_url TEXT,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 5. RESOURCES & LOGISTICS
-- ===============================
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50),
    status VARCHAR(30) DEFAULT 'available', -- available, in_use, maintenance
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    driver_id INT REFERENCES users(user_id)
);

CREATE TABLE medical_devices (
    device_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    quantity INT DEFAULT 1,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'available'
);

CREATE TABLE warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location TEXT
);

CREATE TABLE supply_requests (
    request_id SERIAL PRIMARY KEY,
    requester_id INT REFERENCES users(user_id),
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    item_name VARCHAR(100),
    quantity INT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- 6. VOLUNTEER MANAGEMENT
-- ===============================
CREATE TABLE volunteers (
    volunteer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    verified BOOLEAN DEFAULT FALSE,
    skills TEXT,
    certificates TEXT,
    region VARCHAR(100)
);

CREATE TABLE volunteer_schedules (
    schedule_id SERIAL PRIMARY KEY,
    volunteer_id INT REFERENCES volunteers(volunteer_id),
    shift_start TIMESTAMP,
    shift_end TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled'
);

-- ===============================
-- 7. COMMUNICATION (Chat / Voice)
-- ===============================
CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(user_id),
    receiver_id INT REFERENCES users(user_id),
    message TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    message_type VARCHAR(20) DEFAULT 'text' -- text, voice, video
);

CREATE TABLE calls (
    call_id SERIAL PRIMARY KEY,
    caller_id INT REFERENCES users(user_id),
    callee_id INT REFERENCES users(user_id),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    call_type VARCHAR(20) DEFAULT 'voice'
);

-- ===============================
-- 8. ADMIN & SECURITY
-- ===============================
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action VARCHAR(200),
    target_table VARCHAR(100),
    target_id INT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    token TEXT NOT NULL,
    expires_at TIMESTAMP
);

-- ===============================
-- 9. ANALYTICS / KPI
-- ===============================
CREATE TABLE kpi_stats (
    kpi_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100),
    metric_value DOUBLE PRECISION,
    recorded_at TIMESTAMP DEFAULT NOW()
);
