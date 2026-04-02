import Button from './Button.jsx';
import Star from "./Star.jsx";
import Fork from "./Fork.jsx"
import Start from "./Start.jsx"
import { useEffect, useState, useCallback } from "preact/hooks";
import useCustomSWR from "@/utils/useCustomSWR";
import type { StarAndForkT } from 'src/types';

const ArrowDown = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
		<path d="M12 5v14M19 12l-7 7-7-7"/>
	</svg>
);

const StarAndForkV2 = (props:StarAndForkT) =>{
	const { swrData={}, fetchData } = useCustomSWR("https://git-proxy-test-git-proxy-ieeqhwptvv.cn-hongkong.fcapp.run/api/alibaba/nacos");
	const [startCount, setStartCount] = useState(props.stargazers_count || 0);
	const [forkCount, setForkCount] = useState(props.forks_count || 0);

	const start = async () => {
		// 请求成功才会设置star/fork数
			if (swrData.stargazers_count) {
				const { stargazers_count, forks_count } = swrData;
				setStartCount(stargazers_count || props.stargazers_count);
				setForkCount(forks_count || props.forks_count);
			}
	};

	useEffect(()=>{
		start();
	},[swrData]);

	useEffect(()=>{
			fetchData()
	},[]);

	const scrollToQuickStart = useCallback((e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		const el = document.getElementById('quickstart');
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, []);

	return (
        <star-and-fork class="shortcut flex">
            <Button 
				size="large"
				class="rounded-3xl mr-4"
				href="https://github.com/alibaba/nacos"
				target="_blank"
			>
                <Star />
                <span class="text-[0.875rem] leading-4 ml-2">{startCount}</span>
			</Button>

            <span class="button-div">
				<button
					class="button w-fit p-0 bg-transparent"
					onClick={scrollToQuickStart}
				>
					<span class="button-primary flex items-center justify-center no-underline xp-large h-large rounded-3xl quickstart-btn">
						<Start />
						<span class="ml-2">{props.forkText || "快速开始"}</span>
						<span class="arrow-down-icon">
							<ArrowDown />
						</span>
					</span>
				</button>
			</span>
        </star-and-fork>
	);
};

export default StarAndForkV2;