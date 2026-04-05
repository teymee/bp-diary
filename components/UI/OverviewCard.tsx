import Image, { StaticImageData } from 'next/image'

type OverviewCardProps = {
    image: StaticImageData,
    title: string,
    children: React.ReactNode
    topContent?: React.ReactNode
}

export default function OverviewCard({ image, title, children, topContent }: OverviewCardProps) {
    return (
        <section className='bg-white border border-white-300 space-y-3 px-2.5 py-3 rounded-2xl h-full flex flex-col [ dark:border-black-300 dark:bg-black-200 ]'>
            {
                !topContent && (
                    <section className='flex items-center gap-x-3 pt-2 text-md text-gray-700 font-medium'>
                        <Image src={image} alt={title} width={50} height={50} />
                        <div className='dark:text-foreground'>{title}</div>
                    </section>)
            }
            {
                topContent && <>{topContent}</>
            }



            <section className='bg-white-100 dark:bg-black-100 rounded-xl px-3 py-2 flex-1'>
                {children}
            </section>
        </section>
    )
}
