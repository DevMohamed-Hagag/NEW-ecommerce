# Northstar Meta Pixel Demo Store

A static ecommerce demo ready to deploy on Vercel. It contains the Meta Pixel ID supplied by you:
`991877973966016`.

## Deploy to Vercel

1. Create a GitHub repository and upload all files/folders from this project.
2. Sign in at https://vercel.com/ and choose **Add New → Project**.
3. Import your GitHub repository.
4. Framework Preset: **Other**. Build Command: leave empty. Output Directory: `.` (or leave default if Vercel detects static files).
5. Click **Deploy**.
6. Open the deployed domain and test the store.

You can also deploy using Vercel CLI from this folder:
`npx vercel`

## Test your Pixel

1. In Meta Events Manager, select the Pixel and open **Test Events**.
2. Enter/open your Vercel website and refresh the page. Confirm `PageView`.
3. Click a product image or product name: `ViewContent`.
4. Click **ADD TO CART +**: `AddToCart`.
5. Open cart and choose **Continue to checkout**: `InitiateCheckout`.
6. Fill the demo form and click **Place demo order**: `Purchase`.

Events include `content_ids` matching the IDs in `feed.xml`, `content_type: product`, `value`, and `currency: EGP`.

## Catalog feed

After deployment, replace `YOUR-VERCEL-DOMAIN.vercel.app` in `feed.xml` with your actual Vercel domain. Then open:
`https://YOUR-VERCEL-DOMAIN.vercel.app/feed.xml`

Important: this sample feed is a template, not a fully valid live product catalog yet. It references image files under `/images/` that are not included in this demo. Add real product images at those paths and update the image links and product page links before submitting the feed to Meta. For pixel event testing, the product images drawn in CSS are sufficient.

## Notes

- This is a demo only. It does not process payments, store orders, or ship products.
- `Purchase` fires only when the fake checkout form is submitted. Do not treat these as real sales.
- Your Pixel ID is public by design in browser code. Never put secret API keys in frontend files.
- For cleaner product-detail URLs and a production-ready catalog, use a real ecommerce platform or extend this project.
