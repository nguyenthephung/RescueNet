# ==================================================
# HUONG DAN CHAY VOI DOCKER
# ==================================================

## CACH 1: CHAY TAT CA VOI DOCKER COMPOSE (KHUYEN DUNG)

### Buoc 1: Di chuyen vao thu muc project
cd d:\21126089(2)\RescueNet\demo

### Buoc 2: Build va chay tat ca services
docker-compose up --build

# Hoac chay background (detached mode):
docker-compose up -d --build

### Buoc 3: Xem logs
docker-compose logs -f

# Xem logs chi 1 service:
docker-compose logs -f auth-service

### Buoc 4: Stop tat ca
docker-compose down

# Stop va xoa volumes:
docker-compose down -v

---

## CACH 2: CHAY TUNG SERVICE VOI DOCKER

### 1. Build images
docker-compose build

### 2. Start Neo4j
docker-compose up -d neo4j

### 3. Start Auth Service
docker-compose up -d auth-service

### 4. Start Profile Service
docker-compose up -d profile-service

### 5. Start API Gateway
docker-compose up -d api-gateway

### 6. Kiem tra services dang chay
docker-compose ps

---

## LENH HUU ICH

### Xem logs realtime
docker-compose logs -f

### Restart 1 service
docker-compose restart auth-service

### Stop 1 service
docker-compose stop auth-service

### Rebuild 1 service
docker-compose up -d --build auth-service

### Xoa tat ca (containers + images + volumes)
docker-compose down --rmi all -v

### Xem resource usage
docker stats

---

## KIEM TRA SAU KHI CHAY

### 1. Kiem tra tat ca containers
docker ps

### 2. Test endpoints
curl http://localhost:8888/api/v1/auth/introspect
curl http://localhost:8080/auth/actuator/health
curl http://localhost:8081/profile/actuator/health

### 3. Neo4j Browser
# Mo browser: http://localhost:7474
# Username: neo4j
# Password: 12345678

---

## TROUBLESHOOTING

### Port da duoc su dung
netstat -ano | findstr "8080 8081 8888"
# Kill process: taskkill /PID <PID> /F

### Container khong start
docker-compose logs auth-service
docker-compose restart auth-service

### Rebuild hoan toan
docker-compose down -v
docker-compose build --no-cache
docker-compose up

---

## SO SANH: DOCKER VS SCRIPT

### DOCKER (docker-compose):
- Thoi gian khoi dong: 2-5 phut
- Hot reload: KHONG (phai rebuild)
- Debug: KHO
- Logs: docker logs
- Use case: Test integration, Demo, Production-like

### SCRIPT (start-all-services.ps1):
- Thoi gian khoi dong: 30-60 giay
- Hot reload: CO (Spring DevTools)
- Debug: DE (attach truc tiep)
- Logs: Terminal truc quan
- Use case: Development hang ngay

---

## KHUYEN NGHI

Development hang ngay:
  .\start-all-services.ps1

Test integration truoc khi commit:
  docker-compose up --build

Demo cho team:
  docker-compose up -d

Production:
  docker-compose -f docker-compose.prod.yml up -d
