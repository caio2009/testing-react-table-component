import { useEffect, useMemo, useState } from 'react';

import styles from './App.module.css';

// import Empty from './components/ui/Empty';
import Spinner from './components/ui/Spinner';

type Anime = {
  id: number;
  name: string;
  episodes: number;
};

const animeFixtures: Anime[] = [
  { id: 1, name: 'Naruto', episodes: 750 },
  { id: 2, name: 'Dragon Ball Z', episodes: 300 },
  { id: 3, name: 'Bleach', episodes: 700 },
  { id: 4, name: 'One Piece', episodes: 1000 },
  { id: 5, name: 'Fairy Tail', episodes: 350 },
  { id: 6, name: 'Naruto', episodes: 750 },
  { id: 7, name: 'Dragon Ball Z', episodes: 300 },
  { id: 8, name: 'Bleach', episodes: 700 },
  { id: 9, name: 'One Piece', episodes: 1000 },
  { id: 10, name: 'Fairy Tail', episodes: 350 },
  { id: 11, name: 'Naruto', episodes: 750 },
  { id: 12, name: 'Dragon Ball Z', episodes: 300 },
  { id: 13, name: 'Bleach', episodes: 700 },
  { id: 14, name: 'One Piece', episodes: 1000 },
  { id: 15, name: 'Fairy Tail', episodes: 350 },
  { id: 16, name: 'Naruto', episodes: 750 },
  { id: 17, name: 'Dragon Ball Z', episodes: 300 },
  { id: 18, name: 'Bleach', episodes: 700 },
  { id: 19, name: 'One Piece', episodes: 1000 },
  { id: 20, name: 'Fairy Tail', episodes: 350 },
  { id: 21, name: 'Naruto', episodes: 750 },
  { id: 22, name: 'Dragon Ball Z', episodes: 300 },
  { id: 23, name: 'Bleach', episodes: 700 },
  { id: 24, name: 'One Piece', episodes: 1000 },
  { id: 25, name: 'Fairy Tail', episodes: 350 },
  { id: 26, name: 'Naruto', episodes: 750 },
  { id: 27, name: 'Dragon Ball Z', episodes: 300 },
  { id: 28, name: 'Bleach', episodes: 700 },
  { id: 29, name: 'One Piece', episodes: 1000 },
  { id: 30, name: 'Fairy Tail', episodes: 350 }
];

// --------------------------------------------------------------------------------

type TableProps<T> = {
  data: T[];
  renderHeader: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
};

const Table = <T extends unknown>(props: TableProps<T>) => {
  const {
    data,
    renderHeader,
    renderRow
  } = props;

  // --------------------------------------------------------------------------------
  // States
  // --------------------------------------------------------------------------------

  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null);

  // --------------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------------

  useEffect(() => setHeaderContent(renderHeader()), [renderHeader]);

  // --------------------------------------------------------------------------------
  // Memorised values
  // --------------------------------------------------------------------------------

  const headerLength = useMemo(() => {
    const element = headerContent as React.ReactElement;

    if (!element) return 0;

    let childElementCount = 0;

    const countChildrenFromParent = (parent: React.ReactElement) => {
      parent.props.children.forEach((child: React.ReactElement) => {
        if (child.type.toString() === 'Symbol(react.fragment)') countChildrenFromParent(child);
        else childElementCount++;
      });
    };
    countChildrenFromParent(element);

    return childElementCount;
  }, [headerContent]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>{headerContent}</tr>
      </thead>

      <tbody>
        {!data.length && (
          <tr>
            <td colSpan={headerLength}>
              <center>Empty...</center>
            </td>
          </tr>
        )}

        {data.map((item, i) => (
          <tr key={i}>{renderRow(item, i)}</tr>
        ))}
      </tbody>
    </table>
  );
};

// --------------------------------------------------------------------------------

// When using the HOC withCheckbox, the generic type must have the id
// attribute to identify the checked values.
type BaseModel = {
  id: number | string;
};

type WithCheckboxProps = {
  onChecked?: (checkedValues: Map<number | string, boolean>) => void;
};

