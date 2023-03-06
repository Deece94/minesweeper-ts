import Tile from "../Tile";
import styled from "styled-components";
import { TileType } from "../../types";

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

const Board = ({
	grid,
	setGrid,
}: {
	grid: TileType[][];
	setGrid: (grid: TileType[][]) => void;
}) => {
	const handleClick = (
		e: React.MouseEvent,
		rowIndex: number,
		columnIndex: number
	) => {
		const newGrid = [...grid];

		// Check if right or left click
		if (e.button === 2) {
			// Right click
			newGrid[rowIndex][columnIndex].isFlagged =
				!newGrid[rowIndex][columnIndex].isFlagged;
		} else {
			// Left click
			// Check if flagged
			if (grid[rowIndex][columnIndex].isFlagged) {
				return;
			}
			// Change the tiles visible state
			const newGrid = [...grid];
			newGrid[rowIndex][columnIndex].isVisible = true;
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
							{...tile}
						/>
					))}
				</Row>
			))}
		</BoardContainer>
	);
};

export default Board;
