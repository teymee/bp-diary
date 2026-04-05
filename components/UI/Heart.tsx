'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import heart from "@/assets/images/heart.svg"
import star from "@/assets/images/star.svg"
import blackHeart from "@/assets/images/black-heart.svg"
import OverviewCard from './OverviewCard'

export default function HeartComponent() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const hasStartedRef = useRef(false)
    const [isHeartbeatRunning, setIsHeartbeatRunning] = useState(true)

    const startHeartbeatAudio = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return

        const playPromise = audio.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    hasStartedRef.current = true
                })
                .catch((error) => {
                    if (error instanceof DOMException && error.name === 'NotAllowedError') {
                        return
                    }
                    console.error('Play error:', error)
                })
        }
    }, [])

    const handleHeartClick = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return

        setIsHeartbeatRunning((currentState) => {
            const nextState = !currentState

            if (!nextState) {
                audio.pause()
                audio.currentTime = 0
            } else {
                startHeartbeatAudio()
            }

            return nextState
        })
    }, [startHeartbeatAudio])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.loop = true
        audio.volume = 1
        audio.playbackRate = 1

        const handleLoadedMetadata = () => {
            if (audio.duration > 0) {
                const targetDuration = 1.6
                const syncedPlaybackRate = audio.duration / targetDuration
                audio.playbackRate = Math.max(0.75, Math.min(1.5, syncedPlaybackRate))
            }
        }

        const handleError = (event: Event) => {
            const target = event.target as HTMLAudioElement | null
            console.error('Audio error:', target?.error)
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('error', handleError)

        const removeInteractionListeners = () => {
            document.removeEventListener('pointerdown', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
            document.removeEventListener('touchstart', handleInteraction)
        }

        const handleInteraction = () => {
            startHeartbeatAudio()
            if (hasStartedRef.current) {
                removeInteractionListeners()
            }
        }

        document.addEventListener('pointerdown', handleInteraction)
        document.addEventListener('touchstart', handleInteraction)
        document.addEventListener('keydown', handleInteraction)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('error', handleError)
            removeInteractionListeners()
            audio.pause()
            audio.currentTime = 0
            hasStartedRef.current = false
        }
    }, [startHeartbeatAudio])

    return (
        <section className='space-y-4 '>
            <div>
                <h3 className='font-semibold text-base'>Welcome <span className='text-primary-200 font-bold'>My Account</span></h3>
                <h1 className='font-bold text-[36px]'>Overview Of Your Health</h1>
            </div>

            <section className='relative'>
                <audio 
                    ref={audioRef} 
                    src="/heartbeat.mp3" 
                    preload="auto"
                />
                <div
                    className='heart-beat relative inline-block cursor-pointer group'
                    style={{ animationPlayState: isHeartbeatRunning ? 'running' : 'paused' }}
                    role='button'
                    tabIndex={0}
                    onClick={handleHeartClick}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleHeartClick()
                        }
                    }}
                >
                    <Image src={heart} alt="Light modeHeart" className='dark:hidden' />
                    <Image src={blackHeart} alt=" Dark mode Heart" className='hidden dark:block' />
                    <span className='pointer-events-none absolute right-0 top-10 whitespace-nowrap rounded-lg bg-white px-3 py-1 text-xs font-medium text-primary-200 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black-100 dark:text-white-100'>
                        Click to 
                        <span className={`px-2 font-bold ${isHeartbeatRunning ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {isHeartbeatRunning ? 'stop' : 'start'}
                        </span>{' '}
                        the heart
                    </span>
                </div>

                <section className='absolute -bottom-20 left-0 w-52'>

                    <OverviewCard image={star} title="Your Heart Analysis">
                        <div className='h-20 text-white-200 text-sm'>
                            <p>mmhg</p>
                        </div>
                    </OverviewCard>
                </section>

                <section className='absolute -bottom-20 right-0 w-60'>
                    <section className='bg-white border border-white-300 space-y-2 text-sm font-medium px-2.5 py-3 rounded-2xl [ dark:border-black-300 dark:bg-black-200 ]'>
                        <div className='bg-white-100 dark:bg-black-100 py-2 px-4 rounded-xl'>
                            <p>Gender : Male</p>
                        </div>

                        <div className='bg-white-100 dark:bg-black-100 py-2 px-4 rounded-xl'>
                            <p>Age : 30</p>
                        </div>
                    </section>
                </section>

            </section>
        </section>
    )
}
