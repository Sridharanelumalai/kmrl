import sqlite3
import json
from datetime import datetime, timedelta
import random

class KMRLDatabase:
    def __init__(self, db_path="kmrl.db"):
        self.db_path = db_path
        self.init_database()
        self.populate_sample_data()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Trains table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trains (
                id INTEGER PRIMARY KEY,
                train_number TEXT UNIQUE,
                model TEXT,
                status TEXT,
                mileage INTEGER,
                depot_id INTEGER,
                health_score INTEGER,
                last_maintenance DATE,
                next_maintenance DATE,
                manufacturer TEXT,
                year_manufactured INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Maintenance records
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS maintenance_records (
                id INTEGER PRIMARY KEY,
                train_id INTEGER,
                type TEXT,
                status TEXT,
                scheduled_date DATE,
                completed_date DATE,
                estimated_hours INTEGER,
                actual_hours INTEGER,
                priority TEXT,
                technician TEXT,
                cost REAL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (train_id) REFERENCES trains (id)
            )
        ''')
        
        # Sensor data
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INTEGER PRIMARY KEY,
                train_id INTEGER,
                sensor_type TEXT,
                value REAL,
                unit TEXT,
                timestamp TIMESTAMP,
                is_anomaly BOOLEAN,
                FOREIGN KEY (train_id) REFERENCES trains (id)
            )
        ''')
        
        # Alerts
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY,
                train_id INTEGER,
                type TEXT,
                title TEXT,
                description TEXT,
                status TEXT,
                priority TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                acknowledged_at TIMESTAMP,
                resolved_at TIMESTAMP,
                FOREIGN KEY (train_id) REFERENCES trains (id)
            )
        ''')
        
        # Depots
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS depots (
                id INTEGER PRIMARY KEY,
                name TEXT,
                capacity INTEGER,
                current_occupancy INTEGER,
                location TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def populate_sample_data(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM trains")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return
        
        # Insert depots
        depots = [
            (1, "Aluva Depot", 15, 12, "Aluva"),
            (2, "Pettah Depot", 10, 8, "Pettah"),
            (3, "Kalamassery Depot", 12, 9, "Kalamassery")
        ]
        cursor.executemany("INSERT INTO depots VALUES (?, ?, ?, ?, ?)", depots)
        
        # Insert trains
        for i in range(1, 21):
            train_data = (
                i, f"KMRL-{str(i).zfill(3)}", 
                ["Metro-A1", "Metro-B2", "Metro-C3"][i % 3],
                ["Available", "Maintenance", "In Service"][i % 3],
                random.randint(25000, 55000),
                (i % 3) + 1,
                random.randint(60, 95),
                (datetime.now() - timedelta(days=random.randint(1, 30))).date(),
                (datetime.now() + timedelta(days=random.randint(1, 30))).date(),
                ["Alstom", "BEML", "Siemens"][i % 3],
                2020 + (i % 4)
            )
            cursor.execute("INSERT INTO trains VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", train_data)
        
        conn.commit()
        conn.close()
    
    def get_trains(self, status=None):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if status:
            cursor.execute("SELECT * FROM trains WHERE status = ?", (status,))
        else:
            cursor.execute("SELECT * FROM trains")
        
        trains = cursor.fetchall()
        conn.close()
        return trains
    
    def add_sensor_data(self, train_id, sensor_type, value, unit, is_anomaly=False):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sensor_data (train_id, sensor_type, value, unit, timestamp, is_anomaly)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (train_id, sensor_type, value, unit, datetime.now(), is_anomaly))
        
        conn.commit()
        conn.close()
    
    def get_alerts(self, status=None):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if status:
            cursor.execute("SELECT * FROM alerts WHERE status = ?", (status,))
        else:
            cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC")
        
        alerts = cursor.fetchall()
        conn.close()
        return alerts

db = KMRLDatabase()