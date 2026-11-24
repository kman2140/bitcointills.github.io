# BitcoinTills

A responsive landing page for the A$199 original BitcoinTills POS unit, followed by the A$20/month Bitcoin business support subscription.

Run `node scripts/build.mjs` to rebuild the self-contained Worker. `web/index.html`
is the editable page; `worker/api.js` handles setup enquiries. The build assembles
`worker/index.js` and `dist/server/index.js`. No external fonts, scripts or images.

The hosting manifest declares the Sites-provisioned R2 binding `BUCKET`. Setup
enquiries are saved as private JSON objects under `enquiries/`. There is no public
read endpoint. Each enquiry records its own contact consent and request reference.
No wallet secrets or payment details are collected.

On the static GitHub Pages site, the setup form posts to FormSubmit
(`https://formsubmit.co/ajax/bitcointills.spiny421@aleeas.com`), which emails each enquiry
to bitcointills.spiny421@aleeas.com. The first submission triggers a one-time activation
email from FormSubmit that must be confirmed before enquiries are delivered.

Billing is not connected. The website never claims to charge or activate a
subscription. To enable recurring billing, add the operator's chosen provider and
verified checkout link / webhook flow. Before a public commercial launch, confirm
business contact details, GST treatment, service terms and the advertising channels.

The POS illustration and payment interaction are explicitly illustrative, with no
real payment address, QR invoice or transaction claim.
