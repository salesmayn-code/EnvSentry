# Backlink prospects and pitch drafts — 2026-11-18

Site: https://salesmayn-code.github.io/EnvSentry/ (repo https://github.com/salesmayn-code/EnvSentry). Playbook: `D:\Workspace\playbooks\backlinks.md`.

**Nothing here has been sent, posted or submitted. You send everything yourself.**

**Send first:** #1 awesome-devtools PR, #2 nologin.tools, #3 Show HN.

## Before you send: two gaps in the repo

- **No license.** The repo has no `LICENSE` file, so it is not open source in the legal sense, and several lists require that (awesome-devops wants an `oss` tag with a license). Add MIT if you're happy with it; it takes one minute in GitHub (Add file → Create new file → `LICENSE` → choose a template).
- **0 stars, repo created 2026-11-14.** Lists with maturity rules (100 stars, 6 months) aren't open to it yet. See "Not yet" below.

## Prospects

| # | Site | Page | Kind | Why it fits | How to submit | Contact or link | Rules checked |
|---|---|---|---|---|---|---|---|
| 1 | moimikey/awesome-devtools (544★, last merge 2026-07-27) | README → "Diffing" | GitHub list | In-browser dev tools only; EnvSentry is browser-based, free, no signup, which are its three rules. Sits next to Diff Text and JSONDiffPatch | Pull request editing `README.md` | https://github.com/moimikey/awesome-devtools | CONTRIBUTING: browser-based, direct link, 100% free with no signup. Outside PRs merged 2026-03 to 06. Merges come in batches; open PRs from Nov are waiting, so expect weeks |
| 2 | nologin.tools | Development category | Curated directory | Lists only tools whose core task works with no account; reviewers audit network traffic. EnvSentry makes no third-party requests and uploads nothing | Form at https://nologin.tools/submit: tool URL, optional email, a "no account needed" checkbox. No account | https://nologin.tools/submit | Basic listing free. Active (© 2026, blog post 2026-09-16). An optional badge on your site gives a ranking boost; not needed |
| 3 | Hacker News — Show HN | https://news.ycombinator.com/show | Community, you post as yourself | Show HN is for things people can try right away. A no-signup, no-upload tool is the ideal case | Submit a story titled "Show HN: …", stay around to answer comments | https://news.ycombinator.com/submit | Rules (showhn.html): you made it, it's easy to try, no signup walls, never ask friends for upvotes. Post on a weekday morning US time |
| 4 | DevHunt | Tool launch page | Launch site for dev tools | Developer tools only; open source tools explicitly welcome (say "open source" only once a LICENSE is added) | Sign in with GitHub, submit name, URL, description, logo, screenshots | https://devhunt.org/login?next=submit | Free listing (nofollow link). The $49 paid launch is optional; don't buy it. Active: launches dated Nov 2026 |
| 5 | Uneed | Launch queue | Launch site | General tool directory with a developer audience | Paste URL at /submit-a-tool, then sign up to save. Free "Join the line" puts launch 50+ days out | https://www.uneed.best/submit-a-tool | Free tier stays published only with 10 upvotes (20 for a followed link). Skip the paid "skip the line" options. Active: blog posts Nov 2026 |
| 6 | Product Hunt | Product launch | Launch site | Large audience; a free niche dev tool can do fine on a quiet day | Personal account; new accounts wait a week before posting (or subscribe to the newsletter for immediate access) | https://www.producthunt.com/posts/new | No fee stated. Help pages carry no 2026 date, but the site is plainly running. Launch after Show HN so you have feedback to quote |

### Not yet (revisit)

- **wmariuss/awesome-devops** (4,460★, commits this month): wants an open source license, 100+ stars and 6 months of repo history. Revisit around 2027-05 if EnvSentry has a license and the stars. Section would be "Productivity Tools" or "Secret Management".

### Dropped

- **ripienaar/free-for-dev** (143k★): only SaaS with free tiers; explicitly refuses generic developer "toolbox" sites, and closes PRs written with AI help.
- **AlternativeTo**: its FAQ declines simple one-purpose online tools.
- **vitejs/awesome-vite** (no commits since 2026-02) and **devtoolsd/awesome-devtools** (no commits since 2025-10): not maintained in the last 6 months.
- **dev.to "free browser tools" roundups**: mostly written by tool makers promoting their own sites, so not real resource pages.
- **r/webdev Showoff Saturday**: the rules page couldn't be read from here. If you're an active member, check the sidebar rules yourself before posting.

## Pitch drafts

### 1. awesome-devtools: pull request

Line to add under `### Diffing`, alphabetically between "Diff Text" and "JSONDiffPatch":

```markdown
- [EnvSentry](https://salesmayn-code.github.io/EnvSentry/) - Compare .env files across environments and find missing, extra, empty and duplicate variables. Runs in the browser; files are never uploaded.
```

PR title: `Add EnvSentry to Diffing`

PR description:

> Adds EnvSentry to Diffing. It compares several .env files side by side and flags missing, extra, empty and duplicate variables. It meets the contribution notes: browser-based, a direct link to the tool, and free with no signup. Files are parsed in the browser and never leave the machine.
>
> <your name>

### 2. nologin.tools: form

- Tool URL: `https://salesmayn-code.github.io/EnvSentry/`
- Tick "core function works without an account" (true: nothing to sign up for).
- Email: optional; leave empty unless you want the reviewer to reach you.

### 3. Show HN: post

Title (under 80 characters): `Show HN: EnvSentry – compare .env files across environments in the browser`

URL: `https://salesmayn-code.github.io/EnvSentry/`

First comment (post it yourself right after submitting):

> I kept shipping deploys where staging had a variable production didn't. EnvSentry takes several .env files and shows a matrix of which keys are missing, extra, empty or duplicated in each one. Everything is parsed in the browser: no upload, no account, no third-party requests. You can check that in the Network tab. Source: https://github.com/salesmayn-code/EnvSentry. I'd like to hear which checks you'd want next, such as comparing against a `.env.example` or exporting for CI.
>
> <your name>

(Rewrite the first sentence in your own words if it isn't your real reason for building it.)

### 4. DevHunt: listing

- Name: EnvSentry
- Tagline: `Compare .env files across environments, in your browser`
- Description:

> EnvSentry compares .env files from different environments and shows which variables are missing, extra, empty or duplicated in each. Files are parsed in the browser and never uploaded. Free, no account, source on GitHub.

- Logo: `public/favicon.svg`. Screenshots: `media/desktop-framed.png`, `media/phone-framed.png`.

### 5. Uneed: listing

Paste `https://salesmayn-code.github.io/EnvSentry/`, then use the same tagline and description as DevHunt. Pick the free "Join the line". Be aware the listing stays up only with 10 upvotes. Don't ask friends to vote; that's the kind of fake engagement the playbook rules out.

### 6. Product Hunt: launch

- Name: EnvSentry
- Tagline (60 characters max): `Spot missing .env variables before you deploy`
- Description:

> Drop in your .env files from dev, staging and production. EnvSentry shows a matrix of which variables are missing, extra, empty or duplicated in each, so a deploy doesn't break on a forgotten key. It runs entirely in your browser: files are never uploaded, and there's no account. Free, with the source on GitHub.

- Maker comment: reuse the Show HN first comment, signed `<your name>`.
- Gallery: `media/social-card.png`, `media/desktop-framed.png`, `media/phone-framed.png`.

## Sent log

Record here what you sent and when, so the next audit can check whether the links appeared.

| # | Sent on | Result |
|---|---|---|
