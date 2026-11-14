# EnvSentry — Environment Configuration Auditor (PRD)

Source: supplied by the project owner on 2026-11-13.

## 1. Product overview

EnvSentry is a small developer tool that helps developers identify configuration inconsistencies across application environments before deployment. It compares environment files such as `.env.example`, `.env.development`, `.env.staging` and `.env.production`, and highlights missing, extra, duplicate or empty variables. The goal is to prevent deployment failures caused by incorrect or incomplete environment configuration.

## 2. Problem

Developers keep separate environment files for local, testing, staging and production. As an app grows, variables are added, removed or renamed, and one file gets updated while others are forgotten. This causes:

- Apps failing after deployment because required variables are missing.
- Staging and production having inconsistent configuration.
- Empty or badly maintained variables going unnoticed.
- Slow, error-prone manual comparison of several files.
- Accidental exposure of sensitive values when files are shared for review.

## 3. Solution

A comparison interface where developers provide several environment files and select one as the reference. The app compares variable names across the files and produces an audit report showing:

- **Missing variables:** in the reference file but absent from another environment.
- **Extra variables:** in an environment but not in the reference file.
- **Empty variables:** declared without a value.
- **Duplicate variables:** declared more than once in the same file.
- **Environment consistency:** an overview of which environments are missing or have additional entries.

The tool identifies structural problems without exposing or storing sensitive values.

## 4. Primary use case

A developer preparing a production deploy has four files (development, testing, staging, production). They recently added `REDIS_URL` and `SMTP_HOST` and are unsure every environment was updated. They provide the four files, select `.env.example` as the reference, and run an audit. EnvSentry reports that `REDIS_URL` is missing from production and `SMTP_HOST` is empty in staging. They fix the files, run the audit again, and export an audit report for the deployment checklist.

## 5. Target users

Individual developers, full-stack developers managing several environments, small teams, DevOps and deployment engineers, and maintainers of client or open-source projects.

## 6. MVP requirements

1. Provide multiple `.env` files.
2. Select a reference file.
3. Identify missing and extra variables automatically.
4. Detect empty and duplicate declarations.
5. View findings grouped by environment and issue type.
6. Clearly distinguish critical inconsistencies from informational findings.
7. Export a sanitized audit report.
8. Run another audit after correcting the files.

## 7. Product goal

Make environment configuration reviews quick, understandable and reliable, catching problems before they become deployment failures while keeping values private.

**Core promise:** Know what's missing, inconsistent, or incorrectly configured before you deploy.
