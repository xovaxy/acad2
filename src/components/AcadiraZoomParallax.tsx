'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import Lenis from 'lenis'
import { ZoomParallax } from "@/components/ui/zoom-parallax";

export default function AcadiraZoomParallax() {

	React.useEffect( () => {
        const lenis = new Lenis()
       
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    },[])

	// Education and learning focused images for Acadira
	const images = [
		{
			src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Students collaborating in modern classroom',
		},
		{
			src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Digital learning and technology',
		},
		{
			src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Academic books and learning materials',
		},
		{
			src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Team collaboration and brainstorming',
		},
		{
			src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Online learning and AI technology',
		},
		{
			src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'University campus and academic environment',
		},
		{
			src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'AI and machine learning visualization',
		},
	];

	return (
		<main className="min-h-screen w-full">
			<div className="relative flex h-[50vh] items-center justify-center bg-gradient-to-b from-[#030303] to-gray-900">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]',
						'blur-[30px]',
					)}
				/>
				<div className="text-center z-10">
					<h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
						Experience Acadira
					</h2>
					<p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto px-4">
						Discover how AI-powered learning transforms education
					</p>
				</div>
			</div>
			<ZoomParallax images={images} />
			<div className="h-[50vh] bg-gradient-to-t from-gray-900 to-[#030303]"/>
		</main>
	);
}
