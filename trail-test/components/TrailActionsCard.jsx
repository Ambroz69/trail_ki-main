import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "../src/css/TrailActionsCard.module.css";

import trail_rating from "../src/assets/trail_rating.svg";
import trail_practice from "../src/assets/trail_practice.svg";
import trail_apply from "../src/assets/trail_apply.svg";
import arrowRightIcon from "../src/assets/trail_card_arrow_right.svg";

const TrailActionsCard = ({ basePath, trailId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      icon: trail_rating,
      title: t("rate"),
      text: t("review_trail_highlights"),
      onClick: () => {
        document.getElementById("ratings")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
    },
    {
      icon: trail_practice,
      title: t("practice"),
      text: t("practice_text"),
      onClick: () => navigate(`${basePath}/practice`),
    },
    {
      icon: trail_apply,
      title: t("start_trail"),
      text: t("apply_text"),
      onClick: () => navigate(`${basePath}/trails/certification/${trailId}`),
    },
  ];

  return (
    <div className={`${styles.card} shadow d-flex flex-column flex-lg-row mb-3`}>
      {actions.map((action, index) => (
        <button
          key={action.title}
          type="button"
          onClick={action.onClick}
          className={`
            ${styles.actionItem}
            d-flex
            align-items-center
            justify-content-center
            flex-fill
            border-0
            bg-transparent
            py-4
            ${index !== actions.length - 1 ? styles.hasDivider : ""}
          `}
        >
          <div className={`${styles.actionInner} d-flex align-items-center`}>
            <span
              className={`
                ${styles.iconBox}
                d-flex
                align-items-center
                justify-content-center
                flex-shrink-0
              `}
            >
              <img src={action.icon} alt="" />
            </span>

            <div className="ms-4 text-start">
              <strong className={`${styles.title} d-block text-uppercase`}>
                {action.title}
              </strong>

              <small className={`${styles.text} d-block`}>{action.text}</small>
            </div>

            <img
              src={arrowRightIcon}
              alt=""
              className={`${styles.arrow} flex-shrink-0`}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export default TrailActionsCard;
