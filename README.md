# 🏎️ Fastlytics 

*A lightning-fast platform for Formula 1 fans to explore historical data, compare drivers, and simulate race strategies – no engineering degree required.*  

---

## 🚀 Features  

### 🏁 **Core Features**  
- **Lap Time Comparisons**: Compare drivers’ laps side-by-side (e.g., *Hamilton vs. Verstappen at Monaco*).  
- **Gear Shift Visualization**: See how drivers attack corners with animated gear shift maps.  
- **Tire Strategy Breakdowns**: Analyze pit stop efficiency and compound performance.  
- **Position Change Graphs**: Relive epic battles with lap-by-lap position swings.  
- **Track Evolution Analysis**: Watch how lap times drop as rubber builds up on the circuit.  

---

## 🛠️ Tech Stack  

| **Category**       | **Tools**                                                                 |  
|---------------------|---------------------------------------------------------------------------|  
| **Frontend**        | React, Tailwind CSS, shadcn/ui, Lucide React, Custom Charts     |  
| **Backend**         | Fast-F1 API, Supabase (Auth + PostgreSQL), Cloudflare R2 (Storage)       |  
| **Infrastructure**  | Docker, Vercel/Cloudflare Pages, Redis (Caching)                          |  
| **Misc**            | Python (Data Processing), GitHub Actions (CI/CD), Sentry (Error Tracking) |  

---

## ⚡ Quick Start  

### Prerequisites  
- Node.js v18+  
- Python 3.10+  
- Docker (for local Supabase/PostgreSQL)  

### Installation  
1. Clone the repo:  
   ```bash  
   git clone https://github.com/subhashhhhhh/Fastlytics.git  
   ```  

2. Install dependencies:  
   ```bash    
   npm install  
   pip install -r requirements.txt  
   ```  

3. Configure environment variables:  
   ```bash  
   cp .env.example .env.local  
   # Add your Supabase/R2 credentials  
   ```  

4. Start the dev server:  
   ```bash  
   npm run dev  
   ```  

---

## 🤝 Contributing  
**We welcome pit crew members!**  
1. Fork the repository.  
2. Create a branch: `git checkout -b feature/brazilian-gp-2023`.  
3. Commit changes: `git commit -m "Added Hamilton’s magic telemetry"`.  
4. Push: `git push origin feature/brazilian-gp-2023`.  
5. Submit a PR.  

*No toxic rivalries allowed – this is a Ferrari/Mercedes/Red Bull neutral zone.* 🏳️  

---

## 📜 License  
MIT License – *Do whatever you want, but don’t blame us if your AI predicts Stroll as 2024 champion.*  

---

## 🙏 Acknowledgments  
- **Fast-F1**: For the incredible Python library that makes this possible.  
- **Supabase**: For auth and database.  
- **You**: For not asking why we included the 2022 Ferrari strategy engine.  

---

*Built with ❤️ and excessive caffeine by Subhash Gottumukkala.*  

---
