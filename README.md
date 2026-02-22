# Blood Donation Hub

## Project Overview

Blood Donation Hub is a comprehensive web-based platform designed to streamline blood donation and request processes across Tamil Nadu, India. The application facilitates efficient coordination between blood donors, recipients, and blood banks, ensuring timely availability of blood units for those in critical need.

## Executive Summary

This platform addresses the critical challenge of blood availability by providing a centralized system for managing blood donations and requests. It features real-time blood inventory management, intelligent scheduling systems, and robust administrative controls to ensure seamless operations across multiple blood banks in Tamil Nadu.

## Technical Stack

### Backend
- **Runtime Environment**: Node.js
- **Framework**: Express.js v4.21.2
- **Database**: MongoDB with Mongoose ODM v8.12.1
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: Express-session with MongoDB store (connect-mongo)
- **Password Security**: bcryptjs for hashing and salting

### Frontend
- **Template Engine**: EJS (Embedded JavaScript)
- **Styling**: Custom CSS with responsive design principles
- **Client-Side**: Vanilla JavaScript

### Security & Middleware
- Flash messages for user notifications
- Password hashing with bcrypt
- Session-based authentication
- Role-based access control (User/Admin)

## System Architecture

### Database Models

#### 1. User Model
- Fields: username, email, password (hashed), role (user/admin)
- Pre-save hooks for automatic password hashing
- Password comparison methods for authentication

#### 2. BloodDonation Model
- Tracks donor information, health conditions, blood type, donation amount
- Status workflow: Pending → Accepted → Completed/Rejected
- Links to User and Schedule models

#### 3. BloodRequest Model
- Manages recipient requests with medical reasons
- Status workflow: Pending → Accepted → Completed/Rejected
- Includes blood amount and urgency tracking

#### 4. BloodBank Model
- Location-based inventory management
- Real-time tracking of all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Multiple address support per location
- Automatic timestamp updates

#### 5. Schedule Model
- Manages donation appointments
- Health screening information
- Time slot management with session-based allocation

#### 6. ScheduleRequest Model
- Handles recipient pickup schedules
- Prescription verification
- Address selection from available blood banks

#### 7. ConfirmedSchedule Model
- Archives completed transactions
- Maintains historical records for both donations and requests

## Core Features

### For Blood Donors

#### 1. Registration & Donation
- Comprehensive health questionnaire
- Blood type selection (8 types supported)
- Donation amount specification (100ml - 500ml)
- District-based registration (38 districts in Tamil Nadu)
- Health condition assessment with symptom tracking

#### 2. Scheduling System
- Three daily sessions (Morning, Afternoon, Evening)
- Time slot selection with availability management
- Blood bank address selection
- Pre-donation health checklist
- Schedule confirmation with declaration

#### 3. Status Tracking
- Real-time status updates (Pending, Accepted, Rejected, Completed)
- Schedule visibility with date, time, and location
- Schedule modification capabilities
- Completion notifications

### For Blood Recipients

#### 1. Blood Request Process
- Detailed recipient information collection
- Medical reason documentation (18 predefined categories + custom)
- Blood amount specification
- Urgent request handling

