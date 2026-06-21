import styles from "../src/css/MainButton.module.css";

export default function MainButton({
  children,
  variant = "buttonPrimary",
  onClick,
  width = "10rem",
  height = "2.5rem",
  fontSizeDesktop = "0.9rem",
  fontSizeMobile = "0.75rem"
}) {
  return (
    <button
      onClick={onClick}
      style={{ "--main-button-width": width, "--main-button-height": height, "--main-button-font-size-desktop": fontSizeDesktop, "--main-button-font-size-mobile": fontSizeMobile }}
      className={`
        btn
        px-lg-3
        px-2
        ${styles.mainButton}
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  );
}
