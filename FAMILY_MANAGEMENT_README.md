# FamilyHub - Family Management Application

A comprehensive end-to-end React-based family management website with TypeScript, Redux state management, and Azure AD authentication.

## Features

### 1. **Dashboard**
- Overview of all family activities
- Quick statistics (members count, total expenses, completed tasks, upcoming events)
- Recent events and pending tasks at a glance

### 2. **Family Members Management**
- Add, edit, and delete family members
- Assign roles (Admin, Member, Viewer)
- Store member information (name, email, phone, date of birth)
- Filter members by role
- Display member profiles with avatars

### 3. **Calendar & Events**
- Schedule family events and important dates
- Categorize events (Birthday, Anniversary, Holiday, Vacation, Meeting, Other)
- Set event details (date, time, location, description)
- Enable/disable notifications
- Filter events by month and category
- Track attendees

### 4. **Task Management**
- Create and assign family tasks
- Set priority levels (Low, Medium, High)
- Track task status (Pending, In Progress, Completed, Cancelled)
- Due date management
- Kanban-style board view (organized by status)
- Filter tasks by assignee, status, and priority

### 5. **Budget & Expense Tracking**
- Record family expenses
- Categorize expenses (Groceries, Utilities, Entertainment, Healthcare, Other)
- Track who paid for each expense
- Split expenses among family members
- Monthly budget planning
- Visual progress indicators
- Category-wise expense breakdown

### 6. **Photo Gallery**
- Create photo albums
- Upload and organize family photos
- Lightbox view for photos
- Photo titles and descriptions
- Navigate through photos
- Delete photos from albums
- Album management

### 7. **Authentication**
- Azure AD (Microsoft) integration
- Secure login/logout
- Group-based authorization
- JWT token handling

## Tech Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 4.9
- **State Management**: Redux Toolkit 2.8
- **Routing**: React Router v7
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios
- **Authentication**: Azure MSAL
- **Styling**: CSS with responsive design

## Project Structure

```
src/
├── api/
│   └── axios.tsx                    # API client configuration
├── auth/
│   └── msalConfig.ts               # Azure AD configuration
├── components/
│   ├── Navigation.tsx              # Navigation bar
│   ├── Navigation.css              # Navigation styles
│   ├── MemberCard.tsx              # Member card component
│   ├── EventCard.tsx               # Event card component
│   ├── TaskCard.tsx                # Task card component
│   ├── ExpenseCard.tsx             # Expense card component
│   ├── BudgetCard.tsx              # Budget card component
│   ├── PhotoGrid.tsx               # Photo grid display
│   ├── ProfileDetails.tsx          # Profile details
│   ├── ProfileForm.tsx             # Profile form
│   ├── ProfileList.tsx             # Profile list
│   ├── home.tsx                    # Home component
│   └── forms/
│       ├── MemberForm.tsx          # Add/edit member form
│       ├── EventForm.tsx           # Add/edit event form
│       ├── TaskForm.tsx            # Add/edit task form
│       ├── ExpenseForm.tsx         # Add/edit expense form
│       ├── BudgetForm.tsx          # Set budget form
│       ├── AlbumForm.tsx           # Create/edit album form
│       └── PhotoUploadForm.tsx     # Upload photo form
├── pages/
│   ├── Dashboard.tsx               # Dashboard page
│   ├── FamilyMembers.tsx          # Family members page
│   ├── Events.tsx                 # Events/Calendar page
│   ├── Tasks.tsx                  # Tasks board page
│   ├── Budget.tsx                 # Budget & expenses page
│   └── PhotoGallery.tsx           # Photo gallery page
├── routes/
│   └── approutes.tsx              # Route configuration
├── state/
│   ├── features/
│   │   ├── budget/
│   │   │   └── budgetSlice.ts     # Budget Redux slice
│   │   ├── events/
│   │   │   └── eventSlice.ts      # Events Redux slice
│   │   ├── family/
│   │   │   └── familySlice.ts     # Family members Redux slice
│   │   ├── photos/
│   │   │   └── photoSlice.ts      # Photos Redux slice
│   │   ├── profiles/
│   │   │   └── profileSlice.ts    # Profiles Redux slice
│   │   └── tasks/
│   │       └── taskSlice.ts       # Tasks Redux slice
│   ├── hooks/
│   │   └── hook.ts                # Custom Redux hooks
│   └── store/
│       └── store.ts               # Redux store configuration
├── App.tsx                        # Main App component
├── App.css                        # App styles
├── index.tsx                      # React entry point
├── index.css                      # Global styles
└── setupTests.ts                  # Test configuration

```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Azure AD subscription

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Azure AD**
   - Update `src/auth/msalConfig.ts` with your Azure AD credentials
   - Set the `clientId`, `authority`, and `redirectUri`

3. **Configure API endpoint**
   - Update the API base URL in `src/api/axios.tsx`
   - Replace with your backend API endpoint

### Running the Application

**Development mode:**
```bash
npm start
```

**Build for production:**
```bash
npm build
```

**Run tests:**
```bash
npm test
```

## Usage Guide

### Landing Page
- Sign in with your Microsoft account
- Once authenticated, you'll be redirected to the dashboard

### Navigation
- Use the navigation bar to switch between different sections
- The active page is highlighted in the navigation

