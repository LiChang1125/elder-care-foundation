# Elder Care Foundation

Community support website for older adults and families in Weihai. React, Vite and a local Node.js server.

## Public website

https://lichang1125.github.io/elder-care-foundation/

Course Work

## Develop locally

```sh
npm ci
npm run dev
```

Open http://localhost:5173. For the local production preview, run npm run build then npm start.

## Build and publish

```sh
npm test
npm run build:pages
```



## Data and interaction

- Public hosting reads only the previously approved APEX event summary endpoint. If the endpoint is unavailable or disallows browser cross-origin access, the calendar uses the dated public snapshot in calendar.json. No credentials are included.
- On GitHub Pages, registration requests are stored only in the visitor's browser after consent. They are not sent to an organizer and do not confirm attendance. Local Node hosting retains its existing local registration store outside the project.
- Donations do not process payments; enquiry drafts download to the visitor's device. Neither action submits information to the foundation.
- Maui and ChaoFeng covers are visible; the book and video themselves are not public or unlocked by the contribution form.
- Impact figures distinguish dated aggregate records from annual goals. Service stories are scenarios, and community images are illustrations. Prospective organizations are not confirmed partners.
- Original and revised brand/gift images were supplied by the owner or edited at their request. No third-party reuse license is granted by this repository.

Local credentials, registration records, database scripts and internal working documents are excluded from this repository.
