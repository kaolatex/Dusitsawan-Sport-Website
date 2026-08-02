<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:prelaunch-countdown-cleanup-note -->
# Pre-Launch Countdown & Emergency Override Removal (For Future AI Agents)
When the USER instructs you to remove the pre-launch countdown, PreLaunchWrapper, or clean up the launch screen after August 3, 2026:
1. In `app/layout.tsx`:
   - Remove the line: `import PreLaunchWrapper from "@/components/PreLaunchWrapper";`
   - Unwrap the `<PreLaunchWrapper>` and `</PreLaunchWrapper>` tags surrounding `<PresenceProvider>`.
2. Delete the file `components/PreLaunchWrapper.tsx` entirely from the local workspace filesystem.
3. In `app/admin/page.tsx`:
   - Remove the entire UI button block starting from `{/* 🗑️ [ถอดออกได้หลังเปิดเว็บ] START: ปุ่มเล็ก REJECT เค้าท์ดาวน์สีแดง */}` down to `{/* ... END: ปุ่มเล็ก REJECT เค้าท์ดาวน์สีแดง */}` placed in the header bar next to the Supabase Connected badge.
Perform this cleanup cleanly without breaking any surrounding layout or providers!
<!-- END:prelaunch-countdown-cleanup-note -->
