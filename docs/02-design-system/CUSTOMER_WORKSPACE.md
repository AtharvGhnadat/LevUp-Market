# Customer workspace design and route inventory

## Baseline at `0a1f6fc`

The review used the actual Vite app with the Supabase SDK and a synthetic browser session. Chromium rendered signed-out forms and signed-in account views at 320, 390, 768, 1024 and 1440px. The account header stayed within the viewport. The compact layout concealed account identity behind Menu through laptop width. The signed-in disclosure offered only account settings and sign-out. The screen below it provided the same two actions. The mobile footer took up more space than the account itself. Login and signup had identical composition and side copy. There were no generic illustrations, gratuitous badges or looping page effects. Native dialog focus and cart/search behavior already worked. [Baseline captures](screenshots/customer-workspace/before)

| Routes at the base                                                           | State                                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Home, catalog, catalog detail, cart, How it works home anchor                | Functional storefront with demonstration listings                                           |
| `/custom-project`, `/checkout`, `/checkout/return`                           | Local specification and checkout previews, with payment processing disabled                 |
| `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback` | Implemented through Supabase Auth                                                           |
| `/register`                                                                  | Compatibility alias for signup                                                              |
| `/account`                                                                   | Provider identity, password recovery and sign-out only                                      |
| Dashboard, order detail, messages, support and separate settings sections    | Missing                                                                                     |
| About, resources, legal and company footer links                             | Roadmap pages. The old How it works footer link duplicated the functional homepage section. |

## Design direction

- **Product** — Students and other customers find engineering projects, prepare briefs and keep private details for project work.
- **Character** — Practical, precise and quietly warm.
- **World** — A student engineering workbench. Mineral paper, Alloy ink and the existing catalog’s physical components carry through the storefront.
- **Moments** — A photographed engineering subject grounds sign-in and signup. Inside the workspace, the real project list, order history and saved profile take priority.
- **Signature** — The Volt edge used on the storefront marks the current workspace page and important form feedback.

Desktop uses one public header and an in-page navigation column for the six workspace destinations. Settings gets a separate index and drill-down pages. Compact layouts put the same groups in the existing native drawer and use a parent breadcrumb inside each page. Login, signup and recovery use different content within one shell. The smaller footer on task pages keeps account work in focus. The initial audit found no useful published About or Resources page for the header.

The subsequent header reference explicitly included About and Resources. The implementation supplies an About page, a project guide, a customer FAQ and a resources index. The public navigation links to those pages at every supported width. [Implemented routes and browser captures](../07-testing/CUSTOMER_WORKSPACE_REBUILD.md)

## Data design before migration

Use the existing private `profiles` row for personal and academic fields and preferred catalog categories. Authentication email and verification come from Supabase Auth. Keep the legacy college and department fields as the source of those values. Store multiple private shipping addresses as children of a profile. Use the profile’s nullable default-address reference with an ownership constraint. Change only the sections a form edits. Read order headers, items and entitlement metadata from the existing tables under RLS. The workspace must distinguish empty records from failed reads.

A private customer support intake can store a request and its status, including a request to review account deletion. This cannot erase an identity, an order or an audit log. Custom project briefs and support replies must represent persisted records before appearing in the workspace. Customer roles never come from academic classification or display metadata.

Design audit adapted from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
