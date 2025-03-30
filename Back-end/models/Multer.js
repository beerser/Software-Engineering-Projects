const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('ไฟล์ที่อัปโหลดไม่ถูกต้อง'));
      }
      cb(null, true);
    }
  });
  