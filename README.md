# Habit Tracker Backend

Kişisel alışkanlık takibi için sıfırdan yazılmış bir REST API. Kullanıcılar
alışkanlık ekleyebilir, günlük olarak işaretleyebilir, streak (seri) ve
haftalık istatistiklerini görebilir.

Bu proje, hazır bir Backend-as-a-Service (Supabase gibi) kullanmadan;
authentication, veritabanı şeması ve API katmanının sıfırdan nasıl
kurulduğunu öğrenmek amacıyla geliştirildi.

## Kullanılan Teknolojiler

- **TypeScript** — tip güvenli backend geliştirme
- **Express** — HTTP sunucusu ve routing
- **PostgreSQL** — ilişkisel veritabanı (Docker ile çalıştırılıyor)
- **Prisma** — ORM, şema yönetimi ve migration
- **bcrypt** — şifre hashleme
- **jsonwebtoken (JWT)** — stateless oturum yönetimi

## Özellikler

- Kullanıcı kayıt/giriş (kendi yazılmış auth sistemi, JWT tabanlı)
- Alışkanlık oluşturma, listeleme, güncelleme, silme
- Günlük "yaptım" işaretleme
- Haftalık özet ve streak (kesintisiz seri) hesaplama
- Sahiplik kontrolü ile route koruma (bir kullanıcı başka bir kullanıcının
  verisine erişemez)

## Kurulum

### Gereksinimler
- Node.js (v18+)
- Docker

### Adımlar

1. Repoyu klonla:
```
   git clone https://github.com/enesaygur/habit-tracker-backend.git
   cd habit-tracker-backend
```

2. Bağımlılıkları kur:
```
   npm install
```

3. PostgreSQL'i Docker ile ayağa kaldır:
```
   docker run --name habit-tracker-db -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=habittracker -p 5432:5432 -d postgres
```

4. `.env` dosyası oluştur:
```
   DATABASE_URL="postgresql://postgres:devpassword@localhost:5432/habittracker"
   JWT_SECRET="your-secret-key"
```

5. Veritabanı şemasını uygula:
```
   npx prisma migrate dev
```

6. Sunucuyu başlat:
```
   npm run dev
```

Sunucu `http://localhost:3000` adresinde çalışacaktır.

## API Endpoint'leri

### Auth
| Method | Endpoint | Açıklama | Korumalı mı |
|---|---|---|---|
| POST | `/auth/register` | Yeni kullanıcı kaydı | Hayır |
| POST | `/auth/login` | Giriş, JWT token döner | Hayır |
| GET | `/auth/me` | Giriş yapan kullanıcının bilgisi | Evet |

### Habits
| Method | Endpoint | Açıklama | Korumalı mı |
|---|---|---|---|
| POST | `/habits` | Yeni alışkanlık oluştur | Evet |
| GET | `/habits` | Kullanıcının alışkanlıklarını listele | Evet |
| PUT | `/habits/:id` | Alışkanlığı güncelle | Evet |
| DELETE | `/habits/:id` | Alışkanlığı sil | Evet |
| POST | `/habits/:id/log` | Bugün için işaretle | Evet |
| GET | `/habits/:id/stats` | Haftalık özet ve streak | Evet |

Korumalı endpoint'ler için `Authorization: Bearer <token>` header'ı gereklidir.

## Veri Modeli

```
User (1) ──< (çok) Habit (1) ──< (çok) Habitlog
```

Bir kullanıcının birden fazla alışkanlığı, bir alışkanlığın birden fazla
günlük kaydı olabilir. `Habitlog` üzerinde `(habitId, date)` kombinasyonu
unique — aynı gün için birden fazla kayıt oluşturulamaz.

## Uygulanan Güvenlik Pratikleri

- Şifreler asla düz metin olarak saklanmaz, bcrypt ile hashlenir
- JWT token'lar sınırlı süreyle geçerlidir
- Her korumalı route, middleware üzerinden token doğrulaması yapar
- Kullanıcılar sadece kendi verilerine erişebilir (sahiplik kontrolü,
  IDOR koruması)
- `.env` dosyası ile gizli bilgiler kod dışında tutulur