import styles from "./cn.module.css";

export default function InviteSummary({ plan }: {
  plan: { activities: string[]; date: string; time: string; place: string };
}) {
  return (
    <div className={styles.card}>
      <div className={styles.heading}>
        <span aria-hidden="true">💌</span>
        <div><strong>Наше свидание</strong><small>План готов — осталось дождаться дня</small></div>
      </div>
      <div className={styles.row}>
        <span className={styles.icon} aria-hidden="true">✨</span>
        <div><small>ЧЕМ ЗАЙМЁМСЯ</small><div className={styles.tags}>{plan.activities.map((activity) => <span key={activity}>{activity}</span>)}</div></div>
      </div>
      <div className={styles.row}>
        <span className={styles.icon} aria-hidden="true">📅</span>
        <div><small>КОГДА</small><strong>{plan.date}{plan.time ? ` · ${plan.time}` : ""}</strong></div>
      </div>
      <div className={styles.row}>
        <span className={styles.icon} aria-hidden="true">📍</span>
        <div><small>КУДА</small><strong>{plan.place}</strong></div>
      </div>
    </div>
  );
}
