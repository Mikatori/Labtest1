# Virtual Environmental Lab - Hướng dẫn Test

## Cách test ứng dụng

### 1. Chạy Development Server

Mở terminal trong thư mục project:
```bash
npm run dev
```

Sau đó mở trình duyệt và truy cập `http://localhost:5173`

### 2. Test Dashboard

- ✅ Kiểm tra theme toggle (nút 🌙/🌞) hoạt động
- ✅ Kiểm tra 5 lab cards hiển thị đúng
- ✅ Click vào từng card để test navigation

### 3. Test Lab 1: Water Quality Analysis

**Bước 1: Navigate to Lab**
- Click vào card "Water Quality Analysis"
- Verify URL đổi thành `/lab/water-quality`

**Bước 2: Test 3D Scene**
- 3D beaker phải hiển thị với nước màu xanh (neutral pH)
- Có thể drag để rotate view (OrbitControls)
- pH meter probe hiển thị trên beaker

**Bước 3: Test Interactive Controls**
- Thay đổi pH slider (0-14): Màu nước thay đổi
  - pH < 6: Đỏ (Acidic)
  - pH 6.5-8.5: Xanh (Neutral)
  - pH > 8: Xanh lá (Alkaline)
- Click "Tiếp theo" để sang bước 2

**Bước 4: Test Turbidity**
- Thay đổi turbidity slider (0-100)
- Màu nước đục dần khi turbidity tăng
- Click "Tiếp theo"

**Bước 5: Test Temperature & DO**
- Thay đổi nhiệt độ và oxy hòa tan
- Click "Tiếp theo"

**Bước 6: Test Results**
- Xem tổng kết các measurements
- Water quality status hiển thị (Tốt/Trung bình/Kém)

**Bước 7: Test Quiz**
- Click "Làm bài kiểm tra"
- Quiz modal mở ra với 3 câu hỏi
- Chọn đáp án và click "Nộp bài"
- Xem kết quả (số câu đúng/sai)
- Click "Hoàn thành"

### 4. Test Lab 2: Air Quality Monitoring

**Navigate:**
- Quay lại Dashboard
- Click "Air Quality Monitoring"

**Test 3D Scene:**
- Air quality monitor device hiển thị
- Display screen show CO2, PM2.5, PM10 values
- Indicator light thay đổi màu theo chất lượng không khí
- Particles hiển thị khi PM2.5 cao

**Test Controls:**
- Bước 1: CO2 slider (300-2000 ppm)
- Bước 2: PM2.5 và PM10 sliders
- Bước 3: Temperature & Humidity
- Bước 4: View summary và AQI status

### 5. Test Responsive Design

**Desktop:**
- Layout 2 cột (3D scene bên trái, controls bên phải)

**Mobile/Tablet:**
- Mở DevTools > Toggle device toolbar
- Chọn iPhone hoặc iPad
- Layout phải stack vertically
- All controls phải scrollable

### 6. Test Dark Mode

- Click toggle theme button ở header
- Tất cả components phải chuyển màu
- 3D scene background đổi màu
- Text readable trong cả light và dark mode

### 7. Test Navigation

- Click "Quay lại Dashboard" trong mỗi lab
- Navigate giữa các labs
- Browser back/forward buttons hoạt động

## Expected Results Checklist

- [ ] Dashboard loads without errors
- [ ] Theme toggle works
- [ ] Lab 1 3D scene renders
- [ ] Lab 1 interactive controls work
- [ ] Lab 1 quiz functions properly
- [ ] Lab 2 3D scene renders
- [ ] Lab 2 controls work
- [ ] Responsive design works on mobile
- [ ] Dark mode works everywhere
- [ ] No console errors

## Troubleshooting

**3D Scene không hiển thị:**
- Check console for WebGL errors
- Try different browser (Chrome/Edge recommended)

**Build errors:**
- Delete `node_modules` và `package-lock.json`
- Run `npm install` lại

**State không lưu:**
- Check browser localStorage
- Clear cache và thử lại
