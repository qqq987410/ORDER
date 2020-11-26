import styles from "./App.module.css";
function App(props) {
  console.log(props.firebase);
  return (
    <div className={styles.App}>
      <h1 className={styles.h1}>What!!!</h1>
    </div>
  );
}

export default App;
