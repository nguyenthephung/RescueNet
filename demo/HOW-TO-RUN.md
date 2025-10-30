# CACH CHAY SERVICES

## CACH 1: SCRIPT (DEVELOPMENT - KHUYEN DUNG)

```powershell
.\start-all.ps1
```

Loi ich:
- Hot reload khi sua code
- Debug de dang
- Khoi dong nhanh (30-60s)
- Xem logs truc quan

---

## CACH 2: DOCKER (TEST/DEMO)

```powershell
# Chay tat ca
docker-compose up --build

# Hoac chay background
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Stop
docker-compose down
```

Loi ich:
- Giong production
- 1 lenh chay tat ca
- Test integration

---

## KIEM TRA

```powershell
# Test services
curl http://localhost:8888/api/v1/auth/introspect
curl http://localhost:8080/auth/actuator/health
curl http://localhost:8081/profile/actuator/health

# Neo4j Browser
# http://localhost:7474
# User: neo4j | Pass: 12345678
```

---

## STOP SERVICES

### Voi script:
Dong tat ca cua so PowerShell

### Voi Docker:
```powershell
docker-compose down
```
