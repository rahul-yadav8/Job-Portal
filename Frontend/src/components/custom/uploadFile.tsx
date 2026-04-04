import React from 'react'
import { FormControl, FormLabel, FormMessage, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/custom/button'
import { Flex, Img, Image } from '@chakra-ui/react'
import UploadFileImg from '@/assets/upload_icon.svg'
import greenTick from '@/assets/green-tick.svg'
import fileUploadIcon from '@/assets/file.svg'
import resetIcon from '@/assets/reset_arrow.svg'

interface FileUploadProps {
  field: {
    value?: FileList
    onChange: (value: FileList) => void
    ref: React.Ref<HTMLInputElement>
  }
  label?: string
  sublabel?: string
  accept?: string
  name: string
  selectedFile?: FileList
  onClear?: () => void
  onChange?: (files: FileList) => void
  loading?: boolean
}

export const FileUpload = ({
  field,
  label = 'Upload File',
  sublabel = '(.csv or .xlsx)',
  accept = '.csv,.xlsx',
  name,
  selectedFile,
  onClear,
  onChange,
  loading = false,
}: FileUploadProps) => {
  const hasFiles = selectedFile && selectedFile.length > 0

  return (
    <FormItem>
      <FormLabel>
        {!hasFiles ? (
          <>
            <span className='text-sm font-semibold leading-tight text-neutral-800'>{label}</span>
            <span className='pl-2 text-xs font-semibold leading-tight text-zinc-600'>{sublabel}</span>
          </>
        ) : (
          <Flex className='gap-2'>
            <span className='justify-start text-base font-semibold leading-tight text-green-600'>
              Files uploaded
            </span>
            <Image src={greenTick} alt='Files uploaded' />
          </Flex>
        )}
      </FormLabel>
      <FormControl>
        <div className='flex flex-col gap-2'>
          <input
            type='file'
            multiple
            accept={accept}
            onChange={(e) => {
              const files = e.target.files
              if (files && !loading) {
                field.onChange(files)
                onChange?.(files)
              }
            }}
            className='hidden'
            ref={field.ref}
            id={`file-upload-${name}`}
            disabled={loading}
          />

          <Flex className='gap-2'>
            <Label
              htmlFor={`file-upload-${name}`}
              className={`inline-flex max-h-[46px] min-w-40 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 outline-1 outline-offset-[-1px] ${
                !hasFiles ? 'outline-dashed outline-violet-500' : 'outline outline-slate-300'
              }`}
            >
              <Img src={!hasFiles ? UploadFileImg : fileUploadIcon} alt='upload file' />
              {hasFiles ? (
                <span className='flex flex-col text-left'>
                  {[...selectedFile].map((file, i) => (
                    <span key={i} className='text-sm text-neutral-800'>
                      {file.name} - {(file.size / 1024).toFixed(2)} KB
                    </span>
                  ))}
                </span>
              ) : (
                <span className='text-base font-medium leading-tight text-primary'>Choose Template</span>
              )}
            </Label>
            {hasFiles && (
              <Button type='button' className='p-0' variant='none' onClick={onClear}>
                <Img src={resetIcon} alt='Reset files' />
              </Button>
            )}
          </Flex>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
