# SmartBus Database Schema (Production Ready)

This document describes the SQLite database structure for the SmartBus application. The database is stored locally as `busgo.db`.

## Design Principles
- **Auditability**: Every table includes `created_at` and `updated_at`.
- **Integrity**: Proper Foreign Key constraints and non-nullable fields.
- **Performance**: Indices on search columns (emails, locations, dates).

---

## Tables

### 1. `users`
Stores all account information for passengers and administrators.
- **id** (Integer, PK): Primary Identifier.
- **name** (String, NOT NULL): Full name.
- **email** (String, UNIQUE, INDEX): Used for login and notifications.
- **phone** (String): Optional contact number.
- **hashed_password** (String): Bcrypt hashed password.
- **is_active** (Boolean, DEFAULT True): For account suspension.
- **is_admin** (Boolean, DEFAULT False): Permission flag.
- **is_verified** (Boolean, DEFAULT False): Email verification flag.
- **created_at** (DateTime): Join date.
- **updated_at** (DateTime): Last profile update.

### 2. `buses`
Physical buses owned by the agency.
- **id** (Integer, PK): Primary Identifier.
- **name** (String): Identifier name (e.g., "Airavat Express").
- **category** (String): Type (e.g., "Sleeper", "AC Semi-Deluxe").
- **vehicle_number** (String, UNIQUE): Government registration number.
- **total_seats** (Integer, DEFAULT 40): Total capacity.
- **created_at**, **updated_at**: Audit timestamps.

### 3. `trips`
Scheduled journeys between two locations.
- **id** (Integer, PK): Primary Identifier.
- **bus_id** (Integer, FK -> buses.id): The bus assigned to this trip.
- **source** (String, INDEX): Origin city.
- **destination** (String, INDEX): Destination city.
- **departure_time** (DateTime, INDEX): When the bus leaves.
- **arrival_time** (DateTime): Estimated arrival.
- **price** (Float): Ticket cost.
- **is_cancelled** (Boolean, DEFAULT False): Soft cancellation flag.

### 4. `bookings`
Successful ticket reservations.
- **id** (Integer, PK): Primary Identifier.
- **user_id** (Integer, FK -> users.id): Who booked it.
- **trip_id** (Integer, FK -> trips.id): Which trip.
- **seat_numbers** (String): Comma-separated list of seats.
- **total_amount** (Float): Total price paid.
- **payment_status** (String): [pending, paid, failed].
- **status** (String): [booked, cancelled].
- **boarding_point** (String): Specific stop for boarding.
- **dropping_point** (String): Specific stop for dropping.
- **qr_code_path** (String): Path to the generated ticket QR.
- **booking_time** (DateTime).

### 5. `trip_stops`
Intermediate stops for a trip to allow multi-point boarding.
- **id** (Integer, PK).
- **trip_id** (Integer, FK -> trips.id).
- **location** (String).
- **arrival_time** (DateTime).
- **order** (Integer): Sequence in the journey (0, 1, 2...).

### 6. `otps`
Temporary codes for authentication/verification.
- **id** (Integer, PK).
- **email** (String, INDEX).
- **code** (String).
- **expires_at** (DateTime).
