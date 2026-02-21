-- ============================================================
-- FleetFlow — Demo Seed Data
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ============================================================

-- ── 1. VEHICLES ─────────────────────────────────────────────
INSERT INTO vehicles (id, name, license_plate, model, type, max_capacity_kg, odometer_km, status, region, acquisition_cost, created_at)
VALUES
  ('aaaa0001-0000-0000-0000-000000000001', 'Mumbai Carrier 01',  'MH-01-AB-1234', 'Tata Prima 4030S',      'Truck', 15000,  45356, 'Available', 'Mumbai',    2800000, '2024-01-10 08:00:00+00'),
  ('aaaa0001-0000-0000-0000-000000000002', 'Gujarat Express',    'GJ-05-CD-5678', 'Mahindra Bolero Pickup','Van',    2000,  32245, 'On Trip',   'Ahmedabad',  950000, '2024-02-14 09:30:00+00'),
  ('aaaa0001-0000-0000-0000-000000000003', 'Rajasthan Hauler',   'RJ-09-EF-9012', 'Ashok Leyland 4923',   'Truck', 18000,  78312, 'In Shop',   'Jaipur',    3100000, '2024-01-22 07:15:00+00'),
  ('aaaa0001-0000-0000-0000-000000000004', 'Delhi Rider',        'DL-04-GH-3456', 'Bajaj Pulsar 150',     'Bike',    150,  12648, 'Available', 'Delhi',       85000, '2024-03-05 10:00:00+00'),
  ('aaaa0001-0000-0000-0000-000000000005', 'Nasik Van',          'MH-15-IJ-7890', 'Tata Ace Gold',        'Van',    1200,  25380, 'Available', 'Nashik',     520000, '2024-02-28 11:30:00+00'),
  ('aaaa0001-0000-0000-0000-000000000006', 'Bangalore Titan',    'KA-03-KL-2345', 'Eicher Pro 6031',      'Truck', 20000,  56420, 'On Trip',   'Bangalore', 3500000, '2024-01-05 06:45:00+00'),
  ('aaaa0001-0000-0000-0000-000000000007', 'Chennai Swift',      'TN-07-MN-6789', 'Maruti Super Carry',   'Van',    1500,  18450, 'Available', 'Chennai',    480000, '2024-03-18 08:20:00+00'),
  ('aaaa0001-0000-0000-0000-000000000008', 'Old Workhorse',      'MH-09-OP-0123', 'Tata 407',             'Truck', 10000, 110280, 'Retired',   'Pune',      1200000, '2023-08-01 07:00:00+00')
ON CONFLICT (id) DO NOTHING;


