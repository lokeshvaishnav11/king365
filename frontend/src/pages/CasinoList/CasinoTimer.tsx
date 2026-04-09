import { useEffect, useState } from "react";
const CasinoTimer = (props: any) => {
    const { lastOdds } = props
    const [counter, setCounter] = useState<number>(0)
    // if (lastOdds && lastOdds.autotime && lastOdds.autotime > 1 && counter == 0) {
    //     setCounter(lastOdds.autotime);
    // }



    useEffect(() => {
        /// counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        if (lastOdds?.slug != 'Tp1Day' && (lastOdds.autotime != '' || lastOdds.lt != '')) {
            setCounter(parseInt(lastOdds.autotime || lastOdds.lt));
        }
    }, [lastOdds.autotime, lastOdds.lt]);
    useEffect(() => {
        /// counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        if (lastOdds?.slug == 'Tp1Day') {
            const timernew = lastOdds?.event_data?.market?.[0]?.Runners?.[0]?.gstatus != 'SUSPENDED' ? lastOdds?.event_data?.market?.[0]?.Runners?.[0]?.lasttime : lastOdds?.event_data?.market?.[0]?.Runners?.[1]?.lasttime
            if (timernew) {
                setCounter(parseInt(timernew));
            }
        }
    }, [lastOdds?.event_data?.market?.[0]?.Runners]);

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const progress = (counter / 20) * circumference; // adjust 100 based on max time
    const strokeColor = counter <= 5 ? "red" : "green";

    return <div className="clock clock2digit flip-clock-wrapper" style={{ right: "-32px", top: "-78px" }}>
        <ul className="flip play d-none">
            <li className="flip-clock-before">
                <a href="#">
                    <div className="up">
                        <div className="shadow"></div>
                        <div className="inn">1</div>
                    </div>
                    <div className="down">
                        <div className="shadow"></div>
                        <div className="inn">1</div>
                    </div>
                </a>
            </li>
            <li className="flip-clock-active">
                <a href="#">
                    <div className="up">
                        <div className="shadow"></div>
                        <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(0, 1) : 0}</div>
                    </div>
                    <div className="down">
                        <div className="shadow"></div>
                        <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(0, 1) : 0}</div>
                    </div>
                </a>
            </li>
        </ul>
        <ul className="flip play d-none">
            <li className="flip-clock-before">
                <a href="#">
                    <div className="up">
                        <div className="shadow"></div>
                        <div className="inn">8</div>
                    </div>
                    <div className="down">
                        <div className="shadow"></div>
                        <div className="inn">8</div>
                    </div>
                </a>
            </li>
            <li className="flip-clock-active">
                <a href="#">
                    <div className="up">
                        <div className="shadow"></div>
                        <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(1, 2) : counter.toString().substring(0, 1)}</div>
                    </div>
                    <div className="down">
                        <div className="shadow"></div>
                        <div className="inn">{counter.toString().length > 1 ? counter.toString().substring(1, 2) : counter.toString().substring(0, 1)}</div>
                    </div>
                </a>
            </li>
        </ul>
        {counter && <div style={{ position: "relative", width: 100, height: 100 }}>

            <svg width="100" height="100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#333"
                    strokeWidth="8"
                    fill="none"
                />

                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{
                        transition: "stroke-dashoffset 1s linear, stroke 0.5s"
                    }}
                />
            </svg>

            {/* Center Timer */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff",
                    fontSize: "35px",
                    fontWeight: "bold"
                }}
            >
                {counter}
            </div>

        </div>}
    </div>


}
export default CasinoTimer;