import { useId } from "react";
import styles from "../src/css/AnimatedChart.module.css";

export default function AnimatedChart({
  color = "#55C2AF",
  duration = "2s",
  delay = "1s",
  loop = true
}) {
  const id = useId().replace(/:/g, "");
  const gradientId = `chartFill-${id}`;
  const clipId = `chartClip-${id}`;

  return (
    <svg
      className={styles.chart}
      style={{
        "--draw-duration": duration,
        "--pause-duration": delay,
        "--total-duration": `calc(${duration} + ${delay})`,
        "--animation-count": loop ? "infinite" : "1",
      }}
      viewBox="0 0 350 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="4.63232"
          x2="0"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>

        <clipPath id={clipId}>
          <rect
            className={styles.clipRect}
            x="0"
            y="0"
            width="350"
            height="50"
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M0.688522 28.2351C0.688522 28.2351 8.65559 22.4115 21.639 22.4115C34.6223 22.4115 44.3795 27.2645 44.3795 27.2645C44.3795 27.2645 68.1037 33.088 78.4903 25.3233C88.877 17.5586 110.005 5.29389 129.322 5.29389C148.64 5.29389 177.085 21.9262 196.403 21.9262C215.721 21.9262 237.005 3.47036 256.185 3.47036C275.365 3.47036 284.768 11.3674 298.912 11.3674C313.056 11.3674 334.585 3.47021 344.5 3.47021V47.9996L0.688507 49L0.688522 28.2351Z"
          fill={`url(#${gradientId})`}
        />

        <path
          className={styles.line}
          d="M0.688507 30.2353C0.688507 30.2353 8.65557 24.4117 21.6389 24.4117C34.6223 24.4117 44.3795 29.2647 44.3795 29.2647C44.3795 29.2647 68.1036 35.0882 78.4903 27.3235C88.877 19.5588 110.004 7.29409 129.322 7.29409C148.64 7.29409 177.085 23.9264 196.403 23.9264C215.721 23.9264 237.005 5.47056 256.185 5.47056C275.365 5.47056 284.768 13.3676 298.912 13.3676C313.056 13.3676 329.62 4.63232 339.535 4.63232"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          className={styles.dot}
          d="M344.119 8.69647C346.946 8.69647 349.238 6.7497 349.238 4.34824C349.238 1.94677 346.946 0 344.119 0C341.292 0 339 1.94677 339 4.34824C339 6.7497 341.292 8.69647 344.119 8.69647Z"
          fill={color}
        />
      </g>
    </svg>
  );
}
