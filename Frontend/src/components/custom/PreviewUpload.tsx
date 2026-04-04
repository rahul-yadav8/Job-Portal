import React, { useEffect, useRef, useState } from 'react'
import { FormControl, FormLabel, FormMessage, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/custom/button'
import { Flex, Img, Image } from '@chakra-ui/react'
import UploadFileImg from '@/assets/upload_icon.svg'
import greenTick from '@/assets/green-tick.svg'
import resetIcon from '@/assets/reset_arrow.svg'
import Loader from '../loader'

interface PreviewUploadProps {
  name: string
  value?: string
  label?: string
  sublabel?: string
  accept?: string
  previewUrl?: string
  onClear?: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading?: boolean
}

export const PreviewUpload = ({
  name,
  value,
  label = 'Upload File',
  sublabel = '(.png or .jpg)',
  accept = 'image/png,image/jpeg',
  previewUrl,
  onClear,
  onChange,
  loading,
}: PreviewUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const hasPreview = Boolean(previewUrl && previewUrl.trim() !== '')
  const hasFile = !!selectedFile || hasPreview

  // useEffect(() => {
  //   const shouldClear = (!previewUrl || previewUrl.trim() === '') && !selectedFile

  //   if (shouldClear) {
  //     setSelectedFile(null)
  //     if (inputRef.current) inputRef.current.value = ''
  //   }
  // }, [previewUrl])

  return (
    <FormItem>
      <FormLabel>
        {!hasFile ? (
          <>
            <span className='text-sm font-semibold text-neutral-800'>{label}</span>
            <span className='pl-2 text-xs text-zinc-600'>{sublabel}</span>
          </>
        ) : (
          <Flex align='center' gap={2}>
            {loading ? (
              <span className='text-base font-semibold text-zinc-600'>File uploading...</span>
            ) : (
              <>
                <Img src={greenTick} alt='Uploaded' />
                <span className='text-base font-semibold text-green-600'>File uploaded</span>
              </>
            )}
          </Flex>
        )}
      </FormLabel>

      <FormControl>
        <div className='flex items-center gap-2'>
          <input
            type='file'
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setSelectedFile(file)
              onChange?.(e)
            }}
            className='hidden'
            ref={inputRef}
            id={`file-upload-${name}`}
          />

          <Label
            htmlFor={`file-upload-${name}`}
            className={`relative flex h-[100px] w-[160px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg  outline-1 outline-offset-[-1px] ${
              !hasFile ? 'outline-dashed outline-violet-500' : 'outline outline-slate-300'
            }`}
          >
            {!hasFile || !hasPreview ? (
              <>
                <Img src={UploadFileImg} alt='upload' />
                <span className='text-base font-medium text-primary'>Choose File</span>
              </>
            ) : (
              <>
                {loading && (
                  <Flex
                    position='absolute'
                    inset={0}
                    align='center'
                    justify='center'
                    bg='whiteAlpha.800'
                    zIndex={1}
                  >
                    <Loader />
                  </Flex>
                )}
                <Image
                  src={previewUrl}
                  alt='preview'
                  boxSize='100%'
                  objectFit='cover'
                  display={loading ? 'none' : 'block'}
                />
              </>
            )}
          </Label>

          {hasFile && (
            <Button
              variant='none'
              size='sm'
              type='button'
              onClick={() => {
                onClear?.()
                setSelectedFile(null)
                inputRef.current?.click()
              }}
              className='p-0'
            >
              <Img src={resetIcon} alt='Reset' />
            </Button>
          )}
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  )
}