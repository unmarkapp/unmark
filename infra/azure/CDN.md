# Azure Front Door / CDN for static Next assets

Use [`provision-frontdoor.sh`](./provision-frontdoor.sh) after the frontend Container App exists.

**Caches:** `/_next/static/*` (immutable hashed assets).  
**Does not CDN:** user media, share streams, or authenticated API — keep those on the origin / presigned S3 with short private cache.

```bash
export AZURE_RESOURCE_GROUP=unmark-rg
export AZURE_CONTAINER_APP_NAME=unmark-frontend
./infra/azure/provision-frontdoor.sh
```
