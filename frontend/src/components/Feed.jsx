import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'

import {client} from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if(categoryId) {
          const query = searchQuery(categoryId)
          const byCategory = await client.fetch(query);
          setPins(byCategory)
          setLoading(false)
        } else {
          const allPins = await client.fetch(feedQuery);
          setPins(allPins);
          setLoading(false)
        }
      } catch (error) {
        console.log("Error", error)
      }
    }
    fetchData();
  }, [categoryId])

  console.log(pins, 'PINS')

  if (loading) return <Spinner message="We are adding new memes to your feed!" />


  return (
    <div>{pins && <MasonryLayout pins={pins} />}</div>
  )
}

export default Feed