-- ── 2. DRIVERS ──────────────────────────────────────────────
INSERT INTO drivers (id, full_name, phone, license_number, license_expiry, license_category, status, safety_score, complaints, completed_trips, total_trips, notes, created_at)
VALUES
  ('bbbb0002-0000-0000-0000-000000000001', 'Ramesh Kumar',   '9823401001', 'MH0120190001', '2027-06-30', 'Truck', 'On Duty',   92,  1, 48, 50, 'Senior driver, handles long hauls',   '2024-01-11 08:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000002', 'Suresh Patel',   '9712302002', 'GJ0220200012', '2026-11-15', 'Van',   'On Duty',   85,  2, 30, 32, NULL,                                  '2024-02-15 09:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000003', 'Vikram Singh',   '9811203003', 'RJ0920180023', '2025-04-20', 'Truck', 'Off Duty',  78,  3, 22, 26, 'On personal leave until Mar 2026',    '2024-01-23 07:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000004', 'Anil Sharma',    '9910104004', 'DL0420210034', '2028-09-10', 'Bike',  'On Duty',   95,  0, 60, 61, 'Best safety record in fleet',         '2024-03-06 10:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000005', 'Mohan Das',      '9823405005', 'MH1520220045', '2026-03-10',   'Van','Off Duty',  60,  5, 12, 18, 'Under review for multiple complaints','2024-03-01 11:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000006', 'Pradeep Yadav',  '9900306006', 'KA0320210056', '2027-03-25', 'Truck', 'On Duty',   88,  1, 35, 37, NULL,                                  '2024-01-06 06:45:00+00'),
  ('bbbb0002-0000-0000-0000-000000000007', 'Ravi Krishnan',  '9874407007', 'TN0720190067', '2026-07-14', 'Van',   'On Duty',   90,  0, 44, 45, 'Prefers city routes',                 '2024-03-19 08:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000008', 'Sunil Gupta',    '9876508008', 'DL0920200078', '2025-12-31', 'Truck', 'Suspended', 45, 10,  8, 15, 'Suspended pending investigation',     '2024-02-10 09:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000009', 'Dinesh Patil',   '9823409009', 'MH0120230089', '2029-02-28', 'Bike',  'On Duty',   88,  0, 20, 21, NULL,                                  '2024-04-01 10:00:00+00'),
  ('bbbb0002-0000-0000-0000-000000000010', 'Kiran Mehta',    '9711310010', 'GJ0120220090', '2028-05-18', 'Truck', 'On Duty',   82,  2, 29, 31, NULL,                                  '2024-02-20 08:30:00+00')
ON CONFLICT (id) DO NOTHING;


