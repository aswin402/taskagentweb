# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-08-05

### Added
- **Authentication System**: Implement role-based redirection, protected layouts, and session states.
- **Admin Dashboard Layout**: Sidebar, mobile navigation sheets, topbars, and user avatar action menus.
- **Employee Directory CRUD**: Add new employees, update details, toggle activation status.
- **Task Management CRUD**: Build forms validating categorizations (Daily Tasks, Stable Works, Scheduled Appointments).
- **Checklist Engine**: Interactive checklist grids, toggle controls, and exception reason capture dialogs.
- **Analytics Dashboard**: Live overview statistics, completion ratios, and real-time submission tables.
- **Audit Logging & Exports**: Custom reports page filtering historical records with CSV data download.
- **System Stability**: Custom Error Boundary fallback layout to catch runtime errors.
- **Dark Mode Support**: Context-aware styling with smooth light/dark theme toggles.

### Fixed
- **PostgREST Relationship Resolution**: Disambiguate task-to-profiles join calls by specifying the `assigned_to` relation.
- **PostgreSQL Enum Type Mismatch**: Standardize `profiles.role` type mapping to `TEXT` to resolve UI user creation issues.
- **Toaster Visibility**: Mount `sonner` toaster configuration correctly in the root of the app.
