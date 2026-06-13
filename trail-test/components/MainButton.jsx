import styles from "../src/css/MainButton.module.css";

export default function MainButton({
  children,
  variant = "buttonPrimary",
  onClick,
  width = "10rem",
  height = "2.5rem",
}) {
  return (
    <button
      onClick={onClick}
      style={{ "--main-button-width": width, "--main-button-height": height }}
      className={`
        btn
        px-3
        ${styles.mainButton}
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  );
}
