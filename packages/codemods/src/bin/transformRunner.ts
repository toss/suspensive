import { join } from 'node:path'
import execa from 'execa'
import prompts from 'prompts'

const TRANSFORMER_INQUIRER_CHOICES = [
  {
    title: 'tanstack-query-import',
    description: 'Migrate imports to @tanstack/react-query in @suspensive/react-query',
  },
  {
    title: 'migrate-query-client-consumer-props',
    description: 'Migrate QueryClientConsumer context prop to queryClient',
  },
  {
    title: 'migrate-with-api',
    description: 'Migrate wrap API to with API for Suspensive v3',
  },
  {
    title: 'remove-networkmode',
    description: 'Remove networkMode from Suspense API',
  },
]

function onCancel() {
  process.exit(1)
}

export const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')
export const transformerDirectory = join(__dirname, '../', '../', 'dist', 'transforms')

export async function transformRunner(transform?: string, path?: string, options?: { dry?: boolean; print?: boolean }) {
  let transformer: string = transform ?? ''
  let directory: string = path ?? ''

  if (transform && !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.title === transform)) {
    console.error('Invalid transform choice, pick one of:')
    console.error(TRANSFORMER_INQUIRER_CHOICES.map((x) => `- ${+x.title}`).join('\n'))
    process.exit(1)
  }

  if (!transform) {
    const res = await prompts(
      {
        type: 'select',
        name: 'transformer',
        message: 'Which transform would you like to apply?',
        choices: TRANSFORMER_INQUIRER_CHOICES.reverse().map(({ title, description }) => {
          return {
            title,
            description,
            value: title,
          }
        }),
      },
      { onCancel }
    )

    transformer = res.transformer as string
  }

  if (!path) {
    const res = await prompts(
      {
        type: 'text',
        name: 'path',
        message: 'On which files or directory should the codemods be applied?',
        initial: '.',
      },
      { onCancel }
    )

    directory = res.path as string
  }

  const args: Array<string> = []

  if (options?.dry) {
    args.push('--dry')
  }
  if (options?.print) {
    args.push('--print')
  }
  args.push('--no-babel')

  args.push('--ignore-pattern=**/node_modules/**')
  args.push('--ignore-pattern=**/.next/**')

  args.push('--extensions=tsx,ts,jsx,js')

  args.push('--transform', join(transformerDirectory, `${transformer}.cjs`))
  args.push(directory)

  console.log(`Executing command: jscodeshift ${args.join(' ')}`)

  const execaChildProcess = execa(jscodeshiftExecutable, args, {
    env: process.stdout.isTTY ? { FORCE_COLOR: 'true' } : {},
  })

  // "\n" + "a\n" + "b\n"
  let lastThreeLineBreaks = ''

  if (execaChildProcess.stdout) {
    execaChildProcess.stdout.pipe(process.stdout)
    execaChildProcess.stderr?.pipe(process.stderr)

    // The last two lines contain the successful transformation count as "N ok".
    // To save memory, we "slide the window" to keep only the last three line breaks.
    // We save three line breaks because the EOL is always "\n".
    execaChildProcess.stdout.on('data', (chunk: Buffer) => {
      lastThreeLineBreaks += chunk.toString('utf-8')

      let cutoff = lastThreeLineBreaks.length

      // Note: the stdout ends with "\n".
      // "foo\n" + "bar\n" + "baz\n" -> "\nbar\nbaz\n"
      // "\n" + "foo\n" + "bar\n" -> "\nfoo\nbar\n"
      for (let i = 0; i < 3; i++) {
        cutoff = lastThreeLineBreaks.lastIndexOf('\n', cutoff) - 1
      }

      if (cutoff > 0 && cutoff < lastThreeLineBreaks.length) {
        lastThreeLineBreaks = lastThreeLineBreaks.slice(cutoff + 1)
      }
    })
  }

  try {
    const result = await execaChildProcess

    if (result.failed) {
      throw new Error(`jscodeshift exited with code ${result.exitCode}`)
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
