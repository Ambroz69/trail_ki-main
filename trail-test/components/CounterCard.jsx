import styles from "../src/css/CounterCard.module.css";
import AnimatedChart from "./AnimatedChart";

export default function CounterCard({
  icon,
  counter,
  color = "#55C2AF",
  children,
}) {
  return (
    <div
      className={`card border-0 shadow flex-fill w-100 text-center p-2 ${styles.counterCard}`}
      style={{ "--counter-card-color": color }}
    >
      <div className="card-body d-flex flex-column align-items-center p-0 p-lg-3">
        <div className={`${styles.iconCircle} mb-3`}>
          <img src={icon} alt="" className={styles.icon} />
        </div>

        <h3 className={`${styles.label} mb-2`}>
          {children}
        </h3>

        <p className={`${styles.counter} mb-0 mb-lg-5`}>
          {counter}
        </p>

        <div className={`${styles.chartWrapper} d-none d-lg-flex`}>
          <AnimatedChart color={color} duration="4s" delay="0s" loop={false}/>
        </div>
      </div>
    </div>
  );
}