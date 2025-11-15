# Kafka Setup Guide - RescueNet

Hướng dẫn setup Kafka cho hệ thống microservices event-driven.

---

## 📋 Mục lục

1. [Cài đặt Kafka](#1-cài-đặt-kafka)
2. [Tạo Common Events Module](#2-tạo-common-events-module)
3. [Config Auth Service (Producer)](#3-config-auth-service-producer)
4. [Config Profile Service (Consumer)](#4-config-profile-service-consumer)
5. [Testing](#5-testing)

---

## 1. Cài đặt Kafka

### Bước 1: Tải Docker Desktop
- Download tại: https://www.docker.com/products/docker-desktop
- Cài đặt và khởi động Docker Desktop

### Bước 2: Tạo Network & Volume
```bash
docker network create kafka-net
docker volume create kafka-data
```

### Bước 3: Tạo file `server.properties`
Tạo file `server.properties` trong thư mục `backend/` với nội dung được cung cấp riêng.

**Lưu ý quan trọng:** Trong `server.properties`, cấu hình:
```properties
advertised.listeners=PLAINTEXT://localhost:9092
```
(Dùng `localhost` thay vì `kafka` để service ngoài Docker có thể connect)

### Bước 4: Generate Cluster ID
```bash
docker run --rm apache/kafka:4.1.0 /opt/kafka/bin/kafka-storage.sh random-uuid
```
Copy UUID được tạo ra (ví dụ: `MkU3OEVBNTcwNTJENDM2Qk`)

### Bước 5: Format Storage
```bash
docker run --rm -v kafka-data:/var/lib/kafka/data -v ${PWD}/server.properties:/tmp/server.properties apache/kafka:4.1.0 /opt/kafka/bin/kafka-storage.sh format -t <CLUSTER_ID> -c /tmp/server.properties
```
Thay `<CLUSTER_ID>` bằng UUID ở bước 4.

### Bước 6: Start Kafka Container
```bash
docker run -d --name kafka --network kafka-net -p 9092:9092 -v kafka-data:/var/lib/kafka/data -v ${PWD}/server.properties:/opt/kafka/config/server.properties apache/kafka:4.1.0 /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
```

### Bước 7: Verify Kafka đã chạy
```bash
# Xem logs
docker logs -f kafka

# List topics
docker exec -it kafka bash -lc "/opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092"
```

✅ Kafka đã sẵn sàng tại `localhost:9092`

---

## 2. Tạo Common Events Module

### Mục đích
Tạo shared library chứa các event models để:
- **Tái sử dụng code** giữa các services
- **Đảm bảo type safety** khi producer/consumer giao tiếp
- **Version control** schema của events

### Các bước thực hiện

#### Bước 1: Tạo Maven module
```bash
cd backend/common-events
mvn clean install
```

#### Bước 2: Cấu trúc
```
common-events/
├── pom.xml                          # Maven config với Jackson, Lombok
└── src/main/java/com/rescuenet/events/
    └── UserRegisteredEvent.java     # Event model cho user registration
```

#### Bước 3: Build và install
```bash
mvn clean install
```
Module sẽ được install vào Maven local repository (`~/.m2/repository/`)

**Rule:** Mọi thay đổi event model phải rebuild module này và update version trong các service sử dụng nó.

---

## 3. Config Auth Service (Producer)

### Vai trò
**Auth Service** publish events khi có sự kiện quan trọng xảy ra (ví dụ: user đăng ký).

### Cách hoạt động

```
User Register → Save to DB → Send OTP Email → Publish Event to Kafka → Done
```

### Config cần thiết

#### 1. Dependencies (`pom.xml`)
```xml
<!-- Spring Kafka -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>

<!-- Common Events -->
<dependency>
    <groupId>com.rescuenet</groupId>
    <artifactId>common-events</artifactId>
    <version>1.0.0</version>
</dependency>
```

#### 2. Kafka Config (`application.properties`)
```properties
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
spring.kafka.producer.key-serializer=StringSerializer
spring.kafka.producer.value-serializer=JsonSerializer
spring.kafka.producer.acks=all
spring.kafka.producer.retries=3
```

#### 3. Các thành phần chính

**KafkaProducerConfig.java**
- Configure Kafka producer factory
- Setup serialization (String key, JSON value)
- Enable idempotence (đảm bảo không duplicate messages)

**KafkaTopicConfig.java**
- Define topics: `rescuenet.user.registered`
- Define DLQ (Dead Letter Queue) cho failed messages

**UserEventPublisher.java**
- Service để publish events
- Build event từ User entity
- Send to Kafka với error handling

**UserService.java** (Modified)
- Inject `UserEventPublisher`
- Sau khi save user → gọi `publishUserRegisteredEvent(user)`

### Rules
1. **Không fail registration nếu Kafka fail** - User vẫn được tạo, chỉ log error
2. **Include correlation ID** - Để trace event trong distributed system
3. **Use userId làm partition key** - Ensure ordering cho events của cùng user

---

## 4. Config Profile Service (Consumer)

### Vai trò
**Profile Service** lắng nghe events từ Kafka và tự động tạo profile khi có user mới.

### Cách hoạt động

```
Kafka Topic → Consumer nhận event → Parse event → Create Profile in Neo4j → Acknowledge
```

### Config cần thiết

#### 1. Dependencies (`pom.xml`)
Same như Auth Service (spring-kafka + common-events)

#### 2. Kafka Config (`application.properties`)
```properties
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
spring.kafka.consumer.group-id=profile-service-group
spring.kafka.consumer.key-deserializer=StringDeserializer
spring.kafka.consumer.value-deserializer=JsonDeserializer
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.enable-auto-commit=false
```

#### 3. Các thành phần chính

**KafkaConsumerConfig.java**
- Configure consumer factory
- Setup deserialization
- Enable manual acknowledgment
- Set concurrency (number of consumer threads)

**UserEventConsumer.java**
- `@KafkaListener` để listen topic `rescuenet.user.registered`
- Parse `UserRegisteredEvent` từ Kafka
- Convert sang `ProfileCreationRequest`
- Gọi `UserProfileService.createProfileFromEvent()`
- Acknowledge message nếu thành công

**UserProfileService.java** (Modified)
- Thêm method `createProfileFromEvent()`
- Check duplicate (nếu profile đã tồn tại thì skip)
- Save profile vào Neo4j
- Return ProfileUserResponse

### Rules
1. **Manual acknowledgment** - Chỉ commit offset khi xử lý thành công
2. **Idempotency check** - Không tạo duplicate profiles
3. **Retry on failure** - Không acknowledge nếu fail → Kafka sẽ retry
4. **Concurrency = 2** - Xử lý 2 messages song song (có thể tăng nếu cần)

---

## 5. Testing

### Test End-to-End Flow

#### Bước 1: Start services
```bash
# Terminal 1: Auth Service
cd backend/auth-service
mvn spring-boot:run

# Terminal 2: Profile Service
cd backend/profile-service
mvn spring-boot:run
```

#### Bước 2: Register user
```bash
POST http://localhost:8080/identity/users/register
{
  "email": "test@example.com",
  "passwordHash": "password123",
  "fullName": "Test User",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+84123456789"
}
```

#### Bước 3: Kiểm tra logs

**Auth Service log:**
```
[INFO] Publishing UserRegisteredEvent for user: test@example.com
[INFO] Successfully published to partition: 0 offset: 42
```

**Profile Service log:**
```
[INFO] Received UserRegisteredEvent: userId=123, email=test@example.com
[INFO] Creating profile from event with correlationId: xxx
[INFO] Successfully created profile: userId=123
```

#### Bước 4: Verify profile đã được tạo
```bash
GET http://localhost:8081/profile/users/123
```

### Monitor Kafka

```bash
# View messages trong topic
docker exec -it kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic rescuenet.user.registered \
  --from-beginning

# Check consumer group lag
docker exec -it kafka kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group profile-service-group \
  --describe
```

---

## 📚 Kiến trúc tổng quan

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ POST /register
       ▼
┌─────────────────┐         ┌──────────────┐
│  Auth Service   │────────>│    Kafka     │
│  (Producer)     │ Publish │ localhost:9092│
└─────────────────┘  Event  └──────┬───────┘
       │                            │
       │ Save to PostgreSQL         │ Topic: rescuenet.user.registered
       ▼                            │
  ┌─────────┐                       │ Consume
  │  Users  │                       ▼
  │  Table  │              ┌─────────────────┐
  └─────────┘              │ Profile Service │
                           │   (Consumer)    │
                           └────────┬────────┘
                                    │ Save to Neo4j
                                    ▼
                              ┌──────────┐
                              │ Profiles │
                              │   Graph  │
                              └──────────┘
```

---

## ⚡ Lợi ích của Event-Driven Architecture

1. **Loose Coupling** - Services không phụ thuộc trực tiếp vào nhau
2. **Scalability** - Có thể scale consumer độc lập
3. **Resilience** - Một service down không ảnh hưởng service khác
4. **Async Processing** - User không phải đợi profile được tạo
5. **Event Sourcing** - Lưu lại lịch sử tất cả events

---

## 🔧 Troubleshooting

### Kafka không start được
- Check Docker Desktop đang chạy
- Check port 9092 chưa bị sử dụng: `netstat -ano | findstr 9092`
- Check logs: `docker logs kafka`

### Service không connect được Kafka
- Verify `KAFKA_BOOTSTRAP_SERVERS=localhost:9092` trong `.env`
- Check `advertised.listeners=PLAINTEXT://localhost:9092` trong `server.properties`
- Restart Kafka container

### Consumer không nhận messages
- Check consumer group đang hoạt động: `kafka-consumer-groups.sh --describe`
- Verify deserialization config đúng
- Check common-events dependency version match

### Profile không được tạo
- Check Profile Service logs có lỗi gì
- Verify Neo4j đang chạy và connection OK
- Check idempotency: profile có thể đã tồn tại rồi

---

**Tài liệu chi tiết:** Xem `KAFKA_IMPLEMENTATION.md` và `KAFKA_INTEGRATION_GUIDE.md`
