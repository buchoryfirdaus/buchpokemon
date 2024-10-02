import { useEffect, useState, useCallback } from "react";

function Pokemon() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [prevUrl, setPrevUrl] = useState([]);
  const [nextUrl, setNextUrl] = useState([]);
  const [apiUrl, setApiUrl] = useState("https://pokeapi.co/api/v2/pokemon");

  const getAllPokemon = useCallback(async () => {
    setLoading(true);
    const restData = await fetch(apiUrl);
    const data = await restData.json();

    setPrevUrl(data.previous || "");
    setNextUrl(data.next || "");

    const pokemonDetails = await Promise.all(
      data.results.map(async (item) => {
        const restDataDetail = await fetch(item.url);
        const dataDetail = await restDataDetail.json();
        return dataDetail;
      })
    );

    setPokemonList(pokemonDetails);
    setLoading(false);
  }, [apiUrl]);

  useEffect(() => {
    getAllPokemon();
  }, [apiUrl, getAllPokemon]);

  function pokemonDetail() {
    return (
      <div className="detail" onClick={() => setDetail(false)}>
        <div className="item">
          <a>x</a>
          <div className="image">
            <img src={dataDetail.sprites.other.dream_world.front_default} />
          </div>
          <div className="title">{dataDetail.name}</div>
          <div className="abilities">
            {dataDetail.abilities.map((item, index) => {
              return <span key={index}>{item.ability.name}</span>;
            })}
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getAllPokemon();
  }, [apiUrl, getAllPokemon]);

  return (
    <div className="wrapper">
      <div className="content">
        {loading && <div className="loading">Halaman sedang dimuat . . .</div>}
        {detail && pokemonDetail()}
        <div className="grid">
          {pokemonList.map((item, index) => {
            return (
              <div
                key={index}
                className="item"
                onClick={() => {
                  setDetail(true);
                  setDataDetail(item);
                }}
              >
                <div className="img">
                  <img
                    src={item.sprites.front_default}
                    style={{ display: "block", margin: "auto" }}
                  ></img>
                </div>
                <div className="title">{item.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {prevUrl && (
        <div className="pagination-left">
          <button
            onClick={() => {
              setApiUrl(prevUrl);
            }}
          >
            &laquo;
          </button>
        </div>
      )}
      {nextUrl && (
        <div className="pagination-right">
          <button
            onClick={() => {
              setApiUrl(nextUrl);
            }}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default Pokemon;
