import sqlite3

conn = sqlite3.connect('e:\\bus_booking\\server\\busgo.db')
cursor = conn.cursor()

# Trip 7: Hyderabad -> Palakollu
stops_7 = [
    (7, 'Hyderabad', None, 0),
    (7, 'Suryapet', None, 1),
    (7, 'Vijayawada', None, 2),
    (7, 'Tanuku', None, 3),
    (7, 'Palakollu', None, 4)
]

# Trip 4: Palakollu -> Hyderabad
stops_4 = [
    (4, 'Palakollu', None, 0),
    (4, 'Tanuku', None, 1),
    (4, 'Vijayawada', None, 2),
    (4, 'Suryapet', None, 3),
    (4, 'Hyderabad', None, 4)
]

print("Seeding trip stops...")
cursor.executemany("INSERT INTO trip_stops (trip_id, location, arrival_time, \"order\") VALUES (?, ?, ?, ?)", stops_7 + stops_4)

conn.commit()
conn.close()
print("Stops seeded successfully!")
