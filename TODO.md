# TODO - Perpustakaan Mobile App

## Completed Tasks
- [x] Connect detail page to peminjaman page
- [x] Navigate to buku-dipinjam page after successful borrowing submission
- [x] Add "Buku Dipinjam" menu item to sidebar navigation
- [x] Move returned books from buku-dipinjam to history page
- [x] Add "Riwayat" menu item to sidebar navigation
- [x] Calculate fines for late returns

## Current Status
All requested features have been implemented:
1. Detail page now navigates to peminjaman page when "Pinjam Buku" is pressed
2. After submitting borrowing request, user is redirected to buku-dipinjam page
3. When a book is returned in buku-dipinjam page, it moves to history page
4. History page shows all returned books with fine calculations
5. Sidebar includes navigation to both "Buku Dipinjam" and "Riwayat" pages

## Flow Summary
- **Borrowing Flow**: Detail → Peminjaman → Buku Dipinjam
- **Return Flow**: Buku Dipinjam (return book) → History
- **Navigation**: Sidebar menu provides access to all sections

## Testing Notes
- Data persistence using AsyncStorage
- Automatic fine calculation for late returns (Rp 2,000/day)
- Real-time status updates and date tracking
