# Test Checklist

Tester: ________  Date: ________  Mark each row Pass or Fail.

## Authentication
| # | Test | Expected | Result |
|---|---|---|---|
| A1 | Admin login (Admin role) | Reaches admin dashboard | |
| A2 | Requester login | Reaches requester dashboard | |
| A3 | Active technician login | Reaches technician dashboard | |
| A4 | Pending technician login | "Waiting for administrator approval" | |
| A5 | Wrong password | "Invalid email, password, or role." | |
| A6 | Right credentials, wrong role selected | Invalid error | |
| A7 | Empty email and password | Validation error | |
| A8 | Logout, then press Back and open a protected page | Redirects to login | |

## Forms and validation (signup)
| # | Test | Expected | Result |
|---|---|---|---|
| F1 | Valid requester signup | Account created, can log in | |
| F2 | Valid technician signup | Created as pending, cannot log in yet | |
| F3 | Empty fields | Error messages | |
| F4 | Invalid email format | Email error | |
| F5 | Password under 8 characters | Password error | |
| F6 | Passwords do not match | Mismatch error | |
| F7 | Duplicate email | "Already registered" | |
| F8 | Technician without specialty | Specialty error | |
| F9 | Send role=admin in the form (edit HTML in browser tools) | "Choose Requester or Technician" error | |

## Access control
| # | Test | Expected | Result |
|---|---|---|---|
| C1 | Logged out, open /admin/dashboard | Redirects to login | |
| C2 | Requester opens /admin/users | 403 | |
| C3 | Requester opens /technician/dashboard | 403 | |
| C4 | Technician opens /admin/users | 403 | |
| C5 | Admin opens /requester/dashboard | 403 | |
| C6 | Deactivate a logged-in user, refresh their window | Redirected to login | |
| C7 | Open /admin/users/1/deactivate in the address bar | Does not work (POST only) | |

## Manage users (database update)
| # | Test | Expected | Result |
|---|---|---|---|
| U1 | Approve pending technician | Status Active, can log in | |
| U2 | Deactivate user | Status Inactive, cannot log in | |
| U3 | Reactivate user | Status Active | |
| U4 | Admin's own row | "You", no button | |
| U5 | Restart server, reopen /admin/users | Changes are still there (data stored) | |

## Request features (fill in after Members 1 and 2 merge)
| # | Test | Expected | Result |
|---|---|---|---|
| R1 | Submit request with all fields | Tracking number CMR-000X shown | |
| R2 | Submit with empty fields | Validation errors, nothing saved | |
| R3 | Requester sees only their own requests | Other users' requests hidden | |
| R4 | Admin assigns priority and technician | Status becomes Assigned | |
| R5 | Technician updates status and notes | Requester sees the update | |
| R6 | Restart server | Requests still there | |