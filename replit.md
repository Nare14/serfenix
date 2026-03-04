# Fénix - Spiritual Membership Platform

## Overview
A spiritual wellness website ("Fénix") built with a rose/red glassmorphism aesthetic. Features a public landing page, member authentication, exclusive video content for paid members, and an admin dashboard for full site management.

## Architecture
- **Frontend**: React + Vite + Tailwind v4 + wouter routing + framer-motion
- **Backend**: Express.js with REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Glassmorphism design system, Playfair Display + Poppins fonts

## Key Routes
### Frontend
- `/` - Landing page (hero, history, video, cards, pricing plans)
- `/miembros` - Member login/register
- `/salas` - Protected member dashboard with exclusive videos
- `/admin` - Admin login
- `/admin/dashboard` - Admin panel (videos, content, users, settings, security)

### API
- `POST /api/auth/login` - Member login
- `POST /api/auth/register` - Member registration
- `POST /api/admin/login` - Admin login
- `POST /api/admin/change-password` - Change admin password
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id` - Update user (membership, disabled status)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/videos` - List all videos (admin)
- `POST /api/admin/videos` - Create video
- `PATCH /api/admin/videos/:id` - Update video
- `DELETE /api/admin/videos/:id` - Delete video
- `GET /api/videos?userId=X` - Get videos for member (protected)
- `GET /api/settings` - Get site settings
- `POST /api/admin/settings` - Save site settings

## Database Schema
- `users` - Members (email, password, disabled, membership_active, membership_type)
- `videos` - Exclusive content (title, description, url, category, sort_order, active, membership_required)
- `site_settings` - Key-value pairs for dynamic site config

## Admin Credentials (default)
- Email: admin@fenix.com
- Password: admin123

## Important Notes
- Assets imported via `@assets` alias (Vite maps to `attached_assets/`)
- Logo: `@assets/PHOTO-2026-02-23-10-22-53_1772146923218.jpg`
- Tailwind v4: CSS variables use raw `H S% L%` format in `:root`
- Admin access link is in the footer ("Portal Admin")
- Membership types: "fenix" (basic) and "fenix_pro" (premium)
- Videos are filtered by membership type: fenix_pro members see all, fenix members see fenix-only
