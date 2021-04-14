import React, { useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';

import './resizable.css';

interface ResizableProps {
	direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
	const [innerHeight, setInnerHeight] = useState(window.innerHeight);
	const [innerWidth, setInnerWidth] = useState(window.innerWidth);
	const [width, setWidth] = useState(0.75 * innerWidth);
	useEffect(() => {
		// resizeing throttle
		let timer: any;
		const listener = () => {
			if (timer) clearTimeout(timer);
			setTimeout(() => {
				setInnerHeight(window.innerHeight);
				setInnerWidth(window.innerWidth);
				// minconstrains fix
				if (window.innerWidth * 0.75 < width) {
					setWidth(window.innerWidth * 0.75);
				}
			}, 300);
		};
		window.addEventListener('resize', listener);
		return () => {
			window.removeEventListener('resize', listener);
		};
	}, [width]);

	if (direction === 'vertical') {
		return (
			<ResizableBox
				height={300}
				width={Infinity}
				maxConstraints={[Infinity, innerHeight * 0.9]}
				minConstraints={[Infinity, 100]}
				resizeHandles={['s']}>
				{children}
			</ResizableBox>
		);
	}
	// horizontal
	return (
		<ResizableBox
			className='resize-horizontal'
			height={Infinity}
			width={width}
			maxConstraints={[innerWidth * 0.75, Infinity]}
			minConstraints={[innerWidth * 0.2, Infinity]}
			resizeHandles={['e']}
			onResizeStop={(_, data) => setWidth(data.size.width)}>
			{children}
		</ResizableBox>
	);
};

export default Resizable;
