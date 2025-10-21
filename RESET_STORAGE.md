# BizTycoon - Reset LocalStorage

If you're experiencing issues with businesses not appearing or navigation problems, you may need to reset your localStorage.

## Quick Fix - Reset localStorage

**Option 1: Browser Console (Recommended)**

1. Open your browser
2. Navigate to `http://localhost:9002`
3. Open Developer Tools (F12 or Right-click → Inspect)
4. Go to the **Console** tab
5. Paste this command and press Enter:

```javascript
localStorage.removeItem('biztycoon_balance');
localStorage.removeItem('biztycoon_businesses');
console.log('BizTycoon storage cleared! Refresh the page.');
```

6. **Refresh the page** (F5 or Cmd+R)
7. You should now start fresh with $10,000 balance

---

## Option 2: Application Storage Tab

1. Open Developer Tools (F12)
2. Go to **Application** tab (or **Storage** in Firefox)
3. Click **Local Storage** → `http://localhost:9002`
4. Find and delete these keys:
   - `biztycoon_balance`
   - `biztycoon_businesses`
5. **Refresh the page**

---

## Option 3: Clear All Site Data

1. Open Developer Tools (F12)
2. Go to **Application** tab
3. Click **Clear storage** (left sidebar)
4. Check **Local storage**
5. Click **Clear site data** button
6. **Refresh the page**

---

## What This Does

Clearing localStorage will:
- ✅ Reset your balance to $10,000
- ✅ Remove all owned businesses
- ✅ Fix any corrupted data
- ✅ Give you a fresh start

All your code changes are safe - this only clears browser data.

---

## After Reset

After clearing localStorage:
1. Refresh the page
2. You should see balance: $10,000
3. No businesses owned (fresh start)
4. Navigate to `/ventures` to establish new businesses
5. They should now appear correctly on `/dashboard`

---

## Still Having Issues?

If problems persist after reset:
1. Make sure you're running the latest code: `git pull origin master`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Check browser console for any error messages
