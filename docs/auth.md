# UGA Index Authentication Plan

UGA Index should use an allowlist-based authentication model in production.

## Intended Production Flow

1. An administrator creates or imports an allowlisted user by email.
2. The user role is assigned in advance:
   - `admin`
   - `respondent`
3. If the user is a respondent, the user is linked to exactly one respondent company.
4. The system sends a temporary password or password setup link by email.
5. The user signs in and sets a permanent password.
6. After login, the system redirects the user based on role.
7. Respondents can only access their own company daily form.
8. Admins can access all respondent submissions, Spike indicative comparison, calculation preview and publication workflow.
9. Future roles may include `UGA member`, `paid analytics user` and `API subscriber`.

## Demo Behavior

The current demo uses a local allowlist in `src/lib/demo-allowlist.ts`.

The login form accepts only email/login and password. Users do not choose roles manually. The role and respondent company are inferred from the demo allowlist.

Demo credentials:

- Admin: `admin@uga.ua` / `admin`
- Respondent: `bunge@uga-index.demo` / `respondent`

Presentation shortcuts are also supported:

- `admin` / `admin`
- `respondent` / `respondent`

## Production Implementation Options

Production authentication can be implemented with:

- Supabase Auth
- Auth.js
- custom credentials auth with hashed passwords
- an email provider for password setup links or temporary-password delivery

Before production launch, passwords must be hashed, setup links must be time-limited, audit logging should cover account and role changes, and access control should be enforced at both page and data-access layers.
