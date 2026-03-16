-- Bảng cấu hình
CREATE TABLE IF NOT EXISTS wedding_config (
  id               INTEGER PRIMARY KEY DEFAULT 1,
  groom_name       TEXT    DEFAULT 'Chú Rể',
  bride_name       TEXT    DEFAULT 'Cô Dâu',
  wedding_date     TIMESTAMPTZ,
  tagline          TEXT    DEFAULT 'Chúng tôi sắp kết hôn',
  hero_image_url   TEXT,
  primary_color    TEXT    DEFAULT '#E8A0A0',
  ceremony_name    TEXT,
  ceremony_address TEXT,
  ceremony_maps    TEXT,
  reception_name   TEXT,
  reception_address TEXT,
  reception_maps   TEXT,
  dress_code       TEXT,
  bank_name        TEXT,
  bank_account     TEXT,
  bank_owner       TEXT,
  bank_qr_url      TEXT,
  show_timeline    BOOLEAN DEFAULT true,
  show_gallery     BOOLEAN DEFAULT true,
  show_bank        BOOLEAN DEFAULT true,
  show_rsvp        BOOLEAN DEFAULT true,
  show_invite_card BOOLEAN DEFAULT true,
  updated_at       TIMESTAMPTZ DEFAULT now()
);
INSERT INTO wedding_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Timeline
CREATE TABLE IF NOT EXISTS wedding_timeline (
  id          SERIAL PRIMARY KEY,
  icon        TEXT    NOT NULL DEFAULT '💕',
  event_date  TEXT    NOT NULL,
  title       TEXT    NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
INSERT INTO wedding_timeline (icon, event_date, title, description, sort_order) VALUES
  ('👀', 'Tháng 3, 2020', 'Lần đầu gặp nhau', 'Chúng tôi tình cờ gặp nhau tại một buổi tiệc của bạn chung.', 1),
  ('☕', 'Tháng 6, 2020', 'Buổi hẹn đầu tiên', 'Một ly cà phê nhỏ đã mở ra cả một thế giới.', 2),
  ('💍', 'Tháng 12, 2023', 'Lời cầu hôn', 'Dưới ánh đèn lung linh, anh đã quỳ xuống.', 3),
  ('💒', 'Tháng 6, 2025', 'Đám cưới', 'Ngày chúng tôi nói lời "Tôi nguyện".', 4)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS wedding_gallery (
  id         SERIAL PRIMARY KEY,
  image_url  TEXT    NOT NULL,
  caption    TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_rsvp (
  id           SERIAL PRIMARY KEY,
  guest_name   TEXT    NOT NULL,
  guest_count  INTEGER NOT NULL DEFAULT 1,
  session      TEXT    NOT NULL DEFAULT 'both',
  has_children BOOLEAN DEFAULT false,
  message      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_tasks (
  id           SERIAL PRIMARY KEY,
  category     TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     DATE,
  assigned_to  TEXT,
  status       TEXT DEFAULT 'todo',
  priority     TEXT DEFAULT 'medium',
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_budget (
  id            SERIAL PRIMARY KEY,
  category      TEXT    NOT NULL,
  item_name     TEXT    NOT NULL,
  estimated     NUMERIC(15,0) DEFAULT 0,
  actual        NUMERIC(15,0) DEFAULT 0,
  paid          NUMERIC(15,0) DEFAULT 0,
  vendor_name   TEXT,
  vendor_phone  TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE wedding_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gallery  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvp     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_tasks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_budget  ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_config   ON wedding_config   FOR SELECT USING (true);
CREATE POLICY public_read_timeline ON wedding_timeline FOR SELECT USING (true);
CREATE POLICY public_read_gallery  ON wedding_gallery  FOR SELECT USING (true);
CREATE POLICY public_insert_rsvp   ON wedding_rsvp     FOR INSERT WITH CHECK (true);
CREATE POLICY public_read_rsvp     ON wedding_rsvp     FOR SELECT USING (true);

CREATE POLICY admin_update_config   ON wedding_config   FOR UPDATE USING (true);
CREATE POLICY admin_insert_timeline ON wedding_timeline FOR INSERT WITH CHECK (true);
CREATE POLICY admin_update_timeline ON wedding_timeline FOR UPDATE USING (true);
CREATE POLICY admin_delete_timeline ON wedding_timeline FOR DELETE USING (true);
CREATE POLICY admin_insert_gallery  ON wedding_gallery  FOR INSERT WITH CHECK (true);
CREATE POLICY admin_delete_gallery  ON wedding_gallery  FOR DELETE USING (true);
CREATE POLICY admin_delete_rsvp     ON wedding_rsvp     FOR DELETE USING (true);
CREATE POLICY admin_all_tasks      ON wedding_tasks   FOR ALL USING (true);
CREATE POLICY admin_all_budget     ON wedding_budget  FOR ALL USING (true);

INSERT INTO wedding_tasks (category, title, due_date, priority, status) VALUES
  ('Địa điểm', 'Khảo sát và đặt cọc nhà hàng/hội trường', NULL, 'high', 'todo'),
  ('Địa điểm', 'Xác nhận sơ đồ bàn tiệc', NULL, 'medium', 'todo'),
  ('Trang phục', 'Chọn váy cưới cô dâu', NULL, 'high', 'todo'),
  ('Trang phục', 'Thuê/mua vest chú rể', NULL, 'high', 'todo'),
  ('Trang phục', 'Trang phục phù dâu phù rể', NULL, 'medium', 'todo'),
  ('Ảnh/Video', 'Đặt lịch chụp ảnh cưới ngoại cảnh', NULL, 'high', 'todo'),
  ('Ảnh/Video', 'Thuê nhiếp ảnh gia ngày cưới', NULL, 'high', 'todo'),
  ('Ảnh/Video', 'Thuê quay phim', NULL, 'medium', 'todo'),
  ('Hoa & Decor', 'Chọn hoa trang trí sân khấu', NULL, 'medium', 'todo'),
  ('Hoa & Decor', 'Hoa cầm tay cô dâu', NULL, 'medium', 'todo'),
  ('Âm nhạc', 'Thuê MC', NULL, 'high', 'todo'),
  ('Âm nhạc', 'Thuê ban nhạc / DJ', NULL, 'medium', 'todo'),
  ('Ẩm thực', 'Thử menu tiệc cưới', NULL, 'high', 'todo'),
  ('Ẩm thực', 'Chọn bánh cưới', NULL, 'medium', 'todo'),
  ('Thiệp', 'Thiết kế và in thiệp mời', NULL, 'medium', 'todo'),
  ('Thiệp', 'Gửi thiệp cho khách', NULL, 'medium', 'todo'),
  ('Tuần trăng mật', 'Đặt vé máy bay / khách sạn tuần trăng mật', NULL, 'low', 'todo')
ON CONFLICT DO NOTHING;

INSERT INTO wedding_budget (category, item_name, estimated, status) VALUES
  ('Địa điểm', 'Thuê hội trường / nhà hàng', 80000000, 'pending'),
  ('Địa điểm', 'Trang trí sân khấu & bàn tiệc',20000000,'pending'),
  ('Ẩm thực', 'Tiệc cưới (per head)',50000000,'pending'),
  ('Ẩm thực', 'Bánh cưới',5000000,'pending'),
  ('Ảnh/Video', 'Chụp ảnh cưới ngoại cảnh',15000000,'pending'),
  ('Ảnh/Video', 'Nhiếp ảnh ngày cưới',12000000,'pending'),
  ('Ảnh/Video', 'Quay phim',10000000,'pending'),
  ('Trang phục', 'Váy cưới cô dâu',20000000,'pending'),
  ('Trang phục', 'Vest chú rể',8000000,'pending'),
  ('Trang phục', 'Trang điểm cô dâu',5000000,'pending'),
  ('Hoa & Decor', 'Hoa tươi trang trí',10000000,'pending'),
  ('Âm nhạc', 'MC',5000000,'pending'),
  ('Âm nhạc', 'Ban nhạc / DJ',8000000,'pending'),
  ('Thiệp', 'Thiết kế và in thiệp',2000000,'pending'),
  ('Khác', 'Quà cảm ơn phù dâu phù rể',3000000,'pending'),
  ('Khác', 'Xe hoa',5000000,'pending'),
  ('Tuần trăng mật', 'Vé máy bay + khách sạn',30000000,'pending')
ON CONFLICT DO NOTHING;
