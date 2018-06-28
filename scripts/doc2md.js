const { readdir, ensureDir, writeFile } = require('fs-extra')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
const path = require('path')
const uuidv4 = require('uuid/v4')

// pandoc --extract-media=assets -s word.docx -t markdown -o markdown.md
function execPandoc(srcDir, distDir, srcFile, outFile) {
  const pandoc = path.join(process.env.LOCALAPPDATA, 'Pandoc/pandoc')

  const args = [
    `--extract-media=${distDir}\\assets`,
    '-s',
    path.join(srcDir, srcFile),
    '-t',
    'markdown',
    '-o',
    path.join(distDir, outFile)
  ]

  execFile(pandoc, args)
    .then(result => console.log(`${distDir}/${outFile} has been created`))
    .catch(err => console.error(err))
}

const srcDir = 'D:\\temp\\blog-posts-export'
const distDir = 'D:\\temp\\blog-posts-export-md'

function convertEntry(name, blogEntries) {
  const uuid = uuidv4()
  const filename = name.replace(/^(.*)\.docx$/, (match, f) => f)
  const entry = {
    id: uuid,
    title: filename,
    author: '',
    modified: '',
    content: `${uuid}/${filename}.md`
  }

  ensureDir(`${distDir}\\${uuid}`)
  ensureDir(`${distDir}\\${uuid}\\assets`)
  execPandoc(srcDir, `${distDir}\\${uuid}`, name, `${filename}.md`)

  blogEntries.push(entry)
}

readdir(srcDir)
  .then(contents => {
    let blogEntries = []

    contents
      .filter(f => /^.*\.docx$/.test(f))
      .forEach(f => convertEntry(f, blogEntries))

    return blogEntries
  })
  .then(blogEntries => {
    let json = JSON.stringify(blogEntries)
    writeFile(`${distDir}/blog-entries.json`, json, 'utf8')
      .then(() => console.log(`${distDir}/blog-entries.json created`))
      .error(erro >= console.error(err))
  })
