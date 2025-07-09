# 🧭 Campus Compas — School/Institution Recommendation System

Campus Compass is a web-based recommendation system designed to help anyone find the most suitable instutution based on preferences such as location, type, fee range and facilities.

It also allows schools to register and upload their licences for verification before creating an account and appearing in the system.



### 📌 **Features**
   - 🔍 School recommendation based on user preference
   - 📁 File upload
   - 📋 Admin panel (School info update)
   - 🔐 Authentication with Supabase
   - 📬 Future intergration for email notifications and approval system
   - 🔄 Automatic deployment from Git
   - 📊 CRUD operations

### 🛠️ **Tech Stack**
- Frontend: *HTML, CSS, JS*
- Backend: *Supabase* (https://supabase.com/)
- Deployment: *Netlify* (https://netlify.com/)
        
## 🚀 How to Run the Project
1. 🖥️ Install Dependencies
   ```bash
   npm install
   ```
   
3. ⚙️ Create a Supabse Project
   - Go to (Supabase.io)
   
a. Clone this repo to XAMPP's `htdocs` folder
```bash
git clone git@github.com:Stacyy-Were/CampusCompas.git
```
b. Start Apache & MySQL via the XAMPP Control Panel
c. Create the Database
- Go to (https://localhost/phpmyadmin)
- Create a database named `campus`
- Import the `campus.sql` to create the `contants` table
  
```bash
  CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100),
  telephone VARCHAR(20),
  institution VARCHAR(100),
  license_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
```
d. Access the Web App
- Open your browser
- Visit (http://localhost/CampusCompas/index.html)

### 📌 Future Improvements
- Add school recommendation algorithm (content-based filtering)
- Approval dashboard for admin verification
- Email notifications (e.g., via PHPMailer or SMTP)
- Search filters by fee, rating, distance, etc.
- Responsive and mobile-friendly design (partially done)

Admin panel (http://localhost/CampusCompas/admin/admin.php)
        
