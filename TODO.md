# Fix Modal Backdrop Issue

## Current Issue
The Change Password modal backdrop only covers the middle section instead of the entire screen because it's rendered inside the MainLayout's scrollable content area with overflow-hidden.

## Solution
Use ReactDOM.createPortal to render the modal at the document.body level, ensuring full-screen backdrop coverage.

## Tasks
- [ ] Import ReactDOM in ChangePasswordForm.tsx
- [ ] Modify the modal JSX to use createPortal
- [ ] Test the modal backdrop coverage
- [ ] Verify modal functionality remains intact
