<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application structure
- Preserve the imported admissions portal's TanStack file routes, shared layout, semantic stylesheet and bundled reference data; this maintains the source experience without replacing the target runtime.
- Keep registration explicitly browser-only and simulated, as in the source; do not turn it into an official submission or add a backend implicitly.
- Keep unavailable source destinations as same-origin links and report them rather than inventing content.
- Load PDF generation only on download and host uploaded imagery through asset pointers to keep browser-only work and media outside the server bundle.
