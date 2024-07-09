import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { StatusType } from "../../types";

type StateContextType = {
	timer: number;
};

type ApiContextType = {
	resetTimer: () => void;
	stopTimer: () => void;
};

export const TimerStateContext = createContext<StateContextType>({ timer: 0 });
export const TimerApiContext = createContext<ApiContextType>({
	resetTimer: () => {},
	stopTimer: () => {},
});

const useTimer = (status: StatusType) => {
	const [startTime, setStartTime] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(0);

	useEffect(() => {
		let interval = 0;
		console.log("status", status);
		if (status === "playing") {
			interval = setInterval(() => {
				const d = new Date();
				setCurrentTime(d.getTime());
			}, 100);
		}

		return () => clearInterval(interval);
	}, [status]);

	const resetTimer = () => {
		const d = new Date();
		setStartTime(d.getTime());
	};

	const stopTimer = () => {
		const d = new Date();
		setCurrentTime(d.getTime());
	};

	const timer = useMemo(() => {
		if (status === "playing" || status === "win") {
			return Math.max(Math.floor((currentTime - startTime) / 1000), 0);
		} else {
			return 0;
		}
	}, [currentTime, startTime, status]);

	return { resetTimer, stopTimer, timer };
};

const TimerProvider = ({
	children,
	status,
}: {
	children: ReactNode;
	status: StatusType;
}) => {
	const { resetTimer, stopTimer, timer } = useTimer(status);

	return (
		<TimerStateContext.Provider value={{ timer }}>
			<TimerApiContext.Provider value={{ resetTimer, stopTimer }}>
				{children}
			</TimerApiContext.Provider>
		</TimerStateContext.Provider>
	);
};

export default TimerProvider;
