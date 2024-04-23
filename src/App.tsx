import { useState } from 'react';
import './App.scss';
import { SearchIcon } from './components/SearchIcon';
import axios from 'axios';

export interface Root {
  count: number;
  name: string;
  country: Country[];
}

export interface Country {
  country_id: string;
  probability: number;
}

function App() {
  const [result, setREsult] = useState<Root>({} as Root);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const searchInfoName = async () => {
    setLoading(true);
    try {
      const data = (await axios.get<Root>(`https://api.nationalize.io/?name=${search}`)).data;
      setREsult(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center">
      <h2 className="font-medium text-xl text-center mb-3">
        Предсказать национальность человека по его имени.{' '}
      </h2>
      <div className=" bg-gray-500 px-4 flex justify-between items-center w-80 rounded-md py-2">
        <input
          type="text"
          value={search}
          onKeyDown={e => e.key === 'Enter' && searchInfoName()}
          onChange={e => setSearch(e.target.value)}
          placeholder="Введите ваше имя"
        />
        <SearchIcon click={searchInfoName} />
      </div>
      <div className="flex flex-col items-center gap-3">
        {loading ? (
          <p>loading...</p>
        ) : result.country?.length ? (
          result.country.map(name => (
            <div className="mt-3   flex gap-2">
              <p>{name.country_id}</p>
              <p>{+name.probability.toFixed(2) * 100} %</p>
            </div>
          ))
        ) : (
          <p className=" text-red-500 mt-3">Ничего не найденно</p>
        )}
      </div>
      <h2 className="mt-3">Найденно {result.country?.length ? result.country.length : 0} имён</h2>
    </div>
  );
}

export default App;