### Dashboard
- Get a quick overview of your family's activities
- See recent events and pending tasks
- View key statistics

### Family Members
- **Add Member**: Click "Add Member" button to create a new family member
- **Edit Member**: Click "Edit" on a member card to modify their information
- **Delete Member**: Click "Delete" to remove a member
- **Filter**: Filter members by role (Admin, Member, Viewer)

### Events
- **Add Event**: Click "Add Event" to schedule a new event
- **View Events**: Events are displayed by date
- **Filter**: Select a month to view events for that period
- **Categories**: Events are color-coded by category

### Tasks
- **Create Task**: Click "Add Task" to create a new task
- **Assign**: Assign tasks to family members
- **Track Status**: Drag tasks between status columns or use the dropdown
- **Priorities**: Set priority levels for urgent tasks

### Budget & Expenses
- **Record Expense**: Click "Add Expense" to log a new expense
- **Set Budget**: Create monthly budgets for different categories
- **View Summary**: See total spending and category breakdown
- **Track Progress**: Visual progress bars show budget usage

### Photo Gallery
- **Create Album**: Click "Create Album" to start a new photo album
- **Upload Photos**: Add photos to albums
- **Gallery View**: Hover over photos to see delete option
- **Lightbox**: Click photos to view in full screen
- **Navigation**: Use arrows to navigate through photos

## Redux State Structure

The application uses Redux for state management with the following slices:

```typescript
// Family State
{
  currentFamily: FamilyGroup | null
  members: FamilyMember[]
  loading: boolean
  error: string | null
}

// Events State
{
  events: FamilyEvent[]
  filteredEvents: FamilyEvent[]
  loading: boolean
  error: string | null
}

// Tasks State
{
  tasks: FamilyTask[]
  filteredTasks: FamilyTask[]
  loading: boolean
  error: string | null
}

// Budget State
{
  expenses: Expense[]
  budgets: Budget[]
  filteredExpenses: Expense[]
  loading: boolean
  error: string | null
}

// Photos State
{
  albums: PhotoAlbum[]
  currentAlbum: PhotoAlbum | null
  photos: Photo[]
  loading: boolean
  error: string | null
}
```

## Backend API Integration

The application expects the following endpoints to be implemented:

### Family
- `GET /Family/GetMembers` - Get all family members
- `POST /Family/AddMember` - Add new member
- `PUT /Family/UpdateMember/{id}` - Update member
- `DELETE /Family/DeleteMember/{id}` - Delete member
- `GET /Family/GetCurrent` - Get current family

### Events
- `GET /Events/GetAll` - Get all events
- `POST /Events/Create` - Create event
- `PUT /Events/Update/{id}` - Update event
- `DELETE /Events/Delete/{id}` - Delete event

### Tasks
- `GET /Tasks/GetAll` - Get all tasks
- `POST /Tasks/Create` - Create task
- `PUT /Tasks/Update/{id}` - Update task
- `DELETE /Tasks/Delete/{id}` - Delete task

### Budget
- `GET /Budget/GetExpenses` - Get all expenses
- `POST /Budget/CreateExpense` - Create expense
- `PUT /Budget/UpdateExpense/{id}` - Update expense
- `DELETE /Budget/DeleteExpense/{id}` - Delete expense
- `GET /Budget/GetBudgets` - Get budgets
- `POST /Budget/CreateBudget` - Create budget
- `PUT /Budget/UpdateBudget/{id}` - Update budget

### Photos
- `GET /Photos/GetAlbums` - Get all albums
- `POST /Photos/CreateAlbum` - Create album
- `PUT /Photos/UpdateAlbum/{id}` - Update album
- `DELETE /Photos/DeleteAlbum/{id}` - Delete album
- `GET /Photos/GetAlbumPhotos/{albumId}` - Get photos from album
- `POST /Photos/UploadPhoto` - Upload photo (multipart form)
- `DELETE /Photos/DeletePhoto/{id}` - Delete photo

## Customization

### Theme Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --info-color: #3498db;
  /* ... more variables */
}
```

### Forms Validation
- Validation rules are defined using Yup in each form component
- Customize validation in the `validationSchema` object

### Responsive Design
- The application is fully responsive
- Mobile breakpoint: 768px
- All styles adapt gracefully to smaller screens

## Troubleshooting

### Login Issues
- Verify Azure AD configuration in `msalConfig.ts`
- Check that your Microsoft account has access
- Clear browser cache and try again

### API Not Working
- Verify the backend API is running
- Check CORS settings on the backend
- Verify the API base URL in `axios.tsx`

### Data Not Loading
- Check browser console for API errors
- Verify authentication token is valid
- Check network tab in developer tools

## Performance Considerations

- Redux state is optimized with filtered subsets
- Form rendering is optimized with Formik
- Images are lazy-loaded in photo gallery
- Navigation uses React Router for efficient routing

## Security

- Authentication is handled through Azure MSAL
- API calls include JWT token in headers
- Sensitive data should be handled on the backend
- Input validation is performed both client and server-side

## Future Enhancements

- Real-time notifications
- Chat/Messaging feature
- Calendar export functionality
- Advanced reporting and analytics
- Mobile app version
- Integration with other calendar services
- Document sharing
- Family recipe sharing

## Support

For issues or questions, refer to the documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
