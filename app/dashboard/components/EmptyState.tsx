import Image from 'next/image'

import empty from '@/assets/images/empty.svg'

type EmptyStateProps = {
    title: string
    description: string
    imageSize?: number
}

export default function EmptyState({
    title,
    description,
    imageSize = 35,
}: EmptyStateProps) {
    return (
        <section className='flex flex-col items-center justify-center gap-y-2 h-full py-6 text-center'>
            <Image src={empty} alt="No data available" width={imageSize} height={imageSize} />
            <div className='text-center text-xs'>
                <h2 className='text-sm font-medium'>{title}</h2>
                <p>{description}</p>
            </div>
        </section>
    )
}