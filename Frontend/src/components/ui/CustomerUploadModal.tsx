import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Button } from '../custom/button'

interface ModalProps {
    isOpen: boolean
    showStatus?: boolean
    onClose?: () => void
    title?: string
    subTitile?: string
    height?: string
    width?: string
    status?: string
    className?: string
    children: React.ReactNode
}

const CustomerUploadModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    subTitile = 'Please Fill out following details',
    height = '600px',
    width = '600px',
    status,
    showStatus = true,
    className,
    children,
}) => {
    if (!isOpen) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-stone-300/80 backdrop-blur-[2px]'
            onClick={onClose}
        >
            <div
                className={`relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-background ${className || ''}`}
                style={{ width }}
                onClick={(e) => e.stopPropagation()}>
                <Flex className='justify-between'>
                    <Flex className='flex-col'>
                        {/* Title */}
                        {title && (
                            <h2 className='justify-start self-stretch text-2xl font-bold text-neutral-800 '>{title}</h2>
                        )}
                        {/* subTitile */}
                        {subTitile && (
                            <h2 className='justify-start self-stretch text-xs font-semibold capitalize not-italic text-placeholder '>
                                {subTitile}
                            </h2>
                        )}
                    </Flex>
                    {showStatus && (
                        <span className='text-sm font-semibold leading-tight inline-flex max-h-[40px] min-w-20 cursor-pointer items-center 
                        justify-center gap-2 rounded-lg px-2 py-1 outline-1 outline-offset-[-1px] 
                        outline-dashed outline-violet-500 text-[13px] text-center' onClick={() => {
                                const url = 'https://pulseautodealerapp.s3.us-east-1.amazonaws.com/TCS+Sample+Document/customer_data_sample.csv'
                                const link = document.createElement('a');
                                link.href = url;
                                //link.setAttribute('download', 'customer-template.csv'); // optional: set file name
                                link.setAttribute('target', '_blank');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}> Sample Template</span>
                    )}
                </Flex>
                {/* Modal Content */}
                <div className='mt-4 '>{children}</div>
            </div>
        </div>
    )
}

export default CustomerUploadModal
