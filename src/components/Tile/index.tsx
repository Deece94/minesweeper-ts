import { useMemo, useState } from "react";
import styled from "styled-components";

const TileContainer = styled.button<{
	isVisible: boolean;
	onClick: any;
	onContextmenu: any;
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50px;
	height: 50px;
	border-radius: 0px;
	border: 0px;

	${(props) => {
		if (props.isVisible) {
			return `
        background-color: #e0e0e0;
        border: 0.5px solid #c0c0c0;
        cursor: default;
        &:hover {
          border: 0.5px solid #c0c0c0;
        }
      `;
		} else {
			return `
        box-shadow: inset 0.2em 0.2em 0.2em 0 rgba(255, 255, 255, 0.5),
        inset -0.2em -0.2em 0.2em 0 rgba(0, 0, 0, 0.5);
        cursor: pointer;
        background-color: #c0c0c0;
        &:hover {
          background-color: #d0d0d0;
          border: 0px;
        }
      `;
		}
	}}
`;

// Tile for minesweeper. Can display a number or a mine
const Tile = ({
	handleClick,
	isVisible,
	display,
}: {
	handleClick: (
		e: React.MouseEvent,
		rowIndex: number,
		columnIndex: number
	) => void;
	isVisible: boolean;
	display: string | number;
}) => {
	const displayValue = () => {
		if (display === 0) {
			return "";
		} else {
			return display;
		}
	};

	useMemo(() => {
		displayValue();
	}, [display]);

	return (
		<TileContainer
			className='tile'
			onClick={handleClick}
			isVisible={isVisible}
			onContextmenu={(e) => {
				e.preventDefault();
				console.log("Right click");
			}}
		>
			{isVisible ? displayValue() : ""}
		</TileContainer>
	);
};

export default Tile;
