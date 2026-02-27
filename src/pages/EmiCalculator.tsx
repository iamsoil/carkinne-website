{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Fix 2 — Check build output in Vercel

In Vercel → your project → **Settings → Build & Output Settings**:
```
Build Command:    npm run build
Output Directory: dist
```

Make sure both are set correctly.

---

## Steps:

1. In Dyad chat paste:
```
Create a file called vercel.json in the 
root of the project with this content:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}