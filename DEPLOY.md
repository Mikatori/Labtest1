# 🚀 Hướng dẫn Deploy lên GitHub

## Bước 1: Tạo GitHub Repository

### Option A: Qua GitHub Website
1. Mở https://github.com/new
2. Repository name: `virtual-env-lab`
3. Chọn **Public**
4. **KHÔNG** check "Initialize with README" (vì đã có sẵn)
5. Click "Create repository"

### Option B: Qua GitHub CLI (nếu đã cài)
```bash
gh repo create virtual-env-lab --public --source=. --remote=origin
```

## Bước 2: Connect và Push

### Copy URL của repo vừa tạo
Ví dụ: `https://github.com/YOUR_USERNAME/virtual-env-lab.git`

### Chạy các lệnh sau trong terminal:

```bash
# Di chuyển vào thư mục project
cd C:\Users\canht\.gemini\antigravity\scratch\virtual-env-lab

# Thêm remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/virtual-env-lab.git

# Rename branch sang main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

## Bước 3: Enable GitHub Pages

1. Vào repository trên GitHub
2. Click **Settings** (tab trên cùng)
3. Scroll xuống menu bên trái, click **Pages**
4. Ở **Source**, chọn: **GitHub Actions**
5. **Save** (nếu có nút)

## Bước 4: Verify Deployment

1. Click vào tab **Actions** (trên repository)
2. Bạn sẽ thấy workflow "Deploy to GitHub Pages" đang chạy
3. Đợi khoảng 2-3 phút cho đến khi có ✅ (success)
4. Quay lại **Settings > Pages**
5. Bạn sẽ thấy URL: `https://YOUR_USERNAME.github.io/virtual-env-lab/`
6. Click vào URL để xem trang web đã deploy!

## Troubleshooting

### Nếu deploy fail:
1. Check tab Actions để xem error log
2. Verify file `.github/workflows/deploy.yml` tồn tại
3. Ensure repository Settings > Pages > Source = GitHub Actions

### Nếu page shows 404:
1. Đợi thêm vài phút (propagation delay)
2. Hard refresh browser (Ctrl + Shift + R)
3. Clear browser cache

### Nếu CSS/JS không load:
- Đã set `base: './'` trong vite.config.ts ✅

## Update Code Sau Này

Khi bạn muốn update code:

```bash
# 1. Make changes to your code
# 2. Add and commit
git add .
git commit -m "Your update message"

# 3. Push
git push

# GitHub Actions sẽ tự động deploy lại!
```

## 🎉 Done!

Sau khi hoàn thành các bước trên, Virtual Environmental Lab của bạn sẽ live trên internet và ai cũng có thể truy cập!
