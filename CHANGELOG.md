# Changelog

## [Unreleased]

### ⚠️ Security
- Detected exposed Supabase Service Role JWT in repository
  - **COMPLETED ACTIONS**: 
    1. ✅ Rotated Supabase JWT keys
    2. ✅ Updated environment variables with new keys
    3. ✅ Created new migration file without hardcoded credentials
    4. ✅ Enhanced `.gitignore` to prevent future token exposure
    5. ✅ Added additional security patterns for Supabase files
  - Added security documentation for handling sensitive credentials
  - Verified `.env.local` is properly gitignored

### Fixed
- Resolved vector database interaction issues
  - Fixed incorrect vector store ID prefix in `.env.local` file
  - Updated configuration to properly connect with vector store
  - Changed vector store ID to the correct value: `vs_67df294659c48191bffbe978d27fc6f7`
- Fixed TypeScript type errors in API routes
  - Added type assertions to fix mismatch between OpenAI's SDK response and the expected types
  - Updated all API routes that use `OpenAIStream()` to properly handle response objects
  - Fixed additional type error in the tools route handler
  - Resolved Vercel deployment errors related to Azure OpenAI integration
- Fixed TypeScript errors in UI components
  - Corrected logical OR operators incorrectly used within includes() methods in useSelectFileHandler.tsx
  - Fixed incorrect window.prompt() parameter in message-codeblock.tsx
  - Updated ContentType type definition to include all content types used in the application
  - Fixed "This kind of expression is always truthy" TypeScript errors that were preventing Vercel deployment

### Changed
- Supabase Configuration Updates
  - Removed invalid configuration keys from `supabase/config.toml`
  - Updated IP version format from "IPV4" to "IPv4"
  - Synchronized local configuration with remote project settings
  - Updated auth configuration:
    - Changed site URL from `http://127.0.0.1:3000` to `http://localhost:3000`
    - Removed additional redirect URLs
    - Updated MFA settings (enabled TOTP)
    - Adjusted email frequency limits from 1s to 1m0s

### Infrastructure
- Database Management
  - Successfully reset and initialized local database
  - Applied all pending migrations
  - Seeded initial data from `supabase/seed.sql`

### DevOps
- Docker and Service Management
  - Resolved port conflict issues with Docker containers
  - Successfully started Docker Desktop
  - Configured and started all Supabase services:
    - API (port 54321)
    - GraphQL (port 54321)
    - S3 Storage (port 54321)
    - Database (port 54322)
    - Studio (port 54323)
    - Inbucket (port 54324)

### Project Setup
- Successfully linked local project to remote Supabase instance
- Established connection to remote database
- Set up local development environment with proper configuration 