import Tile from "../Tile";
import styled from "styled-components";
import { TileType } from "../../types";
import { useState } from "react";

const BoardContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
`;

const statuses = {
	playing: "playing",
	gameover: "gameover",
	win: "win",
};

const Board = ({
	grid,
	setGrid,
	status,
	setStatus,
}: {
	grid: TileType[][];
	setGrid: (grid: TileType[][]) => void;
	status: string;
	setStatus: (status: string) => void;
}) => {
	const triggerTile = (rowIndex: number, columnIndex: number) => {
		// Check if out of bounds
		if (rowIndex < 0 || rowIndex >= grid.length) {
			return;
		}
		if (columnIndex < 0 || columnIndex >= grid[0].length) {
			return;
		}

		// if aready visible, return
		if (grid[rowIndex][columnIndex].isVisible) {
			return;
		}

		// Left click
		// Check if flagged
		if (grid[rowIndex][columnIndex].isFlagged) {
			return;
		}
		// Change the tiles visible state
		const newGrid = [...grid];
		newGrid[rowIndex][columnIndex].isVisible = true;

		// Check if mine
		if (newGrid[rowIndex][columnIndex].isMine) {
			// Game over
			setStatus("gameover");
			alert("Game over");
			return;
		}

		// Check if no mines around
		if (newGrid[rowIndex][columnIndex].minesAround === 0) {
			// trigger all surrounding tiles
			triggerTile(rowIndex - 1, columnIndex - 1);
			triggerTile(rowIndex - 1, columnIndex);
			triggerTile(rowIndex - 1, columnIndex + 1);
			triggerTile(rowIndex, columnIndex - 1);
			triggerTile(rowIndex, columnIndex + 1);
			triggerTile(rowIndex + 1, columnIndex - 1);
			triggerTile(rowIndex + 1, columnIndex);
			triggerTile(rowIndex + 1, columnIndex + 1);
		}
	};

	const handleClick = (
		e: React.MouseEvent,
		rowIndex: number,
		columnIndex: number
	) => {
		if (status === "gameover") {
			return;
		}

		const newGrid = [...grid];

		// Check if right or left click
		if (e.button === 2) {
			// Right click
			newGrid[rowIndex][columnIndex].isFlagged =
				!newGrid[rowIndex][columnIndex].isFlagged;
		} else {
			triggerTile(rowIndex, columnIndex);
		}

		setGrid(newGrid);
	};

	return (
		<BoardContainer className='board'>
			{grid.map((row, rowIndex) => (
				<Row className='row' key={rowIndex}>
					{row.map((tile, columnIndex) => (
						<Tile
							key={columnIndex}
							handleClick={handleClick}
							rowIndex={rowIndex}
							columnIndex={columnIndex}
							status={status}
							{...tile}
						/>
					))}
				</Row>
			))}
		</BoardContainer>
	);
};

export default Board;
