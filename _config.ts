import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume({
  src: "/src",
  dest: "./_site",
});

site.use(jsx());
site.use(tailwindcss());
site.use(postcss());

export default site;
