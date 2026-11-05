# Learn with Rahul — Website

Multi-page static frontend for **Learn with Rahul** (plain HTML + CSS + JS, no build step).

## Run locally
```bash
python -m http.server 8000
# open http://localhost:8000
```
Can also be deployed as-is to any static host (Netlify, Vercel, GitHub Pages, S3, cPanel).

## Pages
| Page | File |
|---|---|
| Home (full-width hero video) | `index.html` |
| All courses (with category filters) | `courses.html` |
| Course detail pages | `course-power-sector.html`, `course-ai-everyday-work.html`, `course-financial-modelling.html`, `course-consulting-business.html` |
| Enroll (course pre-selected from course page) | `enroll.html?course=…` |
| About Rahul | `about.html` |
| Free resources (request form popup) | `resources.html` |
| Contact + FAQ | `contact.html` |
| Log in / Sign up | `login.html`, `signup.html` |
| Privacy / Terms / Refund | `privacy.html`, `terms.html`, `refund.html` |
| Not found | `404.html` |

## Structure
```
assets/logo/    logo.png (light text), logo-dark.png, logo-icon.png, favicon.png, apple-touch-icon.png
assets/images/  course & section photos
assets/video/   hero.mp4 (1280×720) + hero-poster.jpg
css/style.css   all styles
js/main.js      menu, video, filters, accordions, modals, form validation
```

## Still needed before launch
- Forms (enroll, contact, resources, login, signup) validate and show a success message but are **not connected to a backend yet**.
- Auth, student dashboard, payments (e.g. Razorpay), course delivery.
- Replace demo course content, prices, contact email and policy text with final versions.
