# startup
notes.md -> https://github.com/taehk98/startup/blob/main/notes.md
# Soccer Clue Attendance checker

This application allows Soccer clubs to take their members' attendance every week. The administers of the clubs can start votings and end them. People need their certain clubs' codes to sign up to their clubs.

## Specification Deliverable

### Elevator pitch

Our soccer club attendance check application simplifies the process of tracking and managing player attendance. Easily monitor who's present and who's not, streamline communication with team members, and ensure everyone is on the same page. Our application enhances the efficiency of managing soccer club attendance. Join us in revolutionizing the way we take attendance in soccer clubs!

### Design

![Mock](KakaoTalk_20240116_223125682.jpg)

### Key features

- Secure Login over HTTPS
- Ability to Choose Between the 'Will Attend' Button and the 'Will Be Absent' Button
- Display of Attendance Summary of Members
- Tracking of People Who Voted for 'Will Attend' but Did Not Actually Attend
- Ability to Join Specific Clubs.
- Display of Name Lists of Attendees and Non-attendees in Real-time
- Ability for a User to Create and End Attendance poll and Check Actual Attendance
- Persistent Storage of Club Members' Attendance

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Three HTML pages. One for login, one for attendance poll, and one for attendance summary. Hyperlinks to choice artifact.
- **CSS** - Styling for the application that presents an appealing visual appearance across various screen sizes, incorporates effective use of whitespace, and employs well-thought-out color choices and contrasts.
- **JavaScript** - Provides login, attendance polls display, applying votes, display other users votes on two lists, backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving choices
  - submitting votes
  - retrieving vote status
- **DB/Login** - Store users, choices, and polls in database. Register and login users. Credentials securely stored in database. Can't create or end attendance polls unless authenticated.
- **WebSocket** - As each user votes, their names on the 'Will Attend' list the 'Will Be Absent' list are broadcast to all other users.
- **React** - Application ported to use the React web framework.

## HTML deliverable



- **HTML pages** - Four HTML page that represent the ability to login, vote, report.
- **Links** - The login page automatically links to the attendance page. Every page can be reached from each other. 
- **Text** - The two reports on the report.html page are represented by a textual description.
- **Images** - I added a soccer pitch picture on the about page and a sccoer ball drawing next to the title of the page.
- **DB/Login** - Stores Club codes, members, votes in database. Can't join teams unless people have specific code for their teams.
- **WebSocket** - When individuals check the checkboxes, their names will be added to the list based on their selections. People will be able to see other people's realtime choises.
- **Web Service** - On the attendance page, the place where they are going to play at is shown by using map API.
## CSS deliverable



- **Header, footer, and main content body**
- **Navigation elements** - I used one of the navigations on bootstrap and modified it.
- **Responsive to window resizing** - I used flexbox and dev tools to make sure my application outline works on both mobile and desktop.
- **Application elements** - Used good colors and whitespace. Tried to make it clean and neat.
- **Application text content** - Tried to use consistent fonts.
- **Application images** - 

## JavaScript deliverable



- **login** - 
- **database** - 
- **WebSocket** - 
- **application logic** - 

## Service deliverable


- **Node.js/Express HTTP service** - 
- **Static middleware for frontend** - 
- **Calls to third party endpoints** - 
- **Backend service endpoints** - 
- **Frontend calls service endpoints** - 

## DB/Login deliverable



- **MongoDB Atlas database created** - 
- **Stores data in MongoDB** - 
- **User registration** - 
- **existing user** - 
- **Use MongoDB to store credentials** - 
- **Restricts functionality** - 

## WebSocket deliverable



- **Backend listens for WebSocket connection** -
- **Frontend makes WebSocket connection** - 
- **Data sent over WebSocket connection** - 
- **WebSocket data displayed** - 

## React deliverable


- **Bundled and transpiled** - 
- **Components** - 
- **Router** - 
- **Hooks** - 