-- ── 3. TRIPS ────────────────────────────────────────────────
-- distance_km is GENERATED ALWAYS AS (end_odometer_km - start_odometer_km) STORED
-- so we never insert it directly.
INSERT INTO trips (id, vehicle_id, driver_id, origin, destination, cargo_weight_kg, status, start_odometer_km, end_odometer_km, revenue, estimated_fuel_cost, cargo_description, created_at)
VALUES
  -- Vehicle 1 (Tata Prima) completed trips
  ('cccc0003-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'bbbb0002-0000-0000-0000-000000000001',
   'Mumbai',  'Pune',    8500, 'Completed', 45000, 45180, 18000, 2800, 'FMCG goods',         '2025-09-05 06:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000001', 'bbbb0002-0000-0000-0000-000000000001',
   'Pune',    'Mumbai',  9200, 'Completed', 45180, 45356, 17500, 2730, 'Auto components',    '2025-09-12 07:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000001', 'bbbb0002-0000-0000-0000-000000000001',
   'Mumbai',  'Nagpur',  7800, 'On Way',    45356, NULL,  22000, 4200, 'Textile goods',      '2026-02-18 05:30:00+00'),

  -- Vehicle 2 (Mahindra Bolero) completed + on way
  ('cccc0003-0000-0000-0000-000000000004', 'aaaa0001-0000-0000-0000-000000000002', 'bbbb0002-0000-0000-0000-000000000002',
   'Ahmedabad','Surat',  1800, 'Completed', 32000, 32245, 12500, 1800, 'Pharmaceutical',     '2025-10-01 08:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000002', 'bbbb0002-0000-0000-0000-000000000002',
   'Surat',   'Vadodara',1400, 'On Way',    32245, NULL,  9000,  1400, 'Packaged food',      '2026-02-19 09:00:00+00'),

  -- Vehicle 3 (Ashok Leyland) completed (now in shop)
  ('cccc0003-0000-0000-0000-000000000006', 'aaaa0001-0000-0000-0000-000000000003', 'bbbb0002-0000-0000-0000-000000000003',
   'Ahmedabad','Rajkot',12000, 'Completed', 78000, 78312, 21000, 4100, 'Building material',  '2025-11-15 06:30:00+00'),

  ('cccc0003-0000-0000-0000-000000000007', 'aaaa0001-0000-0000-0000-000000000003', 'bbbb0002-0000-0000-0000-000000000010',
   'Rajkot',  'Jaipur', 14000, 'Completed', 78312, 78730, 28000, 5600, 'Steel coils',        '2025-12-03 05:00:00+00'),

  -- Vehicle 4 (Bike) completed + pending
  ('cccc0003-0000-0000-0000-000000000008', 'aaaa0001-0000-0000-0000-000000000004', 'bbbb0002-0000-0000-0000-000000000004',
   'Delhi',   'Gurgaon',   80, 'Completed', 12500, 12535, 1200,   180, 'Documents',          '2025-10-20 10:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000009', 'aaaa0001-0000-0000-0000-000000000004', 'bbbb0002-0000-0000-0000-000000000004',
   'Gurgaon', 'Faridabad',  90, 'Completed', 12535, 12578, 1400,  210, 'Electronics spares', '2025-11-05 09:30:00+00'),

  ('cccc0003-0000-0000-0000-000000000010', 'aaaa0001-0000-0000-0000-000000000004', 'bbbb0002-0000-0000-0000-000000000009',
   'Delhi',   'Noida',      70, 'Pending',   NULL,  NULL,  1000,  150, 'Courier packages',   '2026-02-21 08:00:00+00'),

  -- Vehicle 5 (Tata Ace) multiple completed + cancelled
  ('cccc0003-0000-0000-0000-000000000011', 'aaaa0001-0000-0000-0000-000000000005', 'bbbb0002-0000-0000-0000-000000000007',
   'Mumbai',  'Nashik',   900, 'Completed', 25000, 25190, 9500,  1600, 'Beverages',          '2025-08-20 07:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000012', 'aaaa0001-0000-0000-0000-000000000005', 'bbbb0002-0000-0000-0000-000000000007',
   'Nashik',  'Aurangabad',1100, 'Completed', 25190, 25380, 10500, 1750, 'Dairy products',   '2025-09-08 07:30:00+00'),

  ('cccc0003-0000-0000-0000-000000000013', 'aaaa0001-0000-0000-0000-000000000005', 'bbbb0002-0000-0000-0000-000000000007',
   'Mumbai',  'Pune',      700, 'Cancelled', NULL,  NULL,  0,     0,   'Cancelled — driver unavailable', '2025-10-10 06:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000014', 'aaaa0001-0000-0000-0000-000000000005', 'bbbb0002-0000-0000-0000-000000000002',
   'Nashik',  'Mumbai',   850, 'Pending',   NULL,  NULL,  9000,  1550, 'Garments',           '2026-02-21 09:00:00+00'),

  -- Vehicle 6 (Eicher Titan) completed + on way
  ('cccc0003-0000-0000-0000-000000000015', 'aaaa0001-0000-0000-0000-000000000006', 'bbbb0002-0000-0000-0000-000000000006',
   'Bangalore','Mysore',  15000,'Completed', 56000, 56145, 16000, 2700, 'Machinery parts',   '2025-10-25 05:45:00+00'),

  ('cccc0003-0000-0000-0000-000000000016', 'aaaa0001-0000-0000-0000-000000000006', 'bbbb0002-0000-0000-0000-000000000006',
   'Mysore',  'Coimbatore',16000,'Completed',56145, 56420, 22000, 4000, 'Construction goods','2025-12-14 06:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000017', 'aaaa0001-0000-0000-0000-000000000006', 'bbbb0002-0000-0000-0000-000000000006',
   'Coimbatore','Bangalore',17000,'On Way', 56420, NULL,  25000, 4500, 'Industrial equipment','2026-02-20 05:00:00+00'),

  -- Vehicle 7 (Maruti Carry) completed + pending
  ('cccc0003-0000-0000-0000-000000000018', 'aaaa0001-0000-0000-0000-000000000007', 'bbbb0002-0000-0000-0000-000000000007',
   'Chennai', 'Pondicherry',1200,'Completed',18000, 18225, 11000, 1700, 'Medical supplies',  '2025-09-30 07:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000019', 'aaaa0001-0000-0000-0000-000000000007', 'bbbb0002-0000-0000-0000-000000000007',
   'Pondicherry','Madurai',1350,'Completed',18225, 18450, 12500, 1800, 'Frozen goods',      '2025-11-20 08:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000020', 'aaaa0001-0000-0000-0000-000000000007', 'bbbb0002-0000-0000-0000-000000000009',
   'Chennai', 'Vellore',  1100,'Pending',   NULL,  NULL,  8500,  1300, 'E-commerce returns','2026-02-21 10:00:00+00'),

  -- Vehicle 8 (Retired — old completed + cancelled)
  ('cccc0003-0000-0000-0000-000000000021', 'aaaa0001-0000-0000-0000-000000000008', 'bbbb0002-0000-0000-0000-000000000003',
   'Pune',    'Kolhapur', 8000,'Completed',110000,110280, 14000, 3200, 'Building materials', '2025-06-10 06:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000022', 'aaaa0001-0000-0000-0000-000000000008', 'bbbb0002-0000-0000-0000-000000000003',
   'Pune',    'Solapur',  7500,'Cancelled', NULL,  NULL,  0,     0,   'Vehicle breakdown',  '2025-07-15 07:00:00+00'),

  -- Additional cross-vehicle trips for richer analytics
  ('cccc0003-0000-0000-0000-000000000023', 'aaaa0001-0000-0000-0000-000000000001', 'bbbb0002-0000-0000-0000-000000000001',
   'Mumbai',  'Nashik',   9000,'Completed', 44700, 44880, 15000, 2400, 'Steel rods',         '2025-07-22 06:00:00+00'),

  ('cccc0003-0000-0000-0000-000000000024', 'aaaa0001-0000-0000-0000-000000000005', 'bbbb0002-0000-0000-0000-000000000002',
   'Aurangabad','Mumbai', 1050,'Completed', 24800, 24998, 10000, 1650, 'Spare parts',        '2025-08-05 07:45:00+00'),

  ('cccc0003-0000-0000-0000-000000000025', 'aaaa0001-0000-0000-0000-000000000006', 'bbbb0002-0000-0000-0000-000000000010',
   'Bangalore','Hyderabad',18000,'Completed',55500, 56000, 32000, 6000, 'Electronic goods',  '2025-08-18 05:00:00+00')