const withCheckbox = (WrappedComponent: React.FC<TableProps<any>>) => {
  const WithCheckbox = <T extends BaseModel>(props: TableProps<T> & WithCheckboxProps) => {
    const {
      data,
      renderHeader,
      renderRow,
      onChecked
    } = props;

    // --------------------------------------------------------------------------------
    // States
    // --------------------------------------------------------------------------------

    const [checkedValues, setCheckedValues] = useState<Map<number | string, boolean>>(
      new Map(data.map((value) => [value.id, false]))
    );

    // --------------------------------------------------------------------------------
    // Effects
    // --------------------------------------------------------------------------------

    useEffect(() => {
      if (onChecked) onChecked(checkedValues);
    }, [checkedValues, onChecked]);

    // --------------------------------------------------------------------------------
    // Memorised values
    // --------------------------------------------------------------------------------

    const isSomeChecked = useMemo(
      () => Array.from(checkedValues, value => value[1]).some(value => !!value),
      [checkedValues]
    );

    // --------------------------------------------------------------------------------
    // Functions
    // --------------------------------------------------------------------------------

    // Header checkbox behavior
    const toggleAllCheckValues = () => {
      const newCheckedValues = new Map(checkedValues);

      if (isSomeChecked) {
        newCheckedValues.forEach((_, key) => newCheckedValues.set(key, false));
      } else {
        newCheckedValues.forEach((_, key) => newCheckedValues.set(key, true));
      }

      setCheckedValues(newCheckedValues);
    };

    // Row checkbox behavior
    const toggleSpecificCheckValue = (value: boolean, id: number | string) => {
      const newCheckedValues = new Map(checkedValues);
      newCheckedValues.set(id, value);
      setCheckedValues(newCheckedValues);
    };

    // --------------------------------------------------------------------------------
    // Render functions
    // --------------------------------------------------------------------------------

    const enhancedRenderHeader = () => (
      <>
        <th align="left">
          <input
            type="checkbox"
            checked={isSomeChecked || false}
            onChange={() => toggleAllCheckValues()}
          />
        </th>
        {renderHeader()}
      </>
    );

    const enhancedRenderRow = (item: T, index: number) => (
      <>
        <td>
          <input
            type="checkbox"
            checked={checkedValues.get(item.id) || false}
            onChange={(e) => toggleSpecificCheckValue(e.target.checked, item.id)}
          />
        </td>
        {renderRow(item, index)}
      </>
    );

    return (
      <WrappedComponent
        data={data}
        renderHeader={enhancedRenderHeader}
        renderRow={enhancedRenderRow}
      />
    );
  };

  return WithCheckbox;
};

const TableWithCheckbox = withCheckbox(Table);

// --------------------------------------------------------------------------------

type AnimeTableProps = {
  data: Anime[];
};

const AnimeTable = (props: AnimeTableProps) => {
  const { data: animes } = props;

  return (
    <TableWithCheckbox
      data={animes}
      renderHeader={() => (
        <>
          <th>#</th>
          <th>Name</th>
          <th>Episodes</th>
        </>
      )}
      renderRow={item => (
        <>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.episodes}</td>
        </>
      )}
    />
  );
};

// --------------------------------------------------------------------------------

const App = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetching animes
  const fetchTime = 3000;
  useEffect(
    () => {
      let timeout: NodeJS.Timeout;

      timeout = setTimeout(() => {
        // const randomNumber = Math.floor(Math.random() * 3);
        const randomNumber = (() => 1)();

        try {
          switch (randomNumber) {
            case 0:
              setAnimes([]);
              break;
            case 1:
              setAnimes(animeFixtures);
              break;
            case 2:
              throw new Error('An error occurred while fetching data.');
          }
        } catch (error: any) {
          console.log(error.message);
        }

        setIsLoading(false);
      }, fetchTime);

      return () => {
        clearTimeout(timeout);
      }
    },
    []
  );

  return (
    <div>
      {isLoading ? <Spinner /> : <AnimeTable data={animes} />}
    </div>
  );
};

export default App;
