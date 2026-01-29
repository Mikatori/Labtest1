# 🧪 Virtual Environmental Lab

Một ứng dụng web tương tác để thực hành các thí nghiệm môi trường ảo. Học sinh có thể tiến hành các thí nghiệm về chất lượng nước, không khí, và nhiều chủ đề môi trường khác.

## ✨ Tính năng

### Labs Hiện tại
- **🔬 Lab 1: Phân tích Chất lượng Nước**  
  Đo pH, độ đục (turbidity), nhiệt độ và oxy hòa tan. Bao gồm visualization 3D của thiết bị lab và quiz kiểm tra kiến thức.

- **💨 Lab 2: Giám sát Chất lượng Không khí**  
  Đo CO2, PM2.5, PM10, nhiệt độ và độ ẩm. Tính toán AQI (Air Quality Index) real-time.

### UI/UX
- ✅ Dark mode và Light mode
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ 3D visualization với Three.js
- ✅ Step-by-step instructions cho mỗi thí nghiệm
- ✅ Quiz tương tác
- ✅ Lưu progress tự động (LocalStorage)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS v3
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd virtual-env-lab
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```
   
   Mở trình duyệt và truy cập: `http://localhost:5173`

4. **Build production**
   ```bash
   npm run build
   ```
   
   Build output sẽ có trong folder `dist/`

## 📂 Cấu trúc thư mục

```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (AppShell)
├── features/           # Feature-specific code
│   ├── dashboard/      # Dashboard page
│   └── labs/           # Lab modules
│       ├── Lab1Water/  # Water Quality Lab
│       └── Lab2Air/    # Air Quality Lab
├── store/              # Zustand global store
├── router.tsx          # React Router configuration
├── App.tsx             # Main App component
└── index.css           # Global styles (Tailwind)
```

## 🌐 Deployment trên GitHub Pages

1. **Tạo GitHub repository mới**

2. **Push code lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Vào Settings > Pages
   - Source: GitHub Actions

4. **Workflow tự động deploy**
   - Workflow đã được cấu hình sẵn trong `.github/workflows/deploy.yml`
   - Mỗi lần push lên `main` branch sẽ tự động build và deploy

## 📝 Roadmap

- [ ] Lab 3: Carbon Cycle Simulation
- [ ] Lab 4: Greenhouse Effect
- [ ] Lab 5: Soil & Microbes Analysis
- [ ] PDF Export cho báo cáo kết quả
- [ ] User authentication (optional)
- [ ] Backend API để lưu progress trên cloud

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - xem file LICENSE để biết chi tiết.

## 🙏 Credits

- Built with React, Three.js, and TailwindCSS
- Icons by Lucide React
- 3D rendering by React Three Fiber

