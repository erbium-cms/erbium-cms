# erbium CMS

There is a saying that everybody needs to roll his own CMS. So, this is my take
on it.

The name, erbium CMS, is derived from one of the rare earths
[erbium](https://en.wikipedia.org/wiki/Erbium).

## Migrating from Winword Doc

In the folder `scripts` you will find `doc2md.js`. This script is also available through `yarn run doc2md`.

`doc2md` can be used to convert a directory including posts as word documents to markdown documents. The tool utilizes
[pandoc](https://pandoc.org/) for that. Please make sure that you have it installed. The basic usage of `doc2md` is:

```
yarn run doc2md --src <srcDir> --dist <distDir>
```

`<srcDir` is the directory to read doc files from and `<distDir>` the directory to put the markdown documents, e.g.

```
yarn run doc2md --src D:\\temp\\blog-posts-export --dist D:\\temp\\blog-posts-export-md
```
