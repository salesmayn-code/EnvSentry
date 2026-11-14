import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { FileSummary } from '../lib/types'

const MAX_FILE_SIZE_BYTES = 1024 * 1024
const DEFAULT_PASTED_NAME = '.env.pasted'

export interface IncomingEnvFile {
  name: string
  text: string
}

interface FilesPanelProps {
  files: FileSummary[]
  onAddFiles: (incoming: IncomingEnvFile[]) => void
  onSelectReference: (id: string) => void
  onRemoveFile: (id: string) => void
}

function formatInvalidLines(lines: number[]): string {
  const count = lines.length
  const unit = count === 1 ? 'unreadable line' : 'unreadable lines'
  return `${count} ${unit} (${lines.join(', ')})`
}

function eventHasFiles(event: DragEvent): boolean {
  const dt = event.dataTransfer
  if (!dt) {
    return false
  }
  return dt.types.includes('Files') || dt.files.length > 0
}

export function FilesPanel({
  files,
  onAddFiles,
  onSelectReference,
  onRemoveFile,
}: FilesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragDepthRef = useRef(0)
  const pasteButtonRef = useRef<HTMLButtonElement>(null)
  const pasteNameInputRef = useRef<HTMLInputElement>(null)
  const wasPasteOpenRef = useRef(false)

  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPasteOpen, setIsPasteOpen] = useState(false)
  const [pasteName, setPasteName] = useState(DEFAULT_PASTED_NAME)
  const [pasteText, setPasteText] = useState('')

  const processFileList = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return
      }

      setErrorMessage(null)

      const accepted: IncomingEnvFile[] = []
      const errors: string[] = []

      for (const file of Array.from(fileList)) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          errors.push(`"${file.name}" exceeds the 1 MB limit and was not added.`)
          continue
        }

        try {
          const text = await file.text()
          accepted.push({ name: file.name, text })
        } catch {
          errors.push(`Could not read "${file.name}".`)
        }
      }

      if (accepted.length > 0) {
        const nameCounts = new Map<string, number>()
        for (const item of accepted) {
          nameCounts.set(item.name, (nameCounts.get(item.name) ?? 0) + 1)
        }
        for (const [name, count] of nameCounts) {
          if (count >= 2) {
            const countLabel = count === 2 ? 'Two' : String(count)
            errors.push(
              `${countLabel} files named "${name}" were added together; only the last one was kept. Add them separately with different names.`,
            )
          }
        }
        onAddFiles(accepted)
      }

      if (errors.length > 0) {
        setErrorMessage(errors.join(' '))
      }
    },
    [onAddFiles],
  )

  useEffect(() => {
    function handleWindowDragEnter(event: DragEvent) {
      if (!eventHasFiles(event)) {
        return
      }
      event.preventDefault()
      dragDepthRef.current += 1
      setIsDragging(true)
    }

    function handleWindowDragOver(event: DragEvent) {
      if (!eventHasFiles(event)) {
        return
      }
      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }
    }

    function handleWindowDragLeave(event: DragEvent) {
      if (!eventHasFiles(event)) {
        return
      }
      event.preventDefault()
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
      if (dragDepthRef.current === 0) {
        setIsDragging(false)
      }
    }

    function handleWindowDrop(event: DragEvent) {
      if (!eventHasFiles(event)) {
        return
      }
      event.preventDefault()
      dragDepthRef.current = 0
      setIsDragging(false)
      void processFileList(event.dataTransfer?.files ?? null)
    }

    window.addEventListener('dragenter', handleWindowDragEnter)
    window.addEventListener('dragover', handleWindowDragOver)
    window.addEventListener('dragleave', handleWindowDragLeave)
    window.addEventListener('drop', handleWindowDrop)
    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter)
      window.removeEventListener('dragover', handleWindowDragOver)
      window.removeEventListener('dragleave', handleWindowDragLeave)
      window.removeEventListener('drop', handleWindowDrop)
    }
  }, [processFileList])

  useEffect(() => {
    if (isPasteOpen) {
      wasPasteOpenRef.current = true
      pasteNameInputRef.current?.focus()
    } else if (wasPasteOpenRef.current) {
      wasPasteOpenRef.current = false
      pasteButtonRef.current?.focus()
    }
  }, [isPasteOpen])

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files
    void processFileList(selected)
    e.target.value = ''
  }

  function handleOpenPaste() {
    setErrorMessage(null)
    setIsPasteOpen(true)
  }

  function handleCancelPaste() {
    setIsPasteOpen(false)
    setPasteName(DEFAULT_PASTED_NAME)
    setPasteText('')
    setErrorMessage(null)
  }

  function handleSubmitPaste(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedName = pasteName.trim()
    if (!trimmedName) {
      setErrorMessage('Enter a file name before adding.')
      return
    }

    if (new Blob([pasteText]).size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`"${trimmedName}" exceeds the 1 MB limit and was not added.`)
      return
    }

    onAddFiles([{ name: trimmedName, text: pasteText }])
    setIsPasteOpen(false)
    setPasteName(DEFAULT_PASTED_NAME)
    setPasteText('')
  }

  return (
    <aside aria-labelledby="files-heading" className="flex min-w-0 flex-col gap-4">
      <h2 id="files-heading" className="text-[15px] font-semibold text-text">
        Files
      </h2>

      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed px-4 py-6 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/8'
            : 'border-border bg-surface'
        }`}
      >
        <p className="text-[13px] text-muted">Drop .env files here</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
        >
          Choose files
        </button>
      </div>

      {!isPasteOpen ? (
        <div className="-mt-1 flex justify-center">
          <button
            ref={pasteButtonRef}
            type="button"
            onClick={handleOpenPaste}
            className="cursor-pointer text-[12px] text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
          >
            Paste instead
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitPaste}
          className="flex flex-col gap-3 rounded-[6px] border border-border bg-surface p-3"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="paste-file-name"
              className="text-[12px] font-medium text-muted"
            >
              File name
            </label>
            <input
              ref={pasteNameInputRef}
              id="paste-file-name"
              type="text"
              value={pasteName}
              onChange={(e) => setPasteName(e.target.value)}
              placeholder={DEFAULT_PASTED_NAME}
              className="h-8 w-full min-w-0 rounded-[6px] border border-border bg-bg px-2.5 font-mono text-[13px] text-text placeholder:text-muted"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="paste-file-content"
              className="text-[12px] font-medium text-muted"
            >
              File contents
            </label>
            <textarea
              id="paste-file-content"
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="KEY=value"
              className="w-full min-w-0 resize-y rounded-[6px] border border-border bg-bg px-2.5 py-2 font-mono text-[12px] text-text placeholder:text-muted"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="h-8 cursor-pointer rounded-[6px] border border-accent bg-accent/12 px-3 text-[13px] font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Add file
            </button>
            <button
              type="button"
              onClick={handleCancelPaste}
              className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="rounded-[6px] border border-critical/40 bg-critical/10 px-3 py-2 text-[12px] break-words text-critical"
        >
          {errorMessage}
        </p>
      )}

      {files.length > 0 && (
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="sr-only">Loaded environment files</legend>
          <ul className="divide-y divide-border overflow-hidden rounded-[6px] border border-border bg-surface">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-2 px-3 py-2.5"
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="reference-file"
                    value={file.id}
                    checked={file.isReference}
                    onChange={() => onSelectReference(file.id)}
                    aria-label={`Set ${file.name} as reference`}
                    className="size-3.5 shrink-0 cursor-pointer accent-[#2dd4a3]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-mono text-[13px] text-text">
                        {file.name}
                      </span>
                      {file.isReference && (
                        <span className="shrink-0 rounded border border-accent/40 bg-accent/12 px-1.5 py-0.5 text-[11px] font-medium leading-none text-accent">
                          Reference
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[12px] text-muted">
                      <span className="tabular-nums">{file.keyCount} keys</span>
                      <span className="flex items-center gap-1.5 font-mono tabular-nums">
                        <span className="sr-only">
                          {file.critical} critical, {file.info} info
                        </span>
                        <span
                          className={file.critical > 0 ? 'text-critical' : 'text-muted'}
                          title={`${file.critical} critical`}
                          aria-hidden="true"
                        >
                          {file.critical}
                        </span>
                        <span className="text-border" aria-hidden="true">
                          /
                        </span>
                        <span
                          className={file.info > 0 ? 'text-info' : 'text-muted'}
                          title={`${file.info} info`}
                          aria-hidden="true"
                        >
                          {file.info}
                        </span>
                      </span>
                    </span>
                    {file.invalidLines.length > 0 && (
                      <span className="mt-0.5 block break-words text-[11px] text-muted">
                        {formatInvalidLines(file.invalidLines)}
                      </span>
                    )}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => onRemoveFile(file.id)}
                  aria-label={`Remove ${file.name}`}
                  title={`Remove ${file.name}`}
                  className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-raised hover:text-text"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 4.5l7 7m0-7l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </aside>
  )
}
