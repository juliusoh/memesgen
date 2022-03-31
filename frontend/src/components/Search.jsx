import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  async function getSearchQuery() {
    const query = searchQuery(searchTerm.toLowerCase());
    await client.fetch(query).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }

  async function getFeed() {
    await client.fetch(feedQuery).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true);
      getSearchQuery()
    } else {
      getFeed()
    }
  }, [searchTerm]);

  console.log('searchPins', pins)
  return (
    <div>
      {loading && <Spinner message="Searching pins" />}
      {pins?.length && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;
