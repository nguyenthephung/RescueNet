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
-- Hỗ trợ 4 trạng thái người dùng:
-- 1. Chưa đăng nhập (Anonymous): reporter_id = NULL, device_id != NULL, verification_level = 0, priority = low
-- 2. Chưa đăng nhập nhưng xác thực SĐT: reporter_id = NULL, device_id != NULL, phone_number != NULL, verification_level = 1, priority = normal
-- 3. Đăng nhập nhưng chưa xác thực SĐT: reporter_id != NULL, phone_number = NULL, verification_level = 1, priority = normal
-- 4. Đăng nhập + xác thực SĐT: reporter_id != NULL, phone_number != NULL, verification_level = 2, priority = high/critical
CREATE TABLE incidents (
    incident_id SERIAL PRIMARY KEY,
    reporter_id INT REFERENCES users(user_id),  -- NULL cho anonymous users (case 1, 2)
    device_id VARCHAR(100),  -- track thiết bị cho tất cả users (unique identifier)
    phone_number VARCHAR(20),  -- SĐT xác thực qua OTP (NULL nếu chưa xác thực)
    verification_level INT DEFAULT 0,  -- 0: anonymous, 1: phone/account verified, 2: full verified (logged + phone)
    incident_type VARCHAR(50) NOT NULL,  -- medical, fire, flood, security, accident, other
    description TEXT,  -- Mô tả chi tiết tình huống khẩn cấp
    media_url TEXT,  -- link ảnh/video (JSON array, e.g. ["url1", "url2"])
    gps_lat DOUBLE PRECISION NOT NULL,  -- Vị trí GPS (gửi 1 lần khi countdown kết thúc)
    gps_lng DOUBLE PRECISION NOT NULL,
    gps_accuracy DOUBLE PRECISION,  -- độ chính xác GPS (meters)
    severity INT DEFAULT 1,  -- mức độ nghiêm trọng: 1-5 (tính toán bởi AI/Rules)
    priority VARCHAR(20) DEFAULT 'normal',  -- low, normal, high, critical (dựa vào verification_level)
    status VARCHAR(30) DEFAULT 'pending',  -- pending, sent, assigned, on_route, arrived, completed, cancelled
    eta INT,  -- thời gian dự kiến đội cứu hộ đến (phút)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng lưu lịch sử cập nhật vị trí (WebSocket updates mỗi 5 giây)
CREATE TABLE incident_location_history (
    history_id SERIAL PRIMARY KEY,
    incident_id INT REFERENCES incidents(incident_id) ON DELETE CASCADE,
    gps_lat DOUBLE PRECISION NOT NULL,
    gps_lng DOUBLE PRECISION NOT NULL,
    gps_accuracy DOUBLE PRECISION,
    recorded_at TIMESTAMP DEFAULT NOW()
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
