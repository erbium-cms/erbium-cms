const { readdir, ensureDir, writeFile } = require('fs-extra')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
const path = require('path')
const uuidv4 = require('uuid/v4')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

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

function convertEntry(srcDir, distDir, name, blogEntries) {
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

const optionDefinitions = [
  {
    name: 'src',
    typeLabel: '{underline dir}',
    description: 'source directory to look for documents',
    type: String
  },
  {
    name: 'dist',
    typeLabel: '{underline dist}',
    description: 'target directory for markdown blog posts',
    type: String
  },
  {
    name: 'help',
    description: 'Print this usage guide.',
    alias: 'h',
    description: 'Print this usage guide.',
    type: Boolean
  }
]
const sections = [
  {
    header: 'doc2md',
    content:
      'Parses word documents in a source directory and converts them to markdown blog entries using pandoc.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]

const options = commandLineArgs(optionDefinitions)
const usage = commandLineUsage(sections)

if (options.help) {
  console.log(usage)
  process.exit(0)
}
if (!options.src || !options.dist) {
  console.log(usage)
  process.exit(1)
}

const srcDir = options.src
const distDir = options.dist

readdir(srcDir)
  .then(contents => {
    let blogEntries = []

    contents
      .filter(f => /^.*\.docx$/.test(f))
      .forEach(f => convertEntry(srcDir, distDir, f, blogEntries))

    return blogEntries
  })
  .then(blogEntries => {
    let json = JSON.stringify(blogEntries)
    writeFile(`${distDir}/blog-entries.json`, json, 'utf8')
      .then(() => console.log(`${distDir}/blog-entries.json created`))
      .error(erro >= console.error(err))
  })
