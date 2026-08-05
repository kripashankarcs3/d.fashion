# Raw campaign masters (self-hosted)

These are the untouched master downloads for the D'Fashion campaign
photography. `scripts/optimize-images.mjs` reads them and emits the sized
AVIF / WebP / JPEG variants plus LQIPs under `public/images/campaign/`, along
with the base64-LQIP manifest in `src/lib/campaign-assets.generated.ts`.

After replacing any master, re-run:

```sh
npm run optimize:images
npm run typecheck:client
```

## Licence check

All 8 frames are sourced from **Unsplash**, whose licence grants free
commercial use without attribution and — importantly for us — **prohibits
hot-linking**. Self-hosting the derivatives under `public/images/campaign/` is
the compliant pattern. Each photo ID is recorded below so the source remains
auditable if a photographer later removes their upload.

| File        | Unsplash photo ID (canonical `photo-<id>` URL)            |
|-------------|------------------------------------------------------------|
| opening.jpg | `1524504388940-b1c1722653e1`                               |
| closing.jpg | `1483985988355-763728e1935b`                               |
| season.jpg  | `1509631179647-0177331693ae`                               |
| undertone.jpg | `1544005313-94ddf0286df2`                                |
| archetype.jpg | `1490481651871-ab68de25d43d`                             |
| tryOn.jpg   | `1489987707025-afc232f7ea0f`                               |
| process.jpg | `1487222477894-8943e31ef7b2`                               |
| atelier.jpg | `1445205170230-053b83016050`                               |

Masters are downloaded at `q=90&w=1920&auto=format&fit=crop`.
