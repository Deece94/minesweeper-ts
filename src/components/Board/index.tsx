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

const StatusBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 50px;
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
			return;
		}

		// Check if no mines around before triggering surrounding tiles
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

	// Game is in win state if all non-mine tiles are visible
	const isInWinState = () => {
		// CHeck each tile and if a non-mine tile is not visible, return false
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[0].length; j++) {
				if (!grid[i][j].isMine && !grid[i][j].isVisible) {
					return false;
				}
			}
		}
		return true;
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

		// Check if win state
		if (isInWinState()) {
			setStatus("win");
		}

		setGrid(newGrid);
	};

	return (
		<BoardContainer className='board'>
			<StatusBar>
				{status === "playing" ? (
					<p>Time: </p>
				) : status === "gameover" ? (
					<p>Game over</p>
				) : (
					<p>You Win!!!</p>
				)}
			</StatusBar>
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
