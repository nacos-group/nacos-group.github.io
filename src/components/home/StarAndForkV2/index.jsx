import Button from './Button.jsx';
import Star from "./Star.jsx";
import Fork from "./Fork.jsx";
import sendFetch from "@/utils/sendFetch"
import { useEffect, useState } from "preact/hooks";

const StarAndForkV2 = (props) =>{
    const [startCount, setStartCount] = useState( props.stargazers_count || 0 );
    const [forkCount, setForkCount] = useState( props.forks_count || 0 );

    const start = async () =>{
        const { stargazers_count=0, forks_count=0 } = await sendFetch("https://git-proxy-test-git-proxy-ieeqhwptvv.cn-hongkong.fcapp.run/api/alibaba/nacos");
        setStartCount(stargazers_count || 0);
        setForkCount(forks_count || 0);
    };

	useEffect(()=>{
        start();
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
				<Fork theme="light" />
				<span class="ml-2">{forkCount}</span>
			</Button>
        </star-and-fork>
	);
};

export default StarAndForkV2;