#### 2. Blood Availability Check
- Real-time inventory search across all blood banks
- Location-based sorting (user's district prioritized)
- Blood type matching
- Amount availability verification

#### 3. Request Scheduling
- District-based blood bank selection
- Session and time slot booking
- Prescription verification
- Address selection for pickup
- Confirmation workflow

#### 4. Status Management
- Request approval tracking
- Schedule confirmation
- Collection reminders
- Completion status

### Administrative Features

#### 1. Donation Management
- View all pending donation requests
- Detailed donor profiles with health information
- Accept/Reject functionality with immediate UI updates
- Gender-based profile visualization

#### 2. Request Management
- Review all blood requests
- Recipient information verification
- Medical reason assessment
- Approve/Reject decisions

#### 3. Schedule Administration

**Donation Schedules**
- View all confirmed donation appointments
- Donor details with contact information
- Health screening results
- Add Entry: Transfers donated blood to inventory
- Remove Entry: Cancels and notifies donor

**Request Schedules**
- View all confirmed pickup appointments
- Recipient information
- Blood allocation from inventory
- Stock deduction management
- Remove Entry: Cancels recipient schedule

#### 4. History Tracking
- Complete donation history
- Complete request history
- Statistical data for reporting
- Donor/Recipient profiles with age calculation

#### 5. Inventory Management
- Automatic stock updates on donation completion
- Automatic stock deduction on blood allocation
- Real-time availability tracking
- Location-based inventory separation

## User Workflows

### Donor Journey
1. Register/Login to the platform
2. Fill donation form with health details
3. Submit for admin approval
4. Receive approval notification
5. Check blood availability and schedule appointment
6. Fix schedule with preferred date, time, and location
7. Attend appointment at blood bank
8. Admin confirms donation and adds to inventory
9. Donation marked as completed

### Recipient Journey
1. Register/Login to the platform
2. Submit blood request form with medical reason
3. Wait for admin approval
4. Check blood availability across districts
5. Select blood bank with available stock
6. Schedule pickup appointment
7. Visit blood bank on scheduled date/time
8. Admin allocates blood from inventory
9. Request marked as completed

### Admin Workflow
1. Login with admin credentials
2. Review pending donation/request forms
3. Accept or reject based on criteria
4. Monitor scheduled appointments
5. Confirm donations and add to blood bank
6. Allocate blood to recipients
7. Manage inventory levels
8. Track completion history

## Security Implementation

### Authentication
- Passport.js local strategy
- Session-based authentication with MongoDB persistence
- Password hashing using bcrypt (salt rounds: 8)
- Secure session cookies

### Authorization
- Role-based access control (User vs Admin)
- Protected routes with authentication middleware
- Admin-only endpoints for management functions
- Session validation on every request

### Data Protection
- Password hashing on registration
- Pre-save hooks for automatic password security
- No plain text password storage
- Secure session management with configurable secrets

## API Endpoints

### Authentication Routes
- `GET /` - Login page
- `POST /login` - User authentication
- `GET /register` - Registration page
- `POST /register` - User registration
- `GET /logout` - User logout

### User Routes
- `GET /home` - User dashboard
- `GET /donate` - Donation form
- `POST /donate/donate` - Submit donation
- `GET /receive` - Request form
- `POST /receive/receive` - Submit request
- `GET /status` - Check submission status
- `GET /availability` - View blood availability
- `GET /contact` - About us page

### Schedule Routes
- `GET /schedule` - Donation schedule form
- `POST /schedule` - Submit donation schedule
- `GET /request-schedule/:district` - Request schedule form
- `POST /request-schedule` - Submit request schedule

### Admin Routes
- `GET /admin-home` - Admin dashboard
- `GET /admin/donations` - View donation requests
- `GET /admin/requests` - View blood requests
- `POST /admin/donations/:id/:status` - Update donation status
- `POST /admin/requests/:id/:status` - Update request status
- `GET /admin/schedule` - View donation schedules
- `GET /admin/receive-schedule` - View request schedules
- `POST /admin/add-blood/:scheduleId` - Add blood to inventory
- `DELETE /admin/remove-schedule/:scheduleId` - Cancel donation schedule
- `POST /admin/receive-blood/:scheduleId` - Allocate blood to recipient
- `DELETE /admin/remove-request/:scheduleId` - Cancel request schedule
- `GET /admin/donate-history` - View donation history
- `GET /admin/request-history` - View request history

### Delete Operations
- `DELETE /donate/delete-donation/:id` - Delete donation form
- `DELETE /receive/delete-request/:id` - Delete request form

## Database Schema Details

### User Collection
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user')
}
```

### BloodDonation Collection
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  gender: String,
  phone: String,
  address: String,
  dob: Date,
  bloodType: String,
  location: String,
  healthCondition: String,
  symptoms: String (optional),
  donationAmount: String,
  message: String (optional),
  registeredAt: Date (default: now),
  status: String (enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Schedule Removed']),
  lastScheduledDate: Date
}
```

