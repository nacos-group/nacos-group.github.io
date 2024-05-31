import Button from './Button.jsx';
import Star from "./Star.jsx";
import Fork from "./Fork.jsx";
import { useEffect, useState } from "preact/hooks";
import useCustomSWR from "@/utils/useCustomSWR";
import type { StarAndForkT } from 'src/types';


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

            <Button 
				size="large"
				type="primary"
				class="rounded-3xl"
				href="https://github.com/alibaba/nacos/fork"
				target="_blank"
			>
				<Fork />
				<span class="ml-2">{forkCount}</span>
			</Button>
        </star-and-fork>
	);
};

export default StarAndForkV2;