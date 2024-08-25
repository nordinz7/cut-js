const args = Bun.argv

let content = '';

/**
 * -f2 or -f"1 2" => field #mandatory
 * -d, => delimiter; default to tab
 * sample.tsv => filename if empty or '-; read from stdin
 */
const parseArgs = (args: string[]) => {
  const flags = args.slice(2)

  const o = {
    fields: [] as Number[],
    delimiter: '\t',
    fileName: '-',
  }

  flags.forEach((flag) => {
    if (flag.includes('-f')) {
      let _f = flag.replace('-f', '')

      if (_f.length === 1) {
        o.fields.push(Number(_f))
      } else if (_f.length > 1) {
        let cols = _f.split(' ')
        if (cols.length < 2) {
          cols = _f.split(',')
        }
        o.fields = cols.map(c => Number(c))
      }
    } else if (flag.includes('-d')) {
      let _d = flag.replace('-d', '')
      if (_d) o.delimiter = _d
    } else {
      o.fileName = flag
    }
  })

  return o
}


const parsedFlags = parseArgs(args)

if (!parsedFlags.fields.length) {
  throw new Error('Must provide which column to -f flag e.g -f2')
}

if (parsedFlags.fields.length) {
  parsedFlags.fields.forEach(field => {
    if (isNaN(Number(field))) throw new Error('Invalid -f column: has to be number e.g -f2')
  })
}

if (parsedFlags.fileName !== '-' && !content) {
  try {
    const fileContent = await Bun.file(__dirname + '/' + parsedFlags.fileName).text()

    if (fileContent) content = fileContent
  } catch (error) {
    console.error(error)
  }
} else {
  for await (const chunk of Bun.stdin.stream()) {
    if (!chunk) break;

    const chunkText = Buffer.from(chunk).toString();
    content += chunkText;
  }
}

//console.log('args:', args)

//console.log('flags', parsedFlags)

//console.log('content:', content)

const rows = content?.split('\n')
//console.log('rows:', rows)

let output = ''
rows?.forEach((row, i) => {
  const splitted = row.split(parsedFlags.delimiter)
  const filtered = splitted.filter((s, i) => parsedFlags.fields.includes(i + 1))
  const filteredParsed = filtered.join(parsedFlags.delimiter)

  output += filteredParsed + '\n'
})

console.log(output)
