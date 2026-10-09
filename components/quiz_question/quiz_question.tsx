import styles from "./cn.module.css";

type Props = {
  question: string;
  options: string[];
  answer: number;
  selected: number | null;
  onSelect: (index: number) => void;
};

export default function QuizQuestion({ question, options, answer, selected, onSelect }: Props) {
  const answered = selected !== null;

  return (
    <>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.choices} role="group" aria-label="Ð’Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ñ‹ Ð¾Ñ‚Ð²ÐµÑ‚Ð°">
        {options.map((option, index) => {
          const correct = answered && index === answer;
          const wrong = selected === index && index !== answer;
          const dim = answered && !correct && !wrong;
          const class_name = [styles.choice, correct && styles.correct, wrong && styles.wrong, dim && styles.dim]
            .filter(Boolean)
            .join(" ");

          return (
            <button key={option} type="button" className={class_name} onClick={() => onSelect(index)} disabled={answered}>
              <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
              <span className={styles.text}>{option}</span>
              <span className={styles.mark} aria-hidden>
                {correct ? "\u2713" : wrong ? "\u00D7" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

