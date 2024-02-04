import { useState } from "react";
import styles from "./App.module.css";
import { useEffect } from "react";
import {
  Route,
  Routes,
  useParams,
  Link,
  Outlet,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { OneToDo } from "./components/OneToDo";

export const App = () => {
  const [mainPageHidden, setMainPageHidden] = useState(false); // Флаг
  const [toDos, setToDos] = useState([]);
  const [addToDo, setAddToDo] = useState("");
  const [refrestToDoListFlag, setRefrestToDoListFlag] = useState(false);
  const [toSort, setToSort] = useState([]);
  const [isSorted, setIsSorted] = useState(false); //Флаг
  const [toFind, setToFind] = useState([]);
  const [findToDo, setFindToDo] = useState([]);
  const [isFind, setIsFind] = useState(false); //Флаг
  const [getTitle, setGetTitle] = useState("");
  const [haveError, setHaveError] = useState(false); //Флаг
  const navigate = useNavigate();

  const MainPage = () => (
    <div className={styles.containerToDos}>
      <button
        hidden={!isFind}
        className={styles.cancelButton}
        onClick={() => {
          find();
        }}
        type="submit"
      >
        Отменить поиск
      </button>
      <Outlet />
      {!isSorted &&
        !isFind &&
        toDos.map(({ id, title }) => (
          <div className={styles.todo} key={id}>
            <Link to={`task/${id}`}>{title}</Link>
          </div>
        ))}
      {isSorted &&
        !isFind &&
        toSort.map(({ id, title }) => (
          <div className={styles.todo} key={id}>
            <Link to={`task/${id}`}>{title}</Link>
          </div>
        ))}
      {isFind &&
        toFind.map(({ id, title }) => (
          <div className={styles.todo} key={id}>
            <Link to={`task/${id}`}>{title}</Link>
          </div>
        ))}

      {setMainPageHidden(true)}
    </div>
  );

  const NotFound = () => <div className={styles.NotFound}></div>;

  const fetchToDo = (id) => {
    // получение задания по id
    fetch(`http://localhost:3005/posts/${id}`)
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        setGetTitle(response.title);
        setHaveError(false);
      })
      .catch((error) => {
        setGetTitle("Такого дела не существует");
        setHaveError(true);
      });
  };

  const TaskPage = () => {
    const params = useParams();
    fetchToDo(params.id);
    return (
      <div>
        <OneToDo
          id={params.id}
          title={getTitle}
          onClickDelete={onClickDelete}
          rerefrestToDoList={refreshToDoList}
          key={params.id}
          error={haveError}
          setMainPageHidden={setMainPageHidden}
        />
      </div>
    );
  };

  const refreshToDoList = () => {
    setRefrestToDoListFlag(!refrestToDoListFlag);
  };
  const refreshIsSorted = () => {
    // Изменить состояния флага для сортировки
    setIsSorted(!isSorted);
  };

  const refrestIsFind = () => {
    // Изменить состояния флага для поиска
    setIsFind(!isFind);
  };
  const onClickDelete = (id) => {
    requestDeleteToDo(id);
  };

  const requestDeleteToDo = (id) => {
    fetch(`http://localhost:3005/posts/${id}`, {
      method: "DELETE",
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log(response);
        navigate("/");
        refreshToDoList();
      });
  };

  useEffect(() => {
    fetch("http://localhost:3005/posts")
      .then((response) => response.json())
      .then((loadedToDos) => {
        console.log(loadedToDos);
        setToDos(loadedToDos);
      });
  }, [refrestToDoListFlag]);

  useEffect(() => {
    fetch("http://localhost:3005/posts") // Сортировка
      .then((response) => response.json())
      .then((loadedSortToDos) => {
        setToSort(
          loadedSortToDos.sort((x, y) => x.title.localeCompare(y.title))
        );
      });
  }, [refrestToDoListFlag]);

  const requestAddNewToDo = () => {
    fetch("http://localhost:3005/posts", {
      method: "POST",
      header: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        title: addToDo,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log(response);
        setAddToDo("");
        refreshToDoList();
      });
  };

  const onChange = ({ target }) => {
    setAddToDo(target.value);
  };

  const onChangeFind = ({ target }) => {
    setFindToDo(target.value);
  };

  const find = () => {
    refrestIsFind();
    const newFindArr = [];
    toDos.forEach((item) => {
      if (item.title.toLowerCase().includes(findToDo.toLowerCase())) {
        newFindArr.push(item);
      }
    });
    setToFind(newFindArr);
    setFindToDo("");
    refreshToDoList();
  };

  return (
    <div>
      <h1>
        <Link to="/">TODO LIST</Link>
        {mainPageHidden && (
          <div className={styles.inputField}>
            <input
              className={styles.input}
              type="text"
              name="inputAddToDo"
              value={addToDo}
              onChange={onChange}
            />
            <button
              className={styles.button}
              onClick={requestAddNewToDo}
              type="submit"
            >
              Добавить
            </button>
          </div>
        )}
      </h1>

      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="task/:id" element={<TaskPage />}></Route>
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      { mainPageHidden &&
        <button
          hidden={isFind}
          className={isSorted ? styles.sortButtonClicked : styles.sortButton}
          onClick={refreshIsSorted}
          type="submit"
        >
          Сортировать по алфавиту
        </button>
      }
      {mainPageHidden && (
        <div className={styles.inputField}>
          <input
            hidden={isFind}
            className={styles.input}
            type="text"
            name="inputAddToDo"
            value={findToDo}
            onChange={onChangeFind}
          />
          <button
            hidden={isFind}
            className={styles.findButton}
            onClick={() => {
              find();
            }}
            type="submit"
          >
            Поиск
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
