# Team Filtered website

Website should be live @ https://team-filtert.github.io/

## Developing

All files are pretty much separated into two different types:

- Site code. Your HTML, your CSS, your ~~JS~~ TS.
- Assets. Stuff like images basically.

Pretty much anything to do with site code (except for HTML component, but we'll get to that later) should be placed in the `src` dir. For the sake of having *some* organization in there, CSS and TS files should be placed in `src/styles` and `src/scripts` respectively. HTML __pages__ should be placed directly into the `src` folder.

With Vite, you are able to reference any styles or scripts directly using relative paths. For example, each HTML page should reference `./styles/style.css` and `./scripts/main.ts`. Vite automatically handles things like transpiling TS to JS, asset naming, and copying over public assets into the `dist/` folder at top-level.

### Dev commands

- `pnpm dev` - spawns a web server that serves all the pages to your browser. Any updates to any file in the project should trigger an automatic reload (maybe not HTML - not confident on that).
- `pnpm build` - build the website into `./dist`
- `pnpm preview` - previews the built site

### HTML components

This is a fairly new technology with respects to the other tech around it.
Web components are component files built using HTML and hydrated using JS on the browser side.

You can probably look at the TS files for better reference, but essentially you need to create a blank div with an ID that you will then use in a TS script to hydrate a component there.
This allows you to reuse HTML components across different pages, similar to modules from other languages.

When adding web components, they must be placed in `public/components` (effectively treating them like assets more than site code), and you must reference them using absolute paths in your TS, i.e. `/components/component-name-here.html`.

### Other notes

- **Do NOT commit built files into the repository!** They should already be gitignored for you, do not try and bypass it!
- Vite also handles bundling JS dependencies, so if we ever do need it (for some reason, I don't see why we should), this should be simple.
- Try and limit committing binary files to the repository, like images. These can balloon the size of the repo permanently.
- There should be no need to compile other languages to WASM, so you should not commit scripts in other langs to this repo.
    - Equally too, don't commit compiled WASM binaries to get around this rule (see above top-level dot point)
    - If you can't write in JS/TS, write in whichever language you prefer, and ask another team member to convert it to TS for you.
    - Why? WASM takes a performance hit when you move in and out of the WASM layer, and downloading a binary just to run a couple things is very wasteful. Additionally, WASM does not have direct access to the browser DOM, so you're going to have to write JS/TS anyways.
- Deployment is done with GitHub Actions onto GitHub Pages.
