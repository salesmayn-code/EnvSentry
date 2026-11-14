import type { Declaration, ParsedEnv } from './types.ts'

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/
const EXPORT_PREFIX = /^export\s+/

export function parseEnv(text: string): ParsedEnv {
  const source = text.startsWith('\uFEFF') ? text.slice(1) : text
  const lines = source.split(/\r?\n/)
  const declarations: Declaration[] = []
  const invalidLines: number[] = []

  let index = 0
  while (index < lines.length) {
    const lineNumber = index + 1
    const content = lines[index].trimStart()

    if (content.trim() === '' || content.startsWith('#')) {
      index += 1
      continue
    }

    const body = EXPORT_PREFIX.test(content) ? content.replace(EXPORT_PREFIX, '') : content
    const equals = body.indexOf('=')
    const key = equals === -1 ? '' : body.slice(0, equals).trimEnd()

    if (equals === -1 || !KEY_PATTERN.test(key)) {
      invalidLines.push(lineNumber)
      index += 1
      continue
    }

    const rawValue = body.slice(equals + 1)
    const trimmed = rawValue.trimStart()
    const quote = trimmed.charAt(0)
    let value: string

    if (quote === '"') {
      const rest = trimmed.slice(1)
      const close = rest.indexOf('"')
      if (close !== -1) {
        value = rest.slice(0, close)
      } else {
        let buffer = rest
        let closeLine = -1
        for (let next = index + 1; next < lines.length; next += 1) {
          const quoteAt = lines[next].indexOf('"')
          if (quoteAt !== -1) {
            buffer += `\n${lines[next].slice(0, quoteAt)}`
            closeLine = next
            break
          }
          buffer += `\n${lines[next]}`
        }
        value = buffer
        index = closeLine === -1 ? lines.length - 1 : closeLine
      }
    } else if (quote === "'" || quote === '`') {
      const rest = trimmed.slice(1)
      const close = rest.indexOf(quote)
      value = close === -1 ? rest : rest.slice(0, close)
    } else {
      const comment = rawValue.indexOf(' #')
      value = (comment === -1 ? rawValue : rawValue.slice(0, comment)).trim()
    }

    declarations.push({ key, line: lineNumber, hasValue: value.trim() !== '' })
    index += 1
  }

  return { declarations, invalidLines }
}
