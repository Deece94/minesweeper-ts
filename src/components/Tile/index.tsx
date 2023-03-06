import { useMemo, useState } from "react";
import styled from "styled-components";
import { TileType } from "../../types";

const TileContainer = styled.button<{ isVisible: Boolean }>`
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

type TileProps = {
	handleClick: (
		e: React.MouseEvent,
		rowIndex: number,
		columnIndex: number
	) => void;
	rowIndex: number;
	columnIndex: number;
	status: string;
} & TileType;

// Tile for minesweeper. Can display a number or a mine
const Tile = ({
	handleClick,
	rowIndex,
	columnIndex,
	status,
	...tileProps
}: TileProps) => {
	const displayVisible = () => {
		if (tileProps.isMine && tileProps.isVisible) {
			return "💥";
		} else if (tileProps.minesAround === 0) {
			return "";
		} else {
			return tileProps.minesAround;
		}
	};

	const displayNotVisible = () => {
		if (status === "gameover" && tileProps.isMine) {
			return "💣";
		} else if (tileProps.isFlagged) {
			return "🚩";
		} else {
			return "";
		}
	};

	return (
		<TileContainer
			className='tile'
			onClick={(e: React.MouseEvent) => handleClick(e, rowIndex, columnIndex)}
			isVisible={tileProps.isVisible}
			onContextMenu={(e: React.MouseEvent) => {
				e.preventDefault();
				handleClick(e, rowIndex, columnIndex);
			}}
		>
			{tileProps.isVisible ? displayVisible() : displayNotVisible()}
		</TileContainer>
	);
};

export default Tile;
