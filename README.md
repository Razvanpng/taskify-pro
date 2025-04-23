# Taskify Pro – Smart Task & Time Management for Students

**Taskify Pro** is a modern web application designed to help students efficiently manage their academic workload and personal activities. It combines task tracking, calendar planning, and intelligent reminders into a sleek, intuitive platform.

## ✨ Features

- 🗓 **Interactive Calendar View**  
  Visualize tasks and events by day, week, or month with smooth transitions.

- ✅ **Task Management**  
  Add, edit, and organize tasks with categories and priority levels.

- ⏰ **Smart Notifications**  
  Receive reminders before deadlines and important events.

- 📊 **Productivity Analytics**  
  Track your progress and analyze how you allocate time.

- 🎨 **Theme Customization**  
  Light and dark modes, plus fully responsive design.

- 🔐 **Authentication**  
  Secure login with JWT and session management.

## 🧑‍💻 Tech Stack

- **Framework:** Next.js (App Router) with TypeScript  
- **Styling:** TailwindCSS  
- **State Management:** React Hooks & Context API  
- **Database:** (to be integrated) – ready for Firebase, Supabase, or MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Notifications:** Browser-based or Firebase-compatible push support

## 📁 Project Structure (Simplified)

```
taskify-pro/
├── app/                # App routing and page logic
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helper functions
├── public/             # Static assets
├── styles/             # Tailwind config and custom styles
├── package.json        # Project metadata and scripts
├── next.config.mjs     # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (or npm/yarn)
- Optional: Firebase/Supabase account for backend integration

### Installation

```bash
git clone https://github.com/Razvanpng/taskify-pro.git
cd taskify-pro
pnpm install
```

### Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔧 Configuration

You may add an `.env.local` file for backend/API integrations:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
JWT_SECRET=your_jwt_secret
```

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

## 🧩 Future Improvements

- Backend integration (Firebase/Supabase/MongoDB)
- Drag-and-drop task reordering
- Mobile PWA support
- User roles and collaboration

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Razvanpng/taskify-pro/issues) or contact me at razvanstirbu@yahoo.com.

## 📝 License

MIT License  
Copyright © 2025 Știrbu Răzvan