### BloodRequest Collection
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  gender: String,
  phone: String,
  address: String,
  dob: Date,
  bloodType: String,
  location: String,
  reason: String,
  otherReason: String (optional),
  bloodAmount: String,
  requestedAt: Date (default: now),
  status: String (enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Schedule Removed']),
  lastScheduledDate: Date
}
```

### BloodBank Collection
```javascript
{
  location: String (required, unique),
  addresses: [String] (required),
  "A+": Number (default: 0),
  "A-": Number (default: 0),
  "B+": Number (default: 0),
  "B-": Number (default: 0),
  "AB+": Number (default: 0),
  "AB-": Number (default: 0),
  "O+": Number (default: 0),
  "O-": Number (default: 0),
  lastUpdated: Date (default: now)
}
```

### Schedule Collection
```javascript
{
  userId: ObjectId (ref: User),
  scheduleDate: Date,
  timeSlot: String,
  medications: String,
  vaccination: String,
  recentIllness: String,
  bloodPressure: String,
  location: String,
  address: String,
  createdAt: Date (default: now),
  lastScheduledDate: Date
}
```

### ScheduleRequest Collection
```javascript
{
  userId: ObjectId (ref: User),
  scheduleDate: Date,
  session: String (enum: ['Morning', 'Afternoon', 'Evening']),
  timeSlot: String,
  bloodType: String,
  bloodAmount: Number,
  selectedAddress: String,
  location: String,
  reason: String,
  prescription: String (enum: ['Yes', 'No']),
  createdAt: Date (default: now),
  lastScheduledDate: Date
}
```

### ConfirmedSchedule Collection
```javascript
{
  userId: ObjectId (ref: User),
  type: String (enum: ['Donation', 'Request']),
  scheduleDate: Date,
  createdAt: Date (default: now)
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Environment Configuration

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret_key
PORT=3000
ADMIN_PASSWORD=your_admin_password
```

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd blood-donation-hub
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service:
```bash
# For Windows
net start MongoDB

# For Linux/Mac
sudo systemctl start mongod
```

5. Run the application:
```bash
npm start
```

6. Access the application:
```
http://localhost:3000
```

### Default Admin Account

The system automatically creates a default admin account on first run:
- **Username**: admin123
- **Email**: admin123@gmail.com
- **Password**: (Set via ADMIN_PASSWORD in .env)
- **Role**: admin

## Project Structure

```
blood-donation-hub/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and scripts
├── .env                            # Environment variables
├── config/
│   └── createAdmin.js             # Auto-create admin on startup
├── models/
│   ├── User.js                    # User schema
│   ├── BloodDonation.js           # Donation schema
│   ├── BloodRequest.js            # Request schema
│   ├── BloodBank.js               # Blood bank inventory schema
│   ├── schedule.js                # Donation schedule schema
│   ├── requestSchedule.js         # Request schedule schema
│   └── ConfirmedSchedule .js      # Completed schedules schema
├── routes/
│   ├── auth.js                    # Authentication routes
│   ├── donate.js                  # Donation routes
│   ├── receive.js                 # Request routes
│   ├── admin.js                   # Admin management routes
│   ├── status.js                  # Status tracking routes
│   ├── Schedule.js                # Donation scheduling routes
│   ├── requestSchedule.js         # Request scheduling routes
│   └── availability.js            # Blood availability routes
├── views/
│   ├── login.ejs                  # Login page
│   ├── register.ejs               # Registration page
│   ├── home.ejs                   # User dashboard
│   ├── admin-home.ejs             # Admin dashboard
│   ├── donate.ejs                 # Donation form
│   ├── receive.ejs                # Request form
│   ├── status.ejs                 # Status tracking page
│   ├── schedule.ejs               # Donation schedule form
│   ├── requestSchedule.ejs        # Request schedule form
│   ├── availability.ejs           # Blood availability page
│   ├── admin-donations.ejs        # Admin donation management
│   ├── admin-requests.ejs         # Admin request management
│   ├── adminSchedule.ejs          # Admin donation schedules
│   ├── adminReceiveSchedule.ejs   # Admin request schedules
│   ├── adminHistory.ejs           # Completed transactions
│   ├── contact.ejs                # About us page
│   └── partials/
│       ├── header.ejs             # Header component
│       ├── home-header.ejs        # Home page header
│       ├── footer.ejs             # Footer component
│       └── login-footer.ejs       # Login page footer
└── public/
    ├── css/
    │   ├── styles.css             # Login/Register styles
    │   ├── admin-home.css         # Admin dashboard styles
    │   ├── donate.css             # Donation form styles
    │   ├── schedule.css           # Schedule form styles
    │   ├── requestSchedule.css    # Request schedule styles
    │   ├── availability.css       # Availability page styles
    │   ├── status.css             # Status page styles
    │   └── contact.css            # Contact page styles
    ├── js/
    │   └── main.js                # Client-side JavaScript
    └── images/                    # Application images and icons
```

## Design Principles

### User Interface
- Clean, intuitive design with gentle color schemes
- Responsive layout for multiple device sizes
- Professional red theme aligned with healthcare branding
- Clear visual hierarchy with proper spacing
- Gender-specific profile icons (male/female)
- Consistent button styling and hover effects

### User Experience
- Minimal clicks to complete actions
- Real-time feedback on form submissions
- Clear status messages throughout the workflow
- Auto-dismiss alerts after 10 seconds
- Smooth transitions and animations
- Disabled states prevent premature submissions

### Accessibility
- Clear labeling on all form fields
- Required field indicators
- Error messages for validation failures
- Keyboard navigation support
- Readable font sizes and contrast ratios

## Blood Type Compatibility

The system supports all major blood types:
- **A+**: Can donate to A+, AB+
- **A-**: Can donate to A+, A-, AB+, AB-
- **B+**: Can donate to B+, AB+
- **B-**: Can donate to B+, B-, AB+, AB-
- **AB+**: Universal recipient, can donate to AB+
- **AB-**: Can donate to AB+, AB-
- **O+**: Can donate to A+, B+, AB+, O+
- **O-**: Universal donor, can donate to all types

## Coverage Area

### Tamil Nadu Districts (38)
Ariyalur, Chengalpattu, Chennai, Coimbatore, Cuddalore, Dharmapuri, Dindigul, Erode, Kallakurichi, Kanchipuram, Kanniyakumari, Karur, Krishnagiri, Madurai, Mayiladuthurai, Nagapattinam, Namakkal, Nilgiris, Perambalur, Pudukkottai, Ramanathapuram, Ranipet, Salem, Sivagangai, Tenkasi, Thanjavur, Theni, Thoothukudi, Tiruchirappalli, Tirunelveli, Tirupathur, Tiruppur, Tiruvallur, Tiruvannamalai, Tiruvarur, Vellore, Viluppuram, Virudhunagar

## Business Logic & Validations

### Donation Rules
1. Only one pending request allowed per user
2. Health condition must be assessed before donation
3. Symptoms required if health condition is "Not Good"
4. Donation amount must be between 100ml and 500ml
5. Schedule can only be fixed after admin approval
6. Schedule cancellation updates status for rescheduling

### Request Rules
1. Only one pending request allowed per user
2. Medical reason required for all requests
3. Prescription verification required for scheduling
4. Blood availability must be confirmed before scheduling
5. Stock deduction happens only after admin confirmation
6. Failed pickup attempts allow rescheduling

### Admin Controls
1. Cannot approve without reviewing complete information
2. Must verify health screening before adding blood
3. Must confirm stock availability before allocation
4. Can cancel schedules with proper notifications
5. History tracking for audit purposes

## Testing Scenarios

### User Registration & Login
- Valid email and password registration
- Duplicate email prevention
- Password hashing verification
- Session persistence
- Role assignment

### Donation Flow
- Form submission with all required fields
- Health condition branching logic
- Admin approval/rejection
- Schedule fixing with time slots
- Blood addition to inventory
- Status updates at each stage

### Request Flow
- Complete request form submission
- Admin review and approval
- Blood availability check
- Schedule creation with prescription
- Blood allocation from inventory
- Stock deduction verification

### Admin Operations
- Access control for admin routes
- Donation/Request management
- Schedule handling
- Inventory updates
- History viewing

## Performance Considerations

### Database Optimization
- Indexed fields: email (unique), userId (foreign keys)
- Lean queries for read-heavy operations
- Batch updates for schedule confirmations
- Timestamp tracking for audit trails

### Session Management
- MongoDB store for session persistence
- Configurable session expiry
- Automatic session cleanup
- Secure cookie settings

### Frontend Performance
- Minimal external dependencies
- Inline critical CSS
- Deferred JavaScript loading
- Optimized image assets

## Future Enhancements

### Planned Features
1. Email/SMS notifications for status updates
2. Mobile application (iOS/Android)
3. Blood donor rewards program
4. Emergency blood request system
5. Blood donation camps management
6. Donor health history tracking
7. Multi-language support (Tamil, English)
8. Payment gateway for voluntary donations
9. Analytics dashboard for administrators
10. Integration with hospital management systems

### Technical Improvements
1. Migration to TypeScript for type safety
2. API versioning for mobile app support
3. Real-time notifications using WebSockets
4. Caching layer for frequently accessed data
5. Automated testing suite (unit, integration, e2e)
6. CI/CD pipeline setup
7. Docker containerization
8. Cloud deployment (AWS/Azure)
9. Load balancing for scalability
10. Database replication for high availability

## Maintenance & Support

### Regular Maintenance
- Weekly database backups
- Monthly security updates
- Quarterly feature reviews
- Annual architecture assessments

### Support Channels
- **Technical Support**: loheshkanna55@gmail.com
- **Phone**: +91 63820 27313
- **Instagram**: @lohesh__

### Issue Reporting
When reporting issues, please include:
1. User role (User/Admin)
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Browser/device information

## Deployment Guidelines

### Production Checklist
- [ ] Set strong session secret
- [ ] Configure production MongoDB URI
- [ ] Enable HTTPS
- [ ] Set secure cookie options
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up error tracking
- [ ] Performance optimization
- [ ] Security audit

### Environment-Specific Settings

**Development**
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/blood-donation
```

**Production**
```env
NODE_ENV=production
PORT=80
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blood-donation
SESSION_SECRET=strong_random_secret
```

## License

This project is developed for educational and social welfare purposes.

## Credits & Acknowledgments

### Developer
**Lohesh Kanna. G**
- B.Tech in Information Technology, AAMEC
- Founder, Blood Donation Hub
- Investment: ₹50,000+

### Technology Partners
- MongoDB for database solutions
- Express.js for backend framework
- Node.js runtime environment
- Passport.js for authentication

## Contact Information

### Project Maintainer
- **Name**: Lohesh Kanna. G
- **Email**: loheshkanna55@gmail.com
- **Phone**: +91 63820 27313
- **Instagram**: @lohesh__
- **Address**: No.1/318/B1, Keelatheru, Sakkottai, Kumbakonam, Thanjavur District, Tamil Nadu

### Organization
**Blood Donation Hub**
- Mission: Making blood donation accessible and efficient
- Coverage: 100+ branches across Tamil Nadu
- Impact: 25,000+ donors, 30,000+ recipients served

---

## Appendix

### Blood Donation Eligibility Criteria
- Age: 18-65 years
- Weight: Minimum 45 kg
- Hemoglobin: Minimum 12.5 g/dL
- Pulse: 50-100 beats/minute
- Blood Pressure: 50-100 mm Hg / 90-180 mm Hg
- Temperature: Normal (98.6°F)

### Medical Reasons for Blood Requests
Accident, Surgery, Cancer, Anemia, Thalassemia, Hemophilia, Dengue, Leukemia, Kidney Disease, Liver Disease, Pregnancy Complications, Organ Transplant, Heart Surgery, Bone Marrow Transplant, Burn Victim, Snake Bite, Severe Infection, HIV/AIDS, COVID-19 Complications, and custom reasons.

### Time Slot Management
**Morning Session**: 08:00 AM - 11:00 AM
**Afternoon Session**: 12:00 PM - 03:00 PM
**Evening Session**: 04:00 PM - 07:00 PM

Each session divided into 1-hour slots for efficient scheduling.

---

**Document Version**: 1.0
**Last Updated**: February 2025
**Reviewed By**: Development Team
**Status**: Ready for Infosys Review

© 2025 Blood Donation Hub. All rights reserved.