ON CONFLICT (id) DO NOTHING;


-- ── 4. MAINTENANCE LOGS ─────────────────────────────────────
INSERT INTO maintenance_logs (id, vehicle_id, service_type, description, cost, service_date, mechanic, is_completed)
VALUES
  ('dddd0004-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'Oil Change',        'Synthetic 15W-40 engine oil replacement',     3200, '2025-08-01', 'Rajesh Auto Works',   TRUE),
  ('dddd0004-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000001', 'Tyre Rotation',     'All four tyres rotated and balanced',          1800, '2025-10-15', 'MobiQuick Tyres',     TRUE),
  ('dddd0004-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000001', 'Brake Inspection',  'Front brake pads replaced',                    5500, '2026-01-10', 'Rajesh Auto Works',   TRUE),
  ('dddd0004-0000-0000-0000-000000000004', 'aaaa0001-0000-0000-0000-000000000001', 'Engine Tune-Up',    'Scheduled 50000 km service due',              12000, '2026-03-01', 'Tata Authorised',     FALSE),

  ('dddd0004-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000002', 'Oil Change',        'Engine oil + filter change',                   2800, '2025-09-20', 'Mahindra Workshop',   TRUE),
  ('dddd0004-0000-0000-0000-000000000006', 'aaaa0001-0000-0000-0000-000000000002', 'AC Repair',         'AC compressor replaced',                       9500, '2025-12-05', 'Cool Car Services',   TRUE),

  ('dddd0004-0000-0000-0000-000000000007', 'aaaa0001-0000-0000-0000-000000000003', 'Engine Overhaul',   'Full engine overhaul after breakdown',        48000, '2026-01-20', 'Ashok Leyland ASC',   FALSE),
  ('dddd0004-0000-0000-0000-000000000008', 'aaaa0001-0000-0000-0000-000000000003', 'Clutch Replacement','Clutch plate + pressure plate set replaced',  18000, '2025-11-30', 'Ashok Leyland ASC',   TRUE),

  ('dddd0004-0000-0000-0000-000000000009', 'aaaa0001-0000-0000-0000-000000000004', 'Oil Change',        'Bike engine oil change',                        650, '2025-10-05', 'Bajaj Service',       TRUE),
  ('dddd0004-0000-0000-0000-000000000010', 'aaaa0001-0000-0000-0000-000000000004', 'Chain Replacement', 'Drive chain + sprocket set replaced',          2100, '2026-01-22', 'Bajaj Service',       TRUE),

  ('dddd0004-0000-0000-0000-000000000011', 'aaaa0001-0000-0000-0000-000000000005', 'Oil Change',        '10W-30 engine oil replacement',                2200, '2025-08-28', 'Tata Workshop',       TRUE),
  ('dddd0004-0000-0000-0000-000000000012', 'aaaa0001-0000-0000-0000-000000000005', 'Suspension Check',  'Front suspension bushings replaced',           6800, '2025-12-18', 'Sharma Mechanics',    TRUE),

  ('dddd0004-0000-0000-0000-000000000013', 'aaaa0001-0000-0000-0000-000000000006', 'Oil Change',        'Diesel engine oil + air filter service',       3800, '2025-09-10', 'Eicher Authorised',   TRUE),
  ('dddd0004-0000-0000-0000-000000000014', 'aaaa0001-0000-0000-0000-000000000006', 'Tyre Replacement',  'Two rear tyres replaced (worn)',               22000, '2025-11-25', 'Apollo Tyres Hub',    TRUE),
  ('dddd0004-0000-0000-0000-000000000015', 'aaaa0001-0000-0000-0000-000000000006', 'Fuel System Clean', 'Fuel injector cleaning + diesel filter swap',   5200, '2026-02-01', 'Eicher Authorised',   FALSE),

  ('dddd0004-0000-0000-0000-000000000016', 'aaaa0001-0000-0000-0000-000000000007', 'Oil Change',        'Full synthetic engine oil change',              2400, '2025-10-12', 'Maruti Suzuki ASC',   TRUE),
  ('dddd0004-0000-0000-0000-000000000017', 'aaaa0001-0000-0000-0000-000000000007', 'Battery Replacement','12V battery replaced',                         4200, '2026-01-08', 'Maruti Suzuki ASC',   TRUE),

  ('dddd0004-0000-0000-0000-000000000018', 'aaaa0001-0000-0000-0000-000000000008', 'Final Service',     'Pre-retirement full service and inspection',    8500, '2025-06-01', 'Tata Workshop',       TRUE)
ON CONFLICT (id) DO NOTHING;


-- ── 5. FUEL LOGS ────────────────────────────────────────────
-- Linked to completed trips so fuel efficiency line chart can compute km/L
-- (distance_km is auto-generated from odometer; liters > 0 required for km/L calc)
INSERT INTO fuel_logs (id, vehicle_id, trip_id, liters, total_cost, misc_expense, fuel_date)
VALUES
  -- Vehicle 1 trips
  ('eeee0005-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', 'cccc0003-0000-0000-0000-000000000001', 25.0, 2800,  380, '2025-09-05'),
  ('eeee0005-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000001', 'cccc0003-0000-0000-0000-000000000002', 24.5, 2730,  350, '2025-09-12'),
  ('eeee0005-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000001', 'cccc0003-0000-0000-0000-000000000023', 22.0, 2400,  310, '2025-07-22'),

  -- Vehicle 2 trips
  ('eeee0005-0000-0000-0000-000000000004', 'aaaa0001-0000-0000-0000-000000000002', 'cccc0003-0000-0000-0000-000000000004', 18.0, 1980,  220, '2025-10-01'),

  -- Vehicle 3 trips
  ('eeee0005-0000-0000-0000-000000000005', 'aaaa0001-0000-0000-0000-000000000003', 'cccc0003-0000-0000-0000-000000000006', 42.0, 4620,  500, '2025-11-15'),
  ('eeee0005-0000-0000-0000-000000000006', 'aaaa0001-0000-0000-0000-000000000003', 'cccc0003-0000-0000-0000-000000000007', 55.0, 6050,  620, '2025-12-03'),

  -- Vehicle 4 (Bike) trips
  ('eeee0005-0000-0000-0000-000000000007', 'aaaa0001-0000-0000-0000-000000000004', 'cccc0003-0000-0000-0000-000000000008',  1.6,  178,   30, '2025-10-20'),
  ('eeee0005-0000-0000-0000-000000000008', 'aaaa0001-0000-0000-0000-000000000004', 'cccc0003-0000-0000-0000-000000000009',  1.9,  211,   35, '2025-11-05'),

  -- Vehicle 5 trips
  ('eeee0005-0000-0000-0000-000000000009', 'aaaa0001-0000-0000-0000-000000000005', 'cccc0003-0000-0000-0000-000000000011', 14.0, 1540,  190, '2025-08-20'),
  ('eeee0005-0000-0000-0000-000000000010', 'aaaa0001-0000-0000-0000-000000000005', 'cccc0003-0000-0000-0000-000000000012', 13.5, 1488,  185, '2025-09-08'),
  ('eeee0005-0000-0000-0000-000000000011', 'aaaa0001-0000-0000-0000-000000000005', 'cccc0003-0000-0000-0000-000000000024', 14.8, 1628,  200, '2025-08-05'),

  -- Vehicle 6 trips
  ('eeee0005-0000-0000-0000-000000000012', 'aaaa0001-0000-0000-0000-000000000006', 'cccc0003-0000-0000-0000-000000000015', 20.0, 2200,  300, '2025-10-25'),
  ('eeee0005-0000-0000-0000-000000000013', 'aaaa0001-0000-0000-0000-000000000006', 'cccc0003-0000-0000-0000-000000000016', 38.0, 4180,  480, '2025-12-14'),
  ('eeee0005-0000-0000-0000-000000000014', 'aaaa0001-0000-0000-0000-000000000006', 'cccc0003-0000-0000-0000-000000000025', 78.0, 8580, 1000, '2025-08-18'),

  -- Vehicle 7 trips
  ('eeee0005-0000-0000-0000-000000000015', 'aaaa0001-0000-0000-0000-000000000007', 'cccc0003-0000-0000-0000-000000000018', 18.0, 1980,  240, '2025-09-30'),
  ('eeee0005-0000-0000-0000-000000000016', 'aaaa0001-0000-0000-0000-000000000007', 'cccc0003-0000-0000-0000-000000000019', 17.0, 1870,  225, '2025-11-20'),

  -- Vehicle 8 (Retired) — old trip
  ('eeee0005-0000-0000-0000-000000000017', 'aaaa0001-0000-0000-0000-000000000008', 'cccc0003-0000-0000-0000-000000000021', 38.0, 4180,  500, '2025-06-10')
ON CONFLICT (id) DO NOTHING;


-- ── Verify row counts ────────────────────────────────────────
SELECT 'vehicles'         AS tbl, COUNT(*) FROM vehicles
UNION ALL
SELECT 'drivers',                  COUNT(*) FROM drivers
UNION ALL
SELECT 'trips',                    COUNT(*) FROM trips
UNION ALL
SELECT 'maintenance_logs',         COUNT(*) FROM maintenance_logs
UNION ALL
SELECT 'fuel_logs',                COUNT(*) FROM fuel_logs;
